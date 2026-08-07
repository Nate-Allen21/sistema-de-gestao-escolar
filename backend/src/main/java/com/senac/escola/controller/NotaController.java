package com.senac.escola.controller;

import com.senac.escola.model.Aluno;
import com.senac.escola.model.Disciplina;
import com.senac.escola.model.Nota;
import com.senac.escola.repository.AlunoRepository;
import com.senac.escola.repository.DisciplinaRepository;
import com.senac.escola.repository.NotaRepository;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/notas")
public class NotaController {

    private final NotaRepository notaRepository;
    private final AlunoRepository alunoRepository;
    private final DisciplinaRepository disciplinaRepository;

    public NotaController(NotaRepository notaRepository, AlunoRepository alunoRepository,
                           DisciplinaRepository disciplinaRepository) {
        this.notaRepository = notaRepository;
        this.alunoRepository = alunoRepository;
        this.disciplinaRepository = disciplinaRepository;
    }

    @GetMapping
    public List<Nota> listar(@RequestParam(required = false) Long alunoId) {
        if (alunoId != null) {
            return notaRepository.findAllByAlunoId(alunoId);
        }
        return notaRepository.findAll();
    }

    // Lança uma nota para um aluno em uma disciplina/bimestre.
    // OBS: não valida se o valor está entre 0 e 10 antes de salvar.
    @PostMapping
    public Nota criar(@RequestBody NotaRequest req) {
        Aluno aluno = alunoRepository.findById(req.alunoId)
                .orElseThrow(() -> new RuntimeException("Aluno não encontrado"));
        Disciplina disciplina = disciplinaRepository.findById(req.disciplinaId)
                .orElseThrow(() -> new RuntimeException("Disciplina não encontrada"));

        Nota nota = new Nota();
        nota.setAluno(aluno);
        nota.setDisciplina(disciplina);
        nota.setBimestre(req.bimestre);
        nota.setValor(req.valor);

        return notaRepository.save(nota);
    }

    // Monta o boletim consolidado do aluno: média e situação por disciplina.
    @GetMapping("/boletim/{alunoId}")
    public List<BoletimItemDTO> boletim(@PathVariable Long alunoId) {
        List<Nota> notas = notaRepository.findAllByAlunoId(alunoId);

        Map<Disciplina, List<Nota>> porDisciplina = notas.stream()
                .collect(Collectors.groupingBy(Nota::getDisciplina));

        List<BoletimItemDTO> resultado = new ArrayList<>();

        for (Map.Entry<Disciplina, List<Nota>> entry : porDisciplina.entrySet()) {
            Disciplina disciplina = entry.getKey();
            List<Nota> notasDaDisciplina = entry.getValue();

            double soma = notasDaDisciplina.stream().mapToDouble(Nota::getValor).sum();
            // OBS: divide sempre por 4, mesmo que o aluno ainda não tenha as 4 notas lançadas.
            double media = soma / 4;

            BoletimItemDTO item = new BoletimItemDTO();
            item.disciplinaNome = disciplina.getNome();
            item.notas = notasDaDisciplina.stream()
                    .map(n -> new BoletimItemDTO.NotaResumo(n.getBimestre(), n.getValor()))
                    .collect(Collectors.toList());
            item.media = Math.round(media * 100.0) / 100.0;
            // OBS: deveria ser média >= 6.0 para aprovar; um aluno com média exata 6.0 é
            // incorretamente marcado como reprovado.
            item.situacao = media > 6.0 ? "Aprovado" : "Reprovado";

            resultado.add(item);
        }

        return resultado;
    }
}
