package com.senac.escola.controller;

import com.senac.escola.model.Aluno;
import com.senac.escola.model.Turma;
import com.senac.escola.repository.AlunoRepository;
import com.senac.escola.repository.TurmaRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alunos")
public class AlunoController {

    private final AlunoRepository alunoRepository;
    private final TurmaRepository turmaRepository;

    public AlunoController(AlunoRepository alunoRepository, TurmaRepository turmaRepository) {
        this.alunoRepository = alunoRepository;
        this.turmaRepository = turmaRepository;
    }

    @GetMapping
    public List<Aluno> listar(@RequestParam(required = false) Long turmaId) {
        if (turmaId != null) {
            return alunoRepository.findAllByTurmaId(turmaId);
        }
        return alunoRepository.findAll();
    }

    // Matricula um aluno em uma turma.
    // OBS: não verifica se a turma já atingiu a capacidade máxima antes de matricular.
    @PostMapping
    public Aluno criar(@RequestBody AlunoRequest req) {
        Turma turma = turmaRepository.findById(req.turmaId)
                .orElseThrow(() -> new RuntimeException("Turma não encontrada"));

        Aluno aluno = new Aluno();
        aluno.setNome(req.nome);
        aluno.setEmail(req.email);
        aluno.setDataNascimento(req.dataNascimento);
        aluno.setTurma(turma);

        return alunoRepository.save(aluno);
    }

    @DeleteMapping("/{id}")
    public void remover(@PathVariable Long id) {
        alunoRepository.deleteById(id);
    }
}
