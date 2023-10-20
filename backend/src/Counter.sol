// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/metatx/ERC2771Context.sol";

contract Counter {
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

    function _msgSender() internal view returns (address sender) {
        // The assembly code is more direct than the Solidity version using `abi.decode`.
        /// @solidity memory-safe-assembly
        assembly {
            sender := shr(96, calldataload(sub(calldatasize(), 20)))
        }
    }
}
