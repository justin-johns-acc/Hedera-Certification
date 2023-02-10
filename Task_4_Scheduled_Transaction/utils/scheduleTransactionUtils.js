import {
  TransferTransaction,
  ScheduleCreateTransaction,
  Hbar,
  PrivateKey,
  AccountId,
  ScheduleId,
  ScheduleInfoQuery,
  Timestamp,
  Client
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

export const createScheduleTransferTransaction = async (
  client,
  accountOne,
  accountTwo,
  amount,
  memo
) => {
  const privateKey = PrivateKey.fromString(accountOne.privateKey);
  //Create a transaction to schedule
  const transaction = new TransferTransaction()
    .addHbarTransfer(accountOne.accountID, new Hbar(amount))
    .addHbarTransfer(accountTwo.accountID, new Hbar(amount));

  //Schedule a transaction
  const scheduletransaction = new ScheduleCreateTransaction()
    .setScheduledTransaction(transaction)
    .setScheduleMemo(memo)
    .setAdminKey(privateKey)
    .freezeWith(client);

  const scheduletransactionByte = scheduletransaction.toBytes();
  const scheduletransactionEncoded = Buffer.from(
    scheduletransactionByte
  ).toString("base64");
  console.log("Transaction is encoded");
  return scheduletransactionEncoded;
};

export const getScheduleInfo = async (client, scheduleId) => {
  //Create the query
  const query = new ScheduleInfoQuery().setScheduleId(scheduleId);

  //Sign with the client operator private key and submit the query request to a node in a Hedera network
  const info = await query.execute(client);
  console.log(
    "The scheduledId you queried for is: ",
    new ScheduleId(info.scheduleId).toString()
  );
  console.log("The memo for it is: ", info.scheduleMemo);
  console.log(
    "It got created by: ",
    new AccountId(info.creatorAccountId).toString()
  );
  console.log(
    "It got payed by: ",
    new AccountId(info.payerAccountId).toString()
  );
  console.log(
    "The expiration time of the scheduled tx is: ",
    new Timestamp(info.expirationTime).toDate()
  );
  if (
    new Timestamp(info.executed).toDate().getTime() ===
    new Date("1970-01-01T00:00:00.000Z").getTime()
  ) {
    console.log("The transaction has not been executed yet.");
  } else {
    console.log(
      "The time of execution of the scheduled tx is: ",
      new Timestamp(info.executed).toDate()
    );
  }
};

export const submitScheduledTxn = async (
  client,
  scheduletransactionEncoded
) => {
  const transactionRebuiltRaw1 = Buffer.from(
    scheduletransactionEncoded,
    "base64"
  );
  const transactionRebuilt1 = ScheduleCreateTransaction.fromBytes(
    transactionRebuiltRaw1
  );

  const txResponse = await transactionRebuilt1.execute(client);
  const receipt = await txResponse.getReceipt(client);
  console.log(
    `TX ${txResponse.transactionId.toString()} status: ${receipt.status}`
  );

  //Get the schedule ID
  const scheduleId = receipt.scheduleId;
  console.log("The schedule ID is " + scheduleId);
  return scheduleId;
};

export const deleteScheduledTransaction = async (client, scheduleId, admin) => {

  const adminKey = PrivateKey.fromString(admin.privateKey);

  //Create the transaction and sign with the admin key
  const transaction = await new ScheduleDeleteTransaction()
    .setScheduleId(scheduleId)
    .freezeWith(client)
    .sign(adminKey);

  //Sign with the operator key and submit to a Hedera network
  const txResponse = await transaction.execute(client);

  //Get the transaction receipt
  const receipt = await txResponse.getReceipt(client);

  //Get the transaction status
  const transactionStatus = receipt.status;
  console.log("The transaction consensus status is " + transactionStatus);
}

export const signScheduledTransaction = async (client, scheduleId, account) => {

  const privateKeySigner = PrivateKey.fromString(account.privateKey)

  //Create the transaction
  const transaction = await new ScheduleSignTransaction()
    .setScheduleId(scheduleId)
    .freezeWith(client)
    .sign(privateKeySigner);

  //Sign with the client operator key to pay for the transaction and submit to a Hedera network
  const txResponse = await transaction.execute(client);

  //Get the receipt of the transaction
  const receipt = await txResponse.getReceipt(client);

  //Get the transaction status
  const transactionStatus = receipt.status;
  console.log("The transaction consensus status is " + transactionStatus);
}