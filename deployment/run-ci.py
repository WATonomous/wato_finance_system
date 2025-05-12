import os
import subprocess
import tempfile
import typer
from dotenv import dotenv_values


# Should be run from the finance system repo base

app = typer.Typer()

REQUIRED_ENV_VARS = [
    "TERRAFORM_CLOUD_TOKEN",
    "VCLUSTER_KUBECONFIG_B64",
    "BACKEND_ENV_FILE_B64",
    "BACKEND_SERVICE_ACCOUNT_FILE_B64",
    "FRONTEND_ENV_FILE_B64"
]

WORKING_DIR = "/app"
DEPLOYMENT_DIR = "./deployment"
DOCKERFILE_PATH = f"{DEPLOYMENT_DIR}/provision.Dockerfile"
DOCKER_IMAGE_NAME = "wato-finance-provisioner"
ENV_FILE_PATH = f"{DEPLOYMENT_DIR}/.env"


@app.command()
def run(
    dry_run: bool = typer.Option(False, help="Run in dry-run mode"),
    use_interactive: bool = typer.Option(False, help=""),
    use_local_env: bool = typer.Option(False, help="Use pre-existing .env file with Docker")
):
    print("[INFO]: Building Docker image...")
    subprocess.run(["docker", "build", "-f", DOCKERFILE_PATH, "-t", DOCKER_IMAGE_NAME, "."], check=True)

    env_args = []
    env_file_lines = []

    if dry_run:
        env_args.extend(["--env", "DRY_RUN=true"])

    if use_local_env:
        env_vars = dotenv_values(ENV_FILE_PATH)
        for var, value in env_vars.items():
            env_file_lines.append(f"{var}={value}")
    else:
        for var in REQUIRED_ENV_VARS:
            env_file_lines.append(f"{var}={os.environ[var]}")

    # we need to build the env file like this because docker --env-file is weird.
    # https://github.com/docker/cli/issues/3630
    with tempfile.NamedTemporaryFile(mode='w', newline='\n') as env_file:
        for line in env_file_lines:
            env_file.write(f"{line}\n")
        env_file.flush()

        docker_flags = [
            "run", "--rm",
            *env_args,
            "--env-file", env_file.name,
            "-v", f"{DEPLOYMENT_DIR}:{WORKING_DIR}",
        ]
        if use_interactive:
            docker_flags.append("-it")
            docker_command = ["sh"]
        else:
            docker_command = ["python3", f"{WORKING_DIR}/provision.py", "--auto-approve"]

        docker_invocation = ["docker"] + docker_flags + [DOCKER_IMAGE_NAME] + docker_command
        print(f"[INFO]: {docker_invocation=}")
        subprocess.run(docker_invocation, check=True)


if __name__ == "__main__":
    app()
