// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/metatx/ERC2771Context.sol";

contract Counter is ERC2771Context(0xE041608922d06a4F26C0d4c27d8bCD01daf1f792) {
    event UpdateNumber(uint256 newNum, address caller);

    uint256 public number;
    address public lastCaller;

    function setNumber(uint256 newNumber) public {
        number = newNumber;
        lastCaller = _msgSender();
        emit UpdateNumber(number, lastCaller);
    }

    function increase() public {
        lastCaller = _msgSender();
        number++;
        emit UpdateNumber(number, lastCaller);
    }

    function decrease() public {
        lastCaller = _msgSender();
        number--;
        emit UpdateNumber(number, lastCaller);
    }
}
