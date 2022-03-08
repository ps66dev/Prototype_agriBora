import { expect } from "chai";
import { BigNumber } from "ethers";
import { ethers } from "hardhat";

let Store;
let store: any;
let Coin;
let coin: any;
const initialSupply = ethers.BigNumber.from(1000000).toString();
let Jane = {
  name: "Jane",
  phone: "254708458879"
};
let Beans = {
  name: "Beans",
  cost: BigNumber.from(5).toString(),
  size: "2 Acres"
};

describe("Store", function () {
  beforeEach(async function () {
    Coin = await ethers.getContractFactory("agriBora");
    coin = await Coin.deploy(initialSupply);
    await coin.deployed();

    Store = await ethers.getContractFactory("agriBoraStore");
    store = await Store.deploy(coin.address);
    await store.deployed();

    const transferTx = await coin.transfer(store.address, initialSupply);
    await transferTx.wait();

    // Default Farm Jane
    const setFarmTx = await store.addFarm(Jane.name, Jane.phone);
    await setFarmTx.wait();

    // Default Produce Beans
    const setProduceTx = await store.addProduce(Beans.name, Beans.cost, Beans.size);
    await setProduceTx.wait();
  });

  it("Should be possible to save new farm", async function () {
    const setFarmTx = await store.addFarm("John", "254708123456");
    await setFarmTx.wait();

    let farmObject = await store.getFarm("254708123456");
    expect(farmObject.name.toString()).to.equal("John");

  });

  it("Should be possible to save new produce", async function () { 

    const setProduceTx = await store.addProduce("Maize", BigNumber.from(5).toString(), "2 Acres");
    await setProduceTx.wait();

    let produceObject = await store.getProduce("Maize");
    expect(produceObject.name.toString()).to.equal("Maize");
  });

  it("Should be possible to sell to store", async function () { 

    const setProduceTx = await store.sellProduce(Jane.phone, Beans.name, BigNumber.from(1000).toString());
    await setProduceTx.wait();

    let farmObject = await store.getFarm(Jane.phone);
    expect(farmObject.name.toString()).to.equal(Jane.name);
    expect(farmObject.balance.toString()).to.equal("5000");

    const setProduceAgainTx = await store.sellProduce(Jane.phone, Beans.name, BigNumber.from(1000).toString());
    await setProduceAgainTx.wait();

    farmObject = await store.getFarm(Jane.phone);
    expect(farmObject.balance.toString()).to.equal("10000");
  });


  it("Should be possible to withdraw cash from store", async function () { 

    const setProduceTx = await store.sellProduce(Jane.phone, Beans.name, BigNumber.from(1000).toString());
    await setProduceTx.wait();

    const withdrawAmaountTx = await store.withdrawAmount(Jane.phone, BigNumber.from(1000).toString());
    await withdrawAmaountTx.wait();

    let farmObject = await store.getFarm(Jane.phone);
    expect(farmObject.balance.toString()).to.equal("4000");
  });

  it("Should be possible to give loan of produce to farm", async function () { 

    const loanTx = await store.loanProduce(Jane.phone, Beans.name);
    await loanTx.wait();

    const loanObject = await store.getLoanProduce(Jane.phone);
    expect(loanObject.name.toString()).to.equal("Beans");
  });


  it("Should be possible to withdraw loan of produce from store", async function () { 

    const loanTx = await store.loanProduce(Jane.phone, Beans.name);
    await loanTx.wait();

    let loanObject = await store.getLoanProduce(Jane.phone);
    expect(loanObject.name.toString()).to.equal("Beans");

    const withdrawLoanTx = await store.withdrawProduces(Jane.phone);
    await withdrawLoanTx.wait();

    loanObject = await store.getLoanProduce(Jane.phone);
    expect(loanObject.name.toString()).to.equal("");
  });

  it("Should be possible to insure a farm", async function () { 

    const date = new Date();
    date.setHours(0,0,0,0);    
    const insureTx = await store.insureFarm(Jane.phone, Beans.name, BigNumber.from(date.getTime()).toString());
    await insureTx.wait();

    let insureObject = await store.getInsured(date.getTime());
    expect(insureObject[0].name.toString()).to.equal("Beans");
  });

  it("Should be possible to payout out insured farms", async function () { 
    const date = new Date();
    date.setDate(date.getDate()  - 31);
    date.setHours(0,0,0,0);
    const insureTx = await store.insureFarm(Jane.phone, Beans.name, BigNumber.from(date.getTime()).toString());
    await insureTx.wait();

    let insureObject = await store.getInsured(date.getTime());
    expect(insureObject[0].name.toString()).to.equal("Beans");

    const payoutTx = await store.payoutInsured(date.getTime());
    await payoutTx.wait();

    const loanObject = await store.getLoanProduce(Jane.phone);
    expect(loanObject.name.toString()).to.equal("Beans");
  });

});
