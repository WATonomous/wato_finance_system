# Reloader is a Kubernetes controller that watches changes in ConfigMap and
# Secrets and ensures that any Pods using them are restarted.
# https://github.com/stakater/Reloader

resource "kubernetes_namespace" "reloader" {
  metadata {
    name = "reloader"
  }
}

# https://github.com/stakater/Reloader/blob/master/deployments/kubernetes/chart/reloader/README.md
locals {
  reloader_values = {
    reloader = {
      reloadStrategy = "annotations"
      deployment = {
        containerSecurityContext = {
          allowPrivilegeEscalation = false
          capabilities = {
            drop = ["ALL"]
          }
          seccompProfile = {
            type = "RuntimeDefault"
          }
        }
        resources = {
          requests = {
            cpu: "100m"
            memory = "64Mi"
          }
          limits = {
            cpu    = "200m"
            memory = "128Mi"
          }
        }
      }
    }
  }
}

resource "helm_release" "reloader" {
  name             = "stakater"
  namespace        = kubernetes_namespace.reloader.metadata[0].name
  chart            = "reloader"
  repository       = "https://stakater.github.io/stakater-charts"
  version          = "v1.0.51"
  values = [yamlencode(local.reloader_values)]
}
