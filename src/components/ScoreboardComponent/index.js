export default class ScoreBoard extends HTMLElement {
  shadowRoot = this.attachShadow({ mode: 'open' });

  constructor () {
    super();
    this.render();
  }

  render () {
    this.shadowRoot.innerHTML = this.getStyles() + this.getTemplate();
    this.populateScoreBoard();
  }

  populateScoreBoard () {
    const scores = this.getScoresFromLocalStorage();
    const sortedScores = this.sortScores(scores);
    const scoreTableBody = this.shadowRoot.getElementById('score-table-body');

    sortedScores.forEach((score, index) => {
      const tableRow = document.createElement('tr');
      tableRow.innerHTML = `
        <td>${index + 1}</td>
        <td>${score.name}</td>
        <td>${score.time}s</td>
      `;
      scoreTableBody.appendChild(tableRow);
    });
  }

  getScoresFromLocalStorage () {
    return JSON.parse(localStorage.getItem('quizScores')) || [];
  }

  sortScores (scores) {
    return scores.sort((a, b) => a.time - b.time);
  }

  getTemplate () {
    return `
      <div class="scoreboard">
        <h2 class="scoreboard__title">Scoreboard</h2>
        <hr class="scoreboard_divider" />
        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>Place</th>
                <th>Name</th>
                <th>Best Time</th>
              </tr>
            </thead>
            <tbody id="score-table-body"></tbody>
          </table>
        </div>
      </div>
    `;
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
          flex: 1;
          display: flex;
          flex-flow: column nowrap;
          justify-content: flex-start;
          align-items: center;
          margin-top: 32px;
          max-height: calc(100% - 124px);
          overflow-y: hidden;
        }

        .scoreboard {
          width: 600px;
          height: 100%;
          padding: 32px;
          border-radius: 8px;
          background-color: #f5f5f5;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          overflow-y: hidden;
        }

        .scoreboard__title {
          text-align: center;
          font-size: 24px;
          margin: 0;
        }

        .scoreboard_divider {
          width: 100%;
          margin: 16px 0;
          height: 2px;
          background-color: #1976d2;
        }

        .table-container {
          max-height: calc(100% - 72px);
          overflow-y: auto;
        }

        .table-container::-webkit-scrollbar {
          width: 8px;
          background: transparent;
        }

        .table-container::-webkit-scrollbar-thumb {
          background-color: #b0b0b0;
          border-radius: 4px;
        }

        .table-container::-webkit-scrollbar-button {
          display: none;
        }

        .table {
          width: 100%;
          border-collapse: collapse;
        }

        .table th, .table td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: center;
        }

        .table th {
          background-color: #1976d2;
          color: white;
        }

        .table tr:nth-child(even) {
          background-color: #f2f2f2;
        }

        .table tr:hover {
          background-color: #ddd;
        }
      </style>
    `;
  }
}

customElements.define('scoreboard-component', ScoreBoard);
