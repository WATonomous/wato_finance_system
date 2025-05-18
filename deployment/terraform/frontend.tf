// Misc. Deployment Resources:

resource "kubernetes_namespace" "wato_finance_frontend" {
  metadata {
    name = "wato-finance-frontend"
  }
}

// Variables in env file:
# REACT_APP_API_KEY=<YOUR_FIREBASE_API_KEY>
# REACT_APP_AUTH_DOMAIN=<YOUR_FIREBASE_AUTH_DOMAIN>
# REACT_APP_PROJECT_ID=<YOUR_FIREBASE_PROJECT_ID>
# REACT_APP_STORAGE_BUCKET=<YOUR_FIREBASE_STORAGE_BUCKET>
# REACT_APP_MESSAGING_SENDER_ID=<YOUR_FIREBASE_MESSAGING_SENDER_ID>
# REACT_APP_APP_ID=<YOUR_FIREBASE_API_ID>
# REACT_APP_BACKEND_URL=http://localhost:5000

variable "frontend_env_file_path" {
  type = string
  description = "path to .env file in provisioner"
}

// Secrets

resource "kubernetes_secret" "frontend_env_vars" {
  metadata {
    name = "wato-finance-frontend-env-vars"
    namespace = kubernetes_namespace.wato_finance_frontend.metadata[0].name
  }
  data = {
    ".env" = file(var.frontend_env_file_path)
  }
}

// Deployment

resource "kubernetes_deployment" "wato_finance_frontend_deployment" {
  metadata {
    name        = local.frontend_app_name
    namespace   = kubernetes_namespace.wato_finance_frontend.metadata[0].name
    annotations = {
      "reloader.stakater.com/auto" = "true"
    }
  }
  spec {
    replicas = 1
    selector {
      match_labels = {
        app = local.frontend_app_name
      }
    }
    template {
      metadata {
        labels = {
          app = local.frontend_app_name
        }
      }
      spec {
        container {
          image = local.frontend_image
          name  = local.frontend_app_name
          image_pull_policy = "Always"
          port { 
            container_port = local.frontend_app_port
          } 
          volume_mount {
            name       = local.frontend_env_volume_name
            mount_path = "/usr/src/app/frontend/.env"
            sub_path   = ".env"
            read_only  = true
          }
          # TODO: Add these correctly
          # liveness_probe {
          #   http_get {
          #     path = "/"
          #     port = local.frontend_app_port
          #   }
          #   period_seconds    = 10
          #   timeout_seconds   = 5
          #   failure_threshold = 3
          # }
          # startup_probe {
          #   http_get {
          #     path = "/"
          #     port = local.frontend_app_port
          #   }
          #   period_seconds        = 10
          #   timeout_seconds       = 5
          #   failure_threshold     = 12
          # }
          security_context {
            allow_privilege_escalation = false
            run_as_non_root            = true
            run_as_user                = 12345 # from vcluster's security context
            capabilities {
              drop = ["ALL"]
            }
            seccomp_profile {
              type = "RuntimeDefault"
            }
          }
          resources {
            limits = {
              cpu    = "500m"
              memory = "2Gi"
              ephemeral-storage = "1Gi",
            }
            requests = {
              cpu    = "100m"
              memory = "512Mi",
              ephemeral-storage = "512Mi"
            }
          }
        }
        volume {
          name = local.frontend_env_volume_name
          secret {
            secret_name = kubernetes_secret.frontend_env_vars.metadata[0].name
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
