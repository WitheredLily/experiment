import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as apigw from 'aws-cdk-lib/aws-apigateway';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as path from 'path';

export class StuffStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        // Use prebuilt JS Lambda
        const createPostFn = new lambda.Function(this, 'CreatePostFunction', {
            runtime: lambda.Runtime.NODEJS_18_X,
            handler: 'create-post.handler', // filename.handler exported function
            code: lambda.Code.fromAsset(path.resolve(__dirname, '../../build/handlers')),
            memorySize: 512,
            timeout: cdk.Duration.seconds(15),
            environment: {
                DATABASE_URL: process.env.DATABASE_URL ?? '',
            },
        });

        const api = new apigw.RestApi(this, 'StuffApiGateway', {
            restApiName: 'ghast-api',
            deployOptions: {
                metricsEnabled: true,
                loggingLevel: apigw.MethodLoggingLevel.INFO,
                dataTraceEnabled: true,
            },
            cloudWatchRole: true,
        });

        const posts = api.root.addResource('posts');
        posts.addMethod('POST', new apigw.LambdaIntegration(createPostFn));
    }
}
