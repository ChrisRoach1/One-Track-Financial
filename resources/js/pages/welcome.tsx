import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    ChartBarIcon,
    CreditCardIcon,
    LockIcon,
    ArrowRightIcon,
    BanknoteIcon,
    ChartPieIcon,
    LucideIcon,
    Monitor,
    Moon,
    Sun,
    TrendingUpIcon,
    ShieldCheckIcon,
    ZapIcon,
    UsersIcon,
    StarIcon,
    PlayIcon,
    ArrowDownIcon
} from 'lucide-react';
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

    const features = [
        {
            icon: CreditCardIcon,
            title: "Smart Account Sync",
            description: "Connect 10,000+ banks instantly with military-grade encryption. Your data stays secure while we handle the complexity.",
            highlight: "Instant setup"
        },
        {
            icon: ChartBarIcon,
            title: "AI-Powered Insights",
            description: "Our intelligent algorithms automatically categorize transactions and surface spending patterns you never knew existed.",
            highlight: "Auto-categorization"
        },
        {
            icon: TrendingUpIcon,
            title: "Wealth Tracking",
            description: "Monitor your net worth in real-time across all accounts. Watch your financial health improve month over month.",
            highlight: "Real-time updates"
        },
        {
            icon: ZapIcon,
            title: "Lightning Fast",
            description: "Built for speed. Access your financial data instantly with our modern, responsive interface.",
            highlight: "Sub-second load times"
        },
        {
            icon: ShieldCheckIcon,
            title: "Bank-Level Security",
            description: "256-bit encryption, SOC 2 Type II certified, and read-only access means your money stays exactly where it is.",
            highlight: "Zero risk"
        },
        {
            icon: ChartPieIcon,
            title: "Beautiful Analytics",
            description: "Transform complex financial data into stunning, actionable insights with our advanced visualization engine.",
            highlight: "Export ready"
        }
    ];

    const stats = [
        { value: "50K+", label: "Active Users" },
        { value: "$2.1B+", label: "Assets Tracked" },
        { value: "99.9%", label: "Uptime" },
        { value: "4.9/5", label: "User Rating" }
    ];

    const testimonials = [
        {
            name: "Sarah Chen",
            role: "Product Manager",
            content: "OneTrack completely transformed how I understand my finances. The insights are incredible and saved me over $3,000 last year.",
            rating: 5
        },
        {
            name: "Marcus Johnson",
            role: "Small Business Owner",
            content: "As someone managing multiple accounts, OneTrack is a lifesaver. The real-time sync across all my banks is flawless.",
            rating: 5
        },
        {
            name: "Emily Rodriguez",
            role: "Financial Advisor",
            content: "I recommend OneTrack to all my clients. The security and ease of use make it perfect for anyone serious about their finances.",
            rating: 5
        }
    ];

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>

            <div className="flex min-h-screen flex-col bg-background text-foreground">
                {/* Navigation */}
                <nav className="fixed top-0 z-50 w-full border-b bg-background/95 backdrop-blur-md">
                    <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center gap-2 sm:gap-3">
                            <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80">
                                <BanknoteIcon className="h-4 w-4 sm:h-5 sm:w-5 text-primary-foreground" />
                            </div>
                            <span className="text-lg sm:text-xl font-bold tracking-tight">OneTrack</span>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-4">
                            {auth.user ? (
                                <Button asChild variant="default" className="group h-9 px-3 text-sm sm:h-10 sm:px-4 sm:text-base">
                                    <Link href={route('dashboard')}>
                                        <span className="hidden sm:inline">Dashboard</span>
                                        <span className="sm:hidden">Dashboard</span>
                                        <ArrowRightIcon className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4 transition-transform group-hover:translate-x-1" />
                                    </Link>
                                </Button>
                            ) : (
                                <>
                                    <Button asChild variant="ghost" className="hidden md:inline-flex">
                                        <Link href={route('login')}>Sign In</Link>
                                    </Button>
                                    <Button asChild className="group h-9 px-3 text-sm sm:h-10 sm:px-4 sm:text-base">
                                        <Link href={route('register')}>
                                            <span className="hidden sm:inline">Get Started</span>
                                            <span className="sm:hidden">Start</span>
                                            <ArrowRightIcon className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4 transition-transform group-hover:translate-x-1" />
                                        </Link>
                                    </Button>
                                </>
                            )}
                            <TooltipProvider>
                                <ToggleGroup type="single" value={appearance} onValueChange={updateAppearance} variant="outline" size="sm">
                                    {options.map((option) => (
                                        <Tooltip key={option.value}>
                                            <TooltipTrigger asChild>
                                                <ToggleGroupItem value={option.value} className="h-7 w-7 p-0 sm:h-8 sm:w-8">
                                                    <option.icon className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
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
                <section className="relative overflow-hidden pt-16">
                    {/* Background gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.1),transparent)] dark:bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.05),transparent)]" />

                    <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
                        <div className="text-center">
                            <Badge variant="secondary" className="mb-6 bg-primary/10 text-primary hover:bg-primary/20">
                                <StarIcon className="mr-1 h-3 w-3 fill-current" />
                                Trusted by 50,000+ users
                            </Badge>

                            <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
                                Your finances,{' '}
                                <span className="relative">
                                    <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                                        unified
                                    </span>
                                    <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-primary/30 via-primary/60 to-primary/30 blur-sm" />
                                </span>
                                {' '}and intelligent
                            </h1>

                            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
                                Stop juggling multiple apps and spreadsheets. OneTrack connects all your accounts,
                                automatically categorizes transactions, and reveals insights that help you build wealth faster.
                            </p>

                            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                                <Button asChild size="lg" className="group h-12 min-w-[200px] text-base">
                                    <Link href={route('register')}>
                                        Start Free Trial
                                        <ArrowRightIcon className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                    </Link>
                                </Button>
                                <Button asChild size="lg" variant="outline" className="group h-12 min-w-[200px] text-base">
                                    <Link href="#demo">
                                        <PlayIcon className="mr-2 h-4 w-4" />
                                        Watch Demo
                                    </Link>
                                </Button>
                            </div>

                            <div className="mt-8 text-sm text-muted-foreground">
                                <p>✓ Free 30-day trial • ✓ No credit card required • ✓ Setup in 2 minutes</p>
                            </div>
                        </div>

                        {/* Stats Section */}
                        <div className="mt-20">
                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                                {stats.map((stat, index) => (
                                    <div key={index} className="text-center">
                                        <div className="text-2xl font-bold sm:text-3xl">{stat.value}</div>
                                        <div className="text-sm text-muted-foreground">{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Scroll indicator */}
                        <div className="mt-16 flex justify-center">
                            <div className="animate-bounce">
                                <ArrowDownIcon className="h-5 w-5 text-muted-foreground" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-24">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <Badge variant="outline" className="mb-4">Features</Badge>
                            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                                Everything you need to master your money
                            </h2>
                            <p className="mt-4 text-lg text-muted-foreground">
                                Powerful tools designed to give you complete financial clarity and control.
                            </p>
                        </div>

                        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                            {features.map((feature, index) => (
                                <Card key={index} className="group relative overflow-hidden border-0 bg-gradient-to-br from-background to-muted/20 p-8 shadow-md transition-all duration-300 hover:shadow-lg">
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                                    <div className="relative">
                                        <div className="mb-4 flex items-center justify-between">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                                                <feature.icon className="h-6 w-6 text-primary" />
                                            </div>
                                            <Badge variant="secondary" className="text-xs">
                                                {feature.highlight}
                                            </Badge>
                                        </div>
                                        <h3 className="mb-3 text-xl font-semibold">{feature.title}</h3>
                                        <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* How It Works Section */}
                <section className="py-24 bg-muted/30">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <Badge variant="outline" className="mb-4">How It Works</Badge>
                            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Get started in minutes</h2>
                        </div>

                        <div className="mt-16 grid gap-8 lg:grid-cols-3">
                            {[
                                {
                                    step: "01",
                                    title: "Connect Your Accounts",
                                    description: "Securely link your bank accounts, credit cards, and investments using bank-level encryption."
                                },
                                {
                                    step: "02",
                                    title: "AI Does the Work",
                                    description: "Our intelligent system automatically categorizes all your transactions and identifies spending patterns."
                                },
                                {
                                    step: "03",
                                    title: "Get Insights",
                                    description: "Access powerful analytics, budgeting tools, and personalized recommendations to optimize your finances."
                                }
                            ].map((item, index) => (
                                <div key={index} className="relative text-center">
                                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                                        {item.step}
                                    </div>
                                    <h3 className="mb-3 text-xl font-semibold">{item.title}</h3>
                                    <p className="text-muted-foreground">{item.description}</p>

                                    {index < 2 && (
                                        <div className="absolute top-8 left-full hidden w-full lg:block">
                                            <ArrowRightIcon className="mx-auto h-5 w-5 text-muted-foreground" />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Testimonials Section */}
                <section className="py-24">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <Badge variant="outline" className="mb-4">Testimonials</Badge>
                            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                                Loved by thousands of users
                            </h2>
                        </div>

                        <div className="mt-16 grid gap-8 lg:grid-cols-3">
                            {testimonials.map((testimonial, index) => (
                                <Card key={index} className="p-6">
                                    <div className="mb-4 flex">
                                        {[...Array(testimonial.rating)].map((_, i) => (
                                            <StarIcon key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                        ))}
                                    </div>
                                    <blockquote className="mb-4 text-muted-foreground">
                                        "{testimonial.content}"
                                    </blockquote>
                                    <div>
                                        <div className="font-semibold">{testimonial.name}</div>
                                        <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Security Section */}
                <section className="py-24 bg-muted/30">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mx-auto max-w-3xl text-center">
                            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                                <LockIcon className="h-10 w-10 text-primary" />
                            </div>
                            <Badge variant="outline" className="mb-4">Security</Badge>
                            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                                Your data is safer than your own bank
                            </h2>
                            <p className="mt-6 text-lg text-muted-foreground">
                                We use the same 256-bit encryption as major banks, are SOC 2 Type II certified,
                                and only maintain read-only access to your accounts. Your money never moves through our systems.
                            </p>

                            <div className="mt-10 grid gap-6 sm:grid-cols-3">
                                {[
                                    { icon: ShieldCheckIcon, title: "SOC 2 Certified" },
                                    { icon: LockIcon, title: "256-bit Encryption" },
                                    { icon: UsersIcon, title: "Read-Only Access" }
                                ].map((item, index) => (
                                    <div key={index} className="flex flex-col items-center">
                                        <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                                            <item.icon className="h-6 w-6 text-primary" />
                                        </div>
                                        <div className="text-sm font-medium">{item.title}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-24">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary/90 to-primary/80 p-8 text-center text-primary-foreground sm:p-16">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1),transparent)]" />
                            <div className="relative">
                                <h2 className="text-3xl font-bold sm:text-4xl">
                                    Ready to transform your finances?
                                </h2>
                                <p className="mx-auto mt-4 max-w-2xl text-lg opacity-90 sm:text-xl">
                                    Join over 50,000 users who have already taken control of their financial future with OneTrack.
                                </p>
                                <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
                                    <Button
                                        asChild
                                        size="lg"
                                        variant="secondary"
                                        className="group h-12 min-w-[200px] hover:bg-white/90"
                                    >
                                        <Link href={route('register')}>
                                            Start Your Free Trial
                                            <ArrowRightIcon className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                        </Link>
                                    </Button>
                                    <Button
                                        asChild
                                        size="lg"
                                        variant="outline"
                                        className="h-12 min-w-[200px] border-white/20 bg-transparent hover:bg-white/10">
                                        <Link href="#demo">
                                            <PlayIcon className="mr-2 h-4 w-4" />
                                            Watch Demo
                                        </Link>
                                    </Button>
                                </div>
                                <div className="mt-6 text-sm opacity-75">
                                    <p>30-day free trial • No credit card required • Cancel anytime</p>
                                </div>
                            </div>
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
