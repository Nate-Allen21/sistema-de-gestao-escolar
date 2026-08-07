package com.senac.escola.repository;

import com.senac.escola.model.Aluno;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AlunoRepository extends JpaRepository<Aluno, Long> {
    List<Aluno> findAllByTurmaId(Long turmaId);
}
