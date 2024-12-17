export default class QuizContent extends HTMLElement {
  questionUrl = "https://courselab.lnu.se/quiz/question/1";
  answerUrl = "https://courselab.lnu.se/quiz/answer/1";
  shadowRoot = this.attachShadow({ mode: "open" });

  constructor() {
    super();
    this.questionCount = 1;
    this.inputFieldValue = "";
    this.optionSelected = null;
    this.isQuestionAnswered = false;
    this.isQuizFinished = false;
    this.score = 0;
    this.endTime = null;
  }

  static get observedAttributes() {
    return ["username"];
  }

  connectedCallback() {
    this.fetchQuestion();
  }

  async fetchQuestion() {
    try {
      const response = await fetch(this.questionUrl);
      const questionObject = await response.json();
      this.question = questionObject.question;
      this.alternatives = questionObject.alternatives || null;
      this.answerUrl = questionObject.nextURL;
      this.render();
    } catch (error) {
      console.error("Failed to fetch question:", error);
    }
  }

  render() {
    this.shadowRoot.innerHTML = this.getStyles() + this.getTemplate();
    this.addEventListeners();
  }

  addEventListeners() {
    const nextButton = this.shadowRoot.getElementById("nextButton");
    const submitButton = this.shadowRoot.getElementById("submitButton");

    if (this.isQuestionAnswered && nextButton) {
      nextButton.addEventListener(
        "click",
        this.handleNextButtonClick.bind(this)
      );
    } else if (submitButton) {
      const submitHandler = this.alternatives
        ? this.submitMultipleChoiceAnswer.bind(this)
        : this.submitTextAnswer.bind(this);
      submitButton.addEventListener("click", submitHandler);
    }
  }

  handleNextButtonClick() {
    if (this.isAnswerCorrect) {
      this.isQuizFinished ? this.finishQuiz() : this.nextQuestion();
    } else {
      this.failQuiz();
    }
  }

  getStyles() {
    return `
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        :host {
          display: flex;
          flex-direction: column;
          align-items: stretch;
          justify-content: flex-start;
          border-radius: 8px;
          gap: 16px;
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

  getTemplate() {
    const answerHtml =
      this.alternatives === null
        ? this.getTextInputHtml()
        : this.getOptionsHtml();
    const buttonHtml = this.isQuestionAnswered
      ? `<button class="quiz__button" id="nextButton">${
          this.isQuizFinished ? "Finish Quiz" : "Next Question"
        }</button>`
      : `<button class="quiz__button" id="submitButton">Answer</button>`;

    return `
      <h3 class="quiz__title">Question ${this.questionCount}</h3>
      <hr class="quiz__divider" />
      <p class="quiz__question">${this.question}</p>
      ${answerHtml}
      ${buttonHtml}
    `;
  }

  getTextInputHtml() {
    return `
      <input
        class="quiz__input-field ${this.getResultClass()}"
        type="text"
        name="answer"
        placeholder="Type your answer here"
        value="${this.inputFieldValue}"
        ${this.isQuestionAnswered ? "disabled" : ""}
      />
    `;
  }

  getOptionsHtml() {
    const optionsHtml = Object.entries(this.alternatives)
      .map(
        ([key, value]) => `
        <label
          class="quiz__option ${this.getResultClass(key)}"
          ${this.isQuestionAnswered ? "disabled" : ""}
        >
          <input
            type="radio"
            name="option"
            value="${value}"
            id="${key}"
            ${this.isQuestionAnswered ? "disabled" : ""}
            ${key === this.optionSelected ? "checked" : ""}
          />
          ${value}
        </label>
      `
      )
      .join("");
    return `<div class="quiz__options">${optionsHtml}</div>`;
  }

  getResultClass(key) {
    if (
      !this.isQuestionAnswered ||
      (key !== this.optionSelected && this.alternatives)
    ) {
      return "";
    }
    return this.isAnswerCorrect ? "correct" : "incorrect";
  }

  async submitTextAnswer() {
    const answer = this.shadowRoot
      .querySelector('input[type="text"]')
      .value.trim();
    this.inputFieldValue = answer;
    await this.submitAnswer({ answer });
  }

  async submitMultipleChoiceAnswer() {
    const selectedOption = this.shadowRoot.querySelector(
      'input[name="option"]:checked'
    );
    if (!selectedOption) {
      alert("Please select an answer.");
      return;
    }
    this.isQuestionAnswered = true;
    const answer = selectedOption.id;
    this.optionSelected = answer;
    await this.submitAnswer({ answer });
  }

  async submitAnswer(answerData) {
    try {
      const response = await fetch(this.answerUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(answerData),
      });

      const result = await response.json();
      console.log("Response:", result);

      if (!response.ok) {
        throw new Error(result.message);
      }

      this.isAnswerCorrect = true;
      this.score++;

      if (result.nextURL === undefined) {
        this.isQuizFinished = true;
        this.endTime = new Date();
        return;
      }

      this.questionUrl = result.nextURL;
    } catch (error) {
      console.error("Error:", error);
      this.isAnswerCorrect = false;
      this.isQuizFinished = true;
      this.endTime = new Date();
    } finally {
      this.isQuestionAnswered = true;
      this.render();
    }
  }

  nextQuestion() {
    this.questionCount++;
    this.isQuestionAnswered = false;
    this.inputFieldValue = "";
    this.optionSelected = null;
    this.fetchQuestion();
  }

  failQuiz() {
    this.dispatchEvent(
      new CustomEvent("fail-quiz", {
        detail: {
          username: this.username,
          score: this.score,
          endTime: this.endTime,
        },
        bubbles: true,
      })
    );
  }

  finishQuiz() {
    this.dispatchEvent(
      new CustomEvent("finish-quiz", {
        detail: {
          username: this.username,
          score: this.score,
          endTime: this.endTime,
        },
        bubbles: true,
      })
    );
  }
}

customElements.define("quiz-content", QuizContent);
