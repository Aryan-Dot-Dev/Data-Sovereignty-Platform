/**
 * Utility functions for interacting with IPFS
 */

/**
 * Uploads a file to IPFS via Web3.Storage or Pinata
 * @param {File} file - The file to upload
 * @returns {Promise<Object>} - The IPFS hash and metadata
 */
export const uploadFileToIPFS = async (file) => {
  try {
    // Use FormData to prepare the file for upload
    const formData = new FormData();
    formData.append('file', file);

    // Get Pinata JWT from environment variables
    const pinataJWT = import.meta.env.VITE_PINATA_JWT;
    
    if (!pinataJWT) {
      throw new Error('Pinata JWT not found in environment variables');
    }

    // Upload to Pinata
    const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${pinataJWT}`
      },
      body: formData
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Error uploading to IPFS');
    }
    
    return {
      success: true,
      cid: data.IpfsHash,
      pinSize: data.PinSize,
      timestamp: data.Timestamp
    };
  } catch (error) {
    console.error('Error uploading file to IPFS:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Creates a metadata JSON object for a data asset
 * @param {string} name - The name of the data asset
 * @param {string} description - The description of the data asset
 * @param {string} category - The category of the data asset
 * @param {string} fileType - The MIME type of the data file
 * @returns {Object} - The metadata object
 */
export const createDataAssetMetadata = (name, description, category, fileType) => {
  return {
    name,
    description,
    category,
    fileType,
    createdAt: new Date().toISOString(),
    version: '1.0'
  };
};

/**
 * Creates a metadata JSON object and uploads it to IPFS
 * @param {Object} metadata - The metadata to upload
 * @returns {Promise<Object>} - The result of the upload with CID
 */
export const uploadMetadataToIPFS = async (metadata) => {
  try {
    // Convert the metadata to a Blob
    const metadataBlob = new Blob([JSON.stringify(metadata)], { type: 'application/json' });
    
    // Create a File object from the Blob
    const metadataFile = new File([metadataBlob], 'metadata.json', { type: 'application/json' });
    
    // Upload the metadata file to IPFS
    const result = await uploadFileToIPFS(metadataFile);
    
    return result;
  } catch (error) {
    console.error('Error uploading metadata to IPFS:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Retrieve file information from IPFS hash
 * @param {string} ipfsHash - The IPFS hash
 * @returns {Object} The parsed metadata or the raw hash if parsing fails
 */
export const retrieveFileFromIPFS = (ipfsHash) => {
  try {
    // Check if the hash is a JSON string
    const parsed = JSON.parse(ipfsHash);
    return parsed;
  } catch (error) {
    // If parsing fails, return the hash as is
    return ipfsHash;
  }
};

/**
 * Get the CID of the data file from the metadata
 * @param {string} ipfsHash - The IPFS hash of the metadata
 * @returns {string} The CID of the data file
 */
export const getDataCID = (ipfsHash) => {
  try {
    // First, check if it's JSON metadata containing a data field
    const parsedData = JSON.parse(ipfsHash);
    if (parsedData.data) {
      return parsedData.data;
    }
    return parsedData;
  } catch (err) {
    // Not JSON, handle as raw CID
    // Clean the CID by removing any 'ipfs://' prefix
    let cleanCid = ipfsHash;
    if (cleanCid.startsWith('ipfs://')) {
      cleanCid = cleanCid.substring(7);
    }
    
    // Remove any trailing slashes
    cleanCid = cleanCid.replace(/\/$/, '');
    
    // Only take the CID part if there are path segments
    if (cleanCid.includes('/')) {
      cleanCid = cleanCid.split('/')[0];
    }
    
    return cleanCid;
  }
};

/**
 * Generates a proper IPFS gateway URL for a given CID
 * @param {string} ipfsHash - The IPFS hash/CID
 * @returns {string} Full gateway URL to access the content
 */
export const getIPFSGatewayURL = (ipfsHash) => {
  const cid = getDataCID(ipfsHash);
  // Using an IPFS HTTP gateway that's reliable
  return `https://ipfs.io/ipfs/${cid}`;
};