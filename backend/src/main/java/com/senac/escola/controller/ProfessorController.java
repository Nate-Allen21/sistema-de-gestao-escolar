package com.senac.escola.controller;

import com.senac.escola.model.Professor;
import com.senac.escola.repository.DisciplinaRepository;
import com.senac.escola.repository.ProfessorRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/professores")
public class ProfessorController {

    private final ProfessorRepository repository;
    private final DisciplinaRepository disciplinaRepository;

    public ProfessorController(ProfessorRepository repository, DisciplinaRepository disciplinaRepository) {
        this.repository = repository;
        this.disciplinaRepository = disciplinaRepository;
    }

    @GetMapping
    public List<Professor> listar() {
        return repository.findAll();
    }

    @PostMapping
    public Professor criar(@RequestBody Professor professor) {
        return repository.save(professor);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> remover(@PathVariable Long id) {
        if (!repository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        if (!disciplinaRepository.findAllByProfessorId(id).isEmpty()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Não é possível excluir um professor que possui disciplinas vinculadas.");
        }

        try {
            repository.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Não é possível excluir este professor porque ele possui dados vinculados.");
        }
    }
}
