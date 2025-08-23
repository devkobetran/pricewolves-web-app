import { PolicyStatement, Effect } from 'aws-cdk-lib/aws-iam';

export function override(resources: any): void {
  resources.lambdaFunction.role?.addToPolicy(
    new PolicyStatement({
      effect: Effect.ALLOW,
      actions: [
        'dynamodb:BatchGetItem',
        'dynamodb:GetItem',
        'dynamodb:Scan',
        'dynamodb:Query',
      ],
      resources: [
        'arn:aws:dynamodb:*:*:table/Store-*',
        'arn:aws:dynamodb:*:*:table/Store-*/*'
      ],
    })
  );
}
