import { useState } from 'react';
import PropTypes from 'prop-types';
import { ethers } from 'ethers';
import { getDataCID } from '../../utils/ipfsUtils';

function AssetCard({ 
  asset,
  isOwner,
  canBuy,
  isPurchased,
  onBuy,
  showDetailedView = false
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  // Handle buy action
  const handleBuy = async () => {
    if (!canBuy || isOwner || isPurchased) return;
    
    setIsLoading(true);
    try {
      await onBuy(asset.id, asset.price);
    } catch (error) {
      console.error('Error buying asset:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Generate a pseudo-random gradient for each category type
  const getCategoryGradient = (category) => {
    const hash = Array.from(category).reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const gradients = [
      'from-accent-300 to-accent-400', // Pink to Purple
      'from-accent-400 to-accent-500', // Purple to Blue
      'from-accent-500 to-accent-600', // Blue to Green
      'from-accent-600 to-accent-700', // Green to Yellow
      'from-primary-500 to-secondary-500', // Default
    ];
    return gradients[hash % gradients.length];
  };

  return (
    <div 
      className={`card card-hover transition-all duration-300 flex flex-col h-full ${
        isHovered ? 'shadow-glow' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Category Badge - positioned at top */}
      <div className="relative h-1.5 w-full bg-dark-500 overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-r ${getCategoryGradient(asset.category)}`}></div>
      </div>

      <div className="p-6 flex-grow">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-semibold text-light-100 mb-1 line-clamp-2">{asset.name}</h3>
          <span className="badge badge-primary text-xs capitalize whitespace-nowrap ml-2">
            {asset.category}
          </span>
        </div>
        
        <p className="text-light-300 mb-4 line-clamp-3">{asset.description}</p>
        
        {showDetailedView && (
          <div className="mb-4 text-sm text-light-400 space-y-2">
            <div className="flex items-center space-x-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-light-300" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              <span>Owner: <span className="font-mono text-light-200">{asset.owner?.substring(0, 8)}...</span></span>
            </div>
            
            {isPurchased && (
              <div className="flex items-center space-x-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-light-300" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                <span>Purchased: <span className="text-light-200">{asset.purchaseDate || 'N/A'}</span></span>
              </div>
            )}
            
            <div className="flex items-center space-x-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-light-300" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
              </svg>
              <span>IPFS: <span className="font-mono text-light-200">{asset.ipfsHash?.substring(0, 16)}...</span></span>
            </div>
            
            {!asset.isActive && isOwner && (
              <div className="flex items-center space-x-1.5 text-secondary-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>This listing is currently inactive</span>
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="border-t border-dark-400 p-4 bg-dark-500 mt-auto">
        <div className="flex items-center justify-between">
          <div className="font-bold text-lg">
            <span className="gradient-text">{typeof asset.price === 'string' ? asset.price : ethers.formatEther(asset.price)} ETH</span>
          </div>
          
          {isPurchased ? (
            <a
              href={`https://${getDataCID(asset.ipfsHash)}.ipfs.w3s.link`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary px-5 py-1.5"
            >
              <svg className="w-5 h-5 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 10V16M12 16L9 13M12 16L15 13M3 15C3 17.8284 3 19.2426 3.87868 20.1213C4.75736 21 6.17157 21 9 21H15C17.8284 21 19.2426 21 20.1213 20.1213C21 19.2426 21 17.8284 21 15V9C21 6.17157 21 4.75736 20.1213 3.87868C19.2426 3 17.8284 3 15 3H9C6.17157 3 4.75736 3 3.87868 3.87868C3 4.75736 3 6.17157 3 9V15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Access Data
            </a>
          ) : isOwner ? (
            <span className="badge badge-secondary py-1.5">You own this</span>
          ) : !canBuy ? (
            <span className="badge py-1.5 bg-dark-400 text-light-300">Connect wallet to buy</span>
          ) : (
            <button
              onClick={handleBuy}
              className={`btn btn-primary group px-5 py-1.5 ${isLoading ? 'opacity-80 cursor-not-allowed' : 'hover:translate-y-[-1px]'}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing
                </span>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-1 transition-transform group-hover:rotate-12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 3H12.72C10.4449 3 9.30737 3 8.38147 3.43597C7.55256 3.81947 6.81947 4.55256 6.43597 5.38147C6 6.30737 6 7.4449 6 9.72V17.2C6 18.8802 6 19.7202 6.32698 20.362C6.6146 20.9265 7.07354 21.3854 7.63803 21.673C8.27976 22 9.11984 22 10.8 22C12.4802 22 13.3202 22 13.962 21.673C14.5265 21.3854 14.9854 20.9265 15.273 20.362C15.6 19.7202 15.6 18.8802 15.6 17.2V16M10.8 16.8L21.6 16.8M21.6 16.8L18.4 13.6M21.6 16.8L18.4 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Buy Now
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

AssetCard.propTypes = {
  asset: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    ipfsHash: PropTypes.string.isRequired,
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
    owner: PropTypes.string,
    isActive: PropTypes.bool,
    purchaseDate: PropTypes.string
  }).isRequired,
  isOwner: PropTypes.bool,
  canBuy: PropTypes.bool,
  isPurchased: PropTypes.bool,
  onBuy: PropTypes.func,
  showDetailedView: PropTypes.bool
};

export default AssetCard;