import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as apigw from 'aws-cdk-lib/aws-apigateway';
import * as lambdaNode from 'aws-cdk-lib/aws-lambda-nodejs';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import * as path from 'path';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';

export class StuffStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        // --- Lambda + API Gateway ---
        const serverLambda = new lambdaNode.NodejsFunction(this, 'ServerLambda', {
            entry: path.resolve(__dirname, '../../server.ts'),
            handler: 'handler',
            runtime: Runtime.NODEJS_18_X,
            memorySize: 1024,
            timeout: cdk.Duration.seconds(15),
            bundling: {
                externalModules: [],
            },
        });

        const api = new apigw.LambdaRestApi(this, 'ServerApi', {
            handler: serverLambda,
            proxy: true,
        });

        // --- Secure S3 Bucket ---
        const bucket = new s3.Bucket(this, 'WebsiteBucket', {
            bucketName: 'my-test-bucket-612931696237',
            blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
            removalPolicy: cdk.RemovalPolicy.DESTROY, // optional: auto-cleanup
            autoDeleteObjects: true, // optional: remove files on destroy
        });

        // --- CloudFront Origin Access Identity (OAI) ---
        const originAccessIdentity = new cloudfront.OriginAccessIdentity(this, 'OAI');
        bucket.grantRead(originAccessIdentity);

        // --- CloudFront Distribution ---
        const distribution = new cloudfront.Distribution(this, 'WebsiteDistribution', {
            defaultRootObject: 'index.html',
            defaultBehavior: {
                origin: new origins.S3Origin(bucket, { originAccessIdentity }),
                viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
            },
            errorResponses: [
                {
                    httpStatus: 403,
                    responseHttpStatus: 200,
                    responsePagePath: '/index.html',
                    ttl: cdk.Duration.minutes(5),
                },
                {
                    httpStatus: 404,
                    responseHttpStatus: 200,
                    responsePagePath: '/index.html',
                    ttl: cdk.Duration.minutes(5),
                },
            ],
        });

        // --- Deploy build/ to S3 ---
        new s3deploy.BucketDeployment(this, 'WebsiteDeployment', {
            sources: [s3deploy.Source.asset(path.resolve(__dirname, '../../build'))],
            destinationBucket: bucket,
            distribution,
            distributionPaths: ['/*'],
        });

        // --- Stack Outputs ---
        new cdk.CfnOutput(this, 'ApiUrl', { value: api.url });
        new cdk.CfnOutput(this, 'CloudFrontURL', { value: `https://${distribution.domainName}` });
        new cdk.CfnOutput(this, 'BucketName', { value: bucket.bucketName });
    }
}
