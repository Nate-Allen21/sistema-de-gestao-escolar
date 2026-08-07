# Sistema de Gestão Escolar

Projeto de manutenção — **nível intermediário**. Turmas, professores, disciplinas, alunos e
lançamento de notas, com cálculo automático de boletim (média e situação por disciplina).

Este projeto é mais complexo que os anteriores: tem 5 entidades relacionadas entre si
(Turma, Aluno, Professor, Disciplina, Nota) e regras de negócio (capacidade de turma, cálculo de
média, situação de aprovação). Explore com calma antes de sair abrindo chamados.

## Tecnologias
- Backend: Java + Spring Boot (porta 8084)
- Banco de dados: PostgreSQL (via Docker, porta 5436)
- Frontend: React + Vite (porta 5176)

## Como rodar

1. **Subir o banco de dados** (dentro desta pasta)
   ```
   docker compose up -d
   ```

2. **Rodar o backend**
   ```
   cd backend
   mvn spring-boot:run
   ```

   O backend exige **Java 17 ou superior**. No Windows, se `mvn` não for reconhecido ou o Java
   padrão for uma versão antiga, use o Maven instalado pela IDE e defina o JDK 17 no mesmo
   terminal:

   ```bat
   cd backend
   set "JAVA_HOME=C:\Users\nathan58405816\.jdks\ms-17.0.20"
   set "PATH=%JAVA_HOME%\bin;C:\Program Files\JetBrains\IntelliJ IDEA 2023.2.3\plugins\maven\lib\maven3\bin;%PATH%"
   mvn spring-boot:run
   ```

   As tabelas são criadas automaticamente e populadas com dados de exemplo na primeira execução —
   incluindo turmas, professores, disciplinas, alunos já matriculados e algumas notas já lançadas.

3. **Rodar o frontend** (em outro terminal)
   ```
   cd frontend
   npm install
   npm run dev
   ```

4. Acesse **http://localhost:5176** no navegador.

## O que fazer

Use o sistema pelas 5 abas (Turmas, Professores, Disciplinas, Alunos, Notas & Boletim) como um
usuário real usaria:

- Matricule alunos em diferentes turmas
- Cadastre professores e disciplinas
- Lance notas de diferentes bimestres para os alunos que já existem
- Veja o boletim de alguns alunos (aba **Notas & Boletim** → selecione o aluno → **Ver boletim**)
- Tente excluir um professor que já tem disciplina cadastrada
- Preste atenção em contas que já estão no limite de vagas

Qualquer comportamento que não fizer sentido — um cálculo estranho, uma ação que deveria ser
bloqueada e não é, uma tela que quebra — é candidato a chamado. Registre no Painel de Manutenção da
turma, resolva, versione no Git seguindo o guia "Do chamado ao Pull Request", e mova o card para
"Incremento Entregue".
