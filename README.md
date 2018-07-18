# graphqlPOC

POC simple node+graphql 

## Instalación

```
npm install

npm run json:server

npm run dev
```

## Schema

```
http://localhost:4000/graphql
```

## graphiql

query user-rule
```
{
  user(id:"23"){
    age
    rule {
      id
      name
      description
    }
  }
}
```

query rule-user-rule (referencia circular)

```
{
  rule(id: "1") {
    users {
      id
      firstName
      rule {
        id
        name
        description
      }
    }
  }
}
```

Fragments query 

```
{
  findRule: rule(id: "1") {
    users {
      id
      firstName
      rule {
        ...ruleDetails
      }
    }
  }
  findUser: user(id: "23") {
    age
    rule {
      ...ruleDetails
    }
  }
  fragmentRule: rule(id: "1") {
    ...ruleDetails
  }
}

fragment ruleDetails on Rule {
  id
  name
  description
}
```

User + Rule + Repo

```
{
  user(id:"23"){
    firstName
    age
    rule{
      name
      description
    }
    repo {
      id
      name
      full_name
      git_url
      language
    }
  }
}
```