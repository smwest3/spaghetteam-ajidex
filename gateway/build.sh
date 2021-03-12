GOOS=linux go build

docker build -t smwest3/ajigateway .

go clean

docker push smwest3/ajigateway