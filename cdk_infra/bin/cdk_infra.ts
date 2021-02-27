#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { AmplifyInfraStack } from '../lib/cdk_infra-stack';

const app = new cdk.App();
new AmplifyInfraStack(app, 'ThePhrontistery-front-end-beta');
