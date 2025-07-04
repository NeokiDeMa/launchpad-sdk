# LaunchpadSDK

A TypeScript SDK for creating and managing NFT launchpads on the Sui blockchain.

## Table of Contents

- [Installation](#installation)
- [Prerequisites](#prerequisites)
- [Examples](#examples)

## Installation

```bash
npm install @hokko_io/launchpad @mysten/sui axios
```

## Prerequisites

Before using the LaunchpadSDK, ensure you have:

1. **Deployed NFT Contract**: Your NFT contract must be deployed on the Sui network
2. **NFT Type**: Get the full type format: `PACKAGE_ID::MODULE_NAME::STRUCT_NAME`

## Quick Start

```typescript
import { LaunchpadSDK } from "./client";
import { SuiClient } from "@mysten/sui/client";
import { Transaction } from "@mysten/sui/transactions";

// Initialize SDK and client
const sdk = new LaunchpadSDK();
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
Withdraws accumulated SUI tokens from the launchpad and sends to the caller.

## Examples

### 1. Setting up a New Launchpad Collection

```typescript
import { Transaction } from "@mysten/sui/transactions";
import { LaunchpadSDK } from "./client";
import { SuiClient } from "@mysten/sui/client";
import type { SetupLaunchArgs } from "./type";

async function createLaunchpad() {
    const sdk = new LaunchpadSDK();
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
        client.executeTransactionBlock({
            signature, 
            transactionBlock: resultTx
        })
    } catch (error) {
        console.error("Error setting up launchpad:", error);
        throw error;
    }
}
```

### 2. Retrieving Launchpad Collection Data

```typescript
async function retrieveLaunchpadData() {
    const sdk = new LaunchpadSDK();
    const nftType = "YOUR_PACKAGE_ID::YOUR_MODULE_NAME::YOUR_STRUCT_NAME";

    try {
        const launchpadData = await sdk.getLaunchpadData(nftType);
        console.log("Launchpad Collection Data:", launchpadData);
        
        // Extract important IDs for future operations
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
    const sdk = new LaunchpadSDK();
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
              
        // Execute transaction with mutation handling
      client.executeTransactionBlock({
        signature, 
        transactionBlock: resultTx
      })
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
    const sdk = new LaunchpadSDK();
    const client = new SuiClient({ url: "https://fullnode.mainnet.sui.io" });
    const tx = new Transaction();

    // Exapmle of a NFT creating call
    const [nft] = tx.moveCall({
        target: 'YOUR_PACKAGE_ID::YOUR_MODULE_NAME::create_nft',
        arguments: [
            tx.pure("My NFT Name"),
            tx.pure("My NFT Description"),
            tx.pure("https://example.com/nft-image.png"),
        ],
        typeArguments: [ nftType ],
    })

    const [coin] = tx.splitCoins(
        tx.gas,
        [tx.pure(1000000000)] // Split 1 SUI (1,000,000,000 MIST)
    );

    try {
        const resultTx = await sdk.mint({
            launchCollectionId,
            Nfts: [nft],
            suiTokens: [coin],
            type: nftType,
            tx,
        });
        
        
        // Execute transaction with mutation handling
      client.executeTransactionBlock({
        signature, 
        transactionBlock: resultTx
      })
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
    const sdk = new LaunchpadSDK();
    const client = new SuiClient({ url: "https://fullnode.mainnet.sui.io" });
    const tx = new Transaction();

    try {
        // This returns the transaction
        // The Sui token is sent automaticlly to the caller with the creator cap
        const resultTx = await sdk.withdraw({
            launchCollectionId,
            creatorCap: creatorCapId,
            tx,
        });
              
        // Execute transaction with mutation handling
        
      client.executeTransactionBlock({
        signature, 
        transactionBlock: resultTx
      })
    } catch (error) {
        console.error("Error withdrawing SUI:", error);
        throw error;
    }
}
```

