import { Utensils, ShoppingBag, Car, PartyPopper, Receipt, Stethoscope, MoreHorizontal, Cog } from "lucide-react";

export const getCategoryIcon = (categoryName: string) => {
    switch(categoryName) {
        case 'Food & Dining':
            return <Utensils className="w-4 h-4" />;
        case 'Shopping':
            return <ShoppingBag className="w-4 h-4" />;
        case 'Transportation':
            return <Car className="w-4 h-4" />;
        case 'Entertainment':
            return <PartyPopper className="w-4 h-4" />;
        case 'Bills & Utilities':
            return <Receipt className="w-4 h-4" />;
        case 'Healthcare':
            return <Stethoscope className="w-4 h-4" />;
        case 'Other':
            return <MoreHorizontal className="w-4 h-4" />;
        default:
            return <Cog className="w-4 h-4" />;
    }
};
