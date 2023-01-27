const {
	Client,
	TopicCreateTransaction,
	TopicMessageSubmitTransaction,
	TopicMessageQuery,
  } = require('@hashgraph/sdk');
  require('dotenv').config();
  
  //Grab your Hedera testnet account ID and private key from your .env file
  const { ACCOUNT_1_PRIVATEKEY, ACCOUNT_1_ID } = process.env;
  
const main = async () => {
	// create a new topic to submit message
	topicId = await createTopic();
  
	await new Promise((resolve) => setTimeout(resolve, 5000));
  
	await subscribeTopic(topicId.toString());
  
	// calculate current time
	const currentTime = new Date().toUTCString();
  
	// submit msg
	await submitMsg(topicId, currentTime);
  
  };
  
  const createTopic = async () => {
	const client = await getClient();
  
	//Create a new topic
	let txResponse = await new TopicCreateTransaction().execute(client);
  
	//Get the receipt of the transaction
	let receipt = await txResponse.getReceipt(client);
  
	// Wait 5 seconds between consensus topic creation and subscription
	//   await new Promise((resolve) => setTimeout(resolve, 10000));
  
	console.log(`Topic ${receipt.topicId} created`);
  
	//Grab the new topic ID from the receipt
	return receipt.topicId;
  };
  
  const subscribeTopic = async (topicId) => {
	console.log('- topicId', topicId);
	const client = await getClient();
  
	//Create the query to subscribe to a topic
	new TopicMessageQuery().setTopicId(topicId).subscribe(client, null, (message) => {
	  let messageAsString = Buffer.from(message.contents, 'utf8').toString();
	  console.log(`${message.consensusTimestamp.toDate()} Received: ${messageAsString}`);
	});
  };
  
  const submitMsg = async (topicID, msg) => {
	const client = await getClient();
  
	// Send one message
	let sendResponse = await new TopicMessageSubmitTransaction({
	  topicId: topicID,
	  message: msg,
	}).execute(client);
  
	//Get the receipt of the transaction
	const getReceipt = await sendResponse.getReceipt(client);
  
	//Get the status of the transaction
	const transactionStatus = getReceipt.status;
	console.log('The message transaction status: ' + transactionStatus);
  
	// if(transactionStatus.toString() != '22'){
	// 	throw new Error("Transaction is not successful")
	// }
	return true;
  };
  
  const getClient = async () => {
	// If we weren't able to grab it, we should throw a new error
	if (ACCOUNT_1_ID == null || ACCOUNT_1_PRIVATEKEY == null) {
	  throw new Error(
		'Environment variables ACCOUNT_1_ID and ACCOUNT_1_PRIVATEKEY must be present'
	  );
	}
  
	// Create our connection to the Hedera network
	return Client.forTestnet().setOperator(ACCOUNT_1_ID, ACCOUNT_1_PRIVATEKEY);
  };
  
//   execution init
  main();
  