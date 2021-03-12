FROM microsoft/mssql-server-linux:2017-latest
ENV ACCEPT_EULA=Y
ENV SA_PASSWORD=C0d3-aj1d3x
RUN mkdir -p /opt/mssql-scripts
COPY schema.sql /opt/mssql-scripts
RUN ( /opt/mssql/bin/sqlservr --accept-eula & ) | grep -q "Service Broker manager has started" \
    && /opt/mssql-tools/bin/sqlcmd -S localhost -U SA -P 'C0d3-aj1d3x' -i /opt/mssql-scripts/schema.sql \
    && pkill sqlservr 