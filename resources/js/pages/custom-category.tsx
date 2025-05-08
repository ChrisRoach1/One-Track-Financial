import { FormEventHandler } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Category, type BreadcrumbItem } from '@/types';

import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import InputError from '@/components/input-error';
import { Label } from '@/components/ui/label';
import { Transition } from '@headlessui/react';
import { Cog } from 'lucide-react';


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
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Custom Categories" />

            <div className="mx-auto px-4 sm:px-6 lg:px-8 mt-6">
                <div className="rounded-lg shadow-sm p-6 mb-8 bg-card border">
                    <h2 className="text-lg font-semibold mb-4 text-foreground">Add New Category</h2>
                    <form onSubmit={submit} className="flex items-end gap-4">
                        <div className="flex-1">
                            <Label htmlFor="name" className="text-sm font-medium mb-1 block text-foreground">Custom Category Name</Label>
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

                <div className="rounded-lg shadow-sm p-6 bg-card border">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-foreground">Your Categories</h2>
                        <span className="text-sm text-muted-foreground">{existingCustomCategories.length} categories</span>
                    </div>

                    <div className="grid auto-rows-min gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7">
                        {existingCustomCategories.map((category) => (
                            <div
                                key={category.id}
                                className="group border relative aspect-[4/3] overflow-hidden rounded-xl transition-colors duration-200 bg-card hover:bg-accent"
                            >
                                <div className="flex h-full flex-col items-center justify-center p-4">
                                    <div className="flex items-center">
                                        <Cog className="w-4 h-4 mr-2 text-muted-foreground transition-colors duration-200" />
                                        <h3 className="text-sm font-medium text-foreground truncate max-w-[120px]">{category.name}</h3>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
