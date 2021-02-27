import {Stack, Construct, SecretValue, StackProps} from "@aws-cdk/core";
import * as amplify from "@aws-cdk/aws-amplify";

export class AmplifyInfraStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Part 2 - Creation of the Amplify Application
    const amplifyApp = new amplify.App(this, "sample-react-app", {
      sourceCodeProvider: new amplify.GitHubSourceCodeProvider({
        owner: "hbrooks",
        repository: "the-phrontistery-front-end",
        oauthToken: SecretValue.secretsManager(
          "arn:aws:secretsmanager:us-east-1:254211059804:secret:AWS_Amplify_to_GitHub_Personal_Access_Token-VZn1hr",
          {
            jsonField: "GITHUB_PERSONAL_ACCESS_TOKEN",
          }
        ),
      }),
    });
    const masterBranch = amplifyApp.addBranch("master");

  }
}