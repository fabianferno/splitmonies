const { network } = require("hardhat")
const { developmentChains, VERIFICATION_BLOCK_CONFIRMATIONS } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const waitBlockConfirmations = developmentChains.includes(network.name)
        ? 1
        : VERIFICATION_BLOCK_CONFIRMATIONS

    log("----------------------------------------------------")
    // const erc20Token = await deploy("SMToken", {
    //     from: deployer,
    //     args: [],
    //     log: true,
    //     waitConfirmations: waitBlockConfirmations,
    // })

    // const smTokenContract = await ethers.getContract("SMToken")

    await deploy("SplitMoney", {
        from: deployer,
        args: ["0x874069fa1eb16d44d622f2e0ca25eea172369bc1"],
        log: true,
        waitConfirmations: waitBlockConfirmations,
    })

    // Verify the deployment
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("Verifying...")
        await verify(basicNft.address, args)
    }
    log("----------------------------------------------------")
}

module.exports.tags = ["all", "splitMoney"]
