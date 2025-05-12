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
  // TODO: change images to pull non-root containers
  backend_image = "ghcr.io/watonomous/wato_finance_system:master-frontend@sha256:7b2a02ce48fdc630aac37cbd9165f400fa47a55e107081f21fe4f5351bf392f8"
  frontend_image = "ghcr.io/watonomous/wato_finance_system:master-backend@sha256:d205d34eb68adb1febbada7dca9d5a24ff0f1acd34116eb40c70535cc15990a8"
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
