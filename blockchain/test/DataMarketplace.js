const {
    time,
    loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");

async function deployDataMarketplaceFixture() {

    const DataMarketplace = await ethers.getContractFactory("DataMarketplace");
    const dataMarketplace = await DataMarketplace.deploy();

    console.log("DataMarketplace deployed to:", dataMarketplace.target);
    console.log("DataMarketplace address:", dataMarketplace.address);
    console.log("DataMarketplace chainId:", dataMarketplace);

    return { dataMarketplace };
}

deployDataMarketplaceFixture();
