import type { AWS } from '@serverless/typescript';

import getProductsById from '@functions/one-product';
import getProductsList from '@functions/products';

const serverlessConfiguration: AWS = {
  service: 'products',
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
    },
  },
  plugins: ['serverless-webpack'],
  provider: {
    name: 'aws',
    region: 'eu-west-1',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
    },
    lambdaHashingVersion: '20201221',
  },
  // import the function via paths
  functions: { getProductsById, getProductsList },
};

module.exports = serverlessConfiguration;
