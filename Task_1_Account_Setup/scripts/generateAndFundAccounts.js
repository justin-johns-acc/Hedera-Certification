
const {
	Client,
	PrivateKey,
	AccountCreateTransaction,
	AccountBalanceQuery,
	Hbar
} = require('@hashgraph/sdk');
require('dotenv').config();

//Grab your Hedera testnet account ID and private key from your .env file
const {
    ROOT_ADMIN_ACCOUNT_PRIVATEKEY,
    ROOT_ADMIN_ACCOUNT_ID
} = process.env;

const main = async () => {

	// generate keys and create accounts
	const accounts = await createAndFundAccounts(5);

	process.exit();
};


const getClient = async () => {
	// If we weren't able to grab it, we should throw a new error
	if (ROOT_ADMIN_ACCOUNT_ID == null || ROOT_ADMIN_ACCOUNT_PRIVATEKEY == null) {
		throw new Error(
			'Environment variables ROOT_ADMIN_ACCOUNT_ID and ROOT_ADMIN_ACCOUNT_PRIVATEKEY must be present'
		);
	}

	// Create our connection to the Hedera network
	return Client.forTestnet().setOperator(ROOT_ADMIN_ACCOUNT_ID, ROOT_ADMIN_ACCOUNT_PRIVATEKEY);
};


const createAndFundAccounts = async (numberOfAccounts) => {

	const privateKeys = [];
	const publicKeys = [];
	const accountIDs = [];

	// Generate keys based on the input number
	for (let i = 0; i < numberOfAccounts; i++) {
		const privateKey = PrivateKey.generateED25519();
		const publicKey = privateKey.publicKey;
		const accountID = await getAccount(publicKey);

		privateKeys.push(privateKey);
		publicKeys.push(publicKey);
		accountIDs.push(accountID);

		// account balance
		const balance = await getBalance(accountID);

		console.log(`\n\nGenerated account: ${i + 1}`);
		console.log(`Public Key: ${publicKey.toStringRaw()}`);
		console.log(`Private Key: ${privateKey.toStringRaw()}`);
		console.log(`Account ID: ${accountID}`);
		console.log(`Account balance: ${balance.hbars.toTinybars()} tinybars.`);


	}

	return { privateKeys, publicKeys, accountIDs };

}

const getAccount = async (accPubKey) => {

	const client = await getClient();

	//Create a new account with 1,000 tinybar starting balance
	const newAccount =  await new AccountCreateTransaction()
	.setKey(accPubKey)
	.setInitialBalance(new Hbar(100))
	.execute(client);

	// Get the new account ID
	const getReceipt = await newAccount.getReceipt(client);
	return getReceipt.accountId;

}

const getBalance = async (accountID) => {
	const client = await getClient();

	//Check the account's balance
	return await new AccountBalanceQuery()
		.setAccountId(accountID)
		.execute(client);
};

// execution init
main();
