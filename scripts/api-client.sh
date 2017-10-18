#!/bin/bash

set -e

WORKDIR="tmp"
API_CONFIG="${WORKDIR}/.api.conf"
AUTH_CONFIG="${WORKDIR}/.auth.conf"

TOKEN_LIFETIME_DEFAULT=36000

mkdir -p "${WORKDIR}"

if [ ! -f "${AUTH_CONFIG}" ] || [ ! -f "${API_CONFIG}" ]; then
  read -p "API domain: " API_DOMAIN
  read -p "Token domain: " TOKEN_DOMAIN
  read -p "Token lifetime in sec [${TOKEN_LIFETIME_DEFAULT}]: " TOKEN_LIFETIME
  read -p "Web client ID: " WEB_CLIENT_ID
  read -p "Command-line client ID: " CLI_CLIENT_ID
  read -p "Command-line client secret: " -s CLI_CLIENT_SECRET

  echo "
    request = POST
    url = \"https://${TOKEN_DOMAIN}/oauth2/token\"
    header = \"Content-Type: application/x-www-form-urlencoded\"
    header = \"Authorization: Basic $(printf ${CLI_CLIENT_ID}:${CLI_CLIENT_SECRET} | base64 -w0)\"
    data = \"grant_type=client_credentials\"
    silent = true
  " > "${AUTH_CONFIG}"

  echo "
    url = "https://${API_DOMAIN}/"
    compressed
    silent = true
  " > "${API_CONFIG}"

  configure_environment() {
    local production="$1"
    local api_base="$2"
    local suffix="$3"

    mkdir -p "src/environments"
    echo "
      export const environment = {
        production: ${production},
        api: {
          baseUrl: '${api_base}',
        },
        auth: {
          clientId: '${WEB_CLIENT_ID}',
          domain: '${TOKEN_DOMAIN}',
          expiresIn: ${TOKEN_LIFETIME:-${TOKEN_LIFETIME_DEFAULT}},
        }
      };
    " | cut -c 7- > "src/environments/environment${suffix}.ts"
  }
  configure_environment false "/api-proxy"
  configure_environment true "https://${API_DOMAIN}" .prod

  echo "
    {
      \"/api-proxy\": {
        \"target\": \"https://${API_DOMAIN}\",
        \"secure\": true,
        \"changeOrigin\": true,
        \"pathRewrite\": { \"^/api-proxy\": \"\" }
      }
    }
  " | cut -c 5- > "tmp/proxy.conf.json"
fi
