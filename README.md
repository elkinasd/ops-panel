# OpsPanel

OpsPanel es un panel operativo ligero para AWS que permite revisar el estado y la actividad de servicios clave en un entorno local de desarrollo. El proyecto incluye un backend en Node.js que se conecta a LocalStack y un frontend en Angular para diagnóstico rápido y validación operativa.

## Descripción general

La solución actualmente permite consultar y validar:

- Logs de CloudWatch
- Estado de instancias RDS
- Inspección de colas SQS

Está pensado principalmente para pruebas locales, depuración y validación de concepto antes de pasar a un entorno AWS real.

## Arquitectura

El repositorio está organizado en dos componentes principales:

- Backend: Node.js + Express + AWS SDK
- Frontend: Angular
- Infraestructura local: LocalStack para servicios compatibles con AWS
- Orquestación: Docker Compose

### Estructura del proyecto

```text
ops-panel/
├── docker-compose.yaml
├── .gitignore
├── README.md
├── ops-panel-back/
│   ├── .env
│   ├── .env.example
│   ├── index.js
│   ├── package.json
│   ├── deployment/
│   │   ├── Dockerfile.dev
│   │   ├── init-aws.sh
│   │   ├── ops-panel-deployment.yaml
│   │   └── localstack-data/
│   └── src/
│       ├── app.js
│       ├── constants/
│       ├── controllers/
│       ├── routes/
│       └── services/
└── ops-panel-ui/
    ├── package.json
    ├── angular.json
    ├── Dockerfile.dev
    └── src/
```

## Requisitos previos

Antes de ejecutar el proyecto necesitas:

- Docker Desktop o Docker Engine
- Docker Compose
- Node.js 18+ (recomendado)
- npm

## Configuración y variables de entorno

Este proyecto está configurado para usar variables de entorno en lugar de credenciales o valores específicos hardcodeados en el código.

### Archivos requeridos

- [ops-panel-back/.env](ops-panel-back/.env): archivo de configuración local para tu máquina; no debe subirse a Git
- [ops-panel-back/.env.example](ops-panel-back/.env.example): plantilla segura para onboarding y compartir configuración sin secretos
- [.gitignore](.gitignore): excluye `.env` y otros archivos sensibles del control de versiones

### Variables de entorno

El backend y la configuración de LocalStack se manejan con estas variables:

| Variable | Descripción | Ejemplo |
| --- | --- | --- |
| `PORT` | Puerto del backend | `3000` |
| `AWS_REGION` | Región de AWS usada por el SDK | `us-east-1` |
| `AWS_DEFAULT_REGION` | Región por defecto de LocalStack | `us-east-1` |
| `AWS_ENDPOINT` | Endpoint de AWS utilizado por el backend | `http://localstack:4566` |
| `AWS_ACCESS_KEY_ID` | Access key compatible con LocalStack | `test` |
| `AWS_SECRET_ACCESS_KEY` | Secret key compatible con LocalStack | `test` |
| `LOCALSTACK_AUTH_TOKEN` | Token de autenticación de LocalStack si aplica en tu entorno | `replace_with_localstack_token` |
| `LOCALSTACK_PORT` | Puerto del edge de LocalStack | `4566` |
| `LOCALSTACK_EXTRA_PORTS` | Puertos adicionales de LocalStack | `4510-4559` |
| `SERVICES` | Servicios de AWS habilitados en LocalStack | `logs,rds,sqs` |
| `CLOUDWATCH_LOG_GROUP` | Grupo de logs de CloudWatch | `/aws/portal/sync-service` |
| `CLOUDWATCH_LOG_STREAM` | Nombre del stream de logs | `backend-stream-01` |
| `RDS_INSTANCE_IDENTIFIER` | Identificador de instancia RDS | `portal-db-local` |
| `BACKEND_PORT` | Puerto expuesto del backend en Docker | `3000` |
| `FRONTEND_PORT` | Puerto expuesto del frontend en Docker | `4200` |


## Ejecutar el proyecto localmente

### 1) Crear el archivo de entorno del backend

Copia el archivo de ejemplo y personalízalo para tu máquina:

```bash
cp ops-panel-back/.env.example ops-panel-back/.env
```

Luego edita el archivo y reemplaza los valores de ejemplo por los tuyos.

### 2) Levantar la pila

Desde la raíz del repositorio:

```bash
docker compose up --build
```

Esto inicia:

- LocalStack
- Backend API
- Frontend UI

### 3) Acceder a la aplicación

- Frontend: http://localhost:4200
- Backend API: http://localhost:3000

## Comandos de desarrollo

### Backend

```bash
cd ops-panel-back
npm install
npm run dev
```

### Frontend

```bash
cd ops-panel-ui
npm install
npm run start
```

## Endpoints de la API

El backend expone los siguientes endpoints:

- `GET /api/aws/sync`
- `GET /api/aws/rds`
- `GET /api/aws/sqs`

## Seguridad y limpieza del repositorio

Este proyecto sigue un patrón seguro por defecto:

- No se guardan credenciales AWS en Git
- No se sube el token de LocalStack a Git
- La configuración se carga desde variables de entorno
- Los archivos sensibles quedan excluidos por [.gitignore](.gitignore)
- Los secretos del entorno local quedan en [ops-panel-back/.env](ops-panel-back/.env)

## Configuración de Docker Compose

El entorno está conectado mediante [docker-compose.yaml](docker-compose.yaml), que lee valores desde el archivo `.env` y los inyecta a los contenedores. Esto evita valores quemados en el código y hace la configuración portable entre máquinas.
