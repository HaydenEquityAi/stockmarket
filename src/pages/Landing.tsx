import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  TrendingUp, 
  BarChart3, 
  DollarSign, 
  Zap, 
  Star, 
  Crown, 
  Check, 
  ArrowRight,
  Play,
  Quote,
  Shield,
  Award,
  Target,
  CheckCircle,
  Menu,
  X,
  Globe,
  Lock,
  Users,
  PieChart,
  Settings,
  Bell,
  Mail,
  Phone,
  ChevronLeft,
  ChevronRight,
  Clock,
  Building2,
  HeadphonesIcon,
  Smartphone,
  Code,
  Palette,
  GraduationCap,
  Bot
} from 'lucide-react';

// Feature data
const features = [
  {
    icon: TrendingUp,
    title: 'Real-Time Data',
    description: 'Live market quotes, charts, and price alerts updated every second with 99% accuracy.',
    metric: 'Live updates',
    color: 'from-emerald-500 to-teal-600',
  },
  {
    icon: BarChart3,
    title: 'Portfolio Tracking',
    description: 'Track holdings, performance, and allocation with beautiful visualizations and analytics.',
    metric: '99% accuracy',
    color: 'from-cyan-500 to-blue-600',
  },
  {
    icon: DollarSign,
    title: 'Smart Money Insights',
    description: 'Follow congressional and institutional trades to make informed investment decisions.',
    metric: 'AI-powered',
    color: 'from-purple-500 to-pink-600',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Optimized for speed with instant updates and responsive design for real-time trading.',
    metric: '<100ms',
    color: 'from-amber-500 to-orange-600',
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Bank-level encryption and security to protect your financial data and investments.',
    metric: 'SOC 2 Compliant',
    color: 'from-indigo-500 to-purple-600',
  },
  {
    icon: Globe,
    title: 'Global Markets',
    description: 'Access stocks, indices, and market data from around the world in real-time.',
    metric: '50+ exchanges',
    color: 'from-teal-500 to-emerald-600',
  },
];

// Pricing plans
const pricingPlans = [
  {
    id: 'starter',
    name: 'Starter',
    price: 0,
    description: 'Perfect for individual traders getting started',
    features: [
      { icon: Building2, text: 'Up to 5 stocks' },
      { icon: TrendingUp, text: 'Real-time data' },
      { icon: BarChart3, text: 'Basic analytics' },
      { icon: HeadphonesIcon, text: 'Email support' },
    ],
    buttonText: 'Get Started',
    buttonVariant: 'outline' as const,
  },
  {
    id: 'growth',
    name: 'Growth',
    price: 19,
    description: 'Ideal for active traders building their portfolio',
    features: [
      { icon: Building2, text: 'Up to 25 stocks' },
      { icon: HeadphonesIcon, text: 'Priority support', highlight: true },
      { icon: Code, text: 'API access' },
      { icon: BarChart3, text: 'Advanced analytics' },
      { icon: Bell, text: 'Price alerts' },
    ],
    popular: true,
    buttonText: 'Start Free Trial',
    buttonVariant: 'default' as const,
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 49,
    description: 'For serious traders and portfolio managers',
    features: [
      { icon: Building2, text: 'Unlimited stocks' },
      { icon: HeadphonesIcon, text: 'Dedicated support', highlight: true },
      { icon: Palette, text: 'White label' },
      { icon: Settings, text: 'Custom integrations' },
      { icon: GraduationCap, text: 'Onboarding assistance' },
    ],
    buttonText: 'Go Professional',
    buttonVariant: 'secondary' as const,
  },
];

// Testimonials
const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Portfolio Manager',
    company: 'Equity Partners',
    companySize: '200+ positions',
    content: 'MarketPulse has completely revolutionized our portfolio tracking. The real-time data alone saves us hours per day, and our decision-making speed increased by 40% in just 2 months.',
    avatar: 'SJ',
    rating: 5,
  },
  {
    name: 'Michael Chen',
    role: 'Investment Director',
    company: 'Growth Capital',
    companySize: '500+ holdings',
    content: 'The analytics dashboard gives us insights we never had before. We\'ve increased our returns by 30% and reduced tracking time by 50% since implementing MarketPulse.',
    avatar: 'MC',
    rating: 5,
  },
  {
    name: 'Emily Rodriguez',
    role: 'Trading Operations',
    company: 'Horizon Investments',
    companySize: '150+ stocks',
    content: 'The automated alerts and smart money tracking have eliminated so much manual research. Our team can now focus on strategic decisions instead of data collection.',
    avatar: 'ER',
    rating: 5,
  },
  {
    name: 'David Kim',
    role: 'CEO',
    company: 'Summit Trading',
    companySize: '800+ positions',
    content: 'MarketPulse transformed our entire investment workflow. We went from reactive portfolio management to proactive, data-driven trading that our clients love.',
    avatar: 'DK',
    rating: 5,
  },
];

// Company logos
const companies = [
  'Equity Partners',
  'Growth Capital',
  'Horizon Investments',
  'Summit Trading',
  'Peak Portfolio',
  'Vertex Capital',
];

export function Landing() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const [isAnnual, setIsAnnual] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [showFloatingCTA, setShowFloatingCTA] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token && token !== 'null' && token !== 'undefined');
  }, []);

  useEffect(() => {
    // Show floating CTA after scrolling past hero
    const handleScroll = () => {
      const heroHeight = window.innerHeight;
      setShowFloatingCTA(window.scrollY > heroHeight);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Auto-rotate testimonials
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Handle body scroll lock when mobile menu is open
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const handleGetStarted = async (planId: string) => {
    setLoading(planId);
    
    try {
      // Check if user is logged in
      const token = localStorage.getItem('token');
      const isAuthenticated = token && token !== 'null' && token !== 'undefined';
      
      if (!isAuthenticated) {
        // Redirect to register page if not logged in
        setLoading(null);
        navigate('/register');
        return;
      }

      // User is logged in, redirect to dashboard
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error:', error);
      navigate('/register');
    } finally {
      setLoading(null);
    }
  };

  const handleStartTrial = () => {
    if (isLoggedIn) {
      navigate('/dashboard');
    } else {
      navigate('/register');
    }
  };

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const getPrice = (price: number) => {
    return isAnnual ? Math.round(price * 12 * 0.8) : price;
  };

  const getPriceText = (price: number) => {
    return isAnnual ? `/year` : `/month`;
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleMobileNavClick = (href: string) => {
    closeMobileMenu();
    if (href.startsWith('#')) {
      // Handle anchor links
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Handle regular navigation
      navigate(href);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <div className="h-8 w-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-black text-white">MarketPulse</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#home" className="text-slate-300 hover:text-emerald-400 transition-colors font-medium">
                Home
              </a>
              <a href="#pricing" className="text-slate-300 hover:text-emerald-400 transition-colors font-medium">
                Pricing
              </a>
              <a href="#features" className="text-slate-300 hover:text-emerald-400 transition-colors font-medium">
                Features
              </a>
              <a href="#about" className="text-slate-300 hover:text-emerald-400 transition-colors font-medium">
                About
              </a>
            </nav>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <Link 
                to="/login" 
                className="text-slate-300 hover:text-white transition-colors font-medium"
              >
                Sign In
              </Link>
              <Link 
                to="/register" 
                className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-4 py-2 rounded-lg transition-all font-semibold shadow-lg shadow-emerald-500/30"
              >
                Get Started
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={toggleMobileMenu}
                className="text-slate-300 hover:text-white focus:outline-none transition-colors"
                aria-label="Toggle mobile menu"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300"
            onClick={closeMobileMenu}
          />
          
          {/* Mobile Menu */}
          <div className="fixed right-0 top-0 h-full w-80 max-w-sm bg-slate-900 border-l border-slate-800 shadow-2xl transform transition-transform duration-300 ease-in-out">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-800">
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-xl font-black text-white">MarketPulse</span>
                </div>
                <button
                  onClick={closeMobileMenu}
                  className="text-slate-400 hover:text-white transition-colors"
                  aria-label="Close mobile menu"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              {/* Navigation Links */}
              <nav className="flex-1 px-6 py-6">
                <div className="space-y-2">
                  <button
                    onClick={() => handleMobileNavClick('/')}
                    className="w-full text-left px-4 py-4 text-lg font-medium text-slate-300 hover:bg-emerald-500/10 hover:text-emerald-400 rounded-lg transition-colors min-h-[44px] flex items-center"
                  >
                    Home
                  </button>
                  <button
                    onClick={() => handleMobileNavClick('#pricing')}
                    className="w-full text-left px-4 py-4 text-lg font-medium text-slate-300 hover:bg-emerald-500/10 hover:text-emerald-400 rounded-lg transition-colors min-h-[44px] flex items-center"
                  >
                    Pricing
                  </button>
                  <button
                    onClick={() => handleMobileNavClick('#features')}
                    className="w-full text-left px-4 py-4 text-lg font-medium text-slate-300 hover:bg-emerald-500/10 hover:text-emerald-400 rounded-lg transition-colors min-h-[44px] flex items-center"
                  >
                    Features
                  </button>
                  <button
                    onClick={() => handleMobileNavClick('/about')}
                    className="w-full text-left px-4 py-4 text-lg font-medium text-slate-300 hover:bg-emerald-500/10 hover:text-emerald-400 rounded-lg transition-colors min-h-[44px] flex items-center"
                  >
                    About
                  </button>
                </div>
              </nav>
              
              {/* Auth Buttons */}
              <div className="p-6 border-t border-slate-800 space-y-3">
                <Link
                  to="/login"
                  onClick={closeMobileMenu}
                  className="block w-full text-center px-4 py-3 text-slate-300 hover:text-white transition-colors font-medium"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={closeMobileMenu}
                  className="block w-full text-center px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-lg transition-all font-semibold"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Animated grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.05)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <span className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-semibold backdrop-blur-sm">
                  ⚡ Real-time market intelligence
                </span>
                <h1 className="text-6xl lg:text-7xl font-black text-white leading-tight">
                  Trade Smarter
                  <br />
                  <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                    Not Harder
                  </span>
                </h1>
                <p className="text-xl text-slate-300 leading-relaxed max-w-lg">
                  Professional-grade portfolio analytics powered by AI. 
                  Track every position, analyze every trade, maximize every return.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={handleStartTrial}
                  className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl text-lg font-bold shadow-2xl shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all hover:scale-105"
                >
                  Start Trading Free
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button 
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white/5 hover:bg-white/10 backdrop-blur-sm text-white border border-white/10 hover:border-white/20 rounded-xl text-lg font-bold transition-all"
                >
                  <Play className="h-5 w-5" />
                  Watch Demo
                </button>
              </div>
              
              <div className="flex items-center gap-8 pt-4 text-slate-400 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-400" />
                  <span>No credit card</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-400" />
                  <span>Free 14-day trial</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-400" />
                  <span>Cancel anytime</span>
                </div>
              </div>
            </div>
            
            {/* Right - Trading Terminal Dashboard */}
            <div className="relative">
              {/* Glowing orb effect */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl"></div>
              
              <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-emerald-500/20 shadow-2xl shadow-emerald-500/10 overflow-hidden">
                {/* Terminal Header */}
                <div className="flex items-center gap-2 px-6 py-4 border-b border-slate-700/50 bg-slate-800/50">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  </div>
                  <span className="text-sm text-slate-400 ml-4 font-mono">MarketPulse Terminal</span>
                </div>
                
                {/* Dashboard Content */}
                <div className="p-6 space-y-4">
                  {/* Metrics Grid */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 p-4 rounded-xl border border-emerald-500/20">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="h-4 w-4 text-emerald-400" />
                        <span className="text-xs text-slate-400 font-semibold">Portfolio</span>
                      </div>
                      <div className="text-2xl font-black text-white">$45K</div>
                      <div className="text-xs text-emerald-400 font-semibold mt-1">+$3.2K</div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-cyan-500/10 to-cyan-600/5 p-4 rounded-xl border border-cyan-500/20">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="h-4 w-4 text-cyan-400" />
                        <span className="text-xs text-slate-400 font-semibold">24h Change</span>
                      </div>
                      <div className="text-2xl font-black text-white">+12.4%</div>
                      <div className="text-xs text-cyan-400 font-semibold mt-1">↑ $5.1K</div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 p-4 rounded-xl border border-purple-500/20">
                      <div className="flex items-center gap-2 mb-2">
                        <BarChart3 className="h-4 w-4 text-purple-400" />
                        <span className="text-xs text-slate-400 font-semibold">Positions</span>
                      </div>
                      <div className="text-2xl font-black text-white">8</div>
                      <div className="text-xs text-purple-400 font-semibold mt-1">All profitable</div>
                    </div>
                  </div>
                  
                  {/* Live Activity Feed */}
                  <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Live Activity</span>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span className="text-xs text-emerald-400">Live</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {[
                        { symbol: 'NVDA', action: 'BUY', price: '$875.20', change: '+2.4%', color: 'emerald' },
                        { symbol: 'AAPL', action: 'ALERT', price: '$180.00', change: '+1.8%', color: 'cyan' },
                        { symbol: 'TSLA', action: 'SELL', price: '$242.50', change: '-0.5%', color: 'red' }
                      ].map((trade, i) => (
                        <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className={`w-1.5 h-8 rounded-full ${trade.color === 'emerald' ? 'bg-emerald-500' : trade.color === 'cyan' ? 'bg-cyan-500' : 'bg-red-500'}`}></div>
                            <div>
                              <div className="text-white font-bold text-sm">{trade.symbol}</div>
                              <div className="text-xs text-slate-400">{trade.action}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-white font-semibold text-sm">{trade.price}</div>
                            <div className={`text-xs font-semibold ${trade.change.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}`}>
                              {trade.change}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating stock ticker */}
              <div className="absolute -bottom-8 -right-8 bg-slate-900/90 backdrop-blur-xl border border-emerald-500/20 rounded-xl p-4 shadow-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-emerald-400" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">S&P 500</div>
                    <div className="text-white font-bold">4,783.45</div>
                  </div>
                  <div className="text-emerald-400 font-bold text-sm">+0.8%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-slate-900 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-4">
              Everything you need to trade like a pro
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Professional tools designed for serious traders who demand real-time data and intelligent insights.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-8 hover:border-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-500 group">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <IconComponent className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-slate-400 leading-relaxed mb-6">
                    {feature.description}
                  </p>
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-semibold">
                    {feature.metric}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-slate-800/50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto mb-8">
              Choose the plan that fits your trading style. All plans include our core features 
              with no hidden fees.
            </p>
            
            {/* Annual/Monthly Toggle */}
            <div className="flex items-center justify-center space-x-4 mb-8">
              <span className={`text-sm font-medium ${!isAnnual ? 'text-white' : 'text-slate-500'}`}>
                Monthly
              </span>
              <button
                onClick={() => setIsAnnual(!isAnnual)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-800 ${
                  isAnnual ? 'bg-emerald-500' : 'bg-slate-600'
                }`}
                role="switch"
                aria-checked={isAnnual}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isAnnual ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
              <span className={`text-sm font-medium ${isAnnual ? 'text-white' : 'text-slate-500'}`}>
                Annual
              </span>
              {isAnnual && (
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-semibold ml-2">
                  Save 20%
                </span>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan) => {
              const IconComponent = plan.id === 'starter' ? Star : 
                                   plan.id === 'growth' ? Zap : Crown;
              
              return (
                <div 
                  key={plan.id} 
                  className={`relative bg-slate-900/80 backdrop-blur-xl rounded-2xl border transition-all duration-300 hover:shadow-2xl ${
                    plan.popular 
                      ? 'border-emerald-500/50 shadow-2xl shadow-emerald-500/20 scale-105' 
                      : 'border-slate-700/50 hover:border-slate-600'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="inline-flex items-center px-4 py-1 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-semibold shadow-lg">
                        Most Popular
                      </span>
                    </div>
                  )}
                  
                  <div className="text-center pb-8 pt-8 px-6">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
                      plan.id === 'starter' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                      plan.id === 'growth' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                    }`}>
                      <IconComponent className="h-8 w-8" />
                    </div>
                    
                    <h3 className="text-2xl font-black text-white mb-2">
                      {plan.name}
                    </h3>
                    
                    <p className="text-slate-400 mt-2 mb-6">
                      {plan.description}
                    </p>
                    
                    <div className="mt-6">
                      <span className="text-5xl font-black text-white">${getPrice(plan.price)}</span>
                      <span className="text-slate-400 ml-2">{getPriceText(plan.price)}</span>
                    </div>
                  </div>

                  <div className="px-6 pb-6">
                    <ul className="space-y-4 mb-8">
                      {plan.features.map((feature, index) => {
                        const FeatureIcon = feature.icon;
                        return (
                          <li key={index} className="flex items-start">
                            <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mr-3 mt-0.5 ${
                              'highlight' in feature && feature.highlight ? 'bg-emerald-500/20' : 'bg-slate-700/50'
                            }`}>
                              <Check className={`h-3 w-3 ${
                                'highlight' in feature && feature.highlight ? 'text-emerald-400' : 'text-slate-400'
                              }`} />
                            </div>
                            <div className="flex items-center">
                              <FeatureIcon className="h-4 w-4 text-slate-500 mr-2" />
                              <span className={`text-sm ${
                                'highlight' in feature && feature.highlight ? 'text-emerald-400 font-semibold' : 'text-slate-300'
                              }`}>
                                {feature.text}
                              </span>
                            </div>
                          </li>
                        );
                      })}
                    </ul>

                    <button
                      onClick={() => handleGetStarted(plan.id)}
                      disabled={loading === plan.id}
                      className={`w-full py-3 rounded-lg font-bold transition-all ${
                        plan.popular
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg shadow-emerald-500/30'
                          : plan.buttonVariant === 'outline'
                          ? 'border-2 border-slate-700 text-slate-300 hover:bg-slate-800 hover:border-slate-600'
                          : 'bg-slate-800 text-white hover:bg-slate-700'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {loading === plan.id ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Processing...
                        </div>
                      ) : (
                        isLoggedIn === false ? 'Sign Up to Start' : (isLoggedIn === null ? 'Sign Up to Start' : plan.buttonText)
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-24 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-4">
              Trusted by professional traders
            </h2>
            <p className="text-xl text-slate-400">
              Join 500+ traders who have transformed their strategy with MarketPulse
            </p>
          </div>
          
          {/* Company Logos */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-16">
            {companies.map((company, index) => (
              <div key={index} className="flex items-center justify-center p-4">
                <div className="text-slate-500 font-semibold text-sm">
                  {company}
                </div>
              </div>
            ))}
          </div>
          
          {/* Testimonials Carousel */}
          <div className="relative max-w-4xl mx-auto">
            <div className="overflow-hidden">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentTestimonial * 100}%)` }}
              >
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="w-full flex-shrink-0 px-4">
                    <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl">
                      <div className="p-8 text-center">
                        <div className="flex items-center justify-center mb-6">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="h-5 w-5 text-amber-400 fill-current" />
                          ))}
                        </div>
                        <Quote className="h-12 w-12 text-emerald-400 mx-auto mb-6" />
                        <p className="text-lg text-slate-300 mb-8 leading-relaxed max-w-2xl mx-auto">
                          "{testimonial.content}"
                        </p>
                        <div className="flex items-center justify-center">
                          <div className="h-16 w-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">
                            {testimonial.avatar}
                          </div>
                          <div className="text-left">
                            <div className="font-black text-white text-lg">{testimonial.name}</div>
                            <div className="text-slate-400">{testimonial.role}, {testimonial.company}</div>
                            <div className="text-sm text-emerald-400 font-semibold">{testimonial.companySize}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Carousel Controls */}
            <button
              onClick={prevTestimonial}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-full p-3 shadow-lg hover:shadow-xl hover:border-emerald-500/30 transition-all"
            >
              <ChevronLeft className="h-6 w-6 text-slate-300" />
            </button>
            <button
              onClick={nextTestimonial}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-full p-3 shadow-lg hover:shadow-xl hover:border-emerald-500/30 transition-all"
            >
              <ChevronRight className="h-6 w-6 text-slate-300" />
            </button>
            
            {/* Dots Indicator */}
            <div className="flex justify-center space-x-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentTestimonial ? 'bg-emerald-500' : 'bg-slate-700'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2310b981' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-6">
            Ready to trade like a professional?
          </h2>
          <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
            Join 500+ traders who increased returns by 30% and reduced tracking time by 40% with MarketPulse.
          </p>
          
          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-8 mb-12">
            <div className="flex items-center space-x-2 text-slate-300">
              <Shield className="h-5 w-5 text-emerald-400" />
              <span className="text-sm font-medium">SOC 2 Compliant</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-300">
              <Lock className="h-5 w-5 text-emerald-400" />
              <span className="text-sm font-medium">Bank-Level Security</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-300">
              <Award className="h-5 w-5 text-emerald-400" />
              <span className="text-sm font-medium">99.9% Uptime</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-300">
              <CheckCircle className="h-5 w-5 text-emerald-400" />
              <span className="text-sm font-medium">24/7 Support</span>
            </div>
          </div>
          
          <div className="space-y-6">
            <button 
              onClick={handleStartTrial}
              className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl text-xl font-black shadow-2xl shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all duration-300 hover:scale-105"
            >
              Start Free Trial
              <ArrowRight className="h-6 w-6" />
            </button>
            <p className="text-slate-400 text-sm">
              No credit card required • 14-day free trial • Cancel anytime • Setup in 5 minutes
            </p>
          </div>
          
          {/* Customer Logos */}
          <div className="mt-16 pt-8 border-t border-slate-700">
            <p className="text-slate-400 text-sm mb-6">Trusted by leading trading firms</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 opacity-60">
              {companies.map((company, index) => (
                <div key={index} className="text-slate-300 font-semibold text-sm">
                  {company}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="h-8 w-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-black text-white">MarketPulse</span>
              </div>
              <p className="text-slate-400 max-w-md">
                Professional-grade portfolio analytics powered by AI. Track every position, analyze every trade.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
                Product
              </h3>
              <ul className="space-y-2">
                <li><a href="#features" className="text-slate-400 hover:text-emerald-400">Features</a></li>
                <li><a href="#pricing" className="text-slate-400 hover:text-emerald-400">Pricing</a></li>
                <li><a href="#" className="text-slate-400 hover:text-emerald-400">AI Tools</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
                Company
              </h3>
              <ul className="space-y-2">
                <li><a href="#about" className="text-slate-400 hover:text-emerald-400">About</a></li>
                <li><a href="#" className="text-slate-400 hover:text-emerald-400">Contact</a></li>
                <li><a href="#" className="text-slate-400 hover:text-emerald-400">Privacy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400">
            <p>&copy; 2025 MarketPulse by BrokerAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
      
      {/* Floating CTA Button */}
      {showFloatingCTA && (
        <div className="fixed bottom-6 right-6 z-50">
          <button
            onClick={handleStartTrial}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-2xl shadow-emerald-500/50 hover:shadow-emerald-500/70 transform hover:scale-105 transition-all duration-300 rounded-full font-bold"
          >
            <ArrowRight className="h-5 w-5" />
            Start Free Trial
          </button>
        </div>
      )}
    </div>
  );
}
