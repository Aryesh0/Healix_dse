package com.app.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

/**
 * JWT Utility class.
 *
 * Assumptions:
 *  - Token is stored in localStorage on the frontend.
 *  - Frontend attaches it as "Authorization: Bearer <token>" on every request.
 *  - Algorithm: HMAC-SHA256 (HS256).
 *  - Payload claims: sub (username), role, iat, exp.
 *  - Expiration: 24 hours (configurable via application.properties).
 */
@Component
public class JwtUtil {

    @Value("${healix.jwt.secret}")
    private String secret;

    @Value("${healix.jwt.expiration-ms}")
    private long expirationMs;

    /** Derive a signing key from the configured secret string. */
    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    /** Generate a JWT token embedding the username and role in the claims. */
    public String generateToken(String username, String role) {
        return Jwts.builder()
                .setSubject(username)
                .claim("role", role)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expirationMs))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    /** Extract the username (subject) from a valid token. */
    public String extractUsername(String token) {
        return parseClaims(token).getSubject();
    }

    /** Extract the role claim from the token. */
    public String extractRole(String token) {
        return (String) parseClaims(token).get("role");
    }

    /** Validate the token – checks signature and expiry. */
    public boolean isTokenValid(String token) {
        try {
            parseClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    private Claims parseClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
