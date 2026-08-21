/* =========================================================
   CV ЖИТТЯ — ЛЮБИ. МРІЙ. ДІЙ.
   ОДИНОЧНА ГРА

   Версія 1:
   - ім'я
   - вибір фішки
   - випадкова професія
   - вибір мрії
   - 2 AI-суперники
   - велике коло 56
   - мале коло 28
   - кубик
   - рух фішки
   - Райфик-підказки
========================================================= */

const app = document.getElementById("financeGameApp");


/* =========================================================
   1. ОСНОВНІ НАЛАШТУВАННЯ
========================================================= */

const GAME_CONFIG = {

    bigCircleCells: 56,
    smallCircleCells: 28,

    aiPlayers: 2,

    /*
       ПОКИ СТАРТОВІ ПОКАЗНИКИ ОДНАКОВІ.

       Коли отримаємо фінальну таблицю —
       змінюємо лише цей блок.
    */

    startingStats: {
        money: 10000,
        reputation: 10,
        knowledge: 10,
        energy: 100
    }

};


/* =========================================================
   2. ФІШКИ
========================================================= */

const TOKENS = [

    {
        id: "bull",
        name: "Бик",
        image: "assets/token-bull.png"
    },

    {
        id: "card",
        name: "Картка",
        image: "assets/token-card.png"
    },

    {
        id: "duck",
        name: "Качур",
        image: "assets/token-duck.png"
    },

    {
        id: "moneybag",
        name: "Мішечок",
        image: "assets/token-moneybag.png"
    },

    {
        id: "owl",
        name: "Сова",
        image: "assets/token-owl.png"
    },

    {
        id: "percent",
        name: "Відсоток",
        image: "assets/token-percent.png"
    },

    {
        id: "piggy",
        name: "Скарбничка",
        image: "assets/token-piggy.png"
    },

    {
        id: "vault",
        name: "Сейф",
        image: "assets/token-vault.png"
    }

];


/* =========================================================
   3. ПРОФЕСІЙНІ СФЕРИ

   Гравець НЕ обирає професію.
   Система випадково визначає сферу
   і дає перший рівень професії.
========================================================= */

const CAREER_SECTORS = [

    {
        id: "it",
        name: "IT Сфера",
        icon: "💻",

        levels: [
            "Програміст / Програмістка",
            "Керівник / Керівниця команди розробки",
            "IT-директор / IT-директорка",
            "CTO / Технічний директор"
        ]
    },

    {
        id: "restaurant",
        name: "Ресторанний бізнес",
        icon: "☕",

        levels: [
            "Бариста",
            "Адміністратор / Адміністраторка ресторану",
            "Керуючий / Керуюча рестораном",
            "Власник / Власниця ресторану"
        ]
    },

    {
        id: "education",
        name: "Освіта",
        icon: "🎓",

        levels: [
            "Вчитель / Вчителька",
            "Директор / Директорка закладу освіти",
            "Ректор / Ректорка університету",
            "Міністр / Міністерка освіти і науки України"
        ]
    },

    {
        id: "art",
        name: "Мистецтво",
        icon: "🎨",

        levels: [
            "Художник / Художниця",
            "Артдиректор / Артдиректорка",
            "Власник / Власниця артгалереї",
            "Директор / Директорка музею"
        ]
    },

    {
        id: "medicine",
        name: "Медицина",
        icon: "🩺",

        levels: [
            "Медсестра / Медбрат",
            "Лікар / Лікарка",
            "Завідувач / Завідувачка відділення",
            "Головний лікар / Головна лікарка"
        ]
    },

    {
        id: "media",
        name: "Медіа",
        icon: "🎥",

        levels: [
            "Контент-креатор / Контент-креаторка",
            "YouTube-блогер / Блогерка",
            "Продюсер / Продюсерка контенту",
            "Власник / Власниця медіакомпанії"
        ]
    },

    {
        id: "logistics",
        name: "Логістика",
        icon: "🚚",

        levels: [
            "Логіст / Логістка",
            "Координатор / Координаторка логістики",
            "Менеджер / Менеджерка з логістики",
            "Директор / Директорка з логістики"
        ]
    },

    {
        id: "finance",
        name: "Фінанси",
        icon: "🏦",

        levels: [
            "Банківський працівник / Банківська працівниця",
            "Бухгалтер / Бухгалтерка",
            "Фінансовий директор / Фінансова директорка",
            "Власник / Власниця фінансової компанії"
        ]
    },

    {
        id: "military",
        name: "Військова справа",
        icon: "🛡️",

        levels: [
            "Оператор / Операторка БпЛА",
            "Інструктор / Інструкторка",
            "Офіцер / Офіцерка",
            "Начальник / Начальниця штабу"
        ]
    },

    {
        id: "agro",
        name: "Агро",
        icon: "🌾",

        levels: [
            "Фермер / Фермерка",
            "Агроном / Агрономка",
            "Керівник / Керівниця агропідприємства",
            "Власник / Власниця агрохолдингу"
        ]
    }

];
/* =========================================================
   ПОКАЗНИКИ 4 РІВНІВ КАР'ЄРИ

   ПОКИ ОДНАКОВІ ДЛЯ ВСІХ СФЕР.
   Пізніше можемо задати окремі значення
   для кожної професії.
========================================================= */

const CAREER_LEVEL_STATS = [

    {
        level: 1,
        money: 10000,
        reputation: 10,
        knowledge: 10,
        energy: 100
    },

    {
        level: 2,
        money: 25000,
        reputation: 25,
        knowledge: 30,
        energy: 90
    },

    {
        level: 3,
        money: 50000,
        reputation: 45,
        knowledge: 55,
        energy: 80
    },

    {
        level: 4,
        money: 100000,
        reputation: 70,
        knowledge: 80,
        energy: 70
    }

];


/* =========================================================
   4. МРІЇ

   ПОКИ ТЕСТОВІ.
   Пізніше сюди вставимо фінальний перелік
   ваших карток Мрії та точні показники.
========================================================= */

const DREAMS = [

    {
        id: "home",
        icon: "🏠",
        name: "Власне житло",

        requirements: {
            money: 300000,
            reputation: 30,
            knowledge: 30,
            energy: 30
        }
    },

    {
        id: "business",
        icon: "🚀",
        name: "Власний бізнес",

        requirements: {
            money: 500000,
            reputation: 50,
            knowledge: 60,
            energy: 40
        }
    },

    {
        id: "travel",
        icon: "✈️",
        name: "Подорож мрії",

        requirements: {
            money: 200000,
            reputation: 20,
            knowledge: 20,
            energy: 50
        }
    },

    {
        id: "freedom",
        icon: "✨",
        name: "Фінансова свобода",

        requirements: {
            money: 700000,
            reputation: 60,
            knowledge: 50,
            energy: 40
        }
    }

];


/* =========================================================
   5. СТАН ГРИ
========================================================= */

const gameState = {

    phase: "start",

    currentTurn: "player",

    diceValue: null,

    targetPosition: null,

    player: {

        id: "player",

        name: "",

        token: null,

        sector: null,

        careerLevel: 0,

        dream: null,

        money: 0,
        reputation: 0,
        knowledge: 0,
        energy: 0,

        circle: "big",

        position: 1

    },

    opponents: []

};


/* =========================================================
   6. ДОПОМІЖНІ ФУНКЦІЇ
========================================================= */

function randomItem(array) {

    return array[
        Math.floor(Math.random() * array.length)
    ];

}


function randomNumber(min, max) {

    return Math.floor(
        Math.random() * (max - min + 1)
    ) + min;

}


function setScreen(html) {

    app.innerHTML = html;

}


function copyStartingStats(target) {

    target.money =
        GAME_CONFIG.startingStats.money;

    target.reputation =
        GAME_CONFIG.startingStats.reputation;

    target.knowledge =
        GAME_CONFIG.startingStats.knowledge;

    target.energy =
        GAME_CONFIG.startingStats.energy;

}


/* =========================================================
   7. СТАРТОВИЙ ЕКРАН
========================================================= */

function showStartScreen() {

    gameState.phase = "start";

    setScreen(`

        <section class="start-screen">

            <div class="start-overlay">

                <img
                    src="assets/logo.png"
                    class="game-logo"
                    alt="CV Життя"
                >

                <button
                    id="startGameButton"
                    class="main-game-btn"
                >
                    ПОЧАТИ ГРУ
                </button>

            </div>

        </section>

    `);


    document
        .getElementById("startGameButton")
        .addEventListener(
            "click",
            showNameScreen
        );

}


/* =========================================================
   8. ІМ'Я ГРАВЦЯ
========================================================= */

function showNameScreen() {

    gameState.phase = "name";

    setScreen(`

        <section class="game-screen">

            <div class="temporary-game-card">

                <img
                    src="assets/raifik.png"
                    class="small-game-logo"
                    alt="Райфик"
                >

                <h2>
                    Привіт! 👋
                </h2>

                <p>
                    Я Райфик.
                    Спочатку створімо твого героя.
                </p>

                <p>
                    Як тебе звати?
                </p>

                <input
                    id="playerNameInput"
                    class="player-name-input"
                    maxlength="20"
                    placeholder="Введи своє ім'я"
                    autocomplete="off"
                >

                <button
                    id="continueNameButton"
                    class="main-game-btn"
                >
                    ПРОДОВЖИТИ
                </button>

                <div
                    id="nameError"
                    class="form-error"
                ></div>

            </div>

        </section>

    `);


    const input =
        document.getElementById(
            "playerNameInput"
        );


    input.focus();


    document
        .getElementById(
            "continueNameButton"
        )
        .addEventListener(
            "click",
            savePlayerName
        );


    input.addEventListener(
        "keydown",
        event => {

            if (event.key === "Enter") {
                savePlayerName();
            }

        }
    );

}


/* =========================================================
   9. ЗБЕРЕЖЕННЯ ІМЕНІ
========================================================= */

function savePlayerName() {

    const input =
        document.getElementById(
            "playerNameInput"
        );


    const name =
        input.value.trim();


    if (!name) {

        document
            .getElementById(
                "nameError"
            )
            .textContent =
            "Напиши своє ім'я 🙂";

        return;
    }


    gameState.player.name = name;


    showTokenSelection();

}


/* =========================================================
   10. ВИБІР ФІШКИ
========================================================= */

function showTokenSelection() {

    gameState.phase =
        "token-selection";


    const tokensHTML =
        TOKENS.map(token => `

            <button
                class="token-option"
                data-token="${token.id}"
            >

                <img
                    src="${token.image}"
                    alt="${token.name}"
                >

                <span>
                    ${token.name}
                </span>

            </button>

        `).join("");


    setScreen(`

        <section class="game-screen">

            <div class="temporary-game-card token-selection-card">

                <img
                    src="assets/raifik.png"
                    class="small-game-logo"
                    alt="Райфик"
                >

                <h2>
                    ${gameState.player.name},
                    обери свою фішку
                </h2>

                <p>
                    Саме нею ти будеш рухатися
                    фінансовим шляхом.
                </p>

                <div class="token-grid">

                    ${tokensHTML}

                </div>

            </div>

        </section>

    `);


    document
        .querySelectorAll(
            ".token-option"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    selectToken(
                        button.dataset.token
                    );

                }
            );

        });

}


/* =========================================================
   11. ЗБЕРЕЖЕННЯ ФІШКИ
========================================================= */

function selectToken(tokenId) {

    const token =
        TOKENS.find(
            item =>
                item.id === tokenId
        );


    if (!token) {
        return;
    }


    gameState.player.token =
        token;


    assignRandomCareer();

}


/* =========================================================
   ВИПАДКОВА ПРОФЕСІЙНА СФЕРА
========================================================= */

function assignRandomCareer() {

    const sector =
        randomItem(CAREER_SECTORS);

    gameState.player.sector = sector;

    /*
       0 = перша професія масиву,
       тобто РІВЕНЬ 1
    */

    gameState.player.careerLevel = 0;


    const startStats =
        CAREER_LEVEL_STATS[0];


    gameState.player.money =
        startStats.money;

    gameState.player.reputation =
        startStats.reputation;

    gameState.player.knowledge =
        startStats.knowledge;

    gameState.player.energy =
        startStats.energy;


    showCareerReveal();
}


/* =========================================================
   13. ПОКАЗ ПРОФЕСІЇ
========================================================= */

/* =========================================================
   ЕКРАН — ТВІЙ ЖИТТЄВИЙ ШЛЯХ
========================================================= */

function showCareerReveal() {

    gameState.phase = "career";

    const player =
        gameState.player;

    const sector =
        player.sector;


    const careerHTML =
        sector.levels.map((profession, index) => {

            const stats =
                CAREER_LEVEL_STATS[index];

            const isCurrent =
                index === player.careerLevel;


            return `

                <div class="
                    career-path-card
                    ${isCurrent ? "career-current" : "career-locked"}
                ">

                    <div class="career-level-top">

                        <span class="career-level-number">
                            ${index + 1}
                        </span>

                        ${
                            isCurrent

                            ? `
                                <span class="career-current-label">
                                    ТИ ТУТ
                                </span>
                              `

                            : `
                                <span class="career-lock">
                                    🔒
                                </span>
                              `
                        }

                    </div>


                    <div class="career-job-name">
                        ${profession}
                    </div>


                    <div class="career-level-stats">

                        <span>
                            💰
                            ${stats.money.toLocaleString("uk-UA")}
                        </span>

                        <span>
                            ⭐
                            ${stats.reputation}
                        </span>

                        <span>
                            🧠
                            ${stats.knowledge}
                        </span>

                        <span>
                            ⚡
                            ${stats.energy}
                        </span>

                    </div>

                </div>

                ${
                    index < sector.levels.length - 1
                    ? `
                        <div class="career-path-arrow">
                            ↓
                        </div>
                      `
                    : ""
                }

            `;

        }).join("");


    setScreen(`

        <section class="game-screen">

            <div class="temporary-game-card career-screen-card">


                <!-- РАЙФИК -->

                <div class="career-raifik-side">

                    <img
                        src="assets/raifik.png"
                        class="small-game-logo"
                        alt="Райфик"
                    >

                    <div class="raifik-career-message">

                        Мрія — твоя ціль.

                        <br>

                        А кар'єра — шлях,
                        який допоможе тобі
                        до неї дістатися.

                    </div>

                </div>


                <!-- КАР'ЄРНИЙ ШЛЯХ -->

                <div class="career-content">

                    <div class="career-sector-icon">
                        ${sector.icon}
                    </div>

                    <div class="career-sector-name">
                        ${sector.name}
                    </div>


                    <h2>
                        Ось твій життєвий шлях
                    </h2>


                    <p class="career-description">

                        Ти починаєш із першої сходинки.

                        Розвивай навички,
                        репутацію та фінансові можливості,
                        щоб рухатися кар'єрним шляхом.

                    </p>


                    <div class="career-path">

                        ${careerHTML}

                    </div>


                    <button
                        id="chooseDreamButton"
                        class="main-game-btn"
                    >
                        ОБРАТИ МРІЮ
                    </button>

                </div>

            </div>

        </section>

    `);


    document
        .getElementById("chooseDreamButton")
        .addEventListener(
            "click",
            showDreamSelection
        );
}

/* =========================================================
   14. ВИБІР МРІЇ
========================================================= */

function showDreamSelection() {

    gameState.phase = "dream";


    const dreamsHTML =
        DREAMS.map(dream => `

            <button
                class="dream-option"
                data-dream="${dream.id}"
            >

                <div class="dream-icon">
                    ${dream.icon}
                </div>

                <strong>
                    ${dream.name}
                </strong>

                <div class="dream-requirements">

                    <span>
                        💰
                        ${dream.requirements.money.toLocaleString("uk-UA")}
                    </span>

                    <span>
                        ⭐ ${dream.requirements.reputation}
                    </span>

                    <span>
                        🧠 ${dream.requirements.knowledge}
                    </span>

                    <span>
                        ⚡ ${dream.requirements.energy}
                    </span>

                </div>

            </button>

        `).join("");


    setScreen(`

        <section class="game-screen">

            <div class="temporary-game-card dream-selection-card">

                <img
                    src="assets/raifik.png"
                    class="small-game-logo"
                    alt="Райфик"
                >

                <h2>
                    Тепер обери свою Мрію ✨
                </h2>

                <p>
                    Професію визначили обставини,
                    але Мрію обираєш ти.
                </p>


                <div class="dream-grid">

                    ${dreamsHTML}

                </div>

            </div>

        </section>

    `);


    document
        .querySelectorAll(
            ".dream-option"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    selectDream(
                        button.dataset.dream
                    );

                }
            );

        });

}


/* =========================================================
   15. ЗБЕРЕЖЕННЯ МРІЇ
========================================================= */

function selectDream(dreamId) {

    const dream =
        DREAMS.find(
            item =>
                item.id === dreamId
        );


    if (!dream) {
        return;
    }


    gameState.player.dream =
        dream;


    createAIPlayers();


    showBeforeGameScreen();

}


/* =========================================================
   16. СТВОРЕННЯ AI-СУПЕРНИКІВ
========================================================= */

function createAIPlayers() {

    gameState.opponents = [];


    const availableTokens =
        TOKENS.filter(
            token =>
                token.id !==
                gameState.player.token.id
        );


    const aiNames = [
        "Марко",
        "Софія",
        "Макс",
        "Анна",
        "Лео",
        "Мія"
    ];


    for (
        let i = 0;
        i < GAME_CONFIG.aiPlayers;
        i++
    ) {

        const sector =
            randomItem(
                CAREER_SECTORS
            );


        const token =
            availableTokens.splice(
                randomNumber(
                    0,
                    availableTokens.length - 1
                ),
                1
            )[0];


        const ai = {

            id: `ai-${i + 1}`,

            name:
                aiNames[i],

            token,

            sector,

            careerLevel: 0,

            dream:
                randomItem(
                    DREAMS
                ),

            circle: "big",

            position: 1

        };


        copyStartingStats(ai);


        gameState.opponents.push(ai);

    }

}


/* =========================================================
   17. ЕКРАН ПЕРЕД СТАРТОМ
========================================================= */

function showBeforeGameScreen() {

    const player =
        gameState.player;


    const opponentsHTML =
        gameState.opponents
            .map(ai => `

                <div class="opponent-preview">

                    <img
                        src="${ai.token.image}"
                        alt="${ai.name}"
                    >

                    <div>
                        <strong>
                            ${ai.name}
                        </strong>

                        <small>
                            ${ai.sector.levels[0]}
                        </small>
                    </div>

                </div>

            `)
            .join("");


    setScreen(`

        <section class="game-screen">

            <div class="temporary-game-card">

                <img
                    src="assets/raifik.png"
                    class="small-game-logo"
                    alt="Райфик"
                >

                <h2>
                    Ти не один у цій історії 😉
                </h2>

                <p>
                    Разом із тобою свій шлях
                    проходитимуть ще двоє гравців.
                </p>


                <div class="opponents-preview">

                    ${opponentsHTML}

                </div>


                <div class="player-dream-preview">

                    Твоя Мрія:

                    <strong>
                        ${player.dream.icon}
                        ${player.dream.name}
                    </strong>

                </div>


                <button
                    id="goToBoardButton"
                    class="main-game-btn"
                >
                    ВИЙТИ НА СТАРТ
                </button>

            </div>

        </section>

    `);


    document
        .getElementById(
            "goToBoardButton"
        )
        .addEventListener(
            "click",
            showGameBoard
        );

}


/* =========================================================
   18. ІГРОВИЙ ЕКРАН
========================================================= */

function showGameBoard() {

    gameState.phase = "game";

    const player =
        gameState.player;


    setScreen(`

        <section class="main-board-screen">


            <!-- ПРОФІЛЬ -->

            <aside class="player-panel">

                <div class="player-profile">

                    <img
                        src="${player.token.image}"
                        class="player-token-preview"
                        alt="${player.token.name}"
                    >

                    <div>

                        <strong>
                            ${player.name}
                        </strong>

                        <small>
                            ${player.sector.levels[player.careerLevel]}
                        </small>

                    </div>

                </div>


                <div class="player-stats">

                    <div>
                        💰
                        <span id="moneyValue">
                            ${player.money.toLocaleString("uk-UA")}
                        </span>
                    </div>

                    <div>
                        ⭐
                        <span id="reputationValue">
                            ${player.reputation}
                        </span>
                    </div>

                    <div>
                        🧠
                        <span id="knowledgeValue">
                            ${player.knowledge}
                        </span>
                    </div>

                    <div>
                        ⚡
                        <span id="energyValue">
                            ${player.energy}
                        </span>
                    </div>

                </div>


                <div class="dream-mini">

                    ${player.dream.icon}

                    <strong>
                        ${player.dream.name}
                    </strong>

                </div>

            </aside>


            <!-- ПОЛЕ -->

            <main
                id="board"
                class="game-board"
            >

                <div
                    id="bigCircle"
                    class="board-circle big-circle"
                ></div>


                <div
                    id="smallCircle"
                    class="board-circle small-circle"
                ></div>


                <div class="dream-center">

                    <span>
                        ✨
                    </span>

                    <strong>
                        МРІЯ
                    </strong>

                </div>

            </main>


            <!-- КУБИК -->

            <aside class="dice-panel">

                <div class="dice-title">
                    Твій хід
                </div>


                <div
                    id="dice"
                    class="dice"
                >
                    ⚀
                </div>


                <button
                    id="rollDiceButton"
                    class="main-game-btn"
                >
                    КИНУТИ КУБИК
                </button>


                <div
                    id="diceMessage"
                    class="dice-message"
                >
                    Райфик: натисни на кубик 🎲
                </div>


                <div
                    id="gameLog"
                    class="game-log"
                ></div>

            </aside>


        </section>

    `);


    createBoard();


    placeAllPieces();


    document
        .getElementById(
            "rollDiceButton"
        )
        .addEventListener(
            "click",
            rollDice
        );

}


/* =========================================================
   19. СТВОРЕННЯ ПОЛЯ
========================================================= */

function createBoard() {

    createCircleCells(
        document.getElementById(
            "bigCircle"
        ),
        GAME_CONFIG.bigCircleCells,
        "big"
    );


    createCircleCells(
        document.getElementById(
            "smallCircle"
        ),
        GAME_CONFIG.smallCircleCells,
        "small"
    );

}


/* =========================================================
   20. СТВОРЕННЯ КОМІРОК
========================================================= */

function createCircleCells(
    container,
    amount,
    circleName
) {

    for (
        let i = 1;
        i <= amount;
        i++
    ) {

        const cell =
            document.createElement(
                "div"
            );


        cell.className =
            `board-cell ${circleName}-cell`;


        cell.dataset.circle =
            circleName;


        cell.dataset.position =
            i;


        cell.innerHTML =
            `<span>${i}</span>`;


        /*
           Клік — резервний варіант
           для тестування руху.
        */

        cell.addEventListener(
            "click",
            () => {

                tryMovePlayerToCell(
                    cell
                );

            }
        );


        /*
           Drag & Drop
        */

        cell.addEventListener(
            "dragover",
            event =>
                event.preventDefault()
        );


        cell.addEventListener(
            "drop",
            event => {

                event.preventDefault();

                tryMovePlayerToCell(
                    cell
                );

            }
        );


        container.appendChild(cell);

    }

}


/* =========================================================
   21. ФІШКИ НА ПОЛІ
========================================================= */

function placeAllPieces() {

    placePiece(
        gameState.player,
        true
    );


    gameState.opponents
        .forEach(ai => {

            placePiece(
                ai,
                false
            );

        });

}


/* =========================================================
   РОЗМІЩЕННЯ ОДНІЄЇ ФІШКИ
========================================================= */

function placePiece(
    participant,
    draggable
) {

    const cell =
        document.querySelector(

            `.${participant.circle}-cell[data-position="${participant.position}"]`

        );


    if (!cell) {
        return;
    }


    const piece =
        document.createElement(
            "img"
        );


    piece.src =
        participant.token.image;


    piece.className =
        participant.id === "player"
            ? "board-piece player-piece"
            : "board-piece ai-piece";


    piece.dataset.playerId =
        participant.id;


    piece.alt =
        participant.name;


    if (draggable) {

        piece.draggable = true;

        piece.addEventListener(
            "dragstart",
            event => {

                event.dataTransfer.setData(
                    "text/plain",
                    participant.id
                );

            }
        );

    }


    cell.appendChild(piece);

}


/* =========================================================
   22. КУБИК
========================================================= */

const DICE_FACES = [
    "⚀",
    "⚁",
    "⚂",
    "⚃",
    "⚄",
    "⚅"
];


function rollDice() {

    if (
        gameState.currentTurn !==
        "player"
    ) {

        return;
    }


    const button =
        document.getElementById(
            "rollDiceButton"
        );


    const dice =
        document.getElementById(
            "dice"
        );


    const message =
        document.getElementById(
            "diceMessage"
        );


    button.disabled = true;


    let count = 0;


    const animation =
        setInterval(() => {

            dice.textContent =
                DICE_FACES[
                    randomNumber(0, 5)
                ];


            count++;


            if (count >= 10) {

                clearInterval(
                    animation
                );


                const value =
                    randomNumber(
                        1,
                        6
                    );


                gameState.diceValue =
                    value;


                dice.textContent =
                    DICE_FACES[
                        value - 1
                    ];


                calculateTargetCell(
                    value
                );


                message.innerHTML = `

                    Випало
                    <strong>${value}</strong>.

                    <br>

                    Перенеси свою фішку
                    на підсвічену комірку.

                `;

            }

        }, 70);

}


/* =========================================================
   23. РОЗРАХУНОК ЦІЛЬОВОЇ КОМІРКИ
========================================================= */

function calculateTargetCell(
    steps
) {

    clearTargetCells();


    const player =
        gameState.player;


    const maxCells =
        player.circle === "big"
            ? GAME_CONFIG.bigCircleCells
            : GAME_CONFIG.smallCircleCells;


    let target =
        player.position + steps;


    if (target > maxCells) {

        target =
            target - maxCells;

    }


    gameState.targetPosition =
        target;


    const targetCell =
        document.querySelector(

            `.${player.circle}-cell[data-position="${target}"]`

        );


    if (targetCell) {

        targetCell.classList.add(
            "target-cell"
        );

    }

}


/* =========================================================
   24. РУХ ФІШКИ ГРАВЦЯ
========================================================= */

function tryMovePlayerToCell(
    cell
) {

    if (
        gameState.targetPosition ===
        null
    ) {

        return;
    }


    const cellPosition =
        Number(
            cell.dataset.position
        );


    const circle =
        cell.dataset.circle;


    if (
        circle !==
        gameState.player.circle
    ) {

        return;
    }


    if (
        cellPosition !==
        gameState.targetPosition
    ) {

        return;
    }


    gameState.player.position =
        cellPosition;


    movePieceDOM(
        "player",
        cell
    );


    clearTargetCells();


    gameState.targetPosition =
        null;


    document
        .getElementById(
            "diceMessage"
        )
        .innerHTML = `

            Чудово!

            <br>

            Ти на комірці
            <strong>
                ${cellPosition}
            </strong>.

        `;


    addLog(

        `${gameState.player.name}
        перейшов(ла)
        на клітинку
        ${cellPosition}.`

    );


    startAITurns();

}


/* =========================================================
   25. ПЕРЕМІЩЕННЯ ФІШКИ В DOM
========================================================= */

function movePieceDOM(
    participantId,
    cell
) {

    const piece =
        document.querySelector(

            `[data-player-id="${participantId}"]`

        );


    if (piece) {

        cell.appendChild(
            piece
        );

    }

}


/* =========================================================
   26. AI-СУПЕРНИКИ
========================================================= */

function startAITurns() {

    gameState.currentTurn =
        "ai";


    document
        .getElementById(
            "rollDiceButton"
        )
        .disabled = true;


    let index = 0;


    function nextAI() {

        if (
            index >=
            gameState.opponents.length
        ) {

            gameState.currentTurn =
                "player";


            document
                .getElementById(
                    "rollDiceButton"
                )
                .disabled = false;


            document
                .getElementById(
                    "diceMessage"
                )
                .innerHTML = `

                    Твій хід!

                    <br>

                    Кидай кубик 🎲

                `;


            return;
        }


        const ai =
            gameState.opponents[
                index
            ];


        const dice =
            randomNumber(
                1,
                6
            );


        let nextPosition =
            ai.position + dice;


        if (
            nextPosition >
            GAME_CONFIG.bigCircleCells
        ) {

            nextPosition -=
                GAME_CONFIG.bigCircleCells;

        }


        ai.position =
            nextPosition;


        const cell =
            document.querySelector(

                `.big-cell[data-position="${nextPosition}"]`

            );


        if (cell) {

            movePieceDOM(
                ai.id,
                cell
            );

        }


        addLog(

            `${ai.name}
            🎲 ${dice}
            → клітинка
            ${nextPosition}`

        );


        index++;


        setTimeout(
            nextAI,
            700
        );

    }


    nextAI();

}


/* =========================================================
   27. ОЧИЩЕННЯ ПІДСВІЧУВАННЯ
========================================================= */

function clearTargetCells() {

    document
        .querySelectorAll(
            ".target-cell"
        )
        .forEach(
            cell =>
                cell.classList.remove(
                    "target-cell"
                )
        );

}


/* =========================================================
   28. ЖУРНАЛ ГРИ
========================================================= */

function addLog(text) {

    const log =
        document.getElementById(
            "gameLog"
        );


    if (!log) {
        return;
    }


    const item =
        document.createElement(
            "div"
        );


    item.className =
        "game-log-item";


    item.textContent =
        text;


    log.prepend(
        item
    );

}


/* =========================================================
   ЗАПУСК
========================================================= */

showStartScreen();
