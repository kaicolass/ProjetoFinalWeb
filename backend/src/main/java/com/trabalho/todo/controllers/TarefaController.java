package com.trabalho.todo.controllers;

import com.trabalho.todo.dto.TarefaRequest;
import com.trabalho.todo.dto.TarefaResponse;
import com.trabalho.todo.services.TarefaService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/tarefas")
public class TarefaController {

    private final TarefaService tarefaService;

    public TarefaController(TarefaService tarefaService) {
        this.tarefaService = tarefaService;
    }

    @GetMapping
    public List<TarefaResponse> listar(@AuthenticationPrincipal UserDetails userDetails) {
        return tarefaService.listar(usuarioId(userDetails));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TarefaResponse criar(@AuthenticationPrincipal UserDetails userDetails,
                                @Valid @RequestBody TarefaRequest request) {
        return tarefaService.criar(usuarioId(userDetails), request);
    }

    @PutMapping("/{id}")
    public TarefaResponse atualizar(@AuthenticationPrincipal UserDetails userDetails,
                                    @PathVariable UUID id,
                                    @Valid @RequestBody TarefaRequest request) {
        return tarefaService.atualizar(usuarioId(userDetails), id, request);
    }

    @PatchMapping("/{id}/status")
    public TarefaResponse alternarStatus(@AuthenticationPrincipal UserDetails userDetails,
                                         @PathVariable UUID id) {
        return tarefaService.alternarStatus(usuarioId(userDetails), id);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletar(@AuthenticationPrincipal UserDetails userDetails,
                        @PathVariable UUID id) {
        tarefaService.deletar(usuarioId(userDetails), id);
    }

    private UUID usuarioId(UserDetails userDetails) {
        return UUID.fromString(userDetails.getUsername());
    }
}
