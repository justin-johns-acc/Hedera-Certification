import {
	Client,
	TopicCreateTransaction,
	TopicMessageSubmitTransaction,
	TopicMessageQuery,
  } from '@hashgraph/sdk';

  //Get accounts from accounts.json
import accounts from "../../Task_1_Account_Setup/accounts.json" assert { type: "json" };
const [accountOne, ...rest] = accounts;

export const getClient = async () => {
  // If we weren't able to grab it, we should throw a new error
  if (accountOne.accountID == null || accountOne.privateKey == null) {
    throw new Error(
      "Environment variables accountID and privateKey must be present"
    );
  }

  // Create our connection to the Hedera network
  return Client.forTestnet().setOperator(
    accountOne.accountID,
    accountOne.privateKey
  );
};

export const createTopic = async () => {
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
  
export const subscribeTopic = async (topicId) => {
	console.log('- topicId', topicId);
	const client = await getClient();
  
	//Create the query to subscribe to a topic
	new TopicMessageQuery().setTopicId(topicId).subscribe(client, null, (message) => {
	  let messageAsString = Buffer.from(message.contents, 'utf8').toString();
	  console.log(`${message.consensusTimestamp.toDate()} Received: ${messageAsString}`);
	});
  };
  
export const submitMsg = async (topicID, msg) => {
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