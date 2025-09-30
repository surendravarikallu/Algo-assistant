export interface Template {
  id: string;
  name: string;
  description: string;
  code: string;
}

export const templates: Template[] = [
  {
    id: 'token',
    name: 'ASA Token Contract',
    description: 'A basic Algorand Standard Asset (ASA) token contract with transfer and clawback functionality.',
    code: `import algosdk from "algosdk";

// ASA Token Parameters
const tokenParams = {
  creator: "", // Creator address
  name: "MyToken",
  unitName: "MTK",
  totalSupply: 1000000,
  decimals: 6,
  defaultFrozen: false,
  url: "https://mytoken.com",
  clawbackAddress: undefined,
  freezeAddress: undefined,
  managerAddress: undefined,
  reserveAddress: undefined,
};

async function createASA(
  algodClient: algosdk.Algodv2,
  creator: algosdk.Account
) {
  try {
    const suggestedParams = await algodClient.getTransactionParams().do();
    
    const txn = algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
      from: creator.addr,
      total: tokenParams.totalSupply,
      decimals: tokenParams.decimals,
      assetName: tokenParams.name,
      unitName: tokenParams.unitName,
      assetURL: tokenParams.url,
      defaultFrozen: tokenParams.defaultFrozen,
      freeze: tokenParams.freezeAddress,
      manager: tokenParams.managerAddress,
      clawback: tokenParams.clawbackAddress,
      reserve: tokenParams.reserveAddress,
      suggestedParams,
    });

    const signedTxn = txn.signTxn(creator.sk);
    const { txId } = await algodClient.sendRawTransaction(signedTxn).do();
    
    await algosdk.waitForConfirmation(algodClient, txId, 4);
    const assetInfo = await algodClient.getAssetByID(assetId).do();
    
    return assetInfo;
  } catch (error) {
    console.error("Error creating ASA:", error);
    throw error;
  }
}`
  },
  {
    id: 'escrow',
    name: 'Escrow Contract',
    description: 'An escrow smart contract for secure transactions between two parties.',
    code: `import algosdk from "algosdk";

interface EscrowParams {
  sender: string;
  receiver: string;
  amount: number;
  timeout: number;
}

async function createEscrowContract(
  client: algosdk.Algodv2,
  params: EscrowParams
) {
  const suggestedParams = await client.getTransactionParams().do();
  
  // Escrow logic signature template
  const escrowLogic = new algosdk.LogicSigAccount([
    // version
    0x01,
    // txn type: pay
    0x01,
    // sender
    ...algosdk.decodeAddress(params.sender).publicKey,
    // receiver
    ...algosdk.decodeAddress(params.receiver).publicKey,
    // amount
    ...algosdk.encodeUint64(params.amount),
    // timeout
    ...algosdk.encodeUint64(params.timeout)
  ]);

  const escrowAddress = escrowLogic.address();
  
  // Fund escrow account
  const fundingTxn = algosdk.makePaymentTxnWithSuggestedParams(
    params.sender,
    escrowAddress,
    params.amount,
    undefined,
    undefined,
    suggestedParams
  );

  return {
    escrowLogic,
    escrowAddress,
    fundingTxn
  };
}`
  },
  {
    id: 'nft',
    name: 'NFT Minting Contract',
    description: 'A contract for minting and managing Non-Fungible Tokens (NFTs) on Algorand.',
    code: `import algosdk from "algosdk";

interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  properties: Record<string, any>;
}

async function mintNFT(
  client: algosdk.Algodv2,
  creator: algosdk.Account,
  metadata: NFTMetadata
) {
  try {
    const suggestedParams = await client.getTransactionParams().do();

    const txn = algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
      from: creator.addr,
      total: 1, // NFTs have total supply of 1
      decimals: 0, // NFTs have 0 decimals
      assetName: metadata.name,
      unitName: "NFT",
      assetURL: metadata.image,
      defaultFrozen: false,
      freeze: undefined,
      manager: creator.addr,
      clawback: undefined,
      reserve: undefined,
      suggestedParams,
      // Store metadata as note
      note: new TextEncoder().encode(JSON.stringify(metadata))
    });

    const signedTxn = txn.signTxn(creator.sk);
    const { txId } = await client.sendRawTransaction(signedTxn).do();
    
    await algosdk.waitForConfirmation(client, txId, 4);
    const assetInfo = await client.getAssetByID(assetId).do();
    
    return {
      assetId: assetInfo.index,
      txId,
      metadata
    };
  } catch (error) {
    console.error("Error minting NFT:", error);
    throw error;
  }
}`
  }
];