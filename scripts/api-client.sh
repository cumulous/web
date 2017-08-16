#!/bin/bash

set -e

WORKDIR="tmp"
AUTH_CONFIG="${WORKDIR}/.auth.conf"
API_CONFIG="${WORKDIR}/.api.conf"
SWAGGER_FILE="${WORKDIR}/swagger.json"
SWAGGER_UI="node_modules/swagger-ui-dist/index.html"

CODEGEN_VERSION="2.3"
CODEGEN_JAR="bin/codegen-${CODEGEN_VERSION}.jar"
CODEGEN_DEST="src/app/api"

mkdir -p "${WORKDIR}"

if [ ! -f "${AUTH_CONFIG}" ] || [ ! -f "${API_CONFIG}" ]; then
  read -p "API domain: " API_DOMAIN
  read -p "Auth domain: " AUTH_DOMAIN
  read -p "Web client ID: " WEB_CLIENT_ID
  read -p "Command-line client ID: " CLI_CLIENT_ID
  read -p "Command-line client secret: " -s CLI_CLIENT_SECRET

  echo "
    request = POST
    url = \"https://${AUTH_DOMAIN}/oauth2/token\"
    header = \"Content-Type: application/x-www-form-urlencoded\"
    header = \"Authorization: Basic $(printf ${CLI_CLIENT_ID}:${CLI_CLIENT_SECRET} | base64 -w0)\"
    data = "grant_type=client_credentials"
    silent = true
  " > "${AUTH_CONFIG}"

  echo "
    url = "https://${API_DOMAIN}/"
    compressed
    silent = true
  " > "${API_CONFIG}"

  echo "
    export const environment = {
      production: true,
      apiRoot: 'https://${API_DOMAIN}',
      auth: {
        clientId: '${WEB_CLIENT_ID}',
        domain: '${AUTH_DOMAIN}',
      }
    };
  " | cut -c 5- > "src/environments/environment.prod.ts"
fi

echo
echo Authenticating...

TOKEN=$(curl -K "${AUTH_CONFIG}" | jq -r '.access_token')
curl -K "${API_CONFIG}" -H "Authorization: ${TOKEN}" > "${SWAGGER_FILE}"

echo Generating API client...

rm -rf "${CODEGEN_DEST}"
java -jar "${CODEGEN_JAR}" generate \
  -i "${SWAGGER_FILE}" \
  -l typescript-angular2 \
  -o "${CODEGEN_DEST}" \
  --additional-properties modelPropertyNaming=original

sed -i "s|InjectionToken<string> } from|InjectionToken } from|" \
  src/app/api/variables.ts

echo Updating Swagger UI...

sed -i "s|url: .*petstore.*,|url: './../../${SWAGGER_FILE}',\n\
    validatorUrl: null,|" "${SWAGGER_UI}"
