import 'source-map-support/register';
import {APIGatewayAuthorizerEvent} from "aws-lambda";

export const tokenAuthorizer = async (event: APIGatewayAuthorizerEvent, _, callback) => {
  console.log(event)

  if (event.type !== 'TOKEN') {
    callback('Unauthorized');
    return;
  }

  try {
    const token = event.authorizationToken;
    const creds = token.split(' ')[1];
    const [username, password] = Buffer.from(creds, 'base64').toString('utf-8').split(':');

    const storedPassword = process.env[username];
    const effect = !storedPassword || storedPassword !== password ? 'Deny' : 'Allow';

    const policy = generatePolicy(creds, event.methodArn, effect);

    callback(null, policy);
  } catch (err) {
    callback(`Unauthorized: ${err.message || err}`)
  }
}

function generatePolicy(principalId: string, resource: string, effect: string) {
  return {
    principalId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: resource
        }
      ]
    }
  }
}
