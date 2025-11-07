import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as apigw from 'aws-cdk-lib/aws-apigateway';
import * as lambdaNode from 'aws-cdk-lib/aws-lambda-nodejs';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import * as path from 'path';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';

export class StuffStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const serverLambda = new lambdaNode.NodejsFunction(this, 'ServerLambda', {
            entry: path.resolve(__dirname, '../../server.ts'), // or server.js
            handler: 'handler',
            runtime: Runtime.NODEJS_18_X,
            memorySize: 1024,
            timeout: cdk.Duration.seconds(15),
            bundling: {
                externalModules: [], // include all modules
            }

        });

        const api = new apigw.LambdaRestApi(this, 'ServerApi', {
            handler: serverLambda,
            proxy: true,
        });

        const bucket = new s3.Bucket(this, 'WebsiteBucket', {
            bucketName: 'my-test-bucket-612931696237',
            websiteIndexDocument: 'index.html',
            websiteErrorDocument: 'index.html',
            publicReadAccess: true,
            blockPublicAccess: {
                blockPublicPolicy: false,
                blockPublicAcls: false,
                ignorePublicAcls: false,
                restrictPublicBuckets: false,
            },
        });

        bucket.addToResourcePolicy(new iam.PolicyStatement({
            actions: ['s3:GetObject'],
            effect: iam.Effect.ALLOW,
            resources: [bucket.arnForObjects('*')],
            principals: [new iam.AnyPrincipal()],
        }));

        new s3deploy.BucketDeployment(this, 'WebsiteDeployment', {
            sources: [s3deploy.Source.asset(path.resolve(__dirname, '../../build'))],
            destinationBucket: bucket,
        });

        const distribution = new cloudfront.Distribution(this, 'WebsiteDistribution', {
            defaultRootObject: 'index.html',
            defaultBehavior: {
                origin: new origins.S3StaticWebsiteOrigin(bucket),
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



        new cdk.CfnOutput(this, 'ApiUrl', { value: api.url });
        new cdk.CfnOutput(this, 'WebsiteBucketName', { value: bucket.bucketName });

        new cdk.CfnOutput(this, 'WebsiteBucketWebsiteURL', {
            value: bucket.bucketWebsiteUrl,
        });
        new cdk.CfnOutput(this, 'WebsiteRESTURL', {
            value: bucket.bucketRegionalDomainName,
        });
        new cdk.CfnOutput(this, 'ApiURL', {
            value: api.url,
        });
    }
}
