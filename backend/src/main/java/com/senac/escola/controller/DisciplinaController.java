package com.senac.escola.controller;

import com.senac.escola.model.Disciplina;
import com.senac.escola.model.Professor;
import com.senac.escola.repository.DisciplinaRepository;
import com.senac.escola.repository.ProfessorRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/disciplinas")
public class DisciplinaController {

    private final DisciplinaRepository disciplinaRepository;
    private final ProfessorRepository professorRepository;

    public DisciplinaController(DisciplinaRepository disciplinaRepository, ProfessorRepository professorRepository) {
        this.disciplinaRepository = disciplinaRepository;
        this.professorRepository = professorRepository;
    }

    @GetMapping
    public List<Disciplina> listar() {
        return disciplinaRepository.findAll();
    }

    @PostMapping
    public Disciplina criar(@RequestBody DisciplinaRequest req) {
        Professor professor = professorRepository.findById(req.professorId)
                .orElseThrow(() -> new RuntimeException("Professor não encontrado"));

        Disciplina disciplina = new Disciplina();
        disciplina.setNome(req.nome);
        disciplina.setCargaHoraria(req.cargaHoraria);
        disciplina.setProfessor(professor);

        return disciplinaRepository.save(disciplina);
    }
}
