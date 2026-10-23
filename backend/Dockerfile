# Usa uma imagem oficial do Java 21 para compilar e rodar
FROM eclipse-temurin:21-jdk-alpine

# Define a pasta de trabalho dentro do container
WORKDIR /app

# Copia o código do backend para o container
COPY . .

# Dá permissão de execução ao Maven Wrapper e faz o build do projeto
RUN chmod +x mvnw
RUN ./mvnw clean package -DskipTests

# Expõe a porta padrão do Spring Boot
EXPOSE 8080

# Executa a aplicação Java
CMD ["java", "-jar", "target/drivelink-backend-0.0.1-SNAPSHOT.jar"]