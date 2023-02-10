//Get accounts from accounts.json
import accounts from "../../Task_1_Account_Setup/accounts.json" assert { type: "json" };
import {
  deleteScheduledTransaction,
} from "../utils/scheduleTransactionUtils.js";
const [accountOne, accountTwo, ...rest] = accounts;

const main = async () =>{
    const scheduleId = '';

    const client = await getClient(accountOne);

    // delete Scheduled transaction
    await deleteScheduledTransaction(client, scheduleId, accountOne);

    
}

main()