import { createTopic, subscribeTopic, submitMsg } from "../utils/consensusUtils.js";
const main = async () => {
	// create a new topic to submit message
	const topicId = await createTopic();
  
	await new Promise((resolve) => setTimeout(resolve, 5000));
  
	await subscribeTopic(topicId.toString());
  
	// calculate current time
	const currentTime = new Date().toUTCString();
  
	// submit msg
	await submitMsg(topicId, currentTime);
  
  };
  
//   execution init
  main();
  