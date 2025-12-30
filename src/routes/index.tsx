import { createFileRoute, Link } from '@tanstack/react-router'
import { 
    Download, 
    Film,
    CheckCircle2,
    ArrowRight,
    Sparkles,
    Palette,
    Wand2,
    TrendingUp,
    Layers,
    Star
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { PostloomLogo } from '@/components/PostloomLogo'
import { ThemeToggle } from '@/routes/tweet-studio/-components/ThemeToggle'

export const Route = createFileRoute('/')({ component: HomePage })

const features = [
    {
        icon: Wand2,
        title: 'Smart Templates',
        description: 'Pre-built templates for every platform'
    },
    {
        icon: Palette,
        title: 'Custom Design',
        description: 'Full control over colors and styling'
    },
    {
        icon: Film,
        title: 'Animated GIFs',
        description: 'Create eye-catching animations'
    },
    {
        icon: Download,
        title: 'Export Anywhere',
        description: 'PNG and GIF formats'
    }
]

const useCases = [
    {
        title: 'Social Media Managers',
        description: 'Create engaging content for multiple platforms in minutes',
        icon: TrendingUp
    },
    {
        title: 'Content Creators',
        description: 'Stand out with professional, branded tweet cards',
        icon: Sparkles
    },
    {
        title: 'Marketing Teams',
        description: 'Maintain brand consistency across all channels',
        icon: Layers
    }
]

const testimonials = [
    {
        name: 'Sarah Chen',
        role: 'Social Media Manager',
        company: 'TechCorp',
        content: 'Postloom transformed our social media workflow. We create professional content in minutes instead of hours. The animated GIFs are a game-changer!',
        rating: 5,
        avatar: 'SC'
    },
    {
        name: 'Michael Rodriguez',
        role: 'Content Creator',
        company: 'Indie',
        content: 'The best tool for creating engaging tweet cards. The animations are smooth and the export quality is perfect. Best of all, it\'s completely free!',
        rating: 5,
        avatar: 'MR'
    },
    {
        name: 'Emily Johnson',
        role: 'Marketing Director',
        company: 'StartupXYZ',
        content: 'Our engagement rates increased by 40% after switching to Postloom. The professional designs help our content stand out. Highly recommend!',
        rating: 5,
        avatar: 'EJ'
    }
]

const faqs = [
    {
        question: 'Is Postloom really free?',
        answer: 'Yes! Postloom is 100% free forever. There are no hidden fees, no credit card required, and no watermarks on your exports. We believe everyone should have access to professional design tools.'
    },
    {
        question: 'What formats can I export?',
        answer: 'You can export your tweet cards as PNG images or animated GIFs. PNG is perfect for static posts, while GIFs are great for eye-catching animated content that stands out in feeds.'
    },
    {
        question: 'Do I need design skills to use Postloom?',
        answer: 'Not at all! Postloom is designed for everyone, regardless of design experience. Our intuitive interface and pre-built templates make it easy to create professional-looking content in minutes.'
    },
    {
        question: 'Can I use Postloom commercially?',
        answer: 'Absolutely! You can use Postloom for any purpose, including commercial use. Create content for your business, clients, or personal projects without any restrictions.'
    },
    {
        question: 'How do I import tweets?',
        answer: 'Simply paste a Twitter/X URL into the import field, and Postloom will automatically fetch and populate the tweet data. You can then customize the design to match your brand.'
    },
    {
        question: 'What platforms are supported?',
        answer: 'Postloom supports all major social media platforms including Instagram (posts and stories), LinkedIn, Twitter/X, and custom sizes. Each platform has optimized dimensions built-in.'
    }
]

const competitors = [
    {
        feature: 'Price',
        postloom: '100% Free Forever',
        canva: '$12.99/month',
        adobeExpress: '$9.99/month',
        bannerbear: '$29/month'
    },
    {
        feature: 'Watermarks',
        postloom: 'None',
        canva: 'Free tier has watermarks',
        adobeExpress: 'Free tier has watermarks',
        bannerbear: 'No watermarks'
    },
    {
        feature: 'Animated GIF Export',
        postloom: 'Yes',
        canva: 'Limited',
        adobeExpress: 'No',
        bannerbear: 'No'
    },
    {
        feature: 'Tweet Card Templates',
        postloom: 'Yes',
        canva: 'General templates',
        adobeExpress: 'General templates',
        bannerbear: 'API-based'
    }
]

function HomePage() {
  return (
        <div className="min-h-screen bg-white dark:bg-slate-950">
            {/* Navigation */}
            <nav className="relative bg-transparent backdrop-blur-md sticky top-0 z-50">
                <div className="relative max-w-6xl mx-auto px-4 py-3">
                    <div className="flex items-center justify-between">
                        <PostloomLogo size="md" />
                        <div className="flex items-center gap-3">
                            <ThemeToggle />
                            <Link to="/tweet-studio">
                                <Button size="sm" className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100">Get Started</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section with Animated Dotted Background */}
            <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 -mt-16 pt-16 pb-12">
                {/* Animated Dotted Background - Full Section */}
                <div className="absolute inset-0 opacity-40 dark:opacity-20">
                    <div className="absolute inset-0" style={{
                        backgroundImage: 'radial-gradient(circle, rgb(148 163 184) 1px, transparent 1px)',
                        backgroundSize: '24px 24px',
                        animation: 'move-dots 20s linear infinite'
                    }}></div>
                                </div>
                <style>{`
                    @keyframes move-dots {
                        0% { transform: translate(0, 0); }
                        100% { transform: translate(24px, 24px); }
                    }
                `}</style>

                <div className="relative max-w-7xl mx-auto px-4 py-12">
                    {/* Headline & CTA Section - Centered */}
                    <div className="text-center max-w-4xl mx-auto mb-8">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 mb-4">
                            <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            <span className="text-sm font-medium text-blue-900 dark:text-blue-100">100% Free Forever</span>
                        </div>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">
                            Free <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 bg-clip-text text-transparent bg-[length:200%_auto] animate-[shimmer_3s_linear_infinite]">Tweet Card Generator</span> & Social Media Card Creator
                        </h1>
                        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 mb-6 max-w-2xl mx-auto leading-relaxed">
                            Create professional tweet cards, Instagram posts, LinkedIn graphics, and Twitter designs in seconds. Free social media card maker with animated GIF export. No design skills required - 100% free forever.
                        </p>
                        <div className="flex items-center justify-center gap-4">
                            <Link to="/tweet-studio">
                                <Button size="lg" className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 text-base px-8 py-6">
                                    Get Started Free
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Tool Screenshot - Full Width, Prominent Display */}
                    <div className="relative max-w-6xl mx-auto mt-8">
                        <div className="relative rounded-2xl overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)]">
                            {/* Light Mode Screenshot */}
                            <img 
                                src="/postloom_light.png" 
                                alt="Postloom Free Tweet Card Generator and Social Media Card Creator Tool - Light Mode Interface" 
                                title="Postloom - Free Tweet Card Generator Tool"
                                className="w-full h-auto dark:hidden block"
                            />
                            {/* Dark Mode Screenshot */}
                            <img 
                                src="/postloom_dark.png" 
                                alt="Postloom Free Tweet Card Generator and Social Media Card Creator Tool - Dark Mode Interface" 
                                title="Postloom - Free Tweet Card Generator Tool"
                                className="w-full h-auto hidden dark:block"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Tweet Card Examples Section */}
            <section className="max-w-6xl mx-auto px-4 py-16">
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-6 text-center">Tweet Card Styles</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Light Theme Card */}
                    <div className="relative">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur opacity-20"></div>
                        <Card className="relative bg-white border-2 border-slate-200 shadow-xl">
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <Badge variant="outline" className="text-xs">Light Theme</Badge>
                                    <div className="text-xs text-slate-500">1080 × 1080</div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-lg">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                                            J
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-slate-900">John Doe</span>
                                                <CheckCircle2 className="h-4 w-4 text-blue-500" />
                </div>
                                            <span className="text-sm text-slate-500">@johndoe</span>
                        </div>
                </div>
                                    <p className="text-slate-900 mb-4 leading-relaxed">
                                        Ah, the new feature is finally here! 🚀 #LaunchDay
                                    </p>
                                    <div className="flex items-center gap-4 text-sm text-slate-500">
                                        <span>1:57 PM · Dec 29, 2025</span>
                                        <span>·</span>
                                        <span className="font-semibold">1.3K Views</span>
                                </div>
                                    <div className="flex items-center gap-6 mt-4 text-slate-500">
                                        <span className="text-sm">12</span>
                                        <span className="text-sm">45</span>
                                        <span className="text-sm">234</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Dark Theme Card */}
                    <div className="relative">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-slate-700 to-slate-900 rounded-2xl blur opacity-20"></div>
                        <Card className="relative bg-slate-900 border-2 border-slate-700 shadow-xl">
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <Badge variant="outline" className="text-xs bg-slate-800 border-slate-700 text-slate-200">Dark Theme</Badge>
                                    <div className="text-xs text-slate-400">1080 × 1080</div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-lg">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                                            J
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-white">John Doe</span>
                                                <CheckCircle2 className="h-4 w-4 text-blue-400" />
                                            </div>
                                            <span className="text-sm text-slate-400">@johndoe</span>
                                        </div>
                                    </div>
                                    <p className="text-white mb-4 leading-relaxed">
                                        Ah, the new feature is finally here! 🚀 #LaunchDay
                                    </p>
                                    <div className="flex items-center gap-4 text-sm text-slate-400">
                                        <span>1:57 PM · Dec 29, 2025</span>
                                        <span>·</span>
                                        <span className="font-semibold text-white">1.3K Views</span>
                                    </div>
                                    <div className="flex items-center gap-6 mt-4 text-slate-400">
                                        <span className="text-sm">12</span>
                                        <span className="text-sm">45</span>
                                        <span className="text-sm">234</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="max-w-7xl mx-auto px-4 py-16">
                <h2 className="text-3xl font-semibold text-slate-900 dark:text-white mb-8 text-center">Features</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {features.map((feature, i) => {
                        const Icon = feature.icon
                        return (
                            <Card key={i} className="text-center border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                                <CardHeader>
                                    <div className="w-12 h-12 mx-auto mb-3 rounded-lg bg-blue-50 dark:bg-blue-950 flex items-center justify-center">
                                        <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <CardTitle className="text-base dark:text-white">{feature.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-sm dark:text-slate-400">{feature.description}</CardDescription>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            </section>

            {/* Use Cases */}
            <section className="max-w-7xl mx-auto px-4 py-16">
                <h2 className="text-3xl font-semibold text-slate-900 dark:text-white mb-8 text-center">Perfect For</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {useCases.map((useCase, i) => {
                        const Icon = useCase.icon
                        return (
                            <Card key={i} className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                                <CardHeader>
                                    <div className="w-12 h-12 rounded-lg bg-blue-50 dark:bg-blue-950 flex items-center justify-center mb-4">
                                        <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <CardTitle className="dark:text-white">{useCase.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="dark:text-slate-400">{useCase.description}</CardDescription>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            </section>

            {/* Before/After Section */}
            <section className="max-w-7xl mx-auto px-4 py-16">
                <h2 className="text-3xl font-semibold text-slate-900 dark:text-white mb-4 text-center">Transform Your Tweets</h2>
                <p className="text-lg text-slate-600 dark:text-slate-400 mb-12 text-center">See the difference professional design makes</p>
                    <div className="grid md:grid-cols-2 gap-8">
                    <Card className="border-2 border-red-200 dark:border-red-900 bg-white dark:bg-slate-900">
                        <CardHeader>
                            <Badge variant="destructive" className="w-fit">Before</Badge>
                            <CardTitle className="mt-2 dark:text-white">Plain Text Tweet</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-6 border-2 border-dashed border-slate-300 dark:border-slate-700">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <div className="h-8 w-8 rounded-full bg-slate-300 dark:bg-slate-600"></div>
                                        <div>
                                            <div className="h-3 w-24 bg-slate-300 dark:bg-slate-600 rounded mb-1"></div>
                                            <div className="h-2 w-16 bg-slate-200 dark:bg-slate-700 rounded"></div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="h-4 bg-slate-300 dark:bg-slate-600 rounded w-full"></div>
                                        <div className="h-4 bg-slate-300 dark:bg-slate-600 rounded w-3/4"></div>
                                    </div>
                                </div>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400 text-center mt-4">Gets lost in the feed</p>
                        </CardContent>
                    </Card>

                    <Card className="border-2 border-green-500 dark:border-green-600 bg-white dark:bg-slate-900">
                        <CardHeader>
                            <Badge className="w-fit bg-green-600">After</Badge>
                            <CardTitle className="mt-2 dark:text-white">Professional Design</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg p-6 shadow-lg">
                                <div className="bg-white dark:bg-slate-800 rounded-lg p-4 space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500"></div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <div className="h-4 w-20 bg-slate-200 dark:bg-slate-700 rounded"></div>
                                                <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                                            </div>
                                            <div className="h-2 w-16 bg-slate-300 dark:bg-slate-600 rounded mt-1"></div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
                                        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3"></div>
                                    </div>
                                </div>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400 text-center mt-4">Stands out and engages</p>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Testimonials */}
            <section className="max-w-7xl mx-auto px-4 py-16">
                <h2 className="text-3xl font-semibold text-slate-900 dark:text-white mb-8 text-center">What People Say</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {testimonials.map((testimonial, i) => (
                        <Card key={i} className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                            <CardHeader>
                                <div className="flex items-center gap-3 mb-4">
                                    <Avatar>
                                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
                                            {testimonial.avatar}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <CardTitle className="text-base dark:text-white">{testimonial.name}</CardTitle>
                                        <CardDescription className="text-xs dark:text-slate-400">{testimonial.role} · {testimonial.company}</CardDescription>
                                    </div>
                                </div>
                                <div className="flex gap-1">
                                    {[...Array(testimonial.rating)].map((_, j) => (
                                        <Star key={j} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                    ))}
                            </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-slate-600 dark:text-slate-400 italic">"{testimonial.content}"</p>
                            </CardContent>
                        </Card>
                    ))}
                    </div>
            </section>

            {/* Comparison Table */}
            <section className="max-w-7xl mx-auto px-4 py-16">
                <h2 className="text-3xl font-semibold text-slate-900 dark:text-white mb-4 text-center">Postloom vs Alternatives</h2>
                <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 text-center">See why thousands choose Postloom</p>
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-900">
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800">Feature</th>
                                <th className="px-6 py-4 text-center text-sm font-semibold text-slate-900 dark:text-white bg-blue-50 dark:bg-blue-950 border-b border-slate-200 dark:border-slate-800">Postloom</th>
                                <th className="px-6 py-4 text-center text-sm text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">Canva</th>
                                <th className="px-6 py-4 text-center text-sm text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">Adobe Express</th>
                                <th className="px-6 py-4 text-center text-sm text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">Bannerbear</th>
                            </tr>
                        </thead>
                        <tbody>
                            {competitors.map((row, i) => (
                                <tr key={i} className="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900">
                                    <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">{row.feature}</td>
                                    <td className="px-6 py-4 text-center text-sm font-semibold text-slate-900 dark:text-white bg-blue-50 dark:bg-blue-950">{row.postloom}</td>
                                    <td className="px-6 py-4 text-center text-sm text-slate-600 dark:text-slate-400">{row.canva}</td>
                                    <td className="px-6 py-4 text-center text-sm text-slate-600 dark:text-slate-400">{row.adobeExpress}</td>
                                    <td className="px-6 py-4 text-center text-sm text-slate-600 dark:text-slate-400">{row.bannerbear}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Pricing */}
            <section className="max-w-7xl mx-auto px-4 py-16">
                <h2 className="text-3xl font-semibold text-slate-900 dark:text-white mb-8 text-center">Pricing</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                    <Card className="border-2 border-blue-500 dark:border-blue-600 shadow-lg bg-white dark:bg-slate-950">
                        <CardHeader>
                            <Badge className="w-fit mb-2 bg-blue-600">Free</Badge>
                            <CardTitle className="text-2xl dark:text-white">Free Forever</CardTitle>
                            <CardDescription className="dark:text-slate-400">Everything you need to create beautiful tweet cards</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-sm dark:text-slate-300">
                                    <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-500" />
                                    <span>Unlimited exports</span>
                            </div>
                                <div className="flex items-center gap-2 text-sm dark:text-slate-300">
                                    <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-500" />
                                    <span>No watermarks</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm dark:text-slate-300">
                                    <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-500" />
                                    <span>All features included</span>
                                </div>
                                    <Link to="/tweet-studio">
                                    <Button className="w-full mt-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100">Get Started</Button>
                                    </Link>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                        <CardHeader>
                            <Badge variant="outline" className="w-fit mb-2 dark:border-slate-700">Coming Soon</Badge>
                            <CardTitle className="text-2xl dark:text-white">Pro</CardTitle>
                            <CardDescription className="dark:text-slate-400">Advanced features for power users</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                                    <CheckCircle2 className="h-4 w-4" />
                                    <span>Priority support</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                                    <CheckCircle2 className="h-4 w-4" />
                                    <span>Advanced templates</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                                    <CheckCircle2 className="h-4 w-4" />
                                    <span>API access</span>
                                </div>
                                <Button variant="outline" className="w-full mt-4 dark:border-slate-700" disabled>
                                    Coming Soon
                                </Button>
                    </div>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* FAQs */}
            <section className="max-w-4xl mx-auto px-4 py-16">
                <h2 className="text-3xl font-semibold text-slate-900 dark:text-white mb-4 text-center">Frequently Asked Questions</h2>
                <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 text-center">Everything you need to know about Postloom</p>
                <Accordion type="single" collapsible className="w-full">
                    {faqs.map((faq, i) => (
                        <AccordionItem key={i} value={`item-${i}`} className="border-slate-200 dark:border-slate-800">
                            <AccordionTrigger className="text-left dark:text-slate-300">{faq.question}</AccordionTrigger>
                            <AccordionContent className="text-slate-600 dark:text-slate-400">
                                        {faq.answer}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
            </section>

            {/* CTA */}
            <section className="max-w-6xl mx-auto px-4 py-16 text-center bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 rounded-2xl my-16">
                <h2 className="text-3xl font-semibold text-slate-900 dark:text-white mb-4">Ready to get started?</h2>
                <p className="text-slate-600 dark:text-slate-400 mb-6 text-lg">Create your first tweet card in seconds</p>
                <Link to="/tweet-studio">
                    <Button size="lg" className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100">
                        Start Creating
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </Link>
            </section>

            {/* Footer */}
            <footer className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
                <div className="max-w-6xl mx-auto px-4 py-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <PostloomLogo size="md" />
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            © 2024 Postloom. All rights reserved.
        </p>
      </div>
                </div>
            </footer>
    </div>
  )
}
