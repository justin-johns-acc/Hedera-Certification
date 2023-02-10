import { ContractFunctionParameters } from '@hashgraph/sdk';
import { hethers } from '@hashgraph/hethers';

import contractCompiled from '../artifacts/contracts/certificationC3.sol/CertificationC1.json' assert { type: "json" };

import { deployContract, exeContractFunction, deleteContract } from '../utils/contractUtils.js';

//Get accounts from accounts.json
import accounts from "../../Task_1_Account_Setup/accounts.json" assert { type: "json" };
const [accountOne, accountTwo, ...rest] = accounts;

async function main() {

	// helper function to decode fucntion execution output
	const abicoder = new hethers.utils.AbiCoder();

	// deploy contract and get contract id
	const contractId = await deployContract(contractCompiled.bytecode, null, accountOne);

	// execute function one and get results
	const result1Encoded = await exeContractFunction(
		'function1',
		new ContractFunctionParameters().addUint16(5).addUint16(6),
		contractId
		);

	const result1 = abicoder.decode(['uint16'], result1Encoded);

	console.log('Function 1 Output :', result1[0]);


	// delete contract
	await deleteContract(contractId, accountOne);


	process.exit();
}

main();
