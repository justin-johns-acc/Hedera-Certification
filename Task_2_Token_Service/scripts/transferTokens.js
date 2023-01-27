const {
  TokenCreateTransaction,
  Wallet,
  TokenMintTransaction,
  PrivateKey,
  TokenType,
  TokenSupplyType,
  Client,
  TransferTransaction,
  TokenAssociateTransaction,
  AccountBalanceQuery,
  TokenPauseTransaction,
  TokenUnpauseTransaction,
} = require("@hashgraph/sdk");
require('dotenv').config();
const {
	ACCOUNT_1_PRIVKEY,
	ACCOUNT_1_PUBKEY,
	ACCOUNT_1_ID,
	ACCOUNT_2_PRIVKEY,
	ACCOUNT_2_PUBKEY,
	ACCOUNT_2_ID,
	ACCOUNT_3_PRIVKEY,
	ACCOUNT_3_PUBKEY,
	ACCOUNT_3_ID,
	ACCOUNT_4_PRIVKEY,
	ACCOUNT_4_PUBKEY,
	ACCOUNT_4_ID,
	ACCOUNT_5_PRIVKEY,
	ACCOUNT_5_PUBKEY,
	ACCOUNT_5_ID,
 } = process.env;

const adminPrivateKey = PrivateKey.fromString(ACCOUNT_1_PRIVKEY);
const supplyPrivateKey = PrivateKey.fromString(ACCOUNT_2_PRIVKEY);
const receiverOnePrivateKey = PrivateKey.fromString(ACCOUNT_3_PRIVKEY);
const receiverTwoPrivateKey = PrivateKey.fromString(ACCOUNT_4_PRIVKEY);
const pauserPrivateKey = PrivateKey.fromString(ACCOUNT_5_PRIVKEY);

const tokenAdminUser = new Wallet(ACCOUNT_1_ID, adminPrivateKey);

const tokenSupplyUser = new Wallet(ACCOUNT_2_ID, supplyPrivateKey);

const receiverOne = new Wallet(ACCOUNT_3_ID, receiverOnePrivateKey);

const receiverTwo = new Wallet(ACCOUNT_4_ID, receiverTwoPrivateKey);

const pauser = new Wallet(ACCOUNT_5_ID, pauserPrivateKey);

const client = Client.forTestnet();

client.setOperator(tokenAdminUser.accountId, adminPrivateKey);

/**
 * Create a fungible token with mint and pause ablity
 */
async function createToken() {
  const transaction = new TokenCreateTransaction({
    tokenName: "Accubits Game Token",
    tokenSymbol: "AGT",
    tokenType: TokenType.FungibleCommon,
    treasuryAccountId: tokenSupplyUser.accountId,
    initialSupply: 35050,
    maxSupply: 50000,
    supplyType: TokenSupplyType.Finite,
    adminKey: tokenAdminUser.publicKey,
    supplyKey: tokenSupplyUser.publicKey,
    pauseKey: pauser.publicKey,
    decimals: 2,
  }).freezeWith(client);
  //Sign the transaction with the client, who is set as admin and treasury account
  await transaction.sign(adminPrivateKey);
  await transaction.sign(supplyPrivateKey);

  //Submit to a Hedera network
  const txResponse = await transaction.execute(client);

  //Get the receipt of the transaction
  const receipt = await txResponse.getReceipt(client);

  //Get the token ID from the receipt
  const tokenId = receipt.tokenId;

  console.log("Token ID: " + tokenId);
}

// Part 2 of Task 1
const receivers = [accountThree, accountFour];

client.setOperator(tokenSupplyUser.accountId, supplyPrivateKey);

/**
 * Mint tokens post deployment of the token with supply account
 */
async function mintTokens(amountToMint) {
  // Mint required tokens to transferred from supply account
  console.log(`Minting ${amountToMint} for ${receivers.length} receivers`);
  const transaction = new TokenMintTransaction()
    .setTokenId(tokenId)
    .setAmount(amountToMint)
    .freezeWith(client);

  const signTx = await transaction.sign(supplyPrivateKey);
  const txResponse = await signTx.execute(client);
  const receipt = await txResponse.getReceipt(client);
  console.log(`Token Mint Status ${receipt.status}`);
}

/**
 * Query user token balance
 * @param {*} accountId
 */
async function balance(accountId) {
  const balanceQuery = new AccountBalanceQuery().setAccountId(accountId);

  //Sign with the client operator private key and submit to a Hedera network
  const tokenBalance = await balanceQuery.execute(client);

  console.log(
    `Token Balance of ${accountId} is ${tokenBalance.tokens.get(tokenId)}`
  );
}

/**
 * Associate the supply account and receivers to the token
 */
async function associateTokens() {
  for (const account of [accountTwo, accountThree, accountFour]) {
    try {
      console.log(`Associating user ${account.accountId} to token ${tokenId}`);
      const associateOtherWalletTx = new TokenAssociateTransaction()
        .setAccountId(account.accountId)
        .setTokenIds([tokenId])
        .freezeWith(client);
      associateOtherWalletTx.sign(PrivateKey.fromString(account.privateKey));

      //SUBMIT THE TRANSACTION
      const associateOtherWalletTxSubmit = await associateOtherWalletTx.execute(
        client
      );

      //GET THE RECEIPT OF THE TRANSACTION
      const associateOtherWalletRx =
        await associateOtherWalletTxSubmit.getReceipt(client);

      console.log(
        `Token association with the user account: ${account.accountId} ${associateOtherWalletRx.status}`
      );
    } catch (error) {
      console.log(`${error.message}`);
    }
  }
}

/**
 * Transfer tokens to Defined Receivers
 */
async function transferTokens(receivers, totalTransferAmount) {
  try {
    // Transfer Tokens to all receivers
    const transferTransaction = new TransferTransaction().addTokenTransfer(
      tokenId,
      tokenSupplyUser.accountId,
      -totalTransferAmount
    );
    const amounToTransfer = totalTransferAmount / receivers.length;

    for (const receiver of receivers) {
      console.log(
        `Adding account ${receiver.accountId} to receive ${amounToTransfer}`
      );
      transferTransaction.addTokenTransfer(
        tokenId,
        receiver.accountId,
        amounToTransfer
      );
    }
    transferTransaction.freezeWith(client);

    // Sign with the sender account private key
    await transferTransaction.sign(adminPrivateKey);
    const txTransferResponse = await transferTransaction.execute(client);
    const txTransferReceipt = await txTransferResponse.getReceipt(client);
    console.log(`Token transfer status ${txTransferReceipt.status}`);
  } catch (error) {
    console.log(error.message);
  }
}

/**
 * Pause the token transfers
 */
async function pause() {
  try {
    const transaction = new TokenPauseTransaction()
      .setTokenId(tokenId)
      .freezeWith(client);
    const signTx = await transaction.sign(pauserPrivateKey);
    const txResponse = await signTx.execute(client);
    const receipt = await txResponse.getReceipt(client);
    console.log(`Token pause status ${receipt.status}`);
  } catch (error) {
    console.log(error.message);
  }
}

// Unpause the token transfers

async function unpause() {
  try {
    const transaction = new TokenUnpauseTransaction()
      .setTokenId(tokenId)
      .freezeWith(client);
    const signTx = await transaction.sign(pauserPrivateKey);
    const txResponse = await signTx.execute(client);
    const receipt = await txResponse.getReceipt(client);
    console.log(`Token unpause status ${receipt.status}`);
  } catch (error) {
    console.log(error.message);
  }
}

async function main() {
  const totalAmount = 2525 * 2;
  await createToken();
  await mintTokens(totalAmount);
  await balance(accountTwo.accountId);
  await associateTokens();
  await transferTokens([accountThree, accountFour], totalAmount);
  await balance(accountThree.accountId);
  await balance(accountFour.accountId);
  await pause();
  await transferTokens([accountThree], 135);
  await unpause();
  await transferTokens([accountThree], 135);
  await balance(accountTwo.accountId);
  await balance(accountThree.accountId);
  await balance(accountFour.accountId);
  process.exit();
}

main();
