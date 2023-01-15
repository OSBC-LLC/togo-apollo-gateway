const { ApolloServer } = require('apollo-server');
const { ApolloGateway, IntrospectAndCompose } = require('@apollo/gateway');
const depthLimit = require('graphql-depth-limit');
const dotenv = require('dotenv');
dotenv.config();

const PORT = process.env.PORT || 8080;
let depthLimitStr = process.env.DEPTH_LIMIT || 3;
const depth = parseInt(depthLimitStr, 10);
//let timeoutStr = process.env.TIMEOUT || 3000;
//const timeout = parseInt(timeoutStr, 10);

// Init an ApolloGateway instance and pass it
// the subgraph shema as a string
const gateway = new ApolloGateway({
	supergraphSdl: new IntrospectAndCompose({
		subgraphs: [
			{name: "user", url: process.env.SUBGRAPH_ONE},
		]
	}),
});

const server = new ApolloServer({
	gateway,
	// Subscriptions are not currently supported in Apollo Federation
	subscriptions: false,
	validationRules: [depthLimit(depth)]
});

server.listen(PORT).then(({ url }) => {
	console.log(`Gateway ready at ${url}`);
}).catch(err => {
	if (err.message === "request timeout") {
		// do something
	}
	console.log(err);
});
