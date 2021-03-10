#ADD DSN ENV

sudo docker rm -f restaurants

sudo docker pull smwest3/ajirestaurants

sudo docker run -d \
--network customNetwork \
-p 5300:5300 \
-e ADDR=":5300" \
--name restaurants \
smwest3/ajirestaurants:latest

exit