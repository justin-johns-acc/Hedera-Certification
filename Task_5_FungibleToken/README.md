# Task 5

## Problem
Create two fungible tokens and do atomic swap.

## Prerequisite
- using node v18.9.0 (npm v8.19.1)
- make sure task 1 is done and file accounts.json craeted in the same folder
- go to folder (Task_5_FungibleToken)
- `npm install`
- rename .env.eample to .env and fillout the values

## How to run
run command  `npm start`

## output
```
- Created token with ID: 0.0.3421585 

- Created token with ID: 0.0.3421586 

- Token association with account: SUCCESS 


- Stablecoin transfer from Treasury to account: SUCCESS 

{
  accountTwoBalanceInitial: '{"0.0.3421585":{"low":2000,"high":0,"unsigned":true}}'
}
- Token association with account: SUCCESS 


- Stablecoin transfer from Treasury to account: SUCCESS 

{
  accountThreeBalanceInitial: '{"0.0.3421586":{"low":2000,"high":0,"unsigned":true}}'
}
- Token association with account 1st token: SUCCESS 

- Token association with 2nd token : SUCCESS 


- NFT transfer secondary: SUCCESS 

{
  accountTwoFinalBalance: '{"0.0.3421586":{"low":1000,"high":0,"unsigned":true},"0.0.3421585":{"low":1000,"high":0,"unsigned":true}}'
}
{
  accountThreeFinalBalance: '{"0.0.3421585":{"low":1000,"high":0,"unsigned":true},"0.0.3421586":{"low":1000,"high":0,"unsigned":true}}'
}
```