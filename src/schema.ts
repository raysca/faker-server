import { GraphQLSchema, buildClientSchema } from 'graphql'

const INTRO_SPEC_QUERY = `#graphql

query IntrospectionQuery {
  __schema {
    queryType {
      name
    }
    mutationType {
      name
    }
    subscriptionType {
      name
    }
    types {
      ...FullType
    }
    directives {
      name
      description

      locations
      args {
        ...InputValue
      }
    }
  }
}

fragment FullType on __Type {
  kind
  name
  description

  fields(includeDeprecated: true) {
    name
    description
    args {
      ...InputValue
    }
    type {
      ...TypeRef
    }
    isDeprecated
    deprecationReason
  }
  inputFields {
    ...InputValue
  }
  interfaces {
    ...TypeRef
  }
  enumValues(includeDeprecated: true) {
    name
    description
    isDeprecated
    deprecationReason
  }
  possibleTypes {
    ...TypeRef
  }
}

fragment InputValue on __InputValue {
  name
  description
  type {
    ...TypeRef
  }
  defaultValue
}

fragment TypeRef on __Type {
  kind
  name
  ofType {
    kind
    name
    ofType {
      kind
      name
      ofType {
        kind
        name
        ofType {
          kind
          name
          ofType {
            kind
            name
            ofType {
              kind
              name
              ofType {
                kind
                name
              }
            }
          }
        }
      }
    }
  }
}

`

export const fetchRemoteSchema = async (url: string, headers: string[]): Promise<GraphQLSchema> => {
  const extraHeaders = headers.reduce((acc, header) => {
    const [key, value] = header.split(':')
    acc[key] = value
    return acc
  }, {})
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...extraHeaders
    },
    body: JSON.stringify({ query: INTRO_SPEC_QUERY })
  })
  const { data, error } = await response.json()
  if (error) {
    console.error(error)
    throw new Error(JSON.stringify(error))
  }
  return buildClientSchema(data)
}
