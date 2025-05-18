import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Category, Transaction } from '@/types';
import {
    Utensils,
    ShoppingBag,
    Car,
    PartyPopper,
    Receipt,
    Stethoscope,
    MoreHorizontal, Cog
} from 'lucide-react';

interface TransactionCategorizationModalProps {
    transactions: Transaction[];
    isOpen: boolean;
    onClose: () => void;
    categories: Category[];
}

export function TransactionCategorizationModal({ transactions, isOpen, onClose, categories }: TransactionCategorizationModalProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    if (!transactions.length) {
        return null;
    }

    const currentTransaction = transactions[currentIndex];
    const isLastTransaction = currentIndex === transactions.length - 1;

    const handleCategorySelect = (category_id: number) => {
        currentTransaction.category_id = category_id;
        if (isLastTransaction) {
            onClose();
            setCurrentIndex(0);
        } else {
            setCurrentIndex(prev => prev + 1);
        }
    };

    const getIcon = (categoryName: string) => {
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
                return <Cog className="w-4 h-4 mr-2" />;
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Categorize Transactions</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <Card className="p-4">
                        <div className="space-y-2">
                            <p className="font-medium">{currentTransaction?.merchant_name}</p>
                            <p className="text-sm text-muted-foreground">
                                Amount: ${currentTransaction?.amount}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Date: {new Date(currentTransaction?.date).toLocaleDateString()}
                            </p>
                        </div>
                    </Card>
                    <div className="grid grid-cols-2 gap-2">
                        {
                         categories.map((category) => {
                            const categoryName = category.name;
                            return (
                                <Button
                                    key={category.id}
                                    variant="outline"
                                    onClick={() => handleCategorySelect(category.id)}
                                    className="h-auto py-2 flex items-center justify-center"
                                >
                                    {getIcon(categoryName)}
                                    {categoryName}
                                </Button>
                            )
                         })
                        }

                    </div>
                    <div className="text-sm text-muted-foreground text-center">
                        {currentIndex + 1} of {transactions.length} transactions
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
