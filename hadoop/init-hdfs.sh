until hdfs dfs -ls / &>/dev/null; do
  echo "[init-hdfs.sh] Waiting for HDFS..."
  sleep 2
done

hdfs dfs -mkdir -p /input
hdfs dfs -mkdir -p /tmp/reviews
hdfs dfs -mkdir -p /tmp/cosmetics

echo "[init-hdfs.sh] HDFS ���丮 �ʱ�ȭ �Ϸ�"