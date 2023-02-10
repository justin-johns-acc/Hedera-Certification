import {
	Client,
	AccountCreateTransaction,
	AccountBalanceQuery,
	Hbar,
	PrivateKey,
	KeyList,
	TransferTransaction,
	ScheduleInfoQuery,
	ScheduleSignTransaction,
	ScheduleId,
	Timestamp,
	AccountId,
} from '@hashgraph/sdk';

export const getClient = async (account) => {
	// If we weren't able to grab it, we should throw a new error
	if (account.accountID == null || account.privateKey == null) {
		throw new Error(
			'Environment variables accountID and privateKey must be present'
		);
	}

	// Create our connection to the Hedera network
	return Client.forTestnet().setOperator(account.accountID, account.privateKey);
};

export const getBalance = async (client, account) => {
	console.log('account ID:', account.accountID);

	//Check the account's balance
	return await new AccountBalanceQuery()
		.setAccountId(account.accountID)
		.execute(client);
};

export const createKeyList = async (
	accountOne,
	accountTwo,
	accountThree,
	numOfSignReq
) => {
	const key1 = PrivateKey.fromString(accountOne.privateKey).publicKey;
	const key2 = PrivateKey.fromString(accountTwo.privateKey).publicKey;
	const key3 = PrivateKey.fromString(accountThree.privateKey).publicKey;

	let keys = [key1, key2, key3];
	//Create a key list with 3 keys , 2 are mandatory
	const keyList = new KeyList(keys, numOfSignReq);
	return keyList;
};

export const createMultiSigAccount = async (client, keys) => {
	const multiSigAccount = await new AccountCreateTransaction()
		.setKey(keys)
		.setInitialBalance(Hbar.fromString('1'))
		.execute(client);

	// Get the new account ID
	const getReceipt = await multiSigAccount.getReceipt(client);
	const multiSigAccountID = getReceipt.accountId;

	return multiSigAccountID;
};

export const scheduleHbarTransfer = async (
	client,
	multiSigAccountID,
	accountFour
) => {
	const transaction = new TransferTransaction()
		.addHbarTransfer(multiSigAccountID, Hbar.fromString(`-2`))
		.addHbarTransfer(accountFour.accountID, Hbar.fromString('2'))
		.schedule() // create schedule
		.freezeWith(client);

	//Sign with the client operator key to pay for the transaction and submit to a Hedera network
	const txResponse = await transaction.execute(client);

	//Get the receipt of the transaction
	const receipt = await txResponse.getReceipt(client);

	//Get the transaction status
	const transactionStatus = receipt.status;
	console.log('The transaction status is ' + transactionStatus.toString());
	const scheduleId = receipt.scheduleId;
	console.log('The schedule ID is ' + scheduleId);
	return scheduleId;
};

export const queryScheduledTxn = async (client, scheduleId) => {
	//Create the query
	const info = await new ScheduleInfoQuery()
		.setScheduleId(scheduleId)
		.execute(client);

	//Consoling the information
	console.log('\n\nScheduled Transaction Info -');
	console.log('ScheduleId :', new ScheduleId(info.scheduleId).toString());
	console.log('Memo : ', info.scheduleMemo);
	console.log('Created by : ', new AccountId(info.creatorAccountId).toString());
	console.log('Payed by : ', new AccountId(info.payerAccountId).toString());
	console.log(
		'Expiration time : ',
		new Timestamp(info.expirationTime).toDate()
	);
	if (
		new Timestamp(info.executed).toDate().getTime() ===
		new Date('1970-01-01T00:00:00.000Z').getTime()
	) {
		console.log('The transaction has not been executed yet.');
	} else {
		console.log('The transaction has been executed.');
		console.log('Time of execution : ', new Timestamp(info.executed).toDate());
	}
};

export const submitSignatureTxn = async (client, scheduleId, account) => {
	try {
		// Get the schedule transaction
		const transaction = new ScheduleSignTransaction({
			scheduleId,
		}).freezeWith(client);
		// Sign the transaction with required key
		const signTx = await transaction.sign(
			PrivateKey.fromString(account.privateKey)
		);
		const txResponse = await signTx.execute(client);
		const receipt = await txResponse.getReceipt(client);
		console.log(
			`Submitting Signature to Schedule Transaction ${scheduleId} status is ${receipt.status}`
		);
	} catch (error) {
		console.log(`Failed to execute transaction ${error.message}`);
	}
};
