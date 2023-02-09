import { PrivateKey } from "@hashgraph/sdk";
import { getAccount, getBalance } from "../utils/accountUtils.js";
import { createFile, fileExists } from "../utils/fileUtils.js";

const main = async () => {
  const fileName = "accounts.json";

  // check if the file exists, if not generate accounts and write file
  if (!(await fileExists(fileName))) {
    // generate keys and create accounts
    const accounts = await createAndFundAccounts(5);
    await createFile(fileName, accounts);
  }

  process.exit();
};

const createAndFundAccounts = async (numberOfAccounts) => {

  const accounts = [];

  // Generate keys based on the input number
  for (let i = 0; i < numberOfAccounts; i++) {
    const privateKey = PrivateKey.generateED25519();
    const publicKey = privateKey.publicKey;
    const accountID = await getAccount(publicKey);

    // account balance
    const balance = await getBalance(accountID);

    console.log(`\n\nGenerated account: ${i + 1}`);
    console.log(`Public Key: ${publicKey.toStringRaw()}`);
    console.log(`Private Key: ${privateKey.toStringRaw()}`);
    console.log(`Account ID: ${accountID}`);
    console.log(`Account balance: ${balance.hbars.toTinybars()} tinybars.`);

    accounts.push({
      publicKey: publicKey.toStringRaw(),
      privateKey: privateKey.toStringRaw(),
      accountID: accountID.toString()
    })
  }

  return accounts;
};
// execution init
main();
