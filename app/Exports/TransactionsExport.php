<?php

namespace App\Exports;

use App\Models\Transaction;
use Carbon\Carbon;
use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\FromQuery;

class TransactionsExport implements FromQuery
{
    use Exportable;

    private Carbon $startDate;
    private Carbon $endDate;
    public function __construct(Carbon $startDate, Carbon $endDate)
    {
        $this->startDate = $startDate;
        $this->endDate = $endDate;
    }

    public function query()
    {
        return auth()->user()->transactions()
            ->join('linked_accounts', 'transactions.linked_account_id', '=', 'linked_accounts.id')
            ->join('categories', 'transactions.category_id', '=', 'categories.id')
            ->whereNot('category_id', null)
            ->whereBetween('date', [
                $this->startDate->format('Y-m-d'),
                $this->endDate->format('Y-m-d')
            ])
            ->select(
                'transactions.date',
                'transactions.amount',
                'transactions.merchant_name',
                'linked_accounts.institution_name',
                'linked_accounts.account_name',
                'linked_accounts.account_mask',
                'categories.name as category_name'
            );

    }
}
