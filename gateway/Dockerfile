FROM alpine
RUN apk add --no-cache ca-certificates
COPY gateway /ajigateway
EXPOSE 5000
ENTRYPOINT [ "/ajigateway" ]