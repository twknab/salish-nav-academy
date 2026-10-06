variable "project_id" {
  description = "Existing GCP project to host the site in."
  type        = string
}

variable "region" {
  description = "Region for Cloud Run and Artifact Registry."
  type        = string
  default     = "us-west1"
}

variable "service_name" {
  description = "Cloud Run service name; also names the image repository and service account."
  type        = string
  default     = "salish-nav-academy"
}

variable "image" {
  description = "Image for the FIRST apply only. Later deploys (scripts/deploy.sh) own the running image, and Terraform ignores it from then on."
  type        = string
  default     = "us-docker.pkg.dev/cloudrun/container/hello"
}

variable "public" {
  description = "Grant allUsers the Cloud Run invoker role. Set false if an org policy (domain restricted sharing) forbids it."
  type        = bool
  default     = true
}

variable "max_instances" {
  description = "Upper bound on instances; a static page needs very few."
  type        = number
  default     = 2
}
