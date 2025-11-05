var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import * as cdk from 'aws-cdk-lib';
import * as apigw from 'aws-cdk-lib/aws-apigateway';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as path from 'path';
var StuffStack = /** @class */ (function (_super) {
    __extends(StuffStack, _super);
    function StuffStack(scope, id, props) {
        var _a;
        var _this = _super.call(this, scope, id, props) || this;
        // Use prebuilt JS Lambda
        var createPostFn = new lambda.Function(_this, 'CreatePostFunction', {
            runtime: lambda.Runtime.NODEJS_18_X,
            handler: 'create-post.handler', // filename.handler exported function
            code: lambda.Code.fromAsset(path.resolve(__dirname, '../build/handlers')),
            memorySize: 512,
            timeout: cdk.Duration.seconds(15),
            environment: {
                DATABASE_URL: (_a = process.env.DATABASE_URL) !== null && _a !== void 0 ? _a : '',
            },
        });
        var api = new apigw.RestApi(_this, 'StuffApiGateway', {
            restApiName: 'ghast-api',
            deployOptions: {
                metricsEnabled: true,
                loggingLevel: apigw.MethodLoggingLevel.INFO,
                dataTraceEnabled: true,
            },
            cloudWatchRole: true,
        });
        var posts = api.root.addResource('posts');
        posts.addMethod('POST', new apigw.LambdaIntegration(createPostFn));
        return _this;
    }
    return StuffStack;
}(cdk.Stack));
export { StuffStack };
