//Get accounts from accounts.json
import accounts from "../../Task_1_Account_Setup/accounts.json" assert { type: "json" };
import scheduleIdObj from "../schedule.json" assert { type: "json" };
import {
  deleteScheduledTransaction,
  signScheduledTransaction,
  getClient,
  getScheduleInfo
} from "../utils/scheduleTransactionUtils.js";
const [accountOne, accountTwo, ...rest] = accounts;

const main = async () =>{

    const client = await getClient(accountOne);

    console.log("\nworking with schedule id:", scheduleIdObj.scheduleId);

    await getScheduleInfo(client, scheduleIdObj.scheduleId);

    // delete Scheduled transaction
    await deleteScheduledTransaction(client, scheduleIdObj.scheduleId, accountOne);

    // submit signature
    await signScheduledTransaction(client, scheduleIdObj.scheduleId, accountTwo);

    // get scheduled info
    await getScheduleInfo(client, scheduleIdObj.scheduleId);

}

main()