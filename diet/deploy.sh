#ADD DSN ENV

sudo docker rm -f diets

sudo docker pull smwest3/diets

sudo docker run -d \
--network customnetwork \
-p 5400:5400 \
-e DSN="sqlserver://sa:C0d3-aj1d3x@172.18.0.2:1433?database=ajidexdb&connectiontimeout=0" \
-e ADDR=":5400" \
--name diets \
smwest3/diets:latest

exit