<?php

namespace App\Http\Controllers;

use App\Models\AccessToken;
use App\Models\Budget;
use App\Models\Category;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{

    /**
     * Load view for custom category screen.
     */
    public function view(Request $request)
    {
        $existingCustomCategories = Auth::user()->customCategories()->get();
        return Inertia::render('custom-category',[
            'existingCustomCategories' => $existingCustomCategories,
        ]);
    }

    /**
     * Create a new custom category.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
        ]);

        Category::create([
            'name' => $validated['name'],
            'user_id' => Auth::id()
        ]);

        return redirect()->route('category.view');
    }

    /**
     * delete a custom category.
     */
    public function destroy(int $id)
    {
        $customCategory = Auth::user()->customCategories()->with('transactions')->where('id',$id);
        
        if($customCategory) {
            Transaction::where('category_id', $id)->update(['category_id' => null]);
            Budget::where('category_id', $id)->delete();
            $customCategory->delete();
        }

        return redirect()->route('category.view');
    }

}
