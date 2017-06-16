#!/bin/bash

set -e

WORKDIR="tmp"
AUTH0_CONFIG="${WORKDIR}/.auth0.json"
API_CONFIG="${WORKDIR}/.api.json"
SWAGGER_FILE="${WORKDIR}/swagger.json"
SWAGGER_UI="node_modules/swagger-ui-dist/index.html"

CODEGEN_VERSION="2.3"
CODEGEN_JAR="bin/codegen-${CODEGEN_VERSION}.jar"
CODEGEN_DEST="src/app/api"

mkdir -p "${WORKDIR}"

if [ ! -f "${AUTH0_CONFIG}" ] || [ ! -f "${API_CONFIG}" ]; then
  read -p "API domain: " API_DOMAIN
  read -p "Auth0 domain: " AUTH0_DOMAIN
  read -p "Auth0 client ID: " AUTH0_CLIENT_ID
  read -p "Auth0 client secret: " -s AUTH0_CLIENT_SECRET

  echo "
    request = POST
    url = \"https://${AUTH0_DOMAIN}/oauth/token\"
    header = \"content-type: application/json\"
    data = \"{\
      \\\"client_id\\\":\\\"${AUTH0_CLIENT_ID}\\\",\
      \\\"client_secret\\\":\\\"${AUTH0_CLIENT_SECRET}\\\",\
      \\\"audience\\\":\\\"https://${API_DOMAIN}\\\",\
      \\\"grant_type\\\":\\\"client_credentials\\\"\
    }\"
    silent = true
  " > "${AUTH0_CONFIG}"

  echo "
    url = "https://${API_DOMAIN}/"
    compressed = true
    silent = true
  " > "${API_CONFIG}"
fi

echo
echo Authenticating...

TOKEN=$(curl -K "${AUTH0_CONFIG}" | jq -r '.access_token')
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
