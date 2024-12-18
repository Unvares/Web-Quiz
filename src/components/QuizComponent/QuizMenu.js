/**
 * QuizMenu is a custom HTML element that represents the menu
 * for starting a quiz. It includes an input field for the username
 * and a button to start the quiz.
 */
export default class QuizMenu extends HTMLElement {
  /** @private */
  shadowRoot = this.attachShadow({ mode: 'open' });

  /**
   * Constructs the QuizMenu component and initializes rendering
   * and event handlers.
   */
  constructor () {
    super();
    this.render();
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  /**
   * Called when the element is added to the document.
   * Sets up a global keydown event listener.
   */
  connectedCallback () {
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
   * Renders the component by setting the inner HTML of the shadow DOM
   * with styles and template, and adds event listeners.
   * @private
   */
  render () {
    this.shadowRoot.innerHTML = this.getStyles() + this.getTemplate();

    this.shadowRoot
      .querySelector('.menu')
      .addEventListener('submit', (event) => {
        event.preventDefault();
        this.startQuiz();
      });
  }

  /**
   * Handles keydown events to focus the input field and append
   * typed characters if the input field is not focused.
   * @param {KeyboardEvent} event - The keydown event.
   * @private
   */
  handleKeyDown (event) {
    const inputField = this.shadowRoot.querySelector('input[type="text"]');
    if (
      inputField &&
      event.key.length === 1 &&
      !this.isModifierKeyPressed(event) &&
      document.activeElement !== inputField
    ) {
      inputField.focus();
      inputField.value += event.key;
      event.preventDefault();
    }
  }

  /**
   * Checks if a modifier key (Ctrl, Alt, Meta) is pressed.
   * @param {KeyboardEvent} event - The keydown event.
   * @returns {boolean} True if a modifier key is pressed, false otherwise.
   * @private
   */
  isModifierKeyPressed (event) {
    return event.ctrlKey || event.altKey || event.metaKey;
  }

  /**
   * Returns the CSS styles for the quiz menu component.
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

  /**
   * Returns the HTML template for the quiz menu component.
   * @returns {string} The HTML template string.
   * @private
   */
  getTemplate () {
    return `
      <form class="menu">
        <h2 class="menu__title">Welcome to the Quiz!</h2>
        <div class="menu__control-panel">
          <input class="menu__input-field" type="text" id="username" placeholder="Enter your name" required autofocus />
          <button class="menu__button" label="Start Quiz" type="submit" id="startButton">Start Quiz</button>
        </div>
      </form>
    `;
  }

  /**
   * Starts the quiz by dispatching a custom event with the username
   * if a valid username is entered.
   * @private
   */
  startQuiz () {
    const username = this.shadowRoot.getElementById('username').value.trim();
    if (username) {
      this.dispatchEvent(
        new CustomEvent('start-quiz', { detail: { username }, bubbles: true })
      );
    } else {
      alert('Please enter a valid username.');
    }
  }
}

customElements.define('quiz-menu', QuizMenu);
