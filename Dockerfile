FROM node:8-alpine

COPY . /workspace
WORKDIR /workspace
RUN npm install

EXPOSE 3000

CMD npm start

# FROM：這裡的 node:8-alpine，來自 Docker Hub 的 node。你想用到的容器，都可以在這邊找到，這個映像檔包含了 nodejs。
# COPY：複製當前目錄到容器中的 /workspace。用意是將程式碼，複製到容器中執行。
# WORKDIR：這邊是指容器的工作目錄，就像 cd workspace 意思一樣，因為我們把檔案複製於該目錄，所以一同切換目錄。
# RUN：執行某個腳本命令，在這邊等同於我們先前所下的 npm install（用於部署階段的指令）。
# EXPOSE：將容器的 3000 port 對外公開。
# CMD：也是執行腳本命令（用於部署完畢的指令）。
# 停止容器：docker stop myapp / 移除容器：docker rm myapp / 查看日誌：docker logs myapp
