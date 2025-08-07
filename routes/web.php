<?php

use App\Http\Controllers\BarcodeController;
use App\Http\Controllers\EmployeeController;
use Illuminate\Support\Facades\Route;

Route::get('/health-check', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now()->toISOString(),
    ]);
})->name('health-check');

// Public barcode scanning routes - main functionality on home page
Route::controller(BarcodeController::class)->group(function () {
    Route::get('/', 'index')->name('barcode.index');
    Route::post('/barcode', 'store')->name('barcode.store');
});

// Admin dashboard (requires authentication)
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return redirect()->route('employees.index');
    })->name('dashboard');
    
    // Admin routes for employee management
    Route::resource('employees', EmployeeController::class);
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
