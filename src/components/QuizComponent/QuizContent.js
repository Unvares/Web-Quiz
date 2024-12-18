export default class QuizContent extends HTMLElement {
  questionUrl = 'https://courselab.lnu.se/quiz/question/1';
  answerUrl = 'https://courselab.lnu.se/quiz/answer/1';
  shadowRoot = this.attachShadow({ mode: 'open' });

  constructor () {
    super();
    this.questionCount = 1;
    this.defaultInputFieldValue = '';
    this.isQuestionAnswered = false;
    this.isQuizFinished = false;
    this.resultMessage = '';
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleEnterKeyDown = this.handleEnterKeyDown.bind(this);
  }

  static get observedAttributes () {
    return ['username'];
  }

  connectedCallback () {
    this.fetchQuestion();
    this.startTimer();
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keydown', this.handleEnterKeyDown);
  }

  disconnectedCallback () {
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keydown', this.handleEnterKeyDown);
  }

  render () {
    this.shadowRoot.innerHTML = this.getStyles() + this.getTemplate();
    this.addEventListeners();
    this.updateTimerDisplay();
  }

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
          justify-content: flex-start;
          border-radius: 8px;
          gap: 16px;
        }

        .quiz__timer {
          text-align: center;
        }

        .quiz__title {
          text-align: center;
          font-size: 1.5rem;
          font-weight: 500;
          color: #424242;
        }

        .quiz__divider {
          width: 100%;
          height: 2px;
          background-color: #1976d2;
        }

        .quiz__form {
          display: flex;
          flex-flow: column nowrap;
          align-items: stretch;
          gap: 16px;
        }

        .quiz__question {
          text-align: center;
          font-size: 1.25rem;
          color: #424242;
        }

        .quiz__input-field {
          padding: 12px;
          border: 1px solid #e0e0e0;
          border-radius: 4px;
          font-size: 1rem;
          transition: border-color 0.3s;
        }

        .quiz__input-field:focus {
          border-color: #1976d2;
          outline: none;
        }

        .quiz__options {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .quiz__option {
          overflow-wrap: break-word;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 1rem;
          cursor: pointer;
          transition: background-color 0.3s;
        }

        .correct {
          background-color: #3dd119;
          color: white;
        }

        .incorrect {
          background-color: #d12519;
          color: white;
        }

        .quiz__option:not([disabled]):hover {
          background-color: #e0e0e0;
        }

        .quiz__button {
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

        .quiz__submit-button:hover {
          background-color: #1565c0;
        }
      </style>
    `;
  }

  getTemplate () {
    const answerHtml =
      this.alternatives === null
        ? this.getTextInputHtml()
        : this.getOptionsHtml();
    const buttonHtml = this.isQuestionAnswered
      ? `<button class="quiz__button" type="submit">${
          this.isQuizFinished ? 'Finish Quiz' : 'Next Question'
        }</button>`
      : '<button class="quiz__button" type="submit">Answer</button>';

    return `
      <p id="timer" class="quiz__timer">${this.timeLeft}s</p>
      <h3 class="quiz__title">Question ${this.questionCount}</h3>
      <hr class="quiz__divider" />
      <p class="quiz__question">${this.question}</p>
      <form class="quiz__form">
        ${answerHtml}
        ${buttonHtml}
      </form>
    `;
  }

  getTextInputHtml () {
    return `
      <input
        class="quiz__input-field ${this.getResultClass()}"
        type="text"
        name="answer"
        placeholder="Type your answer here"
        value="${this.defaultInputFieldValue}"
        ${this.isQuestionAnswered ? 'disabled' : ''}
        required
        autofocus
      />
    `;
  }

  getOptionsHtml () {
    const optionsHtml = Object.entries(this.alternatives)
      .map(
        ([key, value]) => `
          <label
            class="quiz__option ${this.getResultClass(key)}"
            ${this.isQuestionAnswered ? 'disabled' : ''}
          >
            <input
              type="radio"
              name="option"
              value="${value}"
              id="${key}"
              ${this.isQuestionAnswered ? 'disabled' : ''}
              ${key === this.selectedOption ? 'checked' : ''}
            />
            ${value}
          </label>
        `
      )
      .join('');
    return `<div class="quiz__options">${optionsHtml}</div>`;
  }

  getResultClass (key) {
    if (
      !this.isQuestionAnswered ||
      (key !== this.selectedOption && this.alternatives)
    ) {
      return '';
    }
    return this.isAnswerCorrect ? 'correct' : 'incorrect';
  }

  async fetchQuestion () {
    try {
      const response = await fetch(this.questionUrl);
      const questionObject = await response.json();
      this.question = questionObject.question;
      this.alternatives = questionObject.alternatives || null;
      this.answerUrl = questionObject.nextURL;
      this.render();
    } catch (error) {
      console.error('Failed to fetch question:', error);
    }
  }

  addEventListeners () {
    const formElement = this.shadowRoot.querySelector('.quiz__form');
    formElement.addEventListener('submit', (event) => {
      event.preventDefault();
      this.handleFormSubmission(event);
    });
  }

  handleEnterKeyDown (event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      const formElement = this.shadowRoot.querySelector('.quiz__form');
      formElement.dispatchEvent(new Event('submit', { cancelable: true }));
    }
  }

  handleKeyDown (event) {
    const inputField = this.shadowRoot.querySelector('input[type="text"]');
    if (
      inputField &&
      event.key.length === 1 &&
      !this.isModifierKeyPressed(event) &&
      document.activeElement !== inputField &&
      !this.isQuestionAnswered
    ) {
      inputField.focus();
      inputField.value += event.key;
      event.preventDefault();
    }

    if (this.alternatives && !this.isQuestionAnswered) {
      const optionIndex = parseInt(event.key, 10);
      const optionElement = this.shadowRoot.getElementById(`alt${optionIndex}`);
      if (optionElement) {
        const previouslyCheckedOption = this.shadowRoot.querySelector(
          'input[name="option"]:checked'
        );
        if (previouslyCheckedOption) {
          previouslyCheckedOption.checked = false;
        }
        optionElement.checked = true;
        optionElement.click();
      }
    }
  }

  isModifierKeyPressed (event) {
    return event.ctrlKey || event.altKey || event.metaKey;
  }

  handleFormSubmission (event) {
    if (this.isQuestionAnswered) {
      this.isAnswerCorrect ? this.handleCorrectAnswer() : this.failQuiz();
    } else {
      this.alternatives
        ? this.submitMultipleChoiceAnswer()
        : this.submitTextAnswer(event);
    }
  }

  handleCorrectAnswer () {
    this.isQuizFinished ? this.finishQuiz() : this.nextQuestion();
  }

  startTimer () {
    this.timeLeft = 10.0;
    this.updateTimerDisplay();

    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }

    this.timerInterval = setInterval(() => {
      this.timeLeft = (this.timeLeft - 0.1).toFixed(1);
      this.updateTimerDisplay();

      if (this.timeLeft <= 0) {
        clearInterval(this.timerInterval);
        this.failQuiz();
      }
    }, 100);
  }

  updateTimerDisplay () {
    const timerElement = this.shadowRoot.getElementById('timer');
    if (timerElement) {
      timerElement.textContent = `${this.timeLeft}s`;
      timerElement.style.color =
        this.timeLeft <= 3 ? 'red' : this.timeLeft <= 5 ? 'orange' : 'green';
    }
  }

  async submitTextAnswer (event) {
    const formData = new FormData(event.target);
    const answer = formData.get('answer').trim();
    this.defaultInputFieldValue = answer;
    await this.submitAnswer({ answer });
  }

  async submitMultipleChoiceAnswer () {
    const selectedOption = this.shadowRoot.querySelector(
      'input[name="option"]:checked'
    );

    if (!selectedOption) {
      return;
    }

    this.isQuestionAnswered = true;
    const answer = selectedOption.id;
    this.selectedOption = answer;
    await this.submitAnswer({ answer });
  }

  async submitAnswer (answerData) {
    try {
      const response = await fetch(this.answerUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(answerData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message);
      }

      this.isAnswerCorrect = true;
      this.score++;

      if (result.nextURL === undefined) {
        this.isQuizFinished = true;
        this.resultMessage = result.message;
        return;
      }

      this.questionUrl = result.nextURL;
    } catch (error) {
      console.error('Error:', error);
      this.isAnswerCorrect = false;
      this.isQuizFinished = true;
    } finally {
      this.isQuestionAnswered = true;
      if (this.isQuizFinished) {
        this.globalEndTime = new Date();
        clearInterval(this.timerInterval);
      }
      this.render();
    }
  }

  nextQuestion () {
    this.questionCount++;
    this.isQuestionAnswered = false;
    this.defaultInputFieldValue = '';
    this.selectedOption = null;
    this.startTimer();
    this.fetchQuestion();
  }

  failQuiz () {
    this.dispatchEvent(
      new CustomEvent('fail-quiz', {
        detail: {
          username: this.username,
          score: this.score,
          endTime: this.globalEndTime || new Date()
        },
        bubbles: true
      })
    );
  }

  finishQuiz () {
    this.dispatchEvent(
      new CustomEvent('finish-quiz', {
        detail: {
          username: this.username,
          score: this.score,
          endTime: this.globalEndTime || new Date(),
          resultMessage: this.resultMessage
        },
        bubbles: true
      })
    );
  }
}

customElements.define('quiz-content', QuizContent);
