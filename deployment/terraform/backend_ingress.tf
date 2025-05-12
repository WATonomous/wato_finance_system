resource "kubernetes_manifest" "wato_finance_backend_service" {
  manifest = {
    apiVersion = "v1"
    kind = "Service"
    metadata = {
      name = "wato-finance-backend-service"
      namespace = data.kubernetes_namespace.wato_finance_backend.metadata[0].name
    }
    spec = {
      selector = {
        app = local.backend_app_name
      }
      ports = [
        {
          protocol = "TCP"
          port = 80
          targetPort = local.backend_app_port
        }
      ]
      type = "ClusterIP"
    }
  }
}

resource "kubernetes_manifest" "wato_finance_backend_ingress" {
  manifest = {
    apiVersion = "networking.k8s.io/v1"
    kind = "Ingress"
    metadata = {
      name = "wato-finance-backend-ingress"
      namespace = data.kubernetes_namespace.wato_finance_backend.metadata[0].name
      annotations = {
        "nginx.ingress.kubernetes.io/rewrite-target" = "/$1"
        "nginx.ingress.kubernetes.io/enable-cors" = "true"
        "nginx.ingress.kubernetes.io/cors-allow-origin" = join(",", local.backend_allowed_origins)
        # Rate limit requests so that we don't get DOS'd:
        # https://stackoverflow.com/a/64428560
        "nginx.ingress.kubernetes.io/limit-rps" = "10"
      }
    }
    spec = {
      ingressClassName = "nginx"
      rules = [
        {
          host = local.backend_hostname
          http = {
            paths = [
              {
                path = "/(.*)"
                pathType = "Exact"
                backend = {
                  service = {
                    name = kubernetes_manifest.wato_finance_backend_service.manifest.metadata.name
                    port = {
                      number = 80
                    }
                  }
                }
              }
            ]
          }
        }
      ]
    }
  }
}
