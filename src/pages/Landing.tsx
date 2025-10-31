import { TrendingUp, BarChart3, DollarSign, Zap, Shield, Globe, Check, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <TrendingUp size={24} className="text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">MarketPulse</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#home" className="text-gray-600 hover:text-gray-900 font-medium">Home</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 font-medium">Pricing</a>
              <a href="#features" className="text-gray-600 hover:text-gray-900 font-medium">Features</a>
              <a href="#about" className="text-gray-600 hover:text-gray-900 font-medium">About</a>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/login')}
                className="px-6 py-2 text-gray-700 hover:text-gray-900 font-medium"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate('/register')}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-sm"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full mb-6">
                <Zap size={16} className="text-blue-600" />
                <span className="text-sm font-medium text-blue-600">Now with AI-powered automation</span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                AI-Powered<br />
                <span className="text-blue-600">Portfolio Management</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Automate your investment tracking workflow with intelligent AI tools. Save time, reduce errors, and scale your portfolio effortlessly.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate('/register')}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
                >
                  Get Started
                  <ChevronRight size={20} />
                </button>
                <button className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:border-gray-400 font-semibold text-lg transition-all">
                  View Demo
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-6">
                Get started in minutes • No credit card required • Cancel anytime
              </p>
            </div>

            {/* Right - Dashboard Preview */}
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-6 border border-gray-200">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="ml-4 text-sm text-gray-600">MarketPulse Dashboard</span>
                </div>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp size={20} className="text-blue-600" />
                      <span className="text-sm text-gray-600">Portfolio</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">$45K</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign size={20} className="text-green-600" />
                      <span className="text-sm text-gray-600">Gain</span>
                    </div>
                    <p className="text-2xl font-bold text-green-600">+12%</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <BarChart3 size={20} className="text-purple-600" />
                      <span className="text-sm text-gray-600">Stocks</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">8</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">📈 Position opened - NVDA</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">✅ Alert triggered - AAPL $180</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">💰 Dividend received - MSFT</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything you need to manage investments
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Powerful tools designed to streamline your investment workflow and help you scale your portfolio.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature Cards */}
            {[
              {
                icon: <TrendingUp size={24} />,
                title: 'Real-Time Data',
                description: 'Live market quotes, charts, and price alerts updated every second',
                color: 'bg-blue-100 text-blue-600',
                badge: 'Live updates'
              },
              {
                icon: <BarChart3 size={24} />,
                title: 'Portfolio Tracking',
                description: 'Track holdings, performance, and allocation with beautiful visualizations',
                color: 'bg-green-100 text-green-600',
                badge: '99% accuracy'
              },
              {
                icon: <DollarSign size={24} />,
                title: 'Smart Money Insights',
                description: 'Follow congressional and institutional trades to make informed decisions',
                color: 'bg-purple-100 text-purple-600',
                badge: 'AI-powered'
              },
              {
                icon: <Zap size={24} />,
                title: 'Lightning Fast',
                description: 'Optimized for speed with instant updates and responsive design',
                color: 'bg-orange-100 text-orange-600',
                badge: '<100ms'
              },
              {
                icon: <Shield size={24} />,
                title: 'Secure & Private',
                description: 'Bank-level encryption and security to protect your financial data',
                color: 'bg-cyan-100 text-cyan-600',
                badge: 'SOC 2 Compliant'
              },
              {
                icon: <Globe size={24} />,
                title: 'Global Markets',
                description: 'Access stocks, indices, and market data from around the world',
                color: 'bg-indigo-100 text-indigo-600',
                badge: '50+ exchanges'
              }
            ].map((feature, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl border border-gray-200 hover:shadow-lg transition-shadow">
                <div className={`w-14 h-14 ${feature.color} rounded-xl flex items-center justify-center mb-4`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  {feature.badge}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Simple, transparent pricing</h2>
            <p className="text-xl text-gray-600">
              Choose the plan that fits your portfolio size. All plans include our core features<br />with no hidden fees.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Pricing Cards */}
            {[
              { name: 'Starter', price: '0', features: ['Up to 5 stocks', 'Real-time data', 'Basic analytics', 'Email support'], popular: false },
              { name: 'Growth', price: '19', features: ['Up to 25 stocks', 'Priority support', 'Advanced analytics', 'Price alerts', 'API access'], popular: true },
              { name: 'Professional', price: '49', features: ['Unlimited stocks', 'Dedicated support', 'Custom integrations', 'White label', 'Premium insights'], popular: false }
            ].map((plan, i) => (
              <div key={i} className={`bg-white rounded-2xl p-8 ${plan.popular ? 'ring-2 ring-blue-600 shadow-xl' : 'border border-gray-200'} relative`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-5xl font-bold text-gray-900">${plan.price}</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-3">
                      <Check size={20} className="text-green-600 flex-shrink-0" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => navigate('/register')}
                  className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                    plan.popular
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  Sign Up to Start
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to transform your<br />investment tracking?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join 500+ investors who increased returns by 30% and reduced tracking time by 40% with MarketPulse.
          </p>
          <div className="flex flex-wrap justify-center gap-8 mb-10">
            {['SOC 2 Compliant', 'Bank-Level Security', '99.9% Uptime', '24/7 Support'].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-white">
                <Check size={20} />
                <span>{item}</span>
              </div>
            ))}
          </div>
          <button
            onClick={() => navigate('/register')}
            className="inline-flex items-center gap-2 px-10 py-5 bg-white text-blue-600 rounded-xl hover:bg-blue-50 font-bold text-xl shadow-2xl hover:scale-105 transition-transform"
          >
            Get Started
            <ChevronRight size={24} />
          </button>
          <p className="text-blue-100 mt-6">
            No credit card required • Setup in 5 minutes • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                  <TrendingUp size={24} className="text-white" />
                </div>
                <span className="text-xl font-bold">MarketPulse</span>
              </div>
              <p className="text-gray-400">
                Streamline your portfolio management with AI-powered tools and comprehensive analytics.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">PRODUCT</h4>
              <ul className="space-y-2">
                <li><a href="#features" className="text-gray-400 hover:text-white">Features</a></li>
                <li><a href="#pricing" className="text-gray-400 hover:text-white">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">COMPANY</h4>
              <ul className="space-y-2">
                <li><a href="#about" className="text-gray-400 hover:text-white">About</a></li>
                <li><a href="#contact" className="text-gray-400 hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">LEGAL</h4>
              <ul className="space-y-2">
                <li><a href="#privacy" className="text-gray-400 hover:text-white">Privacy</a></li>
                <li><a href="#terms" className="text-gray-400 hover:text-white">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>© 2025 MarketPulse by BrokerAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
