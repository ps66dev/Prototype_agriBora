// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // 1. Deploy the coin with an initial supply of 1 million
  const agriBora = await ethers.getContractFactory("agriBora");
  const initialSupply = ethers.BigNumber.from(1000000).toString(); // 1 million
  const agriBoraCoin = await agriBora.deploy(initialSupply);
  await agriBoraCoin.deployed();
  console.log("agriBora Coin deployed to:", agriBoraCoin.address);

  // 2. Deploy the agriBora store the main interface
  const agriBoraStore = await ethers.getContractFactory("agriBoraStore");
  const store = await agriBoraStore.deploy();
  await store.deployed();
  console.log("agriBora Store deployed to:", store.address);

  // 3. Transfer the supply to the store
  const transferTx = await agriBoraCoin.transfer(store.address, initialSupply);
  await transferTx.wait();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
