# 🚀 PitchMint — AI-Powered Startup Idea Validator & Pitch Deck Generator

* *Validate, Visualize, Venture.**

PitchMint is an AI-powered SaaS platform that empowers entrepreneurs to validate their startup ideas, generate investor-ready pitch decks, simulate investor Q&A, and analyze competitors using Google's Gemini API. This repository contains the frontend application for PitchMint.

---

## 📖 Table of Contents

- [🚀 PitchMint-frontend — AI-Powered Startup Idea Validator & Pitch Deck Generator](#-pitchmint-frontend--ai-powered-startup-idea-validator--pitch-deck-generator)

  - [🛡️ Badges](#️-badges)

  - [📖 Table of Contents](#-table-of-contents)

  - [✨ Key Features](#-key-features)

  - [🏛️ Architecture Overview](#️-architecture-overview)

  - [🛠️ Tech Stack](#️-tech-stack)

  - [🚀 Getting Started](#️-getting-started)

    - [Prerequisites](#prerequisites)

    - [Installation](#installation)

  - [⚙️ Configuration](#️-configuration)

  - [💡 Usage](#-usage)

  - [📂 Project Structure](#-project-structure)

  - [📜 Scripts](#-scripts)

  - [🛣️ Roadmap](#️-roadmap)

  - [🤝 Contributing](#-contributing)

  - [🧪 Testing](#-testing)

  - [📄 License](#-license)

  - [🙏 Acknowledgements](#-acknowledgements)

- --

## ✨ Key Features

*   **Startup Idea Validator** – Evaluate startup ideas with AI-driven feedback.

*   **Pitch Deck Generator** – Auto-create professional 10-slide editable pitch decks.

*   **Lean Canvas Editor** – Interactive Lean Business Canvas.

*   **Competitor Analysis Generator** – Get AI-generated SWOT analysis of potential competitors.

*   **Investor Pitch Simulator** – Simulate investor Q&A sessions and receive AI feedback.

*   **User Authentication** – Secure JWT-based login and Google OAuth.

*   **Subscription Plans** – Free vs Pro plans with Razorpay integration.

*   **Dark/Light Mode** – Theme toggling with Context API & localStorage.

*   **Personal Dashboards** – Access saved ideas, decks, and canvases.

*   **Investor Matchmaking** – AI-powered matching with potential investors.

*   **Market Research** – Generate market insights and customer personas.

*   **Activity History** – Track all user interactions and generated content.

---

## 🏛️ Architecture Overview

The PitchMint frontend is a modern, single-page application (SPA) built with React and Vite, designed for a smooth and responsive user experience. It acts as the client-side interface for the PitchMint SaaS platform, consuming data and services from a dedicated backend API.

The frontend communicates with a robust Node.js/Express.js backend, which handles user authentication, data persistence (MongoDB), AI processing via Google's Gemini API, and payment processing through Razorpay. This separation of concerns ensures a scalable and maintainable architecture, where the frontend focuses solely on presentation and user interaction, while the backend manages business logic and external integrations.

---

## 🛠️ Tech Stack

| Area | Tool | Version |
|---|---|---|
|---|---|---|
| Framework | React.js | 18.x |
| Language | TypeScript | 5.x |
|---|---|---|
| Build Tool | Vite | 5.x |
| Styling | Tailwind CSS | 3.x |
|---|---|---|
| State Management | Redux Toolkit | 2.x |
| Routing | React Router DOM | 6.x |
|---|---|---|
| API Client | Axios | 1.x |
| Animations | Framer Motion | 11.x |
|---|---|---|
| Icons | Lucide React | 0.x |
| Markdown Rendering | React Markdown | 10.x |
|---|---|---|
| PDF Generation | @react-pdf/renderer, html2canvas, jspdf | 3.x, 1.x, 2.x |
| Logging | Winston | 3.x |
|---|---|---|
| Testing | Vitest, JSDOM, `@testing-library/react` | 3.x, 26.x, 16.x |
| Linting | ESLint, TypeScript-ESLint | 9.x, 8.x |
|---|---|---|
| Code Formatting | Prettier | (implied) |



---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Ensure you have the following installed:

*   **Node.js**: v18.x or higher. You can download it from [nodejs.org](https://nodejs.org/).

*   **pnpm**: Recommended package manager. Install with `npm install -g pnpm`. Alternatively, you can use `npm` or `yarn`.

### Installation

1.  **Clone the repository**:

```bash
git clone https://github.com/becodewala-youtube/PitchMint-frontend.git

cd PitchMint-frontend

```
2.  **Install dependencies**:

```bash
pnpm install

# or npm install
    # or yarn install

```
3.  **Create a `.env` file**:
    Create a `.env` file in the root of the project based on the `.env.example` (if available, otherwise refer to the Configuration section below) and fill in the required environment variables.

- --

## ⚙️ Configuration

The application uses environment variables for sensitive information and configuration. Create a `.env` file in the project root and populate it as follows:

| ENV | Description | Example |
|---|---|---|
|---|---|---|
| `VITE_API_URL` | The base URL for the PitchMint backend API. | `http://localhost:5000` or `https://api.pitchmint.com` |
| `VITE_GOOGLE_CLIENT_ID` | Your Google OAuth Client ID for Google Sign-In integration. | `YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com` |
| `VITE_RAZORPAY_KEY_ID` | Your Razorpay Key Id for Payement integration. | `rzrpy_live_895982695` |



---

## 💡 Usage

To start the development server:

```bash
pnpm dev

# or npm run dev

# or yarn dev

```
The application will typically be available at `http://localhost:5173`.

---

## 📂 Project Structure

```
.

├── public/
├── src/

│   ├── assets/
│   ├── components/

│   │   ├── auth/
│   │   ├── layout/

│   │   ├── modals/
│   │   ├── premium/

│   │   └── skeleton/
│   ├── contexts/

│   ├── pages/
│   ├── store/

│   │   └── slices/
│   ├── tests/

│   ├── utils/
│   ├── App.tsx

│   ├── index.css
│   └── main.tsx

├── .env.example
├── .eslintrc.js

├── .gitignore
├── index.html

├── package.json
├── pnpm-lock.yaml

├── postcss.config.js
├── README.md

├── tailwind.config.js
├── tsconfig.app.json

├── tsconfig.json
├── tsconfig.node.json

├── vercel.json
├── vite.config.ts

└── vitest.config.ts

```
---

## 📜 Scripts

The following scripts are available in `package.json`:

| Command | Description |
|---|---|
|---|---|
| `dev` | Starts the local development server using Vite. |
| `build` | Builds the application for production. |
|---|---|
| `lint` | Runs ESLint to check for code quality issues. |
| `preview` | Serves the production build locally for preview. |
|---|---|
| `test` | Runs all tests using Vitest. |
| `test:watch` | Runs tests in watch mode. |



---

## 🛣️ Roadmap

- [ ] Enhance collaborative pitch deck features with real-time editing and more robust presence indicators.

- [ ] Expand AI-powered tools, including advanced market research and investor matching algorithms.

- [ ] Improve PDF export quality and customization options for pitch decks.

- [ ] Implement comprehensive end-to-end (e2e) tests using Playwright or Cypress.

- [ ] Optimize performance and bundle size for faster load times.

- [ ] Add support for multiple languages (internationalization).

---

## 🤝 Contributing

We welcome contributions to PitchMint! If you'd like to contribute, please follow these steps:

1.  **Fork** the repository on GitHub.
2.  **Clone** your forked repository to your local machine.
3.  **Create a new branch** for your feature or bug fix: `git checkout -b feature/your-feature-name`.
4.  **Make your changes** and ensure they adhere to the project's coding standards.
5.  **Write tests** for your changes, if applicable.
6.  **Run tests** (`pnpm test`) to ensure everything is working correctly.
7.  **Commit your changes** with a clear and concise message: `git commit -m "feat: Add new feature X"`.
8.  **Push your branch** to your forked repository: `git push origin feature/your-feature-name`.
9.  **Open a Pull Request** to the `main` branch of the original repository.

Please ensure your pull request description clearly explains the changes you've made and why they are necessary.

---

## 🧪 Testing

PitchMint-frontend uses [Vitest](https://vitest.dev/) for unit and component testing, along with `@testing-library/react` for robust UI testing.

To run the tests:

```bash
pnpm test

```
To run tests in watch mode during development:

```bash
pnpm test:watch

```
---



## 🙏 Acknowledgements

*   **Google Gemini API** for powering the AI features.

*    **Razorpay** for payment processing.

*   **React**, **Vite**, and **Tailwind CSS** communities for excellent tools and resources.

*   All contributors and users who support PitchMint.
