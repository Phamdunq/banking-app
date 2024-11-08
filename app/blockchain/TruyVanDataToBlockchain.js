const { Wallets, Gateway } = require("fabric-network");
const fs = require('fs');
async function queryDataFromBlockchain(idSignature, signature, customerId,) {
<<<<<<< HEAD
    const ccpPath = 'home/dunq/fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/connection-org1.json';
=======
    const ccpPath = '/home/dunq/fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/connection-org1.json';
>>>>>>> f88d99060d4d66184072a8799e6f4be420e2a272
    const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

    const wallet = await Wallets.newInMemoryWallet();
    await wallet.put(idSignature, signature);

    const gateway = new Gateway();
    await gateway.connect(ccp, {wallet, identity: idSignature, discovery: {enabled: true, asLocalhost: true}});

    const channel = await gateway.getNetwork('mychannel');

    const chaincode = await channel.getContract('fabcar');

    await chaincode.evaluateTransaction('getCustomer', customerId);


}

module.exports = {
    queryDataFromBlockchain
}