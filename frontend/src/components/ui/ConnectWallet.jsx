import { useState } from 'react';
import { useWeb3 } from '../../context/Web3Context';

function ConnectWallet() {
  const { connectWallet, isConnected, account, disconnectWallet } = useWeb3();
  const [isConnecting, setIsConnecting] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Format address for display
  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  // Handle connect wallet
  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      await connectWallet();
    } catch (error) {
      console.error('Error connecting wallet:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  // Handle dropdown toggle
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  if (isConnected) {
    return (
      <div className="relative">
        <button
          onClick={toggleDropdown}
          className="flex items-center space-x-2 bg-dark-400 hover:bg-dark-300 text-light-100 px-3 py-2 rounded-lg transition-all duration-200 border border-dark-400 hover:border-primary-500"
        >
          <svg 
            className="w-5 h-5 text-primary-400" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" 
            />
          </svg>
          <span className="font-medium text-sm">{formatAddress(account)}</span>
          <svg 
            className={`w-4 h-4 ml-1 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M19 9l-7 7-7-7" 
            />
          </svg>
        </button>

        {/* Dropdown menu with animation */}
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg z-50 transform origin-top-right transition-all duration-200 bg-dark-500 border border-dark-400">
            <div className="py-1 divide-y divide-dark-400">
              {/* Wallet details section */}
              <div className="px-4 py-3">
                <p className="text-sm text-light-300">Connected with MetaMask</p>
                <p className="text-sm font-medium text-light-100 truncate mt-1 font-mono">
                  {account}
                </p>
              </div>
              
              {/* Action buttons */}
              <div className="py-1">
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(account);
                    // You could add a toast notification here
                  }}
                  className="flex w-full items-center px-4 py-2 text-sm text-light-300 hover:bg-dark-400 hover:text-light-100"
                >
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 5H6C4.89543 5 4 5.89543 4 7V19C4 20.1046 4.89543 21 6 21H16C17.1046 21 18 20.1046 18 19V18M8 5C8 6.10457 8.89543 7 10 7H12C13.1046 7 14 6.10457 14 5M8 5C8 3.89543 8.89543 3 10 3H12C13.1046 3 14 3.89543 14 5M14 5H16C17.1046 5 18 5.89543 18 7V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Copy Address
                </button>
                
                <button 
                  onClick={() => {
                    window.open(`https://etherscan.io/address/${account}`, '_blank');
                  }}
                  className="flex w-full items-center px-4 py-2 text-sm text-light-300 hover:bg-dark-400 hover:text-light-100"
                >
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 6H6C4.89543 6 4 6.89543 4 8V18C4 19.1046 4.89543 20 6 20H16C17.1046 20 18 19.1046 18 18V14M14 4H20M20 4V10M20 4L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  View on Etherscan
                </button>
                
                <button 
                  onClick={() => {
                    setIsDropdownOpen(false);
                    disconnectWallet();
                  }}
                  className="flex w-full items-center px-4 py-2 text-sm text-red-400 hover:bg-dark-400"
                >
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17 16L21 12M21 12L17 8M21 12L7 12M13 16V17C13 18.6569 11.6569 20 10 20H6C4.34315 20 3 18.6569 3 17V7C3 5.34315 4.34315 4 6 4H10C11.6569 4 13 5.34315 13 7V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Disconnect
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <button
      onClick={handleConnect}
      disabled={isConnecting}
      className="btn btn-primary group relative overflow-hidden"
    >
      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary-600 to-secondary-600 opacity-0 group-hover:opacity-100 transition-opacity"></span>
      <span className="relative flex items-center">
        {isConnecting ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Connecting...
          </>
        ) : (
          <>
            <svg className="w-5 h-5 mr-2 group-hover:animate-pulse" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2"/>
              <path d="M3.6 8.5C5.51109 6.5 8.47038 5.5 12 5.5C15.5296 5.5 18.4889 6.5 20.4 8.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M21 12C21 13.6569 16.9706 15 12 15C7.02944 15 3 13.6569 3 12" stroke="currentColor" strokeWidth="2"/>
            </svg>
            Connect Wallet
          </>
        )}
      </span>
    </button>
  );
}

export default ConnectWallet;