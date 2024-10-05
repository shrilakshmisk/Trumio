#!/bin/bash

install_node_npm() {
    if command -v node &> /dev/null && command -v npm &> /dev/null; then
        echo "Node.js and npm are already installed."
    else
        # Install Node.js and npm
        echo "Installing Node.js and npm..."
        sudo apt-get update
        sudo apt-get install -y nodejs npm
        echo "Node.js and npm have been installed."
    fi
}
echo "Removing student and client containers ..."

docker stop datashieldx-backend_client_1
docker rm datashieldx-backend_client_1
docker stop datashieldx-backend_student_1
docker rm datashieldx-backend_student_1

# Run the function to install Node.js and npm
install_node_npm

cd ../DataShieldX-frontend/client

# Build the frontend
echo "Building frontend (client)..."
npm install
npm run build

# Copy the 'out' folder to the main server directory
rm -rf ../../DataShieldX-backend/main-server/out/
cp -r out/ ../../DataShieldX-backend/main-server/

cd ../student

# Build the frontend
echo "Building frontend (student)..."
npm install
npm run build

# Copy the 'out' folder to the student-entry directory
rm -rf ../../DataShieldX-backend/student-entry/out/
cp -r out/ ../../DataShieldX-backend/student-entry/

# Navigate back to the main server directory
cd ../../DataShieldX-backend

# Check if Docker is installed
if command -v docker &> /dev/null; then
    echo "Docker is already installed."
else
    # Install Docker
    echo "Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    rm get-docker.sh
    echo "Docker has been installed."
fi

# Check if Docker Compose is installed
if command -v docker-compose &> /dev/null; then
    echo "Docker Compose is already installed."
else
    # Install Docker Compose
    echo "Installing Docker Compose..."
    sudo curl -fsSL https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m) -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    echo "Docker Compose has been installed."
fi

# Run docker-compose up
echo "Running docker-compose up..."
docker compose down

docker compose build

docker-compose up -d

echo "Docker Compose is up and running."

chmod +x rocket_chat.sh
./rocket_chat.sh
