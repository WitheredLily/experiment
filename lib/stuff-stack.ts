import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as apigw from 'aws-cdk-lib/aws-apigateway';
import * as lambda from 'aws-cdk-lib/aws-lambda-nodejs';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import path from 'path';

export class StuffStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        // 👇 Lambda Function
        const createPostFn = new lambda.NodejsFunction(this, 'CreatePostFunction', {
            entry: path.resolve(__dirname, '../src/handlers/create-post.ts'),
            functionName: 'ghast-api-create-post',
            handler: 'handler',
            memorySize: 512,
            runtime: Runtime.NODEJS_18_X,
            timeout: cdk.Duration.seconds(15),
            environment: {
                DATABASE_URL: process.env.DATABASE_URL ?? '',
            },
            bundling: {
                target: 'es2020',
            },
        });

        // 👇 API Gateway
        const api = new apigw.RestApi(this, 'StuffApiGateway', {
            restApiName: 'ghast-api',
            deployOptions: {
                metricsEnabled: true,
                loggingLevel: apigw.MethodLoggingLevel.INFO,
                dataTraceEnabled: true,
            },
            cloudWatchRole: true,
        });

        // 👇 Connect POST /posts to Lambda
        const posts = api.root.addResource('posts');
        posts.addMethod('POST', new apigw.LambdaIntegration(createPostFn));
    }
}
