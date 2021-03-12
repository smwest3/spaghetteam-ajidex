GOOS=linux go build

docker build -t smwest3/restaurants .

go clean

docker push smwest3/restaurants