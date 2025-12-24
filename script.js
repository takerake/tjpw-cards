document.getElementById("yearInput").onchange = () => {
  const year = document.getElementById("yearInput").value;
  const nameSelect = document.getElementById("nameInput");
  const typeSelect = document.getElementById("typeInput");

  // 選手リスト更新
  nameSelect.innerHTML = "";
  if (!year || !playerList[year]) {
    nameSelect.innerHTML = "<option value=''>年度を先に選んでください</option>";
  } else {
    playerList[year].forEach(name => {
      const op = document.createElement("option");
      op.value = name;
      op.textContent = name;
      nameSelect.appendChild(op);
    });
  }

  // カード種別更新
  typeSelect.innerHTML = "";
  if (!year || !cardTypes[year]) {
    typeSelect.innerHTML = "<option value=''>年度を先に選んでください</option>";
  } else {
    cardTypes[year].forEach(type => {
      const op = document.createElement("option");
      op.value = type;
      op.textContent = type;
      typeSelect.appendChild(op);
    });
  }
};

// 保存データの読み込み
let cards = JSON.parse(localStorage.getItem("cards") || "[]");

document.getElementById("addBtn").onclick = () => {
  const year = yearInput.value;
  const name = nameInput.value;
  const type = typeInput.value;
  const have = haveInput.value;
  const price = priceInput.value;

  if (!year || !name || !type) {
    alert("年度・選手名・カード種別は必須です");
    return;
  }

  if (window.editingId) {
    // 編集モード
    const card = cards.find(c => c.id === window.editingId);
    card.year = year;
    card.name = name;
    card.type = type;
    card.have = have;
    card.price = price;

    window.editingId = null; // 編集終了
  } else {
    // 新規追加
    const card = { id: Date.now(), year, name, type, have, price };
    cards.push(card);
  }

  localStorage.setItem("cards", JSON.stringify(cards));
  renderCards();
  renderMatrix(document.getElementById("mainYearSelect").value);
};

// カード追加

function renderMatrix(year) {
  const area = document.getElementById("matrixArea");
  area.innerHTML = "";

  const table = document.createElement("table");
  table.className = "matrix-table";

  // ヘッダー
  let header = "<tr><th>選手名</th>";
  cardTypes[year].forEach(type => {
    header += `<th>${type}</th>`;
  });
  header += "</tr>";
  table.innerHTML = header;

  // 行
  playerList[year].forEach(name => {
    let row = `<tr><td>${name}</td>`;

    cardTypes[year].forEach(type => {
      const card = cards.find(c => c.year === year && c.name === name && c.type === type);

      let cell = "無";
      let style = "";
      let id = "";

      if (card) {
        id = card.id;

        if (card.price) cell = card.price;
        else if (card.have === "所持") cell = "○";
        else if (card.have === "自引き") cell = "自";
        else if (card.have === "未入手") {
          cell = "未";
          style = "background-color: yellow;";
        }
      }

      row += `<td class="editable" data-id="${id}" style="${style}">${cell}</td>`;
    });

    row += "</tr>";
    table.innerHTML += row;
  });

  area.appendChild(table);
}

// カード一覧表示
function renderCards() {
  const list = document.getElementById("cardList");
  list.innerHTML = "";

  cards.forEach((c, i) => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <strong>${c.year} / ${c.name}</strong><br>
      種別：${c.type}<br>
      状態：${c.have}<br>
      購入価格：${c.price || "未入力"}<br>
      <button onclick="deleteCard(${i})">削除</button>
    `;
    list.appendChild(div);
  });
}

// カード削除
function deleteCard(i) {
  cards.splice(i, 1);
  localStorage.setItem("cards", JSON.stringify(cards));
  renderCards();
}


document.getElementById("mainYearSelect").onchange = () => {
  const year = document.getElementById("mainYearSelect").value;
  renderMatrix(year);
};

document.getElementById("editModeBtn").onclick = () => {
  document.querySelector(".main-area").style.display = "none";
  document.querySelector(".edit-area").style.display = "block";
};

document.getElementById("backToMainBtn").onclick = () => {
  document.querySelector(".main-area").style.display = "block";
  document.querySelector(".edit-area").style.display = "none";
};

document.addEventListener("click", (e) => {
  if (!e.target.classList.contains("editable")) return;

  const id = Number(e.target.dataset.id);
  const card = cards.find(c => c.id === id);
  if (!card) return;

  // 編集画面へ切り替え
  document.querySelector(".main-area").style.display = "none";
  document.querySelector(".edit-area").style.display = "block";

  // フォームに値をセット
  document.getElementById("yearInput").value = card.year;

  // 年度変更イベントを発火して選手名・種別を更新
  document.getElementById("yearInput").dispatchEvent(new Event("change"));

  document.getElementById("nameInput").value = card.name;
  document.getElementById("typeInput").value = card.type;
  document.getElementById("haveInput").value = card.have;
  document.getElementById("priceInput").value = card.price;

  // 編集中のIDを保存
  window.editingId = id;
});

// 初期表示（ページ読み込み時）
window.onload = () => {
  const year = document.getElementById("mainYearSelect").value;
  renderMatrix(year);
};
