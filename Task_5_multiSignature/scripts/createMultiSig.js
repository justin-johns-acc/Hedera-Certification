import {
	getClient,
	createKeyList,
	getBalance,
	createMultiSigAccount,
	scheduleHbarTransfer,
	queryScheduledTxn,
	submitSignatureTxn,
} from '../utils/multiSigUtils.js';

//Get accounts from accounts.json
import accounts from '../../Task_1_Account_Setup/accounts.json' assert { type: 'json' };
const [
	accountOne,
	accountTwo,
	accountThree,
	accountFour,
	accountFive,
	...rest
] = accounts;

const main = async () => {
	const client = await getClient(accountFour);

	const keyList = await createKeyList(accountOne, accountTwo, accountThree, 2);
	console.log('\n\nKey list created\n\n ');

	const multiSignatureAccId = await createMultiSigAccount(client, keyList);
	console.log(
		'\nThe Multi Signature Account ID is: ' + multiSignatureAccId,
		'\n'
	);

	// let accountBalance = await getBalance(client, accountFour);
	// console.log('Account 5 balance : ', accountBalance);

	console.log('\nScheduling Hbar Transfer');
	const scheduleID = await scheduleHbarTransfer(
		client,
		multiSignatureAccId,
		accountFive
	);
	await queryScheduledTxn(client, scheduleID);

	// accountBalance = await getBalance(client, accountFive);
	// console.log('Account 5 balance : ', accountBalance);

	console.log('\nSubmitting first signature');
	await submitSignatureTxn(client, scheduleID, accountOne);
	await queryScheduledTxn(client, scheduleID);

	// accountBalance = await getBalance(client, accountFive);
	// console.log('Account 5 balance : ', accountBalance);

	console.log('\nSubmitting second signature');
	await submitSignatureTxn(client, scheduleID, accountTwo);
	await queryScheduledTxn(client, scheduleID);

	// accountBalance = await getBalance(client, accountFive);
	// console.log('Account 5 balance : ', accountBalance);

	process.exit();
};

main();
