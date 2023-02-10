import {
  Client,
  ContractCreateFlow,
  ContractExecuteTransaction,
  ContractDeleteTransaction,
  PrivateKey,
  Wallet
} from "@hashgraph/sdk";

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

// deploy contract to hedera
export const deployContract = async (bytecode, params, adminAccount) => {
  const client = await getClient();

  // const adminPrvKey = PrivateKey.fromString(adminAccount.privateKey);
  const adminUser = new Wallet(adminAccount.accountID, adminAccount.privateKey);
  
  //Create the transaction
  const contractCreate = new ContractCreateFlow()
    .setGas(100000)
    .setBytecode(bytecode)
    .setConstructorParameters(params);

  // set adminKey
  const contractCreateTx = contractCreate.setAdminKey(adminUser.publicKey);

  //Sign the transaction with the client operator key and submit to a Hedera network
  const txResponse = contractCreateTx.execute(client);

  //Get the receipt of the transaction
  const receipt = (await txResponse).getReceipt(client);

  //Get the new contract ID
  const contractId = (await receipt).contractId;

  console.log("The new contract ID is " + contractId);

  return contractId;
};

// execute contract function
export const exeContractFunction = async (functionName, params, contractId) => {
  const client = await getClient();

  //Create the transaction to update the contract message
  const contractExecTx = new ContractExecuteTransaction()
    //Set the ID of the contract
    .setContractId(contractId)
    //Set the gas for the contract call
    .setGas(100000)
    //Set the contract function to call
    .setFunction(functionName, params);

  //Submit the transaction to a Hedera network and store the response
  const submitExecTx = await contractExecTx.execute(client);

  const record = await submitExecTx.getRecord(client);

  const encodedResult =
    "0x" + record.contractFunctionResult.bytes.toString("hex");

  return encodedResult;
};

export const exeContractQuery = async (functionName, params, contractId) => {
  const client = await getClient();

  //Contract call query
  const query = new ContractCallQuery()
    .setContractId(contractId)
    .setGas(600)
    .setFunction(functionName, params);

  //Sign with the client operator private key to pay for the query and submit the query to a Hedera network
  const contractCallResult = await query.execute(client);

  // Get the function value
  const message = contractCallResult.getString(0);
  console.log("contract message: " + message);

  return message;
};

export const deleteContract = async (contractId, adminAccount) => {

  const adminPrvKey = PrivateKey.fromString(adminAccount.privateKey)

  const client = await getClient();
  //Create the transaction
  const transaction = await new ContractDeleteTransaction()
    .setContractId(contractId)
    .setTransferAccountId(adminAccount.accountID)
    .freezeWith(client);

    // Sign with the admin key on the contract
    const signTx = await transaction.sign(adminPrvKey)

  //Sign the transaction with the client operator's private key and submit to a Hedera network
  const txResponse = await signTx.execute(client);

  //Get the receipt of the transaction
  const receipt = await txResponse.getReceipt(client);

  //Get the transaction consensus status
  const transactionStatus = receipt.status;

  console.log("The transaction consensus status is " + transactionStatus);
  console.log('contract deleted succesfully ');
};
