# Portfolio Helm Chart

This Helm chart deploys the Portfolio application with both API and Public frontend components.

## Components

- **Portfolio API**: Backend API service running on port 3000
- **Portfolio Public**: Frontend web application running on port 80

## Prerequisites

- Kubernetes 1.19+
- Helm 3.0+
- Docker images built locally:
  - `portfolio-api:latest`
  - `portfolio-public:latest`

## Installation

### Install the chart

```bash
helm install portfolio ./portfolio-chart
```

### Install with custom release name

```bash
helm install my-portfolio ./portfolio-chart
```

### Install with custom values

```bash
helm install portfolio ./portfolio-chart -f custom-values.yaml
```

## Configuration

The following table lists the configurable parameters of the Portfolio chart and their default values.

### API Configuration

| Parameter | Description | Default |
|-----------|-------------|---------|
| `api.name` | Name of the API deployment | `portfolio-api` |
| `api.replicaCount` | Number of API replicas | `1` |
| `api.image.repository` | API image repository | `portfolio-api` |
| `api.image.tag` | API image tag | `latest` |
| `api.image.pullPolicy` | API image pull policy | `Never` |
| `api.container.port` | API container port | `3000` |
| `api.service.type` | API service type | `NodePort` |
| `api.service.port` | API service port | `3000` |
| `api.service.nodePort` | API NodePort | `30004` |

### Public Configuration

| Parameter | Description | Default |
|-----------|-------------|---------|
| `public.name` | Name of the public deployment | `portfolio-public` |
| `public.replicaCount` | Number of public replicas | `1` |
| `public.image.repository` | Public image repository | `portfolio-public` |
| `public.image.tag` | Public image tag | `latest` |
| `public.image.pullPolicy` | Public image pull policy | `Never` |
| `public.container.port` | Public container port | `80` |
| `public.service.type` | Public service type | `NodePort` |
| `public.service.port` | Public service port | `80` |
| `public.service.nodePort` | Public NodePort | `30005` |

### Common Configuration

| Parameter | Description | Default |
|-----------|-------------|---------|
| `podAnnotations` | Annotations for pods | `{}` |
| `podSecurityContext` | Security context for pods | `{}` |
| `nodeSelector` | Node selector for pods | `{}` |
| `tolerations` | Tolerations for pods | `[]` |
| `affinity` | Affinity rules for pods | `{}` |

## Usage Examples

### Override image tags

```bash
helm install portfolio ./portfolio-chart \
  --set api.image.tag=v1.2.3 \
  --set public.image.tag=v1.2.3
```

### Change service type to LoadBalancer

```bash
helm install portfolio ./portfolio-chart \
  --set api.service.type=LoadBalancer \
  --set public.service.type=LoadBalancer
```

### Scale replicas

```bash
helm install portfolio ./portfolio-chart \
  --set api.replicaCount=3 \
  --set public.replicaCount=3
```

### Set resource limits

Create a custom values file:

```yaml
api:
  resources:
    limits:
      cpu: 500m
      memory: 512Mi
    requests:
      cpu: 250m
      memory: 256Mi

public:
  resources:
    limits:
      cpu: 200m
      memory: 256Mi
    requests:
      cpu: 100m
      memory: 128Mi
```

Then install:

```bash
helm install portfolio ./portfolio-chart -f custom-values.yaml
```

## Upgrading

```bash
helm upgrade portfolio ./portfolio-chart
```

## Uninstalling

```bash
helm uninstall portfolio
```

## Validation

### Lint the chart

```bash
helm lint ./portfolio-chart
```

### Dry run installation

```bash
helm install portfolio ./portfolio-chart --dry-run --debug
```

### Template rendering

```bash
helm template portfolio ./portfolio-chart
```

## Accessing the Application

After installation, the services are available at:

- **API**: `http://<node-ip>:30004`
- **Public**: `http://<node-ip>:30005`

To get the node IP:

```bash
kubectl get nodes -o wide
```

## Troubleshooting

### Check pod status

```bash
kubectl get pods -l app.kubernetes.io/name=portfolio
```

### View logs

```bash
# API logs
kubectl logs -l name=portfolio-api

# Public logs
kubectl logs -l name=portfolio-public
```

### Describe resources

```bash
kubectl describe deployment portfolio-api
kubectl describe deployment portfolio-public
```

## Migration from Plain YAML

This Helm chart replaces the standalone Pod manifests:
- `portfolio-api-pod.yaml` → `templates/api-deployment.yaml` + `templates/api-service.yaml`
- `portfolio-public-pod.yaml` → `templates/public-deployment.yaml` + `templates/public-service.yaml`

**Note**: The chart uses Deployments instead of bare Pods for better production practices including:
- Rolling updates
- Replica management
- Self-healing
- Rollback capabilities
