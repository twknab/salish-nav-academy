/**
 * Remote state in GCS, partially configured so no project-specific name lives in the code:
 *
 *   terraform init -backend-config="bucket=<project-id>-tfstate"
 *
 * Never local state: it cannot be locked and it is lost with the laptop.
 */
terraform {
  backend "gcs" {
    prefix = "salish-nav-academy"
  }
}
