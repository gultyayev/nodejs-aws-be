import "source-map-support/register";

import { tryCatch } from "@libs/apiGateway";
import { middyfy } from "@libs/lambda";

import importService from "../../services/import.service";
import { S3Handler } from "aws-lambda";

const hello: S3Handler = async (event) =>
  tryCatch(async () => {
    for (const record of event.Records) {
      await importService.processImportedFile(record.s3.object.key);
    }
  });

export const importFileParser = middyfy(hello);
