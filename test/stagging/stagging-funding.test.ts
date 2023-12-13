import { assert, expect } from "chai";
import { network, deployments, ethers, getNamedAccounts } from "hardhat";
import { developmentChains, networkConfig } from "../../helper-hardhat-config";
import { CrowdFunding, MockV3Aggregator } from "../../typechain-types";
import { Addressable } from "ethers";

developmentChains.includes(network.name)
  ? describe.skip
  : describe("Staging Test", function () {
      let crowdFund: CrowdFunding;
      let deployer: string | Addressable;
      const chainId: number | undefined = network?.config?.chainId;

      beforeEach(async function () {
        const args: any[] = [networkConfig[chainId].priceFeed];

        deployer = (await getNamedAccounts()).deployer;

        crowdFund = await ethers.deployContract("CrowdFunding", args);

        await crowdFund.waitForDeployment();
      });

      it("initialize the constructor correctly", async () => {
        const priceFeed = await crowdFund.getPriceFeed();
        const owner = await crowdFund.getOwner();

        assert.equal(owner.toString(), deployer);
        assert.equal(priceFeed.toString(), networkConfig[chainId].priceFeed);
      });

      it("reverts if not enough eth is sent", async () => {
        await expect(crowdFund.fund()).to.be.revertedWithCustomError(
          crowdFund,
          "NotEnoughFund"
        );
      });

      // it("updates the funders array", async () => {
      //   await crowdFund.fund({ value: ethers.parseEther("5") });
      //   await crowdFund
      //     .connect(otherAccount)
      //     .fund({ value: ethers.parseEther("5") });

      //   const funders = await crowdFund.getFunders();
      //   assert.equal(funders.length, 2);
      // });
    });
// });
