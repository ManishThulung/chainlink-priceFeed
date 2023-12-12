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

error NotEnoughFund();
error Unauthorized();
error UnsufficientBalance();

contract CrowdFunding {
    address public immutable i_owner;
    address[] public s_funders;
    mapping(address => uint256) public s_addressToAmountFunded;
    AggregatorV3Interface internal s_priceFeed;

    event Funded(address indexed funder, uint256 indexed amount);
    event withdrawn(uint256 indexed amount);

    modifier onlyOwner (address _user) {
        if(i_owner != _user) {
            revert Unauthorized();
        }
        _;
    }

    constructor() {
        i_owner = msg.sender;
        s_priceFeed = AggregatorV3Interface(
            0x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43
        );
    }

    function fund() external payable {
        if(msg.value < 10){
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


    function getOwner() public view returns(address) {
        return i_owner;
    }

    function getFunder(uint16 index) public view returns(address){
        return s_funders[index];
    }

    function getFunders() public view returns(address[] memory){
        return s_funders;
    }




}