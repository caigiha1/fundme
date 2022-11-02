import { ethers, run, network } from "hardhat";

// async main
async function main() {
  const SimpleStorageFactory = await ethers.getContractFactory("SimpleStorage");
  console.log("Deploying contract...");
  const simpleStorage = await SimpleStorageFactory.deploy();
  await simpleStorage.deployed();

  console.log(`Deploy contract to: ${simpleStorage.address}`)

  if (network.config.chainId === 5 && process.env.ETHERSCAN_API_KEY) {
    await simpleStorage.deployTransaction.wait(6)

    await verify(simpleStorage.address, []);
  }

  const currentValue = await simpleStorage.retrieve()
  console.log(`Current Value is: ${currentValue}`)

  // Update the current value
  const transactionResponse = await simpleStorage.store(7)
  await transactionResponse.wait(1)
  const updatedValue = await simpleStorage.retrieve()
  console.log(`Update value is : ${updatedValue}`)
}

async function verify(contractAddress: string, args: any[]) {
  console.log("Verifying contract .....");
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArgs: args,
    })
  } catch (error: any) {
    if (error.message.toLowerCase().includes("already verified")) {
      console.log("Already Verified")
    } else {
      console.log(error)
    }
  }
}

// main

main().then(() => process.exit(0)).catch(error => {
  console.log(error);
  process.exit(1);
});