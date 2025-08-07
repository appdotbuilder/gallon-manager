<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateEmployeeRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'employee_id' => 'required|string|max:50|unique:employees,employee_id,' . $this->route('employee')->id,
            'name' => 'required|string|max:255',
            'remaining_quota' => 'required|integer|min:0|max:50',
        ];
    }

    /**
     * Get custom error messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'employee_id.required' => 'Employee ID is required.',
            'employee_id.unique' => 'This Employee ID is already registered to another employee.',
            'name.required' => 'Employee name is required.',
            'remaining_quota.required' => 'Remaining quota is required.',
            'remaining_quota.integer' => 'Remaining quota must be a number.',
            'remaining_quota.min' => 'Remaining quota cannot be negative.',
            'remaining_quota.max' => 'Remaining quota cannot exceed 50 gallons.',
        ];
    }
}