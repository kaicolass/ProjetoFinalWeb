package com.trabalho.todo.security;

import com.trabalho.todo.models.Usuario;
import com.trabalho.todo.repositories.UsuarioRepository;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.UUID;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UsuarioRepository usuarioRepository;

    public UserDetailsServiceImpl(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String usuarioId) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepository.findById(UUID.fromString(usuarioId))
                .orElseThrow(() -> new UsernameNotFoundException(
                        "Usuário não encontrado com ID: " + usuarioId));

        return User.builder()
                .username(usuario.getId().toString())
                .password(usuario.getSenhaHash())
                .authorities(Collections.emptyList())
                .build();
    }
}
