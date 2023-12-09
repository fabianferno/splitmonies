const { ethers, network } = require("hardhat")
const { moveBlocks } = require("../utils/move-blocks")

async function balance() {
    const [deployer] = await ethers.getSigners()
    const carbonCredits = await ethers.getContract("CarbonCredits")
    const carboniumToken = await ethers.getContract("CarboniumToken")
    const liquidityPool = await ethers.getContract("LiquidityPool")

    // Log the balances before swapping.
    let userNFT = await carbonCredits.balanceOf(deployer.address, 1)
    console.log(`User ERC1155: ${userNFT}`)
    let userToken = await carboniumToken.balanceOf(deployer.address)
    console.log(`User ERC20: ${userToken}`)
    let poolNFT = await carbonCredits.balanceOf(liquidityPool.address, 1)
    console.log(`Pool ERC1155: ${poolNFT}`)
    let poolToken = await carboniumToken.balanceOf(liquidityPool.address)
    console.log(`Pool Balance: ${poolToken}`)

    console.log("--------------------------------------------------------------")
}

balance()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
