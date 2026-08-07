package com.senac.escola.controller;

import com.senac.escola.model.Professor;
import com.senac.escola.repository.ProfessorRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/professores")
public class ProfessorController {

    private final ProfessorRepository repository;

    public ProfessorController(ProfessorRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Professor> listar() {
        return repository.findAll();
    }

    @PostMapping
    public Professor criar(@RequestBody Professor professor) {
        return repository.save(professor);
    }

    // Remove um professor.
    // OBS: não verifica se o professor tem disciplinas vinculadas antes de excluir.
    // Se tiver, o banco recusa a exclusão (violação de chave estrangeira) e o erro
    // sobe cru para o navegador, sem nenhuma mensagem amigável.
    @DeleteMapping("/{id}")
    public void remover(@PathVariable Long id) {
        repository.deleteById(id);
    }
}
