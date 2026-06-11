package com.trabalho.todo.security;

import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.UUID;

@Component
public class JwtUtil {

    private final SecretKey chaveSecreta;
    private static final long EXPIRACAO_MS = 86_400_000L;

    public JwtUtil(@Value("${jwt.secret}") String segredo) {
        this.chaveSecreta = Keys.hmacShaKeyFor(segredo.getBytes());
    }

    public String gerarToken(UUID usuarioId) {
        Date agora = new Date();
        Date expiracao = new Date(agora.getTime() + EXPIRACAO_MS);

        return Jwts.builder()
                .subject(usuarioId.toString())
                .issuedAt(agora)
                .expiration(expiracao)
                .signWith(chaveSecreta)
                .compact();
    }

    public UUID extrairUsuarioId(String token) {
        String subject = Jwts.parser()
                .verifyWith(chaveSecreta)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
        return UUID.fromString(subject);
    }

    public boolean tokenValido(String token) {
        try {
            Jwts.parser()
                .verifyWith(chaveSecreta)
                .build()
                .parseSignedClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }
}
