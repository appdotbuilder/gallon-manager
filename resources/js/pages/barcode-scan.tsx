import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Link, router } from '@inertiajs/react';
import { AlertCircle, CheckCircle, Droplet, LogIn, QrCode, User } from 'lucide-react';
import React, { useState, useEffect } from 'react';

interface Employee {
    id: number;
    employee_id: string;
    name: string;
    remaining_quota: number;
}

interface Props {
    employee?: Employee;
    error?: string;
    success?: string;
    employee_id?: string;
    [key: string]: unknown;
}

export default function BarcodeScan({ employee, error, success, employee_id = '' }: Props) {
    const [inputValue, setInputValue] = useState(employee_id);
    const [quantity, setQuantity] = useState('1');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Auto-submit when input changes (simulating barcode scan)
    useEffect(() => {
        if (inputValue && inputValue !== employee_id && inputValue.length >= 3) {
            const timer = setTimeout(() => {
                if (!inputValue.trim()) return;
        
                setIsSubmitting(true);
                router.post('/barcode', { employee_id: inputValue.trim() }, {
                    preserveState: true,
                    preserveScroll: true,
                    onFinish: () => setIsSubmitting(false),
                });
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [inputValue, employee_id]);

    const handleLookup = () => {
        if (!inputValue.trim()) return;
        
        setIsSubmitting(true);
        router.post('/barcode', { employee_id: inputValue.trim() }, {
            preserveState: true,
            preserveScroll: true,
            onFinish: () => setIsSubmitting(false),
        });
    };

    const handleTakeGallons = () => {
        if (!employee || !quantity) return;
        
        setIsSubmitting(true);
        router.post('/barcode', { 
            employee_id: employee.id,
            quantity: parseInt(quantity) 
        }, {
            preserveState: true,
            preserveScroll: true,
            onFinish: () => setIsSubmitting(false),
        });
    };

    const handleReset = () => {
        setInputValue('');
        setQuantity('1');
        router.visit('/', { replace: true });
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-600 rounded-lg">
                            <Droplet className="h-6 w-6 text-white fill-current" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">PT Tirta Investama</h1>
                            <p className="text-sm text-gray-600">Water Gallon Distribution System</p>
                        </div>
                    </div>
                    <Link href="/login">
                        <Button variant="outline" className="gap-2">
                            <LogIn className="h-4 w-4" />
                            Admin Login
                        </Button>
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 max-w-4xl mx-auto px-4 py-8 w-full">
                <div className="space-y-6">
                    {/* Welcome Card */}
                    <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
                        <CardHeader className="text-center">
                            <div className="mx-auto w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4">
                                <QrCode className="h-8 w-8" />
                            </div>
                            <CardTitle className="text-2xl">💧 Water Gallon Distribution</CardTitle>
                            <CardDescription className="text-blue-100">
                                Scan your employee barcode or enter your ID to check your monthly gallon quota
                            </CardDescription>
                        </CardHeader>
                    </Card>

                    {/* Barcode Scanner Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <QrCode className="h-5 w-5 text-blue-600" />
                                Employee Lookup
                            </CardTitle>
                            <CardDescription>
                                Scan your barcode or manually enter your employee ID
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="employee_id">Employee ID / Barcode</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="employee_id"
                                        placeholder="Scan barcode or enter Employee ID..."
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        className="flex-1"
                                        disabled={isSubmitting}
                                    />
                                    <Button 
                                        onClick={handleLookup}
                                        disabled={!inputValue.trim() || isSubmitting}
                                    >
                                        {isSubmitting ? 'Looking up...' : 'Submit'}
                                    </Button>
                                </div>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-md border border-red-200">
                                    <AlertCircle className="h-5 w-5 flex-shrink-0" />
                                    <span>{error}</span>
                                </div>
                            )}

                            {/* Success Message */}
                            {success && (
                                <div className="flex items-center gap-2 p-3 bg-green-50 text-green-700 rounded-md border border-green-200">
                                    <CheckCircle className="h-5 w-5 flex-shrink-0" />
                                    <span>{success}</span>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Employee Info & Gallon Selection */}
                    {employee && (
                        <div className="grid gap-6 md:grid-cols-2">
                            {/* Employee Info */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <User className="h-5 w-5 text-green-600" />
                                        Employee Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div>
                                        <Label className="text-sm font-medium text-gray-500">Name</Label>
                                        <p className="text-lg font-semibold">{employee.name}</p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium text-gray-500">Employee ID</Label>
                                        <p className="text-lg font-mono">{employee.employee_id}</p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium text-gray-500">Remaining Quota This Month</Label>
                                        <p className="text-2xl font-bold text-blue-600">
                                            {employee.remaining_quota} gallons
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Gallon Selection */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Droplet className="h-5 w-5 text-blue-600" />
                                        Take Gallons
                                    </CardTitle>
                                    <CardDescription>
                                        Select how many gallons you want to take
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="quantity">Quantity</Label>
                                        <Select value={quantity} onValueChange={setQuantity}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select quantity" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {[1, 2, 3, 4, 5].map((num) => (
                                                    <SelectItem 
                                                        key={num} 
                                                        value={num.toString()}
                                                        disabled={num > employee.remaining_quota}
                                                    >
                                                        {num} gallon{num > 1 ? 's' : ''}
                                                        {num > employee.remaining_quota && ' (insufficient quota)'}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="flex gap-2">
                                        <Button 
                                            onClick={handleTakeGallons}
                                            disabled={!quantity || parseInt(quantity) > employee.remaining_quota || isSubmitting}
                                            className="flex-1"
                                        >
                                            {isSubmitting ? 'Processing...' : `Take ${quantity} Gallon${parseInt(quantity) > 1 ? 's' : ''}`}
                                        </Button>
                                        <Button variant="outline" onClick={handleReset}>
                                            Reset
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* Info Card */}
                    <Card className="bg-blue-50 border-blue-200">
                        <CardContent className="pt-6">
                            <div className="text-center space-y-2">
                                <h3 className="font-semibold text-blue-900">📋 How it works</h3>
                                <p className="text-blue-700 text-sm">
                                    Each employee gets <strong>10 gallons per month</strong>. Quota resets automatically on the 1st of each month. 
                                    Simply scan your barcode or enter your Employee ID to check your remaining quota and take gallons.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}