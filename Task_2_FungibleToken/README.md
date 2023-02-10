# Task 5

## Problem
Create a script that generates a fungible token that requires a KYC
process to be completed.
Set a fixed supply of 1000. Associate Account3, but do not KYC it.
Try to send 12.99 tokens from Account2 to Account3.
Show that the account is not yet able to participate in the token
because it is not been KYC approved.
Now set the KYC flag on Account3 and retry the transfer.

## Prerequisite
- using node v18.9.0 (npm v8.19.1)
- make sure task 1 is done and file accounts.json craeted in the same folder
- go to folder (Task_2_FungibleToken)
- `npm install`

## How to run
run command  `npm start`

## output
```
- Created token with ID: 0.0.3425230 

Token association with the other account: SUCCESS 


The transaction errored with message ACCOUNT_KYC_NOT_GRANTED_FOR_TOKEN

Error:{"name":"StatusError","status":"ACCOUNT_KYC_NOT_GRANTED_FOR_TOKEN","transactionId":"0.0.3425202@1676024191.255019779","message":"receipt for transaction 0.0.3425202@1676024191.255019779 contained error status ACCOUNT_KYC_NOT_GRANTED_FOR_TOKEN"}
The grant Kyc transaction consensus status SUCCESS

- Stablecoin transfer from Treasury to account: SUCCESS 

{
  accountThreeBalance: '{"0.0.3425230":{"low":1299,"high":0,"unsigned":true},"0.0.3425220":{"low":0,"high":0,"unsigned":true},"0.0.3425215":{"low":0,"high":0,"unsigned":true}}'
```