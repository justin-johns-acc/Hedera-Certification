import { createTopic, subscribeTopic, submitMsg } from "../utils/consensusUtils.js";

//Get accounts from accounts.json
import accounts from "../../Task_1_Account_Setup/accounts.json" assert { type: "json" };
const [accountOne, accountTwo, ...rest] = accounts;

const main = async () => {
	const client = await getClient(accountOne);

	// create a new topic to submit message
	const topicId = await createTopic(client);
  
	await new Promise((resolve) => setTimeout(resolve, 5000));
  
	await subscribeTopic(client, topicId.toString());
  
	// calculate current time
	const currentTime = new Date().toUTCString();
  
	// submit msg
	await submitMsg(client, topicId, currentTime);
  
  };
  
//   execution init
  main();
  