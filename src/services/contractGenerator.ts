import { AIService } from './aiService';

interface ContractGenerationOptions {
  type: 'asa' | 'app' | 'nft';
  name: string;
  description: string;
  parameters?: Record<string, any>;
}

interface CodeOutput {
  typescript: string;
  python: string;
}

export class ContractGenerator {
  private readonly API_DELAY = 2000; // Reduced to 2 seconds
  private aiService: AIService;

  constructor() {
    this.aiService = new AIService();
  }

  async *generateContractStream(prompt: string): AsyncGenerator<CodeOutput> {
    try {
      // Add artificial delay for better UX
      await new Promise(resolve => setTimeout(resolve, this.API_DELAY));

      // Generate code using AI
      const code = await this.aiService.generateCode(prompt);
      
      // Split TypeScript code into lines
      const tsLines = code.typescript.split('\n');
      
      // Yield TypeScript code line by line
      for (let i = 0; i < tsLines.length; i++) {
        yield {
          typescript: tsLines[i] + '\n',
          python: ''
        };
        
        // Add a small delay between lines for typing effect
        await new Promise(resolve => setTimeout(resolve, 50));
      }

      // Add a delay before showing Python code
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Split Python code into lines
      const pyLines = code.python.split('\n');
      
      // Yield Python code line by line
      for (let i = 0; i < pyLines.length; i++) {
        yield {
          typescript: '',
          python: pyLines[i] + '\n'
        };
        
        // Add a small delay between lines for typing effect
        await new Promise(resolve => setTimeout(resolve, 50));
      }
    } catch (error) {
      console.error('Error generating contract:', error);
      throw error;
    }
  }

  private async generateContract(options: ContractGenerationOptions): Promise<CodeOutput> {
    switch (options.type) {
      case 'asa':
        return this.generateASAContract(options);
      case 'app':
        return this.generateAppContract(options);
      case 'nft':
        return this.generateNFTContract(options);
      default:
        throw new Error('Unsupported contract type');
    }
  }

  private validateOptions(options: ContractGenerationOptions): void {
    if (!options.name || options.name.length < 3) {
      throw new Error('Contract name must be at least 3 characters long');
    }
    if (options.type === 'asa' && (!options.parameters?.totalSupply || options.parameters.totalSupply <= 0)) {
      throw new Error('ASA must have a positive total supply');
    }
  }

  private parsePrompt(prompt: string): ContractGenerationOptions {
    // Enhanced prompt parsing logic
    const lowerPrompt = prompt.toLowerCase();
    
    // Extract name from prompt if possible
    const nameMatch = prompt.match(/called "([^"]+)"/i) || prompt.match(/named "([^"]+)"/i);
    const name = nameMatch ? nameMatch[1] : 'MyContract';
    
    // Extract supply if mentioned
    const supplyMatch = prompt.match(/(\d+)\s*(?:million|thousand)?\s*supply/i);
    const supply = supplyMatch ? parseInt(supplyMatch[1]) * (supplyMatch[0].includes('million') ? 1000000 : 1000) : 1000000;
    
    if (lowerPrompt.includes('token') || lowerPrompt.includes('asa')) {
      return {
        type: 'asa',
        name,
        description: 'Algorand Standard Asset',
        parameters: {
          totalSupply: supply,
          decimals: 6,
        }
      };
    } else if (lowerPrompt.includes('nft')) {
      return {
        type: 'nft',
        name,
        description: 'Non-Fungible Token',
        parameters: {
          totalSupply: 1,
          decimals: 0,
        }
      };
    } else {
      return {
        type: 'app',
        name,
        description: 'Smart Contract Application',
        parameters: {}
      };
    }
  }

  private generateASAContract(options: ContractGenerationOptions): CodeOutput {
    const unitName = options.name.slice(0, 4);
    const totalSupply = options.parameters?.totalSupply || 1000000;
    const decimals = options.parameters?.decimals || 6;

    return {
      typescript: `import algosdk from "algosdk";

// ASA Token Parameters
const tokenParams = {
  creator: "", // Creator address
  name: "${options.name}",
  unitName: "${unitName}",
  totalSupply: ${totalSupply},
  decimals: ${decimals},
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
    const assetInfo = await algodClient.getAssetByID(txId).do();
    
    return assetInfo;
  } catch (error) {
    console.error("Error creating ASA:", error);
    throw error;
  }
}`,
      python: `from algosdk import account, algod, mnemonic
from algosdk.v2client import algod
from algosdk.future.transaction import AssetConfigTxn
import json

# ASA Token Parameters
token_params = {
    "creator": "",  # Creator address
    "name": "${options.name}",
    "unit_name": "${unitName}",
    "total_supply": ${totalSupply},
    "decimals": ${decimals},
    "default_frozen": False,
    "url": "https://mytoken.com",
    "clawback_address": None,
    "freeze_address": None,
    "manager_address": None,
    "reserve_address": None
}

def create_asa(algod_client, creator_private_key):
    try:
        # Get network parameters
        params = algod_client.suggested_params()
        
        # Create the asset
        txn = AssetConfigTxn(
            sender=creator_private_key,
            sp=params,
            total=token_params["total_supply"],
            default_frozen=token_params["default_frozen"],
            unit_name=token_params["unit_name"],
            asset_name=token_params["name"],
            manager=token_params["manager_address"],
            reserve=token_params["reserve_address"],
            freeze=token_params["freeze_address"],
            clawback=token_params["clawback_address"],
            url=token_params["url"],
            decimals=token_params["decimals"]
        )
        
        # Sign and send the transaction
        signed_txn = txn.sign(creator_private_key)
        tx_id = algod_client.send_transaction(signed_txn)
        
        # Wait for confirmation
        confirmed_txn = wait_for_confirmation(algod_client, tx_id, 4)
        asset_info = algod_client.asset_info(confirmed_txn["asset-index"])
        
        return asset_info
    except Exception as e:
        print(f"Error creating ASA: {e}")
        raise e`
    };
  }

  private generateAppContract(options: ContractGenerationOptions): CodeOutput {
    return {
      typescript: `import algosdk from "algosdk";

interface VotingState {
  proposalCount: number;
  proposals: Record<number, {
    title: string;
    description: string;
    votes: number;
    endTime: number;
    status: 'active' | 'ended';
  }>;
}

async function create${options.name}VotingApp(
  algodClient: algosdk.Algodv2,
  creator: algosdk.Account
) {
  try {
    const suggestedParams = await algodClient.getTransactionParams().do();
    
    // Create the application
    const txn = algosdk.makeApplicationCreateTxnWithSuggestedParamsFromObject({
      from: creator.addr,
      suggestedParams,
      onComplete: algosdk.OnApplicationComplete.NoOpOC,
      approvalProgram: new Uint8Array([]), // Will be replaced with actual program
      clearProgram: new Uint8Array([]),    // Will be replaced with actual program
      globalInts: 1,  // For proposalCount
      globalBytes: 0,
      localInts: 0,
      localBytes: 0,
    });

    const signedTxn = txn.signTxn(creator.sk);
    const { txId } = await algodClient.sendRawTransaction(signedTxn).do();
    
    await algosdk.waitForConfirmation(algodClient, txId, 4);
    return txId;
  } catch (error) {
    console.error("Error creating voting app:", error);
    throw error;
  }
}

async function createProposal(
  client: algosdk.Algodv2,
  appId: number,
  sender: algosdk.Account,
  title: string,
  description: string,
  duration: number
) {
  try {
    const suggestedParams = await client.getTransactionParams().do();
    
    const txn = algosdk.makeApplicationNoOpTxnWithSuggestedParamsFromObject({
      from: sender.addr,
      appIndex: appId,
      appArgs: [
        new TextEncoder().encode("create_proposal"),
        new TextEncoder().encode(title),
        new TextEncoder().encode(description),
        algosdk.encodeUint64(duration)
      ],
      suggestedParams,
    });

    const signedTxn = txn.signTxn(sender.sk);
    const { txId } = await client.sendRawTransaction(signedTxn).do();
    
    await algosdk.waitForConfirmation(client, txId, 4);
    return txId;
  } catch (error) {
    console.error("Error creating proposal:", error);
    throw error;
  }
}

async function vote(
  client: algosdk.Algodv2,
  appId: number,
  voter: algosdk.Account,
  proposalId: number
) {
  try {
    const suggestedParams = await client.getTransactionParams().do();
    
    const txn = algosdk.makeApplicationNoOpTxnWithSuggestedParamsFromObject({
      from: voter.addr,
      appIndex: appId,
      appArgs: [
        new TextEncoder().encode("vote"),
        algosdk.encodeUint64(proposalId)
      ],
      suggestedParams,
    });

    const signedTxn = txn.signTxn(voter.sk);
    const { txId } = await client.sendRawTransaction(signedTxn).do();
    
    await algosdk.waitForConfirmation(client, txId, 4);
    return txId;
  } catch (error) {
    console.error("Error voting:", error);
    throw error;
  }
}`,
      python: `from algosdk import account, algod, mnemonic
from algosdk.v2client import algod
from algosdk.future.transaction import ApplicationCreateTxn, ApplicationNoOpTxn
from typing import Dict, Any
import json

class VotingState:
    def __init__(self):
        self.proposal_count = 0
        self.proposals: Dict[int, Dict[str, Any]] = {}

def create_voting_app(algod_client, creator_private_key):
    try:
        # Get network parameters
        params = algod_client.suggested_params()
        
        # Create the application
        txn = ApplicationCreateTxn(
            sender=creator_private_key,
            sp=params,
            on_complete=0,  # NoOp
            approval_program=b"",  # Will be replaced with actual program
            clear_program=b"",     # Will be replaced with actual program
            global_schema=1,       # For proposal_count
            local_schema=0
        )
        
        # Sign and send the transaction
        signed_txn = txn.sign(creator_private_key)
        tx_id = algod_client.send_transaction(signed_txn)
        
        # Wait for confirmation
        confirmed_txn = wait_for_confirmation(algod_client, tx_id, 4)
        return confirmed_txn["tx"]
    except Exception as e:
        print(f"Error creating voting app: {e}")
        raise e

def create_proposal(algod_client, app_id, sender_private_key, title: str, description: str, duration: int):
    try:
        # Get network parameters
        params = algod_client.suggested_params()
        
        # Create the proposal
        txn = ApplicationNoOpTxn(
            sender=sender_private_key,
            sp=params,
            index=app_id,
            app_args=[
                b"create_proposal",
                title.encode(),
                description.encode(),
                duration
            ]
        )
        
        # Sign and send the transaction
        signed_txn = txn.sign(sender_private_key)
        tx_id = algod_client.send_transaction(signed_txn)
        
        # Wait for confirmation
        confirmed_txn = wait_for_confirmation(algod_client, tx_id, 4)
        return confirmed_txn["tx"]
    except Exception as e:
        print(f"Error creating proposal: {e}")
        raise e

def vote(algod_client, app_id, voter_private_key, proposal_id: int):
    try:
        # Get network parameters
        params = algod_client.suggested_params()
        
        # Submit the vote
        txn = ApplicationNoOpTxn(
            sender=voter_private_key,
            sp=params,
            index=app_id,
            app_args=[
                b"vote",
                proposal_id
            ]
        )
        
        # Sign and send the transaction
        signed_txn = txn.sign(voter_private_key)
        tx_id = algod_client.send_transaction(signed_txn)
        
        # Wait for confirmation
        confirmed_txn = wait_for_confirmation(algod_client, tx_id, 4)
        return confirmed_txn["tx"]
    except Exception as e:
        print(f"Error voting: {e}")
        raise e`
    };
  }

  private generateNFTContract(options: ContractGenerationOptions): CodeOutput {
    return {
      typescript: `import algosdk from "algosdk";

interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  properties: Record<string, any>;
}

async function mint${options.name}NFT(
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
    const assetInfo = await client.getAssetByID(txId).do();
    
    return {
      assetId: assetInfo.index,
      txId,
      metadata
    };
  } catch (error) {
    console.error("Error minting NFT:", error);
    throw error;
  }
}`,
      python: `from algosdk import account, algod, mnemonic
from algosdk.v2client import algod
from algosdk.future.transaction import AssetConfigTxn
from typing import Dict, Any
import json

class NFTMetadata:
    def __init__(self, name: str, description: str, image: str, properties: Dict[str, Any]):
        self.name = name
        self.description = description
        self.image = image
        self.properties = properties

def mint_nft(algod_client, creator_private_key, metadata: NFTMetadata):
    try:
        # Get network parameters
        params = algod_client.suggested_params()
        
        # Create the NFT
        txn = AssetConfigTxn(
            sender=creator_private_key,
            sp=params,
            total=1,  # NFTs have total supply of 1
            decimals=0,  # NFTs have 0 decimals
            asset_name=metadata.name,
            unit_name="NFT",
            url=metadata.image,
            default_frozen=False,
            manager=creator_private_key,
            note=json.dumps(metadata.__dict__).encode()
        )
        
        # Sign and send the transaction
        signed_txn = txn.sign(creator_private_key)
        tx_id = algod_client.send_transaction(signed_txn)
        
        # Wait for confirmation
        confirmed_txn = wait_for_confirmation(algod_client, tx_id, 4)
        asset_info = algod_client.asset_info(confirmed_txn["asset-index"])
        
        return {
            "asset_id": asset_info["index"],
            "tx_id": tx_id,
            "metadata": metadata.__dict__
        }
    except Exception as e:
        print(f"Error minting NFT: {e}")
        raise e`
    };
  }
} 