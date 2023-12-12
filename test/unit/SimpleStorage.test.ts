import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { assert, expect } from "chai";
import { BigNumberish } from "ethers";
import { network, deployments, ethers } from "hardhat";
import { developmentChains, networkConfig } from "../../helper-hardhat-config";
import { Raffle, VRFCoordinatorV2Mock } from "../../typechain-types";

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("Unit Test", function () {
      let raffle: Raffle;
      let raffleContract: Raffle;
      let vrfCoordinatorV2Mock: VRFCoordinatorV2Mock;
      let raffleEntranceFee: BigNumberish;
      let interval: number;
      let player: SignerWithAddress;
      let deployer: SignerWithAddress;
      let accounts: SignerWithAddress[];

      const chainId: number = network.config.chainId;

      beforeEach(async function () {
        accounts = await ethers.getSigners(); // could also do with getNamedAccounts
        //   deployer = accounts[0]
        // player = accounts[1];

        await deployments.fixture(["all"]);

        vrfCoordinatorV2Mock = await ethers.getContractAt(
          "VRFCoordinatorV2Mock",
          deployer
        );
        raffleContract = await ethers.getContractAt("Raffle", deployer);

        // raffle = raffleContract.connect(player); // -> connecting another player

        raffleEntranceFee = await raffle.getEntranceFee();
        interval = await raffle.getInterval();
      });

      describe("constructor", function () {
        // it("initialize the raffle correctly", async function () {
        //   const raffleState = await raffle.getRaffleState();
        //   assert.equal(raffleState.toString(), "0");
        //   assert.equal(interval.toString(), networkConfig[chainId]["interval"]);
        // });
      });
    });
