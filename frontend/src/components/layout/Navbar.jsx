import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useWeb3 } from '../../context/Web3Context';
import ConnectWallet from '../ui/ConnectWallet';

function Navbar() {
  const { isConnected, userRole } = useWeb3();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-dark-600/90 backdrop-blur-lg shadow-lg' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center group">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center shadow-glow">
                  <span className="text-light-100 font-bold">DM</span>
                </div>
                <span className="text-xl font-bold gradient-text group-hover:opacity-80 transition-opacity">DataMarketplace</span>
              </div>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-1">
            <NavLink to="/marketplace" isActive={isActive('/marketplace')}>
              Marketplace
            </NavLink>
            
            {isConnected && userRole === 1 && (
              <>
                <NavLink to="/dashboard/user" isActive={isActive('/dashboard/user')}>
                  My Dashboard
                </NavLink>
                <NavLink to="/upload" isActive={isActive('/upload')}>
                  Upload Data
                </NavLink>
              </>
            )}
            
            {isConnected && userRole === 2 && (
              <NavLink to="/dashboard/company" isActive={isActive('/dashboard/company')}>
                Company Dashboard
              </NavLink>
            )}
            
            <div className="ml-3">
              <ConnectWallet />
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-light-300 hover:text-light-100 hover:bg-dark-400 transition-colors"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu - with smooth animation */}
      <div 
        className={`md:hidden transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0 pointer-events-none'}`}
      >
        <div className="glass px-2 pt-2 pb-3 space-y-1 border-t border-dark-400">
          <MobileNavLink to="/marketplace" isActive={isActive('/marketplace')}>
            Marketplace
          </MobileNavLink>
          
          {isConnected && userRole === 1 && (
            <>
              <MobileNavLink to="/dashboard/user" isActive={isActive('/dashboard/user')}>
                My Dashboard
              </MobileNavLink>
              <MobileNavLink to="/upload" isActive={isActive('/upload')}>
                Upload Data
              </MobileNavLink>
            </>
          )}
          
          {isConnected && userRole === 2 && (
            <MobileNavLink to="/dashboard/company" isActive={isActive('/dashboard/company')}>
              Company Dashboard
            </MobileNavLink>
          )}
          
          <div className="px-3 py-2">
            <ConnectWallet />
          </div>
        </div>
      </div>
    </nav>
  );
}

// Desktop Nav Link Component
function NavLink({ children, to, isActive }) {
  return (
    <Link 
      to={to} 
      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 relative group ${
        isActive 
          ? 'text-light-100' 
          : 'text-light-300 hover:text-light-100'
      }`}
    >
      {children}
      {/* Animated underline effect */}
      <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 transform origin-left transition-transform duration-300 ${
        isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
      }`}></span>
    </Link>
  );
}

// Mobile Nav Link Component
function MobileNavLink({ children, to, isActive }) {
  return (
    <Link 
      to={to} 
      className={`block px-3 py-2 rounded-md text-base font-medium ${
        isActive 
          ? 'bg-dark-400 text-light-100' 
          : 'text-light-300 hover:bg-dark-400 hover:text-light-100'
      } transition-colors duration-200`}
    >
      {children}
    </Link>
  );
}

export default Navbar;