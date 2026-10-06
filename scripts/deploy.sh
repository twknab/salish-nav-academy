#!/usr/bin/env bash
# Build the image with Cloud Build and roll it out to the Cloud Run service Terraform created.
# Run from the repo root after `terraform apply` in infra/terraform.
set -euo pipefail

TF_DIR="infra/terraform"
out() { terraform -chdir="$TF_DIR" output -raw "$1"; }

REPO="$(out image_repo)"
SERVICE="$(out service_name)"
REGION="$(out region)"
PROJECT="$(echo "$REPO" | cut -d/ -f2)"
TAG="$(git rev-parse --short HEAD)$(git diff --quiet || echo -dirty)"
IMAGE="$REPO/app:$TAG"

echo "Building $IMAGE"
gcloud builds submit --project "$PROJECT" --region "$REGION" --tag "$IMAGE" .

echo "Deploying to $SERVICE ($REGION)"
gcloud run deploy "$SERVICE" --project "$PROJECT" --region "$REGION" --image "$IMAGE" --quiet

echo "Live at: $(out url)"
