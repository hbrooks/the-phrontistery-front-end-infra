import * as cdk from '@aws-cdk/core';
import * as s3 from '@aws-cdk/aws-s3';
import * as cloudfront from '@aws-cdk/aws-cloudfront';
import * as route53 from '@aws-cdk/aws-route53';
import * as certificateManager from '@aws-cdk/aws-certificatemanager';
import * as targets from '@aws-cdk/aws-route53-targets';

export class AmplifyInfraStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const URL = 'the-phrontistery.com';

    const bucket = new s3.Bucket(this, 'WebsiteBucket', {
      bucketName: 'the-phrontistery-data',
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: 'index.html',
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const cloudFrontOAI = new cloudfront.OriginAccessIdentity(this, 'OAI', {
      comment: `OAI for the-phrontistery.com front end.`,
    });


    const hostedZone = route53.HostedZone.fromLookup(this, 'HostedZone', {
      domainName: URL,
    });

    const certificate = new certificateManager.DnsValidatedCertificate(this, 'Certificate', {
      domainName: URL,
      hostedZone,
      region: 'us-east-1'
    });
    
    const cloudfrontDist = new cloudfront.CloudFrontWebDistribution(
      this,
      `CloudFrontWebDistribution`,
      {
        originConfigs: [
          {
            s3OriginSource: {
              s3BucketSource: bucket,
              originAccessIdentity: cloudFrontOAI,
            },
            behaviors: [{ isDefaultBehavior: true }],
          },
        ],
        viewerCertificate: cloudfront.ViewerCertificate.fromAcmCertificate(
          certificate,
          {
            aliases: [URL],
            securityPolicy: cloudfront.SecurityPolicyProtocol.TLS_V1,
            sslMethod: cloudfront.SSLMethod.SNI,
          },
        ),
      }
    );

    bucket.grantRead(cloudFrontOAI.grantPrincipal);

    const cloudfrontTarget = new targets.CloudFrontTarget(cloudfrontDist);

    new route53.ARecord(this, 'Alias', {
      zone: hostedZone,
      target: route53.RecordTarget.fromAlias(cloudfrontTarget)
    });

  }
}