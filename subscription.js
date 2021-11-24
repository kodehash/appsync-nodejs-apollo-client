'use strict';
const createHttpLink = require("apollo-link-http").createHttpLink;
const ApolloLink = require("apollo-link").ApolloLink;
const ApolloClient = require("apollo-client").ApolloClient;
const createSubscriptionHandshakeLink = require("aws-appsync-subscription-link").createSubscriptionHandshakeLink;
const aws_exports = require('./aws-export').default;
const createAuthLink = require("aws-appsync-auth-link").createAuthLink;
const InMemoryCache = require("apollo-cache-inmemory").InMemoryCache;


// CONFIG
const AppSync = {
    "graphqlEndpoint": aws_exports.graphqlEndpoint,
    "region": aws_exports.region,
    "authenticationType": aws_exports.authenticationType,
    "apiKey": aws_exports.apiKey,
    "graphqlSubEndpoint": aws_exports.graphqlSubEndpoint
};
const ApiId = aws_exports.ApiId;

// POLYFILLS
global.WebSocket = require('ws');
global.window = global.window || {
    setTimeout: setTimeout,
    clearTimeout: clearTimeout,
    WebSocket: global.WebSocket,
    ArrayBuffer: global.ArrayBuffer,
    addEventListener: function () { },
    navigator: { onLine: true }
};
global.localStorage = {
    store: {},
    getItem: function (key) {
        return this.store[key]
    },
    setItem: function (key, value) {
        this.store[key] = value
    },
    removeItem: function (key) {
        delete this.store[key]
    }
};
require('es6-promise').polyfill();
require('isomorphic-fetch');

// Require AppSync module
const AUTH_TYPE = require('aws-appsync/lib/link/auth-link').AUTH_TYPE;
const AWSAppSyncClient = require('aws-appsync').default;


  const url = aws_exports.graphqlEndpoint;
  const region = aws_exports.region;
  const auth = {
    type: AUTH_TYPE.API_KEY,
    apiKey: aws_exports.apiKey,
  };

// GRAPHQL
const httpLink = createHttpLink({ uri: AppSync.graphqlEndpoint });
const link = ApolloLink.from([
    createAuthLink({ url, region, auth }),
    createSubscriptionHandshakeLink({ url, region, auth }, httpLink),
  ]);
  const client = new ApolloClient({
    link,
    cache: new InMemoryCache()
  });
const gql = require('graphql-tag');


const Subscription = gql(`
  subscription onCreatePost {
    onCreatePost {
      id
      title
    }
  }`);

  
client.subscribe({
    query: gql`
    subscription onCreatePost {
        onCreatePost {
          id
          title
        }
      }
    `,
  }).subscribe({
    next(x) { console.log(x) },
    error(err) { console.log(`Finished with error: ${ err }`) },
    complete() { console.log('Finished') }
  });
  