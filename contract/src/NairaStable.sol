// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC20Burnable} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

contract NairaStable is ERC20, ERC20Burnable {
    address public immutable engine;

    error NairaStable__NotEngine();
    error NairaStable__ZeroAmount();
    error NairaStable__ZeroAddress();

    modifier onlyEngine() {
        if (msg.sender != engine) revert NairaStable__NotEngine();
        _;
    }

    constructor(address _engine) ERC20("NairaStable", "nNGN") {
        if (_engine == address(0)) revert NairaStable__ZeroAddress();
        engine = _engine;
    }

    function mint(address to, uint256 amount) external onlyEngine {
        if (amount == 0) revert NairaStable__ZeroAmount();
        _mint(to, amount);
    }

    function burn(address from, uint256 amount) external onlyEngine {
        if (amount == 0) revert NairaStable__ZeroAmount();
        _burn(from, amount);
    }
}
