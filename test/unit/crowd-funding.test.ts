import { assert, expect } from "chai";
import { network, deployments, ethers, getNamedAccounts } from "hardhat";
import {
  DECIMAL,
  INITIAL_ANSWER,
  developmentChains,
  networkConfig,
} from "../../helper-hardhat-config";
import {
  CrowdFunding,
  CrowdFunding__factory,
  MockV3Aggregator,
  MockV3Aggregator__factory,
} from "../../typechain-types";
import { Addressable } from "ethers";

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("Unit Test", function () {
      let crowdFund: CrowdFunding;
      let mockV3Aggregator: MockV3Aggregator;
      let deployer: string | Addressable;
      let otherAcc;

      beforeEach(async function () {
        const [dep, account2] = await ethers.getSigners();
        otherAcc = account2;

        deployer = (await getNamedAccounts()).deployer;

        const mockV3AggregatorFactory: MockV3Aggregator__factory =
          await ethers.getContractFactory("MockV3Aggregator");
        mockV3Aggregator = await mockV3AggregatorFactory.deploy(
          DECIMAL,
          INITIAL_ANSWER
        );

        const cfFactory: CrowdFunding__factory =
          await ethers.getContractFactory("CrowdFunding");
        crowdFund = await cfFactory.deploy(mockV3Aggregator.target);
      });

      describe("constructor", function () {
        it("initialize the constructor correctly", async () => {
          const priceFeed = await crowdFund.getPriceFeed();
          const owner = await crowdFund.getOwner();

          assert.equal(owner.toString(), deployer);
          assert.equal(priceFeed.toString(), mockV3Aggregator.target);
        });
      });

      describe("fund", () => {
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
    });
