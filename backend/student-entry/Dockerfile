FROM golang:1.21-alpine AS builder
WORKDIR /build

COPY go.mod ./
COPY go.sum ./
RUN go mod download

COPY main.go ./
RUN go build -o app main.go

FROM alpine:3.16
WORKDIR /space
COPY --from=builder /build/app bin/app
COPY out/ /space/out/

# EXPOSE 8000
ENTRYPOINT ["/bin/sh", "-c", "/space/bin/app"]
