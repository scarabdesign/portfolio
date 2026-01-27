#!/bin/bash

# Unified Redeployment Script for Portfolio & MailTrash
# Usage: ./redeploy.sh [portfolio|mailtrash|all] [api|public|web|all]

# Exit on error, but show the error first
set -e
trap 'echo "❌ Error on line $LINENO. Command: $BASH_COMMAND"' ERR

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
    local comp_lower=$(echo "$comp" | tr '[:upper:]' '[:lower:]')
    local dockerfile_path="${PROJECTS_DIR}/MailTrash/EmailClient.${comp}/Dockerfile"
    local build_context="${PROJECTS_DIR}/MailTrash"

    if [ ! -f "$dockerfile_path" ]; then
        echo "⚠️  Skipping mailtrash-${comp} (Dockerfile not found at $dockerfile_path)"
        return
    fi

    echo ""
    echo "📦 Building mailtrash-${comp_lower}..."
    docker build --no-cache -f "$dockerfile_path" -t "mailtrash-${comp_lower}:latest" "$build_context"
    echo "✅ mailtrash-${comp_lower} built successfully!"
}

# Function to deploy a project
deploy_project() {
    local project=$1
    local project_dir
    local chart_dir

    # Handle case sensitivity for MailTrash
    if [ "$project" = "mailtrash" ]; then
        project_dir="${PROJECTS_DIR}/MailTrash"
    else
        project_dir="${PROJECTS_DIR}/${project}"
    fi

    chart_dir="${project_dir}/${project}-chart"

    echo ""
    echo "🔄 Deploying ${project} with Helm..."
    helm upgrade --install "$project" "$chart_dir"

    echo ""
    echo "♻️  Restarting ${project} pods to use new images..."

    # Try to restart with app label first
    if kubectl rollout restart deployment -l app=${project}; then
        echo "✅ Deployments restarted successfully"
    elif kubectl rollout restart deployment -l app.kubernetes.io/name=${project}; then
        echo "✅ Deployments restarted successfully"
    else
        echo "❌ ERROR: Failed to restart deployments!"
        echo "   No deployments found with labels app=${project} or app.kubernetes.io/name=${project}"
        kubectl get deployments --show-labels | grep -i ${project} || echo "   No deployments found for ${project}"
        return 1
    fi

    echo ""
    echo "⏳ Waiting for ${project} pods to be ready..."

    # Wait for pods with better error handling
    if kubectl wait --for=condition=ready pod -l app=${project} --timeout=90s 2>&1; then
        echo "✅ Pods are ready!"
    elif kubectl wait --for=condition=ready pod -l app.kubernetes.io/name=${project} --timeout=90s 2>&1; then
        echo "✅ Pods are ready!"
    else
        echo "⚠️  Warning: Timeout waiting for pods. Checking pod status..."
        kubectl get pods -l app=${project} -o wide 2>/dev/null || kubectl get pods -l app.kubernetes.io/name=${project} -o wide
        echo "   Pods may still be starting. Check logs if issues persist."
    fi

    # Show pod ages to verify they restarted
    echo ""
    echo "📅 New pod ages:"
    kubectl get pods -l app=${project} -o wide 2>/dev/null || kubectl get pods -l app.kubernetes.io/name=${project} -o wide
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
echo "📊 Final deployment status:"
echo ""

# Show pods for the deployed project(s)
if [ "$PROJECT" = "portfolio" ]; then
    echo "Portfolio pods:"
    kubectl get pods -l app.kubernetes.io/name=portfolio -o wide 2>/dev/null || kubectl get pods -l app=portfolio -o wide
    echo ""
    echo "Docker images in minikube:"
    eval $(minikube docker-env)
    docker images | grep portfolio | head -5
elif [ "$PROJECT" = "mailtrash" ]; then
    echo "MailTrash pods:"
    kubectl get pods -l app.kubernetes.io/name=mailtrash -o wide 2>/dev/null || kubectl get pods -l app=mailtrash -o wide
    echo ""
    echo "Docker images in minikube:"
    eval $(minikube docker-env)
    docker images | grep mailtrash | head -5
else
    # Show both projects
    echo "Portfolio pods:"
    kubectl get pods -l app.kubernetes.io/name=portfolio -o wide 2>/dev/null || kubectl get pods -l app=portfolio -o wide 2>/dev/null || echo "  None found"
    echo ""
    echo "MailTrash pods:"
    kubectl get pods -l app.kubernetes.io/name=mailtrash -o wide 2>/dev/null || kubectl get pods -l app=mailtrash -o wide 2>/dev/null || echo "  None found"
fi

# Show access info
echo ""
echo "🌐 Access your applications:"
echo "   Portfolio: https://seanhankins.com"
echo "   MailTrash: https://mail.seanhankins.com"
echo ""
echo "💡 TIP: Verify your changes are live by checking the pod AGE above."
echo "   New pods should be less than a few minutes old."
