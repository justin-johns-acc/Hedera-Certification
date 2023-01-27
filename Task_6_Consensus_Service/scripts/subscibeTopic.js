
const {
	Client,
	TopicMessageQuery
} = require('@hashgraph/sdk');
require('dotenv').config();

//Grab your Hedera testnet account ID and private key from your .env file
const {
    ACCOUNT_1_PRIVATEKEY,
    ACCOUNT_1_ID,
    TOPIC_ID
} = process.env;

const main = async () => {


    // subscribe to topic
    await subscribeTopic(TOPIC_ID);

    
    process.exit();
};

const subscribeTopic = async (topicId) => {

	const client = await getClient();

	//Create the query to subscribe to a topic
    new TopicMessageQuery()
        .setTopicId(topicId)
        .setStartTime(0)
        .subscribe(
            client,
            null,
            (message) => console.log(Buffer.from(message.contents, "utf8").toString())
        );
}


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


// execution init
main();
