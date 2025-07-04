# LaunchpadSDK

A TypeScript SDK for creating and managing NFT launchpads on the Sui blockchain.

## Table of Contents

- [Installation](#installation)
- [Prerequisites](#prerequisites)
<!-- - [Quick Start](#quick-start) -->
<!-- - [API Reference](#api-reference) -->
- [Examples](#examples)
<!-- - [Error Handling](#error-handling) -->
<!-- - [Transaction Execution](#transaction-execution) -->

## Installation

```bash
npm install @mysten/sui axios
# Add your SDK package here
```

## Prerequisites

Before using the LaunchpadSDK, ensure you have:

1. **Deployed NFT Contract**: Your NFT contract must be deployed on the Sui network
2. **NFT Type**: Get the full type format: `PACKAGE_ID::MODULE_NAME::STRUCT_NAME`

## Quick Start

```typescript
import { launchpadSDK } from "./client";
import { SuiClient } from "@mysten/sui/client";
import { Transaction } from "@mysten/sui/transactions";

// Initialize SDK and client
const sdk = new launchpadSDK();
const client = new SuiClient({ url: "https://fullnode.mainnet.sui.io" });

// Your NFT type
const nftType = "YOUR_PACKAGE_ID::YOUR_MODULE_NAME::YOUR_STRUCT_NAME";
```

## API Reference

### Core Functions

#### `setupLaunchpad(args: SetupLaunchArgs): Promise<Transaction>`
Creates a new LaunchId for your NFTs on the launchpad.

#### `getLaunchpadData(nftType: string): Promise<LaunchpadData>`
Retrieves details of an existing launchpad collection.

#### `setupWhitelist(args: SetupWhitelistArgs): Promise<Transaction>`
Sets up whitelist addresses and allocations (must be called after setupLaunchpad).

#### `mint(args: MintArgs): Promise<Transaction>`
Mints/create NFTs from your collection and return them as Arguments.

#### `withdraw(args: WithdrawArgs): Promise<Transaction>`
Withdraws accumulated SUI tokens from the launchpad.

## Examples

### 1. Setting up a New Launchpad Collection

```typescript
import { Transaction } from "@mysten/sui/transactions";
import { launchpadSDK } from "./client";
import { SuiClient } from "@mysten/sui/client";
import type { SetupLaunchArgs } from "./type";

async function createLaunchpad() {
    const sdk = new launchpadSDK();
    const client = new SuiClient({ url: "https://fullnode.mainnet.sui.io" });
    const tx = new Transaction();

    const nftType = "YOUR_PACKAGE_ID::YOUR_MODULE_NAME::YOUR_STRUCT_NAME";

    const setupArgs: SetupLaunchArgs = {
        publisher: "0x...", // Your publisher object ID
        name: "My Awesome Collection",
        description: "A collection of awesome NFTs.",
        supply: 1000,
        price: 1000000000, // Price in MIST (1 SUI)
        is_kiosk: true,
        start_timestamp_ms: Date.now() + 60 * 1000 * 5, // 5 minutes from now
        max_items_per_address: 5,
        whitelist: {
            price: 500000000, // Whitelist price in MIST
            supply: 200,
            time: Date.now() + 60 * 1000, // Whitelist starts 1 minute from now
        },
        custom_phase: undefined,
        type: nftType,
        tx: tx,
    };

    try {
        const resultTx = await sdk.setupLaunchpad(setupArgs);
        console.log("Transaction block created:", resultTx.serialize());
        
        // Execute transaction with mutation handling
        const result = await executeTransaction(resultTx, client);
        console.log("Setup Launchpad Transaction executed:", result);
        
        return result;
    } catch (error) {
        console.error("Error setting up launchpad:", error);
        throw error;
    }
}
```

### 2. Retrieving Launchpad Collection Data

```typescript
async function retrieveLaunchpadData() {
    const sdk = new launchpadSDK();
    const nftType = "YOUR_PACKAGE_ID::YOUR_MODULE_NAME::YOUR_STRUCT_NAME";

    try {
        const launchpadData = await sdk.getLaunchpadData(nftType);
        console.log("Launchpad Collection Data:", launchpadData);
        
        // Extract important IDs for future operations
        const { launchCollectionId, creatorCapId } = launchpadData;
        
        if (!launchCollectionId || !creatorCapId) {
            throw new Error("Missing required launchpad data fields");
        }
        
        return { launchCollectionId, creatorCapId, launchpadData };
    } catch (error) {
        console.error("Error retrieving launchpad data:", error);
        throw error;
    }
}
```

### 3. Setting Up Whitelist

```typescript
async function setupWhitelistExample(
    launchCollectionId: string,
    creatorCapId: string,
) {
    const sdk = new launchpadSDK();
    const client = new SuiClient({ url: "https://fullnode.mainnet.sui.io" });
    const tx = new Transaction();

    const addressesToWhitelist = ["0x...", "0x..."];
    const allocationsForAddresses = [1, 2];

    try {
        const resultTx = await sdk.setupWhitelist({
            launchCollectionId,
            creatorCap: creatorCapId,
            addresses: addressesToWhitelist,
            allocations: allocationsForAddresses,
            tx,
        });
        
        console.log("Whitelist transaction created:", resultTx.serialize());
        
        // Execute transaction with mutation handling
        const result = await executeTransaction(resultTx, client);
        console.log("Setup Whitelist Transaction executed:", result);
        
        return result;
    } catch (error) {
        console.error("Error setting up whitelist:", error);
        throw error;
    }
}
```

### 4. Minting NFTs

```typescript
async function mintExample(
    launchCollectionId: string,
    nftType: string,
) {
    const sdk = new launchpadSDK();
    const client = new SuiClient({ url: "https://fullnode.mainnet.sui.io" });
    const tx = new Transaction();

    // Pre-created NFT object IDs
    const preCreatedNftObjectIds = ["0xnft_obj_id_1", "0xnft_obj_id_2"];
    
    // SUI payment coin object IDs
    const suiPaymentCoinObjectIds = ["0xsui_coin_id_1"];

    try {
        const resultTx = await sdk.mint({
            launchCollectionId,
            Nfts: preCreatedNftObjectIds,
            suiTokens: suiPaymentCoinObjectIds,
            type: nftType,
            tx,
        });
        
        console.log("Mint transaction created:", resultTx.serialize());
        
        // Execute transaction with mutation handling
        const result = await executeTransaction(resultTx, client);
        console.log("Mint Transaction executed:", result);
        
        return result;
    } catch (error) {
        console.error("Error minting NFTs:", error);
        throw error;
    }
}
```

### 5. Withdrawing SUI Tokens

```typescript
async function withdrawExample(
    launchCollectionId: string,
    creatorCapId: string,
) {
    const sdk = new launchpadSDK();
    const client = new SuiClient({ url: "https://fullnode.mainnet.sui.io" });
    const tx = new Transaction();

    try {
        const resultTx = await sdk.withdraw({
            launchCollectionId,
            creatorCap: creatorCapId,
            tx,
        });
        
        console.log("Withdraw transaction created:", resultTx.serialize());
        
        // Execute transaction with mutation handling
        const result = await executeTransaction(resultTx, client);
        console.log("Withdraw Transaction executed:", result);
        
        return result;
    } catch (error) {
        console.error("Error withdrawing SUI:", error);
        throw error;
    }
}
```

## Transaction Execution

### Complete Transaction Execution with Mutation Handling

```typescript
import { SuiClient } from "@mysten/sui/client";
import { Transaction } from "@mysten/sui/transactions";
import { SuiTransactionResponse } from "@mysten/sui/client";

// Transaction execution utility with mutation handling
async function executeTransaction(
    transactionBlock: Transaction,
    client: SuiClient,
    wallet?: any // Your wallet instance
): Promise<SuiTransactionResponse> {
    try {
        if (!wallet) {
            throw new Error("Wallet is required for transaction execution");
        }

        console.log("Signing transaction...");
        const signedTx = await wallet.signTransaction({ 
            transactionBlock 
        });

        console.log("Executing transaction...");
        const response = await client.executeTransaction({
            transactionBlock: signedTx.transactionBlockBytes,
            signature: signedTx.signature,
            options: { 
                showEffects: true,
                showEvents: true,
                showObjectChanges: true,
                showBalanceChanges: true,
            },
        });

        console.log("Transaction executed successfully:", response.digest);
        
        // Handle transaction mutations
        await handleTransactionMutations(response, client);
        
        return response;
    } catch (error) {
        console.error("Transaction execution failed:", error);
        throw error;
    }
}

// Mutation handling for finalized transactions
async function handleTransactionMutations(
    response: SuiTransactionResponse,
    client: SuiClient
) {
    try {
        // Check if transaction was successful
        if (response.effects?.status?.status !== "success") {
            console.error("Transaction failed:", response.effects?.status?.error);
            return;
        }

        console.log("🎉 Transaction finalized successfully!");
        console.log("Transaction digest:", response.digest);

        // Handle object changes (mutations)
        if (response.objectChanges) {
            console.log("📋 Object Changes:");
            response.objectChanges.forEach((change, index) => {
                console.log(`  ${index + 1}. Type: ${change.type}`);
                
                if (change.type === "created") {
                    console.log(`     🆕 Created object: ${change.objectId}`);
                    console.log(`     📦 Object type: ${change.objectType}`);
                }
                
                if (change.type === "mutated") {
                    console.log(`     🔄 Mutated object: ${change.objectId}`);
                    console.log(`     📦 Object type: ${change.objectType}`);
                }
                
                if (change.type === "deleted") {
                    console.log(`     🗑️ Deleted object: ${change.objectId}`);
                }
            });
        }

        // Handle balance changes
        if (response.balanceChanges) {
            console.log("💰 Balance Changes:");
            response.balanceChanges.forEach((change, index) => {
                console.log(`  ${index + 1}. Owner: ${change.owner}`);
                console.log(`     Amount: ${change.amount}`);
                console.log(`     Coin Type: ${change.coinType}`);
            });
        }

        // Handle events
        if (response.events) {
            console.log("📡 Events Emitted:");
            response.events.forEach((event, index) => {
                console.log(`  ${index + 1}. Type: ${event.type}`);
                console.log(`     Parsed JSON:`, event.parsedJson);
            });
        }

        // Additional mutation handling based on transaction type
        await handleSpecificMutations(response, client);

    } catch (error) {
        console.error("Error handling transaction mutations:", error);
    }
}

// Handle specific mutations based on transaction type
async function handleSpecificMutations(
    response: SuiTransactionResponse,
    client: SuiClient
) {
    try {
        // Extract created objects that might be launchpad collections
        const createdObjects = response.objectChanges?.filter(
            change => change.type === "created"
        );

        if (createdObjects && createdObjects.length > 0) {
            console.log("🔍 Analyzing created objects...");
            
            for (const obj of createdObjects) {
                if (obj.type === "created") {
                    // Check if this is a launchpad collection
                    if (obj.objectType.includes("LaunchpadCollection")) {
                        console.log("🚀 New LaunchpadCollection created!");
                        console.log("   Collection ID:", obj.objectId);
                        
                        // Store the collection ID for future use
                        await storeLaunchpadCollectionId(obj.objectId);
                    }
                    
                    // Check if this is a creator capability
                    if (obj.objectType.includes("CreatorCap")) {
                        console.log("👑 Creator capability created!");
                        console.log("   Creator Cap ID:", obj.objectId);
                        
                        // Store the creator cap ID for future use
                        await storeCreatorCapId(obj.objectId);
                    }
                }
            }
        }

        // Handle minted NFTs
        const mintedNFTs = response.events?.filter(
            event => event.type.includes("MintEvent")
        );

        if (mintedNFTs && mintedNFTs.length > 0) {
            console.log("🎨 NFTs minted successfully!");
            mintedNFTs.forEach((event, index) => {
                console.log(`   ${index + 1}. Event:`, event.parsedJson);
            });
        }

    } catch (error) {
        console.error("Error handling specific mutations:", error);
    }
}

// Utility functions for storing important IDs
async function storeLaunchpadCollectionId(collectionId: string) {
    // Store in your preferred storage (database, localStorage, etc.)
    console.log("📝 Storing launchpad collection ID:", collectionId);
    // Implementation depends on your storage solution
}

async function storeCreatorCapId(creatorCapId: string) {
    // Store in your preferred storage (database, localStorage, etc.)
    console.log("📝 Storing creator cap ID:", creatorCapId);
    // Implementation depends on your storage solution
}
```

## Error Handling

```typescript
// Comprehensive error handling wrapper
async function safeExecuteTransaction(
    transactionFn: () => Promise<Transaction>,
    client: SuiClient,
    wallet: any,
    operationName: string
) {
    try {
        const tx = await transactionFn();
        const result = await executeTransaction(tx, client, wallet);
        console.log(`✅ ${operationName} completed successfully`);
        return result;
    } catch (error) {
        console.error(`❌ ${operationName} failed:`, error);
        
        // Handle specific error types
        if (error instanceof Error) {
            if (error.message.includes("Insufficient funds")) {
                console.error("💸 Insufficient funds for transaction");
            } else if (error.message.includes("Object not found")) {
                console.error("🔍 Required object not found");
            } else if (error.message.includes("Transaction rejected")) {
                console.error("🚫 Transaction was rejected");
            }
        }
        
        throw error;
    }
}

// Usage example
async function safeMint() {
    const client = new SuiClient({ url: "https://fullnode.mainnet.sui.io" });
    
    await safeExecuteTransaction(
        () => sdk.mint({ /* mint args */ }),
        client,
        wallet,
        "NFT Minting"
    );
}
```

## Complete Workflow Example

```typescript
async function completeWorkflow() {
    const sdk = new launchpadSDK();
    const client = new SuiClient({ url: "https://fullnode.mainnet.sui.io" });
    const nftType = "YOUR_PACKAGE_ID::YOUR_MODULE_NAME::YOUR_STRUCT_NAME";

    try {
        // Step 1: Setup launchpad
        console.log("🚀 Setting up launchpad...");
        await createLaunchpad();

        // Step 2: Retrieve launchpad data
        console.log("📊 Retrieving launchpad data...");
        const { launchCollectionId, creatorCapId } = await retrieveLaunchpadData();

        // Step 3: Setup whitelist
        console.log("📋 Setting up whitelist...");
        await setupWhitelistExample(launchCollectionId, creatorCapId);

        // Step 4: Mint NFTs
        console.log("🎨 Minting NFTs...");
        await mintExample(launchCollectionId, nftType);

        // Step 5: Withdraw funds
        console.log("💰 Withdrawing funds...");
        await withdrawExample(launchCollectionId, creatorCapId);

        console.log("✅ Complete workflow executed successfully!");

    } catch (error) {
        console.error("❌ Workflow failed:", error);
    }
}
```
