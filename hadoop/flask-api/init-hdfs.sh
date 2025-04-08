echo "[flask-api INIT] Zipping Spark jobs"
zip -j /app/spark_jobs/deps.zip /app/spark_jobs/*.py
echo "[flask-api INIT] Zipping Spark-jars"
zip -j /app/spark-jars.zip /usr/local/spark/jars/*.jar

echo "[flask-api INIT] Waiting for HDFS to be ready..."

until hdfs dfs -ls / > /dev/null 2>&1; do
  echo "HDFS not ready, sleeping..."
  sleep 3
done

echo "[flask-api INIT] HDFS is ready, proceeding"
hdfs dfsadmin -safemode leave

echo "[flask-api INIT] Uploading to HDFS"
hdfs dfs -mkdir -p /spark
hdfs dfs -mkdir -p /spark/jars-archive
hdfs dfs -put -f /app/spark_jobs/deps.zip /spark/deps.zip
hdfs dfs -put -f /app/spark-jars.zip /spark/jars-archive/spark-jars.zip