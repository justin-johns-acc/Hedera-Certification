const {
	Client,
	ContractExecuteTransaction,
	PrivateKey,
	ContractCreateFlow,
	ContractFunctionParameters,
} = require('@hashgraph/sdk');
const { hethers } = require('@hashgraph/hethers');
require('dotenv').config();

//Grab your Hedera testnet account ID and private key from your .env file
const {
    ACCOUNT_1_PRIVKEY,
	ACCOUNT_1_ID,
} = process.env;

const abicoder = new hethers.utils.AbiCoder();

const myAccountId = ACCOUNT_1_ID;
const myPrivateKey = PrivateKey.fromString(ACCOUNT_1_PRIVKEY);

// If we weren't able to grab it, we should throw a new error
if (myAccountId == null || myPrivateKey == null) {
	throw new Error(
		'Environment variables myAccountId and myPrivateKey must be present'
	);
}

// Create our connection to the Hedera network
// The Hedera JS SDK makes this really easy!
const client = Client.forTestnet();

client.setOperator(myAccountId, myPrivateKey);

async function main() {
	let contractCompiled = require('../artifacts/certificationC1.sol/CertificationC1.json');
	const bytecode = contractCompiled.bytecode;

	//Create the transaction
	const contractCreate = new ContractCreateFlow()
		.setGas(100000)
		.setBytecode(bytecode);

	//Sign the transaction with the client operator key and submit to a Hedera network
	const txResponse = contractCreate.execute(client);

	//Get the receipt of the transaction
	const receipt = (await txResponse).getReceipt(client);

	//Get the new contract ID
	const contractId = (await receipt).contractId;

	console.log('The new contract ID is ' + contractId);

	//Create the transaction to update the contract message
	const contractExecTx1 = new ContractExecuteTransaction()
		//Set the ID of the contract
		.setContractId(contractId)
		//Set the gas for the contract call
		.setGas(100000)
		//Set the contract function to call
		.setFunction(
			'function1',
			new ContractFunctionParameters().addUint16(6).addUint16(7)
		);

	//Submit the transaction to a Hedera network and store the response
	const submitExecTx1 = await contractExecTx1.execute(client);

	const record = await submitExecTx1.getRecord(client);

	const encodedResult1 =
		'0x' + record.contractFunctionResult.bytes.toString('hex');

	const result1 = abicoder.decode(['uint16'], encodedResult1);

	console.log('Function 1 Output :', result1[0]);

	//Create the transaction to update the contract message
	const contractExecTx2 = new ContractExecuteTransaction()
		//Set the ID of the contract
		.setContractId(contractId)
		//Set the gas for the contract call
		.setGas(100000)
		//Set the contract function to call
		.setFunction(
			'function2',
			new ContractFunctionParameters().addUint16(result1[0])
		);

	//Submit the transaction to a Hedera network and store the response
	const submitExecTx2 = await contractExecTx2.execute(client);

	const record2 = await submitExecTx2.getRecord(client);

	const encodedResult2 =
		'0x' + record2.contractFunctionResult.bytes.toString('hex');

	const result2 = abicoder.decode(['uint16'], encodedResult2);

	console.log('Function 2 Output :', result2[0]);

	process.exit();
}

main();
