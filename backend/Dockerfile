# Usa uma imagem oficial do Java 21 com Maven já instalado
FROM maven:3.9.6-eclipse-temurin-21 AS build

# Define a pasta de trabalho
WORKDIR /app

# Copia todo o conteúdo da pasta backend
COPY . .

# Compila o projeto e gera o arquivo .jar
RUN mvn clean package -DskipTests

# Estágio de execução (manted o container leve)
FROM eclipse-temurin:21-jdk-alpine
WORKDIR /app

# Copia apenas o .jar gerado no estágio anterior
COPY --from=build /app/target/*.jar app.jar

# Expõe a porta do Spring Boot
EXPOSE 10000

# Executa a aplicação
CMD ["java", "-jar", "app.jar"]
