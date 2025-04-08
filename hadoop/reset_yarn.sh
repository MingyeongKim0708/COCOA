echo "🛑 Stopping YARN containers..."
docker-compose -p hadoop-cluster -f ./hadoop/docker-compose.yaml stop namenode datanode-1 datanode-2 datanode-3

for NODE in namenode datanode-1 datanode-2 datanode-3; do
  echo "🧹 Cleaning $NODE..."
    docker start $NODE >/dev/null
    docker exec -it $NODE bash -c 'rm -rf /data/yarn/local/filecache/* /data/yarn/local/usercache/*'
done

echo "🔁 Restarting containers..."
docker-compose -p hadoop-cluster -f ./hadoop/docker-compose.yaml up -d --build

echo "✅ YARN containers reset and restarted!"

