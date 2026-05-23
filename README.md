# 🎓 TeachGram - Desafio Final Fullstack

## Visão Geral
Este repositório contém a solução completa para o **Desafio Final Fullstack** do curso **3035 TEACH**. O objetivo é desenvolver uma aplicação **Spring Boot** (backend) e uma interface **React** (frontend) que simula uma rede social, permitindo a criação, edição, exclusão e listagem de usuários e posts, com autenticação via Spring Security.

---

## Objetivos do Desafio
- **Backend**: API RESTful em Spring Boot com JPA, mapeamento **1:N** entre **Usuário** e **Post**.
- **Banco de Dados**: PostgreSQL, configurado via `application.yml`.
- **Autenticação**: Spring Security com criptografia de senhas.
- **Operações CRUD** completas para usuários e posts.
- **Frontend**: Aplicação responsiva em React/TypeScript seguindo o layout do Figma.
- **Funcionalidades Extras**: Likes em posts, lista de amigos (relação N‑N), busca de usuários, login via Google/Apple (opcional).

---

## Tecnologias Utilizadas

### Backend (Spring Boot)
<img src="https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white" alt="Java"/>
<img src="https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white" alt="Spring Boot"/>
<img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL"/>
<img src="https://img.shields.io/badge/Apache_Maven-C71A36?style=for-the-badge&logo=apache-maven&logoColor=white" alt="Maven"/>

### Frontend (React)
<img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React"/>
<img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
<img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite"/>
<img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS"/>
<img src="https://img.shields.io/badge/Figma-F24E1E?style=for-the-badge&logo=figma&logoColor=white" alt="Figma"/>

---
## Configuração e Execução
### Pré‑requisitos
- Java JDK 17
- Maven 3.9+
- Node.js 20+ & npm (ou pnpm)
- PostgreSQL (versão 14 ou superior)

### Backend
1. Crie um banco PostgreSQL chamado `teachgram`.
2. Configure as credenciais em `backend/src/main/resources/application.yml`.
3. Execute: `cd teachgram` e `mvn spring-boot:run`.

### Frontend
1. Instale as dependências: `cd teachgram-front` e `npm install`.
2. Inicie o servidor: `npm run dev`.

---

## Endpoints da API (Backend)
| Método | Rota | Descrição |
|--------|------|-----------|
| **POST** | `/api/auth/signup` | Cria novo usuário |
| **POST** | `/api/auth/login` | Login (JWT) |
| **GET** | `/api/users` | Lista usuários |
| **GET** | `/api/posts` | Lista posts |
| **POST** | `/api/posts` | Cria post |
| **POST** | `/api/friends/request` | Envia solicitação de amizade |

---

## UI / Design
O layout foi definido no **Figma**. Acesse o protótipo completo:
[Figma – TeachGram Design](https://www.figma.com/design/kstnnREkgicTbvFxfBzu3C/Teach-3035---Desafio-Frontend-final?node-id=0-1&t=jze2w9JUtB0X97oQ-16)

---

## 🙋‍♀️ Desenvolvido por

| [<img src="https://avatars.githubusercontent.com/eduarda-guimaraes" width="100px;" alt="Foto de perfil do GitHub de Eduarda Guimarães"/>](https://github.com/eduarda-guimaraes) |
| :---: |
| **Eduarda Guimarães** |
