import { useState, useEffect } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { ethers } from 'ethers';
import AssetCard from '../components/ui/AssetCard';

function MarketplacePage() {
  const { contract, account, isConnected, userRole } = useWeb3();
  
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('recent');
  const [visibleAssets, setVisibleAssets] = useState(6);

  // Categories
  const categories = ['all', 'finance', 'healthcare', 'technology', 'social', 'environment', 'other'];

  useEffect(() => {
    fetchAssets();
  }, [contract]);

  // Fetch all active assets from the contract
  const fetchAssets = async () => {
    if (!contract) return;

    try {
      setLoading(true);
      setError(null);

      // Get all active asset IDs
      const assetIds = await contract.getAllActiveAssets();

      // Get details for each asset
      const assetDetails = await Promise.all(
        assetIds.map(async (id) => {
          const asset = await contract.dataAssets(id);
          return {
            id: Number(asset.id),
            owner: asset.owner,
            name: asset.name,
            description: asset.description,
            category: asset.category,
            ipfsHash: asset.ipfsHash,
            price: ethers.formatEther(asset.fullPrice),
            isOwner: account && asset.owner.toLowerCase() === account.toLowerCase(),
            isActive: asset.isActive,
            createdAt: Number(asset.createdAt)
          };
        })
      );

      setAssets(assetDetails);
      // Reset visible assets when refreshing
      setVisibleAssets(6);
    } catch (err) {
      console.error('Error fetching assets:', err);
      setError('Failed to load marketplace data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Handle buying a data asset
  const handleBuyAsset = async (assetId, price) => {
    if (!contract || !isConnected) return;

    try {
      const tx = await contract.buyData(assetId, {
        value: ethers.parseEther(price)
      });
      await tx.wait();
      
      // Refresh assets
      await fetchAssets();
    } catch (err) {
      console.error('Error buying asset:', err);
      alert('Failed to complete purchase. Please try again.');
    }
  };

  // Filter and sort assets
  const processedAssets = assets
    .filter(asset => {
      const matchesCategory = selectedCategory === 'all' || asset.category.toLowerCase() === selectedCategory;
      const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         asset.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      switch(sortOption) {
        case 'price-low':
          return parseFloat(a.price) - parseFloat(b.price);
        case 'price-high':
          return parseFloat(b.price) - parseFloat(a.price);
        case 'recent':
          return b.createdAt - a.createdAt;
        default:
          return 0;
      }
    });
  
  // Load more function
  const handleLoadMore = () => {
    setVisibleAssets(prev => prev + 6);
  };

  // Displayed assets limited by visibleAssets
  const displayedAssets = processedAssets.slice(0, visibleAssets);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Page Header with animated background */}
      <div className="relative overflow-hidden py-16 px-6 rounded-2xl bg-dark-600 text-center">
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary-500/30 rounded-full filter blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-secondary-500/20 rounded-full filter blur-3xl"></div>
        </div>
        
        <div className="relative">
          <h1 className="text-4xl md:text-5xl font-bold text-light-100 mb-3">Data Marketplace</h1>
          <p className="text-xl text-light-300 max-w-3xl mx-auto">
            Discover valuable data assets from verified providers
          </p>
        </div>
      </div>

      {/* Search and filters */}
      <div className="card p-5">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 space-y-1.5">
            <label htmlFor="search" className="text-sm text-light-300 ml-1">Search</label>
            <div className="relative">
              <input
                id="search"
                type="text"
                placeholder="Search by name or description..."
                className="input pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-light-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="w-full md:w-48 space-y-1.5">
            <label htmlFor="category" className="text-sm text-light-300 ml-1">Category</label>
            <select
              id="category"
              className="input"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>
          
          <div className="w-full md:w-48 space-y-1.5">
            <label htmlFor="sort" className="text-sm text-light-300 ml-1">Sort By</label>
            <select
              id="sort"
              className="input"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="recent">Most Recent</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
          
          <button 
            onClick={fetchAssets}
            className="btn btn-primary h-12 px-5 min-w-[100px]"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 4V9H4.58152M19.9381 11C19.446 7.05369 16.0796 4 12 4C8.64262 4 5.76829 6.06817 4.58152 9M4.58152 9H9M20 20V15H19.4185M19.4185 15C18.2317 17.9318 15.3574 20 12 20C7.92038 20 4.55399 16.9463 4.06189 13M19.4185 15H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Refresh
          </button>
        </div>
      </div>

      {/* Stats and results */}
      {!loading && !error && (
        <div className="flex justify-between items-center px-1">
          <div className="text-light-300">
            Showing <span className="text-light-100 font-semibold">{Math.min(displayedAssets.length, visibleAssets)}</span> of 
            <span className="text-light-100 font-semibold"> {processedAssets.length}</span> results
          </div>
          {userRole === 1 && (
            <div className="text-light-400 text-sm">
              <span className="inline-block px-2 py-1 bg-dark-600 rounded-lg">
                Selling as User
              </span>
            </div>
          )}
          {userRole === 2 && (
            <div className="text-light-400 text-sm">
              <span className="inline-block px-2 py-1 bg-dark-600 rounded-lg">
                Browsing as Company
              </span>
            </div>
          )}
        </div>
      )}

      {/* Assets grid with animation */}
      {loading ? (
        <div className="text-center py-20">
          <div className="inline-block h-16 w-16 relative">
            <div className="absolute inset-0 rounded-full border-4 border-t-primary-500 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
            <div className="absolute inset-2 rounded-full border-4 border-t-secondary-500 border-r-transparent border-b-transparent border-l-transparent animate-spin-slow"></div>
          </div>
          <p className="mt-6 text-light-300 text-lg">Loading marketplace data...</p>
        </div>
      ) : error ? (
        <div className="card py-16 text-center">
          <div className="flex flex-col items-center">
            <svg className="w-16 h-16 text-red-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-xl text-red-400 mb-2">Error Loading Data</p>
            <p className="text-light-300 mb-6">{error}</p>
            <button 
              onClick={fetchAssets}
              className="btn btn-outline"
            >
              Try Again
            </button>
          </div>
        </div>
      ) : processedAssets.length === 0 ? (
        <div className="card py-16 text-center">
          <div className="flex flex-col items-center">
            <svg className="w-16 h-16 text-light-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-xl text-light-200 mb-2">No Data Assets Found</p>
            <p className="text-light-300">Try changing your search criteria or check back later.</p>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedAssets.map((asset, index) => (
              <div
                key={asset.id} 
                className="transform transition-all duration-500 opacity-0 animate-fade-in"
                style={{
                  animationDelay: `${index * 150}ms`,
                  animationFillMode: 'forwards'
                }}
              >
                <AssetCard
                  asset={asset}
                  isOwner={asset.isOwner}
                  canBuy={isConnected && userRole === 2 && !asset.isOwner}
                  isPurchased={false}
                  onBuy={handleBuyAsset}
                  showDetailedView={true}
                />
              </div>
            ))}
          </div>
          
          {/* Load more button */}
          {visibleAssets < processedAssets.length && (
            <div className="flex justify-center mt-12">
              <button
                onClick={handleLoadMore}
                className="btn btn-outline group"
              >
                <span>Load More</span>
                <svg className="w-5 h-5 ml-2 transition-transform group-hover:translate-y-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default MarketplacePage;