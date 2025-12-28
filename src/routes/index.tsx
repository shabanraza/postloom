import { createFileRoute, Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { 
    Sparkles, 
    Zap, 
    Palette, 
    Download, 
    Image as ImageIcon, 
    Film,
    CheckCircle2,
    ArrowRight,
    Star,
    TrendingUp,
    Layers,
    Wand2,
    Code,
    Layout,
    Type,
    PlayCircle,
    Shield,
    CreditCard,
    X,
    Instagram,
    Linkedin,
    Check,
    XCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

export const Route = createFileRoute('/')({ component: HomePage })

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
}

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5 }
    }
}

const features = [
    {
        icon: Wand2,
        title: 'Smart Templates',
        description: 'Pre-built templates for every platform and use case',
        gradient: 'from-purple-500 to-pink-500'
    },
    {
        icon: Palette,
        title: 'Custom Design',
        description: 'Full control over colors, fonts, and styling',
        gradient: 'from-blue-500 to-cyan-500'
    },
    {
        icon: Film,
        title: 'Animated GIFs',
        description: 'Create eye-catching typewriter animations',
        gradient: 'from-orange-500 to-red-500'
    },
    {
        icon: Download,
        title: 'Export Anywhere',
        description: 'PNG and GIF formats for all platforms',
        gradient: 'from-green-500 to-emerald-500'
    },
    {
        icon: Layout,
        title: 'Perfect Sizes',
        description: 'Optimized for Instagram, LinkedIn, Twitter',
        gradient: 'from-indigo-500 to-purple-500'
    },
    {
        icon: Type,
        title: 'Typography Control',
        description: 'Custom fonts, weights, and spacing',
        gradient: 'from-pink-500 to-rose-500'
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
    },
    {
        name: 'David Kim',
        role: 'Brand Manager',
        company: 'Creative Agency',
        content: 'No watermarks, no credit card required, and it works perfectly. This is exactly what we needed for our client projects. Thank you!',
        rating: 5,
        avatar: 'DK'
    },
    {
        name: 'Lisa Wang',
        role: 'Digital Marketer',
        company: 'E-commerce Brand',
        content: 'I love how easy it is to create different sizes for Instagram, LinkedIn, and Twitter. The templates are beautiful and customization is a breeze.',
        rating: 5,
        avatar: 'LW'
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
    },
    {
        question: 'Are there any limitations?',
        answer: 'No limitations! Unlike other tools, Postloom doesn\'t restrict exports, add watermarks, or limit features. Everything is available in the free version.'
    },
    {
        question: 'Can I customize colors and fonts?',
        answer: 'Yes! Postloom gives you full control over colors, fonts, typography, backgrounds, and more. You can also choose from multiple templates or create your own custom design.'
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
    },
    {
        feature: 'No Design Skills Required',
        postloom: 'Yes',
        canva: 'Yes',
        adobeExpress: 'Yes',
        bannerbear: 'Requires coding'
    },
    {
        feature: 'Real-time Preview',
        postloom: 'Yes',
        canva: 'Yes',
        adobeExpress: 'Yes',
        bannerbear: 'No'
    }
]

function HomePage() {
  return (
        <div className="min-h-screen bg-black text-white">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-md border-b border-slate-800">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="flex items-center gap-3"
                        >
                            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg">
                                <svg viewBox="0 0 24 24" className="h-5 w-5 fill-white" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.592 1.25-3.598 1.995-5.77 1.995-.375 0-.745-.022-1.11-.065 2.06 1.32 4.51 2.09 7.14 2.09 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z" />
                                </svg>
                            </div>
                            <span className="text-lg font-semibold text-white">
          Postloom
                            </span>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="flex items-center gap-4"
                        >
                            <Link to="/tweet-studio">
                                <Button className="bg-white text-black hover:bg-gray-100">
                                    Get Started
                                </Button>
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-16 px-6 lg:px-8 relative overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    {/* Social Proof */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-8"
                    >
                        <p className="text-sm text-gray-400 mb-4">Join over 5,000+ creators including</p>
                        <div className="flex items-center justify-center gap-2 mb-6">
                            {['SC', 'MR', 'EJ', 'DK', 'LW'].map((avatar, i) => (
                                <div key={i} className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-xs border-2 border-black -ml-2 first:ml-0">
                                    {avatar}
                                </div>
                            ))}
                            <span className="text-sm text-gray-400 ml-2">+4,995 more</span>
                        </div>
                    </motion.div>

                    {/* Main Hero Content */}
                    <div className="text-center mb-12">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
                        >
                            Create Professional
                            <br />
                            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                Social Media Content
                            </span>
                            <br />
                            <span className="text-4xl sm:text-5xl lg:text-6xl text-gray-300">
                                in Seconds
                            </span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto"
                        >
                            Design stunning tweet cards for Instagram, LinkedIn, Twitter, and more. Export as PNG or animated GIF. 100% free forever.
                        </motion.p>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="flex items-center justify-center gap-4"
                        >
                            <Link to="/tweet-studio">
                                <Button size="lg" className="bg-white text-black hover:bg-gray-100 text-base px-8 py-6 h-auto">
                                    Get started for free
                                    <ArrowRight className="h-4 w-4 ml-2" />
                                </Button>
                            </Link>
                            <Button 
                                size="lg" 
                                variant="outline" 
                                className="border-2 border-gray-700 text-white hover:bg-gray-900 text-base px-8 py-6 h-auto"
                                onClick={() => {
                                    document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })
                                }}
                            >
                                <PlayCircle className="h-4 w-4 mr-2" />
                                Watch demo
                            </Button>
                        </motion.div>
                    </div>

                    {/* Screenshot/Video Section */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        className="relative max-w-6xl mx-auto mt-16"
                    >
                        <div className="relative rounded-2xl overflow-hidden border border-gray-800 shadow-2xl">
                            {/* Browser Chrome */}
                            <div className="bg-gray-900 border-b border-gray-800 px-4 py-3 flex items-center gap-2">
                                <div className="flex gap-2">
                                    <div className="h-3 w-3 rounded-full bg-red-500"></div>
                                    <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                                </div>
                                <div className="flex-1 h-8 rounded bg-gray-800 mx-4"></div>
                            </div>
                            
                            {/* Tool Screenshot/Video */}
                            <div className="bg-gray-950 aspect-video flex items-center justify-center relative">
                                <Link to="/tweet-studio" className="absolute inset-0 flex items-center justify-center group cursor-pointer">
                                    <div className="relative w-full h-full bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
                                        {/* Mock Tool Interface */}
                                        <div className="w-full h-full p-8 grid grid-cols-12 gap-4">
                                            {/* Left Panel */}
                                            <div className="col-span-3 bg-gray-900 rounded-lg p-4 border border-gray-800">
                                                <div className="space-y-3">
                                                    <div className="h-4 bg-gray-800 rounded w-3/4"></div>
                                                    <div className="h-20 bg-gray-800 rounded"></div>
                                                    <div className="h-4 bg-gray-800 rounded w-1/2"></div>
                                                </div>
                                            </div>
                                            {/* Center Canvas */}
                                            <div className="col-span-6 bg-gray-900 rounded-lg p-6 border border-gray-800 flex items-center justify-center">
                                                <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl p-6 w-full max-w-md">
                                                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                                                        <div className="flex items-center gap-3 mb-3">
                                                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500"></div>
                                                            <div>
                                                                <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-1"></div>
                                                                <div className="h-2 w-16 bg-gray-300 dark:bg-gray-600 rounded"></div>
                                                            </div>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                                                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Right Panel */}
                                            <div className="col-span-3 bg-gray-900 rounded-lg p-4 border border-gray-800">
                                                <div className="space-y-3">
                                                    <div className="h-4 bg-gray-800 rounded w-full"></div>
                                                    <div className="h-4 bg-gray-800 rounded w-3/4"></div>
                                                    <div className="h-20 bg-gray-800 rounded"></div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Play Button Overlay */}
                                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                                            <div className="h-20 w-20 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <PlayCircle className="h-12 w-12 text-white" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        </div>
                        
                        {/* Decorative Elements */}
                        <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-3xl -z-10"></div>
                    </motion.div>
                </div>
            </section>

            {/* Features Grid */}
            <section id="features" className="py-24 px-6 lg:px-8 bg-black">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-white">
                            Everything you need
                        </h2>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                            Powerful features to create professional social media content
                        </p>
                    </motion.div>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                                whileHover={{ y: -4 }}
                                className="group p-6 rounded-xl bg-gray-900 border border-gray-800 hover:border-gray-700 transition-all"
                            >
                                <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${feature.gradient} mb-4 group-hover:scale-110 transition-transform`}>
                                    <feature.icon className="h-5 w-5 text-white" />
                                </div>
                                <h3 className="text-lg font-semibold mb-2 text-white">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* CTA after features */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="text-center mt-12"
                    >
                        <Link to="/tweet-studio">
                            <Button size="lg" className="bg-white text-black hover:bg-gray-100 text-base px-8 py-6 h-auto">
                                Start Creating Free
                                <ArrowRight className="h-4 w-4 ml-2" />
                            </Button>
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Comparison Table */}
            <section className="py-24 px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-slate-900 dark:text-white">
                            Postloom vs Alternatives
                        </h2>
                        <p className="text-xl text-slate-600 dark:text-slate-400">
                            See why thousands choose Postloom over paid alternatives
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="overflow-x-auto"
                    >
                        <div className="inline-block min-w-full align-middle">
                            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                                <thead className="bg-slate-50 dark:bg-slate-900">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">Feature</th>
                                        <th className="px-6 py-4 text-center text-sm font-semibold text-slate-900 dark:text-white bg-blue-50 dark:bg-blue-950/30">Postloom</th>
                                        <th className="px-6 py-4 text-center text-sm font-semibold text-slate-600 dark:text-slate-400">Canva</th>
                                        <th className="px-6 py-4 text-center text-sm font-semibold text-slate-600 dark:text-slate-400">Adobe Express</th>
                                        <th className="px-6 py-4 text-center text-sm font-semibold text-slate-600 dark:text-slate-400">Bannerbear</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                    {competitors.map((row, index) => (
                                        <tr key={index} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                                            <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">{row.feature}</td>
                                            <td className="px-6 py-4 text-center text-sm text-slate-900 dark:text-white bg-blue-50 dark:bg-blue-950/30 font-semibold">{row.postloom}</td>
                                            <td className="px-6 py-4 text-center text-sm text-slate-600 dark:text-slate-400">{row.canva}</td>
                                            <td className="px-6 py-4 text-center text-sm text-slate-600 dark:text-slate-400">{row.adobeExpress}</td>
                                            <td className="px-6 py-4 text-center text-sm text-slate-600 dark:text-slate-400">{row.bannerbear}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-24 px-6 lg:px-8 bg-slate-50 dark:bg-slate-900/50">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-slate-900 dark:text-white">
                            Loved by Creators
                        </h2>
                        <p className="text-xl text-slate-600 dark:text-slate-400">
                            See what our users are saying
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {testimonials.map((testimonial, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1, duration: 0.6 }}
                                className="p-6 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm"
                            >
                                <div className="flex gap-1 mb-4">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                    ))}
                                </div>
                                <p className="text-slate-700 dark:text-slate-300 mb-6 text-sm leading-relaxed">
                                    "{testimonial.content}"
                                </p>
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
                                        {testimonial.avatar}
                                    </div>
                                    <div>
                                        <div className="font-semibold text-slate-900 dark:text-white text-sm">
                                            {testimonial.name}
                                        </div>
                                        <div className="text-xs text-slate-600 dark:text-slate-400">
                                            {testimonial.role} at {testimonial.company}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Before/After Examples */}
            <section className="py-24 px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-slate-900 dark:text-white">
                            Transform Your Tweets
                        </h2>
                        <p className="text-xl text-slate-600 dark:text-slate-400">
                            See the difference professional design makes
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="space-y-4"
                        >
                            <div className="text-center">
                                <span className="inline-block px-4 py-2 rounded-lg bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 text-sm font-semibold mb-4">
                                    Before
                                </span>
                            </div>
                            <div className="bg-slate-100 dark:bg-slate-800 rounded-xl p-6 border-2 border-dashed border-slate-300 dark:border-slate-700">
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
                                    <div className="flex gap-4">
                                        <div className="h-3 w-12 bg-slate-300 dark:bg-slate-600 rounded"></div>
                                        <div className="h-3 w-12 bg-slate-300 dark:bg-slate-600 rounded"></div>
                                    </div>
                                </div>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
                                Plain text tweet - gets lost in the feed
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="space-y-4"
                        >
                            <div className="text-center">
                                <span className="inline-block px-4 py-2 rounded-lg bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 text-sm font-semibold mb-4">
                                    After
                                </span>
                            </div>
                            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-6 shadow-xl border border-slate-200 dark:border-slate-700">
                                <div className="bg-white dark:bg-slate-800 rounded-lg p-4 space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500"></div>
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
                                    <div className="flex gap-4">
                                        <div className="h-3 w-12 bg-slate-200 dark:bg-slate-700 rounded"></div>
                                        <div className="h-3 w-12 bg-slate-200 dark:bg-slate-700 rounded"></div>
                                    </div>
                                </div>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
                                Professional design - stands out and engages
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Demo/Showcase Section */}
            <section id="demo" className="py-24 px-6 lg:px-8 bg-slate-50 dark:bg-slate-900/50">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="space-y-6"
                        >
                            <div className="space-y-4">
                                <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white">
                                    Design in minutes,
                                    <br />
                                    not hours
                                </h2>
                                <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
                                    No design skills required. Our intuitive interface makes it easy to create professional tweet cards that stand out.
                                </p>
                            </div>
                            <div className="space-y-4">
                                {[
                                    'Drag-and-drop interface',
                                    'Real-time preview',
                                    'Export in multiple formats',
                                    'No watermarks or limitations'
                                ].map((item, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1, duration: 0.5 }}
                                        className="flex items-center gap-3"
                                    >
                                        <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                                        <span className="text-slate-700 dark:text-slate-300">{item}</span>
                                    </motion.div>
                                ))}
                            </div>
                            <Link to="/tweet-studio">
                                <Button size="lg" className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 text-base px-8 py-6 h-auto mt-6">
                                    Try It Now
                                    <ArrowRight className="h-4 w-4 ml-2" />
                                </Button>
                            </Link>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="relative"
                        >
                            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                                <div className="aspect-video bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center">
                                    <div className="text-center p-8">
                                        <Link to="/tweet-studio">
                                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white dark:bg-slate-800 shadow-lg mb-4 cursor-pointer hover:scale-110 transition-transform">
                                                <PlayCircle className="h-10 w-10 text-blue-600" />
                                            </div>
                                        </Link>
                                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Interactive Demo</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-500">Click to try it yourself</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section className="py-24 px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-slate-900 dark:text-white">
                            Simple, Transparent Pricing
                        </h2>
                        <p className="text-xl text-slate-600 dark:text-slate-400">
                            Everything you need, completely free
                        </p>
                    </motion.div>

                    <div className="max-w-4xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="relative p-8 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 text-white border-4 border-blue-400 shadow-2xl"
                        >
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-yellow-400 text-slate-900 rounded-full text-sm font-bold">
                                FREE FOREVER
                            </div>
                            <div className="text-center space-y-6">
                                <div>
                                    <div className="text-6xl font-bold mb-2">$0</div>
                                    <div className="text-blue-100">Forever</div>
                                </div>
                                <div className="space-y-4 pt-6">
                                    {[
                                        'Unlimited tweet cards',
                                        'All templates included',
                                        'Animated GIF export',
                                        'No watermarks',
                                        'All platform sizes',
                                        'Commercial use allowed',
                                        'No credit card required',
                                        'Priority support'
                                    ].map((feature, index) => (
                                        <div key={index} className="flex items-center gap-3">
                                            <CheckCircle2 className="h-5 w-5 shrink-0" />
                                            <span>{feature}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="pt-6">
                                    <Link to="/tweet-studio">
                                        <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 text-base px-8 py-6 h-auto shadow-xl">
                                            Get Started Free
                                            <ArrowRight className="h-4 w-4 ml-2" />
                                        </Button>
                                    </Link>
                                </div>
                                <div className="pt-4 text-sm text-blue-100">
                                    <p>While competitors charge $10-30/month, we believe design tools should be accessible to everyone.</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Trust Badges */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="flex flex-wrap items-center justify-center gap-6 mt-12"
                    >
                        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900">
                            <Shield className="h-5 w-5 text-green-600 dark:text-green-400" />
                            <span className="text-sm font-medium text-green-900 dark:text-green-100">100% Free Forever</span>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900">
                            <CreditCard className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            <span className="text-sm font-medium text-blue-900 dark:text-blue-100">No Credit Card Required</span>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900">
                            <ImageIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                            <span className="text-sm font-medium text-purple-900 dark:text-purple-100">No Watermarks</span>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                            <Shield className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                            <span className="text-sm font-medium text-slate-900 dark:text-slate-100">Secure & Private</span>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Use Cases */}
            <section className="py-24 px-6 lg:px-8 bg-slate-50 dark:bg-slate-900/50">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-slate-900 dark:text-white">
                            Perfect for everyone
                        </h2>
                        <p className="text-xl text-slate-600 dark:text-slate-400">
                            Whether you're a creator, marketer, or business owner
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {useCases.map((useCase, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1, duration: 0.6 }}
                                className="p-8 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                            >
                                <div className="inline-flex p-3 rounded-lg bg-slate-100 dark:bg-slate-700 mb-4">
                                    <useCase.icon className="h-6 w-6 text-slate-900 dark:text-white" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-white">
                                    {useCase.title}
                                </h3>
                                <p className="text-slate-600 dark:text-slate-400">
                                    {useCase.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-24 px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-slate-900 dark:text-white">
                            Frequently Asked Questions
                        </h2>
                        <p className="text-xl text-slate-600 dark:text-slate-400">
                            Everything you need to know about Postloom
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <Accordion type="single" collapsible className="space-y-4">
                            {faqs.map((faq, index) => (
                                <AccordionItem key={index} value={`item-${index}`} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-6">
                                    <AccordionTrigger className="text-left font-semibold text-slate-900 dark:text-white hover:no-underline">
                                        {faq.question}
                                    </AccordionTrigger>
                                    <AccordionContent className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                        {faq.answer}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </motion.div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center p-12 rounded-2xl bg-slate-900 dark:bg-slate-800 text-white"
                    >
                        <h2 className="text-4xl sm:text-5xl font-bold mb-4">
                            Ready to get started?
                        </h2>
                        <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
                            Join thousands of creators and start designing professional tweet cards today. It's free forever.
                        </p>
                        <Link to="/tweet-studio">
                            <Button 
                                size="lg" 
                                className="bg-white text-slate-900 hover:bg-slate-100 text-base px-8 py-6 h-auto shadow-xl"
                            >
                                Start Creating Free
                                <ArrowRight className="h-4 w-4 ml-2" />
                            </Button>
                        </Link>
                        <p className="mt-6 text-sm text-slate-400">
                            No credit card required • No watermarks • Free forever
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Floating CTA */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1 }}
                className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 hidden md:block"
            >
                <Link to="/tweet-studio">
                    <Button size="lg" className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 shadow-2xl px-6 py-4">
                        Start Creating Free
                        <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                </Link>
            </motion.div>

            {/* Footer */}
            <footer className="py-12 px-6 lg:px-8 border-t border-slate-200 dark:border-slate-900 bg-white dark:bg-slate-950">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                                <svg viewBox="0 0 24 24" className="h-5 w-5 fill-white" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.592 1.25-3.598 1.995-5.77 1.995-.375 0-.745-.022-1.11-.065 2.06 1.32 4.51 2.09 7.14 2.09 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z" />
                                </svg>
                            </div>
                            <span className="text-base font-semibold text-slate-900 dark:text-white">
                                Postloom
                            </span>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            © 2024 Postloom. All rights reserved.
        </p>
      </div>
                </div>
            </footer>
    </div>
  )
}
