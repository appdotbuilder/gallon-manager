import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Link, router } from '@inertiajs/react';
import { Edit, Eye, Plus, Trash2, Users } from 'lucide-react';
import React from 'react';

interface Employee {
    id: number;
    employee_id: string;
    name: string;
    remaining_quota: number;
    created_at: string;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface Props {
    employees: {
        data: Employee[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: PaginationLink[];
    };
    [key: string]: unknown;
}

export default function EmployeesIndex({ employees }: Props) {
    const handleDelete = (employee: Employee) => {
        if (confirm(`Are you sure you want to delete ${employee.name}? This action cannot be undone.`)) {
            router.delete(route('employees.destroy', employee.id), {
                preserveScroll: true,
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
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <Users className="h-6 w-6 text-blue-600" />
                            Employee Management
                        </h1>
                        <p className="text-gray-600">
                            Manage employee records and gallon quotas
                        </p>
                    </div>
                    <Link href={route('employees.create')}>
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" />
                            Add Employee
                        </Button>
                    </Link>
                </div>

                {/* Statistics */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{employees.total}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Quotas</CardTitle>
                            <Badge variant="secondary">{employees.data.filter(emp => emp.remaining_quota > 0).length}</Badge>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">
                                {employees.data.filter(emp => emp.remaining_quota > 0).length}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">No Quota Left</CardTitle>
                            <Badge variant="destructive">{employees.data.filter(emp => emp.remaining_quota === 0).length}</Badge>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">
                                {employees.data.filter(emp => emp.remaining_quota === 0).length}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Employees Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Employees</CardTitle>
                        <CardDescription>
                            View and manage all employee records
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {employees.data.length > 0 ? (
                            <div className="space-y-4">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Employee ID</TableHead>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Remaining Quota</TableHead>
                                            <TableHead>Created</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {employees.data.map((employee) => (
                                            <TableRow key={employee.id}>
                                                <TableCell className="font-mono">
                                                    {employee.employee_id}
                                                </TableCell>
                                                <TableCell className="font-medium">
                                                    {employee.name}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge className={getQuotaColor(employee.remaining_quota)}>
                                                        {employee.remaining_quota} gallons
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-sm text-gray-500">
                                                    {new Date(employee.created_at).toLocaleDateString()}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Link href={route('employees.show', employee.id)}>
                                                            <Button variant="ghost" size="sm">
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                        <Link href={route('employees.edit', employee.id)}>
                                                            <Button variant="ghost" size="sm">
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                        <Button 
                                                            variant="ghost" 
                                                            size="sm"
                                                            onClick={() => handleDelete(employee)}
                                                        >
                                                            <Trash2 className="h-4 w-4 text-red-500" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>

                                {/* Pagination */}
                                {employees.last_page > 1 && (
                                    <div className="flex items-center justify-center gap-2">
                                        {employees.links.map((link, index) => {
                                            if (!link.url) {
                                                return (
                                                    <Button key={index} variant="ghost" disabled size="sm">
                                                        <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                                    </Button>
                                                );
                                            }

                                            return (
                                                <Link key={index} href={link.url}>
                                                    <Button 
                                                        variant={link.active ? "default" : "ghost"} 
                                                        size="sm"
                                                    >
                                                        <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                                    </Button>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <Users className="mx-auto h-12 w-12 text-gray-400" />
                                <h3 className="mt-2 text-sm font-semibold text-gray-900">No employees found</h3>
                                <p className="mt-1 text-sm text-gray-500">Get started by adding your first employee.</p>
                                <div className="mt-6">
                                    <Link href={route('employees.create')}>
                                        <Button className="gap-2">
                                            <Plus className="h-4 w-4" />
                                            Add Employee
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppShell>
    );
}