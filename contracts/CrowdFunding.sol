/**
 * Pragma statements
 * Import statements
 * Events
 * Errors
 * Interfaces
 * Libraries
 * Contracts
 *
 * inside contracts pattern
 * Type declarations
 * State variables
 * Events
 * Errors
 * Modifiers
 * Functions
 */

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import {PriceConverter} from "./PriceConverter.sol";

error NotEnoughFund();
error Unauthorized();
error UnsufficientBalance();

contract CrowdFunding {
    using PriceConverter for *;

    uint256 public constant MINIMUM_USD = 50 * 10**18;
    address private immutable i_owner;
    address[] private s_funders;
    mapping(address => uint256) private s_addressToAmountFunded;
    AggregatorV3Interface private s_priceFeed;

    event Funded(address indexed funder, uint256 indexed amount);
    event withdrawn(uint256 indexed amount);

    modifier onlyOwner (address _user) {
        if(i_owner != _user) {
            revert Unauthorized();
        }
        _;
    }

    constructor(AggregatorV3Interface _priceFeed) {
        i_owner = msg.sender;
        s_priceFeed = AggregatorV3Interface(_priceFeed);
    }

    function fund() external payable {
        if(s_priceFeed.ethConverterToUSD(msg.value) < MINIMUM_USD){
            revert NotEnoughFund();
        }
        s_funders.push(msg.sender);
        s_addressToAmountFunded[msg.sender] += msg.value;
        emit Funded(msg.sender, msg.value);
    }

    function withdraw() external onlyOwner(msg.sender) {
        if(address(this).balance < 10){
            revert UnsufficientBalance();
        }

        s_funders = new address[](0);
        (bool success, ) = i_owner.call{value: address(this).balance}("");
        require(success, "transaction failed");
        emit withdrawn(address(this).balance);
    }


    function getConversion(AggregatorV3Interface _priceFeed, uint256 _eth) public view returns (uint256) {
        return _priceFeed.ethConverterToUSD(_eth);
    }

    function getOwner() public view returns(address) {
        return i_owner;
    }

    function getFunder(uint16 index) public view returns(address){
        return s_funders[index];
    }

    function getFunders() public view returns(address[] memory){
        return s_funders;
    }

    function getPriceFeed() public view returns(AggregatorV3Interface){
        return s_priceFeed;
    }
}