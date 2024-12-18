/**
 * QuizResult is a custom HTML element that displays the result of a quiz,
 * including the user's performance and options to restart or view the scoreboard.
 */
export default class QuizResult extends HTMLElement {
  /** @private */
  shadowRoot = this.attachShadow({ mode: 'open' });

  /**
   * Specifies the attributes to observe for changes.
   * @returns {Array} The list of attributes to observe.
   */
  static get observedAttributes () {
    return ['username', 'status', 'elapsed-time', 'result-message'];
  }

  /**
   * Constructs the QuizResult component, initializes rendering and event handlers.
   */
  constructor () {
    super();
    this.render();
    this.addEventListeners();
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  /**
   * Called when the element is added to the document.
   * Updates local storage if the quiz is done and sets up a global keydown event listener.
   */
  connectedCallback () {
    if (this.status === 'done' && this.username && this.elapsedTime) {
      this.updateLocalStorage();
    }
    window.addEventListener('keydown', this.handleKeyDown);
  }

  /**
   * Called when the element is removed from the document.
   * Cleans up the global keydown event listener.
   */
  disconnectedCallback () {
    window.removeEventListener('keydown', this.handleKeyDown);
  }

  /**
   * Handles keydown events to restart the quiz when 'r' is pressed.
   * @param {KeyboardEvent} event - The keydown event.
   * @private
   */
  handleKeyDown (event) {
    if (event.key === 'r') {
      this.dispatchEvent(new CustomEvent('restart-quiz'));
    }
  }

  /**
   * Called when an observed attribute has been added, removed, updated, or replaced.
   * @param {string} name - The name of the attribute.
   * @param {string} oldValue - The old value of the attribute.
   * @param {string} newValue - The new value of the attribute.
   */
  attributeChangedCallback (name, oldValue, newValue) {
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

  /**
   * Updates the local storage with the user's quiz score.
   * @private
   */
  updateLocalStorage () {
    const scores = JSON.parse(localStorage.getItem('quizScores')) || [];
    scores.push({ name: this.username, time: this.elapsedTime / 1000 });
    localStorage.setItem('quizScores', JSON.stringify(scores));
  }

  /**
   * Renders the component by setting the inner HTML of the shadow DOM.
   * @private
   */
  render () {
    this.shadowRoot.innerHTML = this.getStyles() + this.getTemplate();
  }

  /**
   * Adds event listeners to the buttons for handling user interactions.
   * @private
   */
  addEventListeners () {
    this.shadowRoot
      .getElementById('tryAgainButton')
      .addEventListener('click', () => {
        this.dispatchEvent(new CustomEvent('restart-quiz'));
      });
    this.shadowRoot
      .getElementById('scoreboardButton')
      .addEventListener('click', () => {
        this.dispatchEvent(
          new CustomEvent('navigate-to', {
            detail: { view: 'scoreboard' },
            bubbles: true,
            composed: true
          })
        );
      });
  }

  /**
   * Returns the CSS styles for the quiz result component.
   * @returns {string} The CSS styles string.
   * @private
   */
  getStyles () {
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

  /**
   * Returns the HTML template for the quiz result component.
   * @returns {string} The HTML template string.
   * @private
   */
  getTemplate () {
    return `
      <div class="result">
        <h2>${
          this.status === 'done' ? 'Congratulations' : 'Better luck next time'
        }, ${this.username || 'Guest'}!</h2>
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

customElements.define('quiz-result', QuizResult);
