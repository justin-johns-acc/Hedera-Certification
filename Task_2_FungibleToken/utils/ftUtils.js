import {
  Client,
  TokenCreateTransaction,
  TokenType,
  TokenSupplyType,
  PrivateKey,
  AccountBalanceQuery,
  TokenAssociateTransaction,
  TransferTransaction,
  TokenGrantKycTransaction
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

export const createFt = async (client, accountOne, accountTwo) => {

  const supplyKey = PrivateKey.fromString(accountOne.privateKey)
  const treasuryKey = PrivateKey.fromString(accountOne.privateKey)
  const adminKey = PrivateKey.fromString(accountTwo.privateKey);
  const kycKey = PrivateKey.fromString(accountTwo.privateKey);

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
.setKycKey(kycKey)
.setAdminKey(adminKey)
.freezeWith(client);

//SIGN WITH TREASURY KEY
let tokenCreateSign = await tokenCreateTx.sign(treasuryKey);

// SIGN WITH ADMIN
let tokenCreateSign1 = await tokenCreateSign.sign(adminKey);

// SIGN WITH KYC USER
let tokenCreateSign2 = await tokenCreateSign1.sign(adminKey);

//SUBMIT THE TRANSACTION
let tokenCreateSubmit = await tokenCreateSign2.execute(client);

//GET THE TRANSACTION RECEIPT
let tokenCreateRx = await tokenCreateSubmit.getReceipt(client);

//GET THE TOKEN ID
let tokenId = tokenCreateRx.tokenId;

//LOG THE TOKEN ID TO THE CONSOLE
console.log(`- Created token with ID: ${tokenId} \n`);

return tokenId;

};

export const assocTokens = async (client, tokenId, account) => {

  const pvtKey = PrivateKey.fromString(account.privateKey)

  //Create the token associate transaction
  //and sign with the receiver private key of the token
  const associateBuyerTx = await new TokenAssociateTransaction()
    .setAccountId(account.accountID)
    .setTokenIds([tokenId])
    .freezeWith(client)
    .sign(pvtKey);

  //Submit the transaction to a Hedera network
  const associateUserTxSubmit = await associateBuyerTx.execute(client);

  //Request the receipt of the transaction
  const associateUserRx = await associateUserTxSubmit.getReceipt(client);

  //Get the transaction consensus status
  console.log(`Token association with the other account: ${associateUserRx.status} \n`);
};



export const transferToken = async (client, sender, recipient, tokenId, amount) => {
  try{
    const treasuryKey = PrivateKey.fromString(sender.privateKey)

    let tokenTransferTx = await new TransferTransaction()
      .addTokenTransfer(tokenId, sender.accountID, -amount)
      .addTokenTransfer(tokenId, recipient.accountID, amount)
      .freezeWith(client)
      .sign(treasuryKey);
  
    let tokenTransferSubmit = await tokenTransferTx.execute(client);
    let tokenTransferRx = await tokenTransferSubmit.getReceipt(client);
    console.log(`\n- Stablecoin transfer from Treasury to account: ${tokenTransferRx.status} \n`);
  }catch(err){
    console.error('\nThe transaction errored with message ' + err.status.toString());
    console.error('\nError:' + err.toString());
  }
}

export const getTokenBalance = async (client, account) => {
  return (await new AccountBalanceQuery().setAccountId(account.accountID).execute(client)).tokens.toString();
}


export const grantKyc = async (client, tokenId, accountApprover, AccountReceiver) => {

  //Create the pause transaction
  const transaction = await new TokenGrantKycTransaction()
    .setAccountId(AccountReceiver.accountID)
    .setTokenId(tokenId)
    .freezeWith(client);

  //Sign with the supply private key of the token
  const signTx = await transaction.sign(PrivateKey.fromString(accountApprover.privateKey));

  //Submit the transaction to a Hedera network
  const txResponse = await signTx.execute(client);

  //Request the receipt of the transaction
  const receipt = await txResponse.getReceipt(client);

  //Get the transaction consensus status
  const transactionStatus = receipt.status;

  console.log(
    'The grant Kyc transaction consensus status ' + transactionStatus.toString()
  );
  // await queryBalance(user, tokenId);
};
