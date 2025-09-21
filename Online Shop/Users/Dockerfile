# api-gateway/Dockerfile
FROM openjdk:21-jdk-slim

# Crear usuario y grupo para Debian (sintaxis correcta)
RUN groupadd --system spring && useradd --system --gid spring spring

WORKDIR /Online Shop

COPY target/*.jar app.jar

# Cambiar propietario del archivo jar
RUN chown spring:spring app.jar

# Usuario no root
USER spring:spring

EXPOSE 8086

ENTRYPOINT ["java", "-jar", "app.jar"]