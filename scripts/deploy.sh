#!/bin/bash

# 确保脚本在错误时退出
set -e

# 定义变量
REMOTE_HOST="root@ssgeek.com"
REMOTE_DIR="/usr/local/nginx/html/www.ssgeek.com"
LOCAL_DIR="build"

# 检查本地构建目录是否存在
if [ ! -d "$LOCAL_DIR" ]; then
    echo "错误：构建目录 $LOCAL_DIR 不存在，请先运行 make build"
    exit 1
fi

# 检查 ads.txt 文件是否存在
if [ ! -f "scripts/ads.txt" ]; then
    echo "错误：scripts/ads.txt 文件不存在"
    exit 1
fi

# 拷贝 ads.txt 到构建目录
echo "正在拷贝 ads.txt 到构建目录..."
cp scripts/ads.txt "$LOCAL_DIR/"

# 使用 rsync 同步文件
echo "正在部署到服务器..."
rsync -az --delete --stats \
    --exclude '.DS_Store' \
    --exclude 'node_modules' \
    "$LOCAL_DIR/" "$REMOTE_HOST:$REMOTE_DIR/"

# 修改远程文件属组
echo "正在修改远程文件属组..."
ssh "$REMOTE_HOST" "chown -R www:www $REMOTE_DIR/*"

echo "部署完成！"
