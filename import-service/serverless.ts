import catalogBatchProcess from "@functions/catalog-batch-process";
import importFileParser from "@functions/import-file-parser";
import importProductsFile from "@functions/import-products-file";
import type { AWS } from "@serverless/typescript";

const serverlessConfiguration: AWS = {
  service: "import-service",
  frameworkVersion: "2",
  custom: {
    webpack: {
      webpackConfig: "./webpack.config.js",
      includeModules: true,
    },
  },
  plugins: ["serverless-webpack"],
  package: {
    individually: true,
  },
  provider: {
    name: "aws",
    runtime: "nodejs14.x",
    region: "eu-west-1",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      SQS_URL: {
        Ref: "SQSQueue",
      },
      SNS_ARN: {
        Ref: "SNSTopic",
      },
    },
    lambdaHashingVersion: "20201221",
    iamRoleStatements: [
      {
        Effect: "Allow",
        Action: "s3:ListBucket",
        Resource: ["arn:aws:s3:::import-products-csv-rs-school"],
      },
      {
        Effect: "Allow",
        Action: "s3:*",
        Resource: ["arn:aws:s3:::import-products-csv-rs-school/*"],
      },
      {
        Effect: "Allow",
        Action: "sqs:*",
        Resource: [
          {
            "Fn::GetAtt": ["SQSQueue", "Arn"],
          },
        ],
      },
      {
        Effect: "Allow",
        Action: "sns:*",
        Resource: {
          Ref: "SNSTopic",
        },
      },
    ],
  },
  resources: {
    Resources: {
      SQSQueue: {
        Type: "AWS::SQS::Queue",
        Properties: {
          QueueName: "rs-products-queue",
        },
      },
      SNSTopic: {
        Type: "AWS::SNS::Topic",
        Properties: {
          TopicName: "rs-products-created",
        },
      },
      SNSSubscription: {
        Type: "AWS::SNS::Subscription",
        Properties: {
          Endpoint: "gultyayev.sergey@gmail.com",
          Protocol: "email",
          TopicArn: {
            Ref: "SNSTopic",
          },
          FilterPolicy: {
            success: ["true"],
          },
        },
      },
      SNSSubscription2: {
        Type: "AWS::SNS::Subscription",
        Properties: {
          Endpoint: "crush97@yandex.ru",
          Protocol: "email",
          TopicArn: {
            Ref: "SNSTopic",
          },
          FilterPolicy: {
            success: ["false"],
          },
        },
      },
    },
  },
  functions: { importProductsFile, importFileParser, catalogBatchProcess },
};

module.exports = serverlessConfiguration;
