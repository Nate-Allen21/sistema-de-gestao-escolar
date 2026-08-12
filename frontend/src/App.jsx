import { useEffect, useState } from 'react';
import {
  listarTurmas,
  criarTurma,
  listarProfessores,
  criarProfessor,
  excluirProfessor,
  listarDisciplinas,
  criarDisciplina,
  listarAlunos,
  matricularAluno,
  excluirAluno,
  lancarNota,
  buscarBoletim,
} from './api.js';

const TABS = ['Turmas', 'Professores', 'Disciplinas', 'Alunos', 'Notas & Boletim'];

export default function App() {
  const [tab, setTab] = useState('Turmas');
  const [turmas, setTurmas] = useState([]);
  const [professores, setProfessores] = useState([]);
  const [disciplinas, setDisciplinas] = useState([]);
  const [alunos, setAlunos] = useState([]);
  const [filtroTurma, setFiltroTurma] = useState('');
  const [mensagem, setMensagem] = useState({ tipo: '', texto: '' });

  async function carregarTudo() {
    setTurmas(await listarTurmas());
    setProfessores(await listarProfessores());
    setDisciplinas(await listarDisciplinas());
    setAlunos(await listarAlunos());
  }

  useEffect(() => {
    carregarTudo();
  }, []);

  useEffect(() => {
    listarAlunos(filtroTurma || undefined).then(setAlunos);
  }, [filtroTurma]);

  function mostrarMensagem(tipo, texto) {
    setMensagem({ tipo, texto });
  }

  // ---------- TURMAS ----------
  const [formTurma, setFormTurma] = useState({ nome: '', anoLetivo: '', capacidade: '' });
  async function handleCriarTurma(e) {
    e.preventDefault();
    await criarTurma({
      ...formTurma,
      anoLetivo: Number(formTurma.anoLetivo),
      capacidade: Number(formTurma.capacidade),
    });
    setFormTurma({ nome: '', anoLetivo: '', capacidade: '' });
    mostrarMensagem('sucesso', 'Turma cadastrada com sucesso.');
    carregarTudo();
  }

  // ---------- PROFESSORES ----------
  const [formProfessor, setFormProfessor] = useState({ nome: '', email: '' });
  async function handleCriarProfessor(e) {
    e.preventDefault();
    await criarProfessor(formProfessor);
    setFormProfessor({ nome: '', email: '' });
    mostrarMensagem('sucesso', 'Professor cadastrado com sucesso.');
    carregarTudo();
  }

  async function handleExcluirProfessor(id) {
    if (!confirm('Excluir este professor?')) return;

    try {
      await excluirProfessor(id);
      mostrarMensagem('sucesso', 'Professor excluído com sucesso.');
      carregarTudo();
    } catch (error) {
      mostrarMensagem('erro', error.message || 'Não foi possível excluir o professor.');
    }
  }

  // ---------- DISCIPLINAS ----------
  const [formDisciplina, setFormDisciplina] = useState({ nome: '', cargaHoraria: '', professorId: '' });
  async function handleCriarDisciplina(e) {
    e.preventDefault();
    await criarDisciplina({
      ...formDisciplina,
      cargaHoraria: Number(formDisciplina.cargaHoraria),
      professorId: Number(formDisciplina.professorId),
    });
    setFormDisciplina({ nome: '', cargaHoraria: '', professorId: '' });
    mostrarMensagem('sucesso', 'Disciplina cadastrada com sucesso.');
    carregarTudo();
  }

  // ---------- ALUNOS ----------
  const [formAluno, setFormAluno] = useState({ nome: '', email: '', dataNascimento: '', turmaId: '' });
  async function handleMatricularAluno(e) {
    e.preventDefault();
    await matricularAluno({ ...formAluno, turmaId: Number(formAluno.turmaId) });
    setFormAluno({ nome: '', email: '', dataNascimento: '', turmaId: '' });
    mostrarMensagem('sucesso', 'Aluno matriculado com sucesso.');
    carregarTudo();
  }

  async function handleExcluirAluno(id) {
    if (!confirm('Excluir este aluno?')) return;

    try {
      await excluirAluno(id);
      mostrarMensagem('sucesso', 'Aluno excluído com sucesso.');
      carregarTudo();
    } catch (error) {
      mostrarMensagem('erro', error.message || 'Não foi possível excluir o aluno.');
    }
  }

  // ---------- NOTAS & BOLETIM ----------
  const [formNota, setFormNota] = useState({ alunoId: '', disciplinaId: '', bimestre: '1', valor: '' });
  async function handleLancarNota(e) {
    e.preventDefault();
    await lancarNota({
      ...formNota,
      alunoId: Number(formNota.alunoId),
      disciplinaId: Number(formNota.disciplinaId),
      bimestre: Number(formNota.bimestre),
      valor: Number(formNota.valor),
    });
    setFormNota({ ...formNota, valor: '' });
    mostrarMensagem('sucesso', 'Nota lançada com sucesso.');
  }

  const [alunoBoletim, setAlunoBoletim] = useState('');
  const [boletim, setBoletim] = useState([]);
  async function handleVerBoletim() {
    if (!alunoBoletim) return;
    setBoletim(await buscarBoletim(alunoBoletim));
  }

  function nomeTurma(id) {
    const turma = turmas.find((item) => item.id === id);
    return turma ? turma.nome : '—';
  }

  return (
    <div className="app">
      <header>
        <h1>🏫 Sistema de Gestão Escolar</h1>
        <p>Turmas, professores, disciplinas, alunos e notas</p>
      </header>

      <nav className="tabs">
        {TABS.map((item) => (
          <button key={item} className={item === tab ? 'tab active' : 'tab'} onClick={() => setTab(item)}>
            {item}
          </button>
        ))}
      </nav>

      {mensagem.texto && (
        <div className={`alert ${mensagem.tipo}`}>
          <span>{mensagem.texto}</span>
          <button type="button" onClick={() => setMensagem({ tipo: '', texto: '' })}>
            ×
          </button>
        </div>
      )}

      <main>
        {tab === 'Turmas' && (
          <section>
            <div className="panel">
              <h2>Nova turma</h2>
              <form onSubmit={handleCriarTurma}>
                <input
                  placeholder="Nome (ex: 1º Ano A)"
                  value={formTurma.nome}
                  onChange={(e) => setFormTurma({ ...formTurma, nome: e.target.value })}
                  required
                />
                <input
                  type="number"
                  placeholder="Ano letivo"
                  value={formTurma.anoLetivo}
                  onChange={(e) => setFormTurma({ ...formTurma, anoLetivo: e.target.value })}
                  required
                />
                <input
                  type="number"
                  placeholder="Capacidade"
                  value={formTurma.capacidade}
                  onChange={(e) => setFormTurma({ ...formTurma, capacidade: e.target.value })}
                  required
                />
                <button type="submit">Adicionar</button>
              </form>
            </div>
            <div className="panel">
              <h2>Turmas cadastradas</h2>
              <table>
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Ano letivo</th>
                    <th>Capacidade</th>
                  </tr>
                </thead>
                <tbody>
                  {turmas.map((turma) => (
                    <tr key={turma.id}>
                      <td>{turma.nome}</td>
                      <td>{turma.anoLetivo}</td>
                      <td>{turma.capacidade}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {tab === 'Professores' && (
          <section>
            <div className="panel">
              <h2>Novo professor</h2>
              <form onSubmit={handleCriarProfessor}>
                <input
                  placeholder="Nome"
                  value={formProfessor.nome}
                  onChange={(e) => setFormProfessor({ ...formProfessor, nome: e.target.value })}
                  required
                />
                <input
                  type="email"
                  placeholder="E-mail"
                  value={formProfessor.email}
                  onChange={(e) => setFormProfessor({ ...formProfessor, email: e.target.value })}
                  required
                />
                <button type="submit">Adicionar</button>
              </form>
            </div>
            <div className="panel">
              <h2>Professores cadastrados</h2>
              <table>
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>E-mail</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {professores.map((professor) => (
                    <tr key={professor.id}>
                      <td>{professor.nome}</td>
                      <td>{professor.email}</td>
                      <td>
                        <button className="action excluir" onClick={() => handleExcluirProfessor(professor.id)}>
                          Excluir
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {tab === 'Disciplinas' && (
          <section>
            <div className="panel">
              <h2>Nova disciplina</h2>
              <form onSubmit={handleCriarDisciplina}>
                <input
                  placeholder="Nome"
                  value={formDisciplina.nome}
                  onChange={(e) => setFormDisciplina({ ...formDisciplina, nome: e.target.value })}
                  required
                />
                <input
                  type="number"
                  placeholder="Carga horária"
                  value={formDisciplina.cargaHoraria}
                  onChange={(e) => setFormDisciplina({ ...formDisciplina, cargaHoraria: e.target.value })}
                  required
                />
                <select
                  value={formDisciplina.professorId}
                  onChange={(e) => setFormDisciplina({ ...formDisciplina, professorId: e.target.value })}
                  required
                >
                  <option value="">Professor responsável</option>
                  {professores.map((professor) => (
                    <option key={professor.id} value={professor.id}>
                      {professor.nome}
                    </option>
                  ))}
                </select>
                <button type="submit">Adicionar</button>
              </form>
            </div>
            <div className="panel">
              <h2>Disciplinas cadastradas</h2>
              <table>
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Carga horária</th>
                    <th>Professor</th>
                  </tr>
                </thead>
                <tbody>
                  {disciplinas.map((disciplina) => (
                    <tr key={disciplina.id}>
                      <td>{disciplina.nome}</td>
                      <td>{disciplina.cargaHoraria}h</td>
                      <td>{disciplina.professor?.nome}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {tab === 'Alunos' && (
          <section>
            <div className="panel">
              <h2>Matricular aluno</h2>
              <form onSubmit={handleMatricularAluno}>
                <input
                  placeholder="Nome"
                  value={formAluno.nome}
                  onChange={(e) => setFormAluno({ ...formAluno, nome: e.target.value })}
                  required
                />
                <input
                  type="email"
                  placeholder="E-mail"
                  value={formAluno.email}
                  onChange={(e) => setFormAluno({ ...formAluno, email: e.target.value })}
                  required
                />
                <input
                  type="date"
                  value={formAluno.dataNascimento}
                  onChange={(e) => setFormAluno({ ...formAluno, dataNascimento: e.target.value })}
                  required
                />
                <select value={formAluno.turmaId} onChange={(e) => setFormAluno({ ...formAluno, turmaId: e.target.value })} required>
                  <option value="">Turma</option>
                  {turmas.map((turma) => (
                    <option key={turma.id} value={turma.id}>
                      {turma.nome}
                    </option>
                  ))}
                </select>
                <button type="submit">Matricular</button>
              </form>
            </div>
            <div className="panel">
              <h2>Alunos matriculados</h2>
              <div className="filtro">
                <label>Filtrar por turma:</label>
                <select value={filtroTurma} onChange={(e) => setFiltroTurma(e.target.value)}>
                  <option value="">Todas</option>
                  {turmas.map((turma) => (
                    <option key={turma.id} value={turma.id}>
                      {turma.nome}
                    </option>
                  ))}
                </select>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>E-mail</th>
                    <th>Turma</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {alunos.map((aluno) => (
                    <tr key={aluno.id}>
                      <td>{aluno.nome}</td>
                      <td>{aluno.email}</td>
                      <td>{aluno.turma?.nome || nomeTurma(aluno.turmaId)}</td>
                      <td>
                        <button className="action excluir" onClick={() => handleExcluirAluno(aluno.id)}>
                          Excluir
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {tab === 'Notas & Boletim' && (
          <section>
            <div className="panel">
              <h2>Lançar nota</h2>
              <form onSubmit={handleLancarNota}>
                <select value={formNota.alunoId} onChange={(e) => setFormNota({ ...formNota, alunoId: e.target.value })} required>
                  <option value="">Aluno</option>
                  {alunos.map((aluno) => (
                    <option key={aluno.id} value={aluno.id}>
                      {aluno.nome}
                    </option>
                  ))}
                </select>
                <select
                  value={formNota.disciplinaId}
                  onChange={(e) => setFormNota({ ...formNota, disciplinaId: e.target.value })}
                  required
                >
                  <option value="">Disciplina</option>
                  {disciplinas.map((disciplina) => (
                    <option key={disciplina.id} value={disciplina.id}>
                      {disciplina.nome}
                    </option>
                  ))}
                </select>
                <select value={formNota.bimestre} onChange={(e) => setFormNota({ ...formNota, bimestre: e.target.value })}>
                  <option value="1">1º bimestre</option>
                  <option value="2">2º bimestre</option>
                  <option value="3">3º bimestre</option>
                  <option value="4">4º bimestre</option>
                </select>
                <input
                  type="number"
                  step="0.1"
                  placeholder="Nota"
                  value={formNota.valor}
                  onChange={(e) => setFormNota({ ...formNota, valor: e.target.value })}
                  required
                />
                <button type="submit">Lançar</button>
              </form>
            </div>

            <div className="panel">
              <h2>Boletim do aluno</h2>
              <div className="filtro">
                <select value={alunoBoletim} onChange={(e) => setAlunoBoletim(e.target.value)}>
                  <option value="">Selecione um aluno</option>
                  {alunos.map((aluno) => (
                    <option key={aluno.id} value={aluno.id}>
                      {aluno.nome}
                    </option>
                  ))}
                </select>
                <button onClick={handleVerBoletim}>Ver boletim</button>
              </div>
              {boletim.length > 0 && (
                <table>
                  <thead>
                    <tr>
                      <th>Disciplina</th>
                      <th>Notas lançadas</th>
                      <th>Média</th>
                      <th>Situação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {boletim.map((item, index) => (
                      <tr key={index}>
                        <td>{item.disciplinaNome}</td>
                        <td>{item.notas.map((nota) => `B${nota.bimestre}: ${nota.valor}`).join(' · ')}</td>
                        <td>{item.media}</td>
                        <td className={item.situacao === 'Aprovado' ? 'ok' : 'bad'}>{item.situacao}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
