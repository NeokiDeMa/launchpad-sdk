// import type { SuiClient } from "@mysten/sui/client";
import type { Transaction } from "@mysten/sui/transactions";
import { Marketplace_findLaunchpadBySdk } from "../orval/src/marketplace/marketplace";
import type { LaunchpadCollection } from "../orval/src/model/launchpadCollection";
import { Call, LANCHPAD_PACKAGE_ID, Module, StaticObjects } from "./constants";
import type {
	CustomPhaseArgs,
	MintArgs,
	NewStartTimeArgs,
	PauseArgs,
	SetupLaunchArgs,
	SetupWhiteistArgs,
	WhiteListArgs,
} from "./types";

export class LaunchpadSDK {
	async getLaunchpadData(type: string): Promise<LaunchpadCollection> {
		try {
			const response = await Marketplace_findLaunchpadBySdk({ type });
			if (response.status !== 200) {
				throw new Error(
					`Error fetching launchpad data: ${response.statusText}`,
				);
			}
			return response.data;
		} catch (error) {
			console.error("Error fetching launchpad data:", error);
			throw error;
		}
	}
	/// @notice Call this only once per Collection
	async setupLaunchpad({
		publisher,
		name,
		description,
		supply,
		price,
		is_kiosk,
		start_timestamp_ms,
		max_items_per_address,
		whitelist,
		custom_phase,
		type,
		tx,
	}: SetupLaunchArgs): Promise<Transaction> {
		const whitelistData = this.preparePhaseData({
			price: whitelist?.price,
			supply: whitelist?.supply,
			time: whitelist?.time,
		});
		const customData = this.preparePhaseData({
			name: custom_phase?.name,
			price: custom_phase?.price,
			supply: custom_phase?.supply,
			time: custom_phase?.time,
		});

		tx.moveCall({
			target: `${LANCHPAD_PACKAGE_ID}::${Module}::${Call.new}`,
			arguments: [
				tx.object(StaticObjects.launchpad),
				tx.object(publisher),
				tx.object(StaticObjects.clock),
				tx.pure.string(name),
				tx.pure.string(description),
				tx.pure.u64(supply),
				tx.pure.u64(price),
				tx.pure.bool(is_kiosk),
				tx.pure.u64(start_timestamp_ms),
				tx.pure.u64(max_items_per_address),
				// Whitelist phase
				tx.pure.option("u64", whitelistData.price),
				tx.pure.option("u64", whitelistData.supply),
				tx.pure.option("u64", whitelistData.time),
				// Custom phase
				tx.pure.option("string", customData.name),
				tx.pure.option("u64", customData.price),
				tx.pure.option("u64", customData.supply),
				tx.pure.option("u64", customData.time),
			],
			typeArguments: [type],
		});
		return tx;
	}

	async setNewStartTime({
		launchCollectionId,
		creatorCap,
		startStartTimeMs,
		whitelistStartTimeMs,
		customPhaseStartTimeMs,
		tx,
	}: NewStartTimeArgs): Promise<Transaction> {
		tx.moveCall({
			target: `${LANCHPAD_PACKAGE_ID}::${Module}::${Call.setStartTime}`,
			arguments: [
				tx.object(launchCollectionId),
				tx.object(creatorCap),
				tx.pure.u64(startStartTimeMs),
				tx.pure.u64(whitelistStartTimeMs),
				tx.pure.u64(customPhaseStartTimeMs),
				tx.object(StaticObjects.clock),
			],
		});
		return tx;
	}

	async mint({
		launchCollectionId,
		Nfts,
		suiTokens,
		type,
		tx,
	}: MintArgs): Promise<Transaction> {
		tx.moveCall({
			target: `${LANCHPAD_PACKAGE_ID}::${Module}::${Call.mint}`,
			arguments: [
				tx.object(launchCollectionId),
				tx.makeMoveVec({ type, elements: Nfts }),
				tx.makeMoveVec({ type: "0x2::sui::SUI", elements: suiTokens }),
				tx.object(StaticObjects.clock),
				tx.object(StaticObjects.launchpad),
			],
			typeArguments: [type],
		});
		return tx;
	}

	async setupWhitelist({
		launchCollectionId,
		creatorCap,
		addresses,
		allocations,
		tx,
	}: SetupWhiteistArgs): Promise<Transaction> {
		tx.moveCall({
			target: `${LANCHPAD_PACKAGE_ID}::${Module}::${Call.updateWhitelist}`,
			arguments: [
				tx.object(launchCollectionId),
				tx.object(creatorCap),
				tx.pure.vector("address", addresses),
				tx.pure.vector("u64", allocations),
			],
		});

		return tx;
	}

	async pause({
		launchCollectionId,
		creatorCap,
		tx,
	}: PauseArgs): Promise<Transaction> {
		tx.moveCall({
			target: `${LANCHPAD_PACKAGE_ID}::${Module}::${Call.pause}`,
			arguments: [tx.object(launchCollectionId), tx.object(creatorCap)],
		});
		return tx;
	}

	async resume({
		launchCollectionId,
		creatorCap,
		tx,
	}: PauseArgs): Promise<Transaction> {
		tx.moveCall({
			target: `${LANCHPAD_PACKAGE_ID}::${Module}::${Call.unpause}`,
			arguments: [tx.object(launchCollectionId), tx.object(creatorCap)],
		});
		return tx;
	}

	async withdraw({
		launchCollectionId,
		creatorCap,
		tx,
	}: PauseArgs): Promise<Transaction> {
		tx.moveCall({
			target: `${LANCHPAD_PACKAGE_ID}::${Module}::${Call.withdraw}`,
			arguments: [tx.object(launchCollectionId), tx.object(creatorCap)],
		});
		return tx;
	}

	//======== Internal functions========//
	private preparePhaseData(args: CustomPhaseArgs | WhiteListArgs): {
		price: number | null;
		supply: number | null;
		time: number | null;
		name: string | null;
	} {
		if (!args.price || !args.supply || !args.time)
			return {
				price: null,
				supply: null,
				time: null,
				name: null,
			};
		let name: string | undefined;
		if ("name" in args) {
			name = args.name;
		}

		return {
			price: args.price ? args.price : null,
			supply: args.supply ? args.supply : null,
			time: args.time ? args.time : null,
			name: name ? name : null,
		};
	}
}
