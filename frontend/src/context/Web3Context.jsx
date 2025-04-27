import { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { default as DataMarketplace } from '../../../blockchain/artifacts/contracts/DataMarketplace.sol/DataMarketplace.json';

const DataMarketplaceABI = DataMarketplace.abi;

const Web3Context = createContext();

const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS || '0x5FbDB2315678afecb367f032d93F642f64180aa3';
const targetChainId = import.meta.env.VITE_TARGET_CHAIN_ID || '31337';

export const Web3Provider = ({ children }) => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [chainId, setChainId] = useState(null);
  const [userRole, setUserRole] = useState(0);
  const [error, setError] = useState(null);
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false);

  useEffect(() => {
    const initProvider = async () => {
      try {
        if (window.ethereum) {
          const web3Provider = new ethers.BrowserProvider(window.ethereum);
          setProvider(web3Provider);
          
          const network = await web3Provider.getNetwork();
          setChainId(network.chainId);
          setIsCorrectNetwork(network.chainId === BigInt(targetChainId));
          
          const accounts = await web3Provider.listAccounts();
          if (accounts.length > 0) {
            const currentSigner = await web3Provider.getSigner();
            setSigner(currentSigner);
            setAccount(await currentSigner.getAddress());
            setIsConnected(true);
            
            const marketplaceContract = new ethers.Contract(
              contractAddress,
              DataMarketplaceABI,
              currentSigner
            );
            setContract(marketplaceContract);
            
            try {
              const role = await marketplaceContract.roles(await currentSigner.getAddress());
              setUserRole(Number(role));
            } catch (roleErr) {
              setError("Could not fetch user role. Smart contract may not be deployed correctly.");
            }
          }
          
          window.ethereum.on('accountsChanged', handleAccountsChanged);
          
          window.ethereum.on('chainChanged', () => {
            window.location.reload();
          });
        } else {
          setError('Please install MetaMask or another Ethereum wallet');
        }
      } catch (err) {
        setError(`Error initializing Web3: ${err.message || 'Unknown error'}`);
      }
    };
    
    initProvider();
    
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', () => {});
      }
    };
  }, []);
  
  const handleAccountsChanged = async (accounts) => {
    if (accounts.length === 0) {
      setSigner(null);
      setAccount(null);
      setIsConnected(false);
      setUserRole(0);
      setError('Wallet disconnected');
    } else {
      try {
        const web3Provider = new ethers.BrowserProvider(window.ethereum);
        const currentSigner = await web3Provider.getSigner();
        setSigner(currentSigner);
        setAccount(await currentSigner.getAddress());
        setIsConnected(true);
        
        const marketplaceContract = new ethers.Contract(
          contractAddress,
          DataMarketplaceABI,
          currentSigner
        );
        setContract(marketplaceContract);
        
        try {
          const role = await marketplaceContract.roles(await currentSigner.getAddress());
          setUserRole(Number(role));
        } catch (roleErr) {
          setError("Could not fetch user role. Smart contract may not be deployed correctly.");
        }
      } catch (err) {
        setError(`Error handling account change: ${err.message || 'Unknown error'}`);
      }
    }
  };
  
  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        setError('Please install MetaMask or another Ethereum wallet');
        return false;
      }
      
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      if (accounts.length > 0) {
        const web3Provider = new ethers.BrowserProvider(window.ethereum);
        const network = await web3Provider.getNetwork();
        setChainId(network.chainId);
        setIsCorrectNetwork(network.chainId === BigInt(targetChainId));
        
        const currentSigner = await web3Provider.getSigner();
        setSigner(currentSigner);
        setAccount(await currentSigner.getAddress());
        setIsConnected(true);
        
        const marketplaceContract = new ethers.Contract(
          contractAddress,
          DataMarketplaceABI,
          currentSigner
        );
        setContract(marketplaceContract);
        
        try {
          const role = await marketplaceContract.roles(await currentSigner.getAddress());
          setUserRole(Number(role));
        } catch (roleErr) {
          setError("Could not fetch user role. Contract may not be deployed correctly.");
        }
        
        setError(null);
        return true;
      }
      return false;
    } catch (err) {
      setError(`Error connecting wallet: ${err.message || 'Unknown error'}`);
      return false;
    }
  };
  
  const disconnectWallet = () => {
    setSigner(null);
    setAccount(null);
    setIsConnected(false);
    setUserRole(0);
    return true;
  };
  
  const registerAsUser = async () => {
    if (!contract || !isConnected) {
      setError('Cannot register: wallet not connected or contract not available');
      return false;
    }
    
    try {
      const tx = await contract.registerAsUser();
      await tx.wait();
      setUserRole(1);
      return true;
    } catch (err) {
      const errorMessage = err.message || 'Unknown error';
      setError(`Error registering as user: ${errorMessage}`);
      return false;
    }
  };
  
  const registerAsCompany = async () => {
    if (!contract || !isConnected) {
      setError('Cannot register: wallet not connected or contract not available');
      return false;
    }
    
    try {
      const tx = await contract.registerAsCompany();
      await tx.wait();
      setUserRole(2);
      return true;
    } catch (err) {
      const errorMessage = err.message || 'Unknown error';
      setError(`Error registering as company: ${errorMessage}`);
      return false;
    }
  };
  
  const value = {
    provider,
    signer,
    contract,
    account,
    isConnected,
    chainId,
    userRole,
    error,
    isCorrectNetwork,
    connectWallet,
    disconnectWallet,
    registerAsUser,
    registerAsCompany
  };

  return (
    <Web3Context.Provider value={value}>
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};