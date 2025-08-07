import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Link, router } from '@inertiajs/react';
import { ArrowLeft, Calendar, Droplet, Edit, History, QrCode, Trash2, User } from 'lucide-react';
import React from 'react';

interface Transaction {
    id: number;
    quantity: number;
    remaining_quota_after: number;
    taken_at: string;
}

interface Employee {
    id: number;
    employee_id: string;
    name: string;
    remaining_quota: number;
    quota_last_reset: string;
    created_at: string;
    transactions: Transaction[];
}

interface Props {
    employee: Employee;
    [key: string]: unknown;
}

export default function ShowEmployee({ employee }: Props) {
    const handleDelete = () => {
        if (confirm(`Are you sure you want to delete ${employee.name}? This action cannot be undone.`)) {
            router.delete(route('employees.destroy', employee.id), {
                onSuccess: () => {
                    router.visit(route('employees.index'));
                }
            });
        }
    };

    const getQuotaColor = (quota: number) => {
        if (quota >= 8) return 'bg-green-100 text-green-800';
        if (quota >= 5) return 'bg-yellow-100 text-yellow-800';
        if (quota >= 1) return 'bg-orange-100 text-orange-800';
        return 'bg-red-100 text-red-800';
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
                                    Back to Employees
                                </Button>
                            </Link>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <User className="h-6 w-6 text-blue-600" />
                            {employee.name}
                        </h1>
                        <p className="text-gray-600">
                            Employee details and transaction history
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Link href={route('employees.edit', employee.id)}>
                            <Button variant="outline" className="gap-2">
                                <Edit className="h-4 w-4" />
                                Edit
                            </Button>
                        </Link>
                        <Button 
                            variant="destructive" 
                            onClick={handleDelete}
                            className="gap-2"
                        >
                            <Trash2 className="h-4 w-4" />
                            Delete
                        </Button>
                    </div>
                </div>

                {/* Employee Information Cards */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Employee ID</CardTitle>
                            <QrCode className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold font-mono">{employee.employee_id}</div>
                            <p className="text-xs text-muted-foreground">Barcode identifier</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Remaining Quota</CardTitle>
                            <Droplet className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-600">{employee.remaining_quota}</div>
                            <p className="text-xs text-muted-foreground">Gallons this month</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Quota Reset</CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {new Date(employee.quota_last_reset).toLocaleDateString('en-US', { 
                                    month: 'short', 
                                    day: 'numeric' 
                                })}
                            </div>
                            <p className="text-xs text-muted-foreground">Last reset date</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
                            <History className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{employee.transactions.length}</div>
                            <p className="text-xs text-muted-foreground">This month</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Employee Details */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5" />
                            Employee Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <Label className="text-sm font-medium text-gray-500">Full Name</Label>
                                <p className="text-lg font-semibold">{employee.name}</p>
                            </div>
                            <div>
                                <Label className="text-sm font-medium text-gray-500">Employee ID</Label>
                                <p className="text-lg font-mono">{employee.employee_id}</p>
                            </div>
                            <div>
                                <Label className="text-sm font-medium text-gray-500">Current Quota Status</Label>
                                <div className="mt-1">
                                    <Badge className={getQuotaColor(employee.remaining_quota)}>
                                        {employee.remaining_quota} gallons remaining
                                    </Badge>
                                </div>
                            </div>
                            <div>
                                <Label className="text-sm font-medium text-gray-500">Member Since</Label>
                                <p className="text-lg">
                                    {new Date(employee.created_at).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Transactions */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <History className="h-5 w-5" />
                            Recent Transactions
                        </CardTitle>
                        <CardDescription>
                            Latest gallon withdrawals this month (showing last 10)
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {employee.transactions && employee.transactions.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Date & Time</TableHead>
                                        <TableHead>Quantity Taken</TableHead>
                                        <TableHead>Remaining After</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {employee.transactions.map((transaction) => (
                                        <TableRow key={transaction.id}>
                                            <TableCell>
                                                {new Date(transaction.taken_at).toLocaleString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="secondary">
                                                    {transaction.quantity} gallon{transaction.quantity > 1 ? 's' : ''}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={getQuotaColor(transaction.remaining_quota_after)}>
                                                    {transaction.remaining_quota_after} gallons
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <div className="text-center py-8">
                                <History className="mx-auto h-12 w-12 text-gray-400" />
                                <h3 className="mt-2 text-sm font-semibold text-gray-900">No transactions yet</h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    This employee hasn't taken any gallons this month.
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppShell>
    );
}

function Label({ className, children, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
    return (
        <label className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className || ''}`} {...props}>
            {children}
        </label>
    );
}