# SplitCart

Compre junto. Divida fácil.

## Sobre o Projeto

O SplitCart é uma aplicação web desenvolvida para o Trabalho Prático **Desenvolvimento de Aplicação Distribuída em Java**.

O sistema foi criado para auxiliar grupos de pessoas, como famílias, repúblicas estudantis, apartamentos compartilhados e amigos, na organização de compras coletivas e na divisão automática dos gastos.

A aplicação permite criar grupos, gerenciar listas de compras, registrar itens adquiridos pelos participantes e calcular automaticamente quanto cada membro deve pagar ou receber.

## Problema

Em compras compartilhadas, é comum surgirem dificuldades para:

* Organizar listas de compras coletivas;
* Controlar quem comprou cada item;
* Registrar valores gastos pelos participantes;
* Realizar a divisão justa das despesas;
* Evitar conflitos e esquecimentos.

## Solução

O SplitCart centraliza todo o processo de compras compartilhadas em uma única plataforma, permitindo:

* Cadastro e autenticação de usuários;
* Criação de grupos de compras;
* Convite de participantes por código;
* Criação e gerenciamento de listas;
* Registro de itens e compras realizadas;
* Controle financeiro automático;
* Cálculo de rateio entre os participantes.

## Tecnologias Utilizadas

### Backend

* Java 21
* Spring Boot
* Spring Data JPA
* Maven

### Banco de Dados

* MySQL
* phpMyAdmin

### Frontend

* React
* Vite
* JavaScript
* CSS

### Hospedagem

* Railway (Backend e Banco de Dados)
* Vercel (Frontend)

### Controle de Versão

* Git
* GitHub

## Arquitetura

A aplicação utiliza arquitetura distribuída em três camadas:

```text
Frontend (React)
        ↓ HTTP/JSON
Backend (Spring Boot)
        ↓ JPA
Banco de Dados (MySQL)
```

## Funcionalidades

### Usuários

* Cadastro
* Login
* Persistência de sessão
* Logout

### Grupos

* Criar grupo
* Gerar código de convite
* Entrar em grupo por código
* Listar membros
* Sair do grupo
* Excluir grupo (apenas criador)

### Listas

* Criar lista
* Finalizar lista
* Excluir lista

### Itens

* Adicionar item
* Definir quantidade
* Definir unidade opcional
* Excluir item

### Compras

* Registrar compra
* Registrar valor pago
* Registrar usuário comprador

### Resumo Financeiro

* Total gasto por lista
* Quantidade de participantes
* Valor por pessoa
* Valor gasto por cada membro
* Quanto cada participante deve pagar
* Quanto cada participante deve receber

## Modelagem do Banco de Dados

Entidades principais:

* Usuario
* Grupo
* UsuarioGrupo
* Lista
* Item
* Compra

Relacionamentos:

* Grupo → Usuario (criadoPor)
* Lista → Grupo
* Item → Lista
* Item → Usuario (adicionadoPor)
* Compra → Item
* Compra → Usuario
* UsuarioGrupo → Usuario
* UsuarioGrupo → Grupo

## Como Executar Localmente

### Backend

```bash
cd backend
mvn spring-boot:run
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Projeto Online

Frontend:
https://splitcart-six.vercel.app/

Backend:
https://compras-compartilhadas-production.up.railway.app/usuarios

## Estrutura do Projeto

```text
backend/
frontend/
database/
docs/
```

## Autor

Pedro Vidaurre Lima
