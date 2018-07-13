const graphql = require('graphql');
const axios = require('axios');

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList
} = graphql;

const RuleType = new GraphQLObjectType({
  name: 'Rule',
  fields: () =>({
    id: { type: GraphQLString },
    name: { type : GraphQLString },
    description: { type:  GraphQLString },
    users: {
      type: new GraphQLList(UserType),
      resolve(parentValue, arg){
        return axios.get(`http://localhost:3000/rules/${parentValue.id}/users`)
          .then(resp => resp.data);
      }
    }
  })
});


const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () =>({
    id: { type: GraphQLString },
    firstName: {type : GraphQLString},
    age: { type:  GraphQLInt },
    rule: {
      type: RuleType,
      resolve(parentValue, args) {
        return axios.get(`http://localhost:3000/rules/${parentValue.ruleId}`)
          .then(resp => resp.data);
      }
    }
  })
});


const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    user: {
      type: UserType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args){
        return axios.get(`http://localhost:3000/users/${args.id}`)
          .then(resp => resp.data);
      }
    },
    rule: {
      type: RuleType,
      args: {id: { type: GraphQLString } },
      resolve(parentValue, args){
        return axios.get(`http://localhost:3000/rules/${args.id}`)
          .then(resp => resp.data);
      }
    }
  }
})


module.exports =  new GraphQLSchema({
  query: RootQuery
})
