import { network } from "hardhat";
import { DeployFunction, DeployResult } from "hardhat-deploy/dist/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DECIMAL, INITIAL_ANSWER } from "../helper-hardhat-config";

const deployAggregatorMock: DeployFunction = async (
  hre: HardhatRuntimeEnvironment
) => {
  const { deploy } = hre.deployments;
  const { deployer } = await hre.getNamedAccounts();

  const chainId: number = network.config.chainId!;

  if (chainId == 31337) {
    console.log("Detecting local network! Deploying mock................");

    const mock: DeployResult = await deploy("MockV3Aggregator", {
      from: deployer,
      log: true,
      args: [DECIMAL, INITIAL_ANSWER],
      waitConfirmations: chainId == 31337 ? 1 : 6,
    });

    console.log("MockV3Aggregator deploy successful---------------------");
  }
};

export default deployAggregatorMock;
deployAggregatorMock.tags = ["all", "mock"];
