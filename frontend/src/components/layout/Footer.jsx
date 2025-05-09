import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark-600 pt-12 pb-8 border-t border-dark-400 relative overflow-hidden">
      {/* Background subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-tr from-primary-600/5 to-secondary-600/5 pointer-events-none"></div>
      
      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                <span className="text-light-100 font-bold">DM</span>
              </div>
              <h3 className="text-xl font-bold gradient-text">DataMarketplace</h3>
            </div>
            
            <p className="text-light-300 leading-relaxed">
              A decentralized marketplace for buying and selling data assets using blockchain technology and IPFS.
            </p>
            
            <div className="pt-2">
              <span className="text-light-300 text-sm">Powered by</span>
              <div className="flex items-center mt-2 space-x-3">
                <div className="flex items-center h-6 opacity-70 hover:opacity-100 transition-opacity">
                  <span className="text-light-200 text-xs">Blockchain</span>
                </div>
                <div className="flex items-center h-6 opacity-70 hover:opacity-100 transition-opacity">
                  <span className="text-light-200 text-xs">IPFS</span>
                </div>
                <div className="flex items-center h-5 opacity-70 hover:opacity-100 transition-opacity">
                  <span className="text-light-200 text-xs">React</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-light-100">Quick Links</h3>
            <ul className="space-y-3">
              <FooterLink to="/">Home</FooterLink>
              <FooterLink to="/marketplace">Marketplace</FooterLink>
              <FooterLink to="/upload">Upload Data</FooterLink>
              <FooterLink to="/about">About</FooterLink>
            </ul>
          </div>
          
          {/* Connect Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-light-100">Connect</h3>
            <p className="text-light-300">Stay updated with our latest developments</p>
            
            {/* Simple newsletter form */}
            <div className="mt-3 flex flex-col sm:flex-row gap-2">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="input bg-dark-500 border-dark-400 text-sm"
              />
              <button className="btn btn-primary text-sm whitespace-nowrap">
                Subscribe
              </button>
            </div>
            
            {/* Social links */}
            <div className="flex space-x-4 mt-4">
              <SocialLink href="#" ariaLabel="Twitter">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </SocialLink>
              <SocialLink href="#" ariaLabel="GitHub">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </SocialLink>
              <SocialLink href="#" ariaLabel="Discord">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.419 0 1.334-.956 2.419-2.157 2.419zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.419 0 1.334-.946 2.419-2.157 2.419z" />
                </svg>
              </SocialLink>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="mt-12 pt-6 border-t border-dark-400 text-center">
          <p className="text-light-400 text-sm">
            &copy; {currentYear} DataMarketplace. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

// Footer link component with hover effect
function FooterLink({ to, children }) {
  return (
    <li>
      <Link 
        to={to} 
        className="text-light-300 hover:text-light-100 transition-colors duration-200 inline-block relative group"
      >
        <span>{children}</span>
        <span className="absolute left-0 bottom-0 h-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 w-0 group-hover:w-full transition-all duration-300"></span>
      </Link>
    </li>
  );
}

// Social link component
function SocialLink({ href, ariaLabel, children }) {
  return (
    <a 
      href={href} 
      className="text-light-300 hover:text-light-100 transition-colors duration-200 transform hover:scale-110"
      aria-label={ariaLabel}
    >
      {children}
    </a>
  );
}

export default Footer;