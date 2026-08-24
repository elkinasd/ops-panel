#!/bin/bash
echo "🚀 Iniciando creación de recursos en LocalStack..."

# 1. Crear colas SQS
awslocal sqs create-queue --queue-name sync-events-queue
awslocal sqs create-queue --queue-name sync-events-dlq

# 2. Crear logs de CloudWatch e inyectar un mensaje de prueba
awslocal logs create-log-group --log-group-name "/aws/portal/sync-service"
awslocal logs create-log-stream --log-group-name "/aws/portal/sync-service" --log-stream-name "backend-stream-01"

TIMESTAMP=$(date +%s000)
awslocal logs put-log-events --log-group-name "/aws/portal/sync-service" --log-stream-name "backend-stream-01" --log-events timestamp=$TIMESTAMP,message="[ERROR] Timeout de 5000ms al intentar sincronizar el cluster"

# 3. Crear base de datos RDS
awslocal rds create-db-instance --db-instance-identifier portal-db-local --db-instance-class db.t3.micro --engine postgres --master-username admin --master-user-password supersecret

echo "✅ Recursos creados exitosamente."

echo "⚙️ Simulando logs de la Máquina de Estados (Step Functions)..."

# 4. Creamos el grupo de logs de la máquina de estados
awslocal logs create-log-group --log-group-name "/aws/vendedlogs/states/SyncStateMachine"
awslocal logs create-log-stream --log-group-name "/aws/vendedlogs/states/SyncStateMachine" --log-stream-name "execution-errors"

TIMESTAMP=$(date +%s000)

# 5. Inyectamos un log súper realista simulando que falló al leer la Dynamo de 'Miembros'
awslocal logs put-log-events \
  --log-group-name "/aws/vendedlogs/states/SyncStateMachine" \
  --log-stream-name "execution-errors" \
  --log-events timestamp=$TIMESTAMP,message='"{\"type\":\"ExecutionFailed\",\"stateMachineArn\":\"arn:aws:states:us-east-1:000000000000:stateMachine:SyncStateMachine\",\"stateName\":\"LeerDynamoMiembros\",\"error\":\"DynamoDB.ProvisionedThroughputExceededException\",\"cause\":\"Se superó la capacidad de lectura en la tabla Miembros. Sincronización abortada.\"}"'

echo "✅ Logs de la Máquina de Estados inyectados."