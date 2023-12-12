import { ethers } from "hardhat";

const networkConfig = {
  31337: {
    entranceFee: ethers.parseEther("0.001"),
    subscriptionId: "2550", //7608
    keyHash:
      "0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c",
    callbackGasLimit: "100000",
    requestConfirmations: 6,
  },
  11155111: {
    entranceFee: ethers.parseEther("0.001"),
    subscriptionId: "7608",
    keyHash:
      "0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c",
    callbackGasLimit: "100000",
    requestConfirmations: 6,
    coordinator: "0x8103b0a8a00be2ddc778e6e7eaa21791cd364625",
  },
};

const developmentChains = ["hardhat", "locahost"];

export { networkConfig, developmentChains };
