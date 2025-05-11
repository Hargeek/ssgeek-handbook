# 变量定义
NPM = npm

default: help

# 开发环境运行
.PHONY: run
start: ## 启动开发服务器
	$(NPM) run start

# 构建项目
.PHONY: build
build: ## 构建项目
	$(NPM) run build

# 部署项目
.PHONY: deploy
deploy: build ## 构建并部署项目
	@chmod +x scripts/deploy.sh
	@./scripts/deploy.sh

# 帮助信息
.PHONY: help
help: ## 打印帮助信息
	@cat $(MAKEFILE_LIST) | grep -e "^[a-zA-Z_\-]*:.* ## .*" | awk 'BEGIN {FS = ":.*? ## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}' 