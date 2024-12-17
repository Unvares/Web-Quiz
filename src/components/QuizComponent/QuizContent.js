export default class QuizContent extends HTMLElement {
  shadowRoot = this.attachShadow({ mode: "open" });

  constructor() {
    super();
    this.currentQuestionIndex = 0;
    this.selectedOptionId = null;
    this.answered = false;
    this.score = 0;
    this.username = this.getAttribute("username");
    this.questions = [
      {
        question: "What is 2 + 2?",
        options: ["3", "4", "5", "6"],
        answer: "4",
      },
      {
        question: "What is the capital of France?",
        options: ["Berlin", "Madrid", "Paris", "Rome"],
        answer: "Paris",
      },
    ];
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = this.getStyles() + this.getTemplate();

    this.shadowRoot.addEventListener("change", (event) => {
      const optionId = event.target.id;
      this.selectedOptionId = parseInt(optionId.split("-")[1], 10);
    });

    if (this.answered) {
      this.shadowRoot
        .getElementById("nextButton")
        .addEventListener("click", () => this.nextQuestion());
    } else {
      this.shadowRoot
        .getElementById("submitButton")
        .addEventListener("click", () => this.submitAnswer());
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

        .quiz__options {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .quiz__option {
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 1rem;
          cursor: pointer;
          transition: background-color 0.3s;
        }

        .quiz__option_correct {
          background-color: #3dd119;
        }

        .quiz__option_incorrect {
          background-color: #d12519;
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
    const currentQuestion = this.questions[this.currentQuestionIndex];
    const optionsHtml = currentQuestion.options
      .map(
        (option, index) => `
        <label
          class="quiz__option ${this.getResultClass(index)}"
          ${this.answered ? "disabled" : ""}
        >
          <input
            type="radio"
            name="option"
            value="${option}"
            id="option-${index}"
            ${this.answered ? "disabled" : ""}
            ${index === this.selectedOptionId ? "checked" : ""}
          />
          ${option}
        </label>
      `
      )
      .join("");

    const buttonHtml = this.answered
      ? `<button class="quiz__button" id="nextButton">Next Question</button>`
      : `<button class="quiz__button" id="submitButton">Answer</button>`;

    return `
      <h3 class="quiz__title">Question ${this.currentQuestionIndex + 1}</h3>
      <hr class="quiz__divider" />
      <p class="quiz__question">${currentQuestion.question}</p>
      <div class="quiz__options">
        ${optionsHtml}
      </div>
      ${buttonHtml}
    `;
  }

  getResultClass(index) {
    if (!this.answered || index !== this.selectedOptionId) {
      return "";
    }
    return this.isAnswerCorrect
      ? "quiz__option_correct"
      : "quiz__option_incorrect";
  }

  submitAnswer() {
    const selectedOption = this.shadowRoot.querySelector(
      'input[name="option"]:checked'
    );
    if (!selectedOption) {
      alert("Please select an answer.");
      return;
    }

    this.answered = true;
    const userAnswer = selectedOption.value;
    const correctAnswer = this.questions[this.currentQuestionIndex].answer;

    if (userAnswer === correctAnswer) {
      this.score++;
      this.isAnswerCorrect = true;
    } else {
      this.isAnswerCorrect = false;
    }

    this.render();
  }

  nextQuestion() {
    this.currentQuestionIndex++;
    this.answered = false;
    this.selectedOptionId = null;
    if (this.currentQuestionIndex < this.questions.length) {
      this.render();
    } else {
      this.dispatchEvent(
        new CustomEvent("quiz-completed", {
          detail: { username: this.username, score: this.score },
          bubbles: true,
        })
      );
    }
  }
}

customElements.define("quiz-content", QuizContent);
