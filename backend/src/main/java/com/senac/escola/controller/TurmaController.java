package com.senac.escola.controller;

import com.senac.escola.model.Turma;
import com.senac.escola.repository.TurmaRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/turmas")
public class TurmaController {

    private final TurmaRepository repository;

    public TurmaController(TurmaRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Turma> listar() {
        return repository.findAll();
    }

    @PostMapping
    public Turma criar(@RequestBody Turma turma) {
        return repository.save(turma);
    }
}
