// Misc. Deployment Resources:

resource "kubernetes_namespace" "wato_finance_frontend" {
  metadata {
    name = "wato-finance-frontend"
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
          liveness_probe {
            http_get {
              path = "/"
              port = local.frontend_app_port
            }
            period_seconds    = 10
            timeout_seconds   = 5
            failure_threshold = 3
          }
          startup_probe {
            http_get {
              path = "/"
              port = local.frontend_app_port
            }
            period_seconds        = 12
            timeout_seconds       = 5
            failure_threshold     = 10
          }
          security_context {
            allow_privilege_escalation = false
            capabilities {
              drop = ["ALL"]
            }
            seccomp_profile {
              type = "RuntimeDefault"
            }
          }
          resources {
            limits = {
              cpu    = "300m"
              memory = "512Mi"
              ephemeral-storage = "1Gi",
            }
            requests = {
              cpu    = "100m"
              memory = "64Mi",
              ephemeral-storage = "512Mi"
            }
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
