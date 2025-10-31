import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as apigw from "aws-cdk-lib/aws-apigateway";
import * as lambda from "aws-cdk-lib/aws-lambda-nodejs";
//import path from "path";
import {Runtime} from "aws-cdk-lib/aws-lambda";
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class StuffStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'StuffQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
      const api = new apigw.RestApi(this, `stuffApiGateway`, {
          restApiName: `ghast-api`,
          deployOptions: {
              metricsEnabled: true,
              loggingLevel: apigw.MethodLoggingLevel.INFO,
              dataTraceEnabled: true,
          },
          cloudWatchRole: true,
      });
  }
}
/*
const createPostFn = new lambda.NodejsFunction(this, `CreatePostFunction`, {
    entry: path.resolve(__dirname, '../src/handlers/create-post.ts'),
    functionName: `ghast-api-create-post`,
    handler: 'handler',
    memorySize: 512,
    environment: {
        DATABASE_URL: process.env.DATABASE_URL,
    },
    runtime: Runtime.NODEJS_18_X,
    timeout: cdk.Duration.seconds(15),
    bundling: {
        target: 'es2020',
    }
});

 */
