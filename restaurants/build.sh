GOOS=linux go build

docker build -t smwest3/ajirestaurants .

go clean

docker push smwest3/ajirestaurants

ssh smwest3@ajidex.capstone.ischool.uw.edu < deploy.sh