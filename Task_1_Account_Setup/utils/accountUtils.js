import {
  Client,
  AccountCreateTransaction,
  AccountBalanceQuery,
  Hbar,
} from "@hashgraph/sdk";

import dotenv from 'dotenv'
dotenv.config()

const myAccountId = process.env.ROOT_ADMIN_ACCOUNT_ID;
const myPrivateKey = process.env.ROOT_ADMIN_ACCOUNT_PRIVATEKEY;

export const getClient = async () => {
  // If we weren't able to grab it, we should throw a new error
  if (myAccountId == null || myPrivateKey == null) {
    throw new Error(
      "Environment variables accountID and privateKey must be present"
    );
  }



  // Create our connection to the Hedera network
  return Client.forTestnet().setOperator(
    myAccountId,
    myPrivateKey
  );
};

export const getAccount = async (accPubKey) => {
  const client = await getClient();

  //Create a new account with 1,000 tinybar starting balance
  const newAccount = await new AccountCreateTransaction()
    .setKey(accPubKey)
    .setInitialBalance(new Hbar(100))
    .execute(client);

  // Get the new account ID
  const getReceipt = await newAccount.getReceipt(client);
  return getReceipt.accountId;
};

export const getBalance = async (accountID) => {
  const client = await getClient();

  //Check the account's balance
  return await new AccountBalanceQuery()
    .setAccountId(accountID)
    .execute(client);
};
