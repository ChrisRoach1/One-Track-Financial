<?php

namespace App\Http\Controllers;

use App\Exports\TransactionsExport;
use App\Services\TransactionService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Exception\HttpException;

class TransactionController extends Controller
{

    /**
     * store manually entered transaction.
     */
    public function store(Request $request, TransactionService $service)
    {
        $validated = $request->validate([
            'merchant' => ['required', 'string', 'max:255'],
            'amount' => ['required', 'numeric', 'min:0.01'],
            'date' => ['required', 'date'],
            'category_id' => ['required', 'integer', 'exists:categories,id'],
            'linked_account_id' => ['required', 'integer', 'exists:linked_accounts,id']
        ]);

        $service->store($validated);

        return redirect()->route('dashboard');
    }

    /**
     * sync transactions for each linked account.
     */
    public function sync(Request $request, TransactionService $service)
    {
        try{
            $service->sync();
            return redirect()->route('dashboard');
        }catch (HttpException $ex) {
            //error occurred from plaid and needs revalidated
            return redirect()->route('dashboard')->with('error', 'Error occurred please reauthenticate accounts and try again.');
        }
    }

    /**
     * update transactions to set category.
     */
    public function update(Request $request, TransactionService $service)
    {
        $updatedTransactions = $request['updatedTransactions'];

        foreach($updatedTransactions as $updatedTransaction) {
            $service->setCategory($updatedTransaction['id'], $updatedTransaction['category_id']);
        }

        return redirect()->route('dashboard');
    }

    public function categorizeWithAI(Request $request, TransactionService $service)
    {
        $service->categorizeWithAI();
    }

    public function downloadExcel(Request $request)
    {
        $month = $request->input('month', Carbon::now()->month - 1);
        $year = $request->input('year', Carbon::now()->year);
        $startDate = Carbon::create($year, $month + 1, 1)->startOfMonth();
        $endDate = Carbon::create($year, $month + 1, 1)->endOfMonth();
        return (new TransactionsExport($startDate, $endDate))->download('transactions.xlsx');
    }
}
