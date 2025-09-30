import algosdk from 'algosdk';

// Generate a new test account
export const createTestAccount = () => {
    const account = algosdk.generateAccount();
    return {
        address: account.addr,
        privateKey: account.sk,
        mnemonic: algosdk.secretKeyToMnemonic(account.sk)
    };
};

// Create a test account
const testAccount = createTestAccount();

// Export the test account details
export const TEST_ACCOUNT = {
    address: testAccount.address,
    privateKey: testAccount.privateKey,
    mnemonic: testAccount.mnemonic
};

// Algorand API configuration for testnet
export const ALGOD_CONFIG = {
    server: 'https://testnet-api.algonode.cloud',
    port: 443,
    token: ''
};

// Print account details (only for development)
console.log('Test Account Address:', TEST_ACCOUNT.address);
console.log('Test Account Mnemonic:', TEST_ACCOUNT.mnemonic); 