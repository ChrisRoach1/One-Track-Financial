import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Budget } from '@/types';
import { router, useForm } from '@inertiajs/react';
import { getCategoryIcon } from './ui/category-icons';
import { Trash2 } from 'lucide-react';

interface BudgetWithSpending extends Budget {
    spent_amount: number;
    remaining_amount: number;
    percentage_used: number;
}

interface EditBudgetModalProps {
    isOpen: boolean;
    onClose: () => void;
    budget: BudgetWithSpending;
}

type BudgetUpdateForm = {
    max_amount: number;
};

export function EditBudgetModal({ isOpen, onClose, budget }: EditBudgetModalProps) {
    const { data, setData, errors, processing, put } = useForm<Required<BudgetUpdateForm>>({
        max_amount: budget.max_amount
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('budgets.update', budget.id), {
            preserveScroll: true,
            onSuccess: () => {
                onClose();
            }
        });
    };

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this budget?')) {
            router.delete(route('budgets.destroy', budget.id), {
                preserveScroll: true,
                onSuccess: () => {
                    onClose();
                }
            });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px] max-w-[95vw]">
                <DialogHeader>
                    <DialogTitle>Edit Budget</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Category Info */}
                    <div className="flex items-center gap-3 p-3 sm:p-4 bg-muted/50 rounded-lg">
                        <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-background flex-shrink-0">
                            {getCategoryIcon(budget.category.name)}
                        </div>
                        <div className="min-w-0 flex-1">
                            <h3 className="font-semibold text-sm sm:text-base">{budget.category.name}</h3>
                            <p className="text-xs sm:text-sm text-muted-foreground break-words">
                                ${budget.spent_amount.toFixed(2)} spent this month ({budget.percentage_used.toFixed(0)}% of budget)
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Budget Amount */}
                        <div className="space-y-2">
                            <Label htmlFor="max_amount">Monthly Budget Amount</Label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
                                <Input
                                    id="max_amount"
                                    type="number"
                                    placeholder="0.00"
                                    className="pl-8"
                                    step="0.01"
                                    min="0"
                                    value={data.max_amount}
                                    onChange={(e) => setData('max_amount', parseFloat(e.target.value) || 0)}
                                />
                            </div>
                            {errors.max_amount && <p className="text-sm text-red-500">{errors.max_amount}</p>}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row sm:justify-between gap-3 pt-4">
                            <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={handleDelete}
                                disabled={processing}
                                className="w-full sm:w-auto"
                            >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Budget
                            </Button>

                            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                                <Button type="button" variant="outline" onClick={onClose} disabled={processing} className="w-full sm:w-auto">
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={processing || !data.max_amount || data.max_amount <= 0}
                                    className="w-full sm:w-auto"
                                >
                                    {processing ? 'Updating...' : 'Update Budget'}
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
}
