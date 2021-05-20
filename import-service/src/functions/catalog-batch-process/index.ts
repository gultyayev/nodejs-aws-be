import { handlerPath } from "@libs/handlerResolver";

export default {
  handler: `${handlerPath(
    __dirname
  )}/catalog-batch-process.catalogBatchProcess`,
  events: [
    {
      sqs: {
        batchSize: 5,
        arn: {
          "Fn::GetAtt": ["SQSQueue", "Arn"],
        },
      },
    },
  ],
};
