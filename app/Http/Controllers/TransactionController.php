<?php

namespace App\Http\Controllers;

use App\Models\LinkedAccount;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;

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
}
