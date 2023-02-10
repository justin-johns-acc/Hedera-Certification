import {
  Client,
  AccountCreateTransaction,
  AccountBalanceQuery,
  Hbar,
  PrivateKey,
  KeyList,
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
  return Client.forTestnet().setOperator(
    account.accountID,
    account.privateKey
  );
};


export const getBalance = async (client, account) => {

  console.log("account ID:", account.accountID);

  //Check the account's balance
  return await new AccountBalanceQuery()
    .setAccountId(account.accountID)
    .execute(client);
};

export const createKeyList = async (accountOne, accountTwo, accountThree) =>  {
  const key1 = PrivateKey.fromString(accountOne.privateKey).publicKey;
  const key2 = PrivateKey.fromString(accountTwo.privateKey).publicKey;
  const key3 = PrivateKey.fromString(accountThree.privateKey).publicKey;

  let keys = [key1, key2, key3];
  //Create a key list with 3 keys , 2 are mandatory
  const keyList = new KeyList(keys, 2);
  return keyList;
};

export const createMultiSigAccount = async (client, keys) => {
  const multiSigAccount = await new AccountCreateTransaction()
      .setKey(keys)
      .setInitialBalance(Hbar.fromString('1'))
      .execute(client);

  // Get the new account ID
  const getReceipt = await multiSigAccount.getReceipt(client);
  const multiSigAccountID = getReceipt.accountId;

  return multiSigAccountID;
};


export const transferHbars = async (client, multiSigAccountID, accountFour, AccountOne, AccountTwo) => {

  const transaction = new TransferTransaction()
      .addHbarTransfer(multiSigAccountID, Hbar.fromString(`-10`))
      .addHbarTransfer(accountFour.accountID, Hbar.fromString('10'))
      .freezeWith(client);

  const signedTxn = await transaction.sign(PrivateKey.fromString(AccountOne.privateKey));

  const multiSignedTxn = await signedTxn.sign(
      PrivateKey.fromString(AccountTwo.privateKey)
  );

  //Sign with the client operator key to pay for the transaction and submit to a Hedera network
  const txResponse = await multiSignedTxn.execute(client);

  //Get the receipt of the transaction
  const receipt = await txResponse.getReceipt(client);

  //Get the transaction status
  const transactionStatus = receipt.status;
  console.log('The transaction status is ' + transactionStatus.toString());
}
