import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Category, Transaction, type BreadcrumbItem } from '@/types';

import { Head, router, Link } from '@inertiajs/react';
import { TransactionCategorizationModal } from '@/components/transaction-categorization-modal';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
  import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
  } from "@tanstack/react-table"
import {
    Utensils,
    ShoppingBag,
    Car,
    PartyPopper,
    Receipt,
    Stethoscope,
    MoreHorizontal,
    RefreshCw,
    Link as LinkIcon
} from 'lucide-react';

interface DataTableProps<TData, TValue> {
columns: ColumnDef<TData, TValue>[]
data: TData[]
}

export const gridColumns: ColumnDef<Transaction>[] = [
    {
      accessorKey: "amount",
      header: "Amount",
    },
    {
      accessorKey: "date",
      header: "Date",
    },
    {
      accessorKey: "merchant_name",
      header: "Merchant",
    },
    {
        accessorKey: "linked_account.institution_name",
        header: "Institution",
    },
    {
        accessorKey: "linked_account.account_mask",
        header: "Account #",
    },
    {
        accessorKey: "category.name",
        header: "Category",
    },
  ]

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

interface props{
    uncategorizedTransactions: Transaction[];
    categories: Category[];
    categorizedTransactions: Transaction[];
    todayCost: string;
    weekCost: string;
    monthCost: string;
    categoryWithAmount: CategoryWithAmount[];
    hasLinkedAccounts: boolean;
}

interface CategoryWithAmount{
    category: string;
    amount: string;
}

export function DataTable<TData, TValue>({
    columns,
    data,
  }: DataTableProps<TData, TValue>) {
    const table = useReactTable({
      data,
      columns,
      getCoreRowModel: getCoreRowModel(),
    })

    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    )
  }

const getCategoryIcon = (categoryName: string) => {
    switch(categoryName) {
        case 'Food & Dining':
            return <Utensils className="w-4 h-4 mr-2" />;
        case 'Shopping':
            return <ShoppingBag className="w-4 h-4 mr-2" />;
        case 'Transportation':
            return <Car className="w-4 h-4 mr-2" />;
        case 'Entertainment':
            return <PartyPopper className="w-4 h-4 mr-2" />;
        case 'Bills & Utilities':
            return <Receipt className="w-4 h-4 mr-2" />;
        case 'Healthcare':
            return <Stethoscope className="w-4 h-4 mr-2" />;
        case 'Other':
            return <MoreHorizontal className="w-4 h-4 mr-2" />;
        default:
            return null;
    }
};

export default function Dashboard({uncategorizedTransactions, categories, categorizedTransactions, todayCost, weekCost, monthCost, categoryWithAmount, hasLinkedAccounts} : props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    console.log(categoryWithAmount)
    function onclose(){
        setIsModalOpen(false);
        const updatedTransactions = uncategorizedTransactions.filter(x => x.category_id !== null);

        axios.post(route('transactions.update'),{updatedTransactions}).then(() =>{
            router.reload();
        });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex items-center gap-4 m-3">
                {(uncategorizedTransactions !== null && uncategorizedTransactions.length > 0) ?
                <Button variant={'default'} onClick={() => setIsModalOpen(true)}>View {uncategorizedTransactions.length} New Transactions</Button>
                : <></>}

                {hasLinkedAccounts ? (
                    <Button className="flex items-center gap-2" onClick={() => router.get(route('transactions.store'))}>
                        <RefreshCw className="w-4 h-4" />
                        Sync Transactions
                    </Button>
                ) : (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <LinkIcon className="w-4 h-4" />
                        <span>No accounts linked. </span>
                        <Link href={route('linkedAccount.edit')} className="text-primary hover:underline">
                            Link your accounts
                        </Link>
                        <span> to start tracking transactions.</span>
                    </div>
                )}
            </div>
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-3 m-3 bg-card">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border">
                        <div className="flex h-full flex-col items-center justify-center p-4">
                            <h1 className="text-lg font-medium text-muted-foreground">Today</h1>
                            <p className="mt-2 text-3xl font-bold">{todayCost}</p>
                        </div>
                    </div>
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border">
                        <div className="flex h-full flex-col items-center justify-center p-4">
                            <h1 className="text-lg font-medium text-muted-foreground">This Week</h1>
                            <p className="mt-2 text-3xl font-bold">{weekCost}</p>
                        </div>
                    </div>
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border">
                        <div className="flex h-full flex-col items-center justify-center p-4">
                            <h1 className="text-lg font-medium text-muted-foreground">This Month</h1>
                            <p className="mt-2 text-3xl font-bold">{monthCost}</p>
                        </div>
                    </div>
                </div>
                <div className="grid auto-rows-min gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
                    {categoryWithAmount.map((category) => (
                        <div key={category.category} className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-[4/3] overflow-hidden rounded-xl border">
                            <div className="flex h-full flex-col items-center justify-center p-2 sm:p-4">
                                <div className="flex items-center">
                                    {getCategoryIcon(category.category)}
                                    <h1 className="text-xs sm:text-sm font-medium text-muted-foreground">{category.category}</h1>
                                </div>
                                <p className="mt-1 sm:mt-2 text-lg sm:text-xl font-bold">{category.amount}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
                    <DataTable columns={gridColumns} data={categorizedTransactions} />
                </div>
            </div>

            {
            uncategorizedTransactions !== undefined ?
            <TransactionCategorizationModal
            transactions={uncategorizedTransactions}
            categories={categories}
            isOpen={isModalOpen}
            onClose={() => onclose()}/>
            : <></>
            }

        </AppLayout>
    );
}
