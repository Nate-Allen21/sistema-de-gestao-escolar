package com.senac.escola.controller;

import com.senac.escola.repository.AlunoRepository;
import com.senac.escola.model.Turma;
import com.senac.escola.repository.TurmaRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/turmas")
public class TurmaController {

    private final TurmaRepository repository;
    private final AlunoRepository alunoRepository;

    public TurmaController(TurmaRepository repository, AlunoRepository alunoRepository) {
        this.repository = repository;
        this.alunoRepository = alunoRepository;
    }

    @GetMapping
    public List<Turma> listar() {
        return repository.findAll();
    }

    @PostMapping
    public Turma criar(@RequestBody Turma turma) {
        return repository.save(turma);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> remover(@PathVariable Long id) {
        if (!repository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        if (!alunoRepository.findAllByTurmaId(id).isEmpty()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Não é possível excluir uma turma que possui alunos matriculados.");
        }

        try {
            repository.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Não é possível excluir esta turma porque ela possui vínculos.");
        }
    }
}
