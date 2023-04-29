import { deployments, ethers, getNamedAccounts } from "hardhat"

async function main() {
    const { log } = deployments
    const { deployer } = await getNamedAccounts()

    const boxProxyAdmin = await ethers.getContract("BoxProxyAdmin")
    const transparentProxy = await ethers.getContract("BoxV1_Proxy")

    const proxyBoxV1 = await ethers.getContractAt("BoxV1", transparentProxy.address)
    const versionV1 = await proxyBoxV1.version()
    console.log(versionV1.toString())

    const boxV2 = await ethers.getContract("BoxV2")
    const upgradeTx = await boxProxyAdmin.upgrade(transparentProxy.address, boxV2.address)
    await upgradeTx.wait(1)

    const proxyBox = await ethers.getContractAt("BoxV2", transparentProxy.address)
    const version = await proxyBox.version()
    console.log(version.toString())
    log("----------------------------------------------------")
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
