#!/bin/sh

AUTH0_CLIENT_ID=$(
  aws s3 cp s3://${ARTIFACTS_BUCKET}/auth0/${STACK_NAME}-api-test-client.id - | jq -r .
)

AUTH0_CLIENT_SECRET=$(
  aws configure set s3.signature_version s3v4 &&
  aws s3 cp s3://${SECRETS_BUCKET}/auth0/${STACK_NAME}-api-test-client.key -
)

printf "%s\n%s\n%s\n%s\n" \
    "${API_DOMAIN}" \
    "${AUTH0_DOMAIN}" \
    "${AUTH0_CLIENT_ID}" \
    "${AUTH0_CLIENT_SECRET}" \
  | { npm run -s api; }
