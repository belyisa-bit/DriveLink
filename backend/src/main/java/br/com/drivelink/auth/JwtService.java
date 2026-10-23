package br.com.drivelink.auth;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.crypto.SecretKey;
import java.security.SecureRandom;
import java.time.Instant;
import java.util.Date;

@Service
public class JwtService {

    private static final Logger log = LoggerFactory.getLogger(JwtService.class);

    private final SecretKey secretKey;
    private final long expirationMinutes;

    public JwtService(
            @Value("${app.security.jwt.secret:}") String secret,
            @Value("${app.security.jwt.expiration-minutes:60}") long expirationMinutes) {

        this.secretKey = loadSecretKey(secret);
        this.expirationMinutes = expirationMinutes;
    }

    private SecretKey loadSecretKey(String secret) {
        if (secret != null && !secret.isBlank()) {
            try {
                return Keys.hmacShaKeyFor(Decoders.BASE64.decode(secret));
            } catch (RuntimeException exception) {
                log.warn("JWT_SECRET ausente ou inválido; usando chave temporária. Configure um JWT_SECRET Base64 estável para preservar sessões após reinícios.");
            }
        } else {
            log.warn("JWT_SECRET não configurado; usando chave temporária. Configure um JWT_SECRET Base64 estável para preservar sessões após reinícios.");
        }

        byte[] randomKey = new byte[32];
        new SecureRandom().nextBytes(randomKey);
        return Keys.hmacShaKeyFor(randomKey);
    }

    public String gerarToken(UserDetails userDetails) {
        Instant agora = Instant.now();
        Instant expiracao = agora.plusSeconds(expirationMinutes * 60);

        return Jwts.builder()
                .subject(userDetails.getUsername())
                .issuedAt(Date.from(agora))
                .expiration(Date.from(expiracao))
                .signWith(secretKey)
                .compact();
    }

    public String extrairEmail(String token) {
        return extrairClaims(token).getSubject();
    }

    public boolean tokenValido(String token, UserDetails userDetails) {
        Claims claims = extrairClaims(token);

        return claims.getSubject().equalsIgnoreCase(userDetails.getUsername())
                && claims.getExpiration().after(new Date());
    }

    private Claims extrairClaims(String token) {
        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
