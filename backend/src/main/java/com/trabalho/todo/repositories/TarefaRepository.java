package com.trabalho.todo.repositories;

import com.trabalho.todo.models.Tarefa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TarefaRepository extends JpaRepository<Tarefa, UUID> {

    List<Tarefa> findByUsuarioIdOrderByDataCriacaoDesc(UUID usuarioId);

    Optional<Tarefa> findByIdAndUsuarioId(UUID id, UUID usuarioId);
}
