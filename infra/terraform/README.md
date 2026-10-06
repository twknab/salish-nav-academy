# Hosting on Cloud Run

Terraform for serving Salish Nav Academy as a public site on Cloud Run, in an **existing** GCP
project. The site is one static HTML file behind an unprivileged nginx. It scales to zero, so an
idle site costs almost nothing.

**Nothing here has been applied.** It validates (`terraform validate`, google provider 6.50), and
you run `apply` yourself.

## What it creates

| Resource | Why |
| --- | --- |
| APIs: Cloud Run, Artifact Registry, Cloud Build | Enabled explicitly. Never disabled on destroy, because the project is shared. |
| Artifact Registry repo | Holds the images. It keeps the newest 5 and deletes images older than 30 days. |
| Service account | The runtime identity. It is granted **no roles**, because a static site needs none. |
| Cloud Run v2 service | 0–2 instances, 1 vCPU / 256 MiB, port 8080, startup probe on `/healthz`. |
| `allUsers` → `roles/run.invoker` | Makes the site public. Controlled by `public`. |

Terraform owns the infrastructure, and `scripts/deploy.sh` owns which image is running. The service
ignores image changes, so a plan after a deploy never rolls the site back.

## One-time setup

Terraform state lives in a GCS bucket. Creating that bucket is the single manual step:

```bash
PROJECT=your-existing-project-id
gcloud storage buckets create "gs://${PROJECT}-tfstate" \
  --project "$PROJECT" --location us-west1 --uniform-bucket-level-access
gcloud storage buckets update "gs://${PROJECT}-tfstate" --versioning
```

## Create the service

```bash
cd infra/terraform
cp terraform.tfvars.example terraform.tfvars   # set project_id (this file is git-ignored)
terraform init -backend-config="bucket=${PROJECT}-tfstate"
terraform plan -out=tfplan                     # read it before applying
terraform apply tfplan
```

The first apply runs Google's placeholder "hello" image, so the URL works straight away.

## Deploy the app

From the repo root, signed in with `gcloud auth login`:

```bash
npm run deploy      # = scripts/deploy.sh: Cloud Build image → gcloud run deploy
```

The image is tagged with the git commit, plus `-dirty` if you have uncommitted changes. The script
prints the live URL at the end.

## If the public binding fails

If the project's organisation enforces **Domain restricted sharing**
(`constraints/iam.allowedPolicyMemberDomains`), the `allUsers` grant is refused. Either allow it
for this project, or set `public = false` and grant `roles/run.invoker` to specific accounts.

## Custom domain later

Add a `google_cloud_run_domain_mapping` (or a load balancer) for something like
`nav.timknab.dev`, then create the DNS record it asks for.

## Teardown

```bash
terraform destroy
```

APIs stay enabled. The state bucket stays until you delete it.
