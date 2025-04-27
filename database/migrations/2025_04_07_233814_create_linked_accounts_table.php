<?php

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
        Schema::create('linked_accounts', function (Blueprint $table) {
            $table->id();
            $table->string('institution_name')->nullable(false);
            $table->string('account_name')->nullable(false);
            $table->string('account_mask')->nullable(false);
            $table->string('access_token')->nullable(false);
            $table->string('next_cursor')->nullable();
            $table->foreignIdFor(User::class);
            $table->timestamps();

            $table->unique(['institution_name', 'account_name', 'account_mask'], 'unique_linked_accounts');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('linked_accounts');
    }
};
