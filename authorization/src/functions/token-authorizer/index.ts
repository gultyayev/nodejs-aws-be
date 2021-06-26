import {handlerPath} from '@libs/handlerResolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.tokenAuthorizer`,
  events: [
    {
      http: {
        method: 'get',
        path: '',
        cors: true,
      }
    }
  ]
}
