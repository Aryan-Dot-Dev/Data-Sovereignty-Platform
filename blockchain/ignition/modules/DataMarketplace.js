const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("DataMarketplaceModule", (m) => {
  const dataMarketplace = m.contract("DataMarketplace");

  return { dataMarketplace };
});