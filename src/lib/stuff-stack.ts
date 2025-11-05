import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigw from 'aws-cdk-lib/aws-apigateway';
import * as path from 'path';

export class StuffStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const serverLambda = new lambda.Function(this, 'ServerLambda', {
            runtime: lambda.Runtime.NODEJS_18_X,
            handler: 'server.handler', // server.js exports 'handler'
            code: lambda.Code.fromAsset(path.resolve(__dirname, '../')),
            memorySize: 1024,
            timeout: cdk.Duration.seconds(15),
        });

        const api = new apigw.LambdaRestApi(this, 'ServerApi', {
            handler: serverLambda,
            proxy: true, // Let Express handle all routes
        });

        new cdk.CfnOutput(this, 'ApiUrl', { value: api.url });
    }
}
