# Blockchain Academic Certificates

Dự án này triển khai một hệ thống quản lý chứng chỉ học thuật dựa trên blockchain sử dụng Hyperledger Fabric 2.2.19.

## Yêu cầu hệ thống

- Ubuntu phiên bản >= 22.x
- Node.js phiên bản 20.x trở lên
- MongoDB phiên bản 6.0 trở lên
- Docker và Docker Compose
- Hyperledger Fabric 2.2.19
- Go phiên bản 1.20 trở lên

## Cài đặt các công cụ cần thiết

### 1. Cài đặt git, curl, docker
- Đầy đủ `https://hyperledger-fabric.readthedocs.io/en/release-2.5/prereqs.html#linux`
- Ví dụ cài đặt docker
```bash
sudo apt-get update
sudo apt-get install -y docker.io docker-compose
sudo systemctl start docker
sudo systemctl enable docker
# Thay $USER bằng tên user trên máy linux của bạn
sudo usermod -aG docker $USER
```

### 2. Cài đặt Node.js và npm
```bash
# Ubuntu/Debian:
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
. "$HOME/.nvm/nvm.sh"
nvm install 22
node -v
npm -v
```

### 3. Cài đặt MongoDB
```bash
# Ubuntu/Debian:
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
```
### 4. Cài đặt hyperledger fabric
- Recommendation project struture
```bash
# Ví dụ mình thì <your_github_userid> là Phongngohong08
mkdir -p $HOME/go/src/github.com/<your_github_userid>
cd $HOME/go/src/github.com/<your_github_userid>
```

- To get the install script:
```bash
curl -sSLO https://raw.githubusercontent.com/hyperledger/fabric/main/scripts/install-fabric.sh && chmod +x install-fabric.sh
```

- To pull the Docker containers and clone the samples repo, run one of these commands for example
```bash
./install-fabric.sh docker samples binary
```

- Refer `https://hyperledger-fabric.readthedocs.io/en/release-2.5/install.html`

## Chạy dự án

### 1. Clone repository
```bash
cd ~
cd $HOME/go/src/github.com/<your_github_userid>
git clone https://github.com/Phongngohong08/blockchain-certificate.git
cd blockchain-certificate
```

### 2. Khởi động mạng Fabric
```bash
# Di chuyển đến thư mục test-network của Fabric
cd ~
cd $HOME/go/src/github.com/<your_github_userid>
cd fabric-samples/test-network

# Dọn dẹp mạng cũ
./network.sh down

# Khởi động mạng với Leveldb
./network.sh up createChannel -ca

# Cài đặt và khởi tạo chaincode
./network.sh deployCC -ccn blockchain-certificate -ccp ../../blockchain-certificate/chaincode -ccl javascript
```

### 3. Cài đặt và chạy ứng dụng web

#### Backend (Node.js/Express)
```bash
cd web-dev/server
cp .env.example .env # hoặc tự tạo file .env theo mẫu
npm install
npm start
```

#### Frontend (ReactJS) (Hiện tại front-end chưa fix xong dùng tạm swagger http://localhost:3002/api-docs)
```bash
cd web-dev/client
cp .env.example .env # hoặc tự tạo file .env theo mẫu
npm install
npm start
```

- Backend mặc định chạy ở http://localhost:3002
- Frontend mặc định chạy ở http://localhost:3000

### 4. Cấu hình biến môi trường
- Tham khảo file `.env.example` trong `web-dev/server/` và `web-dev/client/` để cấu hình đúng các biến môi trường cần thiết.

## Cấu trúc dự án

- `chaincode/`: Chứa mã nguồn smart contract
- `web-dev/`: Ứng dụng web (Node.js backend + ReactJS frontend)
    - `server/`: Backend Node.js/Express
    - `client/`: Frontend ReactJS