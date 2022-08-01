const ethers = require("ethers")
const fs = require("fs")
require("dotenv").config()

async function main() {
    const provider = new ethers.providers.JsonRpcProvider(
        process.env.RPC_URL // ganache (local) - alchemy (testnet)
    )

    // encrypted Private Key JSON
    // const encryptedJsonKey = fs.readFileSync("./.encryptedKey.json")
    // let wallet = new ethers.Wallet.fromEncryptedJsonSync(
    //     encryptedJsonKey,
    //     process.env.KEY_PASSWORD
    // )
    // wallet = wallet.connect(provider)

    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider) // signer

    const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf8") // import abi file
    const binary = fs.readFileSync(
        "./SimpleStorage_sol_SimpleStorage.bin",
        "utf8"
    ) // import bin file

    const contractFactory = new ethers.ContractFactory(abi, binary, wallet)
    console.log("Deploying...")
    const contract = await contractFactory.deploy()
    const deploymentReceipt = await contract.deployTransaction.wait(1)

    // console.log("Transaction Receipt:");
    // console.log(contract.deployTransaction); // txn sent
    // console.log("Deployment Receipt:");
    // console.log(deploymentReceipt); // after txn finishes - contract created!
    console.log(`Deployed to: ${contract.address}`)

    // raw transactions
    // const nonce = wallet.getTransactionCount();
    // const tx = {
    //   nonce: nonce,
    //   gasLimit: 6721975,
    //   gasPrice: 20000000000,
    //   chainId: 1337,
    //   to: null,
    //   value: 0,
    //   data: "", // add bytecode! 0x... thing!
    // };

    // const sentTxResponse = await wallet.sendTransaction(tx);
    // await sentTxResponse.wait(1);
    // console.log(sentTxResponse);

    const currentFavNum = await contract.retrieve() // call retrieve func
    console.log(`Current Favourite Number: ${currentFavNum.toString()}`)

    const transactionResponse = await contract.store("8") // call store func
    const transactionReceipt = await transactionResponse.wait(1)

    const updatedFavNum = await contract.retrieve() // call retrieve func
    console.log(`Updated Favourite Number: ${updatedFavNum.toString()}`)
}

main()
    .then(() => process.exit(0))
    .catch((err) => {
        console.log(err)
        process.exit(1)
    })
