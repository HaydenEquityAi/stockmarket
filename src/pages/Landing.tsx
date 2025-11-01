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
    color: 'text-blue-600 bg-blue-100',
  },
  {
    icon: BarChart3,
    title: 'Portfolio Tracking',
    description: 'Track holdings, performance, and allocation with beautiful visualizations and analytics.',
    metric: '99% accuracy',
    color: 'text-green-600 bg-green-100',
  },
  {
    icon: DollarSign,
    title: 'Smart Money Insights',
    description: 'Follow congressional and institutional trades to make informed investment decisions.',
    metric: 'AI-powered',
    color: 'text-purple-600 bg-purple-100',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Optimized for speed with instant updates and responsive design for real-time trading.',
    metric: '<100ms',
    color: 'text-orange-600 bg-orange-100',
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Bank-level encryption and security to protect your financial data and investments.',
    metric: 'SOC 2 Compliant',
    color: 'text-cyan-600 bg-cyan-100',
  },
  {
    icon: Globe,
    title: 'Global Markets',
    description: 'Access stocks, indices, and market data from around the world in real-time.',
    metric: '50+ exchanges',
    color: 'text-indigo-600 bg-indigo-100',
  },
];

// Pricing plans
const pricingPlans = [
  {
    id: 'starter',
    name: 'Starter',
    price: 0,
    description: 'Perfect for individual investors getting started',
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
    description: 'For serious investors and portfolio managers',
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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">MarketPulse</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#home" className="text-gray-600 hover:text-gray-900 transition-colors">
                Home
              </a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">
                Pricing
              </a>
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">
                Features
              </a>
              <a href="#about" className="text-gray-600 hover:text-gray-900 transition-colors">
                About
              </a>
            </nav>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <Link 
                to="/login" 
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Sign In
              </Link>
              <Link 
                to="/register" 
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Get Started
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={toggleMobileMenu}
                className="text-gray-600 hover:text-gray-900 focus:outline-none focus:text-gray-900 transition-colors"
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
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
            onClick={closeMobileMenu}
          />
          
          {/* Mobile Menu */}
          <div className="fixed right-0 top-0 h-full w-80 max-w-sm bg-white shadow-xl transform transition-transform duration-300 ease-in-out">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-xl font-bold text-gray-900">MarketPulse</span>
                </div>
                <button
                  onClick={closeMobileMenu}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
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
                    className="w-full text-left px-4 py-4 text-lg font-medium text-gray-900 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors min-h-[44px] flex items-center"
                  >
                    Home
                  </button>
                  <button
                    onClick={() => handleMobileNavClick('#pricing')}
                    className="w-full text-left px-4 py-4 text-lg font-medium text-gray-900 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors min-h-[44px] flex items-center"
                  >
                    Pricing
                  </button>
                  <button
                    onClick={() => handleMobileNavClick('#features')}
                    className="w-full text-left px-4 py-4 text-lg font-medium text-gray-900 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors min-h-[44px] flex items-center"
                  >
                    Features
                  </button>
                  <button
                    onClick={() => handleMobileNavClick('/about')}
                    className="w-full text-left px-4 py-4 text-lg font-medium text-gray-900 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors min-h-[44px] flex items-center"
                  >
                    About
                  </button>
                </div>
              </nav>
              
              {/* Auth Buttons */}
              <div className="p-6 border-t border-gray-200 space-y-3">
                <Link
                  to="/login"
                  onClick={closeMobileMenu}
                  className="block w-full text-center px-4 py-3 text-gray-600 hover:text-gray-900 transition-colors font-medium"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={closeMobileMenu}
                  className="block w-full text-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-700 border border-blue-200 text-sm font-semibold">
                  🚀 Now with AI-powered automation
                </span>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  AI-Powered
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Portfolio Management</span>
                </h1>
                <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-lg">
                  Automate your investment tracking workflow with intelligent AI tools. 
                  Save time, reduce errors, and scale your portfolio effortlessly.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={handleStartTrial}
                  className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  Start Free Trial
                  <ArrowRight className="h-5 w-5" />
                </button>
                <button 
                  className="inline-flex items-center justify-center gap-2 px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:border-gray-400 hover:bg-gray-50 text-lg font-semibold transition-all"
                >
                  <Play className="h-5 w-5" />
                  View Demo
                </button>
              </div>
              
              <p className="text-sm text-gray-500">
                No credit card required • 14-day free trial • Cancel anytime
              </p>
            </div>
            
            {/* Right Content - Enhanced Hero Image */}
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-8 shadow-2xl transform hover:scale-105 transition-transform duration-500">
                <div className="bg-white rounded-xl p-6 space-y-4 shadow-lg">
                  <div className="flex items-center space-x-3">
                    <div className="h-3 w-3 bg-red-500 rounded-full"></div>
                    <div className="h-3 w-3 bg-yellow-500 rounded-full"></div>
                    <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                    <div className="ml-4 text-sm text-gray-500">MarketPulse Dashboard</div>
                  </div>
                  
                  {/* Dashboard Content */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <TrendingUp className="h-4 w-4 text-blue-600" />
                          <span className="text-xs font-medium text-blue-900">Portfolio</span>
                        </div>
                        <div className="text-lg font-bold text-blue-900 mt-1">$45K</div>
                      </div>
                      <div className="bg-green-50 p-3 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <DollarSign className="h-4 w-4 text-green-600" />
                          <span className="text-xs font-medium text-green-900">Gain</span>
                        </div>
                        <div className="text-lg font-bold text-green-900 mt-1">+12%</div>
                      </div>
                      <div className="bg-purple-50 p-3 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <BarChart3 className="h-4 w-4 text-purple-600" />
                          <span className="text-xs font-medium text-purple-900">Stocks</span>
                        </div>
                        <div className="text-lg font-bold text-purple-900 mt-1">8</div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-gray-700">Recent Activity</span>
                        <Bell className="h-3 w-3 text-gray-500" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                          <span className="text-xs text-gray-600">Position opened - NVDA</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                          <span className="text-xs text-gray-600">Alert triggered - AAPL $180</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="h-2 w-2 bg-yellow-500 rounded-full"></div>
                          <span className="text-xs text-gray-600">Dividend received - MSFT</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-6 -right-6 bg-white rounded-full p-4 shadow-lg animate-bounce">
                <Bot className="h-6 w-6 text-blue-600" />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white rounded-full p-4 shadow-lg animate-pulse">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div className="absolute top-1/2 -right-8 bg-white rounded-full p-3 shadow-lg animate-ping">
                <BarChart3 className="h-5 w-5 text-purple-600" />
              </div>
              <div className="absolute top-1/4 -left-8 bg-white rounded-full p-3 shadow-lg animate-bounce">
                <PieChart className="h-5 w-5 text-orange-600" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Everything you need to manage investments
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Powerful tools designed to streamline your investment workflow 
              and help you scale your portfolio.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="bg-white rounded-xl shadow-sm border-0 hover:shadow-2xl hover:scale-105 transition-all duration-300 group min-h-64">
                  <div className="p-8 h-full flex flex-col">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl ${feature.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="h-8 w-8" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed mb-4 flex-grow">
                      {feature.description}
                    </p>
                    <div className="mt-auto">
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-700 border border-green-200 text-sm font-medium">
                        {feature.metric}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-12 sm:py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Choose the plan that fits your portfolio size. All plans include our core features 
              with no hidden fees.
            </p>
            
            {/* Annual/Monthly Toggle */}
            <div className="flex items-center justify-center space-x-4 mb-8">
              <span className={`text-sm font-medium ${!isAnnual ? 'text-gray-900' : 'text-gray-500'}`}>
                Monthly
              </span>
              <button
                onClick={() => setIsAnnual(!isAnnual)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  isAnnual ? 'bg-blue-600' : 'bg-gray-300'
                }`}
                role="switch"
                aria-checked={isAnnual}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isAnnual ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
              <span className={`text-sm font-medium ${isAnnual ? 'text-gray-900' : 'text-gray-500'}`}>
                Annual
              </span>
              {isAnnual && (
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-700 border border-green-200 text-sm font-semibold ml-2">
                  Save 20%
                </span>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan) => {
              const IconComponent = plan.id === 'starter' ? Star : 
                                   plan.id === 'growth' ? Zap : Crown;
              
              return (
                <div 
                  key={plan.id} 
                  className={`relative bg-white rounded-xl border transition-all duration-300 hover:shadow-xl ${
                    plan.popular 
                      ? 'border-blue-500 shadow-lg scale-105' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="inline-flex items-center px-4 py-1 rounded-full bg-blue-500 text-white text-sm font-semibold">
                        Most Popular
                      </span>
                    </div>
                  )}
                  
                  <div className="text-center pb-8 pt-8">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
                      plan.id === 'starter' ? 'bg-yellow-100 text-yellow-600' :
                      plan.id === 'growth' ? 'bg-blue-100 text-blue-600' :
                      'bg-purple-100 text-purple-600'
                    }`}>
                      <IconComponent className="h-8 w-8" />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {plan.name}
                    </h3>
                    
                    <p className="text-gray-600 mt-2 mb-6">
                      {plan.description}
                    </p>
                    
                    <div className="mt-6">
                      <span className="text-5xl font-bold text-gray-900">${getPrice(plan.price)}</span>
                      <span className="text-gray-600 ml-2">{getPriceText(plan.price)}</span>
                    </div>
                  </div>

                  <div className="px-6 pb-6">
                    <ul className="space-y-4 mb-8">
                      {plan.features.map((feature, index) => {
                        const FeatureIcon = feature.icon;
                        return (
                          <li key={index} className="flex items-start">
                            <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mr-3 mt-0.5 ${
                              'highlight' in feature && feature.highlight ? 'bg-green-100' : 'bg-gray-100'
                            }`}>
                              <Check className={`h-3 w-3 ${
                                'highlight' in feature && feature.highlight ? 'text-green-600' : 'text-gray-600'
                              }`} />
                            </div>
                            <div className="flex items-center">
                              <FeatureIcon className="h-4 w-4 text-gray-500 mr-2" />
                              <span className={`text-sm ${
                                'highlight' in feature && feature.highlight ? 'text-green-700 font-medium' : 'text-gray-700'
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
                      className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                        plan.popular
                          ? 'bg-blue-600 hover:bg-blue-700 text-white'
                          : plan.buttonVariant === 'outline'
                          ? 'border-2 border-gray-300 text-gray-700 hover:bg-gray-50'
                          : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
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
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Trusted by investors nationwide
            </h2>
            <p className="text-lg sm:text-xl text-gray-600">
              Join 500+ investors who have transformed their portfolio management with MarketPulse
            </p>
          </div>
          
          {/* Company Logos */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-16">
            {companies.map((company, index) => (
              <div key={index} className="flex items-center justify-center p-4">
                <div className="text-gray-400 font-semibold text-sm">
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
                    <div className="bg-white rounded-xl shadow-lg border-0">
                      <div className="p-8 text-center">
                        <div className="flex items-center justify-center mb-6">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                          ))}
                        </div>
                        <Quote className="h-12 w-12 text-blue-600 mx-auto mb-6" />
                        <p className="text-lg text-gray-700 mb-8 leading-relaxed max-w-2xl mx-auto">
                          "{testimonial.content}"
                        </p>
                        <div className="flex items-center justify-center">
                          <div className="h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">
                            {testimonial.avatar}
                          </div>
                          <div className="text-left">
                            <div className="font-bold text-gray-900 text-lg">{testimonial.name}</div>
                            <div className="text-gray-600">{testimonial.role}, {testimonial.company}</div>
                            <div className="text-sm text-blue-600 font-medium">{testimonial.companySize}</div>
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
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-shadow"
            >
              <ChevronLeft className="h-6 w-6 text-gray-600" />
            </button>
            <button
              onClick={nextTestimonial}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-shadow"
            >
              <ChevronRight className="h-6 w-6 text-gray-600" />
            </button>
            
            {/* Dots Indicator */}
            <div className="flex justify-center space-x-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentTestimonial ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-12 sm:py-16 lg:py-24 bg-gradient-to-r from-blue-600 to-purple-600 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Ready to transform your investment tracking?
          </h2>
          <p className="text-lg sm:text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Join 500+ investors who increased returns by 30% and reduced tracking time by 40% with MarketPulse.
          </p>
          
          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-8 mb-8 sm:mb-12">
            <div className="flex items-center space-x-2 text-blue-100">
              <Shield className="h-5 w-5" />
              <span className="text-sm font-medium">SOC 2 Compliant</span>
            </div>
            <div className="flex items-center space-x-2 text-blue-100">
              <Lock className="h-5 w-5" />
              <span className="text-sm font-medium">Bank-Level Security</span>
            </div>
            <div className="flex items-center space-x-2 text-blue-100">
              <Award className="h-5 w-5" />
              <span className="text-sm font-medium">99.9% Uptime</span>
            </div>
            <div className="flex items-center space-x-2 text-blue-100">
              <CheckCircle className="h-5 w-5" />
              <span className="text-sm font-medium">24/7 Support</span>
            </div>
          </div>
          
          <div className="space-y-6">
            <button 
              onClick={handleStartTrial}
              className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-blue-600 hover:bg-gray-50 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Start Free Trial
              <ArrowRight className="h-6 w-6" />
            </button>
            <p className="text-blue-100 text-sm">
              No credit card required • 14-day free trial • Cancel anytime • Setup in 5 minutes
            </p>
          </div>
          
          {/* Customer Logos */}
          <div className="mt-16 pt-8 border-t border-blue-400/30">
            <p className="text-blue-200 text-sm mb-6">Trusted by leading investment firms</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 opacity-80">
              {companies.map((company, index) => (
                <div key={index} className="text-white font-semibold text-sm">
                  {company}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">MarketPulse</span>
              </div>
              <p className="text-gray-600 max-w-md">
                Streamline your portfolio management with AI-powered tools and comprehensive analytics.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                Product
              </h3>
              <ul className="space-y-2">
                <li><a href="#features" className="text-gray-600 hover:text-gray-900">Features</a></li>
                <li><a href="#pricing" className="text-gray-600 hover:text-gray-900">Pricing</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">AI Tools</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                Company
              </h3>
              <ul className="space-y-2">
                <li><a href="#about" className="text-gray-600 hover:text-gray-900">About</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Contact</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Privacy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-gray-600">
            <p>&copy; 2025 MarketPulse by BrokerAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
      
      {/* Floating CTA Button */}
      {showFloatingCTA && (
        <div className="fixed bottom-6 right-6 z-50">
          <button
            onClick={handleStartTrial}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 rounded-full font-semibold"
          >
            <ArrowRight className="h-5 w-5" />
            Start Free Trial
          </button>
        </div>
      )}
    </div>
  );
}
