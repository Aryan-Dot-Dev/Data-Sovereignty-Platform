import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useWeb3 } from '../context/Web3Context';

function HomePage() {
  const { isConnected, userRole, registerAsUser, registerAsCompany } = useWeb3();
  const [isRegistering, setIsRegistering] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  // Animation for cycling through features
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 3);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const handleRegisterAsUser = async () => {
    setIsRegistering(true);
    try {
      await registerAsUser();
    } catch (error) {
      console.error('Error registering as user:', error);
    } finally {
      setIsRegistering(false);
    }
  };

  const handleRegisterAsCompany = async () => {
    setIsRegistering(true);
    try {
      await registerAsCompany();
    } catch (error) {
      console.error('Error registering as company:', error);
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="space-y-24 pt-16">
      {/* Hero Section with animated elements */}
      <section className="relative overflow-hidden py-20 sm:py-32">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary-500/10 rounded-full filter blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-secondary-500/10 rounded-full filter blur-3xl"></div>
          <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-accent-400/5 rounded-full filter blur-3xl animate-pulse-slow"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block mb-6">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-500/10 text-primary-300">
              Powered by Blockchain + IPFS
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="block text-light-100">Decentralized</span>
            <span className="gradient-text">Data Marketplace</span>
          </h1>
          
          <p className="text-xl text-light-300 max-w-3xl mx-auto leading-relaxed">
            Buy and sell data securely using blockchain technology and IPFS storage.
            Own your data, monetize it, or discover valuable datasets.
          </p>
          
          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <Link
              to="/marketplace"
              className="btn btn-primary text-lg px-8 py-3 hover-lift hover-glow group"
            >
              <span>Browse Marketplace</span>
              <svg className="w-5 h-5 ml-2 transition-transform transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
            
            {isConnected ? (
              userRole === 1 ? (
                <Link
                  to="/upload"
                  className="btn btn-outline text-lg px-8 py-3 hover-lift"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  Upload Your Data
                </Link>
              ) : userRole === 2 ? (
                <Link
                  to="/dashboard/company"
                  className="btn btn-outline text-lg px-8 py-3 hover-lift"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Company Dashboard
                </Link>
              ) : (
                <div className="mt-8 w-full flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={handleRegisterAsUser}
                    disabled={isRegistering}
                    className="btn btn-secondary text-lg px-8 py-3 hover-lift relative"
                  >
                    {isRegistering ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      <>
                        <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Register as User
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleRegisterAsCompany}
                    disabled={isRegistering}
                    className="btn btn-outline text-lg px-8 py-3 hover-lift"
                  >
                    {isRegistering ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      <>
                        <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        Register as Company
                      </>
                    )}
                  </button>
                </div>
              )
            ) : (
              <Link
                to="/connect"
                className="btn btn-outline text-lg px-8 py-3 hover-lift"
              >
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Connect Your Wallet
              </Link>
            )}
          </div>
          
          <div className="mt-20 flex justify-center">
            <svg className="w-6 h-6 animate-bounce text-light-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </section>

      {/* Features Section - Interactive with animations */}
      <section className="py-16 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              <span className="gradient-text">How It Works</span>
            </h2>
            <p className="text-xl text-light-300 max-w-3xl mx-auto">
              Simple, secure, and decentralized data exchange
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              isActive={activeFeature === 0}
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              }
              title="Upload Data"
              description="Securely upload your data to IPFS, set your price, and create a listing on our marketplace."
              color="from-primary-500 to-primary-600"
              onClick={() => setActiveFeature(0)}
            />

            <FeatureCard 
              isActive={activeFeature === 1}
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              }
              title="Browse & Discover"
              description="Find valuable datasets from various categories. Preview metadata before purchasing."
              color="from-accent-400 to-accent-500"
              onClick={() => setActiveFeature(1)}
            />

            <FeatureCard 
              isActive={activeFeature === 2}
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              title="Buy & Sell"
              description="Purchase data with cryptocurrency. Sellers receive funds instantly through smart contracts."
              color="from-secondary-500 to-secondary-600"
              onClick={() => setActiveFeature(2)}
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 relative bg-dark-600">
        <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatCard value="100+" label="Data Assets" />
            <StatCard value="50+" label="Sellers" />
            <StatCard value="200+" label="Buyers" />
            <StatCard value="10K+" label="Transactions" />
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full h-1/2 bg-gradient-to-b from-primary-500/5 to-transparent"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-light-100">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-light-300 max-w-2xl mx-auto mb-10">
            Join our decentralized marketplace today and start monetizing your data or discovering valuable datasets.
          </p>
          <Link
            to="/connect"
            className="btn btn-primary group px-8 py-3 text-lg"
          >
            <span>Connect Wallet</span>
            <svg className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
}

// Feature card component with interactive hover effects
function FeatureCard({ icon, title, description, color, isActive, onClick }) {
  return (
    <div
      className={`card transition-all duration-300 p-6 ${
        isActive ? 'border-primary-500 shadow-glow -translate-y-1' : 'hover:border-primary-500/30'
      }`}
      onClick={onClick}
    >
      <div className={`w-14 h-14 mb-6 flex items-center justify-center rounded-xl bg-gradient-to-br ${color} text-light-100`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 text-light-100">{title}</h3>
      <p className="text-light-300">
        {description}
      </p>
    </div>
  );
}

// Stat card component with counting animation
function StatCard({ value, label }) {
  const [count, setCount] = useState(0);
  const finalValue = parseInt(value.replace(/\D/g, ''), 10);
  
  useEffect(() => {
    const duration = 2000; // ms
    const frameDuration = 1000 / 60; // 60fps
    const totalFrames = Math.round(duration / frameDuration);
    let frame = 0;
    
    const counter = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      const currentCount = Math.round(progress * finalValue);
      
      if (frame === totalFrames) {
        clearInterval(counter);
        setCount(finalValue);
      } else {
        setCount(currentCount);
      }
    }, frameDuration);
    
    return () => clearInterval(counter);
  }, [finalValue]);
  
  return (
    <div className="text-center">
      <div className="text-4xl font-bold gradient-text mb-2">{count}{value.includes('+') ? '+' : ''}</div>
      <div className="text-light-300">{label}</div>
    </div>
  );
}

export default HomePage;