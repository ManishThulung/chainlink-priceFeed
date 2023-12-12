// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

library PriceConverter{
    function getPrice(AggregatorV3Interface _priceFeed) internal view returns (uint256) {
        (
            /* uint80 roundID */,
            int answer,
            /*uint startedAt*/,
            /*uint timeStamp*/,
            /*uint80 answeredInRound*/
        ) = _priceFeed.latestRoundData();

        return uint256(answer * 10000000000);
    }

    function ethConverterToUSD(AggregatorV3Interface _priceFeed, uint256 _eth) internal view returns (uint256){
        uint256 pricePerEth = getPrice(_priceFeed);
        uint256 ethPriceInUSD = (pricePerEth * _eth) / 1000000000000000000;
        return ethPriceInUSD;
    }
}