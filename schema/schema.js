const graphql = require('graphql');
const axios = require('axios');
const _= require('lodash');

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
      resolve : async (parentValue, arg) => {
        return axios({
          method: 'get',
          url: `http://localhost:3000/rules/${parentValue.id}/users`
          })
          .then(resp => resp.data)
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
      resolve: async (parentValue, args) => {
        return await resolveRuleAfter2Seconds(parentValue.ruleId); 
      }
    },
    repo: {
      type: RepoType,
      resolve(parentValue, arg){
        return axios.get(`https://api.github.com/users/eselopio/repos`)
        .then((resp) => {
          return _.find(resp.data, { 'id': parentValue.repoId });
        });
      }
    }

  })
});

const RepoType = new GraphQLObjectType({
  name: "Repo",
  fields: ()=>({
    id: { type: GraphQLInt }, 
    node_id: { type : GraphQLString },
    name: { type: GraphQLString },
    full_name: { type: GraphQLString }, 
    git_url: { type: GraphQLString },
    language: { type: GraphQLString }
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
          .then(resp =>  resp.data);
      }
    },
    rule: {
      type: RuleType,
      args: { id: { type: GraphQLString } },
      resolve: async(parentValue, args) =>{
        return await resolveRuleAfter2Seconds(args.id); 
      }
    },
    repo: {
      type: RepoType,
      args: { id: {type: GraphQLInt } },
      resolve(parentValue, args){
        return axios.get(`https://api.github.com/users/eselopio/repos`)
          .then((resp) => {
            return _.find(resp.data, { 'id': args.id });
          });
      }
    }
  }
})

const resolveRuleAfter2Seconds= (args)=>{
  return new Promise(resolve => {
    setTimeout(() => {
      axios({
        method: 'get',
        url: `http://localhost:3000/rules/${args}`
        }).then((resp)=>{
          resolve(resp.data);
        })
    }, 2000);
  });
}

module.exports =  new GraphQLSchema({
  query: RootQuery
})
