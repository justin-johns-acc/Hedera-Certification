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

export const createNft = async (client, accountOne, accountTwo) => {
  const account1PrivateKey = PrivateKey.fromString(accountOne.privateKey);
  // DEFINE CUSTOM FEE SCHEDULE (50% royalty fee - 5/10ths)
  let nftCustomFee = new CustomRoyaltyFee()
    .setNumerator(10)
    .setDenominator(100)
    .setFeeCollectorAccountId(accountTwo.accountID)
    //the fallback fee is set to 200 hbar.
    .setFallbackFee(new CustomFixedFee().setHbarAmount(new Hbar(200)));

  let nftCreate = await new TokenCreateTransaction()
    .setTokenName("My First Nft")
    .setTokenSymbol("HNFT")
    .setTokenType(TokenType.NonFungibleUnique)
    .setDecimals(0)
    .setInitialSupply(0)
    .setTreasuryAccountId(accountOne.accountID)
    .setSupplyType(TokenSupplyType.Finite)
    .setMaxSupply(5)
    .setCustomFees([nftCustomFee])
    .setSupplyKey(account1PrivateKey)
    .freezeWith(client);

  //Sign the transaction with the treasury key
  let nftCreateTxSign = await nftCreate.sign(account1PrivateKey);

  //Submit the transaction to a Hedera network
  let nftCreateSubmit = await nftCreateTxSign.execute(client);

  //Get the transaction receipt
  let nftCreateRx = await nftCreateSubmit.getReceipt(client);

  //Get the token ID
  let tokenId = nftCreateRx.tokenId;

  //Log the token ID
  console.log(`NFT is Created with TokenId: ${tokenId} \n`);

  return tokenId;
};


export const mintNft = async (client, tokenId, accountOne, metadata) => {
    const privateKey1 = PrivateKey.fromString(accountOne.privateKey)
    // Mint new NFT
    let mintTx = await new TokenMintTransaction()
        .setTokenId(tokenId)
        .setMetadata([Buffer.from(metadata)])
        .freezeWith(client);

    //Sign the transaction with the supply key
    let mintTxSign = await mintTx.sign(privateKey1);

    //Submit the transaction to a Hedera network
    let mintTxSubmit = await mintTxSign.execute(client);

    //Get the transaction receipt
    let mintRx = await mintTxSubmit.getReceipt(client);

    //Log the serial number
    console.log(`- Created NFT ${tokenId} with serial: ${mintRx.serials[0].low} \n`);
}

export const transferNFTPrimary = async (client, accountOne, accountTwo, tokenId, slNo) => {
    const privateKey1 = PrivateKey.fromString(accountOne.privateKey)
    const privateKey2 = PrivateKey.fromString(accountTwo.privateKey)
    //  Before an account that is not the treasury for a token can receive or send this specific token ID, the account
    //  must become “associated” with the token.
    let associateBuyerTx = await new TokenAssociateTransaction()
        .setAccountId(accountTwo.accountID)
        .setTokenIds([tokenId])
        .freezeWith(client)
        .sign(privateKey2)

    //SUBMIT THE TRANSACTION
    let associateBuyerTxSubmit = await associateBuyerTx.execute(client);

    //GET THE RECEIPT OF THE TRANSACTION
    let associateBuyerRx = await associateBuyerTxSubmit.getReceipt(client);

    //LOG THE TRANSACTION STATUS
    console.log(`- Token association with the users account: ${associateBuyerRx.status} \n`);

    // Transfer the NFT from treasury to Alice
    // Sign with the treasury key to authorize the transfer
    let tokenTransferTx = await new TransferTransaction()
        .addNftTransfer(tokenId, slNo, accountOne.accountID, accountTwo.accountID)
        .freezeWith(client)
        .sign(privateKey1);

    let tokenTransferSubmit = await tokenTransferTx.execute(client);
    let tokenTransferRx = await tokenTransferSubmit.getReceipt(client);

    console.log(`\n- NFT transfer from Treasury to Buyer: ${tokenTransferRx.status} \n`);

    // Check the balance of Alice's account after the transfer
    let balanceCheckTx = await new AccountBalanceQuery().setAccountId(accountTwo.accountID).execute(client);
    console.log(`- Buyer's balance: ${balanceCheckTx.tokens._map.get(tokenId.toString())} NFTs of ID ${tokenId}`);

}

export const transferNFTSecondary = async (client, accountOne, accountTwo, tokenId, slNo) => {
    const privateKey1 = PrivateKey.fromString(accountOne.privateKey)
    const privateKey2 = PrivateKey.fromString(accountTwo.privateKey)
    //  Before an account that is not the treasury for a token can receive or send this specific token ID, the account
    //  must become “associated” with the token.
    let associateBuyerTx = await new TokenAssociateTransaction()
        .setAccountId(accountTwo.accountID)
        .setTokenIds([tokenId])
        .freezeWith(client)
        .sign(privateKey2)

    //SUBMIT THE TRANSACTION
    let associateBuyerTxSubmit = await associateBuyerTx.execute(client);

    //GET THE RECEIPT OF THE TRANSACTION
    let associateBuyerRx = await associateBuyerTxSubmit.getReceipt(client);

    //LOG THE TRANSACTION STATUS
    console.log(`- Token association with the users account: ${associateBuyerRx.status} \n`);

    // Transfer the NFT from treasury to Alice
    // Sign with the treasury key to authorize the transfer
    let atomicSwap = new TransferTransaction()
        .addNftTransfer(tokenId, slNo, accountOne.accountID, accountTwo.accountID)
		.addHbarTransfer(accountTwo.accountID, Hbar.fromString(`-10`))
      	.addHbarTransfer(accountOne.accountID, Hbar.fromString('10'))
		.freezeWith(client);

	let tokenTransferTx = await (await (await atomicSwap.sign(privateKey1)).sign(privateKey2)).execute(client)
	
    let tokenTransferRx = await tokenTransferTx.getReceipt(client);

    console.log(`\n- NFT transfer secondary: ${tokenTransferRx.status} \n`);

    // Check the balance of Alice's account after the transfer
    let balanceCheckTx = await new AccountBalanceQuery().setAccountId(accountTwo.accountID).execute(client);
    console.log(`- Buyer's balance: ${balanceCheckTx.tokens._map.get(tokenId.toString())} NFTs of ID ${tokenId}`);

}
