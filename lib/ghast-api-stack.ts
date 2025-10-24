import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as apigw from 'aws-cdk-lib/aws-apigateway';
import * as path from 'path';
import * as lambda from 'aws-cdk-lib/aws-lambda-nodejs';
import { Runtime } from "aws-cdk-lib/aws-lambda";


export class GhastApiStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const api = new apigw.RestApi(this, `GhastApiGateway`, {
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