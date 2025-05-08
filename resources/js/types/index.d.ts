import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';
import { ColumnDef } from "@tanstack/react-table"

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface LinkedAccount{
    id: number;
    user_id: number;
    institution_name: string;
    account_name: string;
    account_mask: string;
}

export interface Category{
    id: number;
    name: string;
    user_id: number;
    is_custom: boolean;
    icon_name: string;
}


export interface Transaction{
    id: number;
    user_id:number;
    linked_account_id:number;
    linked_ccount: LinkedAccount;
    amount: string;
    currency: string;
    date: Date;
    merchant_name: string;
    category_id: number;
    created_date: Date;
    logo_url: string;
    transaction_id: string;
    update_date: Date;
    category: Category;
}


