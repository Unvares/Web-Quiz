# 📚 Web Quiz

For visualized instructions on how to use the app, go [here](INSTRUCTIONS.md)

## 📝 Overview

This project is a browser-based quiz application built with JavaScript using Web Components and Web Storage APIs. It includes a quiz component and a client-side storage for scoreboard.

## 🚀 Features

- **Timed quiz questions.**
- **Scorebgorad using Web Storage API**
- **Componentization using WebComponents API.**

## 📂 Project Structure

```lua
├── src/
│ ├── index.html
│ ├── components/
│ │ ├── AppComponent/
│ │ ├── HeaderComponent/
│ │ ├── QuizComponent/
│ │ │ ├── QuizContent.js
│ │ │ ├── QuizMenu.js
│ │ │ └── QuizResult.js
│ │ └── ScoreboardComponent/
│ └── styles/
│ └── reset.css
├── .editorconfig
├── .eslintrc.js
├── .stylelintrc.js
├── package.json
└── vite.config.js
```

## 💻 Installation & Setup

### 1. Clone the Repository

```bash
git clone git@github.com:Unvares/Web-Quiz.git
```

```bash
cd Web-Quiz
```

### 2. Install Dependencies

Ensure you have **Node.js** and **npm** installed, then run:

```bash
npm install
```

## ✅ Running Linters

Check code quality with:

```bash
npm run lint
```

## 🔧 Build & Run the Application

1. **Build the project:**

   ```bash
   npm run build
   ```

2. **Start the HTTP server:**

   ```bash
   npm run http-server dist
   ```

3. Access the app by navigating to the IP address displayed in the console.

## 🎨 CSS Methodology

This project follows the **BEM (Block-Element-Modifier)** methodology for naming CSS classes. For more information:

[BEM Official Documentation](https://en.bem.info/methodology/)
