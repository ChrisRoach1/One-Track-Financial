import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Category, LinkedAccount } from '@/types';
import { useForm } from '@inertiajs/react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from './ui/calendar';
import { getCategoryIcon } from './ui/category-icons';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

interface TransactionCategorizationModalProps {
    isOpen: boolean;
    onClose: () => void;
    categories: Category[];
    linkedAccounts: LinkedAccount[];
}

type TransactionForm = {
    date: Date | undefined;
    amount: number;
    merchant: string;
    category_id: number;
    linked_account_id: number;
};

export function AddTransactionModal({ isOpen, onClose, categories, linkedAccounts }: TransactionCategorizationModalProps) {
    const { data, setData, errors, processing, post, reset } = useForm<Required<TransactionForm>>({
        date: undefined,
        amount: 0,
        merchant: '',
        category_id: 0,
        linked_account_id: 0
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post(route('transactions.store'), {
            preserveScroll: true,
        });

        reset();
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Add New Transaction</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-3">
                    <div>
                        {/* Date Field */}
                        <div className="space-y-2">
                            <Label htmlFor="date">Date</Label>
                            <Popover modal={true}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={'outline'}
                                        className={cn('w-full justify-start text-left font-normal', !data.date && 'text-muted-foreground')}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {data.date ? format(data.date, 'PPP') : <span>Pick a date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent>
                                    <Calendar mode="single" selected={data.date} onSelect={(value) => setData('date', value)} initialFocus />
                                </PopoverContent>
                            </Popover>
                            {errors.date && <p className="text-sm text-red-500">{errors.date}</p>}
                        </div>

                        {/* Amount Field */}
                        <div className="space-y-2">
                            <Label htmlFor="amount">Amount ($)</Label>
                            <Input
                                id="amount"
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder="0.00"
                                value={data.amount || ''}
                                onChange={(e) => setData('amount', parseFloat(e.target.value) || 0)}
                                className="w-full"
                            />
                            {errors.amount && <p className="text-sm text-red-500">{errors.amount}</p>}
                        </div>

                        {/* Merchant Field */}
                        <div className="space-y-2">
                            <Label htmlFor="merchant">Merchant</Label>
                            <Input
                                id="merchant"
                                type="text"
                                placeholder="Enter merchant name"
                                value={data.merchant}
                                onChange={(e) => setData('merchant', e.target.value)}
                                className="w-full"
                            />
                            {errors.merchant && <p className="text-sm text-red-500">{errors.merchant}</p>}
                        </div>

                        {/* Linked Account Field */}
                        <div className="space-y-2">
                            <Label htmlFor="linked_account_id">Account</Label>
                            <Select
                                value={data.linked_account_id === 0 ? '' : data.linked_account_id.toString()}
                                onValueChange={(value) => setData('linked_account_id', parseInt(value))}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select an account" />
                                </SelectTrigger>
                                <SelectContent>
                                    {linkedAccounts.map((account) => (
                                        <SelectItem key={account.id} value={account.id.toString()}>
                                            {account.account_name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.linked_account_id && <p className="text-sm text-red-500">{errors.linked_account_id}</p>}
                        </div>
                    </div>

                    {/* Quick Category Selection */}
                    <div className="border-t pt-4">
                        <Label className="mb-3 block text-sm font-medium">Category Selection</Label>
                        <div className="grid grid-cols-2 gap-2">
                            {categories.map((category) => (
                                <Button
                                    key={category.id}
                                    type="button"
                                    variant={data.category_id === category.id ? 'default' : 'outline'}
                                    className="flex h-auto items-center justify-start gap-2 py-2"
                                    onClick={() => setData('category_id', category.id)}
                                >
                                    {getCategoryIcon(category.name)}
                                    <span className="text-sm">{category.name}</span>
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3">
                        <Button type="button" variant="outline" onClick={onClose} disabled={processing}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing || !data.merchant || !data.amount || !data.category_id || data.category_id === 0 || !data.linked_account_id || data.linked_account_id === 0}>
                            {processing ? 'Adding...' : 'Add Transaction'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
