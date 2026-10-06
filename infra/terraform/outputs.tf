output "url" {
  description = "Public URL of the site."
  value       = google_cloud_run_v2_service.site.uri
}

output "service_name" {
  value = google_cloud_run_v2_service.site.name
}

output "region" {
  value = var.region
}

output "image_repo" {
  description = "Artifact Registry path that deploy.sh pushes to."
  value       = "${var.region}-docker.pkg.dev/${var.project_id}/${google_artifact_registry_repository.site.repository_id}"
}
