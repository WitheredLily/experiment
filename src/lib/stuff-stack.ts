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
import {AttributeType, Table} from "aws-cdk-lib/aws-dynamodb";
import {RemovalPolicy} from "aws-cdk-lib";

export class StuffStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const cfFunction = new cloudfront.Function(this, 'RewriteFunction', {
            code: cloudfront.FunctionCode.fromInline(`
function handler(event) {
    var request = event.request;
    var uri = request.uri;

    // Handle paths like "/student" (no slash)
    if (!uri.includes('.') && !uri.endsWith('/')) {
        if (uri === '/student') {
            request.uri = '/student/index.html';
        } else if (uri === '/teacher') {
            request.uri = '/teacher/index.html';
        } else if (uri === '/login') {
            request.uri = '/login/index.html';
        }
    }

    // Handle "/student/"
    else if (uri.endsWith('/')) {
        request.uri += 'index.html';
    }

    // SPA routes
    else if (!uri.includes('.')) {
        if (uri.startsWith('/student')) {
            request.uri = '/student/index.html';
        } else if (uri.startsWith('/teacher')) {
            request.uri = '/teacher/index.html';
        } else if (uri.startsWith('/login')) {
            request.uri = '/login/index.html';
        }
    }

    return request;
}
  `),
        });

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

        const apiDomain = cdk.Fn.select(2, cdk.Fn.split('/', api.url));
        const apiOrigin = new origins.HttpOrigin(apiDomain, {
            originPath: '',
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
            defaultRootObject: 'student/index-student.html',

            defaultBehavior: {
                origin: new origins.S3Origin(bucket, { originAccessIdentity }),
                viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
                functionAssociations: [
                    {
                        function: cfFunction,
                        eventType: cloudfront.FunctionEventType.VIEWER_REQUEST,
                    },
                ],
            },

            additionalBehaviors: {
                'student/*': {
                    origin: new origins.S3Origin(bucket, { originAccessIdentity }),
                    viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
                    functionAssociations: [
                        {
                            function: cfFunction,
                            eventType: cloudfront.FunctionEventType.VIEWER_REQUEST,
                        },
                    ],
                },
                'teacher/*': {
                    origin: new origins.S3Origin(bucket, { originAccessIdentity }),
                    viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
                },
                'login/*': {
                    origin: new origins.S3Origin(bucket, { originAccessIdentity }),
                    viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
                },
                'api/*': {
                    origin: apiOrigin,
                    viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
                    allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
                    cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
                    originRequestPolicy: cloudfront.OriginRequestPolicy.ALL_VIEWER,
                },
            },

            errorResponses: [
                {
                    httpStatus: 403,
                    responseHttpStatus: 200,
                    responsePagePath: '/student/index-student.html',
                },
                {
                    httpStatus: 404,
                    responseHttpStatus: 200,
                    responsePagePath: '/student/index-student.html',
                },
            ],
        });

        // --- DynamoDB Table ---
        const tableName = 'data';

        const table = new Table(this, 'DataTable', {
            partitionKey: {
                name: 'id',
                type: AttributeType.STRING,
            },

            sortKey: {
                name: 'createdAt',
                type: AttributeType.NUMBER,
            },

            removalPolicy: RemovalPolicy.DESTROY,
        });

        table.addGlobalSecondaryIndex({
            indexName: 'userIndex',
            partitionKey: {
                name: 'userId',
                type: AttributeType.STRING,
            },
            sortKey: {
                name: 'createdAt',
                type: AttributeType.NUMBER,
            },
        });

        table.grantReadWriteData(serverLambda);

        serverLambda.addEnvironment('DYNAMO_TABLE', table.tableName);

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
