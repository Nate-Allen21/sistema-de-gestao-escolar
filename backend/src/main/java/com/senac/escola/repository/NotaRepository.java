package com.senac.escola.repository;

import com.senac.escola.model.Nota;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotaRepository extends JpaRepository<Nota, Long> {
    List<Nota> findAllByAlunoId(Long alunoId);
    List<Nota> findAllByAlunoIdAndDisciplinaId(Long alunoId, Long disciplinaId);
}
