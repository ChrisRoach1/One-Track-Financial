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

            <div className="p-6 space-y-8">
                {/* Header Section */}
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1">
                        <h1 className="text-4xl font-bold tracking-tight">Budgets</h1>
                        <p className="text-muted-foreground text-lg">Set spending limits and track your progress for the month</p>
                    </div>
                    <Button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Add Budget
                    </Button>
                </div>

                {/* Summary Cards */}
                <div className="grid gap-6 md:grid-cols-3">
                    <Card className="p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">Total Budgeted</p>
                                <p className="text-3xl font-bold">${totalBudgeted}</p>
                            </div>
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                                <Target className="h-6 w-6" />
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">Total Spent</p>
                                <p className="text-3xl font-bold">${totalSpent}</p>
                            </div>
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary/50 text-secondary-foreground">
                                <TrendingUp className="h-6 w-6" />
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">Remaining</p>
                                <p className="text-3xl font-bold">${totalRemaining}</p>
                            </div>
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
                                <CheckCircle className="h-6 w-6" />
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Budgets List */}
                {budgets?.length > 0 ? (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-semibold tracking-tight">Your Budgets</h2>
                                <p className="text-muted-foreground text-sm mt-1">{budgets.length} active budgets this month</p>
                            </div>
                        </div>
                        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                            {budgets?.map((budget) => (
                                <Card key={budget.id} className="p-6 hover:shadow-lg transition-all hover:scale-105 cursor-pointer" onClick={() => handleEditBudget(budget)}>
                                    <div className="space-y-4">
                                        {/* Header */}
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary flex-shrink-0">
                                                    {getCategoryIcon(budget.category.name)}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <h3 className="font-semibold text-lg truncate">{budget.category.name}</h3>
                                                    <p className="text-sm text-muted-foreground">Monthly Budget</p>
                                                </div>
                                            </div>
                                            <div className="flex-shrink-0">
                                                {getStatusBadge(budget.percentage_used)}
                                            </div>
                                        </div>

                                        {/* Progress */}
                                        <div className="space-y-3">
                                            <div className="flex justify-between text-sm font-medium">
                                                <span>${budget.spent_amount?.toFixed(2)} spent</span>
                                                <span>${budget.max_amount?.toFixed(2)} budgeted</span>
                                            </div>
                                            <Progress
                                                value={Math.min(budget.percentage_used, 100)}
                                                className="h-3"
                                            />
                                            <div className="flex justify-between text-xs text-muted-foreground">
                                                <span>{budget.percentage_used?.toFixed(0)}% used</span>
                                                <span className={budget.remaining_amount < 0 ? "text-destructive font-medium" : "text-muted-foreground"}>
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
                    <Card className="p-12">
                        <div className="text-center">
                            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
                                <Target className="h-10 w-10" />
                            </div>
                            <h3 className="mt-6 text-xl font-semibold">No budgets yet</h3>
                            <p className="text-muted-foreground mt-2 max-w-sm mx-auto">Get started by creating your first budget to track your spending and reach your financial goals.</p>
                            <Button onClick={() => setIsAddModalOpen(true)} className="mt-6">
                                <Plus className="mr-2 h-4 w-4" />
                                Create Your First Budget
                            </Button>
                        </div>
                    </Card>
                )}

                {/* Categories without budgets */}
                {categoriesWithoutBudgets?.length > 0 && (
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-2xl font-semibold tracking-tight">Categories Without Budgets</h2>
                            <p className="text-muted-foreground text-sm mt-1">Click any category to create a budget</p>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
                            {categoriesWithoutBudgets?.map((category) => (
                                <Card
                                    key={category.id}
                                    className="group relative overflow-hidden p-6 transition-all hover:shadow-lg hover:scale-105 cursor-pointer"
                                    onClick={() => setIsAddModalOpen(true)}>
                                    <div className="flex flex-col items-center text-center space-y-3">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                            {getCategoryIcon(category.name)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">{category.name}</p>
                                            <p className="text-xs text-muted-foreground">No budget set</p>
                                        </div>
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
