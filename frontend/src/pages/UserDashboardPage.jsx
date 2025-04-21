import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useWeb3 } from '../context/Web3Context';
import { ethers } from 'ethers';
import { getIPFSGatewayURL } from '../utils/ipfsUtils';

function UserDashboardPage() {
  const { contract, account, isConnected, userRole } = useWeb3();
  
  const [userAssets, setUserAssets] = useState([]);
  const [balance, setBalance] = useState('0');
  const [loading, setLoading] = useState(true);
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    if (isConnected && userRole === 1) {
      fetchUserData();
    }
  }, [contract, account, userRole]);

  // Fetch user data (assets and balance)
  const fetchUserData = async () => {
    if (!contract || !account) return;

    try {
      setLoading(true);
      setError(null);
      
      // Get user balance
      const balanceWei = await contract.balances(account);
      const balanceEth = ethers.formatEther(balanceWei);
      setBalance(balanceEth);
      
      // Get user assets
      const assetIds = await contract.getUserAssets(account);
      
      if (assetIds.length > 0) {
        // Get details for each asset
        const assetDetails = await Promise.all(
          assetIds.map(async (id) => {
            const asset = await contract.dataAssets(id);
            return {
              id: Number(asset.id),
              name: asset.name,
              description: asset.description,
              category: asset.category,
              ipfsHash: asset.ipfsHash,
              price: ethers.formatEther(asset.fullPrice),
              isActive: asset.isActive
            };
          })
        );
        
        setUserAssets(assetDetails);
      } else {
        setUserAssets([]);
      }
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError('Failed to load your data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Handle withdraw funds
  const handleWithdraw = async () => {
    if (!contract || !account || Number(balance) <= 0) return;

    try {
      setWithdrawLoading(true);
      
      const tx = await contract.withdraw();
      await tx.wait();
      
      // Refresh balance
      const newBalance = await contract.balances(account);
      setBalance(ethers.formatEther(newBalance));
      
      alert('Funds withdrawn successfully!');
    } catch (err) {
      console.error('Error withdrawing funds:', err);
      alert('Failed to withdraw funds. Please try again.');
    } finally {
      setWithdrawLoading(false);
    }
  };

  // Toggle asset availability
  const toggleAssetAvailability = async (assetId) => {
    if (!contract) return;

    try {
      const tx = await contract.toggleAssetAvailability(assetId);
      await tx.wait();
      
      // Update asset in state
      setUserAssets(prevAssets => 
        prevAssets.map(asset => 
          asset.id === assetId 
            ? { ...asset, isActive: !asset.isActive } 
            : asset
        )
      );
    } catch (err) {
      console.error('Error toggling asset availability:', err);
      alert('Failed to update asset. Please try again.');
    }
  };

  // Update asset price
  const updateAssetPrice = async (assetId, newPrice) => {
    if (!contract) return;

    try {
      const priceWei = ethers.parseEther(newPrice);
      const tx = await contract.updateAssetPrice(assetId, priceWei);
      await tx.wait();
      
      // Update asset in state
      setUserAssets(prevAssets => 
        prevAssets.map(asset => 
          asset.id === assetId 
            ? { ...asset, price: newPrice } 
            : asset
        )
      );
      
      alert('Price updated successfully!');
    } catch (err) {
      console.error('Error updating price:', err);
      alert('Failed to update price. Please try again.');
    }
  };

  if (!isConnected) {
    return (
      <div className="text-center py-12">
        <h1 className="text-3xl font-bold mb-4">User Dashboard</h1>
        <p className="text-light-300 mb-8">Please connect your wallet to view your dashboard.</p>
        <Link to="/" className="btn btn-primary">
          Back to Home
        </Link>
      </div>
    );
  }

  if (userRole !== 1) {
    return (
      <div className="text-center py-12">
        <h1 className="text-3xl font-bold mb-4">User Dashboard</h1>
        <p className="text-light-300 mb-8">This dashboard is only available for registered users.</p>
        <Link to="/" className="btn btn-primary">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between md:items-center">
        <h1 className="text-3xl font-bold">User Dashboard</h1>
        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          <Link to="/upload" className="btn btn-primary">
            Upload New Data
          </Link>
          <button
            onClick={fetchUserData}
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

      {/* User stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6 flex flex-col">
          <h3 className="text-lg font-semibold text-light-100 mb-1">Your Balance</h3>
          <div className="text-3xl font-bold text-primary-400 mb-3">
            {balance} ETH
          </div>
          <p className="text-sm text-light-300 mb-4">
            Total earnings from data sales.
          </p>
          <button
            onClick={handleWithdraw}
            disabled={Number(balance) <= 0 || withdrawLoading}
            className={`btn mt-auto ${Number(balance) <= 0 ? 'bg-dark-400 cursor-not-allowed text-dark-200' : 'btn-primary'}`}
          >
            {withdrawLoading ? 'Withdrawing...' : 'Withdraw Funds'}
          </button>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-light-100 mb-1">Your Data Assets</h3>
          <div className="text-3xl font-bold text-primary-400 mb-3">
            {userAssets.length}
          </div>
          <p className="text-sm text-light-300">
            Total data assets listed on the marketplace.
          </p>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-light-100 mb-1">Active Listings</h3>
          <div className="text-3xl font-bold text-primary-400 mb-3">
            {userAssets.filter(asset => asset.isActive).length}
          </div>
          <p className="text-sm text-light-300">
            Data assets currently available for purchase.
          </p>
        </div>
      </div>

      {/* User assets */}
      <div>
        <h2 className="text-xl font-bold mb-4">
          Your Data Assets
        </h2>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-400"></div>
            <p className="mt-4 text-light-300">Loading your assets...</p>
          </div>
        ) : userAssets.length === 0 ? (
          <div className="text-center py-12 card">
            <p className="text-light-300 mb-6">You haven't listed any data assets yet.</p>
            <Link to="/upload" className="btn btn-primary">
              Upload Your First Data Asset
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full card">
              <thead>
                <tr className="bg-dark-700 text-light-200 uppercase text-sm leading-normal border-b border-dark-400">
                  <th className="py-3 px-6 text-left">Name</th>
                  <th className="py-3 px-6 text-left">Category</th>
                  <th className="py-3 px-6 text-center">Price (ETH)</th>
                  <th className="py-3 px-6 text-center">Status</th>
                  <th className="py-3 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="text-light-300">
                {userAssets.map((asset) => (
                  <tr key={asset.id} className="border-b border-dark-400 hover:bg-dark-500">
                    <td className="py-4 px-6">
                      <div className="font-medium">{asset.name}</div>
                      <div className="text-sm text-light-300 truncate max-w-xs">
                        {asset.description.substring(0, 60)}{asset.description.length > 60 ? '...' : ''}
                      </div>
                    </td>
                    <td className="py-4 px-6 capitalize">{asset.category}</td>
                    <td className="py-4 px-6 text-center">
                      <div className="relative group">
                        <div className="font-medium">{asset.price}</div>
                        <div className="absolute hidden group-hover:block bg-dark-600 shadow-lg rounded p-2 -left-10 transform -translate-y-full border border-dark-400">
                          <div className="flex items-center space-x-2">
                            <input 
                              type="number"
                              min="0"
                              step="0.001"
                              className="w-24 px-2 py-1 bg-dark-700 border border-dark-400 rounded text-light-200"
                              defaultValue={asset.price}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  updateAssetPrice(asset.id, e.target.value);
                                }
                              }}
                            />
                            <button 
                              className="text-xs bg-primary-600 text-light-100 px-2 py-1 rounded"
                              onClick={(e) => {
                                const input = e.target.previousSibling;
                                updateAssetPrice(asset.id, input.value);
                              }}
                            >
                              Update
                            </button>
                          </div>
                          <div className="text-xs text-light-300 mt-1">
                            Click to edit, press Enter to save
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className={`px-2 py-1 text-xs rounded-full font-semibold ${asset.isActive ? 'bg-green-900/30 text-green-400' : 'bg-dark-400 text-light-300'}`}>
                        {asset.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={() => toggleAssetAvailability(asset.id)}
                          className="text-xs btn btn-secondary py-1 px-2"
                        >
                          {asset.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                        <a
                          href={getIPFSGatewayURL(asset.ipfsHash)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs btn btn-secondary py-1 px-2"
                        >
                          View File
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Transaction history - For a future enhancement */}
      <div>
        <h2 className="text-xl font-bold mb-4">
          Transaction History
        </h2>
        <div className="text-center py-8 card">
          <p className="text-light-300">
            Transaction history will be available in a future update.
          </p>
        </div>
      </div>
    </div>
  );
}

export default UserDashboardPage;