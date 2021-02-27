import {Stack, Construct, SecretValue, StackProps} from "@aws-cdk/core";
import {App, Domain, GitHubSourceCodeProvider, Branch, BasicAuth} from "@aws-cdk/aws-amplify";
import {Role, ServicePrincipal, PolicyDocument, PolicyStatement} from "@aws-cdk/aws-iam";

export class AmplifyInfraStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const amplifyFrontEndRole = new Role(this,
      'ThePhrontistery-Amplify-FrontEndRole',
      {
        assumedBy: new ServicePrincipal('amplify.amazonaws.com'),
        description: "Used by our AWS Amplify Front End to execute the Front End code.", // Right?
        roleName: 'amplifyFrontEndRole',
        inlinePolicies: {
          'inlinePolicy1': new PolicyDocument({
            statements:  [
              new PolicyStatement({
                actions: [
                  // 'amplify:*',
                  // "cloudformation:*", // This shouldn't be needed if we only run the frontend.
                  // 'iam:*',
                  '*'
                ],
                resources: [
                  '*'
                ],
              })
            ]
          })
        }
      }
    )

    const amplifyApp = new App(this, "ThePhrontistery-Amplify", {
      sourceCodeProvider: new GitHubSourceCodeProvider({
        owner: "hbrooks",
        repository: "the-phrontistery-front-end",
        oauthToken: SecretValue.secretsManager(
          "arn:aws:secretsmanager:us-east-1:254211059804:secret:AWS_Amplify_to_GitHub_Personal_Access_Token-VZn1hr",
          {
            jsonField: "GITHUB_PERSONAL_ACCESS_TOKEN",
          }
        ),
      }),
      role: amplifyFrontEndRole,
    });

    const masterBranch = new Branch(this, 'ThePhrontistery-Amplify-MasterBranch', {
      app: amplifyApp,
      // basicAuth: new BasicAuth({
      //   username: 'apple',
      // }),
      branchName: 'master',
    })

    new Domain(this,
      "ThePhrontistery-AmplifyDomain",
      {
        app: amplifyApp,
        domainName: 'the-phrontistery.com',
        subDomains: [
          {
            branch: masterBranch,
            prefix: '',
          }
        ]
      }
    )


  }
}