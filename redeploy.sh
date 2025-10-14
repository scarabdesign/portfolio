#!/bin/bash

# Portfolio Redeployment Script
# Usage: ./redeploy.sh [api|public|all]

set -e

COMPONENT=${1:-all}
PROJECT_DIR="$HOME/Projects/portfolio"

echo "🚀 Starting deployment for: $COMPONENT"

# Function to build and deploy a component
deploy_component() {
    local comp=$1
    local dir="${PROJECT_DIR}/portfolio-${comp}"

    echo ""
    echo "📦 Building portfolio-${comp}..."

    # Build in Minikube's Docker environment
    eval $(minikube docker-env)
    cd "$dir"
    docker build -t "portfolio-${comp}:latest" .

    echo "♻️  Restarting portfolio-${comp} pods..."
    kubectl delete pod -l "name=portfolio-${comp}" --ignore-not-found=true

    echo "⏳ Waiting for new pod to be ready..."
    kubectl wait --for=condition=ready pod -l "name=portfolio-${comp}" --timeout=60s 2>/dev/null || true

    echo "✅ portfolio-${comp} deployed successfully!"
}

# Deploy based on argument
case $COMPONENT in
    api)
        deploy_component "api"
        ;;
    public)
        deploy_component "public"
        ;;
    all)
        deploy_component "api"
        deploy_component "public"
        ;;
    *)
        echo "❌ Invalid component: $COMPONENT"
        echo "Usage: $0 [api|public|all]"
        exit 1
        ;;
esac

echo ""
echo "🎉 Deployment complete!"
echo ""
echo "📊 Current pods:"
kubectl get pods -l app=portfolio

# Show access info
echo ""
echo "🌐 Access your application:"
echo "   Public: http://$(minikube ip):30005"
echo "   API:    http://$(minikube ip):30004"
