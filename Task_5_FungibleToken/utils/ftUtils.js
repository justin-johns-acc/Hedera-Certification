import {
  Client,
  TokenCreateTransaction,
  TokenMintTransaction,
  TokenType,
  TokenSupplyType,
  CustomRoyaltyFee,
  CustomFixedFee,
  Hbar,
  PrivateKey,
  AccountBalanceQuery,
  TokenAssociateTransaction,
  TransferTransaction
} from "@hashgraph/sdk";

export const getClient = async (account) => {
  // If we weren't able to grab it, we should throw a new error
  if (account.accountID == null || account.privateKey == null) {
    throw new Error(
      "Environment variables accountID and privateKey must be present"
    );
  }

  // Create our connection to the Hedera network
  return Client.forTestnet().setOperator(account.accountID, account.privateKey);
};

export const getBalance = async (client, account) => {

	console.log("account ID:", account.accountID);
  
	//Check the account's balance
	return await new AccountBalanceQuery()
	  .setAccountId(account.accountID)
	  .execute(client);
  };

export const createFt = async (client, accountOne) => {

  const supplyKey = PrivateKey.fromString(accountOne.privateKey)
  const treasuryKey = PrivateKey.fromString(accountOne.privateKey)

  // CREATE FUNGIBLE TOKEN (STABLECOIN)
let tokenCreateTx = await new TokenCreateTransaction()
.setTokenName("USD Bar")
.setTokenSymbol("USDB")
.setTokenType(TokenType.FungibleCommon)
.setDecimals(2)
.setInitialSupply(10000)
.setTreasuryAccountId(accountOne.accountID)
.setSupplyType(TokenSupplyType.Infinite)
.setSupplyKey(supplyKey)
.freezeWith(client);

//SIGN WITH TREASURY KEY
let tokenCreateSign = await tokenCreateTx.sign(treasuryKey);

//SUBMIT THE TRANSACTION
let tokenCreateSubmit = await tokenCreateSign.execute(client);

//GET THE TRANSACTION RECEIPT
let tokenCreateRx = await tokenCreateSubmit.getReceipt(client);

//GET THE TOKEN ID
let tokenId = tokenCreateRx.tokenId;

//LOG THE TOKEN ID TO THE CONSOLE
console.log(`- Created token with ID: ${tokenId} \n`);

return tokenId;

};


export const transferToken = async (client, sender, recipient, tokenId, amount) => {

  const treasuryKey = PrivateKey.fromString(sender.privateKey)
  const recpKey = PrivateKey.fromString(recipient.privateKey)

    //associate token
  let associateAccountTx = await new TokenAssociateTransaction()
  .setAccountId(recipient.accountID)
  .setTokenIds([tokenId])
  .freezeWith(client)
  .sign(recpKey);

  let associateAccountTxSubmit = await associateAccountTx.execute(client);
  let associateAccountRx = await associateAccountTxSubmit.getReceipt(client);
  console.log(`- Token association with account: ${associateAccountRx.status} \n`)

  let tokenTransferTx = await new TransferTransaction()
		.addTokenTransfer(tokenId, sender.accountID, -amount)
		.addTokenTransfer(tokenId, recipient.accountID, amount)
		.freezeWith(client)
		.sign(treasuryKey);

	let tokenTransferSubmit = await tokenTransferTx.execute(client);
	let tokenTransferRx = await tokenTransferSubmit.getReceipt(client);
	console.log(`\n- Stablecoin transfer from Treasury to account: ${tokenTransferRx.status} \n`);
}

export const getTokenBalance = async (client, account) => {
  return (await new AccountBalanceQuery().setAccountId(account.accountID).execute(client)).tokens.toString();
}

export const swapTokens = async (client, tokenOneId, tokenTwoId, accountOne, accountTwo, amount) => {

  const accountOneKey = PrivateKey.fromString(accountOne.privateKey)
  const accountTwoKey = PrivateKey.fromString(accountTwo.privateKey)


  // associate token one with account two
  let associateTokenOneWithAccountTwoTx = await new TokenAssociateTransaction()
  .setAccountId(accountTwo.accountID)
  .setTokenIds([tokenOneId])
  .freezeWith(client)
  .sign(accountTwoKey);

  let associateAccountTxSubmitOne = await associateTokenOneWithAccountTwoTx.execute(client);
  let receieptOne = await associateAccountTxSubmitOne.getReceipt(client);
  console.log(`- Token association with account 1st token: ${receieptOne.status} \n`)

  // associate token two with account one
  let associateTokenTwoWithAccountOneTx = await new TokenAssociateTransaction()
  .setAccountId(accountOne.accountID)
  .setTokenIds([tokenTwoId])
  .freezeWith(client)
  .sign(accountOneKey);

  let associateAccountTxSubmitTwo = await associateTokenTwoWithAccountOneTx.execute(client);
  let receieptTwo = await associateAccountTxSubmitTwo.getReceipt(client);
  console.log(`- Token association with 2nd token : ${receieptTwo.status} \n`)

  // swap tokens
    let atomicSwap = new TransferTransaction()
    .addTokenTransfer(tokenOneId, accountOne.accountID, -amount)
    .addTokenTransfer(tokenOneId, accountTwo.accountID, amount)
    .addTokenTransfer(tokenTwoId, accountTwo.accountID, -amount)
    .addTokenTransfer(tokenTwoId, accountOne.accountID, amount)
		.freezeWith(client);

	let tokenTransferTx = await (await (await atomicSwap.sign(accountOneKey)).sign(accountTwoKey)).execute(client)
	
    let tokenTransferRx = await tokenTransferTx.getReceipt(client);

    console.log(`\n- NFT transfer secondary: ${tokenTransferRx.status} \n`);
}