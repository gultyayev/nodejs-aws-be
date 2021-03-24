import { handlerPath } from '@libs/handlerResolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.getProductsById`,
  events: [
    {
      http: {
        method: 'get',
        path: 'products/{id}',
        cors: true
      }
    }
  ]
}
