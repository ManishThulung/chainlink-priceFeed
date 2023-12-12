import { DeployFunction, DeployResult } from "hardhat-deploy/dist/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { network } from "hardhat";
import { verify } from "../utils/verify";
import { developmentChains, networkConfig } from "../helper-hardhat-config";

/**
 * * Important Notes
 *
 * * In order to run `npx hardhat deploy --typecheck` command we need to add `import hardhat-deploy` in `hardhat.config.js` file.
 *
 */

const deployCrowdFunding: DeployFunction = async (
  hre: HardhatRuntimeEnvironment
) => {
  const { deploy } = hre.deployments;
  const { deployer } = await hre.getNamedAccounts();

  const chainId: number = network.config.chainId!;
  let priceFeed: any;
  let mockV3Aggregator;

  mockV3Aggregator = await hre.deployments.get("MockV3Aggregator");

  if (developmentChains.includes(network?.name)) {
    priceFeed = mockV3Aggregator.address;
  } else {
    priceFeed = networkConfig[chainId].priceFeed;
  }

  const args: any[] = [priceFeed];

  console.log("Deploying CrowdFunding.........................");

  const crowdFund: DeployResult = await deploy("CrowdFunding", {
    from: deployer,
    log: true,
    args,
    waitConfirmations: chainId == 31337 ? 1 : 6,
  });

  console.log(crowdFund, "crowdFund");

  console.log("CrowdFunding deploy successful------------------");

  // * only verify on testnets or mainnets.
  if (chainId != 31337 && process.env.ETHERSCAN_API_KEY) {
    await verify(crowdFund.address, args);
  }
};

export default deployCrowdFunding;
deployCrowdFunding.tags = ["all", "crowdFunding"];
