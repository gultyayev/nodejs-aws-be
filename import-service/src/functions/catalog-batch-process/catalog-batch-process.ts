import { tryCatch } from "@libs/apiGateway";
import { middyfy } from "@libs/lambda";
import notificationService from "@services/notification.service";
import { SQSHandler } from "aws-lambda";
import "source-map-support/register";

export const batchHandler: SQSHandler = async (event) =>
  tryCatch(async () => {
    for (const record of event.Records) {
      await notificationService.notify(record.body);
    }
  });

export const catalogBatchProcess = middyfy(batchHandler);
