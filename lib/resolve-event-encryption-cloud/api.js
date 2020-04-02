"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const postgres_1 = require("resolve-cloud-common/postgres");
const uuid_1 = require("uuid");
const database = process.env.RESOLVE_ES_DATABASE || 'rsai8qo76xe367ai56jzhz3j3sv1-dev';
const tableName = process.env.RESOLVE_KEYS_TABLE || 'keys';
const credentials = {
    Region: process.env.AWS_REGION || 'us-east-1',
    ResourceArn: process.env.RESOLVE_ES_CLUSTER_ARN ||
        'arn:aws:rds:us-east-1:650139044964:cluster:postgresql-serverless',
    SecretArn: process.env.RESOLVE_ES_SECRET_STORE_ARN ||
        'arn:aws:secretsmanager:us-east-1:650139044964:secret:rsai8qo76xe367ai56jzhz3j3sv1/dev/postgresUser/6D2jG8peJB-zAOW5e'
};
exports.getKey = async (keyId) => {
    const queryResult = await postgres_1.executeStatement({
        ...credentials,
        Sql: `SELECT * FROM "${database}".${tableName} WHERE "id"='${keyId}' LIMIT 1`
    });
    if (queryResult.length) {
        return queryResult[0].key;
    }
    return null;
};
exports.insertKey = async (keyId, keyValue) => postgres_1.executeStatement({
    ...credentials,
    Sql: `INSERT INTO "${database}".${tableName}("id", "key") values ('${keyId}', '${keyValue}')`
});
exports.forgetKey = async (keyId) => postgres_1.executeStatement({
    ...credentials,
    Sql: `DELETE FROM "${database}".${tableName} WHERE "id"='${keyId}'`
});
// TODO: generate proper key, not just random sequence
exports.generateKey = () => uuid_1.v4();
//# sourceMappingURL=api.js.map