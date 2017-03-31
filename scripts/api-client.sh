#!/bin/bash

set -e

WORKDIR="tmp"
AUTH0_CONFIG="${WORKDIR}/.auth0.json"
API_CONFIG="${WORKDIR}/.api.json"
SWAGGER_FILE="${WORKDIR}/swagger.json"

CODEGEN_VERSION="2.3"
CODEGEN_JAR="bin/codegen-${CODEGEN_VERSION}.jar"
CODEGEN_DEST="src/api"

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
    request = GET
    url = "https://${API_DOMAIN}/"
    header = \"content-type: application/json\"
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
  -o "${CODEGEN_DEST}"
