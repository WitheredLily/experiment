import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as apigw from "aws-cdk-lib/aws-apigateway";
import * as lambdaNode from "aws-cdk-lib/aws-lambda-nodejs";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import * as path from "path";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as s3deploy from "aws-cdk-lib/aws-s3-deployment";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";
import { AttributeType, Table } from "aws-cdk-lib/aws-dynamodb";
import { RemovalPolicy } from "aws-cdk-lib";
import * as secretsmanager from "aws-cdk-lib/aws-secretsmanager";

export class Stack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // =========================
    // LAMBDAS
    // =========================

    const loginLambda = new lambdaNode.NodejsFunction(this, "LoginLambda", {
      entry: path.resolve(__dirname, "../bin/Login/server.ts"),
      handler: "handler",
      runtime: Runtime.NODEJS_18_X,
      memorySize: 1024,
      timeout: cdk.Duration.seconds(10),
    });

    const signupLambda = new lambdaNode.NodejsFunction(this, "SignupLambda", {
      entry: path.resolve(__dirname, "../bin/signup/server.ts"),
      handler: "handler",
      runtime: Runtime.NODEJS_18_X,
      memorySize: 1024,
      timeout: cdk.Duration.seconds(10),
    });

    // =========================
    // DYNAMODB
    // =========================

    const usersTable = new Table(this, "UsersTable", {
      tableName: `users-${this.stackName}`,
      partitionKey: {
        name: "username",
        type: AttributeType.STRING,
      },
      removalPolicy: RemovalPolicy.DESTROY,
    });

    usersTable.grantReadWriteData(loginLambda);
    usersTable.grantReadWriteData(signupLambda);

    loginLambda.addEnvironment("USERS_TABLE", usersTable.tableName);
    signupLambda.addEnvironment("USERS_TABLE", usersTable.tableName);

    // =========================
    // SECRETS
    // =========================

    const jwtSecret = new secretsmanager.Secret(this, "JwtSecret");

    jwtSecret.grantRead(loginLambda);
    loginLambda.addEnvironment("JWT_SECRET_ARN", jwtSecret.secretArn);

    // =========================
    // API GATEWAY
    // =========================

    const api = new apigw.RestApi(this, "ServerApi", {
      deployOptions: {
        stageName: "prod",
        loggingLevel: apigw.MethodLoggingLevel.INFO,
        dataTraceEnabled: true,
        metricsEnabled: true,
      },
      cloudWatchRole: true,
    });

    // ❗ NO /api prefix in API Gateway (CloudFront handles it)
    const login = api.root.addResource("login");
    const signup = api.root.addResource("signup");

    login.addMethod("POST", new apigw.LambdaIntegration(loginLambda));
    signup.addMethod("POST", new apigw.LambdaIntegration(signupLambda));

    // =========================
    // S3 WEBSITE BUCKET
    // =========================

    const bucket = new s3.Bucket(this, "WebsiteBucket", {
      bucketName: `my-test-bucket-${this.account}`,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    // =========================
    // OAI (STABLE ACCESS MODEL)
    // =========================

    const oai = new cloudfront.OriginAccessIdentity(this, "OAI");
    bucket.grantRead(oai);

    // =========================
    // CLOUDFRONT LOGS
    // =========================

    const logsBucket = new s3.Bucket(this, "CloudFrontLogsBucket", {
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      objectOwnership: s3.ObjectOwnership.OBJECT_WRITER,
      accessControl: s3.BucketAccessControl.LOG_DELIVERY_WRITE,
    });

    // =========================
    // API ORIGIN (IMPORTANT FIX)
    // =========================

    const apiOrigin = new origins.HttpOrigin(`${api.restApiId}.execute-api.${this.region}.amazonaws.com`, {
      originPath: "/prod", // maps correctly to API stage
    });

    // =========================
    // CLOUDFRONT DISTRIBUTION
    // =========================

    const distribution = new cloudfront.Distribution(this, "WebsiteDistribution", {
      defaultRootObject: "index.html",

      enableLogging: true,
      logBucket: logsBucket,
      logFilePrefix: "cloudfront-logs/",

      defaultBehavior: {
        origin: new origins.S3Origin(bucket, {
          originAccessIdentity: oai,
        }),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },

      additionalBehaviors: {
        // ✅ CloudFront strips /api and forwards to API Gateway
        "/api/*": {
          origin: apiOrigin,
          allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
          cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
          originRequestPolicy: cloudfront.OriginRequestPolicy.ALL_VIEWER,
          viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        },
      },

      errorResponses: [{
        httpStatus: 403,
        responseHttpStatus: 200,
        responsePagePath: "/index.html",
      }, {
        httpStatus: 404,
        responseHttpStatus: 200,
        responsePagePath: "/index.html",
      },],
    });

    // =========================
    // DEPLOY FRONTEND
    // =========================

    new s3deploy.BucketDeployment(this, "DeployWebsite", {
      sources: [s3deploy.Source.asset(path.resolve(__dirname, "../../build"))],
      destinationBucket: bucket,
      distribution,
      distributionPaths: ["/*"],
    });

    // =========================
    // OUTPUTS
    // =========================

    new cdk.CfnOutput(this, "CloudFrontURL", {
      value: `https://${distribution.domainName}`,
    });

    new cdk.CfnOutput(this, "ApiURL", {
      value: api.url,
    });
  }
}