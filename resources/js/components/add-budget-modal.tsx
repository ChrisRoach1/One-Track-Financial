import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Category } from '@/types';
import { useForm } from '@inertiajs/react';
import { getCategoryIcon } from './ui/category-icons';

interface AddBudgetModalProps {
    isOpen: boolean;
    onClose: () => void;
    categories: Category[];
}

type BudgetForm = {
    category_id: number;
    max_amount: number;
};

export function AddBudgetModal({ isOpen, onClose, categories }: AddBudgetModalProps) {
    const { data, setData, errors, processing, post, reset } = useForm<Required<BudgetForm>>({
        category_id: 0,
        max_amount: 0
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post(route('budgets.store'), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                onClose();
            }
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={() => {reset(); onClose();}}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add New Budget</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Category Selection */}
                    <div className="space-y-2">
                        <Label htmlFor="category_id">Category</Label>
                        <Select
                            value={data.category_id === 0 ? '' : data.category_id.toString()}
                            onValueChange={(value) => setData('category_id', parseInt(value))}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories?.map((category) => (
                                    <SelectItem key={category.id} value={category.id.toString()}>
                                        <div className="flex items-center gap-2">
                                            {getCategoryIcon(category.name)}
                                            {category.name}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.category_id && <p className="text-sm text-red-500">{errors.category_id}</p>}
                    </div>

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
                                value={data.max_amount === 0 ? '' : data.max_amount}
                                onChange={(e) => setData('max_amount', parseFloat(e.target.value) || 0)}
                            />
                        </div>
                        {errors.max_amount && <p className="text-sm text-red-500">{errors.max_amount}</p>}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={onClose} disabled={processing}>
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing || !data.category_id || data.category_id === 0 || !data.max_amount || data.max_amount <= 0}
                        >
                            {processing ? 'Creating...' : 'Create Budget'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
