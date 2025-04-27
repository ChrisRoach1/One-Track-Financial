<?php

use App\Models\LinkedAccount;
use App\Models\User;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(User::class);
            $table->foreignIdFor(LinkedAccount::class);
            $table->string('amount')->nullable(false);
            $table->string('currency')->nullable(false);
            $table->date('date')->nullable(false);
            $table->string('merchant_name')->nullable(false);
            $table->boolean('pending')->nullable(false);
            $table->string('logo_url')->nullable();
            $table->integer('category_id')->nullable();
            $table->string('transaction_id')->nullable(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
