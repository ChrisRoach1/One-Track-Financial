import { Utensils, ShoppingBag, Car, PartyPopper, Receipt, Stethoscope, MoreHorizontal, Cog } from "lucide-react";

export const getCategoryIcon = (categoryName: string) => {
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