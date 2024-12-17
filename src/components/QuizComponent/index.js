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
    const component = this.getComponentForCurrentView();
    const container = this.createContainer();
    container.appendChild(component);
    this.shadowRoot.appendChild(container);
  }

  getComponentForCurrentView() {
    switch (this.state.currentView) {
      case "menu":
        return this.createMenuComponent();
      case "content":
        return this.createContentComponent();
      case "done":
        return this.createResultComponent("done");
      case "failed":
        return this.createResultComponent("failed");
      default:
        throw new Error("Invalid view state");
    }
  }

  createMenuComponent() {
    const menu = new QuizMenu();
    menu.addEventListener("start-quiz", (event) => {
      this.updateState({ username: event.detail.username, currentView: "content" });
    });
    return menu;
  }

  createContentComponent() {
    const content = new QuizContent();
    content.setAttribute("username", this.state.username);
    content.addEventListener("finish-quiz", (event) => {
      this.updateState({ score: event.detail.score, currentView: "done" });
    });
    content.addEventListener("fail-quiz", (event) => {
      this.updateState({ score: event.detail.score, currentView: "failed" });
    });
    return content;
  }

  createResultComponent(status) {
    const result = new QuizResult();
    result.setAttribute("username", this.state.username);
    result.setAttribute("score", this.state.score);
    result.setAttribute("status", status);
    result.addEventListener("restart-quiz", () => {
      this.updateState({ currentView: "content", score: 0 });
    });
    return result;
  }

  updateState(newState) {
    this.state = { ...this.state, ...newState };
    this.render();
  }

  createContainer() {
    const container = document.createElement("div");
    container.classList.add("quiz-container");
    return container;
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
