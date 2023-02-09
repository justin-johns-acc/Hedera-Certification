import { ContractFunctionParameters } from '@hashgraph/sdk';
import { hethers } from '@hashgraph/hethers';

import contractCompiled from '../artifacts/certificationC1.sol/CertificationC1.json' assert { type: "json" };

import { deployContract, exeContractFunction } from '../utils/contractUtils.js';

async function main() {

	// helper function to decode fucntion execution output
	const abicoder = new hethers.utils.AbiCoder();

	// deploy contract and get contract id
	const contractId = await deployContract(contractCompiled.bytecode, null);

	// execute function one and get results
	const result1Encoded = await exeContractFunction(
		'function1',
		new ContractFunctionParameters().addUint16(6).addUint16(7),
		contractId
		);

	const result1 = abicoder.decode(['uint16'], result1Encoded);

	console.log('Function 1 Output :', result1[0]);

	// execute function two and get results
	const result2Encoded = await exeContractFunction(
		'function2',
		new ContractFunctionParameters().addUint16(result1[0]),
		contractId
		);

	const result2 = abicoder.decode(['uint16'], result2Encoded);

	console.log('Function 2 Output :', result2[0]);

	process.exit();
}

main();
