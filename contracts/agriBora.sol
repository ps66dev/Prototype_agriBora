//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract agriBora is ERC20 {

    address owner;

    constructor(uint256 initialSupply) ERC20("agriBora", "ABC") {
        _mint(msg.sender, initialSupply);
    }

    modifier onlyOwner() {
        if (msg.sender == owner) _;
    }

    function mintToken(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function burnToken(address from, uint256 amount) public onlyOwner {
        _burn(from, amount);
    }
}
