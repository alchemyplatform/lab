// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract GasBurner {
    uint256 private constant COARSE_HEADROOM = 10; // adjust for accuracy

    function burnInternal(uint256 toSpend) external view returns (uint256 used) {
        uint256 start = gasleft();
        while (start - gasleft() + COARSE_HEADROOM < toSpend) {
            assembly { pop(keccak256(0, 0)) }
        }
        while (start - gasleft() < toSpend) {
            assembly { pop(1) }
        }
        used = start - gasleft();
    }
}