<?php

namespace App\Services;

use App\Models\Category;
use App\Models\LinkedAccount;
use App\Models\Transaction;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use OpenAI\Laravel\Facades\OpenAI;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Illuminate\Support\Facades\Http;

class TransactionService
{
    public function __construct()
    {
    }

    public function store($validatedTransaction){

        return Transaction::create([
            'user_id' => Auth::id(),
            'amount' => $validatedTransaction['amount'],
            'currency' => 'USD',
            'date' => Carbon::parse($validatedTransaction['date']),
            'merchant_name' => $validatedTransaction['merchant'],
            'pending' => false,
            'logo_url' => null,
            'category_id' => $validatedTransaction['category_id'],
            'linked_account_id' => $validatedTransaction['linked_account_id'],
            'transaction_id' => 'N/A'
        ]);
    }

    public function setCategory($transactionId, $categoryId){
        Transaction::where('id', $transactionId)->update(['category_id' => $categoryId]);
    }

    public function categorizeWithAI(){
        $categories = Category::query()->where('categories.user_id', null)->orWhere('categories.user_id', Auth::id())->get();
        $categoryString = implode(',', $categories->pluck('name')->toArray());
        $uncategorizedTransactions = Auth::user()->transactions()->where('category_id', null)->get();

        foreach ($uncategorizedTransactions as $transaction) {
            $message = "I have a transaction for " . $transaction->amount . " " . $transaction->currency . " from " . $transaction->date . " to " . $transaction->merchant_name . ".";
            $message .= " I have the following categories: " . $categoryString . ". Which one best describes this transaction? Only respond with your choice in the exact same way it was presented to you. Nothing else.";
            $result = OpenAI::chat()->create([
                'model' => 'gpt-4o-mini',
                'messages' => [
                    ['role' => 'user', 'content' => $message],
                ],
            ]);

            $categoryChoice = $result->choices[0]->message->content;

            $categoryId = $categories->where('name', $categoryChoice)->first()->id;
            if($categoryId != null){
                Transaction::where('id', $transaction->id)->update(['category_id' => $categoryId]);
            }
        }
    }

    public function sync(): Void{
        $linkedAccounts = LinkedAccount::where('user_id', Auth::id())->get();
        foreach($linkedAccounts as $account){

            $transactions = Http::post('https://sandbox.plaid.com/transactions/sync',[
                'client_id' => env("PLAID_CLIENT_ID"),
                'secret' => env("PLAID_CLIENT_SECRET"),
                'access_token'=> $account->access_token,
                'cursor' =>  $account->next_cursor
            ]);

            if($transactions->badRequest()){
                Throw new HttpException(500);
            }
            foreach ($transactions['added'] as $transaction) {
                Transaction::create([
                    'user_id' => Auth::id(),
                    'linked_account_id' => $account->id,
                    'amount' => $transaction['amount'],
                    'currency' => $transaction['iso_currency_code'],
                    'date' => $transaction['authorized_date'] ?? $transaction['date'],
                    'merchant_name' => $transaction['name'],
                    'pending' => $transaction['pending'],
                    'logo_url' => $transaction['logo_url'],
                    'transaction_id' => $transaction['transaction_id']
                ]);
            }

            $account->next_cursor = $transactions['next_cursor'];

            $account->save();
        }
    }
}
