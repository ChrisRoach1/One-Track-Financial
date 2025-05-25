import { FormEventHandler } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Category, type BreadcrumbItem } from '@/types';

import { Head, router, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import InputError from '@/components/input-error';
import { Label } from '@/components/ui/label';
import { Transition } from '@headlessui/react';
import { Cog, Plus, Trash2 } from 'lucide-react';


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Custom Categories',
        href: '/custom-categories',
    },
];

interface props {
    existingCustomCategories: Category[];
}

type CategoryForm = {
    name: string;
}

export default function CustomCategory({existingCustomCategories}:props) {
    const { data, setData, errors, post, recentlySuccessful, processing, reset } = useForm<Required<CategoryForm>>({
        name: ''
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('category.store'), {
            preserveScroll: true,
        });
        reset('name');
        router.flushAll();
    };

    const destroy = (id: number) =>{
        router.delete(route('category.destroy', id), {preserveScroll: true});
        router.flushAll();
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Custom Categories" />

            <div className="p-4 space-y-6">
                {/* Header Section */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Custom Categories</h1>
                        <p className="text-muted-foreground mt-2">Create and manage your custom spending categories</p>
                    </div>
                </div>

                {/* Add New Category Section */}
                <div className="bg-card overflow-hidden rounded-xl border shadow-sm">
                    <div className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                                <Plus className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <h2 className="text-lg font-semibold">Add New Category</h2>
                        </div>
                        <form onSubmit={submit} className="flex items-end gap-4">
                            <div className="flex-1">
                                <Label htmlFor="name" className="text-sm font-medium mb-1 block">Custom Category Name</Label>
                                <Input
                                    id="name"
                                    className="w-full"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                    autoComplete="name"
                                    placeholder="Enter category name"
                                />
                                <InputError className="mt-1" message={errors.name} />
                            </div>

                            <div className="flex items-center gap-4">
                                <Button disabled={processing} className="h-10">Save</Button>

                                <Transition
                                    show={recentlySuccessful}
                                    enter="transition ease-in-out"
                                    enterFrom="opacity-0"
                                    leave="transition ease-in-out"
                                    leaveTo="opacity-0"
                                >
                                    <p className="text-sm text-muted-foreground">Saved</p>
                                </Transition>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Categories List */}
                {existingCustomCategories?.length > 0 ? (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold">Your Categories</h2>
                            <p className="text-muted-foreground text-sm">{existingCustomCategories.length} categories</p>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
                            {existingCustomCategories.map((category) => (
                                <div
                                    key={category.id}
                                    className="bg-card hover:bg-accent/50 group relative overflow-hidden rounded-lg border p-4 transition-colors"
                                >
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="absolute top-2 right-2 h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/20"
                                        onClick={() => destroy(category.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                    <div className="flex flex-col items-center space-y-3 text-center">
                                        <div className="text-muted-foreground group-hover:text-foreground flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 transition-colors dark:bg-gray-800">
                                            <Cog className="w-5 h-5" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium">{category.name}</p>
                                            <p className="text-xs text-muted-foreground">Custom Category</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                            <Cog className="h-10 w-10 text-gray-400" />
                        </div>
                        <h3 className="mt-4 text-lg font-semibold">No custom categories yet</h3>
                        <p className="text-muted-foreground mt-2">Create your first custom category to better organize your transactions.</p>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
