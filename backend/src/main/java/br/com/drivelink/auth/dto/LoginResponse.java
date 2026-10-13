package br.com.drivelink.auth.dto;

public record LoginResponse(
        String token,
        String tokenType,
        long expiresIn
) {
}