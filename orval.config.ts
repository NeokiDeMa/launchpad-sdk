export default {
	Indexer: {
		output: {
			mode: "tags-split",
			target: "orval/src/index.ts",
			schemas: "orval/src/model",
			baseUrl: "http://localhost:3333",
			override: {
				operationName: (operation: any) => {
					const operationName = operation.operationId || operation.summary;
					return operationName.replace("Controller", "");
				},
			},
		},

		input: {
			target: "./swagger.json",
		},
	},
};
