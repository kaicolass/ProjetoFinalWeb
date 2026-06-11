package com.trabalho.todo.controllers;

import com.trabalho.todo.dto.CadastroRequest;
import com.trabalho.todo.dto.LoginRequest;
import com.trabalho.todo.dto.LoginResponse;
import com.trabalho.todo.services.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/cadastro")
    @ResponseStatus(HttpStatus.CREATED)
    public void cadastrar(@Valid @RequestBody CadastroRequest request) {
        authService.cadastrar(request);
    }

    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }
}
