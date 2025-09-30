import algosdk from 'algosdk';
import { TEST_ACCOUNT, ALGOD_CONFIG } from './config/test-accounts';

// Initialize the Algorand client
const algodClient = new algosdk.Algodv2(
    ALGOD_CONFIG.token,
    ALGOD_CONFIG.server,
    ALGOD_CONFIG.port
);

async function testContract() {
    try {
        // Get the suggested parameters for the transaction
        const params = await algodClient.getTransactionParams().do();
        
        // Create a new ASA (Algorand Standard Asset)
        const txn = algosdk.makeAssetCreateTxnWithSuggestedParams(
            TEST_ACCOUNT.address, // Creator address
            "Test Asset Creation", // Note
            1000000, // Total supply
            6, // Decimals
            false, // Default frozen
            TEST_ACCOUNT.address, // Manager address
            TEST_ACCOUNT.address, // Reserve address
            TEST_ACCOUNT.address, // Freeze address
            TEST_ACCOUNT.address, // Clawback address
            "GameToken", // Asset name
            "GAME", // Unit name
            "https://your-asset-url.com", // Asset URL
            params,
            undefined, // Asset metadata hash
            undefined // Asset properties
        );

        // Sign the transaction
        const signedTxn = txn.signTxn(TEST_ACCOUNT.privateKey);

        // Submit the transaction
        const txId = await algodClient.sendRawTransaction(signedTxn).do();
        console.log("Transaction submitted with ID:", txId);

        // Wait for confirmation
        const confirmation = await algosdk.waitForConfirmation(algodClient, txId, 4);
        console.log("Transaction confirmed in round:", confirmation['confirmed-round']);

        // Get asset details
        const assetInfo = await algodClient.getAssetByID(confirmation['asset-index']).do();
        console.log("Asset created successfully:", assetInfo);

    } catch (error) {
        console.error("Error testing contract:", error);
    }
}

// Run the test
testContract(); 