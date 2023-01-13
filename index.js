const { ApolloServer } = require('apollo-server');
const { ApolloGateway, IntrospectAndCompose } = require('@apollo/gateway');
const dotenv = require('dotenv');
dotenv.config();
const PORT = process.env.PORT || 8080;

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
	subscriptions: false
});

server.listen(PORT).then(({ url }) => {
	console.log(`Gateway ready at ${url}`);
}).catch(err => {console.log(err)});
