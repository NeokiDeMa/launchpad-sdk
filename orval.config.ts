export default {
	Indexer: {
		output: {
			mode: "tags-split",
			target: "orval/src/index.ts",
			schemas: "orval/src/model",
			baseUrl: "http://localhost:3333",
			override: {
				// This block needs to be uncommented and correctly configured
				operationName: (operation: any) => {
					// Remove 'Controller' from the operation name
					const operationName = operation.operationId || operation.summary;
					return operationName.replace("Controller", "");
				},
				// mutator: {
				// 	path: "./src/api.ts",
				// 	name: "apiClient",
				// },

				// query: {
				// 	options: {
				// 		mutator: true,
				// 	},
				// },
			},
		},

		input: {
			target: "./swagger.json",
		},
	},
};
