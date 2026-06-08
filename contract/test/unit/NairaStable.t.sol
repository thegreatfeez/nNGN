// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {NairaStable} from "../../src/NairaStable.sol";

contract NairaStableTest is Test {
    NairaStable internal token;
    address internal engine = makeAddr("engine");
    address internal recipient = makeAddr("recipient");

    function setUp() public {
        token = new NairaStable(engine);
    }

    function test_constructor_revertsOnZeroEngine() public {
        vm.expectRevert(NairaStable.NairaStable__ZeroAddress.selector);
        new NairaStable(address(0));
    }

    function test_onlyEngineCanMint() public {
        vm.expectRevert(NairaStable.NairaStable__NotEngine.selector);
        token.mint(recipient, 100);

        vm.prank(engine);
        token.mint(recipient, 100);
        assertEq(token.balanceOf(recipient), 100);
    }

    function test_onlyEngineCanBurn() public {
        vm.prank(engine);
        token.mint(recipient, 100);

        vm.expectRevert(NairaStable.NairaStable__NotEngine.selector);
        token.burn(recipient, 50);

        vm.prank(engine);
        token.burn(recipient, 50);
        assertEq(token.balanceOf(recipient), 50);
    }

    function test_mintAndBurn_revertOnZeroAmount() public {
        vm.startPrank(engine);
        vm.expectRevert(NairaStable.NairaStable__ZeroAmount.selector);
        token.mint(recipient, 0);

        token.mint(recipient, 1);
        vm.expectRevert(NairaStable.NairaStable__ZeroAmount.selector);
        token.burn(recipient, 0);
        vm.stopPrank();
    }
}
