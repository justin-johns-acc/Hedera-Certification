//Get accounts from accounts.json
import accounts from "../../Task_1_Account_Setup/accounts.json" assert { type: "json" };
import {
  getClient,
  createScheduleTransferTransaction,
  submitScheduledTxn,
  getScheduleInfo,
} from "../utils/scheduleTransactionUtils.js";
const [accountOne, accountTwo, ...rest] = accounts;

async function main() {
  const client = await getClient(accountOne);

  let currentTime = new Date().getTime();
  let memo = "This messege submitted at " + currentTime;
  const scheduletransactionEncoded = await createScheduleTransferTransaction(
    client,
    accountOne,
    accountTwo,
    memo
  );
  const scheduleId = await submitScheduledTxn(
    client,
    accountOne.privateKey,
    scheduletransactionEncoded
  );
  await getScheduleInfo(client, scheduleId);

  process.exit();
}

main();
