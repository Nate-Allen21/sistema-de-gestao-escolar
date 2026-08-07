const BASE = 'http://localhost:8084/api';

export async function listarTurmas() {
  const res = await fetch(`${BASE}/turmas`);
  return res.json();
}
export async function criarTurma(turma) {
  const res = await fetch(`${BASE}/turmas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(turma),
  });
  return res.json();
}

export async function listarProfessores() {
  const res = await fetch(`${BASE}/professores`);
  return res.json();
}
export async function criarProfessor(professor) {
  const res = await fetch(`${BASE}/professores`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(professor),
  });
  return res.json();
}
export async function excluirProfessor(id) {
  const res = await fetch(`${BASE}/professores/${id}`, { method: 'DELETE' });
  return res.ok;
}

export async function listarDisciplinas() {
  const res = await fetch(`${BASE}/disciplinas`);
  return res.json();
}
export async function criarDisciplina(disciplina) {
  const res = await fetch(`${BASE}/disciplinas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(disciplina),
  });
  return res.json();
}

export async function listarAlunos(turmaId) {
  const url = turmaId ? `${BASE}/alunos?turmaId=${turmaId}` : `${BASE}/alunos`;
  const res = await fetch(url);
  return res.json();
}
export async function matricularAluno(aluno) {
  const res = await fetch(`${BASE}/alunos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(aluno),
  });
  return res.json();
}
export async function excluirAluno(id) {
  await fetch(`${BASE}/alunos/${id}`, { method: 'DELETE' });
}

export async function lancarNota(nota) {
  const res = await fetch(`${BASE}/notas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(nota),
  });
  return res.json();
}
export async function buscarBoletim(alunoId) {
  const res = await fetch(`${BASE}/notas/boletim/${alunoId}`);
  return res.json();
}
