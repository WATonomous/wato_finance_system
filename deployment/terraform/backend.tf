// Misc. Deployment Resources:

// Variables in env file:
# ATLAS_URI=<YOUR_MONGO_ATLAS_URI_HERE>
# MAILJET_API_KEY=<YOUR_MAILJET_API_KEY>
# MAILJET_SECRET_KEY=<YOUR_MAILJET_SECRET_KEY>
# FINANCE_EMAIL=<EMAIL_WHERE_YOU_WANT_TO_SEND_FROM>
# EMAIL_RECIPIENTS=<EMAILS_TO_RECEIVE_SEPERATED_BY_COMMA_(NO_SPACE)>
# CLIENT_URL=http://localhost:3000

variable "backend_env_file_path" {
  type = string
  description = "path to .env file in provisioner"
}

variable "backend_service_account_path" {
  type = string
  description = "path to serviceAccountKey.json file in provisioner"
}

// Secrets

resource "kubernetes_secret" "backend_env_vars" {
  metadata {
    name = "wato-finance-backend-env-vars"
    namespace = data.kubernetes_namespace.wato_finance_backend.metadata[0].name
  }
  data = {
    ".env" = file(var.backend_env_file_path)
    "serviceAccountKey.json" = file(var.backend_service_account_path)
  }
}

// Deployment

resource "kubernetes_deployment" "wato_finance_backend_deployment" {
  metadata {
    name        = local.backend_app_name
    namespace   = data.kubernetes_namespace.wato_finance_backend.metadata[0].name
    annotations = {
      "reloader.stakater.com/auto" = "true"
    }
  }
  spec {
    replicas = 1
    selector {
      match_labels = {
        app = local.backend_app_name
      }
    }
    template {
      metadata {
        labels = {
          app = local.backend_app_name
        }
      }
      spec {
        container {
          image = local.backend_image
          name  = local.backend_app_name
          image_pull_policy = "Always"
          port { 
            container_port = local.backend_app_port
          } 
          # dynamic `for_each` can't work with sensitive values: https://github.com/hashicorp/terraform/issues/29744
          # Note that no sensitive data is shown here, volume_mount.key is non-sensitive
          dynamic "volume_mount" {
            for_each = nonsensitive(kubernetes_secret.backend_env_vars.data)
            content {
              name       = local.backend_env_volume_name
              mount_path = join("", ["/usr/src/app/backend/", volume_mount.key])
              sub_path   = volume_mount.key
              read_only  = true
            }
          }
          volume_mount { // volume mount for user directory
             name       = local.user_directory_volume_name
             mount_path = "/usr/src/app/backend/user_directory.json"
             sub_path   = "user_directory.json"
             read_only  = true
          }
          // TODO: is this even needed?
          security_context {
            allow_privilege_escalation = false
            run_as_non_root            = false
            capabilities {
              drop = ["ALL"]
            }
            seccomp_profile {
              type = "RuntimeDefault"
            }
          }
        }
        volume { # volume containing .env file and service account key
          name = local.backend_env_volume_name
          secret {
            secret_name = kubernetes_secret.backend_env_vars.metadata[0].name
          }
        }
        volume { # volume containing user directory
          name = local.user_directory_volume_name
          secret {
            secret_name = data.kubernetes_secret.user_directory_json.metadata[0].name
          }
        }
        toleration { # Allow scheduling on spot nodes.
          key = "kubernetes.azure.com/scalesetpriority"
          operator = "Equal"
          value = "spot"
          effect = "NoSchedule"
        }
      }
    }
  }

  lifecycle {
    ignore_changes = [ 
      spec[0].template[0].metadata[0].annotations["reloader.stakater.com/last-reloaded-from"]
    ]
  }
}
