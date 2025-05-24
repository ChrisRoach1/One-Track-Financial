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
import { Download, Link as LinkIcon, RefreshCw, Sparkles } from 'lucide-react';
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
            <div className="m-3 flex items-center gap-4">
                {uncategorizedTransactions !== null && uncategorizedTransactions.length > 0 ? (
                    <Button variant={'default'} onClick={() => setIsCategoryModalOpen(true)}>
                        View {uncategorizedTransactions.length} New Transactions
                    </Button>
                ) : (
                    <></>
                )}

                {hasLinkedAccounts ? (
                    <>
                        <Button className="flex items-center gap-2" onClick={() => router.get(route('transactions.sync'))}>
                            <RefreshCw className="h-4 w-4" />
                            Sync Transactions
                        </Button>
                        <Button className="flex items-center gap-2" onClick={() => router.post(route('transactions.categorizeWithAI'))}>
                            <Sparkles className="h-4 w-4" />
                            Categorize with AI
                        </Button>
                    </>
                ) : (
                    <div className="text-muted-foreground flex items-center gap-2 text-sm">
                        <LinkIcon className="h-4 w-4" />
                        <span>No accounts linked. </span>
                        <Link href={route('linkedAccount.edit')} className="text-primary hover:underline">
                            Link your accounts
                        </Link>
                        <span> to start tracking transactions.</span>
                    </div>
                )}
            </div>
            <div className="bg-card m-3 flex h-full flex-1 flex-col gap-4 rounded-xl p-3 shadow-sm">
                <div className="mb-2 flex flex-wrap items-center gap-4">
                    <div className="flex gap-4">
                        <Select value={currentMonth} onValueChange={handleMonthChange}>
                            <SelectTrigger className="md:w-[180px]">
                                <SelectValue placeholder="Select month" />
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
                            <SelectTrigger className="md:w-[180px]">
                                <SelectValue placeholder="Select year" />
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
                    <Button variant="outline" onClick={downloadExcel} className="flex items-center gap-2 whitespace-nowrap">
                        <Download className="h-4 w-4" />
                        Export to Excel
                    </Button>
                </div>
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border">
                        <div className="flex h-full flex-col items-center justify-center p-4">
                            <h1 className="text-muted-foreground text-lg font-medium">Today</h1>
                            <p className="mt-2 text-3xl font-bold">{todayCost}</p>
                        </div>
                    </div>
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border">
                        <div className="flex h-full flex-col items-center justify-center p-4">
                            <h1 className="text-muted-foreground text-lg font-medium">This Week</h1>
                            <p className="mt-2 text-3xl font-bold">{weekCost}</p>
                        </div>
                    </div>
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border">
                        <div className="flex h-full flex-col items-center justify-center p-4">
                            <h1 className="text-muted-foreground text-lg font-medium">This Month</h1>
                            <p className="mt-2 text-3xl font-bold">{monthCost}</p>
                        </div>
                    </div>
                </div>
                <div className="grid auto-rows-min grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
                    {categoryWithAmount.map((category) => (
                        <div
                            key={category.category}
                            className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-[4/3] overflow-hidden rounded-xl border"
                        >
                            <div className="flex h-full flex-col items-center justify-center p-2 sm:p-4">
                                <div className="flex items-center">
                                    {getCategoryIcon(category.category)}
                                    <h1 className="text-muted-foreground text-xs font-medium sm:text-sm">{category.category}</h1>
                                </div>
                                <p className="mt-1 text-lg font-bold sm:mt-2 sm:text-xl">{category.amount}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
                    <DataTable columns={gridColumns} data={categorizedTransactions} addCallback={() => setIsAddModalOpen(true)} />
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
