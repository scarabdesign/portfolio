# Quick Start Guide

## If Helm is not installed

You can still render the templates manually using the following commands:

### View all rendered templates

```bash
# Install Helm first (if not already installed)
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash

# Or on Ubuntu/Debian
curl https://baltocdn.com/helm/signing.asc | gpg --dearmor | sudo tee /usr/share/keyrings/helm.gpg > /dev/null
sudo apt-get install apt-transport-https --yes
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/helm.gpg] https://baltocdn.com/helm/stable/debian/ all main" | sudo tee /etc/apt/sources.list.d/helm-stable-debian.list
sudo apt-get update
sudo apt-get install helm
```

### Basic Usage

```bash
# Install the chart
helm install portfolio ./portfolio-chart

# Upgrade the chart
helm upgrade portfolio ./portfolio-chart

# Uninstall the chart
helm uninstall portfolio

# Check status
helm status portfolio

# List all releases
helm list
```

### Template Rendering (without installing)

```bash
# Render all templates to stdout
helm template portfolio ./portfolio-chart

# Save rendered templates to a file
helm template portfolio ./portfolio-chart > rendered-manifests.yaml

# Apply rendered manifests directly with kubectl
helm template portfolio ./portfolio-chart | kubectl apply -f -

# Delete resources
helm template portfolio ./portfolio-chart | kubectl delete -f -
```

### Dry Run

```bash
# See what would be installed without actually installing
helm install portfolio ./portfolio-chart --dry-run --debug
```

## Directory Structure

```
portfolio-chart/
├── Chart.yaml                      # Chart metadata
├── values.yaml                     # Default configuration values
├── charts/                         # Dependencies (empty for now)
├── templates/                      # Kubernetes manifest templates
│   ├── _helpers.tpl               # Template helpers
│   ├── api-deployment.yaml        # API Deployment
│   ├── api-service.yaml           # API Service
│   ├── public-deployment.yaml     # Public Deployment
│   ├── public-service.yaml        # Public Service
│   └── NOTES.txt                  # Post-install notes
├── .helmignore                     # Files to ignore when packaging
└── README.md                       # Full documentation
```

## Common Commands

### Development

```bash
# Lint the chart
helm lint ./portfolio-chart

# Package the chart
helm package ./portfolio-chart

# Show chart values
helm show values ./portfolio-chart

# Show chart information
helm show chart ./portfolio-chart
```

### Debugging

```bash
# Get all resources
helm get all portfolio

# Get values used in release
helm get values portfolio

# Get manifest of release
helm get manifest portfolio

# Get hooks of release
helm get hooks portfolio
```

### Testing Different Configurations

```bash
# Test with different replica counts
helm template portfolio ./portfolio-chart --set api.replicaCount=3

# Test with different service type
helm template portfolio ./portfolio-chart --set api.service.type=LoadBalancer

# Test with custom values file
helm template portfolio ./portfolio-chart -f custom-values.yaml
```
