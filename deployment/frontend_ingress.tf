resource "kubernetes_manifest" "wato_finance_frontend_service" {
  manifest = {
    apiVersion = "v1"
    kind = "Service"
    metadata = {
      name = "wato-finance-frontend-service"
      namespace = kubernetes_namespace.wato_finance_frontend.metadata[0].name
    }
    spec = {
      selector = {
        app = local.frontend_app_name
      }
      ports = [
        {
          protocol = "TCP"
          port = 80
          targetPort = local.frontend_app_port
        }
      ]
      type = "ClusterIP"
    }
  }
}

resource "kubernetes_manifest" "wato_finance_frontend_ingress" {
  manifest = {
    apiVersion = "networking.k8s.io/v1"
    kind = "Ingress"
    metadata = {
      name = "wato-finance-frontend-ingress"
      namespace = kubernetes_namespace.wato_finance_frontend.metadata[0].name
      annotations = {
        "nginx.ingress.kubernetes.io/rewrite-target" = "/$1"
        # Rate limit requests so that we don't get DOS'd:
        # https://stackoverflow.com/a/64428560
        "nginx.ingress.kubernetes.io/limit-rpm" = "10"
      }
    }
    spec = {
      ingressClassName = "nginx"
      rules = [
        {
          host = local.frontend_hostname
          http = {
            paths = [
              {
                path = "/(.*)"
                pathType = "Exact"
                backend = {
                  service = {
                    name = kubernetes_manifest.wato_finance_frontend_service.manifest.metadata.name
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
