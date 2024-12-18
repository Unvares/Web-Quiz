/**
 * AppComponent is a custom HTML element that serves as the main container
 * for the application. It manages the rendering of different views such as
 * the quiz and scoreboard, and handles navigation between these views.
 */
export default class AppComponent extends HTMLElement {
  /** @private */
  shadowRoot = this.attachShadow({ mode: 'open' });

  /** @private */
  state = { currentView: 'quiz' };

  /**
   * Constructs the AppComponent, initializes the rendering and event listeners.
   */
  constructor () {
    super();
    this.render();
    this.addEventListeners();
  }

  /**
   * Renders the component by setting the inner HTML of the shadow DOM
   * and appending the application container.
   * @private
   */
  render () {
    this.shadowRoot.innerHTML = this.getStyles();
    const appContainer = this.createAppContainer();
    this.shadowRoot.appendChild(appContainer);
  }

  /**
   * Creates the main application container and appends the appropriate
   * components based on the current view state.
   * @returns {HTMLElement} The application container element.
   * @private
   */
  createAppContainer () {
    const container = document.createElement('div');
    container.classList.add('app');

    const header = document.createElement('header-component');
    container.appendChild(header);

    if (this.state.currentView === 'quiz') {
      const quiz = document.createElement('quiz-component');
      container.appendChild(quiz);
    } else if (this.state.currentView === 'scoreboard') {
      const scoreboard = document.createElement('scoreboard-component');
      container.appendChild(scoreboard);
    }

    return container;
  }

  /**
   * Adds event listeners to the component for handling navigation events.
   * @private
   */
  addEventListeners () {
    this.addEventListener('navigate-to', (event) => {
      this.state.currentView = event.detail.view;
      this.render();
    });
  }

  /**
   * Returns the CSS styles for the component.
   * @returns {string} The CSS styles as a string.
   * @private
   */
  getStyles () {
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

customElements.define('app-component', AppComponent);
