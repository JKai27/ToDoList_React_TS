FROM harbor.marcapo.com/marcapo/node-base:16

COPY --chown=tomcat:tomcat build /opt/marcapoorganizationmanager/build
COPY --chown=tomcat:tomcat node_modules /opt/marcapoorganizationmanager/node_modules
COPY --chown=tomcat:tomcat startserver.sh /opt/marcapoorganizationmanager/startserver.sh
COPY --chown=tomcat:tomcat ./server.ts /opt/marcapoorganizationmanager/server.ts
RUN chmod +x /opt/marcapoorganizationmanager/startserver.sh

WORKDIR /opt/marcapoorganizationmanager/
CMD ./startserver.sh

EXPOSE 8080

ENV SERVICE_8080_TAGS marcapo-service,next-manager
ENV SERVICE_8080_NAME marcapoorganizationmanager
ENV SERVICE_8080_CHECK_HTTP /marcapoorganizationmanager/health

ENV TZ=CET
LABEL com.marcapo.applicationtype=next-module
