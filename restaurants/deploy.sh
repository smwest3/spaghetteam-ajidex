#ADD DSN ENV

sudo docker rm -f restaurants

sudo docker pull smwest3/restaurants

sudo docker run -d \
--network customnetwork \
-p 5300:5300 \
-e DSN="sqlserver://sa:C0d3-aj1d3x@172.18.0.2:1433?database=ajidexdb&connectiontimeout=0" \
-e ADDR=":5300" \
--name restaurants \
smwest3/restaurants:latest

exit