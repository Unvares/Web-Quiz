import QuizMenu from "./QuizMenu";
import QuizContent from "./QuizContent";
import QuizResult from "./QuizResult";

export default class Quiz extends HTMLElement {
  shadowRoot = this.attachShadow({ mode: "open" });

  constructor() {
    super();
    this.state = {
      currentView: "menu",
      username: "",
      score: 0,
    };
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = this.getStyles();
    let component;
    switch (this.state.currentView) {
      case "menu":
        component = new QuizMenu();
        component.addEventListener("start-quiz", (event) => {
          this.state.username = event.detail.username;
          this.state.currentView = "content";
          this.render();
        });
        break;
      case "content":
        component = new QuizContent();
        component.setAttribute("username", this.state.username);
        component.addEventListener("quiz-completed", (event) => {
          this.state.score = event.detail.score;
          this.state.currentView = "result";
          this.render();
        });
        break;
      case "result":
        component = new QuizResult();
        component.setAttribute("username", this.state.username);
        component.setAttribute("score", this.state.score);
        component.addEventListener("restart-quiz", () => {
          this.state.currentView = "content";
          this.state.score = 0;
          this.render();
        });
        break;
    }
    const container = document.createElement("div");
    container.classList.add("quiz-container");
    container.appendChild(component);
    this.shadowRoot.appendChild(container);
  }

  getStyles() {
    return `
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .quiz-container {
          display: flex;
          flex-flow: column nowrap;
          align-items: stretch;
          justify-content: center;
          width: 400px;
          padding: 32px;
          border-radius: 8px;
          background-color: #f5f5f5;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }
      </style>
    `;
  }
}

customElements.define("quiz-component", Quiz);
