<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\TransactionController;
use App\Models\Category;
use Carbon\Carbon;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Torann\Currency\Currency;


Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');


Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        $uncategorizedTransactions = auth()->user()->transactions()->with('linkedAccount')->where('category_id', null)->get();
        $categories = Category::query()->where('categories.user_id', auth()->id())->orWhere('categories.user_id', null)->get();
        $categorizedTransactions = auth()->user()->transactions()->with('linkedAccount')->with('category')->whereNot('category_id', null)->get();
        $hasLinkedAccounts = auth()->user()->linkedAccounts()->count() > 0;

        $categoryWithAmount = auth()->user()->transactions()->join('categories', 'categories.id',  '=', 'transactions.category_id')->whereNot('category_id', null)
            ->select('categories.name as category', DB::raw('sum(amount) as amount'))
            ->whereBetween('date', [
                Carbon::now()->startOfMonth()->format('Y-m-d'),
                Carbon::now()->endOfMonth()->format('Y-m-d')
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
            Carbon::now()->startOfMonth()->format('Y-m-d'),
            Carbon::now()->endOfMonth()->format('Y-m-d')
        ])->sum('amount');

        return Inertia::render('dashboard',[
            'uncategorizedTransactions' => $uncategorizedTransactions,
            'categories' => $categories,
            'categorizedTransactions' => $categorizedTransactions,
            'todayCost' => currency_format((float)$todayCost),
            'weekCost' => currency_format((float)$weekCost),
            'monthCost' => currency_format((float)$monthCost),
            'categoryWithAmount' => $categoryWithAmount,
            'hasLinkedAccounts' => $hasLinkedAccounts
        ]);
    })->name('dashboard');

    Route::get('transactions', [TransactionController::class, 'store'])->name('transactions.store');
    Route::post('transactions', [TransactionController::class, 'update'])->name('transactions.update');

    Route::get('custom-categories', [CategoryController::class, 'view'])->name('category.view');;
    Route::post('category', [CategoryController::class, 'store'])->name('category.store');

});



require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
