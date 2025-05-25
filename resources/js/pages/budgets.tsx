import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, Category, Budget } from '@/types';
import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { getCategoryIcon } from '@/components/ui/category-icons';
import { Plus, Target, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { AddBudgetModal } from '@/components/add-budget-modal';
import { EditBudgetModal } from '@/components/edit-budget-modal';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Budgets',
        href: '/budgets',
    },
];

interface BudgetWithSpending extends Budget {
    spent_amount: number;
    remaining_amount: number;
    percentage_used: number;
}

interface props {
    budgets: BudgetWithSpending[];
    categories: Category[];
    totalBudgeted: string;
    totalSpent: string;
    totalRemaining: string;
}

export default function Budgets({ budgets, categories, totalBudgeted, totalSpent, totalRemaining }: props) {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedBudget, setSelectedBudget] = useState<BudgetWithSpending | null>(null);

    const handleEditBudget = (budget: BudgetWithSpending) => {
        setSelectedBudget(budget);
        setIsEditModalOpen(true);
    };

    const getStatusBadge = (percentage: number) => {
        if (percentage >= 100) {
            return (
                <Badge variant="destructive" className="flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    Over Budget
                </Badge>
            );
        }
        if (percentage >= 80) {
            return (
                <Badge variant="secondary" className="flex items-center gap-1 bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400">
                    <TrendingUp className="h-3 w-3" />
                    Near Limit
                </Badge>
            );
        }
        return (
            <Badge variant="secondary" className="flex items-center gap-1 bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                <CheckCircle className="h-3 w-3" />
                On Track
            </Badge>
        );
    };

    const categoriesWithoutBudgets = categories?.filter(
        category => !budgets?.some(budget => budget.category_id === category.id)
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Budgets" />

            <div className="p-4 space-y-6">
                {/* Header Section */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Budget Management</h1>
                        <p className="text-muted-foreground mt-2">Set spending limits and track your progress for the month</p>
                    </div>
                    <Button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Add Budget
                    </Button>
                </div>

                {/* Summary Cards */}
                <div className="grid gap-6 md:grid-cols-3">
                    <div className="rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 p-6 dark:border-blue-800 dark:from-blue-950/50 dark:to-blue-900/50">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Budgeted</p>
                                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">${totalBudgeted}</p>
                            </div>
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400">
                                <Target className="h-6 w-6" />
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border border-green-200 bg-gradient-to-br from-green-50 to-green-100 p-6 dark:border-green-800 dark:from-green-950/50 dark:to-green-900/50">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-green-600 dark:text-green-400">Total Spent</p>
                                <p className="text-2xl font-bold text-green-900 dark:text-green-100">${totalSpent}</p>
                            </div>
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10 text-green-600 dark:text-green-400">
                                <TrendingUp className="h-6 w-6" />
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100 p-6 dark:border-purple-800 dark:from-purple-950/50 dark:to-purple-900/50">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Remaining</p>
                                <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">${totalRemaining}</p>
                            </div>
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400">
                                <CheckCircle className="h-6 w-6" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Budgets List */}
                {budgets?.length > 0 ? (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold">Your Budgets</h2>
                            <p className="text-muted-foreground text-sm">{budgets.length} active budgets</p>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                            {budgets?.map((budget) => (
                                <Card key={budget.id} className="p-6 hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleEditBudget(budget)}>
                                    <div className="space-y-4">
                                        {/* Header */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                                                    {getCategoryIcon(budget.category.name)}
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold">{budget.category.name}</h3>
                                                    <p className="text-sm text-muted-foreground">Monthly Budget</p>
                                                </div>
                                            </div>
                                            {getStatusBadge(budget.percentage_used)}
                                        </div>

                                        {/* Progress */}
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span>${budget.spent_amount?.toFixed(2)} spent</span>
                                                <span>${budget.max_amount?.toFixed(2)} budgeted</span>
                                            </div>
                                            <Progress
                                                value={Math.min(budget.percentage_used, 100)}
                                                className="h-2"
                                            />
                                            <div className="flex justify-between text-xs text-muted-foreground">
                                                <span>{budget.percentage_used?.toFixed(0)}% used</span>
                                                <span className={budget.remaining_amount < 0 ? "text-red-600" : ""}>
                                                    ${Math.abs(budget.remaining_amount).toFixed(2)} {budget.remaining_amount < 0 ? 'over' : 'remaining'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                            <Target className="h-10 w-10 text-gray-400" />
                        </div>
                        <h3 className="mt-4 text-lg font-semibold">No budgets yet</h3>
                        <p className="text-muted-foreground mt-2">Get started by creating your first budget to track your spending.</p>
                        <Button onClick={() => setIsAddModalOpen(true)} className="mt-4">
                            <Plus className="mr-2 h-4 w-4" />
                            Create Your First Budget
                        </Button>
                    </div>
                )}

                {/* Categories without budgets */}
                {categoriesWithoutBudgets?.length > 0 && (
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold">Categories Without Budgets</h2>
                        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
                            {categoriesWithoutBudgets?.map((category) => (
                                <Card
                                    key={category.id}
                                    className="p-4">
                                    <div className="flex flex-col items-center text-center space-y-2">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                                            {getCategoryIcon(category.name)}
                                        </div>
                                        <p className="text-sm font-medium">{category.name}</p>
                                        <p className="text-xs text-muted-foreground">No budget set</p>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <AddBudgetModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                categories={categoriesWithoutBudgets}
            />

            {selectedBudget && (
                <EditBudgetModal
                    isOpen={isEditModalOpen}
                    onClose={() => {
                        setIsEditModalOpen(false);
                        setSelectedBudget(null);
                    }}
                    budget={selectedBudget}
                />
            )}
        </AppLayout>
    );
}
