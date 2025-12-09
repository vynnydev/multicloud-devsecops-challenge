iot-predictive-maintenance/
├── README.md
├── .gitignore
├── Makefile
├── docker-compose.yml
│
├── docs/
│   ├── architecture/
│   │   ├── aws-architecture.md
│   │   ├── azure-architecture.md
│   │   ├── gcp-architecture.md
│   │   └── oracle-architecture.md
│   ├── api/
│   │   └── api-documentation.md
│   └── deployment/
│       └── deployment-guide.md
│
├── terraform/
│   ├── README.md
│   ├── environments/
│   │   ├── dev/
│   │   │   ├── terraform.tfvars
│   │   │   └── backend.tf
│   │   └── prod/
│   │       ├── terraform.tfvars
│   │       └── backend.tf
│   │
│   ├── modules/
│   │   ├── aws/
│   │   │   ├── iot-core/
│   │   │   │   ├── main.tf
│   │   │   │   ├── variables.tf
│   │   │   │   ├── outputs.tf
│   │   │   │   └── README.md
│   │   │   ├── kinesis/
│   │   │   │   ├── main.tf
│   │   │   │   ├── variables.tf
│   │   │   │   └── outputs.tf
│   │   │   ├── eks/
│   │   │   │   ├── main.tf
│   │   │   │   ├── variables.tf
│   │   │   │   ├── outputs.tf
│   │   │   │   └── kubeconfig.tpl
│   │   │   ├── rds/
│   │   │   │   ├── main.tf
│   │   │   │   ├── variables.tf
│   │   │   │   └── outputs.tf
│   │   │   ├── s3/
│   │   │   │   ├── main.tf
│   │   │   │   ├── variables.tf
│   │   │   │   └── outputs.tf
│   │   │   ├── lambda/
│   │   │   │   ├── main.tf
│   │   │   │   ├── variables.tf
│   │   │   │   └── outputs.tf
│   │   │   ├── vpc/
│   │   │   │   ├── main.tf
│   │   │   │   ├── variables.tf
│   │   │   │   └── outputs.tf
│   │   │   └── fortinet/
│   │   │       ├── main.tf
│   │   │       ├── variables.tf
│   │   │       ├── outputs.tf
│   │   │       └── fortinet-config.tpl
│   │   │
│   │   ├── azure/
│   │   │   ├── service-bus/
│   │   │   │   ├── main.tf
│   │   │   │   ├── variables.tf
│   │   │   │   └── outputs.tf
│   │   │   ├── aks/
│   │   │   │   ├── main.tf
│   │   │   │   ├── variables.tf
│   │   │   │   └── outputs.tf
│   │   │   ├── sql-database/
│   │   │   │   ├── main.tf
│   │   │   │   ├── variables.tf
│   │   │   │   └── outputs.tf
│   │   │   ├── blob-storage/
│   │   │   │   ├── main.tf
│   │   │   │   ├── variables.tf
│   │   │   │   └── outputs.tf
│   │   │   └── vnet/
│   │   │       ├── main.tf
│   │   │       ├── variables.tf
│   │   │       └── outputs.tf
│   │   │
│   │   ├── gcp/
│   │   │   ├── pubsub/
│   │   │   ├── gke/
│   │   │   ├── bigquery/
│   │   │   ├── cloud-sql/
│   │   │   └── vpc/
│   │   │
│   │   └── oracle/
│   │       ├── streaming/
│   │       ├── oke/
│   │       ├── autonomous-db/
│   │       └── vcn/
│   │
│   └── stacks/
│       ├── aws-core/
│       │   ├── main.tf
│       │   ├── variables.tf
│       │   ├── outputs.tf
│       │   ├── providers.tf
│       │   └── terraform.tfvars.example
│       ├── azure-ml/
│       │   ├── main.tf
│       │   ├── variables.tf
│       │   ├── outputs.tf
│       │   └── providers.tf
│       ├── gcp-analytics/
│       │   └── ...
│       └── oracle-reporting/
│           └── ...
│
├── kubernetes/
│   ├── aws/
│   │   ├── namespace.yaml
│   │   ├── iot-ingestion/
│   │   │   ├── deployment.yaml
│   │   │   ├── service.yaml
│   │   │   ├── configmap.yaml
│   │   │   ├── secrets.yaml
│   │   │   └── hpa.yaml
│   │   └── frontend/
│   │       ├── deployment.yaml
│   │       ├── service.yaml
│   │       ├── ingress.yaml
│   │       └── configmap.yaml
│   │
│   ├── azure/
│   │   ├── namespace.yaml
│   │   └── ml-training/
│   │       ├── deployment.yaml
│   │       ├── service.yaml
│   │       └── configmap.yaml
│   │
│   ├── gcp/
│   │   └── analytics-service/
│   │
│   └── oracle/
│       └── reporting-service/
│
├── applications/
│   ├── iot-simulator/
│   │   ├── Dockerfile
│   │   ├── requirements.txt
│   │   ├── main.py
│   │   ├── config.py
│   │   └── certificates/
│   │       └── .gitkeep
│   │
│   ├── aws-iot-ingestion/
│   │   ├── Dockerfile
│   │   ├── package.json
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── services/
│   │   │   │   ├── kinesis-consumer.service.ts
│   │   │   │   ├── rds-client.service.ts
│   │   │   │   └── s3-client.service.ts
│   │   │   ├── models/
│   │   │   │   └── sensor-data.model.ts
│   │   │   └── utils/
│   │   │       └── logger.ts
│   │   ├── tsconfig.json
│   │   └── .dockerignore
│   │
│   ├── azure-ml-training/
│   │   ├── Dockerfile
│   │   ├── requirements.txt
│   │   ├── app/
│   │   │   ├── main.py
│   │   │   ├── ml/
│   │   │   │   ├── model.py
│   │   │   │   ├── trainer.py
│   │   │   │   └── detector.py
│   │   │   └── api/
│   │   │       └── routes.py
│   │   └── tests/
│   │
│   ├── gcp-analytics/
│   │   ├── Dockerfile
│   │   ├── requirements.txt
│   │   └── app/
│   │       ├── main.py
│   │       ├── bigquery_client.py
│   │       └── vertex_ai_client.py
│   │
│   ├── oracle-reporting/
│   │   ├── Dockerfile
│   │   ├── pom.xml
│   │   └── src/
│   │       └── main/
│   │           └── java/
│   │               └── com/oracle/reporting/
│   │
│   └── frontend/
│       ├── Dockerfile
│       ├── package.json
│       ├── vite.config.ts
│       ├── tsconfig.json
│       ├── public/
│       ├── src/
│       │   ├── main.tsx
│       │   ├── App.tsx
│       │   ├── components/
│       │   │   ├── Dashboard/
│       │   │   │   ├── Dashboard.tsx
│       │   │   │   ├── DeviceCard.tsx
│       │   │   │   └── MetricsChart.tsx
│       │   │   ├── RealTime/
│       │   │   │   └── LiveData.tsx
│       │   │   └── Analytics/
│       │   │       └── Predictions.tsx
│       │   ├── services/
│       │   │   └── api.ts
│       │   ├── hooks/
│       │   ├── types/
│       │   └── styles/
│       └── nginx.conf
│
├── scripts/
│   ├── setup/
│   │   ├── install-dependencies.sh
│   │   ├── configure-aws-cli.sh
│   │   ├── configure-kubectl.sh
│   │   └── generate-certificates.sh
│   ├── deploy/
│   │   ├── deploy-aws.sh
│   │   ├── deploy-azure.sh
│   │   ├── deploy-all.sh
│   │   └── rollback.sh
│   ├── build/
│   │   ├── build-images.sh
│   │   └── push-images.sh
│   └── teardown/
│       ├── destroy-aws.sh
│       ├── destroy-all.sh
│       └── cleanup.sh
│
├── monitoring/
│   ├── prometheus/
│   │   └── prometheus.yml
│   ├── grafana/
│   │   └── dashboards/
│   │       ├── aws-dashboard.json
│   │       └── overview-dashboard.json
│   └── alerts/
│       └── alert-rules.yml
│
└── tests/
    ├── integration/
    ├── e2e/
    └── load/