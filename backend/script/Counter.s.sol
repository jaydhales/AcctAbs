// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console2} from "forge-std/Script.sol";
import {Counter} from "../src/Counter.sol";

contract CounterScript is Script {
    uint256 priv;
    Counter count;

    function setUp() public {
        priv = vm.envUint("PRIVATE_KEY1");
    }

    function run() public {
        vm.startBroadcast(priv);
        count = new Counter();
        vm.stopBroadcast();
    }
}
