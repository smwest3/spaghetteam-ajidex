FROM alpine
RUN apk add --no-cache ca-certificates
COPY gateway /ajigateway
EXPOSE 443
ENTRYPOINT [ "/ajigateway" ]