package com.trabalho.todo.dto;

import jakarta.validation.constraints.NotBlank;

public record TarefaRequest(
        @NotBlank String titulo,
        String descricao
) {}
