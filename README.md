<div align="center">

# MusicStream

**Plataforma de streaming de músicas retrô, com aplicação web e aplicativo mobile**

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Flutter](https://img.shields.io/badge/Flutter-02569B?style=for-the-badge&logo=flutter&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![SQL](https://img.shields.io/badge/SQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)

</div>

---

## Sobre o projeto

O **MusicStream** é uma plataforma temática de streaming de músicas retrô, desenvolvida no curso técnico de **Análise e Desenvolvimento de Sistemas do SENAI**. O projeto tem uma aplicação web em React e um aplicativo mobile em Flutter, ambos conectados ao Supabase. O script do banco está em [`SQLcode.sql`](./SQLcode.sql).

## Estrutura

```
MusicStreamApp/
├── webApp/       # Aplicação web (React + Vite)
├── mobile_app/   # Aplicativo mobile (Flutter)
└── SQLcode.sql   # Estrutura do banco de dados
```

## Planos

* Exibição dos planos disponíveis
* Informações de preços
* Benefícios de cada plano
* Simulação de assinatura

---

# Instalação da Aplicação Web

```bash
cd webApp
npm install
npm run dev
```

Criar um arquivo `.env` contendo:

```env
VITE_SUPABASE_URL=YOUR_SUPABASE_URL
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

---

# Instalação da Aplicação Mobile

```bash
cd mobile_app
flutter pub get
flutter run
```

Configurar as credenciais do Supabase no projeto Flutter.

---

# Equipe

Projeto desenvolvido para a disciplina de Desenvolvimento de Sistemas, utilizando React, Flutter e Supabase para a construção de uma plataforma de streaming temática voltada para músicas retrô.
