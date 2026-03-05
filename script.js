// Data is loaded from data.js which defines `qaData`.
// Make sure qaData exists; otherwise fall back to empty array.
if (typeof qaData === 'undefined') {
  var qaData = [];
}

const searchInput = document.getElementById('searchInput');
const clearButton = document.getElementById('clearButton');
const resultsContainer = document.getElementById('results');

// Event: search as user types
searchInput.addEventListener('input', () => {
  const query = searchInput.value.trim().toLowerCase();
  if (query.length === 0) {
    clearResults();
    return;
  }
  const filtered = qaData.filter((item) => {
    // Build a search string from question, options and answer text
    const searchString = (
      item.question + ' ' +
      Object.values(item.options || {}).join(' ') + ' ' +
      (item.answer || '')
    ).toLowerCase();
    return searchString.includes(query);
  });
  displayResults(filtered);
});

// Event: clear input and results
clearButton.addEventListener('click', () => {
  searchInput.value = '';
  searchInput.focus();
  clearResults();
});

function clearResults() {
  resultsContainer.innerHTML = '';
}

function displayResults(results) {
  resultsContainer.innerHTML = '';
  if (results.length === 0) {
    const noRes = document.createElement('p');
    noRes.textContent = 'Không tìm thấy kết quả phù hợp.';
    resultsContainer.appendChild(noRes);
    return;
  }
  results.forEach((item) => {
    const qaDiv = document.createElement('div');
    qaDiv.className = 'qa-item';
    // Question
    const qEl = document.createElement('h3');
    qEl.textContent = item.question;
    qaDiv.appendChild(qEl);
    // Options list
    if (item.options && Object.keys(item.options).length > 0) {
      const ul = document.createElement('ul');
      Object.entries(item.options).forEach(([key, val]) => {
        const li = document.createElement('li');
        li.textContent = `${key}) ${val}`;
        // Highlight correct answer
        if (item.answer_key && item.answer_key.toUpperCase().includes(key)) {
          li.classList.add('answer');
        }
        ul.appendChild(li);
      });
      qaDiv.appendChild(ul);
    }
    // Answer text (if answer text exists and not included among options)
    if (item.answer && (!item.answer_key || item.answer_key === '' || item.answer_key === null)) {
      const ansP = document.createElement('p');
      ansP.className = 'answer';
      ansP.textContent = 'Đáp án: ' + item.answer;
      qaDiv.appendChild(ansP);
    }
        // Always show answer key so user can compare and edit if needed
        if (item.answer_key) {
          const keyP = document.createElement('p');
          keyP.className = 'answer-key';
          keyP.textContent = 'Đáp án: ' + item.answer_key;
          qaDiv.appendChild(keyP);
        }
    resultsContainer.appendChild(qaDiv);
  });
}