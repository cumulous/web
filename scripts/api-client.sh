#!/bin/sh

API_ID="$1"
API_STAGE="latest"

WORKDIR="tmp"
SWAGGER_FILE="${WORKDIR}/swagger.json"
CODEGEN_VERSION="2.2.2"
CODEGEN_URL="http://central.maven.org/maven2/io/swagger/swagger-codegen-cli/\
${CODEGEN_VERSION}/swagger-codegen-cli-${CODEGEN_VERSION}.jar"
CODEGEN_JAR="${WORKDIR}/codegen.jar"
CODEGEN_DEST="src/api"

mkdir -p "${WORKDIR}"

aws apigateway get-export \
    --rest-api-id "${API_ID}" \
    --stage-name "${API_STAGE}" \
    --export-type swagger \
    --parameters extensions='integrations' \
    "${SWAGGER_FILE}"

if [ ! -f "${CODEGEN_JAR}" ]; then
    wget "${CODEGEN_URL}" -O "${CODEGEN_JAR}"
fi

java -jar "${CODEGEN_JAR}" generate \
    -i "${SWAGGER_FILE}" \
    -l typescript-angular2 \
    -o ${CODEGEN_DEST}