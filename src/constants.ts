import { SUI_CLOCK_OBJECT_ID } from "@mysten/sui/utils";

export const LANCHPAD_PACKAGE_ID = "";
export const Module = "collection_manager";
export const Call = {
	new: "new",
	simpleMint: "mint",
	mint: "mint_with_kiosk",
	setStartTime: "set_start_timestamps",
	updateWhitelist: "update_whitelist",
	pause: "pause",
	unpause: "unpause",
	withdraw: "withdraw",
};

export const StaticObjects = {
	clock: SUI_CLOCK_OBJECT_ID,
	launchpad: "",
};
