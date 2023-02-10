# Task 3

## Problem
Create an NFT with Royalty. Show that the Royalty will be received on transfer.

## Prerequisite
- using node v18.9.0 (npm v8.19.1)
- make sure task 1 is done and file accounts.json craeted in the same folder
- go to folder (Task_3_NonFungibleToken)
- `npm install`
- rename .env.eample to .env and fillout the values

## How to run
run command  `npm start`

## output

```
NFT is Created with TokenId: 0.0.3419627 

TOKENID:  0.0.3419627
- Created NFT 0.0.3419627 with serial: 1 

- Created NFT 0.0.3419627 with serial: 2 

- Created NFT 0.0.3419627 with serial: 3 

- Created NFT 0.0.3419627 with serial: 4 

- Created NFT 0.0.3419627 with serial: 5 

account ID: 0.0.3419569
{ accountTwoInitBalance: '{"hbars":"100 ℏ","tokens":[]}' }
- Token association with the users account: SUCCESS 


- NFT transfer from Treasury to Buyer: SUCCESS 

- Buyer's balance: 1 NFTs of ID 0.0.3419627
- Token association with the users account: SUCCESS 


- NFT transfer secondary: SUCCESS 

- Buyer's balance: 1 NFTs of ID 0.0.3419627
account ID: 0.0.3419569
{ accountTwoFinalBalance: '{"hbars":"101 ℏ","tokens":[]}' }
```