import { getClient, createKeyList, getBalance , createMultiSigAccount, transferHbars } from '../utils/multiSigUtils.js';

//Get accounts from accounts.json
import accounts from '../../Task_1_Account_Setup/accounts.json' assert { type: "json" };
const [ accountOne, accountTwo, accountThree, accountFour, ...rest ] = accounts;


const main = async () => {

  const client = await getClient(accountOne);

  console.log("balance: ", (await getBalance(client, accountOne)).toString());

  const keyList = await createKeyList(accountOne, accountTwo, accountThree)
  console.log("Key list created: ", keyList)
  const multiSignatureAccId = await createMultiSigAccount(client, keyList);
  console.log('\nThe Multi Signature Account ID is: ' + multiSignatureAccId);
  let accountBalance = await getBalance(client, accountFour);
  console.log("Account 4 balance (Initial value): ", accountFour.accountID)

  await transferHbars(client, multiSignatureAccId, accountFour, accountOne, accountTwo)
  accountBalance = await getBalance(client, accountFour);
  console.log("Account 4 balance (After Transfer): ", accountFour.accountID)

  process.exit()
}

main()