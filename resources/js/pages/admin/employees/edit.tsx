import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import { Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Edit, User } from 'lucide-react';
import React from 'react';

interface Employee {
    id: number;
    employee_id: string;
    name: string;
    remaining_quota: number;
}

interface Props {
    employee: Employee;
    errors?: Record<string, string>;
    [key: string]: unknown;
}

export default function EditEmployee({ employee, errors }: Props) {
    const { data, setData, put, processing } = useForm({
        employee_id: employee.employee_id,
        name: employee.name,
        remaining_quota: employee.remaining_quota,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('employees.update', employee.id));
    };

    return (
        <AppShell>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Link href={route('employees.show', employee.id)}>
                                <Button variant="ghost" size="sm" className="gap-1">
                                    <ArrowLeft className="h-4 w-4" />
                                    Back
                                </Button>
                            </Link>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <Edit className="h-6 w-6 text-blue-600" />
                            Edit Employee
                        </h1>
                        <p className="text-gray-600">
                            Update employee information and gallon quota
                        </p>
                    </div>
                </div>

                {/* Form */}
                <div className="max-w-2xl">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Employee Information
                            </CardTitle>
                            <CardDescription>
                                Update the employee details and remaining quota.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="employee_id">
                                        Employee ID <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="employee_id"
                                        type="text"
                                        placeholder="e.g., TI001, EMP123"
                                        value={data.employee_id}
                                        onChange={(e) => setData('employee_id', e.target.value)}
                                        className={errors?.employee_id ? 'border-red-500' : ''}
                                        required
                                    />
                                    <p className="text-sm text-gray-500">
                                        This ID is used for barcode scanning
                                    </p>
                                    <InputError message={errors?.employee_id} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="name">
                                        Full Name <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        placeholder="e.g., John Doe"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className={errors?.name ? 'border-red-500' : ''}
                                        required
                                    />
                                    <InputError message={errors?.name} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="remaining_quota">
                                        Current Remaining Quota (Gallons) <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="remaining_quota"
                                        type="number"
                                        min="0"
                                        max="50"
                                        placeholder="10"
                                        value={data.remaining_quota}
                                        onChange={(e) => setData('remaining_quota', parseInt(e.target.value) || 0)}
                                        className={errors?.remaining_quota ? 'border-red-500' : ''}
                                        required
                                    />
                                    <p className="text-sm text-gray-500">
                                        Adjust the current month's remaining quota. Resets to 10 on the 1st of each month.
                                    </p>
                                    <InputError message={errors?.remaining_quota} />
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <Button type="submit" disabled={processing} className="gap-2">
                                        <Edit className="h-4 w-4" />
                                        {processing ? 'Updating...' : 'Update Employee'}
                                    </Button>
                                    <Link href={route('employees.show', employee.id)}>
                                        <Button type="button" variant="outline">
                                            Cancel
                                        </Button>
                                    </Link>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Warning Card */}
                    <Card className="mt-6 bg-amber-50 border-amber-200">
                        <CardContent className="pt-6">
                            <div className="space-y-2">
                                <h3 className="font-semibold text-amber-900">⚠️ Important Notes</h3>
                                <ul className="text-amber-700 text-sm space-y-1">
                                    <li>• Changing Employee ID will require updating physical barcode cards</li>
                                    <li>• Quota changes affect only the current month</li>
                                    <li>• All quotas automatically reset to 10 on the 1st of each month</li>
                                    <li>• Transaction history will be preserved</li>
                                </ul>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppShell>
    );
}