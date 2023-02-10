

//Get accounts from accounts.json
import accounts from '../../Task_1_Account_Setup/accounts.json' assert { type: "json" };
import { getClient, getTokenBalance, createFt, transferToken, assocTokens, grantKyc } from "../utils/ftUtils.js";
const [ accountOne, accountTwo, accountThree, accountFour, ...rest ] = accounts;


const client = await getClient(accountOne)


async function main() {
    const tokenId = await createFt(client, accountOne, accountTwo);

	await assocTokens(client, tokenId, accountThree);

	// transfer token to account two
	await transferToken(client, accountOne, accountThree, tokenId, 1299);

	// grant kyc to account three
	await grantKyc(client, tokenId, accountTwo, accountThree)


	// transfer token to account two
	await transferToken(client, accountOne, accountThree, tokenId, 1299);

	const accountThreeBalance = (await getTokenBalance(client, accountThree)).toString()
	console.log({accountThreeBalance});
    process.exit()
}

main()