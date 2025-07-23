<?php

namespace App\Services;

use App\Models\LinkedAccount;
use App\Models\Transaction;
use Illuminate\Support\Facades\Auth;

class LinkedAccountService
{
    public function __construct()
    {
    }

    public function storeOrUpdate($account, $accessToken){
        $existingRecord = LinkedAccount::where(['user_id' => auth()->id(), 'account_name' => $account['name'], 'account_mask' => $account['mask'], 'institution_name' => $request['institution_name']])->first();

        if($existingRecord) {
            LinkedAccount::find($existingRecord->id)->update(['access_token' => $accessToken]);
        }else{
            LinkedAccount::create([
                'access_token' => $accessToken,
                'institution_name' => $request['institution_name'],
                'account_name' => $account['name'],
                'account_mask' => $account['mask'],
                'user_id' => Auth::id()
            ]);
        }
    }
    public function delete($id){
        $linkedAccount = Auth::user()->linkedAccounts()->where('id',$id)->delete();
        Transaction::where('linked_account_id',$id)->delete();
    }
}
