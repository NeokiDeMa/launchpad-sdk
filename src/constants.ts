import { SUI_CLOCK_OBJECT_ID } from "@mysten/sui/utils";

export const LANCHPAD_PACKAGE_ID =
	"0x884d89784bcc3ae443eb402b2e8af8891cfd5a0340cd2e4aa1aba7e2c20a5057";
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
	launchpad:
		"0xac9f17d3353b8ccf221d712cc3f78c675230f7c1bca9db4edcef4b46c3efbf36",
};
