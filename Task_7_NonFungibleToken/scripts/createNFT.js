

//Get accounts from accounts.json
import accounts from '../../Task_1_Account_Setup/accounts.json' assert { type: "json" };
import { getClient, createNft, getBalance, mintNft, transferNFTPrimary, transferNFTSecondary } from "../utils/nftUtils.js";
const [ accountOne, accountTwo, accountThree, accountFour, ...rest ] = accounts;


// const treasuryWallet = new Wallet(
//     accountId1,
//     privateKey1,
//     new LocalProvider()
// );

const client = await getClient(accountOne)


async function main() {
    const tokenId = await createNft(client, accountOne, accountTwo)
	// const tokenId = "0.0.3418449"
    console.log("TOKENID: ", tokenId.toString())
    let metadata = "NFT x";
    for (let i = 1; i <= 5; i++) {
        await mintNft(client, tokenId, accountOne, metadata);
    }

	const accountTwoInitBalance =  (await getBalance(client, accountTwo)).toString()
	console.log({accountTwoInitBalance});

	// primary sale
    await transferNFTPrimary(client, accountOne, accountThree, tokenId, 2)

	// secondary sale
    await transferNFTSecondary(client, accountThree, accountFour, tokenId, 2)

    // // await mintAndTransferNFT(client, myAccountId, myPrivateKey, adminUser, supplyUser)

	const accountTwoFinalBalance = (await getBalance(client, accountTwo)).toString()
	console.log({accountTwoFinalBalance});
    process.exit()
}

main()

// Create an NFT with Royalty. Show that the Royalty will be received on transfer.