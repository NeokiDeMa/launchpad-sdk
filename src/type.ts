import type { Transaction } from "@mysten/sui/transactions";

export interface SetupLaunchArgs {
	publisher: string;
	name: string;
	description: string;
	supply: number;
	price: number;
	is_kiosk: boolean;
	start_timestamp_ms: number;
	max_items_per_address: number;
	whitelist?: WhiteListArgs;
	custom_phase?: CustomPhaseArgs;
	type: string;
	tx: Transaction;
}

export interface WhiteListArgs {
	price: number | undefined;
	supply: number | undefined;
	time: number | undefined;
}
export interface CustomPhaseArgs {
	price: number | undefined;
	supply: number | undefined;
	time: number | undefined;
	name: string | undefined;
}

export interface MintArgs {
	launchCollectionId: string;
	Nfts: any[];
	suiTokens: any[];
	type: string;
	tx: Transaction;
}

export interface SetupWhiteistArgs {
	launchCollectionId: string;
	creatorCap: string;
	addresses: string[];
	allocations: number[];
	tx: Transaction;
}
export interface PauseArgs {
	launchCollectionId: string;
	creatorCap: string;
	tx: Transaction;
}

export interface NewStartTimeArgs {
	launchCollectionId: string;
	creatorCap: string;
	startStartTimeMs: number;
	whitelistStartTimeMs: number;
	customPhaseStartTimeMs: number;
	tx: Transaction;
}
