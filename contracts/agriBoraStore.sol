//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;
pragma abicoder v2;

import "./agriBora.sol";

contract agriBoraStore {

    address public owner;
    address public agriBoraAddress;

    struct Farm {
        string name;  // farm name or owner name
        string phone; // unique identifier used as farm wallet
        uint balance; // balance for the  farm wallet
    }

    struct Produce {
        string name;    // indentifier of the farm produce e.g maize
        uint cost;      // amount per kg that agriBora will pay for the produce 
        string farmSize;// size of farm the given produce seed would cover
    }

    struct InsureProduce {
        string name;  // identifier for the farm produce to be provided e.g maize
        string phone; // identifier for the farm wallet getting the insurance
    }

    mapping(string => Farm) private farms;  // holds all available farms
    mapping(string => Produce) private assets; //
    mapping(string => Produce) public stock;
    mapping(uint => InsureProduce[]) private insuarance;

    constructor(address agriBora) {
        owner = msg.sender;
        agriBoraAddress = agriBora;
    }

    function lockInvestment(address investor, uint amount) public {
        require(investor != msg.sender);
        agriBora(agriBoraAddress).mintToken(investor, amount);
    }

    function unLockInvestment(address investor, uint amount) public {
        require(investor != msg.sender);
        agriBora(agriBoraAddress).burnToken(investor, amount);
    }

    /// @notice Add a new farm wallet to agriBora Store
    /// @param name name of farm or person just for display
    /// @param phone phone number that will represent farm or person
    function addFarm(string memory name, string memory phone) public {
        farms[phone] = Farm({
            name: name, 
            phone: phone, 
            balance: 0
        });
    }

    /// @notice Get details of farm person by phone number
    /// @param phone unique farm wallet identifier
    /// @return farm struct
    function getFarm(string memory phone) public view returns (Farm memory) {
        return farms[phone];
    }

    /// @notice Reduce farmer balance by withdraw amount
    /// @param phone farm wallet identifier withdrawing funds
    /// @param amount amount to be withdrawn
    function withdrawAmount(string memory phone, uint amount) public {
        require(amount > 0);
        require(farms[phone].balance >= amount);
        farms[phone].balance -= amount;
    }

    /// @notice Add produce available on agriBora store
    /// @param name identifier for the produce
    /// @param cost agriBora will purchase per kg of product
    /// @param farmSize size of farm the given produce seed would cover
    function addProduce(string memory name, uint cost, string memory farmSize) public {
        stock[name] = Produce({ 
            name: name,
            cost: cost, 
            farmSize: farmSize
        });
    }

    /// @notice Get details of an item by name
    /// @param name Name of product to be retrieved
    /// @return Produce Struct
    function getProduce(string memory name) public view returns (Produce memory) {
        return stock[name];
    }

    /// @notice Give product loan item to a farm
    /// @dev One loan item at a time and must exist
    /// @param phone farm wallet to be awarded the loan
    /// @param item name of product item to be given to farm wallet
    function loanProduce(string memory phone, string memory item) public {
        require(stock[item].cost != 0); // item must exist
        require(assets[phone].cost == 0); // farm must not have an existing loan item
        assets[phone] = stock[item];
    }

    /// @notice Get details of product item given as loan to provide phone number
    /// @param phone farm wallet withdrawing items from store
    /// @return Product Produce Struct
    function getLoanProduce(string memory phone) public view returns (Produce memory) {
        return assets[phone];
    }

    /// @notice Withdraw planting products from agriBora Store
    /// @dev If Struct item is empty then number is 0 by default
    /// @param phone farm wallet withdrawing items from store
    function withdrawProduces(string memory phone) public {
        require(assets[phone].cost != 0); // item must exist
        delete assets[phone];
    }

    /// @notice Sell farm produce to agriBora Store
    /// @param phone farm wallet selling their produce
    /// @param name product item name been sold
    /// @param weight total weight of produce been sold
    function sellProduce(string memory phone, string memory name,  uint weight) public {
        require(weight > 0);
        require(stock[name].cost >= 0);
        uint total = stock[name].cost * weight;
        farms[phone].balance += total;
    }

    /// @notice Give insurance to farm based on phone number
    /// @dev Consider changing to prevent for loop function in payout
    /// @param phone farm wallet identifier
    /// @param name product item planted
    /// @param date date of the insurance
    function insureFarm(string memory phone, string memory name, uint date) public {
        require(farms[phone].balance == 0); // person exists
        require(stock[name].cost != 0); // item must exist

        insuarance[date].push(InsureProduce({
            name: name,
            phone: phone
        }));
    }

    /// @notice Get item insured to phone number for a given date
    /// @param date Date of insurance
    /// @return array of the struct InsureProduce
    function getInsured(uint date) public view returns (InsureProduce[] memory) {
        return insuarance[date];
    }

    /// @notice Pay insurance to all insured farmers
    /// @dev Be careful of the for loop, a bigger number of iterations will cause the contract to run out of gas
    /// @dev date is in milliseconds while block timestamp is in second hence the division
    /// @param date you wish to run payout and should be atleast 30 days in the past
    function payoutInsured(uint date) public {
        require(insuarance[date].length > 0);
        require(block.timestamp > (date/1000) + (60*60*24*30)); // greater than 30 days
        for (uint i = 0; i < insuarance[date].length; i++) {
            assets[insuarance[date][i].phone] = stock[insuarance[date][i].name];
        }
        delete insuarance[date];
    }
}
