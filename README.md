<div align="center">

# Flashback Stream

### Plataforma de streaming musical retrô desenvolvida com React, Vite e Supabase

<p>
  Experiência moderna inspirada nos clássicos das décadas passadas,
  combinando catálogo musical, favoritos, autenticação e gerenciamento
  de planos em uma interface visual inspirada na estética synthwave.
</p>

</div>

---

## Visão Geral

Flashback Stream é uma aplicação web de streaming musical focada em conteúdo retrô.

A plataforma permite explorar gêneros musicais clássicos, reproduzir prévias das músicas, salvar conteúdos favoritos e gerenciar planos de assinatura através de uma interface responsiva integrada ao Supabase.

---

## Interface

### Home

<img width="100%" src="./docs/home.png">

A página inicial apresenta:

- Destaques musicais
- Gêneros disponíveis
- Plano atual do usuário
- Acesso rápido ao catálogo

---

### Catálogo

<img width="100%" src="./docs/catalog.png">

Funcionalidades:

- Navegação por gênero
- Cards dinâmicos
- Reprodução de prévias
- Integração com favoritos

---

### Player

<img width="100%" src="./docs/player.png">

Recursos:

- Reprodução via `preview_url`
- Controles de play e pause
- Exibição de capa
- Informações da faixa

---

### Favoritos

<img width="100%" src="./docs/favorites.png">

Recursos:

- Adição e remoção em tempo real
- Persistência no banco de dados
- Sincronização automática entre páginas

---

### Planos

<img width="100%" src="./docs/plans.png">

Recursos:

- Listagem dinâmica via Supabase
- Benefícios configuráveis
- Alteração de plano
- Associação do plano ao usuário

---

## Funcionalidades

| Módulo | Status |
|----------|----------|
| Autenticação | ✔ |
| Cadastro | ✔ |
| Login | ✔ |
| Recuperação de senha | ✔ |
| Catálogo musical | ✔ |
| Reprodução de prévias | ✔ |
| Favoritos | ✔ |
| Gêneros | ✔ |
| Planos | ✔ |
| Integração Supabase | ✔ |
| Responsividade | ✔ |

---

## Tecnologias

### Frontend

- React
- Vite
- React Router
- Tailwind CSS
- Lucide React

### Backend

- Supabase Authentication
- Supabase Database
- Supabase Storage

### Banco de Dados

- PostgreSQL

---

## Estrutura do Projeto

```text
src
├── components
├── contexts
├── hooks
├── pages
├── routes
├── services
├── styles
└── utils
```

---

## Arquitetura

```text
React
   │
   ├── Context API
   │      ├── AuthContext
   │      ├── FavoritesContext
   │      └── ToastContext
   │
   ├── Services
   │      └── Supabase
   │
   └── PostgreSQL
```

---

## Banco de Dados

### genres

```sql
id
name
slug
```

### contents

```sql
id
title
synopsis
cover_url
preview_url
genre_id
```

### favorites

```sql
id
user_id
content_id
created_at
```

### plans

```sql
id
name
price
description
benefits
```

### user_plans

```sql
user_id
plan_id
created_at
```

---

## Instalação

Clone o repositório:

```bash
git clone https://github.com/seu-usuario/flashback-stream.git
```

Instale as dependências:

```bash
npm install
```

Configure as variáveis:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

Execute o projeto:

```bash
npm run dev
```

---

## Segurança

O projeto utiliza:

- Supabase Authentication
- Row Level Security (RLS)
- Políticas por usuário
- Controle de sessão

---

## Design System

O Flashback Stream utiliza uma identidade visual baseada em:

- Glassmorphism
- Neon UI
- Layout responsivo
- Componentes reutilizáveis
- Navegação simplificada

---

## Desenvolvedor

Otávio

Projeto desenvolvido utilizando React, Supabase e Tailwind CSS como plataforma de streaming musical retrô.
