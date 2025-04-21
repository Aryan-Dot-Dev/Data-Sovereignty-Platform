// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title DataMarketplace
 * @dev A decentralized marketplace for buying and selling data assets
 */
contract DataMarketplace {
    // Roles for users in the marketplace
    enum Role {
        None,
        User,
        Company
    }

    // Data asset structure
    struct DataAsset {
        uint256 id;
        address owner;
        string name;
        string description;
        string category;
        string ipfsHash;
        uint256 fullPrice;
        bool isActive;
    }

    // State variables
    uint256 public nextAssetId = 1;
    mapping(uint256 => DataAsset) public dataAssets;
    mapping(address => Role) public roles;
    mapping(address => uint256) public balances;
    
    // Track purchased assets
    mapping(address => mapping(uint256 => bool)) private purchases;
    mapping(address => uint256[]) private userAssets;
    mapping(address => uint256[]) private purchasedAssets;
    uint256[] private activeAssets;

    // Events
    event RoleAssigned(address indexed user, Role role);
    event DataAssetListed(uint256 indexed id, address indexed owner, string name, uint256 price);
    event DataAssetPurchased(uint256 indexed id, address indexed buyer, address indexed seller);
    event FundsWithdrawn(address indexed user, uint256 amount);

    // Register as a data provider
    function registerAsUser() external {
        require(roles[msg.sender] == Role.None, "Already registered");
        roles[msg.sender] = Role.User;
        emit RoleAssigned(msg.sender, Role.User);
    }

    // Register as a company
    function registerAsCompany() external {
        require(roles[msg.sender] == Role.None, "Already registered");
        roles[msg.sender] = Role.Company;
        emit RoleAssigned(msg.sender, Role.Company);
    }

    // List a new data asset
    function listDataAsset(
        string memory _name,
        string memory _description,
        string memory _category,
        string memory _ipfsHash,
        uint256 _fullPrice
    ) external {
        require(roles[msg.sender] == Role.User, "Only users can list data");
        require(_fullPrice > 0, "Price must be greater than 0");
        
        DataAsset memory newAsset = DataAsset({
            id: nextAssetId,
            owner: msg.sender,
            name: _name,
            description: _description,
            category: _category,
            ipfsHash: _ipfsHash,
            fullPrice: _fullPrice,
            isActive: true
        });
        
        dataAssets[nextAssetId] = newAsset;
        userAssets[msg.sender].push(nextAssetId);
        activeAssets.push(nextAssetId);
        
        emit DataAssetListed(nextAssetId, msg.sender, _name, _fullPrice);
        
        nextAssetId++;
    }

    // Buy a data asset
    function buyData(uint256 _assetId) external payable {
        DataAsset storage asset = dataAssets[_assetId];
        
        require(asset.id != 0, "Asset does not exist");
        require(asset.isActive, "Asset is not available");
        require(roles[msg.sender] == Role.Company, "Only companies can buy data");
        require(asset.owner != msg.sender, "Cannot buy your own asset");
        require(msg.value >= asset.fullPrice, "Insufficient payment");
        require(!purchases[msg.sender][_assetId], "Already purchased");
        
        // Record the purchase
        purchases[msg.sender][_assetId] = true;
        purchasedAssets[msg.sender].push(_assetId);
        
        // Update seller's balance
        balances[asset.owner] += msg.value;
        
        emit DataAssetPurchased(_assetId, msg.sender, asset.owner);
    }

    // Check if user has access to an asset
    function hasAccess(uint256 _assetId, address _user) external view returns (bool) {
        return dataAssets[_assetId].owner == _user || purchases[_user][_assetId];
    }

    // Get all active assets
    function getAllActiveAssets() external view returns (uint256[] memory) {
        uint256 count = 0;
        
        // Count active assets
        for (uint256 i = 0; i < activeAssets.length; i++) {
            if (dataAssets[activeAssets[i]].isActive) {
                count++;
            }
        }
        
        // Create a new array with only active assets
        uint256[] memory result = new uint256[](count);
        uint256 resultIndex = 0;
        
        for (uint256 i = 0; i < activeAssets.length; i++) {
            if (dataAssets[activeAssets[i]].isActive) {
                result[resultIndex] = activeAssets[i];
                resultIndex++;
            }
        }
        
        return result;
    }

    // Get assets owned by a user
    function getUserAssets(address _owner) external view returns (uint256[] memory) {
        return userAssets[_owner];
    }

    // Get assets purchased by a buyer
    function getPurchasedAssets(address _buyer) external view returns (uint256[] memory) {
        return purchasedAssets[_buyer];
    }

    // Toggle whether an asset is active or not
    function toggleAssetAvailability(uint256 _assetId) external {
        require(dataAssets[_assetId].owner == msg.sender, "Not the owner");
        dataAssets[_assetId].isActive = !dataAssets[_assetId].isActive;
    }

    // Update the price of an asset
    function updateAssetPrice(uint256 _assetId, uint256 _newPrice) external {
        require(dataAssets[_assetId].owner == msg.sender, "Not the owner");
        require(_newPrice > 0, "Price must be greater than 0");
        dataAssets[_assetId].fullPrice = _newPrice;
    }

    // Withdraw accumulated funds
    function withdraw() external {
        uint256 amount = balances[msg.sender];
        require(amount > 0, "No funds to withdraw");
        
        balances[msg.sender] = 0;
        
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Withdrawal failed");
        
        emit FundsWithdrawn(msg.sender, amount);
    }
}