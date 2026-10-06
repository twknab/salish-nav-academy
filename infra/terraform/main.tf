/**
 * Salish Nav Academy on Cloud Run: one static page served by nginx.
 * Scales to zero, so an idle site costs nothing beyond stored images.
 */

locals {
  apis = [
    "run.googleapis.com",
    "artifactregistry.googleapis.com",
    "cloudbuild.googleapis.com",
  ]
}

resource "google_project_service" "enabled" {
  for_each = toset(local.apis)
  service  = each.value

  # This is an existing, shared project: never switch its APIs off on destroy.
  disable_on_destroy = false
}

resource "google_artifact_registry_repository" "site" {
  repository_id = var.service_name
  location      = var.region
  format        = "DOCKER"
  description   = "Images for ${var.service_name}"

  cleanup_policies {
    id     = "keep-recent"
    action = "KEEP"
    most_recent_versions {
      keep_count = 5
    }
  }
  cleanup_policies {
    id     = "delete-old"
    action = "DELETE"
    condition {
      older_than = "2592000s" # 30 days; the KEEP policy above always wins for the newest 5
    }
  }

  depends_on = [google_project_service.enabled]
}

# Runtime identity. A static site needs no permissions, so it gets none.
resource "google_service_account" "site" {
  account_id   = substr(var.service_name, 0, 30)
  display_name = "${var.service_name} runtime"
}

resource "google_cloud_run_v2_service" "site" {
  name                = var.service_name
  location            = var.region
  ingress             = "INGRESS_TRAFFIC_ALL"
  deletion_protection = false

  template {
    service_account = google_service_account.site.email

    scaling {
      min_instance_count = 0
      max_instance_count = var.max_instances
    }

    containers {
      image = var.image

      ports {
        container_port = 8080
      }

      resources {
        limits = {
          cpu    = "1"
          memory = "256Mi"
        }
        cpu_idle = true
      }

      startup_probe {
        http_get {
          path = "/healthz"
        }
      }
    }
  }

  lifecycle {
    # scripts/deploy.sh owns what is running. Without this, every plan after a deploy would roll the
    # service back to the placeholder image.
    ignore_changes = [
      template[0].containers[0].image,
      client,
      client_version,
    ]
  }

  depends_on = [google_project_service.enabled]
}

resource "google_cloud_run_v2_service_iam_member" "public" {
  count    = var.public ? 1 : 0
  name     = google_cloud_run_v2_service.site.name
  location = google_cloud_run_v2_service.site.location
  role     = "roles/run.invoker"
  member   = "allUsers"
}
