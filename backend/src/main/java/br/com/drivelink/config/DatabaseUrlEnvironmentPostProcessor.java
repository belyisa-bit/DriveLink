package br.com.drivelink.config;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.env.EnvironmentPostProcessor;
import org.springframework.core.Ordered;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;

import java.net.URI;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

/** Maps Render's DATABASE_URL (postgres://...) to Spring's JDBC properties. */
public class DatabaseUrlEnvironmentPostProcessor implements EnvironmentPostProcessor, Ordered {

    @Override
    public void postProcessEnvironment(ConfigurableEnvironment environment, SpringApplication application) {
        String jdbcUrl = environment.getProperty("SPRING_DATASOURCE_URL");
        String databaseUrl = environment.getProperty("DATABASE_URL");

        if (jdbcUrl != null && !jdbcUrl.isBlank() && !isLocalhostJdbcUrl(jdbcUrl)) {
            return;
        }
        if (databaseUrl == null || databaseUrl.isBlank()) {
            if (Boolean.parseBoolean(environment.getProperty("RENDER", "false"))) {
                throw new IllegalStateException("Configure DATABASE_URL ou SPRING_DATASOURCE_URL no servico Render.");
            }
            return;
        }

        try {
            URI uri = URI.create(databaseUrl);
            String scheme = uri.getScheme();
            if (!"postgres".equalsIgnoreCase(scheme) && !"postgresql".equalsIgnoreCase(scheme)) {
                throw new IllegalArgumentException("DATABASE_URL precisa usar postgres:// ou postgresql://.");
            }
            String path = uri.getRawPath();
            if (path == null || path.length() < 2) {
                throw new IllegalArgumentException("DATABASE_URL nao contem o nome do banco.");
            }

            Map<String, Object> properties = new HashMap<>();
            properties.put("spring.datasource.url", "jdbc:postgresql://" + uri.getRawAuthority().substring(
                    uri.getRawAuthority().lastIndexOf('@') + 1) + path
                    + (uri.getRawQuery() == null ? "" : "?" + uri.getRawQuery()));

            String userInfo = uri.getRawUserInfo();
            if (userInfo != null) {
                int separator = userInfo.indexOf(':');
                if (separator >= 0) {
                    properties.put("spring.datasource.username", decode(userInfo.substring(0, separator)));
                    properties.put("spring.datasource.password", decode(userInfo.substring(separator + 1)));
                } else {
                    properties.put("spring.datasource.username", decode(userInfo));
                }
            }

            environment.getPropertySources().addFirst(new MapPropertySource("renderDatabaseUrl", properties));
        } catch (RuntimeException exception) {
            throw new IllegalStateException("DATABASE_URL do Render nao pode ser convertida para uma URL JDBC.", exception);
        }
    }

    private String decode(String value) {
        return URLDecoder.decode(value, StandardCharsets.UTF_8);
    }

    private boolean isLocalhostJdbcUrl(String value) {
        String normalized = value.toLowerCase(Locale.ROOT);
        return normalized.contains("localhost") || normalized.contains("127.0.0.1");
    }

    @Override
    public int getOrder() {
        return Ordered.HIGHEST_PRECEDENCE;
    }
}
