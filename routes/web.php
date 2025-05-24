<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\TransactionController;
use App\Models\Category;
use Carbon\Carbon;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;


Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');


Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function (Request $request) {
        $month = $request->input('month', Carbon::now()->month - 1);
        $year = $request->input('year', Carbon::now()->year);

        $startDate = Carbon::create($year, $month + 1, 1)->startOfMonth();
        $endDate = Carbon::create($year, $month + 1, 1)->endOfMonth();

        $uncategorizedTransactions = auth()->user()->transactions()->with('linkedAccount')->where('category_id', null)->get();
        $categories = Category::query()->where('categories.user_id', auth()->id())->orWhere('categories.user_id', null)->get();
        $categorizedTransactions = auth()->user()->transactions()->with('linkedAccount')->with('category')->whereNot('category_id', null)
            ->whereBetween('date', [
                $startDate->format('Y-m-d'),
                $endDate->format('Y-m-d')
            ])
            ->get();
        $hasLinkedAccounts = auth()->user()->linkedAccounts()->count() > 0;

        $categoryWithAmount = auth()->user()->transactions()->join('categories', 'categories.id',  '=', 'transactions.category_id')->whereNot('category_id', null)
            ->select('categories.name as category', DB::raw('sum(amount) as amount'))
            ->whereBetween('date', [
                $startDate->format('Y-m-d'),
                $endDate->format('Y-m-d')
            ])
            ->groupBy('category_id')->get();

        foreach ($categoryWithAmount as $category){
            $category->amount = currency_format((float)$category->amount);
        }

        $todayCost = $categorizedTransactions->whereBetween('date',[
            Carbon::now()->startOfDay()->format('Y-m-d'),
            Carbon::now()->endOfDay()->format('Y-m-d')
        ])->sum('amount');

        $weekCost = $categorizedTransactions->whereBetween('date',[
            Carbon::now()->startOfWeek()->format('Y-m-d'),
            Carbon::now()->endOfWeek()->format('Y-m-d')
        ])->sum('amount');

        $monthCost = $categorizedTransactions->whereBetween('date',[
            $startDate->format('Y-m-d'),
            $endDate->format('Y-m-d')
        ])->sum('amount');

        return Inertia::render('dashboard',[
            'uncategorizedTransactions' => $uncategorizedTransactions,
            'categories' => $categories,
            'categorizedTransactions' => $categorizedTransactions,
            'todayCost' => currency_format((float)$todayCost),
            'weekCost' => currency_format((float)$weekCost),
            'monthCost' => currency_format((float)$monthCost),
            'categoryWithAmount' => $categoryWithAmount,
            'hasLinkedAccounts' => $hasLinkedAccounts,
            'selectedMonth' => (int)$month,
            'selectedYear' => (int)$year,
            'linkedAccounts' => auth()->user()->linkedAccounts()->get(),
        ]);
    })->name('dashboard');

    Route::post('transactions', [TransactionController::class, 'store'])->name('transactions.store');
    Route::get('transactions', [TransactionController::class, 'sync'])->name('transactions.sync');
    Route::post('categorize-transactions', [TransactionController::class, 'update'])->name('transactions.update');
    Route::post('transactions/categorizeWithAI', [TransactionController::class, 'categorizeWithAI'])->name('transactions.categorizeWithAI');
    Route::post('download', [TransactionController::class, 'downloadExcel'])->name('transactions.export');

    Route::get('custom-categories', [CategoryController::class, 'view'])->name('category.view');;
    Route::post('category', [CategoryController::class, 'store'])->name('category.store');

});



require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
