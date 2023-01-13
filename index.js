const { ApolloServer } = require('apollo-server');
const { ApolloGateway, IntrospectAndCompose, RemoteGraphQLDataSource } = require('@apollo/gateway');
const depthLimit = require('graphql-depth-limit');
const dotenv = require('dotenv');
dotenv.config();

const PORT = process.env.PORT || 8080;
let timeoutStr = process.env.TIMEOUT || 3000;
const timeout = parseInt(timeoutStr, 10);
let depthLimitStr = process.env.DEPTH_LIMIT || 3;
const depth = parseInt(depthLimitStr, 10);

// Init an ApolloGateway instance and pass it
// the subgraph shema as a string
const gateway = new ApolloGateway({
	supergraphSdl: new IntrospectAndCompose({
		subgraphs: [
			{name: "user", url: process.env.SUBGRAPH_ONE},
		]
	}),
	buildService({ name, url }) {
		// Sets a 3 second timeout on requests
		const fetcher = (input, init) => {
			if (init) {
				init.timeout = timeout;
			} else {
				init = { timeout: timeout};
			}
			return fetch(input, init);
		};
		return new RemoteGraphQLDataSource({ url, fetcher })
	}
});

const server = new ApolloServer({
	gateway,
	// Subscriptions are not currently supported in Apollo Federation
	subscriptions: false,
	validationRules: [depthLimit(depth)]
});

server.listen(PORT).then(({ url }) => {
	console.log(`Gateway ready at ${url}`);
}).catch(err => {console.log(err)});
