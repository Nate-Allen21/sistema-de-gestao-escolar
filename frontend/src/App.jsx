import { useEffect, useState } from 'react';
import {
  listarTurmas, criarTurma,
  listarProfessores, criarProfessor, excluirProfessor,
  listarDisciplinas, criarDisciplina,
  listarAlunos, matricularAluno, excluirAluno,
  lancarNota, buscarBoletim,
} from './api.js';

const TABS = ['Turmas', 'Professores', 'Disciplinas', 'Alunos', 'Notas & Boletim'];

export default function App() {
  const [tab, setTab] = useState('Turmas');

  const [turmas, setTurmas] = useState([]);
  const [professores, setProfessores] = useState([]);
  const [disciplinas, setDisciplinas] = useState([]);
  const [alunos, setAlunos] = useState([]);
  const [filtroTurma, setFiltroTurma] = useState('');

  const [erro, setErro] = useState('');

  async function carregarTudo() {
    setTurmas(await listarTurmas());
    setProfessores(await listarProfessores());
    setDisciplinas(await listarDisciplinas());
    setAlunos(await listarAlunos());
  }

  useEffect(() => { carregarTudo(); }, []);

  useEffect(() => {
    listarAlunos(filtroTurma || undefined).then(setAlunos);
  }, [filtroTurma]);

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
    carregarTudo();
  }

  // ---------- PROFESSORES ----------
  const [formProfessor, setFormProfessor] = useState({ nome: '', email: '' });
  async function handleCriarProfessor(e) {
    e.preventDefault();
    await criarProfessor(formProfessor);
    setFormProfessor({ nome: '', email: '' });
    carregarTudo();
  }
  async function handleExcluirProfessor(id) {
    if (!confirm('Excluir este professor?')) return;
    setErro('');
    const ok = await excluirProfessor(id);
    if (!ok) setErro('Não foi possível excluir: o servidor retornou um erro.');
    carregarTudo();
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
    carregarTudo();
  }

  // ---------- ALUNOS ----------
  const [formAluno, setFormAluno] = useState({ nome: '', email: '', dataNascimento: '', turmaId: '' });
  async function handleMatricularAluno(e) {
    e.preventDefault();
    await matricularAluno({ ...formAluno, turmaId: Number(formAluno.turmaId) });
    setFormAluno({ nome: '', email: '', dataNascimento: '', turmaId: '' });
    carregarTudo();
  }
  async function handleExcluirAluno(id) {
    if (!confirm('Excluir este aluno?')) return;
    await excluirAluno(id);
    carregarTudo();
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
  }

  const [alunoBoletim, setAlunoBoletim] = useState('');
  const [boletim, setBoletim] = useState([]);
  async function handleVerBoletim() {
    if (!alunoBoletim) return;
    setBoletim(await buscarBoletim(alunoBoletim));
  }

  function nomeTurma(id) {
    const t = turmas.find(t => t.id === id);
    return t ? t.nome : '—';
  }

  return (
    <div className="app">
      <header>
        <h1>🏫 Sistema de Gestão Escolar</h1>
        <p>Turmas, professores, disciplinas, alunos e notas</p>
      </header>

      <nav className="tabs">
        {TABS.map(t => (
          <button key={t} className={t === tab ? 'tab active' : 'tab'} onClick={() => setTab(t)}>{t}</button>
        ))}
      </nav>

      {erro && <div className="alert">{erro}</div>}

      <main>
        {tab === 'Turmas' && (
          <section>
            <div className="panel">
              <h2>Nova turma</h2>
              <form onSubmit={handleCriarTurma}>
                <input placeholder="Nome (ex: 1º Ano A)" value={formTurma.nome}
                  onChange={e => setFormTurma({ ...formTurma, nome: e.target.value })} required />
                <input type="number" placeholder="Ano letivo" value={formTurma.anoLetivo}
                  onChange={e => setFormTurma({ ...formTurma, anoLetivo: e.target.value })} required />
                <input type="number" placeholder="Capacidade" value={formTurma.capacidade}
                  onChange={e => setFormTurma({ ...formTurma, capacidade: e.target.value })} required />
                <button type="submit">Adicionar</button>
              </form>
            </div>
            <div className="panel">
              <h2>Turmas cadastradas</h2>
              <table>
                <thead><tr><th>Nome</th><th>Ano letivo</th><th>Capacidade</th></tr></thead>
                <tbody>
                  {turmas.map(t => (
                    <tr key={t.id}><td>{t.nome}</td><td>{t.anoLetivo}</td><td>{t.capacidade}</td></tr>
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
                <input placeholder="Nome" value={formProfessor.nome}
                  onChange={e => setFormProfessor({ ...formProfessor, nome: e.target.value })} required />
                <input type="email" placeholder="E-mail" value={formProfessor.email}
                  onChange={e => setFormProfessor({ ...formProfessor, email: e.target.value })} required />
                <button type="submit">Adicionar</button>
              </form>
            </div>
            <div className="panel">
              <h2>Professores cadastrados</h2>
              <table>
                <thead><tr><th>Nome</th><th>E-mail</th><th>Ações</th></tr></thead>
                <tbody>
                  {professores.map(p => (
                    <tr key={p.id}>
                      <td>{p.nome}</td><td>{p.email}</td>
                      <td><button className="action excluir" onClick={() => handleExcluirProfessor(p.id)}>Excluir</button></td>
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
                <input placeholder="Nome" value={formDisciplina.nome}
                  onChange={e => setFormDisciplina({ ...formDisciplina, nome: e.target.value })} required />
                <input type="number" placeholder="Carga horária" value={formDisciplina.cargaHoraria}
                  onChange={e => setFormDisciplina({ ...formDisciplina, cargaHoraria: e.target.value })} required />
                <select value={formDisciplina.professorId}
                  onChange={e => setFormDisciplina({ ...formDisciplina, professorId: e.target.value })} required>
                  <option value="">Professor responsável</option>
                  {professores.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
                </select>
                <button type="submit">Adicionar</button>
              </form>
            </div>
            <div className="panel">
              <h2>Disciplinas cadastradas</h2>
              <table>
                <thead><tr><th>Nome</th><th>Carga horária</th><th>Professor</th></tr></thead>
                <tbody>
                  {disciplinas.map(d => (
                    <tr key={d.id}><td>{d.nome}</td><td>{d.cargaHoraria}h</td><td>{d.professor?.nome}</td></tr>
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
                <input placeholder="Nome" value={formAluno.nome}
                  onChange={e => setFormAluno({ ...formAluno, nome: e.target.value })} required />
                <input type="email" placeholder="E-mail" value={formAluno.email}
                  onChange={e => setFormAluno({ ...formAluno, email: e.target.value })} required />
                <input type="date" value={formAluno.dataNascimento}
                  onChange={e => setFormAluno({ ...formAluno, dataNascimento: e.target.value })} required />
                <select value={formAluno.turmaId}
                  onChange={e => setFormAluno({ ...formAluno, turmaId: e.target.value })} required>
                  <option value="">Turma</option>
                  {turmas.map(t => <option key={t.id} value={t.id}>{t.nome}</option>)}
                </select>
                <button type="submit">Matricular</button>
              </form>
            </div>
            <div className="panel">
              <h2>Alunos matriculados</h2>
              <div className="filtro">
                <label>Filtrar por turma:</label>
                <select value={filtroTurma} onChange={e => setFiltroTurma(e.target.value)}>
                  <option value="">Todas</option>
                  {turmas.map(t => <option key={t.id} value={t.id}>{t.nome}</option>)}
                </select>
              </div>
              <table>
                <thead><tr><th>Nome</th><th>E-mail</th><th>Turma</th><th>Ações</th></tr></thead>
                <tbody>
                  {alunos.map(a => (
                    <tr key={a.id}>
                      <td>{a.nome}</td><td>{a.email}</td><td>{a.turma?.nome || nomeTurma(a.turmaId)}</td>
                      <td><button className="action excluir" onClick={() => handleExcluirAluno(a.id)}>Excluir</button></td>
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
                <select value={formNota.alunoId}
                  onChange={e => setFormNota({ ...formNota, alunoId: e.target.value })} required>
                  <option value="">Aluno</option>
                  {alunos.map(a => <option key={a.id} value={a.id}>{a.nome}</option>)}
                </select>
                <select value={formNota.disciplinaId}
                  onChange={e => setFormNota({ ...formNota, disciplinaId: e.target.value })} required>
                  <option value="">Disciplina</option>
                  {disciplinas.map(d => <option key={d.id} value={d.id}>{d.nome}</option>)}
                </select>
                <select value={formNota.bimestre}
                  onChange={e => setFormNota({ ...formNota, bimestre: e.target.value })}>
                  <option value="1">1º bimestre</option>
                  <option value="2">2º bimestre</option>
                  <option value="3">3º bimestre</option>
                  <option value="4">4º bimestre</option>
                </select>
                <input type="number" step="0.1" placeholder="Nota" value={formNota.valor}
                  onChange={e => setFormNota({ ...formNota, valor: e.target.value })} required />
                <button type="submit">Lançar</button>
              </form>
            </div>

            <div className="panel">
              <h2>Boletim do aluno</h2>
              <div className="filtro">
                <select value={alunoBoletim} onChange={e => setAlunoBoletim(e.target.value)}>
                  <option value="">Selecione um aluno</option>
                  {alunos.map(a => <option key={a.id} value={a.id}>{a.nome}</option>)}
                </select>
                <button onClick={handleVerBoletim}>Ver boletim</button>
              </div>
              {boletim.length > 0 && (
                <table>
                  <thead><tr><th>Disciplina</th><th>Notas lançadas</th><th>Média</th><th>Situação</th></tr></thead>
                  <tbody>
                    {boletim.map((b, i) => (
                      <tr key={i}>
                        <td>{b.disciplinaNome}</td>
                        <td>{b.notas.map(n => `B${n.bimestre}: ${n.valor}`).join(' · ')}</td>
                        <td>{b.media}</td>
                        <td className={b.situacao === 'Aprovado' ? 'ok' : 'bad'}>{b.situacao}</td>
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
