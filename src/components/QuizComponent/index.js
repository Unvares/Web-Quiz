import QuizMenu from './QuizMenu';
import QuizContent from './QuizContent';
import QuizResult from './QuizResult';

/**
 * Quiz is a custom HTML element that manages the quiz flow,
 * including the menu, quiz content, and result views.
 */
export default class Quiz extends HTMLElement {
  /** @private */
  shadowRoot = this.attachShadow({ mode: 'open' });

  /**
   * Constructs the Quiz component, initializes the state and rendering.
   */
  constructor () {
    super();
    this.state = {
      currentView: 'menu',
      username: '',
      startTime: null,
      endTime: null,
      resultMessage: ''
    };
    this.render();
  }

  /**
   * Renders the component by setting the inner HTML of the shadow DOM
   * and appending the appropriate view component.
   * @private
   */
  render () {
    this.shadowRoot.innerHTML = this.getStyles();
    const component = this.getComponentForCurrentView();
    const container = this.createContainer();
    container.appendChild(component);
    this.shadowRoot.appendChild(container);
  }

  /**
   * Determines the component to render based on the current view state.
   * @returns {HTMLElement} The component corresponding to the current view.
   * @private
   */
  getComponentForCurrentView () {
    switch (this.state.currentView) {
      case 'menu':
        return this.createMenuComponent();
      case 'content':
        return this.createContentComponent();
      case 'done':
        return this.createResultComponent('done');
      case 'failed':
        return this.createResultComponent('failed');
      default:
        throw new Error('Invalid view state');
    }
  }

  /**
   * Creates and returns the menu component, setting up event listeners.
   * @returns {QuizMenu} The menu component.
   * @private
   */
  createMenuComponent () {
    const menu = new QuizMenu();
    menu.addEventListener('start-quiz', (event) => {
      this.updateState({
        username: event.detail.username,
        currentView: 'content',
        startTime: new Date()
      });
    });
    return menu;
  }

  /**
   * Creates and returns the content component, setting up event listeners.
   * @returns {QuizContent} The content component.
   * @private
   */
  createContentComponent () {
    const content = new QuizContent();
    content.setAttribute('username', this.state.username);

    const handleQuizCompletion = (event, view) => {
      const newState = {
        currentView: view,
        endTime: event.detail.endTime
      };
      if (view === 'done') {
        newState.resultMessage = event.detail.resultMessage;
      }
      this.updateState(newState);
    };

    content.addEventListener('finish-quiz', (event) =>
      handleQuizCompletion(event, 'done')
    );
    content.addEventListener('fail-quiz', (event) =>
      handleQuizCompletion(event, 'failed')
    );

    return content;
  }

  /**
   * Creates and returns the result component, setting up event listeners.
   * @param {string} status - The status of the quiz ('done' or 'failed').
   * @returns {QuizResult} The result component.
   * @private
   */
  createResultComponent (status) {
    const result = new QuizResult();
    result.setAttribute('username', this.state.username);
    result.setAttribute('status', status);
    result.setAttribute(
      'elapsed-time',
      this.state.endTime - this.state.startTime
    );
    result.setAttribute('result-message', this.state.resultMessage);
    result.addEventListener('restart-quiz', () => {
      this.updateState({
        currentView: 'content',
        startTime: new Date()
      });
    });
    return result;
  }

  /**
   * Updates the state of the component and re-renders it.
   * @param {object} newState - The new state to merge with the current state.
   * @private
   */
  updateState (newState) {
    this.state = { ...this.state, ...newState };
    this.render();
  }

  /**
   * Creates and returns the container element for the quiz component.
   * @returns {HTMLElement} The container element.
   * @private
   */
  createContainer () {
    const container = document.createElement('div');
    container.classList.add('quiz-container');
    return container;
  }

  /**
   * Returns the CSS styles for the quiz component.
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
          display: flex;
          flex-flow: column nowrap;
          align-items: stretch;
          justify-content: center;
          flex-grow: 1;
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

customElements.define('quiz-component', Quiz);
