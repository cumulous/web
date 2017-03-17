#!/bin/bash

set -e

ARTIFACTS_BUCKET="$1"
BACKEND_STAGE="${BACKEND_STAGE:-release}"
CODEGEN_VERSION="2.3"

WORKDIR="tmp"
SWAGGER_FILE="${WORKDIR}/swagger.yaml"
SWAGGER_URI="s3://${ARTIFACTS_BUCKET}/api/${BACKEND_STAGE}/swagger.yaml"
CODEGEN_JAR="bin/codegen-${CODEGEN_VERSION}.jar"
CODEGEN_DEST="src/api"

mkdir -p "${WORKDIR}"

aws s3 cp "${SWAGGER_URI}" "${SWAGGER_FILE}"

rm -rf "${CODEGEN_DEST}"

java -jar "${CODEGEN_JAR}" generate \
    -i "${SWAGGER_FILE}" \
    -l typescript-angular2 \
    -o "${CODEGEN_DEST}"