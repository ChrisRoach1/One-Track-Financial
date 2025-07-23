<?php

namespace App\Http\Controllers;

use App\Models\AccessToken;
use App\Models\LinkedAccount;
use App\Models\Transaction;
use App\Services\LinkedAccountService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;
use Inertia\Response;

class LinkedAccountController extends Controller
{
    /**
     * Create a new linked account.
     */
    public function store(Request $request, LinkedAccountService $service)
    {
        $response = Http::post('https://sandbox.plaid.com/item/public_token/exchange',[
            'client_id' => env("PLAID_CLIENT_ID"),
            'secret' => env("PLAID_CLIENT_SECRET"),
            'public_token'=> $request['token']
        ]);

        $accessToken = $response->json()['access_token'];

        foreach ($request['accounts'] as $account) {
            $service->storeOrUpdate($account, $accessToken);
        }

        return redirect()->route('linkedAccount.edit');
    }

    /**
     * Show linked account page.
     */
    public function edit(Request $request) : Response
    {
        $linkedAccounts = Auth::user()->linkedAccounts()->get();

        $response = Http::post('https://sandbox.plaid.com/link/token/create',[
            'client_id' => env("PLAID_CLIENT_ID"),
            'secret' => env("PLAID_CLIENT_SECRET"),
            'user' => ['client_user_id'=>strval(Auth::user()->id), 'phone_number'=> Auth::user()->phone_number],
            'client_name' => 'Personal Finance App',
            'products'=> ['transactions'],
            'transactions' => ['days_requested'=> 30],
            'country_codes' => ['US'],
            'language' => 'en',
            'account_filters'=>['credit' => ['account_subtypes'=> ['credit card']]]
        ]);
        return Inertia::render('settings/linkedAccounts',[
            'linkedAccounts' => $linkedAccounts,
            'linkToken' => $response['link_token']
        ]);
    }

    /**
     * delete a linked account.
     */
    public function destroy(int $id, LinkedAccountService $service)
    {
        $service->delete($id);
        return redirect()->route('linkedAccount.edit');
    }

}
