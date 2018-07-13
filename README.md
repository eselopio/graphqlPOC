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

query user-rule
```
{
  user(id:"23"){
    age
    rule {
      id
      firstName
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
