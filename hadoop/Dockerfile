FROM ubuntu:20.04

ENV DEBIAN_FRONTEND=noninteractive
ENV HADOOP_VERSION=3.3.4
ENV SPARK_VERSION=3.5.5
ENV HADOOP_HOME=/usr/local/hadoop
ENV SPARK_HOME=/usr/local/spark
ENV JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64
ENV PATH=$PATH:$HADOOP_HOME/bin:$HADOOP_HOME/sbin:$SPARK_HOME/bin:$SPARK_HOME/sbin
ENV HDFS_NAMENODE_USER=root
ENV HDFS_DATANODE_USER=root
ENV HDFS_SECONDARYNAMENODE_USER=root
ENV YARN_RESOURCEMANAGER_USER=root
ENV YARN_NODEMANAGER_USER=root
ENV HADOOP_UMASK=0022

RUN apt-get update && \
    apt-get install -y openjdk-11-jdk-headless curl rsync openssh-server python3 python3-pip g++ wget fonts-nanum zip && \
    apt-get clean
    
RUN mkdir /var/run/sshd && \
    sed -i 's/PermitRootLogin prohibit-password/PermitRootLogin yes/' /etc/ssh/sshd_config && \
    echo "StrictModes no" >> /etc/ssh/sshd_config && \
    mkdir -p /root/.ssh && \
    ssh-keygen -t rsa -f /root/.ssh/id_rsa -q -N "" && \
    cat /root/.ssh/id_rsa.pub >> /root/.ssh/authorized_keys && \
    chmod 600 /root/.ssh/authorized_keys && \
    echo "Host *\n  StrictHostKeyChecking no\n  UserKnownHostsFile=/dev/null" >> /root/.ssh/config && \
    chmod 600 /root/.ssh/config

RUN curl -O https://archive.apache.org/dist/hadoop/common/hadoop-${HADOOP_VERSION}/hadoop-${HADOOP_VERSION}.tar.gz && \
    tar -xzvf hadoop-$HADOOP_VERSION.tar.gz && \
    mv hadoop-$HADOOP_VERSION /usr/local/hadoop && \
    rm hadoop-$HADOOP_VERSION.tar.gz &&\
    sed -i 's|^#\?\s*export JAVA_HOME=.*|export JAVA_HOME='"$JAVA_HOME"'|' $HADOOP_HOME/etc/hadoop/hadoop-env.sh
    
RUN curl -O https://downloads.apache.org/spark/spark-${SPARK_VERSION}/spark-${SPARK_VERSION}-bin-hadoop3.tgz && \
    tar -xzf spark-${SPARK_VERSION}-bin-hadoop3.tgz && \
    mv spark-${SPARK_VERSION}-bin-hadoop3 $SPARK_HOME && \
    rm spark-${SPARK_VERSION}-bin-hadoop3.tgz
    
RUN pip install pyspark konlpy jpype1 psycopg2-binary python-dotenv
    
COPY core-site.xml $HADOOP_HOME/etc/hadoop/core-site.xml
COPY hdfs-site.xml $HADOOP_HOME/etc/hadoop/hdfs-site.xml
COPY yarn-site.xml $HADOOP_HOME/etc/hadoop/yarn-site.xml
COPY mapred-site.xml $HADOOP_HOME/etc/hadoop/mapred-site.xml
COPY init-hdfs.sh /usr/local/bin/init-hdfs.sh
RUN chmod +x /usr/local/bin/init-hdfs.sh

EXPOSE 5000 9000