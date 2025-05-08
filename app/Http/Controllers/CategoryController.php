<?php

namespace App\Http\Controllers;

use App\Models\AccessToken;
use App\Models\Category;
use App\Models\LinkedAccount;
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
     * Edit a linked category.
     */
    public function edit(Request $request) : Response
    {

    }

    /**
     * delete a custom category.
     */
    public function destroy(int $id)
    {

    }

}
