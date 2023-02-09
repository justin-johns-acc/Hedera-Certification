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
  memo
) => {
  const privateKey = PrivateKey.fromString(accountOne.privateKey);
  //Create a transaction to schedule
  const transaction = new TransferTransaction()
    .addHbarTransfer(accountOne.accountID, Hbar.fromTinybars(-10))
    .addHbarTransfer(accountTwo.accountID, Hbar.fromTinybars(10));

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
  privateKeyRaw,
  scheduletransactionEncoded
) => {
  const privateKey = PrivateKey.fromString(privateKeyRaw);
  const transactionRebuiltRaw1 = Buffer.from(
    scheduletransactionEncoded,
    "base64"
  );
  const transactionRebuilt1 = ScheduleCreateTransaction.fromBytes(
    transactionRebuiltRaw1
  );
  const signedTransaction3 = await transactionRebuilt1.sign(privateKey);

  const txResponse = await signedTransaction3.execute(client);
  const receipt = await txResponse.getReceipt(client);
  console.log(
    `TX ${txResponse.transactionId.toString()} status: ${receipt.status}`
  );

  //Get the schedule ID
  const scheduleId = receipt.scheduleId;
  console.log("The schedule ID is " + scheduleId);
  return scheduleId;
};
