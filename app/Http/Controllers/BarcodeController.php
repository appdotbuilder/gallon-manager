<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;

use App\Models\Employee;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BarcodeController extends Controller
{
    /**
     * Display the barcode scanning page.
     */
    public function index()
    {
        return Inertia::render('barcode-scan');
    }

    /**
     * Store employee lookup or gallon transaction.
     */
    public function store(Request $request)
    {
        // Handle employee lookup
        if ($request->has('employee_id') && !$request->has('quantity')) {
            $request->validate([
                'employee_id' => 'required|string|max:50',
            ]);

            $employee = Employee::where('employee_id', $request->employee_id)->first();

            if (!$employee) {
                return Inertia::render('barcode-scan', [
                    'error' => 'Employee not found. Please check the ID and try again.',
                    'employee_id' => $request->employee_id,
                ]);
            }

            // Check and reset quota if needed
            $employee->checkAndResetQuota();
            $employee->refresh();

            return Inertia::render('barcode-scan', [
                'employee' => [
                    'id' => $employee->id,
                    'employee_id' => $employee->employee_id,
                    'name' => $employee->name,
                    'remaining_quota' => $employee->remaining_quota,
                ],
                'employee_id' => $request->employee_id,
            ]);
        }

        // Handle gallon taking
        $request->validate([
            'employee_id' => 'required|integer|exists:employees,id',
            'quantity' => 'required|integer|min:1|max:10',
        ]);

        $employee = Employee::findOrFail($request->employee_id);
        
        $success = $employee->takeGallons($request->quantity);

        if (!$success) {
            return Inertia::render('barcode-scan', [
                'employee' => [
                    'id' => $employee->id,
                    'employee_id' => $employee->employee_id,
                    'name' => $employee->name,
                    'remaining_quota' => $employee->remaining_quota,
                ],
                'error' => 'Insufficient quota. Only ' . $employee->remaining_quota . ' gallons remaining.',
                'employee_id' => $employee->employee_id,
            ]);
        }

        $employee->refresh();

        return Inertia::render('barcode-scan', [
            'employee' => [
                'id' => $employee->id,
                'employee_id' => $employee->employee_id,
                'name' => $employee->name,
                'remaining_quota' => $employee->remaining_quota,
            ],
            'success' => 'Successfully taken ' . $request->quantity . ' gallon(s). Remaining quota: ' . $employee->remaining_quota,
            'employee_id' => $employee->employee_id,
        ]);
    }
}