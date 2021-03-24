import 'source-map-support/register';

import {formatJSONResponse, ResponseBuilder, tryCatch} from '@libs/apiGateway';
import {middyfy} from '@libs/lambda';
import {APIGatewayEvent, Handler} from "aws-lambda";
import products from '../../mocks/products.json';

const getOne: Handler<APIGatewayEvent> = (event) => {
  return tryCatch(async () => {
    const {id} = event.pathParameters;
    const product = products.find(p => p.id === id);

    if (!product) {
      return new ResponseBuilder()
          .setStatusCode(404)
          .build()
    }

    return new ResponseBuilder(product)
        .build();
  })
}

export const getProductsById = middyfy(getOne);
