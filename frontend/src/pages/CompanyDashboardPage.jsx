import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useWeb3 } from '../context/Web3Context';
import { ethers } from 'ethers';
import { getIPFSGatewayURL } from '../utils/ipfsUtils';

function CompanyDashboardPage() {
  const { contract, account, isConnected, userRole } = useWeb3();
  
  const [purchasedAssets, setPurchasedAssets] = useState([]);
  const [spent, setSpent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    if (isConnected && userRole === 2) {
      fetchCompanyData();
    }
  }, [contract, account, userRole]);

  // Fetch company data (purchased assets)
  const fetchCompanyData = async () => {
    if (!contract || !account) return;

    try {
      setLoading(true);
      setError(null);
      
      // Get purchased assets
      const assetIds = await contract.getPurchasedAssets(account);
      
      let totalSpent = 0;
      
      if (assetIds.length > 0) {
        // Get details for each asset
        const assetDetails = await Promise.all(
          assetIds.map(async (id) => {
            const asset = await contract.dataAssets(id);
            const price = Number(ethers.formatEther(asset.fullPrice));
            
            totalSpent += price;
            
            return {
              id: Number(asset.id),
              owner: asset.owner,
              name: asset.name,
              description: asset.description,
              category: asset.category,
              ipfsHash: asset.ipfsHash,
              price: price,
              purchaseDate: 'N/A' // Transaction timestamp would be ideal here
            };
          })
        );
        
        setPurchasedAssets(assetDetails);
        setSpent(totalSpent);
      } else {
        setPurchasedAssets([]);
      }
    } catch (err) {
      console.error('Error fetching company data:', err);
      setError('Failed to load your data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="text-center py-12">
        <h1 className="text-3xl font-bold mb-4">Company Dashboard</h1>
        <p className="text-light-300 mb-8">Please connect your wallet to view your dashboard.</p>
        <Link to="/" className="btn btn-primary">
          Back to Home
        </Link>
      </div>
    );
  }

  if (userRole !== 2) {
    return (
      <div className="text-center py-12">
        <h1 className="text-3xl font-bold mb-4">Company Dashboard</h1>
        <p className="text-light-300 mb-8">This dashboard is only available for registered companies.</p>
        <Link to="/" className="btn btn-primary">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between md:items-center">
        <h1 className="text-3xl font-bold">Company Dashboard</h1>
        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          <Link to="/marketplace" className="btn btn-primary">
            Browse Marketplace
          </Link>
          <button
            onClick={fetchCompanyData}
            className="btn btn-secondary"
          >
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-800/30 text-red-300 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Company stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-light-100 mb-1">Purchased Assets</h3>
          <div className="text-3xl font-bold text-primary-400 mb-3">
            {purchasedAssets.length}
          </div>
          <p className="text-sm text-light-300">
            Total number of data assets you have purchased.
          </p>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-light-100 mb-1">Total Spent</h3>
          <div className="text-3xl font-bold text-primary-400 mb-3">
            {spent.toFixed(4)} ETH
          </div>
          <p className="text-sm text-light-300">
            Total amount spent on data purchases.
          </p>
        </div>
      </div>

      {/* Purchased assets */}
      <div>
        <h2 className="text-xl font-bold mb-4">
          Your Purchased Data
        </h2>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-400"></div>
            <p className="mt-4 text-light-300">Loading your assets...</p>
          </div>
        ) : purchasedAssets.length === 0 ? (
          <div className="text-center py-12 card">
            <p className="text-light-300 mb-6">You haven't purchased any data assets yet.</p>
            <Link to="/marketplace" className="btn btn-primary">
              Browse Marketplace
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {purchasedAssets.map((asset) => (
              <div key={asset.id} className="card overflow-hidden flex flex-col">
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-semibold mb-1">{asset.name}</h3>
                    <span className="inline-block bg-dark-400 px-2 py-1 text-xs font-semibold rounded text-light-200 capitalize">
                      {asset.category}
                    </span>
                  </div>
                  <p className="text-light-300 mb-4 line-clamp-3">{asset.description}</p>
                  <div className="space-y-2 text-sm text-light-300">
                    <p><span className="font-medium">Owner:</span> {asset.owner.substring(0, 8)}...</p>
                    <p><span className="font-medium">Price Paid:</span> {asset.price} ETH</p>
                    <p><span className="font-medium">Purchased:</span> {asset.purchaseDate}</p>
                  </div>
                </div>
                
                <div className="border-t border-dark-400 p-4 bg-dark-700 mt-auto">
                  <a
                    href={getIPFSGatewayURL(asset.ipfsHash)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary w-full text-center"
                  >
                    Access Data
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Transaction history - For a future enhancement */}
      <div>
        <h2 className="text-xl font-bold mb-4">
          Purchase History
        </h2>
        <div className="text-center py-8 card">
          <p className="text-light-300">
            Detailed purchase history will be available in a future update.
          </p>
        </div>
      </div>
    </div>
  );
}

export default CompanyDashboardPage;