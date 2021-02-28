#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { AmplifyInfraStack } from '../lib/cdk_infra-stack';

const app = new cdk.App();
new AmplifyInfraStack(app, 'ThePhrontistery-beta-frontendinfra', {
    env: {
        account: '254211059804',
        region: 'us-east-1'
    }
});
