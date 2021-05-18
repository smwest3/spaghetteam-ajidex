GOOS=linux go build

docker build -t smwest3/diets .

go clean

docker push smwest3/diets