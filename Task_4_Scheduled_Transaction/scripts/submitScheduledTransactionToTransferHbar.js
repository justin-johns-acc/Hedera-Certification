//Get accounts from accounts.json
import accounts from "../../Task_1_Account_Setup/accounts.json" assert { type: "json" };
import {
  getClient,
  createScheduleTransferTransaction,
  submitScheduledTxn,
  getScheduleInfo,
} from "../utils/scheduleTransactionUtils.js";
import { createFile } from "../utils/fileUtils.js"
const [accountOne, accountTwo, ...rest] = accounts;

async function main() {
  const client = await getClient(accountOne);

  let currentTime = new Date().getTime();
  let memo = "This messege submitted at " + currentTime;

  // create scheduled trasnfer transaction encoded
  const scheduletransactionEncoded = await createScheduleTransferTransaction(
    client,
    accountOne,
    accountTwo,
    2,
    memo
  );

  // decoded trsnfer transaction and submit
  const scheduleId = await submitScheduledTxn(
    client,
    scheduletransactionEncoded
  );

  // get scheduled info
  await getScheduleInfo(client, scheduleId);

  
  const fileName = 'schedule.json';
  const scheduleIdObj = {scheduleId: scheduleId.toString()}
  
  // write schedule id into json file
  await createFile(fileName, scheduleIdObj);

  process.exit();
}

main();
