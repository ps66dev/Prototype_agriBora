# Implementation Details

- Simple contract implementation of functionality as an agriBora Store functionality

## agriBora Coin - ABC
- Deployed as simple standard ERC20 token
- Minted (supply increases) on new investment 
- Burned (supply decreases) on each withdrawal

## Investors
- To invest call `lockInvestment` which mints new tokens and awards to investor. At this stage
this is mocked since no funds are received and assumes investor as already manually transferred funds to agriBora
- To record withdrawal of investment call `unLockInvestment`
- Need their own wallet if they want full control of the coin on chain e.g https://metamask.io/

## Farmers
- Phone number is used as unique identifier to maintain farm/farmer balances in store
- Don't hold the token but maintain active balance on store record
- New farm/farmer is added to store by calling `addFarm`
- Farm/Farmer can be retrived by calling `getFarm`
- Farm/Farmer can withdraw funds by calling `withdrawAmount`
- Farm/Farmer can get loan by calling `loanProduce`
- Farm/Farmer can get active loans by calling `getLoanProduce`
- Farm/Farmer can withdraw a loan by calling `withdrawProduces`
- Farm/Farmer can sell produce to agriBora by calling `sellProduce`
- Farm/Farmer can be insured by calling `insureFarm`
- Farm/Farmer can receive insurance payout by calling `payoutInsured`

## OutOfScope
- Farmer paying back the loan as it was not discussed on how this would happen either
at selling produce time or agriBora would cover this cost?
- Trigger of insurance payout needs agriBora to only call payout once their api determines 
not enough rainfall and this sits outside the contract
- Tokens minted are essential a share of the available investment in agriBora and as such
their is no public market integration at this stage and agriBora would mint new tokens 
based on amounts that have been manually been transfered to agriBora.


## Dev Notes
- Setup instructions follow README file
- All examples on how to interact with block chain calls will be found in `test/index.ts`
- Please note the tests only cover best case scenario and should be expanded to cover negative cases.
- Functionaly assumes interaction of smart contract only from agriBora
