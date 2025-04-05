package com.Algonitefintech.fintech_security.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
public class JwtUtil {

    // Load secret key from application.properties for security reasons.
    @Value("${jwt.secret}")
    private String SECRET_KEY;

    // Returns the signing key using the secret key.
    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
    }

    // Extracts username (subject) from the token.
    public String extractUsername(String token) {
        Claims claims = extractAllClaims(token);
        return claims.getSubject();
    }

    // Extracts expiration date from the token.
    public Date extractExpiration(String token) {
        return extractAllClaims(token).getExpiration();
    }

    // Parses the token and extracts all claims.
    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public List extractRoles(String token) {
        Claims claims = extractAllClaims(token);
        return claims.get("roles", List.class);
    }

    // Checks if the token is expired.
    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    // Generates a token for a given username.
    public String generateToken(String username, List<String> roles) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("roles", roles.stream().map(r -> "ROLE_" + r).collect(Collectors.toList()));
        return createToken(claims, username);
    }


    // Creates the token using claims and subject.
    // Here, expiration is set to 1 hour. (Change the calculation for 5 minutes if needed.)
    private String createToken(Map<String, Object> claims, String subject) {
        long expirationTime = 1000 * 60 * 60; // 1 hour expiration time
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setHeaderParam("typ", "JWT")
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expirationTime))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // Validates the token (currently, only checks for expiration).
    public Boolean validateToken(String token, UserDetails userDetails) {
        return !isTokenExpired(token);
    }
}

