import { APIGatewayProxyResult } from "aws-lambda";
import { validate, ValidationError } from "class-validator";
import http from "http";
import { ResponseBuilder } from "@libs/apiGateway";

/**
 *
 * @param dto An object to validate with class-validator
 * @param dtoName Name of entity to display in logs
 * @return Undefined if valid. If is invalid returns a ready-to-send error response
 */
export async function validateDto(
  dto: Record<string, any>,
  dtoName?: string
): Promise<APIGatewayProxyResult | void> {
  try {
    const validatedObjectName = dtoName || dto.constructor.name || "data";
    console.log(`Validating ${validatedObjectName}...`);
    const validationErrors = await validate(dto);

    if (validationErrors.length) {
      console.log(`${validatedObjectName} validation failed!`);

      return new ResponseBuilder({
        errors: validationErrors,
      })
        .setStatusCode(400)
        .build();
    }

    console.log(`${validatedObjectName} validation passed!`);
    return undefined;
  } catch (err) {
    if (!(err instanceof ValidationError)) {
      console.error("Error during validation", err);
      err = http.STATUS_CODES[400];
    }

    return new ResponseBuilder({ error: err }).setStatusCode(400).build();
  }
}
