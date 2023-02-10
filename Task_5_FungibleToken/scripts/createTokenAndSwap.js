

//Get accounts from accounts.json
import accounts from '../../Task_1_Account_Setup/accounts.json' assert { type: "json" };
import { getClient, getTokenBalance, createFt, transferToken, swapTokens } from "../utils/ftUtils.js";
const [ accountOne, accountTwo, accountThree, accountFour, ...rest ] = accounts;


const client = await getClient(accountOne)


async function main() {
    const tokenOneId = await createFt(client, accountOne);
	const tokenTwoId = await createFt(client, accountOne);

	// transfer token one to account two
	await transferToken(client, accountOne, accountTwo, tokenOneId, 2000);

	// account two balance
	const accountTwoBalanceInitial = await getTokenBalance(client, accountTwo);
	console.log({accountTwoBalanceInitial});

	// transfer token two to account three
	await transferToken(client, accountOne, accountThree, tokenTwoId, 2000);

	// account three balance
	const accountThreeBalanceInitial = await getTokenBalance(client, accountThree);
	console.log({accountThreeBalanceInitial});

	// swap tokens between account two and account three
	await swapTokens(client, tokenOneId, tokenTwoId, accountTwo, accountThree, 1000);


	const accountTwoFinalBalance =  (await getTokenBalance(client, accountTwo)).toString()
	console.log({accountTwoFinalBalance});

    // // await mintAndTransferNFT(client, myAccountId, myPrivateKey, adminUser, supplyUser)

	const accountThreeFinalBalance = (await getTokenBalance(client, accountThree)).toString()
	console.log({accountThreeFinalBalance});
    process.exit()
}

main()