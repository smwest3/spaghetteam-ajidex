npm run build

docker build -t smwest3/ajiclient .

docker push smwest3/ajiclient

ssh smwest3@ajidex.capstone.ischool.uw.edu < deploy.sh