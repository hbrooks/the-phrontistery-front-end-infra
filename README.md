## Developer Instructions
1.  Go to the AWS console.  Manually attempt to create a new GitHub app.  Give the AWS Amplify GitHub authorization provider access to your GH account.
2.  Create a Personal Access Token: https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token
    1.      1.  From https://aws.amazon.com/blogs/mobile/deploying-a-static-website-with-aws-amplify-and-cdk/: The token will need to be granted the “repo” scope to give amplify the necessary permission to access the repository. For example, amplify will create a webhook in the GitHub repository which will be triggered when one or more commits are pushed to a repository branch or tag.
3.  Upload the PAT to the AWS Secrets Manager with the name and key referenced in the amplify.App.


### To Deploy:
1.  `cd cdk_infra`
2.  Should we use `cdk synth` or `npm run cdk synth`? Both seem to work. Then run `cdk deploy` or `npm run cdk deploy`.
3.  Then go to the AWS Console and to the Amplify App.  Click Frontend environments.  Click Run Build (not sure if this is exact text).
4.  Wait.
5.  Browse to the URL to see app. Something like https://master.abc123.amplifyapp.com