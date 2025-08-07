<?php

use App\Models\Employee;
use App\Models\User;
use Carbon\Carbon;

beforeEach(function () {
    $this->seed();
});

test('barcode scan page loads', function () {
    $response = $this->get('/');
    
    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => 
        $page->component('barcode-scan')
    );
});

test('employee lookup works', function () {
    $employee = Employee::factory()->create([
        'employee_id' => 'TEST001',
        'name' => 'Test Employee',
        'remaining_quota' => 8,
    ]);

    $response = $this->post('/barcode', [
        'employee_id' => 'TEST001'
    ]);

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => 
        $page->component('barcode-scan')
            ->has('employee')
            ->where('employee.employee_id', 'TEST001')
            ->where('employee.name', 'Test Employee')
            ->where('employee.remaining_quota', 8)
    );
});

test('employee lookup not found', function () {
    $response = $this->post('/barcode', [
        'employee_id' => 'NONEXISTENT'
    ]);

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => 
        $page->component('barcode-scan')
            ->has('error')
            ->where('error', 'Employee not found. Please check the ID and try again.')
    );
});

test('take gallons success', function () {
    $employee = Employee::factory()->create([
        'employee_id' => 'TEST002',
        'remaining_quota' => 8,
    ]);

    $response = $this->post('/barcode', [
        'employee_id' => $employee->id,
        'quantity' => 2,
    ]);

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => 
        $page->component('barcode-scan')
            ->has('employee')
            ->where('employee.remaining_quota', 6)
            ->has('success')
    );

    // Verify database
    $employee->refresh();
    expect($employee->remaining_quota)->toBe(6);
    $this->assertDatabaseHas('gallon_transactions', [
        'employee_id' => $employee->id,
        'quantity' => 2,
        'remaining_quota_after' => 6,
    ]);
});

test('take gallons insufficient quota', function () {
    $employee = Employee::factory()->create([
        'employee_id' => 'TEST003',
        'remaining_quota' => 2,
    ]);

    $response = $this->post('/barcode', [
        'employee_id' => $employee->id,
        'quantity' => 5,
    ]);

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => 
        $page->component('barcode-scan')
            ->has('error')
            ->where('error', 'Insufficient quota. Only 2 gallons remaining.')
    );

    // Verify quota unchanged
    $employee->refresh();
    expect($employee->remaining_quota)->toBe(2);
});

test('admin can access employees index', function () {
    $user = User::factory()->create();
    
    $response = $this->actingAs($user)->get('/employees');
    
    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => 
        $page->component('admin/employees/index')
            ->has('employees')
    );
});

test('guest cannot access admin routes', function () {
    $response = $this->get('/employees');
    
    $response->assertRedirect('/login');
});

test('admin can create employee', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post('/employees', [
        'employee_id' => 'NEW001',
        'name' => 'New Employee',
        'remaining_quota' => 10,
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('employees', [
        'employee_id' => 'NEW001',
        'name' => 'New Employee',
        'remaining_quota' => 10,
    ]);
});

test('admin can update employee', function () {
    $user = User::factory()->create();
    $employee = Employee::factory()->create([
        'employee_id' => 'UPDATE001',
        'name' => 'Old Name',
        'remaining_quota' => 5,
    ]);

    $response = $this->actingAs($user)->put('/employees/' . $employee->id, [
        'employee_id' => 'UPDATE001',
        'name' => 'Updated Name',
        'remaining_quota' => 8,
    ]);

    $response->assertRedirect();
    $employee->refresh();
    expect($employee->name)->toBe('Updated Name');
    expect($employee->remaining_quota)->toBe(8);
});

test('admin can delete employee', function () {
    $user = User::factory()->create();
    $employee = Employee::factory()->create();

    $response = $this->actingAs($user)->delete('/employees/' . $employee->id);

    $response->assertRedirect();
    $this->assertDatabaseMissing('employees', ['id' => $employee->id]);
});

test('quota reset functionality', function () {
    $employee = Employee::factory()->create([
        'remaining_quota' => 3,
        'quota_last_reset' => Carbon::now()->subMonthNoOverflow(),
    ]);

    // Trigger quota check
    $employee->checkAndResetQuota();
    $employee->refresh();

    expect($employee->remaining_quota)->toBe(10);
    expect($employee->quota_last_reset->isCurrentMonth())->toBeTrue();
});

test('dashboard redirects to employees', function () {
    $user = User::factory()->create();
    
    $response = $this->actingAs($user)->get('/dashboard');
    
    $response->assertRedirect('/employees');
});

test('employee validation rules', function () {
    $user = User::factory()->create();

    // Test duplicate employee_id
    Employee::factory()->create(['employee_id' => 'DUPLICATE']);

    $response = $this->actingAs($user)->post('/employees', [
        'employee_id' => 'DUPLICATE',
        'name' => 'Test',
    ]);

    $response->assertSessionHasErrors('employee_id');

    // Test missing required fields
    $response = $this->actingAs($user)->post('/employees', []);
    $response->assertSessionHasErrors(['employee_id', 'name']);

    // Test quota limits
    $response = $this->actingAs($user)->post('/employees', [
        'employee_id' => 'TEST',
        'name' => 'Test',
        'remaining_quota' => 100, // Above limit
    ]);

    $response->assertSessionHasErrors('remaining_quota');
});