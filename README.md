# Plataforma de Jornada de Trabalho

Aplicação web desenvolvida como parte de um desafio técnico para praticar o desenvolvimento de uma solução completa, desde a interface até a API e a persistência dos dados.

A proposta é permitir que colaboradores registrem o início e o término da jornada de trabalho e consultem seu histórico com autenticação.

## Funcionalidades

- Cadastro de usuários e login.
- Autenticação por token JWT.
- Registro de início e término da jornada.
- Consulta ao histórico de registros.
- Separação dos registros por usuário autenticado.
- Persistência dos dados em banco SQLite.
- Interface web com adaptação para diferentes tamanhos de tela.

## Tecnologias

**Backend**
- C# e ASP.NET Core
- Entity Framework Core
- SQLite
- JWT para autenticação
- ASP.NET Core Identity para hash de senhas

**Frontend**
- Angular
- TypeScript
- HTML e CSS

## Como executar o projeto

### Pré-requisitos

- .NET SDK compatível com o projeto.
- Node.js e npm.
- Git.

### 1. Baixar o projeto

```bash
git clone URL_DO_REPOSITORIO
cd Desafio_Tecnico_Dreamer
```

Substitua `URL_DO_REPOSITORIO` pelo endereço do repositório no GitHub.

### 2. Configurar a chave JWT

Na raiz do projeto, execute:

```powershell
dotnet user-secrets init --project backend
dotnet user-secrets set "Jwt:Key" "SUA_CHAVE_SECRETA_FORTE" --project backend
```

Substitua o exemplo por uma chave aleatória forte, com pelo menos 32 bytes. A chave é uma configuração local e não deve ser enviada ao repositório.

### 3. Preparar e iniciar o backend

Em um terminal:

```powershell
cd backend
dotnet restore
dotnet tool install --global dotnet-ef
dotnet ef database update
dotnet run --launch-profile http
```

Se a ferramenta `dotnet-ef` já estiver instalada, não é necessário instalá-la novamente. A versão da ferramenta deve ser compatível com a versão do Entity Framework Core usada no projeto.

A API ficará disponível em `http://localhost:5000`.

### 4. Iniciar o frontend

Em outro terminal, a partir da raiz do projeto:

```powershell
cd frontend
npm install
npm start
```

A interface ficará disponível em `http://localhost:4200`.

### 5. Primeiro acesso

Abra a interface no navegador, crie uma conta e faça login. Depois, registre o início da jornada, finalize o registro e consulte o histórico.

## Decisões técnicas

**Persistência com SQLite**

Escolhi SQLite para simplificar a execução local e facilitar a avaliação do projeto, sem exigir a instalação de um servidor de banco de dados separado.

**Autenticação e senhas**

A API utiliza JWT para autenticar as requisições protegidas. As senhas são armazenadas como hashes, utilizando o `PasswordHasher` do ASP.NET Core Identity, em vez de serem salvas em texto puro.

**Separação dos registros por usuário**

Os registros são associados ao usuário autenticado. A API utiliza a identidade extraída do token para consultar e registrar jornadas, evitando que um usuário acesse o histórico de outro por meio de uma simples alteração de parâmetros.

**Registro de horários**

Os eventos são registrados utilizando UTC no backend. O tratamento e a exibição de horários em diferentes fusos precisam considerar o contexto local de cada colaborador; esse é um ponto importante para uma solução internacional.

**Configuração do JWT**

A validação de emissor (`Issuer`) e audiência (`Audience`) está desativada deliberadamente nesta versão. Essa decisão simplifica a configuração do desafio, mas, em produção, eu configuraria valores explícitos e habilitaria ambas as validações.

## Testes e validações

Durante o desenvolvimento, executei os testes automatizados do frontend e validei a geração do build de produção.

**Resultados obtidos:**
- 3 testes automatizados aprovados em 2 arquivos de teste.
- Build de produção do Angular concluído com sucesso.
- Compilação do backend concluída com sucesso usando `dotnet test`. Esse comando não confirmou a existência de testes automatizados no backend.

Também verifiquei manualmente os seguintes fluxos durante o desenvolvimento:
- Cadastro e login de usuários.
- Rejeição de requisições sem autenticação válida.
- Separação dos registros por usuário.
- Registro de início e término da jornada.
- Persistência dos registros após atualizar a página e entrar novamente.

O build do Angular apresentou um aviso de orçamento de CSS: o arquivo `app.css` ultrapassa o limite configurado de 4 kB. A compilação foi concluída normalmente, mas essa otimização permanece como melhoria futura.


## Próximas melhorias

- Completar e testar o tratamento de fusos horários para colaboradores em diferentes países.
- Ampliar a cobertura de testes automatizados.
- Configurar emissor e audiência do JWT.
- Avaliar uma estratégia de revogação de tokens e gestão de sessões.
- Preparar configurações específicas para implantação em produção.

## Considerações finais

O objetivo deste projeto foi desenvolver uma solução funcional e compreender as decisões envolvidas na construção de uma aplicação web com frontend, backend, autenticação e persistência.

Durante o desenvolvimento, procurei priorizar uma estrutura simples de executar, separar as responsabilidades entre as camadas e documentar as escolhas feitas diante dos requisitos do desafio.
