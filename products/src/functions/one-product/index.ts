import { handlerPath } from '@libs/handlerResolver';

export default {
  handler: `${handlerPath(__dirname)}/get-product.getProductsById`,
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
