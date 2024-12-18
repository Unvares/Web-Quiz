export default class HeaderComponent extends HTMLElement {
  shadowRoot = this.attachShadow({ mode: "open" });

  constructor() {
    super();
    this.render();
    this.addEventListeners();
  }

  render() {
    this.shadowRoot.innerHTML = this.getStyles() + this.getTemplate();
  }

  addEventListeners() {
    const quizButton = this.shadowRoot.getElementById("quizButton");
    const scoreboardButton = this.shadowRoot.getElementById("scoreboardButton");

    if (quizButton) {
      quizButton.addEventListener("click", () => {
        this.dispatchEvent(
          new CustomEvent("navigate-to", {
            detail: { view: "quiz" },
            bubbles: true,
            composed: true,
          })
        );
      });
    }

    if (scoreboardButton) {
      scoreboardButton.addEventListener("click", () => {
        this.dispatchEvent(
          new CustomEvent("navigate-to", {
            detail: { view: "scoreboard" },
            bubbles: true,
            composed: true,
          })
        );
      });
    }
  }

  getTemplate() {
    return `
      <header class="header">
        <h1 class="header__title">Quiz App</h1>
        <nav class="header__navbar">
          <ul>
            <li>
              <a id="quizButton">Quiz</a>
            </li>
            <li>
              <a id="scoreboardButton">Scoreboard</a>
            </li>
          </ul>
        </nav>
      </header>
    `;
  }

  getStyles() {
    return `
      <style>
        :host {
          width: 100%;
          height: 60px;
        }

        .header {
          height: 100%;
          padding: 0 32px;
          display: flex;
          flex-flow: row nowrap;
          justify-content: space-between;
          background-color: #f5f5f5;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }

        .header__title {
          margin: 0;
          font-size: 24px;
          font-weight: 700;
          color: #212121;
          line-height: 60px;
        }

        .header__navbar ul {
          height: 100%;
          margin: 0;
          padding: 0;
          display: flex;
          flex-flow: row nowrap;
          align-items: center;
          justify-content: space-between;
          list-style: none;
          gap: 24px;
          list-style: none;
        }

        .header__navbar a {
          cursor: pointer;
          user-select: none;
          text-decoration: none;
          color: #212121;
          font-size: 16px;
          font-weight: 500;
          position: relative;
          transition: color 0.2s ease;
        }

        .header__navbar a::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: -2px;
          width: 100%;
          height: 1px;
          background-color: #212121;
          transform: scaleX(0);
          transition: transform 0.3s ease;
          transform-origin: right;
        }

        .header__navbar a:hover {
          color: #424242;
        }

        .header__navbar a:hover::after {
          transform: scaleX(1);
          transform-origin: left;
        }

        .header__navbar a:active::after {
          transform: scaleY(2);
        }
      </style>
    `;
  }
}

customElements.define("header-component", HeaderComponent);