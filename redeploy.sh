#!/bin/bash

# Unified Redeployment Script for Portfolio & MailTrash
# Usage: ./redeploy.sh [portfolio|mailtrash|all] [api|public|web|all]

set -e

PROJECT=${1:-all}
COMPONENT=${2:-all}
PROJECTS_DIR="$HOME/Projects"

echo "🚀 Starting deployment"
echo "   Project: $PROJECT"
echo "   Component: $COMPONENT"

# Setup Minikube Docker environment once
eval $(minikube docker-env)

# Function to build portfolio components
build_portfolio() {
    local comp=$1
    local dir="${PROJECTS_DIR}/portfolio/portfolio-${comp}"

    if [ ! -d "$dir" ]; then
        echo "⚠️  Skipping portfolio-${comp} (directory not found)"
        return
    fi

    echo ""
    echo "📦 Building portfolio-${comp}..."
    docker build --no-cache -t "portfolio-${comp}:latest" "$dir"
    echo "✅ portfolio-${comp} built successfully!"
}

# Function to build mailtrash components
build_mailtrash() {
    local comp=$1
    local dir="${PROJECTS_DIR}/MailTrash/EmailClient.${comp}"

    if [ ! -d "$dir" ]; then
        echo "⚠️  Skipping mailtrash-${comp} (directory not found)"
        return
    fi

    echo ""
    echo "📦 Building mailtrash-${comp}..."
    docker build --no-cache -t "mailtrash-${comp}:latest" "$dir"
    echo "✅ mailtrash-${comp} built successfully!"
}

# Function to deploy a project
deploy_project() {
    local project=$1
    local chart_dir="${PROJECTS_DIR}/${project}/${project}-chart"

    echo ""
    echo "🔄 Deploying ${project} with Helm..."
    helm upgrade --install "$project" "$chart_dir"

    echo ""
    echo "♻️  Restarting ${project} pods to use new images..."
    kubectl rollout restart deployment -l app=${project} 2>/dev/null || \
    kubectl rollout restart deployment -l app.kubernetes.io/name=${project} 2>/dev/null || \
    echo "⚠️  No deployments found with standard labels"

    echo ""
    echo "⏳ Waiting for ${project} pods to be ready..."
    kubectl wait --for=condition=ready pod -l app=${project} --timeout=90s 2>/dev/null || \
    kubectl wait --for=condition=ready pod -l app.kubernetes.io/name=${project} --timeout=90s 2>/dev/null || \
    echo "⚠️  Timeout waiting for pods (they may still be starting)"
}

# Build and deploy based on arguments
case $PROJECT in
    portfolio)
        case $COMPONENT in
            api)
                build_portfolio "api"
                ;;
            public)
                build_portfolio "public"
                ;;
            all)
                build_portfolio "api"
                build_portfolio "public"
                ;;
            *)
                echo "❌ Invalid portfolio component: $COMPONENT"
                echo "Valid options: api, public, all"
                exit 1
                ;;
        esac
        deploy_project "portfolio"
        ;;

    mailtrash)
        case $COMPONENT in
            api|ApiService)
                build_mailtrash "ApiService"
                ;;
            web|Web)
                build_mailtrash "Web"
                ;;
            all)
                build_mailtrash "ApiService"
                build_mailtrash "Web"
                ;;
            *)
                echo "❌ Invalid mailtrash component: $COMPONENT"
                echo "Valid options: api, web, all"
                exit 1
                ;;
        esac
        deploy_project "mailtrash"
        ;;

    all)
        # Build all portfolio components
        build_portfolio "api"
        build_portfolio "public"

        # Build all mailtrash components
        build_mailtrash "ApiService"
        build_mailtrash "Web"

        # Deploy both projects
        deploy_project "portfolio"
        deploy_project "mailtrash"
        ;;

    *)
        echo "❌ Invalid project: $PROJECT"
        echo "Usage: $0 [portfolio|mailtrash|all] [component|all]"
        echo ""
        echo "Examples:"
        echo "  $0 portfolio api      # Build & deploy only portfolio API"
        echo "  $0 mailtrash all      # Build & deploy all MailTrash services"
        echo "  $0 all                # Build & deploy everything"
        exit 1
        ;;
esac

# Show final status
echo ""
echo "🎉 Deployment complete!"
echo ""
echo "📊 Current pods:"
kubectl get pods -l app=portfolio,app=mailtrash -o wide 2>/dev/null || \
kubectl get pods -l app.kubernetes.io/name=portfolio,app.kubernetes.io/name=mailtrash -o wide 2>/dev/null || \
kubectl get pods

# Show access info
echo ""
echo "🌐 Access your applications:"
echo "   Portfolio: https://seanhankins.com"
echo "   MailTrash: https://mail.seanhankins.com"
