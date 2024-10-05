#!/bin/bash

# Step 1: Download Rocket.Chat Docker Compose file
curl -L https://raw.githubusercontent.com/RocketChat/Docker.Official.Image/master/compose.yml -O

# Step 2: Create .env file with Rocket.Chat configuration
cat <<EOF > .env
### Rocket.Chat configuration

# Rocket.Chat version
# see:- https://github.com/RocketChat/Rocket.Chat/releases
RELEASE=6.5.0
# MongoDB endpoint (include ?replicaSet= parameter)
MONGO_URL=mongodb+srv://trumio:trumio-db-pass!@rocket-chat-cluster.wg1zzcc.mongodb.net/?retryWrites=true&w=majority
# MongoDB endpoint to the local database
#MONGO_OPLOG_URL=
# IP to bind the process to
#BIND_IP=
# URL used to access your Rocket.Chat instance
ROOT_URL=http://localhost:3000
# Port Rocket.Chat runs on (in-container)
#PORT=
# Port on the host to bi nd to
#HOST_PORT=

### MongoDB configuration
# MongoDB version/image tag
#MONGODB_VERSION=
# See:- https://hub.docker.com/r/bitnami/mongodb

### Traefik config (if enabled)
# Traefik version/image tag
#TRAEFIK_RELEASE=
# Domain for https (change ROOT_URL & BIND_IP accordingly)
#DOMAIN=
# Email for certificate notifications
#LETSENCRYPT_EMAIL=
EOF

# Step 3: Run Docker Compose
docker compose up -d
