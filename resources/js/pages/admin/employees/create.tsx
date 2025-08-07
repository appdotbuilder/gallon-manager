import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import { Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Plus, User } from 'lucide-react';
import React from 'react';

interface Props {
    errors?: Record<string, string>;
    [key: string]: unknown;
}

export default function CreateEmployee({ errors }: Props) {
    const { data, setData, post, processing } = useForm({
        employee_id: '',
        name: '',
        remaining_quota: 10,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('employees.store'));
    };

    return (
        <AppShell>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Link href={route('employees.index')}>
                                <Button variant="ghost" size="sm" className="gap-1">
                                    <ArrowLeft className="h-4 w-4" />
                                    Back
                                </Button>
                            </Link>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <Plus className="h-6 w-6 text-blue-600" />
                            Add New Employee
                        </h1>
                        <p className="text-gray-600">
                            Create a new employee record with gallon quota
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
                                Enter the employee details. Default quota is 10 gallons per month.
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
                                        This ID will be used for barcode scanning
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
                                        Initial Quota (Gallons)
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
                                    />
                                    <p className="text-sm text-gray-500">
                                        Default is 10 gallons. Will reset to 10 on the 1st of each month.
                                    </p>
                                    <InputError message={errors?.remaining_quota} />
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <Button type="submit" disabled={processing} className="gap-2">
                                        <Plus className="h-4 w-4" />
                                        {processing ? 'Creating...' : 'Create Employee'}
                                    </Button>
                                    <Link href={route('employees.index')}>
                                        <Button type="button" variant="outline">
                                            Cancel
                                        </Button>
                                    </Link>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Info Card */}
                    <Card className="mt-6 bg-blue-50 border-blue-200">
                        <CardContent className="pt-6">
                            <div className="space-y-2">
                                <h3 className="font-semibold text-blue-900">💡 Quick Tips</h3>
                                <ul className="text-blue-700 text-sm space-y-1">
                                    <li>• Employee ID should be unique and easy to scan</li>
                                    <li>• Default quota is 10 gallons per month</li>
                                    <li>• Quotas automatically reset on the 1st of each month</li>
                                    <li>• Employees can scan their ID to check remaining quota</li>
                                </ul>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppShell>
    );
}