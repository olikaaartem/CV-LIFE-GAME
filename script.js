/* =====================================================
  CV ЖИТТЯ — ЛЮБИ. МРІЙ. ДІЙ.
  ОСНОВНА ЛОГІКА ГРИ
===================================================== */
const app = document.getElementById("financeGameApp");
/* =====================================================
  1. СТАРТОВИЙ ЕКРАН
===================================================== */
function renderStartScreen() {
 app.innerHTML = `
<section class="start-screen">
<div class="start-overlay">
<img
         src="assets/logo.png"
         alt="CV Життя"
         class="game-logo"
>
<button
         class="main-game-btn"
         id="startGameBtn"
>
         ПОЧАТИ ГРУ
</button>
</div>
</section>
<div
     class="game-modal hidden"
     id="gameModeModal"
>
<div class="game-modal-card">
<button
         class="modal-close"
         id="closeGameModeModal"
>
         ×
</button>
<h2>ОБЕРИ РЕЖИМ ГРИ</h2>
<p class="modal-subtitle">
         Як ти хочеш пройти свою історію?
</p>
<div class="game-mode-buttons">
<button
           class="game-mode-btn"
           id="singleGameBtn"
>
<span class="mode-icon">👤</span>
<span class="mode-text">
<strong>ГРАТИ ОДНОМУ</strong>
<small>Пройти гру самостійно</small>
</span>
</button>
<button
           class="game-mode-btn"
           id="multiGameBtn"
>
<span class="mode-icon">👥</span>
<span class="mode-text">
<strong>СПІЛЬНА ГРА</strong>
<small>Створити або приєднатися до кімнати</small>
</span>
</button>
</div>
</div>
</div>
 `;
 initStartScreenEvents();
}

/* =====================================================
  2. ПОДІЇ СТАРТОВОГО ЕКРАНУ
===================================================== */
function initStartScreenEvents() {
 const startGameBtn =
   document.getElementById("startGameBtn");
 const gameModeModal =
   document.getElementById("gameModeModal");
 const closeGameModeModal =
   document.getElementById("closeGameModeModal");
 const singleGameBtn =
   document.getElementById("singleGameBtn");
 const multiGameBtn =
   document.getElementById("multiGameBtn");

 /* Відкрити меню режимів */
 startGameBtn.addEventListener("click", () => {
   gameModeModal.classList.remove("hidden");
 });

 /* Закрити меню */
 closeGameModeModal.addEventListener("click", () => {
   gameModeModal.classList.add("hidden");
 });

 /* Закриття по кліку на фон */
 gameModeModal.addEventListener("click", (event) => {
   if (event.target === gameModeModal) {
     gameModeModal.classList.add("hidden");
   }
 });

 /* Грати одному */
 singleGameBtn.addEventListener("click", () => {
   gameModeModal.classList.add("hidden");
   startSingleGame();
 });

 /* Спільна гра */
 multiGameBtn.addEventListener("click", () => {
   gameModeModal.classList.add("hidden");
   openMultiplayerMenu();
 });
}

/* =====================================================
  3. ГРАТИ ОДНОМУ
===================================================== */
function startSingleGame() {
 console.log("Запуск одиночної гри");
 app.innerHTML = `
<section class="game-screen">
<div class="temporary-game-card">
<h2>ОДИНОЧНА ГРА</h2>
<p>
         Тут далі з'явиться створення гравця
         та перехід до першого кола.
</p>
<button
         class="main-game-btn"
         onclick="renderStartScreen()"
>
         НАЗАД
</button>
</div>
</section>
 `;
}

/* =====================================================
  4. СПІЛЬНА ГРА
===================================================== */
function openMultiplayerMenu() {
 app.innerHTML = `
<section class="game-screen">
<div class="temporary-game-card">
<img
         src="assets/logo.png"
         class="small-game-logo"
         alt="CV Життя"
>
<h2>СПІЛЬНА ГРА</h2>
<p>
         Створи нову кімнату або приєднайся
         до вже створеної.
</p>
<div class="multiplayer-buttons">
<button
           class="main-game-btn"
           onclick="openCreateRoom()"
>
           СТВОРИТИ КІМНАТУ
</button>
<button
           class="secondary-game-btn"
           onclick="openJoinRoom()"
>
           ПРИЄДНАТИСЯ
</button>
</div>
<button
         class="text-back-btn"
         onclick="renderStartScreen()"
>
         ← Назад
</button>
</div>
</section>
 `;
}

/* =====================================================
  5. СТВОРЕННЯ КІМНАТИ
  Поки лише заготовка
===================================================== */
function openCreateRoom() {
 console.log("Створення кімнати");
 app.innerHTML = `
<section class="game-screen">
<div class="temporary-game-card">
<h2>СТВОРИТИ КІМНАТУ</h2>
<p>
         На наступному етапі тут буде
         введення ключа адміністратора.
</p>
<button
         class="main-game-btn"
         onclick="openMultiplayerMenu()"
>
         НАЗАД
</button>
</div>
</section>
 `;
}

/* =====================================================
  6. ПРИЄДНАННЯ ДО КІМНАТИ
  Поки лише заготовка
===================================================== */
function openJoinRoom() {
 console.log("Приєднання до кімнати");
 app.innerHTML = `
<section class="game-screen">
<div class="temporary-game-card">
<h2>ПРИЄДНАТИСЯ ДО ГРИ</h2>
<p>
         Тут буде введення коду кімнати
         та імені гравця.
</p>
<button
         class="main-game-btn"
         onclick="openMultiplayerMenu()"
>
         НАЗАД
</button>
</div>
</section>
 `;
}

/* =====================================================
  ЗАПУСК ГРИ
===================================================== */
renderStartScreen();
