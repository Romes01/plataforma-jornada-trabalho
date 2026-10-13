# Plataforma de Jornada de Trabalho

Aplicação web desenvolvida como parte de um desafio técnico para praticar a construção de uma solução completa, desde a interface até a API e a persistência dos dados.

A proposta permite que colaboradores registrem o início e o término da jornada de trabalho e consultem seu histórico por meio de autenticação.

## Funcionalidades

- Cadastro de usuários e login.
- Autenticação por token JWT.
- Registro de início e término da jornada.
- Consulta ao histórico de registros.
- Separação dos registros por usuário autenticado.
- Persistência dos dados em banco SQLite.
- Interface web responsiva, adaptada a diferentes tamanhos de tela.

## Tecnologias utilizadas

### Backend

- C# e ASP.NET Core.
- Entity Framework Core.
- SQLite.
- JWT para autenticação.
- ASP.NET Core Identity para hash de senhas.

### Frontend

- Angular.
- TypeScript.
- HTML e CSS.

## Como executar o projeto

### Pré-requisitos

- Git.
- .NET SDK compatível com o projeto.
- Node.js e npm.

### 1. Baixar o projeto

Abra um terminal na pasta em que deseja armazenar o projeto e execute:

```bash
git clone https://github.com/Romes01/plataforma-jornada-trabalho.git
cd plataforma-jornada-trabalho
```

### 2. Configurar a chave JWT

Na raiz do projeto, execute os comandos abaixo no PowerShell:

```powershell
dotnet user-secrets init --project backend
```

Gere uma chave aleatória forte e configure-a localmente. Por exemplo, no PowerShell:

```powershell
$keyBytes = [System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32)
$key = [Convert]::ToBase64String($keyBytes)
dotnet user-secrets set "Jwt:Key" $key --project backend
```

A chave será armazenada na configuração local do .NET User Secrets. **Não compartilhe nem envie uma chave secreta real ao repositório.**

### 3. Preparar e iniciar o backend

Em um terminal, a partir da raiz do projeto:

```powershell
cd backend
dotnet restore
```

Se a ferramenta `dotnet-ef` ainda não estiver instalada, execute:

```powershell
dotnet tool install --global dotnet-ef
```

Depois, aplique as migrações e inicie a API:

```powershell
dotnet ef database update
dotnet run --launch-profile http
```

A API ficará disponível em:

`http://localhost:5000`

Mantenha esse terminal aberto enquanto estiver utilizando a aplicação.

### 4. Iniciar o frontend

Abra um segundo terminal na raiz do projeto e execute:

```powershell
cd frontend
npm install
npm start
```

A interface ficará disponível em:

`http://localhost:4200`

Mantenha esse segundo terminal aberto enquanto estiver utilizando a aplicação.

### 5. Primeiro acesso

1. Abra `http://localhost:4200` no navegador.
2. Crie uma conta.
3. Faça login com as credenciais cadastradas.
4. Registre o início da jornada de trabalho.
5. Finalize a jornada e consulte o histórico.

## Decisões técnicas

### Persistência com SQLite

Escolhi SQLite para simplificar a execução local e facilitar a avaliação do projeto, sem exigir a instalação de um servidor de banco de dados separado.

### Autenticação e senhas

A API utiliza JWT para autenticar as requisições protegidas. As senhas são armazenadas como hashes utilizando o `PasswordHasher` do ASP.NET Core Identity, em vez de serem salvas em texto puro.

### Separação dos registros por usuário

Os registros são associados ao usuário autenticado. A API utiliza a identidade extraída do token para consultar e registrar jornadas, evitando que um usuário acesse o histórico de outro por meio de uma simples alteração de parâmetros.

### Registro de horários

Os eventos são registrados utilizando UTC no backend. O tratamento e a exibição de horários em diferentes fusos precisam considerar o contexto local de cada colaborador. Esse é um ponto importante para uma solução destinada a uma equipe internacional e permanece como melhoria futura.

### Configuração do JWT

A validação de emissor (`Issuer`) e audiência (`Audience`) está desativada deliberadamente nesta versão. Essa decisão simplifica a configuração do desafio, mas, em produção, eu configuraria valores explícitos e habilitaria ambas as validações.

## Testes e validações

Durante o desenvolvimento, executei os testes automatizados do frontend e validei a geração do build de produção.

### Resultados obtidos

- 3 testes automatizados aprovados em 2 arquivos de teste.
- Build de produção do Angular concluído com sucesso.
- Compilação do backend concluída com sucesso utilizando `dotnet test`. Esse comando não confirmou a existência de testes automatizados no backend.

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
- Revisar os limites de CSS do build do Angular.

## Considerações finais

O objetivo deste projeto foi desenvolver uma solução funcional e compreender as decisões envolvidas na construção de uma aplicação web com frontend, backend, autenticação e persistência.

Durante o desenvolvimento, procurei priorizar uma estrutura simples de executar, separar as responsabilidades entre as camadas e documentar as escolhas feitas diante dos requisitos do desafio.