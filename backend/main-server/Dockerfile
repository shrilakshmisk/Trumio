# Build stage
FROM golang:1.20-alpine AS builder
WORKDIR /build

# Mount Docker socket during build
VOLUME /var/run/docker.sock

COPY go.mod ./
COPY go.sum ./
RUN go mod download
COPY cmd/ cmd/
COPY pkg/ pkg/
RUN CGO_ENABLED=0 GOOS=linux go build -a -o app cmd/web/main.go

# Final stage
FROM alpine:3.16
WORKDIR /space
COPY --from=builder /build/app bin/app

# Install Docker client
RUN apk --no-cache add docker

COPY out/ /space/out/

# EXPOSE 8001
ENTRYPOINT ["/bin/sh", "-c", "/space/bin/app"]
