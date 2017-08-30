#!/bin/sh

get_export() {
  local name="$1"
  aws cloudformation list-exports \
    --query "Exports[?Name==\`${STACK_NAME}-${name}\`].Value" \
    --output text
}

TOKEN_DOMAIN="$(get_export TokenDomain)"
USER_POOL_ID="$(get_export UserPool)"
WEB_CLIENT_ID="$(get_export WebClient)"
CLI_CLIENT_ID="$(get_export TestClient)"
CLI_CLIENT_SECRET="$(aws cognito-idp describe-user-pool-client \
  --user-pool-id "${USER_POOL_ID}" \
  --client-id "${CLI_CLIENT_ID}" \
  --query 'UserPoolClient.ClientSecret' \
  --output text
)"

printf "%s\n%s\n%s\n%s\n%s\n%s\n" \
    "${API_DOMAIN}" \
    "${TOKEN_DOMAIN}" \
    "${TOKEN_LIFETIME}" \
    "${WEB_CLIENT_ID}" \
    "${CLI_CLIENT_ID}" \
    "${CLI_CLIENT_SECRET}" \
  | { npm run -s api; }
