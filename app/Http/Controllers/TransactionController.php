<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\LinkedAccount;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use OpenAI\Laravel\Facades\OpenAI;

class TransactionController extends Controller
{
    /**
     * sync transactions for each linked account.
     */
    public function store(Request $request)
    {

        $linkedAccounts = LinkedAccount::where('user_id', Auth::id())->get();

        foreach($linkedAccounts as $account){
            $transactions = Http::post('https://sandbox.plaid.com/transactions/sync',[
                'client_id' => env("PLAID_CLIENT_ID"),
                'secret' => env("PLAID_CLIENT_SECRET"),
                'access_token'=> $account->access_token,
                'cursor' =>  $account->next_cursor
            ]);

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

        return redirect()->route('dashboard');

    }

    /**
     * update transactions to set category.
     */
    public function update(Request $request){

        $updatedTransactions = $request['updatedTransactions'];

        foreach($updatedTransactions as $updatedTransaction) {
            Transaction::find($updatedTransaction["id"])->update(['category_id' => $updatedTransaction['category_id']]);
        }

        return redirect()->route('dashboard');
    }

    public function categorizeWithAI(Request $request){
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
}
