import base64
import json
import os
from pathlib import Path
import subprocess
from typing import Callable
import typer


app = typer.Typer()


def base64_decode(x):
    return base64.b64decode(x).decode('utf-8')

class EnvVarToFile:
    def __init__(
        self, 
        env_var, path, 
        decode: Callable[[str], str] = base64_decode
    ):
        self.env_var = env_var
        self.path = path
        self.decode = decode


RUN_DIR = "/run"
TF_CODE_DIR = "./terraform"
TF_VARS = {
    "kube_config_path": EnvVarToFile("VCLUSTER_KUBECONFIG_B64", f"{RUN_DIR}/kube_config"),
    "backend_env_file_path": EnvVarToFile("VCLUSTER_KUBECONFIG_B64", f"{RUN_DIR}/.env-backend"),
    "backend_service_account_path": EnvVarToFile("VCLUSTER_KUBECONFIG_B64", f"{RUN_DIR}/serviceAccountKey.json"),
    "frontend_env_file_path": EnvVarToFile("VCLUSTER_KUBECONFIG_B64", f"{RUN_DIR}/.env-frontend")
}

def set_up_environment():
    in_docker = Path("/.dockerenv").exists()
    if not in_docker:
        raise EnvironmentError("Script is expected to be run in a Docker container.")

    for key, value in TF_VARS.items():
        if isinstance(value, EnvVarToFile):
            env_var, file_path = value.env_var, value.path
            content = value.decode(os.getenv(env_var))
            if content is None:
                raise EnvironmentError(f"Required environment variable '{env_var}' is not set.")
            with open(file_path, "w") as f:
                f.write(content)
            os.environ[f"TF_VAR_{key}"] = file_path
        else:
            os.environ[f"TF_VAR_{key}"] = value


def generate_tf_credentials(token):
    return {
        "credentials": {
            "app.terraform.io": {
                "token": token
            }
        }
    }


def terraform_init():
    TERRAFORM_CLOUD_TOKEN = os.getenv("TERRAFORM_CLOUD_TOKEN")
    if TERRAFORM_CLOUD_TOKEN is None:
        raise EnvironmentError("TERRAFORM_CLOUD_TOKEN environment variable is not set.")

    tf_credentials = generate_tf_credentials(TERRAFORM_CLOUD_TOKEN)
    credentials_path = Path("~/.terraform.d/credentials.tfrc.json").expanduser()
    credentials_path.parent.mkdir(parents=True, exist_ok=True)
    credentials_path.write_text(json.dumps(tf_credentials, indent=2))

    tf_init_cmd = ["terraform", f"-chdir={TF_CODE_DIR}", "init"]
    subprocess.run(tf_init_cmd, check=True)


def terraform_deploy(auto_approve):
    if os.getenv("DRY_RUN"):
        tf_deploy_cmd = ["terraform", f"-chdir={TF_CODE_DIR}", "plan"]
    else:
        tf_deploy_cmd = ["terraform", f"-chdir={TF_CODE_DIR}", "apply"]
        if auto_approve:
            tf_deploy_cmd.append("-auto-approve")
    subprocess.run(tf_deploy_cmd, check=True)


@app.command()
def provision(auto_approve: bool = False):
    set_up_environment()
    terraform_init()
    terraform_deploy(auto_approve)


if __name__ == "__main__":
    app()
