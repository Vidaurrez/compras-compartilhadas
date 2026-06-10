# Sistema de Compras Compartilhadas

Projeto acadêmico desenvolvido para o trabalho prático Desenvolvimento de Aplicação Distribuída em Java.

## Descrição

O Sistema de Compras Compartilhadas tem como objetivo auxiliar grupos de pessoas, como famílias, repúblicas estudantis e moradores de residências compartilhadas, na organização de listas de compras e no controle de despesas comuns.

A aplicação permite o gerenciamento de usuários, grupos, listas de compras, itens e registros de compras realizadas pelos participantes.

## Problema

Pessoas que realizam compras coletivas frequentemente enfrentam dificuldades para:

* Organizar listas compartilhadas;
* Evitar compras duplicadas;
* Controlar quem comprou cada item;
* Dividir despesas de forma justa.

## Solução Proposta

Desenvolver uma aplicação distribuída capaz de:

* Cadastrar usuários;
* Criar grupos de compras;
* Gerenciar listas compartilhadas;
* Registrar itens adquiridos;
* Controlar gastos realizados pelos participantes.

## Tecnologias Utilizadas

* Java
* Spring Boot
* MySQL
* phpMyAdmin
* Git
* GitHub

## Estrutura do Projeto

```text
docs/
database/
backend/
frontend/
```

## Modelagem

O projeto possui modelagem de banco de dados desenvolvida utilizando DBML e dbdiagram.io.

Entidades principais:

* Usuários
* Grupos
* Usuário_Grupos
* Listas
* Itens
* Compras

## Status do Projeto

* [x] Definição do problema
* [x] Definição do escopo
* [x] Modelagem do banco de dados
* [x] DER
* [x] Implementação do banco MySQL
* [ ] Backend Spring Boot
* [ ] API REST
* [ ] Frontend
* [ ] Testes finais

## Autor

Pedro Vidaurre Lima
