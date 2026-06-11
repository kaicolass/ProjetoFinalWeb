package com.trabalho.todo.dto;

import com.trabalho.todo.models.Tarefa;

import java.time.OffsetDateTime;
import java.util.UUID;

public record TarefaResponse(
        UUID id,
        String titulo,
        String descricao,
        boolean statusConcluida,
        OffsetDateTime dataCriacao
) {
    public static TarefaResponse from(Tarefa tarefa) {
        return new TarefaResponse(
                tarefa.getId(),
                tarefa.getTitulo(),
                tarefa.getDescricao(),
                tarefa.isStatusConcluida(),
                tarefa.getDataCriacao()
        );
    }
}
