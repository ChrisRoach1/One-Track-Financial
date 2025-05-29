<?php

use App\Http\Controllers\BudgetController;
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

        $allTransactions = auth()->user()->transactions()->with(['linkedAccount', 'category'])->get();
        $uncategorizedTransactions = $allTransactions->where('category_id', null)->values();
        $linkedAccounts = auth()->user()->linkedAccounts()->get();
        $categories = Category::query()->where('categories.user_id', auth()->id())->orWhere('categories.user_id', null)->get();
        $categorizedTransactions = $allTransactions->where('category_id','!=', null)
            ->whereBetween('date', [
                $startDate->format('Y-m-d'),
                $endDate->format('Y-m-d')
            ])
            ->values();


        $categoryWithAmount = auth()->user()->transactions()->join('categories', 'categories.id',  '=', 'transactions.category_id')->whereNot('category_id', null)
            ->select('categories.name as category', DB::raw('sum(amount) as amount'))
            ->whereBetween('date', [
                $startDate->format('Y-m-d'),
                $endDate->format('Y-m-d')
            ])
            ->groupBy('category_id')->get();

        foreach ($categoryWithAmount as $category){
            $category->amount = "$".$category->amount;
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
            'todayCost' => "$".$todayCost,
            'weekCost' => "$".$weekCost,
            'monthCost' => "$".$monthCost,
            'categoryWithAmount' => $categoryWithAmount,
            'hasLinkedAccounts' => $linkedAccounts->count() > 0,
            'selectedMonth' => (int)$month,
            'selectedYear' => (int)$year,
            'linkedAccounts' => $linkedAccounts,
        ]);
    })->name('dashboard');

    Route::post('transactions', [TransactionController::class, 'store'])->name('transactions.store');
    Route::get('transactions', [TransactionController::class, 'sync'])->name('transactions.sync');
    Route::post('categorize-transactions', [TransactionController::class, 'update'])->name('transactions.update');
    Route::post('transactions/categorizeWithAI', [TransactionController::class, 'categorizeWithAI'])->name('transactions.categorizeWithAI');
    Route::post('download', [TransactionController::class, 'downloadExcel'])->name('transactions.export');

    Route::get('custom-categories', [CategoryController::class, 'view'])->name('categories.view');;
    Route::post('categories', [CategoryController::class, 'store'])->name('categories.store');
    Route::delete('categories/{id}', [CategoryController::class, 'destroy'])->name('categories.destroy');

    Route::get('budgets', [BudgetController::class, 'view'])->name('budgets.view');
    Route::post('budgets', [BudgetController::class, 'store'])->name('budgets.store');
    Route::delete('budgets/{id}', [BudgetController::class, 'destroy'])->name('budgets.destroy');
    Route::put('budgets/{id}', [BudgetController::class, 'update'])->name('budgets.update');

});



require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
