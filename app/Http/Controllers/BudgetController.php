<?php

namespace App\Http\Controllers;

use App\Models\Budget;
use App\Models\Category;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class BudgetController extends Controller
{
    /**
     * Load view for the budget screen.
     */
    public function view(Request $request)
    {
        $categories = Category::query()->where('categories.user_id', auth()->id())->orWhere('categories.user_id', null)->get();

        $categorizedTransactions = auth()->user()->transactions()->with('linkedAccount')->with('category')->whereNot('category_id', null)
            ->whereBetween('date', [
                Carbon::now()->startOfMonth()->format('Y-m-d'),
                Carbon::now()->endOfMonth()->format('Y-m-d')
            ])->get();

        $userBudgets = auth()->user()->budgets()->get();

        $monthCost = $categorizedTransactions->sum('amount');

        return Inertia::render('budgets', [
            'categories' => $categories,
            'budgets' => $userBudgets->map(function($budget) use ($categorizedTransactions) {
                return [
                    'id' => $budget->id,
                    'category_id' => $budget->category_id,
                    'category' => $budget->category,
                    'max_amount' => $budget->max_amount,
                    'spent_amount' => $categorizedTransactions->where('category_id', $budget->category_id)->sum('amount'),
                    'remaining_amount' => $budget->max_amount - $categorizedTransactions->where('category_id', $budget->category_id)->sum('amount'),
                    'percentage_used' => $categorizedTransactions->where('category_id', $budget->category_id)->sum('amount') / $budget->max_amount * 100,
                    ];
            }),
            'totalBudgeted' => auth()->user()->budgets()->sum('max_amount'),
            'totalSpent' => $monthCost,
            'totalRemaining' => auth()->user()->budgets()->sum('max_amount') - $monthCost,
        ]);
    }

    /**
     * create budget records.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_id' => ['required', 'integer', 'exists:categories,id'],
            'max_amount' => ['required', 'integer', 'min:1'],
        ]);

        Budget::create([
           'user_id' => Auth::id(),
           'max_amount' => $validated['max_amount'],
           'category_id' => $validated['category_id'],
        ]);

        return redirect()->route('budgets.view');
    }

    /**
     * update budget record.
     */
    public function update(Request $request, int $id)
    {
        $budgetToUpdate = Budget::where(['id' => $id, 'user_id' => auth()->id()])->first();

        if($budgetToUpdate) {
            $validated = $request->validate([
                'max_amount' => ['required', 'integer', 'min:1'],
            ]);

            $budgetToUpdate->update($validated);;
        }

        return redirect()->route('budgets.view');
    }

    /**
     * delete budget record.
     */
    public function destroy(int $id)
    {
        $budgetToDelete = Budget::where(['id' => $id, 'user_id' => auth()->id()])->first();

        if($budgetToDelete) {
        $budgetToDelete->delete();
        }

        return redirect()->route('budgets.view');
    }
}
