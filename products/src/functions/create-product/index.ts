import { handlerPath } from '@libs/handlerResolver';

export default {
  handler: `${handlerPath(__dirname)}/create-product.createProduct`,
  events: [
    {
      http: {
        method: 'post',
        path: 'products',
        cors: true
      }
    }
  ]
}
