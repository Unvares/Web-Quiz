export default class AppComponent extends HTMLElement {
  shadowRoot = this.attachShadow({ mode: "open" });
  state = { currentView: "quiz" };

  constructor() {
    super();
    this.render();
    this.addEventListeners();
  }

  render() {
    this.shadowRoot.innerHTML = this.getStyles();
    const appContainer = this.createAppContainer();
    this.shadowRoot.appendChild(appContainer);
  }

  createAppContainer() {
    const container = document.createElement("div");
    container.classList.add("app");

    const header = document.createElement("header-component");
    container.appendChild(header);

    if (this.state.currentView === "quiz") {
      const quiz = document.createElement("quiz-component");
      container.appendChild(quiz);
    } else if (this.state.currentView === "scoreboard") {
      const scoreboard = document.createElement("scoreboard-component");
      container.appendChild(scoreboard);
    }

    return container;
  }

  addEventListeners() {
    this.addEventListener("navigate-to", (event) => {
      this.state.currentView = event.detail.view;
      this.render();
    });
  }

  getStyles() {
    return `
      <style>
        .app {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          width: 100svw;
          height: 100svh;
          background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
          background-size: 400% 400%;
          animation: gradient 15s ease infinite;
        }

        @keyframes gradient {
          0% {
              background-position: 0% 50%;
          }

          50% {
              background-position: 100% 50%;
          }

          100% {
              background-position: 0% 50%;
          }
        }
      </style>
    `;
  }
}

customElements.define("app-component", AppComponent);
