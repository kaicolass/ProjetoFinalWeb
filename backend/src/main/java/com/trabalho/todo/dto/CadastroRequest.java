package com.trabalho.todo.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CadastroRequest(
        @NotBlank String nome,
        @Email @NotBlank String email,
        @Size(min = 6) @NotBlank String senha
) {}
