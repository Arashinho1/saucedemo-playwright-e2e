# 🧪 SauceDemo E2E Test Automation Framework

[![Playwright Tests](https://github.com/Arashinho1/saucedemo-playwright-e2e/actions/workflows/playwright.yml/badge.svg)](https://github.com/Arashinho1/saucedemo-playwright-e2e/actions)
![Playwright](https://img.shields.io/badge/Playwright-1.50-2EAD33?style=for-the-badge&logo=playwright&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-20+-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)

Projeto de automação de testes End-to-End (E2E) para a aplicação web [SauceDemo](https://www.saucedemo.com/), desenvolvido com **Playwright** e **TypeScript**, aplicando o padrão de arquitetura **Page Object Model (POM)** e pipeline de integração contínua com **GitHub Actions**.

---

## 🎯 Objetivo e Boas Práticas Demonstradas

* **Page Object Model (POM):** Separação clara entre a lógica de localização/interação dos elementos da página e os casos de teste (alta manutenibilidade e baixo acoplamento).
* **Tipagem Estrita:** Uso de TypeScript para detecção estática de erros e autocompletar eficiente.
* **Execução Paralela:** Testes executados concorrentemente por padrão para otimizar tempo de feedback.
* **Resiliência:** Uso de localizadores semânticos baseados em `data-test` e mecanismos de *auto-waiting* nativos do Playwright (sem esperas estáticas ou `sleep`).
* **CI/CD:** Pipeline automatizado no GitHub Actions que executa a suíte e disponibiliza o relatório HTML como artefato a cada push/PR.

---

## 📁 Estrutura do Projeto

```text
saucedemo-playwright-e2e/
├── .github/
│   └── workflows/
│       └── playwright.yml       # Pipeline CI/CD no GitHub Actions
├── src/
│   ├── data/
│   │   └── testData.ts          # Massa de dados, usuários e mensagens esperadas
│   └── pages/                   # Camada de Page Objects (POM)
│       ├── BasePage.ts          # Métodos e comportamentos base compartilhados
│       ├── LoginPage.ts         # Mapeamento e ações da tela de login
│       ├── InventoryPage.ts     # Mapeamento do catálogo, filtros e carrinho
│       ├── CartPage.ts          # Mapeamento da tela do carrinho
│       └── CheckoutPage.ts      # Mapeamento dos passos de checkout e confirmação
├── tests/
│   ├── login.spec.ts            # Cenários de autenticação e validações de erro
│   ├── inventory.spec.ts        # Cenários de ordenação e manipulação de itens
│   └── checkout.spec.ts         # Fluxo completo de compra E2E e validações
├── playwright.config.ts         # Configurações globais do Playwright (browsers, reporters, retries)
├── tsconfig.json                # Configuração do TypeScript
└── package.json                 # Dependências e scripts de execução
```

---

## 🧪 Cenários de Teste Cobertos

### 1. Autenticação & Login (`tests/login.spec.ts`)
- [x] Login com credenciais válidas e redirecionamento correto para `/inventory.html`.
- [x] Bloqueio e mensagem de erro para usuário bloqueado (`locked_out_user`).
- [x] Validação de erro ao inserir credenciais inválidas.
- [x] Validação de obrigatoriedade do campo *Username*.
- [x] Validação de obrigatoriedade do campo *Password*.

### 2. Catálogo & Produtos (`tests/inventory.spec.ts`)
- [x] Ordenação alfabética reversa de produtos (Z a A).
- [x] Ordenação de produtos por preço (Menor para Maior).
- [x] Atualização dinâmica do contador (*badge*) do carrinho ao adicionar e remover itens.

### 3. Fluxo de Compra E2E (`tests/checkout.spec.ts`)
- [x] **Jornada Completa:** Adição de produto ao carrinho -> validação no carrinho -> preenchimento dos dados de entrega -> conferência do resumo financeiro -> finalização com confirmação ("Thank you for your order!").
- [x] Validação de campos obrigatórios no formulário de entrega (Step 1).

---

## 🚀 Como Executar o Projeto Localmente

### Pré-requisitos
* [Node.js](https://nodejs.org/) versão 18 ou superior instalada.
* [Git](https://git-scm.com/) instalado.

### 1. Clonar o repositório
```bash
git clone https://github.com/Arashinho1/saucedemo-playwright-e2e.git
cd saucedemo-playwright-e2e
```

### 2. Instalar dependências
```bash
npm install
```

### 3. Instalar os navegadores do Playwright
```bash
npx playwright install chromium
```

### 4. Executar os testes
```bash
# Executa todos os testes em modo headless (console rápido)
npm test

# Executa os testes abrindo o navegador (modo headed)
npm run test:headed

# Executa com a interface gráfica interativa do Playwright
npm run test:ui

# Visualizar o relatório detalhado em HTML após a execução
npm run report
```

---

## ⚙️ Integração Contínua (CI/CD)

O projeto possui um workflow configurado em [`.github/workflows/playwright.yml`](.github/workflows/playwright.yml) que:
1. Sobe uma máquina virtual Ubuntu no GitHub Actions.
2. Instala o ambiente Node.js e as dependências do projeto com `npm ci`.
3. Executa a suíte completa de testes Playwright em modo headless.
4. Gera e publica o artefato `playwright-report` com relatórios, screenshots e traces para download.

---

## 👨‍💻 Autor

Feito por **Vitor Hugo**  
* LinkedIn: [linkedin.com/in/vitor-hugo-39a620186](https://www.linkedin.com/in/vitor-hugo-39a620186)  
* GitHub: [@Arashinho1](https://github.com/Arashinho1)
