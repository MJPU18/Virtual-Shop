# eureka-server/Dockerfile
FROM openjdk:21-jdk-slim

# Crear usuario y grupo para Debian (sintaxis correcta)
RUN groupadd --system spring && useradd --system --gid spring spring

# Directorio de trabajo
WORKDIR /Online Shop

# Copiar el war (cambiar la extensión)
COPY target/*.jar app.jar

# Cambiar propietario
RUN chown spring:spring app.jar

# Usuario no root
USER spring:spring

# Exponer puerto
EXPOSE 8761

# Comando de ejecución
ENTRYPOINT ["java", "-jar", "app.jar"]