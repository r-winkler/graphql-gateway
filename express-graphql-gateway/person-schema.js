import {
    GraphQLInt, GraphQLList,
    GraphQLObjectType,
    GraphQLSchema, GraphQLString} from 'graphql';

import axios from 'axios';

const PERSONS_URL = 'http://localhost:3000';

export function getPersonById(id) {
    return axios(`${PERSONS_URL}/persons/${id}`).then(res => res.data);
}

const PersonType = new GraphQLObjectType({
    name: 'Person',
    description: 'person description',

    fields: () => ({
        id: {type: GraphQLString},
        firstname: {type: GraphQLString},
        lastname: {type: GraphQLString},
        age: {type: GraphQLInt},
        gender: {type: GraphQLString},
        picture: {type: GraphQLString},
        email: {type: GraphQLString},
        phone: {type: GraphQLString},
        address: {type: GraphQLString},
        friends: {
            type: new GraphQLList(PersonType),
            resolve: (person, args, {loaders}) => loaders.person.loadMany(person.friends)
        },
        countryCode: {
            type: GraphQLString}
    })
});

const QueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'query description',

    fields: () => ({
        person: {
            type: PersonType,
            args: {
                id: {type: GraphQLString}
            },
            resolve: (root, args, {loaders}) => loaders.person.load(`/persons/${args.id}`)
        },
        allPersons: {
            type: new GraphQLList(PersonType),
            resolve: () => axios(`${PERSONS_URL}/persons/`).then(res => res.data)
        }
    })
});


export const personSchema = new GraphQLSchema({
    query: QueryType
});


