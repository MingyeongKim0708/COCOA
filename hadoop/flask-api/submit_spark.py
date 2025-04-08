import subprocess
import os
from dotenv import dotenv_values
from logging_setup import setup_logger
import time

logger = setup_logger("SubmitSpark")

MAX_RETRY = 1

SPARK_SUBMIT_ARGS = [
    "--driver-memory", "1g",
    "--executor-memory", "2g",
    "--num-executors", "3",
    "--executor-cores", "1",
    "--conf", "spark.executor.memoryOverhead=1024"
]

def load_env_as_conf(env_path=".env"):
    env_vars = dotenv_values(env_path)
    conf_args = []
    for key, value in env_vars.items():
        conf_args += ["--conf", f"spark.executorEnv.{key}={value}"]
        conf_args += ["--conf", f"spark.yarn.appMasterEnv.{key}={value}"]
    return conf_args


def submit_job(cosmetic_id):
    start_total = time.time()
    conf_args = load_env_as_conf()

    for i in range(MAX_RETRY):
        start = time.time()
        logger.info(f"Starting Spark job for cosmetic_id={cosmetic_id}")

        result = subprocess.run([
            "spark-submit",
            "--master", "yarn",
            "--deploy-mode", "cluster",
            "--conf", "spark.yarn.archive=hdfs://namenode:9000/spark/jars-archive/spark-jars.zip",
            "--py-files", "hdfs://namenode:9000/spark/deps.zip",
            *conf_args,
            *SPARK_SUBMIT_ARGS,
            "./spark_jobs/analyze_keywords.py",
            str(cosmetic_id)
        ], capture_output=True, text=True)
        
        end = time.time()
        duration = end - start

        if result.returncode == 0:
            logger.info(f"[JobSuccess] cosmetic_id={cosmetic_id} (SparkDuration: {duration:.2f}s)")
            return True
            
        # 실패했을 때 로그 저장
        error_log_path = f"/app/logs/submit_error_{cosmetic_id}_attempt_{i+1}.log"
        output_log_path = f"/app/logs/submit_output_{cosmetic_id}_attempt_{i+1}.log"
        os.makedirs("/app/logs", exist_ok=True)

        with open(error_log_path, "w") as f_err, open(output_log_path, "w") as f_out:
            f_err.write(result.stderr)
            f_out.write(result.stdout)

        logger.warning(f"[Retry] Failed attempt {i+1}/{MAX_RETRY} cosmetic_id={cosmetic_id} (duration: {duration:.2f}s)")
        logger.warning(result.stderr)

    logger.error(f"[JobFailed] cosmetic_id={cosmetic_id} after {MAX_RETRY} attempts")
    return False