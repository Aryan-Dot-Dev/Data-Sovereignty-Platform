import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWeb3 } from '../context/Web3Context';
import { ethers } from 'ethers';
import { uploadFileToIPFS, uploadMetadataToIPFS, createDataAssetMetadata } from '../utils/ipfsUtils';

function UploadPage() {
  const { contract, isConnected, userRole } = useWeb3();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [file, setFile] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('other');
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);

  const categories = ['finance', 'healthcare', 'technology', 'social', 'environment', 'other'];

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };
  
  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isConnected) {
      setError('Please connect your wallet first');
      return;
    }
    
    if (userRole !== 1) {
      setError('Only registered users can upload data');
      return;
    }
    
    if (!file || !name || !description || !category || !price) {
      setError('Please fill in all fields');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      setProgress(10);

      setProgress(20);
      const fileUploadResult = await uploadFileToIPFS(file);
      
      if (!fileUploadResult.success) {
        throw new Error('Failed to upload file to IPFS');
      }
      
      setProgress(50);
      console.log('File uploaded to IPFS with CID:', fileUploadResult.cid);
      
      const metadata = createDataAssetMetadata(
        name,
        description,
        category,
        file.type
      );
      
      const metadataUploadResult = await uploadMetadataToIPFS(metadata);
      
      if (!metadataUploadResult.success) {
        throw new Error('Failed to upload metadata to IPFS');
      }
      
      setProgress(70);
      console.log('Metadata uploaded to IPFS with CID:', metadataUploadResult.cid);
      
      const ipfsData = JSON.stringify({
        data: fileUploadResult.cid,
        metadata: metadataUploadResult.cid
      });
      
      const priceInWei = ethers.parseEther(price);
      
      const tx = await contract.listDataAsset(
        name,
        description,
        category,
        ipfsData,
        priceInWei
      );
      
      setProgress(80);
      
      await tx.wait();
      
      setProgress(100);
      
      // Success! Navigate after 1 second to show 100% progress
      setTimeout(() => {
        navigate('/dashboard/user');
      }, 1000);
      
    } catch (err) {
      console.error('Error uploading data:', err);
      setError(err.message || 'Failed to upload data. Please try again.');
      setProgress(0);
    } finally {
      setLoading(false);
    }
  };

  const goToNextStep = () => {
    if (step === 1 && !file) {
      setError('Please select a file to upload');
      return;
    }
    
    if (step === 2 && (!name || !description || !category)) {
      setError('Please fill in all required fields');
      return;
    }
    
    setError(null);
    setStep(step + 1);
  };

  const goToPrevStep = () => {
    setError(null);
    setStep(step - 1);
  };

  if (!isConnected) {
    return (
      <div className="text-center py-20 max-w-lg mx-auto">
        <div className="card p-8">
          <svg className="h-16 w-16 text-light-400 mx-auto mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h1 className="text-2xl font-bold text-light-100 mb-4">Upload Data</h1>
          <p className="text-light-300 mb-8">Please connect your wallet to upload data.</p>
          <button 
            onClick={() => navigate('/')} 
            className="btn btn-primary w-full"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (userRole !== 1) {
    return (
      <div className="text-center py-20 max-w-lg mx-auto">
        <div className="card p-8">
          <svg className="h-16 w-16 text-light-400 mx-auto mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <h1 className="text-2xl font-bold text-light-100 mb-4">Access Restricted</h1>
          <p className="text-light-300 mb-8">Only registered users can upload data. Please register as a user from the home page.</p>
          <button 
            onClick={() => navigate('/')} 
            className="btn btn-primary w-full"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-light-100 mb-8 text-center">Upload Data to Marketplace</h1>
      
      {/* Progress steps */}
      <div className="mb-10">
        <div className="flex items-center justify-between">
          <div className={`flex flex-col items-center ${step >= 1 ? 'text-primary-400' : 'text-dark-300'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
              step >= 1 ? 'border-primary-400 bg-primary-500/20' : 'border-dark-300'
            }`}>
              <span className="text-sm font-medium">1</span>
            </div>
            <span className="mt-2 text-xs">Select File</span>
          </div>
          <div className={`flex-1 h-0.5 mx-2 ${step >= 2 ? 'bg-primary-500' : 'bg-dark-300'} transition-all duration-300`}></div>
          <div className={`flex flex-col items-center ${step >= 2 ? 'text-primary-400' : 'text-dark-300'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
              step >= 2 ? 'border-primary-400 bg-primary-500/20' : 'border-dark-300'
            }`}>
              <span className="text-sm font-medium">2</span>
            </div>
            <span className="mt-2 text-xs">Details</span>
          </div>
          <div className={`flex-1 h-0.5 mx-2 ${step >= 3 ? 'bg-primary-500' : 'bg-dark-300'} transition-all duration-300`}></div>
          <div className={`flex flex-col items-center ${step >= 3 ? 'text-primary-400' : 'text-dark-300'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
              step >= 3 ? 'border-primary-400 bg-primary-500/20' : 'border-dark-300'
            }`}>
              <span className="text-sm font-medium">3</span>
            </div>
            <span className="mt-2 text-xs">Pricing</span>
          </div>
        </div>
      </div>
      
      {/* Error message */}
      {error && (
        <div className="bg-red-900/20 border border-red-700/30 text-red-400 px-4 py-3 rounded-lg mb-6 animate-fade-in">
          <div className="flex">
            <svg className="h-5 w-5 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="card">
          {/* Step 1: File Upload */}
          {step === 1 && (
            <div className="p-6 space-y-6">
              <h2 className="text-xl font-semibold text-light-100">Select a File to Upload</h2>
              <p className="text-light-300">
                Choose the data file you want to list on the marketplace.
                The file will be encrypted and stored on IPFS.
              </p>
              
              <div 
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                  isDragOver 
                    ? 'border-primary-500 bg-primary-500/10' 
                    : 'border-dark-300 hover:border-dark-200'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {file ? (
                  <div className="space-y-3">
                    <div className="w-16 h-16 mx-auto bg-dark-500 rounded-lg flex items-center justify-center">
                      <FileIcon fileType={file.type} />
                    </div>
                    <p className="text-lg font-medium text-light-100">{file.name}</p>
                    <p className="text-sm text-light-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    <button 
                      type="button"
                      onClick={() => setFile(null)}
                      className="btn btn-outline text-sm mt-2"
                    >
                      Change File
                    </button>
                  </div>
                ) : (
                  <div>
                    <label className="cursor-pointer">
                      <div className="flex flex-col items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-light-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <span className="text-light-200 mb-2">Click to upload or drag and drop</span>
                        <span className="text-sm text-light-400">Any file type (Max: 100MB)</span>
                      </div>
                      <input 
                        type="file" 
                        className="hidden" 
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={goToNextStep}
                  className="btn btn-primary group"
                >
                  <span>Next</span>
                  <svg className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </div>
          )}
          
          {/* Step 2: Data Details */}
          {step === 2 && (
            <div className="p-6 space-y-6">
              <h2 className="text-xl font-semibold text-light-100">Data Details</h2>
              <p className="text-light-300">
                Provide information about your data to help buyers understand what you're offering.
              </p>
              
              <div className="space-y-5">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-light-200 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Give your data asset a clear name"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-light-200 mb-1">
                    Description *
                  </label>
                  <textarea
                    id="description"
                    rows="4"
                    className="input"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe what's included in your dataset and how it might be useful"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-light-200 mb-1">
                    Category *
                  </label>
                  <select
                    id="category"
                    className="input"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="flex justify-between pt-2">
                <button
                  type="button"
                  onClick={goToPrevStep}
                  className="btn btn-outline group"
                >
                  <svg className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  <span>Previous</span>
                </button>
                <button
                  type="button"
                  onClick={goToNextStep}
                  className="btn btn-primary group"
                >
                  <span>Next</span>
                  <svg className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </div>
          )}
          
          {/* Step 3: Pricing */}
          {step === 3 && (
            <div className="p-6 space-y-6">
              <h2 className="text-xl font-semibold text-light-100">Set Your Price</h2>
              <p className="text-light-300">
                Define how much buyers will pay to access your data.
              </p>
              
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-light-200 mb-1">
                  Price in ETH *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="price"
                    className="input pl-16"
                    placeholder="0.01"
                    step="0.001"
                    min="0"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center px-4 bg-dark-400 border-r border-dark-300 rounded-l-lg">
                    <span className="text-light-300 text-sm font-medium">ETH</span>
                  </div>
                </div>
                <p className="mt-2 text-sm text-light-400">
                  Set a fair price for your data. Higher quality and more unique data can command higher prices.
                </p>
              </div>
              
              <div className="pt-4">
                <h3 className="text-lg font-medium text-light-100 mb-3">Summary</h3>
                <div className="glass p-5 rounded-lg space-y-3">
                  <div className="flex items-start">
                    <span className="text-light-400 w-24">File:</span>
                    <div className="flex-1 text-light-200 font-medium">
                      {file ? (
                        <div className="flex items-center">
                          <FileIconSmall fileType={file.type} />
                          <span className="ml-2">{file.name}</span>
                        </div>
                      ) : (
                        'No file selected'
                      )}
                    </div>
                  </div>
                  <div className="flex">
                    <span className="text-light-400 w-24">Name:</span>
                    <span className="text-light-200 font-medium">{name || '-'}</span>
                  </div>
                  <div className="flex">
                    <span className="text-light-400 w-24">Category:</span>
                    <span className="text-light-200 font-medium capitalize">{category}</span>
                  </div>
                  <div className="flex">
                    <span className="text-light-400 w-24">Price:</span>
                    <span className="text-light-200 font-medium">
                      {price ? (
                        <span className="gradient-text">{price} ETH</span>
                      ) : (
                        'Not set'
                      )}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between pt-2">
                <button
                  type="button"
                  onClick={goToPrevStep}
                  className="btn btn-outline group"
                  disabled={loading}
                >
                  <svg className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  <span>Previous</span>
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      List on Marketplace
                    </span>
                  )}
                </button>
              </div>
              
              {loading && (
                <div className="mt-8">
                  <div className="h-2 bg-dark-400 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-primary-600 to-secondary-600 rounded-full" 
                      style={{ width: `${progress}%`, transition: 'width 0.5s ease' }}
                    ></div>
                  </div>
                  <p className="text-center mt-3 text-light-300">
                    {progress === 100 ? (
                      <span className="text-secondary-400 flex items-center justify-center">
                        <svg className="w-5 h-5 mr-2 text-secondary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Upload completed! Redirecting...
                      </span>
                    ) : (
                      <>
                        <span className="font-medium">{getProgressStage(progress)}</span>
                        <span className="text-sm block mt-1 text-light-400">{progress}% complete</span>
                      </>
                    )}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </form>
    </div>
  );
}

// Helper function to get stage of upload based on progress
function getProgressStage(progress) {
  if (progress < 20) return 'Preparing file...';
  if (progress < 50) return 'Uploading to IPFS...';
  if (progress < 70) return 'Creating metadata...';
  if (progress < 90) return 'Submitting to blockchain...';
  return 'Finalizing transaction...';
}

// File icon component based on file type
function FileIcon({ fileType }) {
  if (fileType.includes('image')) {
    return (
      <svg className="h-8 w-8 text-primary-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    );
  } else if (fileType.includes('csv') || fileType.includes('excel') || fileType.includes('sheet')) {
    return (
      <svg className="h-8 w-8 text-secondary-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    );
  } else if (fileType.includes('json')) {
    return (
      <svg className="h-8 w-8 text-accent-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    );
  } else if (fileType.includes('pdf')) {
    return (
      <svg className="h-8 w-8 text-accent-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    );
  } else {
    return (
      <svg className="h-8 w-8 text-light-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    );
  }
}

// Smaller file icon for summary view
function FileIconSmall({ fileType }) {
  return (
    <div className="w-6 h-6 bg-dark-400 rounded flex items-center justify-center">
      {fileType.includes('image') ? (
        <svg className="h-4 w-4 text-primary-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ) : fileType.includes('csv') || fileType.includes('excel') ? (
        <svg className="h-4 w-4 text-secondary-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ) : (
        <svg className="h-4 w-4 text-light-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )}
    </div>
  );
}

export default UploadPage;