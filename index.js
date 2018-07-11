'use strict';
const express = require('express');
const graphqlHTTP = require('express-graphql');
const {getVideoById, getVideos, createVideo} = require('./src/data');

const { 
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLInputObjectType,
    GraphQLList,
    GraphQLNonNull,
    GraphQLID,
    GraphQLString,
    GraphQLInt,
    GraphQLBoolean
 } = require('graphql');

const { globalIdField } = require('graphql-relay');

const {nodeInterface, nodeField} = require('./src/node');

const PORT = process.env.PORT || 3000;
const server= express();


const videoType = new GraphQLObjectType({
    name: 'Video',
    description: 'A video on Egghead.io',
    fields: {
        id: globalIdField(),
        title: {
            type: GraphQLString,
            description: 'the title of the video',
        },
        duration: {
            type: GraphQLInt,
            description: 'the duration of the video',
        },
        released: {
            type: GraphQLBoolean,
            description: 'if the video has been released or not',
        },
    },
    interfaces: [nodeInterface],
});

exports.videoType = videoType;

const queryType = new GraphQLObjectType({
    name: 'QueryType',
    description: 'the root query type.',
    fields: {
        node: nodeField,
        videos: {
            type: new GraphQLList(videoType),
            resolve: getVideos,
        },
        video: {
            type: videoType,
            args: {
                id: {
                    type: new GraphQLNonNull(GraphQLID),
                    description: 'The id of the video'
                },
            },
            resolve: (_, args) => {
                    return getVideoById(args.id);
                }
            },
        },
});

const videoInputType = new GraphQLInputObjectType({
    name: 'VideoInput',
    fields: {
        title: {
            type: new GraphQLNonNull(GraphQLString),
            description: 'The Title of the Video.'
        },
        duration: {
            type: new GraphQLNonNull(GraphQLInt),
            description: 'The duration of the Video.'
        },
        released: {
            type: new GraphQLNonNull(GraphQLBoolean),
            description: 'The released state of the Video.'
        },
    },
});

const rootMutation = new GraphQLObjectType({
    name: 'Mutation',
    description: 'The root mutation type',
    fields: {
        createVideo: {
            type: videoType,
            args: {
                video: {
                    type: new GraphQLNonNull(videoInputType),
                }
            },
            resolve: (_, args) => {
                return createVideo(args.video);
            },
        },  
    },
});

const schema = new GraphQLSchema({
    query: queryType,
    mutation: rootMutation,
});



server.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true,
}));

server.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`);
})