docker build -t smwest3/ajidb .

docker push smwest3/ajidb

ssh smwest3@ajidex.capstone.ischool.uw.edu < deploy.sh