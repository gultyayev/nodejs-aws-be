import {ResponseBuilder, tryCatch} from '@libs/apiGateway';
import {middyfy} from '@libs/lambda';
import {APIGatewayEvent, Handler} from "aws-lambda";
import {isUUID} from "class-validator";
import {DbConnection} from "@libs/db";
import {ProductDto} from "@libs/dtos/product.dto";

const getOne: Handler<APIGatewayEvent> = (event, context) => {
  return tryCatch(async () => {
    context.callbackWaitsForEmptyEventLoop = false
    const {id} = event.pathParameters;

    if (!isUUID(id, '4')) {
      return new ResponseBuilder({error: 'Not UUID'})
          .setStatusCode(400)
          .build();
    }

    const db = DbConnection.getInstance('getOneProduct');
    const connection = await db.connection;
    const products: ProductDto[] = await connection.query('SELECT products.id id, title, description, price, img_src imgSrc, count FROM products RIGHT JOIN stocks ON stocks.product_id = products.id WHERE products.id = $1', [
        id
    ]);

    if (!products.length) {
      return new ResponseBuilder()
          .setStatusCode(404)
          .build()
    }

    return new ResponseBuilder(products[0])
        .build();
  })
}

export const getProductsById = middyfy(getOne);
