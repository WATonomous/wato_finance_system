terraform {
  backend "remote" {
    hostname     = "app.terraform.io"
    organization = "wato-finance"

    workspaces {
      name = "watonomous-finance-system"
    }
  }

  required_providers {
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "2.25.2"
    }
  }
}

variable "kube_config_path" {
  type = string
  description = "The path to the kubeconfig file"
}

provider "kubernetes" {
  config_path = var.kube_config_path
}

locals {
  backend_hostname = "vc-finance-api.watonomous.ca"
  backend_app_name = "wato-finance-backend"
  backend_env_volume_name = "backend-env"
  user_directory_volume_name = "user-directory"
  backend_app_port = 5000
  backend_allowed_origins = [
    "https://cloud.watonomous.ca",
    "https://rgw-preview.watonomous.ca",
    "http://localhost:3000", # local dev
    "https://finance-frontend.watonomous.ca",
    "https://*.use.devtunnels.ms", # vscode tunnel
  ]

  frontend_hostname = "vc-finance-frontend.watonomous.ca"
  frontend_app_name = "wato-finance-frontend"
  frontend_env_volume_name = "frontend-env"
  frontend_app_port = 3000
}

locals {
  backend_image = "ghcr.io/watonomous/wato_finance_system:master-backend"
  frontend_image = "ghcr.io/watonomous/wato_finance_system:master-frontend"
}

// Synced with the vcluster from the host:
// https://www.vcluster.com/docs/vcluster/configure/vcluster-yaml/sync/from-host
data "kubernetes_namespace" "wato_finance_backend" {
  metadata {
    name = "wato-finance-backend"
  }
}

// Synced with the vcluster from the host:
// https://www.vcluster.com/docs/vcluster/configure/vcluster-yaml/sync/from-host
data "kubernetes_secret" "user_directory_json" {
  metadata {
    name = "user-directory-json"
    namespace = data.kubernetes_namespace.wato_finance_backend.metadata[0].name
  }
}
