sudo docker rm -f ajidb

sudo docker pull smwest3/ajidb

sudo docker run -d \
--network customNetwork
-v /etc/letsencrypt:/etc/letsencrypt:ro \
-p 1433:1433 \
--name ajidb \
-e ACCEPT_EULA=Y
-e MSSQL_SA_PASSWORD="c0d3@aj1d3x" \
smwest3/ajidb:latest

sudo docker exec -it mssql "bash" /opt/mssql-tools/bin/sqlcmd -S localhost -U SA -P 'c0d3@aj1d3x' -i /opt/mssql-scripts/schema.sql

exit
