import { Head, router } from '@inertiajs/react';
import { PlusIcon, Trash2Icon } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import HeadingSmall from '@/components/heading-small';
import { LinkedAccount, type BreadcrumbItem } from '@/types';
import {
    usePlaidLink,
    PlaidLinkOptions,
} from 'react-plaid-link';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { useForm } from '@inertiajs/react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Linked Accounts',
        href: '/settings/LinkedAccounts',
    },
];

interface props {
    linkedAccounts: LinkedAccount[];
    linkToken: string;
}

export default function LinkedAccountsPage({ linkedAccounts, linkToken }: props) {
    const { data, post } = useForm<{
        token: string;
        institution_name: string;
        accounts: Array<{
            name: string;
            mask: string;
        }>;
    }>({
        token: '',
        institution_name: '',
        accounts: [],
    });

    const config: PlaidLinkOptions = {
        onSuccess: (public_token, metadata) => {
            // Extract the necessary data from metadata
            const institutionName = metadata.institution?.name || '';
            const accounts = metadata.accounts.map(account => ({
                name: account.name,
                mask: account.mask,
            }));
            data.token = public_token;
            data.institution_name = institutionName;
            data.accounts = accounts;
            // Submit the form
            post(route('linkedAccount.store'), {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success("Account Linked!");
                }
            });
        },
        onExit: () => {
            // Handle exit if needed
        },
        onEvent: () => {
            // Handle events if needed
        },
        token: linkToken,
    };

    const { open } = usePlaidLink(config);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Linked Accounts" />

            <SettingsLayout>
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <HeadingSmall title="Linked Accounts" description="Update your linked bank accounts" />
                        <Button variant="default" size="sm" onClick={() => open()}>
                            <PlusIcon className="size-4" />
                            Add Account
                        </Button>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
                        {linkedAccounts?.map((account) => (
                            <Card key={account.id}>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        {account.institution_name}
                                    </CardTitle>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                        onClick={() => {
                                            router.delete(route('linkedAccount.destroy', account.id), {
                                                preserveScroll: true,
                                                onSuccess: () => {
                                                    toast.success("Account delete!");
                                                }
                                            });
                                        }}
                                    >
                                        <Trash2Icon className="size-4" />
                                    </Button>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{account.account_name}</div>
                                    <p className="text-xs text-muted-foreground">
                                        •••• {account.account_mask}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {linkedAccounts.length === 0 && (
                        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                            <p className="text-sm text-muted-foreground">
                                No linked accounts found. Click the "Add Account" button to get started.
                            </p>
                        </div>
                    )}
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
