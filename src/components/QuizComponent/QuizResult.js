export default class QuizResult extends HTMLElement {
  shadowRoot = this.attachShadow({ mode: "open" });

  static get observedAttributes() {
    return ["username", "status", "elapsed-time", "result-message"];
  }

  constructor() {
    super();
    this.render();
    this.addEventListeners();
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  connectedCallback() {
    if (this.status === "done" && this.username && this.elapsedTime) {
      this.updateLocalStorage();
    }
    window.addEventListener("keydown", this.handleKeyDown);
  }

  disconnectedCallback() {
    window.removeEventListener("keydown", this.handleKeyDown);
  }

  handleKeyDown(event) {
    if (event.key === "r") {
      this.dispatchEvent(new CustomEvent("restart-quiz"));
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      // Convert kebab-case to camelCase for JavaScript
      const propertyName = name.replace(/-([a-z])/g, (match, letter) =>
        letter.toUpperCase()
      );
      this[propertyName] = newValue;
      this.render();
      this.addEventListeners();
    }
  }

  updateLocalStorage() {
    const scores = JSON.parse(localStorage.getItem("quizScores")) || [];
    scores.push({ name: this.username, time: this.elapsedTime / 1000 });
    localStorage.setItem("quizScores", JSON.stringify(scores));
  }

  render() {
    this.shadowRoot.innerHTML = this.getStyles() + this.getTemplate();
  }

  addEventListeners() {
    this.shadowRoot
      .getElementById("tryAgainButton")
      .addEventListener("click", () => {
        this.dispatchEvent(new CustomEvent("restart-quiz"));
      });
    this.shadowRoot
      .getElementById("scoreboardButton")
      .addEventListener("click", () => {
        this.dispatchEvent(
          new CustomEvent("navigate-to", {
            detail: { view: "scoreboard" },
            bubbles: true,
            composed: true,
          })
        );
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

        .result {
          font-size: 1.5rem;
          text-align: center;
          color: #424242;
        }

        .result__paragraph {
          margin-top: 8px;
        }

        .result__control-panel {
          margin-top: 20px;
          display: flex;
          justify-content: center;
          gap: 10px;
        }

        .result__button {
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

        .result__button:hover {
          background-color: #1565c0;
        }
      </style>
    `;
  }

  getTemplate() {
    return `
      <div class="result">
        <h2>${
          this.status === "done" ? "Congratulations" : "Better luck next time"
        }, ${this.username || "Guest"}!</h2>
        <p class="result__paragraph">${this.resultMessage}</p>
        <p class="result__paragraph">It took you ${(
          this.elapsedTime / 1000
        ).toFixed(3)} seconds</p>
        <div class="result__control-panel">
          <button class="result__button" id="tryAgainButton">Try Again</button>
          <button class="result__button" id="scoreboardButton">Scoreboard</button>
        </div>
      </div>
    `;
  }
}

customElements.define("quiz-result", QuizResult);
