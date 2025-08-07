<?php

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
        Schema::create('employees', function (Blueprint $table) {
            $table->id();
            $table->string('employee_id')->unique()->comment('Unique employee identifier used for barcode scanning');
            $table->string('name')->comment('Employee full name');
            $table->integer('remaining_quota')->default(10)->comment('Current month remaining gallon quota');
            $table->date('quota_last_reset')->default(now())->comment('Date when quota was last reset');
            $table->timestamps();
            
            // Indexes for performance
            $table->index('employee_id');
            $table->index('name');
            $table->index(['quota_last_reset', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('employees');
    }
};