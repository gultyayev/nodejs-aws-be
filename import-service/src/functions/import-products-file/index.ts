import { handlerPath } from '@libs/handlerResolver';

export default {
  handler: `${handlerPath(__dirname)}/import-products-file.importProductsFile`,
  events: [
    {
      http: {
        method: 'get',
        path: 'import',
        request: {
          parameters: {
            querystrings: {
              name: true
            }
          }
        },
        cors: true,
        authorizer: 'arn:aws:lambda:eu-west-1:352230614812:function:authorization-dev-tokenAuthorizer'
      }
    }
  ]
}
