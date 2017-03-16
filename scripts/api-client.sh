#!/bin/sh

set -e

ARTIFACTS_BUCKET="$1"
API_STAGE="beta"

WORKDIR="tmp"
SWAGGER_FILE="${WORKDIR}/swagger.json"
SWAGGER_URI="s3://${ARTIFACTS_BUCKET}/api/${API_STAGE}/swagger.yaml"
CODEGEN_VERSION="2.2.2"
CODEGEN_URL="http://central.maven.org/maven2/io/swagger/swagger-codegen-cli/\
${CODEGEN_VERSION}/swagger-codegen-cli-${CODEGEN_VERSION}.jar"
CODEGEN_JAR="${WORKDIR}/codegen-${CODEGEN_VERSION}.jar"
CODEGEN_DEST="src/api"

mkdir -p "${WORKDIR}"

aws s3 cp "${SWAGGER_URI}" "${SWAGGER_FILE}"

if [ ! -f "${CODEGEN_JAR}" ]; then
    wget "${CODEGEN_URL}" -O "${CODEGEN_JAR}"
fi

rm -rf "${CODEGEN_DEST}"

java -jar "${CODEGEN_JAR}" generate \
    -i "${SWAGGER_FILE}" \
    -l typescript-angular2 \
    -o "${CODEGEN_DEST}"