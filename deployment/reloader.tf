# Reloader is a Kubernetes controller that watches changes in ConfigMap and
# Secrets and ensures that any Pods using them are restarted.
# https://github.com/stakater/Reloader

resource "kubernetes_namespace" "reloader" {
  metadata {
    name = "reloader"
  }
}

resource "helm_release" "reloader" {
  name             = "stakater"
  namespace        = kubernetes_namespace.reloader.metadata[0].name
  chart            = "reloader"
  repository       = "https://stakater.github.io/stakater-charts"
  version          = "v1.0.51"
  values = [<<EOF
    reloader:
      reloadStrategy: annotations
    EOF
  ]
}
