import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChartBarIcon, CreditCardIcon, LockIcon, ArrowRightIcon, BanknoteIcon, ChartPieIcon, LucideIcon, Monitor, Moon, Sun } from 'lucide-react';
import { Appearance, useAppearance } from '@/hooks/use-appearance';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    const { appearance, updateAppearance } = useAppearance();

    const options: { value: Appearance; icon: LucideIcon; label: string }[] = [
        { value: 'light', icon: Sun, label: 'Light' },
        { value: 'dark', icon: Moon, label: 'Dark' },
        { value: 'system', icon: Monitor, label: 'System' },
    ];

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>

            <div className="flex min-h-screen flex-col bg-background text-foreground">
                {/* Navigation */}
                <nav className="fixed w-full border-b bg-background/80 backdrop-blur-sm">
                    <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center gap-2">
                            <BanknoteIcon className="h-8 w-8 text-primary" />
                            <span className="text-xl font-semibold">OneTrack</span>
                        </div>
                        <div className="flex items-center gap-4">
                            {auth.user ? (
                                <>
                                    <Button asChild variant="default">
                                        <Link href={route('dashboard')}>
                                            Dashboard
                                            <ArrowRightIcon className="ml-2 h-4 w-4" />
                                        </Link>
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button asChild variant="ghost">
                                        <Link href={route('login')}>Log in</Link>
                                    </Button>
                                    <Button asChild>
                                        <Link href={route('register')}>Get Started</Link>
                                    </Button>
                                </>
                            )}
                                    <TooltipProvider>
                                        <ToggleGroup type="single" value={appearance} onValueChange={updateAppearance} variant="outline">
                                            {options.map((option) => (
                                                <Tooltip key={option.value}>
                                                    <TooltipTrigger asChild>
                                                        <ToggleGroupItem value={option.value} size="sm">
                                                            <option.icon className="h-4 w-4" />
                                                        </ToggleGroupItem>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>{option.label}</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            ))}
                                        </ToggleGroup>
                                    </TooltipProvider>
                        </div>
                    </div>
                </nav>

                {/* Hero Section */}
                <section className="flex min-h-screen flex-col items-center justify-center px-4 pt-16 text-center">
                    <div className="mx-auto max-w-3xl">
                        <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-6xl">
                            Your finances, unified and{' '}
                            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                                simplified
                            </span>
                        </h1>
                        <p className="mb-8 text-xl text-muted-foreground">
                            Connect all your accounts in one place. Track spending, monitor growth, and take control of your
                            financial future with powerful insights.
                        </p>
                        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                            <Button asChild size="lg" className="min-w-[200px]">
                                <Link href={route('register')}>Start for Free</Link>
                            </Button>
                            <Button asChild size="lg" variant="outline" className="min-w-[200px]">
                                <Link href="#features">Learn More</Link>
                            </Button>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="py-24">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <h2 className="mb-12 text-center text-3xl font-bold">Everything you need to track your finances</h2>
                        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                            <Card className="p-6">
                                <CreditCardIcon className="mb-4 h-12 w-12 text-primary" />
                                <h3 className="mb-2 text-xl font-semibold">Account Integration</h3>
                                <p className="text-muted-foreground">
                                    Securely connect your bank accounts, credit cards, and investment portfolios using Plaid.
                                </p>
                            </Card>
                            <Card className="p-6">
                                <ChartBarIcon className="mb-4 h-12 w-12 text-primary" />
                                <h3 className="mb-2 text-xl font-semibold">Transaction Tracking</h3>
                                <p className="text-muted-foreground">
                                    Automatically categorize and track all your transactions in real-time.
                                </p>
                            </Card>
                            <Card className="p-6">
                                <ChartPieIcon className="mb-4 h-12 w-12 text-primary" />
                                <h3 className="mb-2 text-xl font-semibold">Spending Analytics</h3>
                                <p className="text-muted-foreground">
                                    Get detailed insights into your spending patterns with beautiful visualizations.
                                </p>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* Security Section */}
                <section className="border-t bg-muted/50 py-24">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col items-center text-center">
                            <LockIcon className="mb-6 h-16 w-16 text-primary" />
                            <h2 className="mb-4 text-3xl font-bold">Bank-Level Security</h2>
                            <p className="max-w-2xl text-muted-foreground">
                                Your security is our top priority. We use industry-leading encryption and partner with Plaid
                                to ensure your financial data stays safe and secure.
                            </p>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-24">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="rounded-2xl bg-primary p-8 text-center text-primary-foreground sm:p-16">
                            <h2 className="mb-4 text-3xl font-bold">Ready to take control of your finances?</h2>
                            <p className="mb-8 text-xl opacity-90">
                                Join thousands of users who are already tracking their finances with OneTrack.
                            </p>
                            <Button
                                asChild
                                size="lg"
                                variant="secondary"
                                className="min-w-[200px] bg-white text-primary hover:bg-white/90"
                            >
                                <Link href={route('register')}>Get Started Now</Link>
                            </Button>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="border-t py-12">
                    <div className="mx-auto max-w-7xl px-4 text-center text-sm text-muted-foreground sm:px-6 lg:px-8">
                        <p>&copy; {new Date().getFullYear()} OneTrack Financial. All rights reserved.</p>
                    </div>
                </footer>
            </div>
        </>
    );
}
