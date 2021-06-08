import "source-map-support/register";

import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/apiGateway";
import { ResponseBuilder, tryCatch } from "@libs/apiGateway";
import { middyfy } from "@libs/lambda";

import importService from "../../services/import.service";

const hello: ValidatedEventAPIGatewayProxyEvent<any> = (event) =>
  tryCatch(async () => {
    if (!event.queryStringParameters?.name) {
      return new ResponseBuilder().setStatusCode(400);
    }

    const url = await importService.getSignedUrl(
      event.queryStringParameters.name
    );

    return new ResponseBuilder(url).build();
  });

export const importProductsFile = middyfy(hello);
