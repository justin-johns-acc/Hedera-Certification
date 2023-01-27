
const {
	Client,
	PrivateKey,
	TransferTransaction,
	AccountBalanceQuery,
	Hbar
} = require('@hashgraph/sdk');
require('dotenv').config();

//Grab your Hedera testnet account ID and private key from your .env file
const {
    ACCOUNT_1_PRIVKEY,
	ACCOUNT_1_PUBKEY,
	ACCOUNT_1_ID,
	ACCOUNT_2_PRIVKEY,
	ACCOUNT_2_PUBKEY,
	ACCOUNT_2_ID
} = process.env;

const main = async () => {
	
	if (
		ACCOUNT_1_PRIVKEY == null ||
		ACCOUNT_1_PUBKEY == null ||
		ACCOUNT_1_ID == null ||
		ACCOUNT_2_PRIVKEY == null ||
		ACCOUNT_2_PUBKEY == null ||
		ACCOUNT_2_ID == null

	) {
	throw new Error(
		"Environment variables are not fully present"
	);
}

const ACCOUNT_1_PRV_OBJ = PrivateKey.fromString(ACCOUNT_1_PRIVKEY);
const ACCOUNT_2_PRV_OBJ = PrivateKey.fromString(ACCOUNT_2_PRIVKEY);


const client = await getClient();

// get initial balance
const AccountOneBalance = await getBalance(ACCOUNT_1_ID)
const AccountTwoBalance = await getBalance(ACCOUNT_1_ID)

console.log(`balance before transaction Account 1: ${AccountOneBalance} , Account 2: ${AccountTwoBalance}`);

// create an Hbar transaction transferring 10 Hbar
const hbarTrasnaction = await createHbarTransaction(ACCOUNT_1_ID, ACCOUNT_2_ID, 10);

const hbarTrasnactionRaw = hbarTrasnaction.freezeWith(client)
console.log("transaction created and frozed");

// add first party signature
const transactionSignedByOne = hbarTrasnactionRaw
			.addSignature(ACCOUNT_1_PUBKEY, ACCOUNT_1_PRV_OBJ.signTransaction(hbarTrasnactionRaw));
console.log("First party signature added");


// base64 encode
const transactionInBytes= transactionSignedByOne.toBytes();
const transactionBase64Encoded =  Buffer.from(transactionInBytes).toString('base64');
console.log("Transaction encoded and serialized");



// Decode transaction
const transactionrebuiltInBytes = Buffer.from(transactionBase64Encoded, 'base64');
const transactionrebuilt = TransferTransaction.fromBytes(transactionrebuiltInBytes);
console.log("Transaction decoded and deserialized");

// add second signature
const transactionFullySigned = transactionrebuilt
	.addSignature(ACCOUNT_2_PUBKEY, ACCOUNT_2_PRV_OBJ.signTransaction(transactionrebuilt));
console.log("Second party signature added");

// execute signed transaction
const txResponse = await transactionFullySigned.execute(client);

const receipt = await txResponse.getReceipt(client);
	
console.log(`TX ${txResponse.transactionId.toString()} status: ${receipt.status}`);

// get final balance
AccountOneBalance = await getBalance(ACCOUNT_1_ID)
AccountTwoBalance = await getBalance(ACCOUNT_1_ID)

console.log(`balance after transaction Account 1: ${AccountOneBalance} , Account 2: ${AccountTwoBalance}`);

}


const createHbarTransaction = async (from, to, amount) => {
	return new TransferTransaction()
		.addHbarTransfer(from, new Hbar(amount))
		.addHbarTransfer(to, new Hbar(amount));
};

const getBalance = async (accountID) => {
	const client = await getClient();

	//Check the account's balance
	return await new AccountBalanceQuery()
		.setAccountId(accountID)
		.execute(client);
};

const getClient = async () => {
	// If we weren't able to grab it, we should throw a new error
	if (ACCOUNT_1_ID == null || ACCOUNT_1_PRIVKEY == null) {
		throw new Error(
			'Environment variables ACCOUNT_1_ID and ACCOUNT_1_PRIVKEY must be present'
		);
	}

	// Create our connection to the Hedera network
	return Client.forTestnet().setOperator(ACCOUNT_1_ID, ACCOUNT_1_PRIVKEY);
};




// execution init
main();
