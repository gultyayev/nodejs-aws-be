import type { AWS } from "@serverless/typescript";

import getProductsById from "@functions/one-product";
import getProductsList from "@functions/products";
import createProduct from "@functions/create-product";

const serverlessConfiguration: AWS = {
  service: "products",
  frameworkVersion: "2",
  custom: {
    webpack: {
      webpackConfig: "./webpack.config.js",
      includeModules: {
        forceInclude: ["pg"],
      },
    },
  },
  plugins: ["serverless-webpack", "serverless-offline"],
  package: {
    individually: true,
  },
  provider: {
    name: "aws",
    region: "eu-west-1",
    runtime: "nodejs14.x",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      DB_HOST: process.env.DB_HOST,
      DB_USERNAME: process.env.DB_USERNAME,
      DB_PASSWORD: process.env.DB_PASSWORD,
    },
    lambdaHashingVersion: "20201221",
  },
  // import the function via paths
  functions: { getProductsById, getProductsList, createProduct },
};

module.exports = serverlessConfiguration;
