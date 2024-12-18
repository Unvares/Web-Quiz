export default class QuizMenu extends HTMLElement {
  shadowRoot = this.attachShadow({ mode: "open" });

  constructor() {
    super();
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = this.getStyles() + this.getTemplate();

    this.shadowRoot
      .querySelector(".menu")
      .addEventListener("submit", (event) => {
        event.preventDefault();
        this.startQuiz();
      });
  }

  getStyles() {
    return `
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        :host {
          flex-grow: 1;
        }

        .menu {
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: stretch;
          justify-content: flex-start;
          border-radius: 8px;
          gap: 24px;
        }

        .menu__title {
          text-align: center;
          font-size: 1.75rem;
          font-weight: 500;
          color: #424242;
        }

        .menu__control-panel {
          height: 100%;
          display: flex;
          flex-flow: column nowrap;
          jsutify-content: center;
          align-items: stretch;
          gap: 8px;
        }

        .menu__input-field {
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 1rem;
          transition: border-color 0.3s;
        }

        .menu__input-field:focus {
          border-color: #1976d2;
          outline: none;
        }

        .menu__button {
          height: 40px;
          background-color: #1976d2;
          color: white;
          padding: 10px 20px;
          border: none;
          border-radius: 4px;
          font-size: 1rem;
          cursor: pointer;
          transition: background-color 0.3s;
        }

        .menu__button:hover {
          background-color: #1565c0;
        }
      </style>
    `;
  }

  getTemplate() {
    return `
      <form class="menu">
        <h2 class="menu__title">Welcome to the Quiz!</h2>
        <div class="menu__control-panel">
          <input class="menu__input-field" type="text" id="username" placeholder="Enter your name" required />
          <button class="menu__button" label="Start Quiz" type="submit" id="startButton">Start Quiz</button>
        </div>
      </form>
    `;
  }

  startQuiz() {
    const username = this.shadowRoot.getElementById("username").value.trim();
    if (username) {
      this.dispatchEvent(
        new CustomEvent("start-quiz", { detail: { username }, bubbles: true })
      );
    } else {
      alert("Please enter a valid username.");
    }
  }
}

customElements.define("quiz-menu", QuizMenu);
