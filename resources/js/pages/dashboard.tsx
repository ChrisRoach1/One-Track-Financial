import { AddTransactionModal } from '@/components/add-transaction-modal';
import { DataTable } from '@/components/data-table';
import { TransactionCategorizationModal } from '@/components/transaction-categorization-modal';
import { Button } from '@/components/ui/button';
import { getCategoryIcon } from '@/components/ui/category-icons';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { Category, LinkedAccount, Transaction, type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import axios from 'axios';
import { Calendar, DollarSign, Download, Link as LinkIcon, RefreshCw, Sparkles, TrendingDown, TrendingUp } from 'lucide-react';
import { useState } from 'react';

export const gridColumns: ColumnDef<Transaction>[] = [
    {
        accessorKey: 'amount',
        header: 'Amount',
    },
    {
        accessorKey: 'date',
        header: 'Date',
    },
    {
        accessorKey: 'merchant_name',
        header: 'Merchant',
    },
    {
        accessorKey: 'linked_account.institution_name',
        header: 'Institution',
    },
    {
        accessorKey: 'linked_account.account_mask',
        header: 'Account #',
    },
    {
        accessorKey: 'category.name',
        header: 'Category',
    },
];

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

interface props {
    uncategorizedTransactions: Transaction[];
    categories: Category[];
    categorizedTransactions: Transaction[];
    todayCost: string;
    weekCost: string;
    monthCost: string;
    categoryWithAmount: CategoryWithAmount[];
    hasLinkedAccounts: boolean;
    selectedMonth: number;
    selectedYear: number;
    linkedAccounts: LinkedAccount[];
}

interface CategoryWithAmount {
    category: string;
    amount: string;
}

export default function Dashboard({
    uncategorizedTransactions,
    categories,
    categorizedTransactions,
    todayCost,
    weekCost,
    monthCost,
    categoryWithAmount,
    hasLinkedAccounts,
    selectedMonth,
    selectedYear,
    linkedAccounts,
}: props) {
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(selectedMonth.toString());
    const [currentYear, setCurrentYear] = useState(selectedYear.toString());

    const months = [
        { value: '0', label: 'January' },
        { value: '1', label: 'February' },
        { value: '2', label: 'March' },
        { value: '3', label: 'April' },
        { value: '4', label: 'May' },
        { value: '5', label: 'June' },
        { value: '6', label: 'July' },
        { value: '7', label: 'August' },
        { value: '8', label: 'September' },
        { value: '9', label: 'October' },
        { value: '10', label: 'November' },
        { value: '11', label: 'December' },
    ];

    const years = Array.from({ length: 5 }, (_, i) => {
        const year = new Date().getFullYear() - i;
        return { value: year.toString(), label: year.toString() };
    });

    const handleMonthChange = (value: string) => {
        setCurrentMonth(value);
        router.get(route('dashboard'), { month: value, year: currentYear }, { preserveState: true });
    };

    const handleYearChange = (value: string) => {
        setCurrentYear(value);
        router.get(route('dashboard'), { month: currentMonth, year: value }, { preserveState: true });
    };

    const onclose = () => {
        setIsCategoryModalOpen(false);
        const updatedTransactions = uncategorizedTransactions.filter((x) => x.category_id !== null);

        axios.post(route('transactions.update'), { updatedTransactions }).then(() => {
            router.reload();
        });
    };

    const downloadExcel = () => {
        axios
            .post(
                route('transactions.export'),
                { month: currentMonth, year: currentYear },
                {
                    responseType: 'blob',
                },
            )
            .then((response) => {
                const blob = new Blob([response.data], {
                    type: response.headers['content-type'],
                });

                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                const filename = 'transactions.xlsx';
                link.setAttribute('download', filename);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            })
            .catch((error) => {
                console.error('Error downloading file:', error);
            });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            {/* Header Section */}
            <div className='p-4 space-y-5'>
                {/* Page Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Financial Dashboard</h1>
                        <p className="text-muted-foreground mt-2">Track your spending and manage your transactions</p>
                    </div>

                    {/* Time Period Controls */}
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-2">
                            <Calendar className="text-muted-foreground h-4 w-4" />
                            <Select value={currentMonth} onValueChange={handleMonthChange}>
                                <SelectTrigger className="w-[140px]">
                                    <SelectValue placeholder="Month" />
                                </SelectTrigger>
                                <SelectContent>
                                    {months.map((month) => (
                                        <SelectItem key={month.value} value={month.value}>
                                            {month.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select value={currentYear} onValueChange={handleYearChange}>
                                <SelectTrigger className="w-[100px]">
                                    <SelectValue placeholder="Year" />
                                </SelectTrigger>
                                <SelectContent>
                                    {years.map((year) => (
                                        <SelectItem key={year.value} value={year.value}>
                                            {year.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <Button variant="outline" onClick={downloadExcel} className="flex items-center gap-2">
                            <Download className="h-4 w-4" />
                            Export
                        </Button>
                    </div>
                </div>

                {/* Action Bar */}
                <div className="flex flex-wrap items-center gap-3">
                    {uncategorizedTransactions !== null && uncategorizedTransactions.length > 0 && (
                        <Button
                            onClick={() => setIsCategoryModalOpen(true)}
                            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                        >
                            <TrendingUp className="mr-2 h-4 w-4" />
                            {uncategorizedTransactions.length} New Transaction{uncategorizedTransactions.length !== 1 ? 's' : ''}
                        </Button>
                    )}

                    {hasLinkedAccounts ? (
                        <>
                            <Button variant="outline" onClick={() => router.get(route('transactions.sync'))}>
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Sync Transactions
                            </Button>
                            <Button variant="outline" onClick={() => router.post(route('transactions.categorizeWithAI'))}>
                                <Sparkles className="mr-2 h-4 w-4" />
                                Categorize with AI
                            </Button>
                        </>
                    ) : (
                        <div className="bg-muted/50 flex items-center gap-3 rounded-lg p-4">
                            <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-full">
                                <LinkIcon className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium">No accounts linked</p>
                                <p className="text-muted-foreground text-xs">
                                    <Link href={route('linkedAccount.edit')} className="text-primary hover:underline">
                                        Connect your accounts
                                    </Link>{' '}
                                    to start tracking transactions automatically.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Summary Cards */}
                <div className="grid gap-6 md:grid-cols-3">
                    <div className="rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 p-6 dark:border-blue-800 dark:from-blue-950/50 dark:to-blue-900/50">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Today</p>
                                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{todayCost}</p>
                            </div>
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400">
                                <DollarSign className="h-6 w-6" />
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border border-green-200 bg-gradient-to-br from-green-50 to-green-100 p-6 dark:border-green-800 dark:from-green-950/50 dark:to-green-900/50">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-green-600 dark:text-green-400">This Week</p>
                                <p className="text-2xl font-bold text-green-900 dark:text-green-100">{weekCost}</p>
                            </div>
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10 text-green-600 dark:text-green-400">
                                <TrendingDown className="h-6 w-6" />
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100 p-6 dark:border-purple-800 dark:from-purple-950/50 dark:to-purple-900/50">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-purple-600 dark:text-purple-400">This Month</p>
                                <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">{monthCost}</p>
                            </div>
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400">
                                <Calendar className="h-6 w-6" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Category Breakdown */}
                {categoryWithAmount.length > 0 && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold">Spending by Category</h2>
                            <p className="text-muted-foreground text-sm">{categoryWithAmount.length} categories</p>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
                            {categoryWithAmount.map((category) => (
                                <div
                                    key={category.category}
                                    className="bg-card hover:bg-accent/50 group relative overflow-hidden rounded-lg border p-4 transition-colors"
                                >
                                    <div className="flex flex-col items-center space-y-3 text-center">
                                        <div className="text-muted-foreground group-hover:text-foreground flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 transition-colors dark:bg-gray-800">
                                            {getCategoryIcon(category.category)}
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-muted-foreground text-xs font-medium">{category.category}</p>
                                            <p className="text-lg font-bold">{category.amount}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Transactions Table */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold">Recent Transactions</h2>
                        <p className="text-muted-foreground text-sm">{categorizedTransactions.length} transactions</p>
                    </div>
                    <div className="bg-card overflow-hidden rounded-xl border shadow-sm">
                        <DataTable columns={gridColumns} data={categorizedTransactions} addCallback={() => setIsAddModalOpen(true)} />
                    </div>
                </div>
            </div>

            {uncategorizedTransactions !== undefined ? (
                <TransactionCategorizationModal
                    transactions={uncategorizedTransactions}
                    categories={categories}
                    isOpen={isCategoryModalOpen}
                    onClose={() => onclose()}
                />
            ) : (
                <></>
            )}

            <AddTransactionModal
                linkedAccounts={linkedAccounts}
                categories={categories}
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
            />
        </AppLayout>
    );
}
