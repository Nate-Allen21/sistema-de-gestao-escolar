const BASE = 'http://localhost:8084/api';

async function requestJson(url, options) {
  const res = await fetch(url, options);
  const text = await res.text();

  let body = null;
  if (text) {
    try {
      body = JSON.parse(text);
    } catch {
      body = text;
    }
  }

  if (!res.ok) {
    const message =
      typeof body === 'string'
        ? body
        : body?.message || `Requisição falhou (${res.status})`;
    throw new Error(message);
  }

  return body;
}

export async function listarTurmas() {
  const res = await fetch(`${BASE}/turmas`);
  return res.json();
}
export async function criarTurma(turma) {
  return requestJson(`${BASE}/turmas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(turma),
  });
}

export async function listarProfessores() {
  const res = await fetch(`${BASE}/professores`);
  return res.json();
}
export async function criarProfessor(professor) {
  return requestJson(`${BASE}/professores`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(professor),
  });
}
export async function excluirProfessor(id) {
  return requestJson(`${BASE}/professores/${id}`, { method: 'DELETE' });
}

export async function listarDisciplinas() {
  const res = await fetch(`${BASE}/disciplinas`);
  return res.json();
}
export async function criarDisciplina(disciplina) {
  return requestJson(`${BASE}/disciplinas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(disciplina),
  });
}

export async function listarAlunos(turmaId) {
  const url = turmaId ? `${BASE}/alunos?turmaId=${turmaId}` : `${BASE}/alunos`;
  const res = await fetch(url);
  return res.json();
}
export async function matricularAluno(aluno) {
  return requestJson(`${BASE}/alunos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(aluno),
  });
}
export async function excluirAluno(id) {
  return requestJson(`${BASE}/alunos/${id}`, { method: 'DELETE' });
}

export async function lancarNota(nota) {
  return requestJson(`${BASE}/notas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(nota),
  });
}
export async function buscarBoletim(alunoId) {
  const res = await fetch(`${BASE}/notas/boletim/${alunoId}`);
  return res.json();
}
