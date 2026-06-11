package com.trabalho.todo.services;

import com.trabalho.todo.dto.TarefaRequest;
import com.trabalho.todo.dto.TarefaResponse;
import com.trabalho.todo.models.Tarefa;
import com.trabalho.todo.models.Usuario;
import com.trabalho.todo.repositories.TarefaRepository;
import com.trabalho.todo.repositories.UsuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@Service
public class TarefaService {

    private final TarefaRepository tarefaRepository;
    private final UsuarioRepository usuarioRepository;

    public TarefaService(TarefaRepository tarefaRepository,
                         UsuarioRepository usuarioRepository) {
        this.tarefaRepository = tarefaRepository;
        this.usuarioRepository = usuarioRepository;
    }

    public List<TarefaResponse> listar(UUID usuarioId) {
        return tarefaRepository.findByUsuarioIdOrderByDataCriacaoDesc(usuarioId)
                .stream()
                .map(TarefaResponse::from)
                .toList();
    }

    public TarefaResponse criar(UUID usuarioId, TarefaRequest request) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        Tarefa tarefa = new Tarefa();
        tarefa.setTitulo(request.titulo());
        tarefa.setDescricao(request.descricao());
        tarefa.setUsuario(usuario);

        return TarefaResponse.from(tarefaRepository.save(tarefa));
    }

    public TarefaResponse atualizar(UUID usuarioId, UUID tarefaId, TarefaRequest request) {
        Tarefa tarefa = buscarComPropriedade(tarefaId, usuarioId);
        tarefa.setTitulo(request.titulo());
        tarefa.setDescricao(request.descricao());
        return TarefaResponse.from(tarefaRepository.save(tarefa));
    }

    public TarefaResponse alternarStatus(UUID usuarioId, UUID tarefaId) {
        Tarefa tarefa = buscarComPropriedade(tarefaId, usuarioId);
        tarefa.setStatusConcluida(!tarefa.isStatusConcluida());
        return TarefaResponse.from(tarefaRepository.save(tarefa));
    }

    public void deletar(UUID usuarioId, UUID tarefaId) {
        Tarefa tarefa = buscarComPropriedade(tarefaId, usuarioId);
        tarefaRepository.delete(tarefa);
    }

    private Tarefa buscarComPropriedade(UUID tarefaId, UUID usuarioId) {
        return tarefaRepository.findByIdAndUsuarioId(tarefaId, usuarioId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Tarefa não encontrada"));
    }
}
