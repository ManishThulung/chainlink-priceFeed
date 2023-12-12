import { assert, expect } from "chai";
import { network, deployments, ethers, getNamedAccounts } from "hardhat";
import { developmentChains, networkConfig } from "../../helper-hardhat-config";
import {
  CrowdFunding,
  CrowdFunding__factory,
  MockV3Aggregator,
  MockV3Aggregator__factory,
} from "../../typechain-types";
import { Addressable } from "ethers";
import { verify } from "../../utils/verify";
import { DeployResult } from "hardhat-deploy/dist/types";

developmentChains.includes(network.name)
  ? describe.skip
  : describe("Unit Test", function () {
      let crowdFund: CrowdFunding;
      let mockV3Aggregator: MockV3Aggregator;
      let deployer: string | Addressable;
      let otherAcc;
      const chainId: any = network?.config?.chainId;

      beforeEach(async function () {
        const { deploy } = deployments;
        const [dep, account2] = await ethers.getSigners();
        otherAcc = account2;
        // await deployments.fixture(["crowdFunding"]);
        deployer = (await getNamedAccounts()).deployer;

        const args: any[] = [networkConfig[network?.config?.chainId].priceFeed];

        console.log("Deploying CrowdFunding.........................");

        // crowdFund = await deploy("CrowdFunding", {
        //   from: deployer,
        //   log: true,
        //   args,
        //   waitConfirmations: chainId == 31337 ? 1 : 6,
        // });

        const crowdFundFactory = await ethers.getContractFactory(
          "CrowdFunding"
        );

        crowdFund = await crowdFundFactory.deploy(
          networkConfig[network?.config?.chainId].priceFeed
        );

        console.log("CrowdFunding deploy successful------------------");

        // * only verify on testnets or mainnets.
        if (chainId != 31337 && process.env.ETHERSCAN_API_KEY) {
          await verify(crowdFund.target, args);
        }
      });

      //   describe("constructor", function () {
      it("initialize the constructor correctly", async () => {
        const priceFeed = await crowdFund.getPriceFeed();
        const owner = await crowdFund.getOwner();

        assert.equal(owner.toString(), deployer);
        assert.equal(priceFeed.toString(), mockV3Aggregator.target);
      });
      //   });

      //   describe("fund", () => {
      it("reverts if not enough eth is sent", async () => {
        await expect(crowdFund.fund()).to.be.revertedWithCustomError(
          crowdFund,
          "NotEnoughFund"
        );
      });

      it("updates the funders array", async () => {
        await crowdFund.fund({ value: ethers.parseEther("5") });
        await crowdFund
          .connect(otherAcc)
          .fund({ value: ethers.parseEther("5") });

        const funders = await crowdFund.getFunders();
        assert.equal(funders.length, 2);
      });
    });
// });
