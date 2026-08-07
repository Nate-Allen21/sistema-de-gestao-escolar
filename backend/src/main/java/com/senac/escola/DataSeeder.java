package com.senac.escola;

import com.senac.escola.model.*;
import com.senac.escola.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    private final TurmaRepository turmaRepository;
    private final ProfessorRepository professorRepository;
    private final DisciplinaRepository disciplinaRepository;
    private final AlunoRepository alunoRepository;
    private final NotaRepository notaRepository;

    public DataSeeder(TurmaRepository turmaRepository, ProfessorRepository professorRepository,
                       DisciplinaRepository disciplinaRepository, AlunoRepository alunoRepository,
                       NotaRepository notaRepository) {
        this.turmaRepository = turmaRepository;
        this.professorRepository = professorRepository;
        this.disciplinaRepository = disciplinaRepository;
        this.alunoRepository = alunoRepository;
        this.notaRepository = notaRepository;
    }

    @Override
    public void run(String... args) {
        if (turmaRepository.count() > 0) return;

        // Turma A propositalmente quase cheia, pra facilitar testar o limite de capacidade
        Turma turmaA = turmaRepository.save(new Turma(null, "1º Ano A", 2025, 3));
        Turma turmaB = turmaRepository.save(new Turma(null, "2º Ano B", 2025, 25));

        Professor carlos = professorRepository.save(new Professor(null, "Carlos Souza", "carlos.souza@escola.com"));
        Professor fernanda = professorRepository.save(new Professor(null, "Fernanda Lima", "fernanda.lima@escola.com"));
        Professor roberto = professorRepository.save(new Professor(null, "Roberto Alves", "roberto.alves@escola.com"));

        Disciplina matematica = disciplinaRepository.save(new Disciplina(null, "Matemática", 80, carlos));
        Disciplina portugues = disciplinaRepository.save(new Disciplina(null, "Português", 80, fernanda));
        Disciplina historia = disciplinaRepository.save(new Disciplina(null, "História", 60, roberto));

        Aluno ana = alunoRepository.save(new Aluno(null, "Ana Beatriz Santos", "ana.santos@aluno.com",
                java.time.LocalDate.of(2010, 3, 12), turmaA));
        Aluno bruno = alunoRepository.save(new Aluno(null, "Bruno Costa Lima", "bruno.lima@aluno.com",
                java.time.LocalDate.of(2010, 7, 2), turmaA));
        Aluno carla = alunoRepository.save(new Aluno(null, "Carla Mendes Rocha", "carla.rocha@aluno.com",
                java.time.LocalDate.of(2010, 1, 25), turmaA));

        Aluno diego = alunoRepository.save(new Aluno(null, "Diego Ferreira", "diego.ferreira@aluno.com",
                java.time.LocalDate.of(2009, 5, 30), turmaB));
        Aluno eduarda = alunoRepository.save(new Aluno(null, "Eduarda Alves", "eduarda.alves@aluno.com",
                java.time.LocalDate.of(2009, 11, 18), turmaB));

        // Ana: notas completas nas 3 disciplinas (situação deveria ficar correta mesmo com o bug)
        notaRepository.save(new Nota(null, ana, matematica, 1, 7.0));
        notaRepository.save(new Nota(null, ana, matematica, 2, 8.0));
        notaRepository.save(new Nota(null, ana, matematica, 3, 6.0));
        notaRepository.save(new Nota(null, ana, matematica, 4, 7.0));

        // Bruno: só 2 bimestres lançados em Português — expõe o bug da média sempre dividindo por 4
        notaRepository.save(new Nota(null, bruno, portugues, 1, 9.0));
        notaRepository.save(new Nota(null, bruno, portugues, 2, 8.0));

        // Carla: média exatamente 6.0 em História — expõe o bug do "> 6.0" em vez de ">= 6.0"
        notaRepository.save(new Nota(null, carla, historia, 1, 6.0));
        notaRepository.save(new Nota(null, carla, historia, 2, 6.0));
        notaRepository.save(new Nota(null, carla, historia, 3, 6.0));
        notaRepository.save(new Nota(null, carla, historia, 4, 6.0));

        // Diego e Eduarda: alguns lançamentos na Turma B, com vagas de sobra
        notaRepository.save(new Nota(null, diego, matematica, 1, 5.0));
        notaRepository.save(new Nota(null, diego, matematica, 2, 6.5));
        notaRepository.save(new Nota(null, eduarda, portugues, 1, 8.5));
    }
}
