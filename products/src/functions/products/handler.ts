import 'source-map-support/register';

import {formatJSONResponse, ResponseBuilder, tryCatch} from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import {Handler} from "aws-lambda";
import products from "../../mocks/products.json";

const getAll: Handler = () => {
  return tryCatch(async () => new ResponseBuilder(products).build());
}

export const getProductsList = middyfy(getAll);
