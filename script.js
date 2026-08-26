/* =========================================================
   CV ЖИТТЯ — ЛЮБИ. МРІЙ. ДІЙ.
   ОДИНОЧНА ГРА

   ПОТОЧНА ВЕРСІЯ:
   - старт
   - вибір режиму
   - ім'я
   - стать
   - вибір фішки
   - випадкова професія
   - 4 рівні кар'єри
   - 4 випадкові Мрії
   - підтвердження Мрії
   - 2 AI-суперники
   - 3 учасники перед стартом
   - велике коло 56
   - мале коло 28
   - кубик
   - ручний рух фішки
   - перехід велике → мале → Мрія
   - клікабельні типи комірок
   - перегляд показників AI
========================================================= */


const app = document.getElementById("financeGameApp");


/* =========================================================
   1. ОСНОВНІ НАЛАШТУВАННЯ
========================================================= */

const GAME_CONFIG = {

    bigCircleCells: 56,

    smallCircleCells: 28,

    aiPlayers: 2,

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
   4. ПОКАЗНИКИ 4 РІВНІВ КАР'ЄРИ

   ПОКИ ОДНАКОВІ ДЛЯ ВСІХ СФЕР.

   Пізніше тут просто змінимо цифри.
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
   5. МРІЇ

   Поки використовуємо кодові картки.
   Потім додамо готові картинки Мрій.
========================================================= */

const DREAMS = [

    {
        id: "world_trip",
        icon: "🌍",
        name: "Навколосвітня подорож",

        requirements: {
            money: 400000,
            reputation: 25,
            knowledge: 35,
            energy: 60
        }
    },

    {
        id: "car_park",
        icon: "🏎️",
        name: "Власний автопарк",

        requirements: {
            money: 600000,
            reputation: 40,
            knowledge: 30,
            energy: 40
        }
    },

    {
        id: "book",
        icon: "📖",
        name: "Написати та видати власну книгу",

        requirements: {
            money: 200000,
            reputation: 50,
            knowledge: 70,
            energy: 50
        }
    },

    {
        id: "animal_shelter",
        icon: "🐾",
        name: "Відкрити притулок для тварин",

        requirements: {
            money: 500000,
            reputation: 60,
            knowledge: 45,
            energy: 65
        }
    },

    {
        id: "everest",
        icon: "🏔️",
        name: "Підкорити Еверест",

        requirements: {
            money: 300000,
            reputation: 30,
            knowledge: 40,
            energy: 100
        }
    },

    {
        id: "yacht",
        icon: "🛥️",
        name: "Купити власну яхту",

        requirements: {
            money: 900000,
            reputation: 50,
            knowledge: 35,
            energy: 40
        }
    },

    {
        id: "plane",
        icon: "✈️",
        name: "Власний літак",

        requirements: {
            money: 1200000,
            reputation: 70,
            knowledge: 50,
            energy: 40
        }
    },

    {
        id: "dream_house",
        icon: "🏡",
        name: "Будинок мрії",

        requirements: {
            money: 700000,
            reputation: 40,
            knowledge: 30,
            energy: 50
        }
    },

    {
        id: "ocean_house",
        icon: "🌴",
        name: "Будинок біля океану",

        requirements: {
            money: 850000,
            reputation: 45,
            knowledge: 35,
            energy: 50
        }
    },

    {
        id: "education",
        icon: "🎓",
        name: "Навчатися у найкращому університеті",

        requirements: {
            money: 350000,
            reputation: 35,
            knowledge: 90,
            energy: 65
        }
    },

    {
        id: "charity",
        icon: "❤️",
        name: "Займатися благодійністю",

        requirements: {
            money: 400000,
            reputation: 80,
            knowledge: 40,
            energy: 60
        }
    },

    {
        id: "eco_project",
        icon: "🌱",
        name: "Створити власний екопроєкт",

        requirements: {
            money: 450000,
            reputation: 65,
            knowledge: 65,
            energy: 60
        }
    },

    {
        id: "creative_space",
        icon: "🎭",
        name: "Власний творчий простір",

        requirements: {
            money: 550000,
            reputation: 65,
            knowledge: 55,
            energy: 60
        }
    },

    {
        id: "business",
        icon: "🏦",
        name: "Власний бізнес",

        requirements: {
            money: 700000,
            reputation: 70,
            knowledge: 70,
            energy: 65
        }
    },

    {
        id: "foundation",
        icon: "🤝",
        name: "Створити благодійний фонд",

        requirements: {
            money: 650000,
            reputation: 90,
            knowledge: 65,
            energy: 70
        }
    },

    {
        id: "life_dream",
        icon: "⭐",
        name: "Мрія життя",

        requirements: {
            money: 1000000,
            reputation: 80,
            knowledge: 80,
            energy: 80
        }
    }

];


/* =========================================================
   6. ТИПИ ЗВИЧАЙНИХ КОМІРОК
========================================================= */

const CELL_TYPES = {

    income: {

        id: "income",

        icon: "💰",

        name: "Дохід",

        description:
            "Комірка доходу. Тут гравець отримує або змінює свій дохід."

    },


    bank: {

        id: "bank",

        icon: "🏦",

        name: "Банк",

        description:
            "Банківська комірка. Тут можуть з'явитися депозит, кредит, заощадження або інша фінансова можливість."

    },


    event: {

        id: "event",

        icon: "🎴",

        name: "Подія",

        description:
            "Витягни картку Події та виконай її умову."

    },


    life: {

        id: "life",

        icon: "❤️",

        name: "Життя",

        description:
            "Життєва ситуація, яка може вплинути на гроші, знання, репутацію або енергію."

    },


    fate: {

        id: "fate",

        icon: "⚡",

        name: "Доля",

        description:
            "Несподіваний поворот подій. Результат може допомогти або створити новий виклик."

    },


    energy: {

        id: "energy",

        icon: "🔋",

        name: "Енергія",

        description:
            "Комірка, пов'язана з відновленням або витратою енергії."

    }

};


/* =========================================================
   7. СПЕЦІАЛЬНІ КОМІРКИ

   Поки залишаємо основу.
   Механіку допишемо після фінального узгодження.
========================================================= */

const SPECIAL_CELLS = {

    big: {

        10: {
            icon: "🟣",
            name: "Lounge & Хобі"
        },

        20: {
            icon: "🎓",
            name: "Академія & Soft Skills"
        },

        38: {
            icon: "🟣",
            name: "Lounge & Хобі"
        },

        48: {
            icon: "🎓",
            name: "Академія & Soft Skills"
        }

    },


    small: {

        6: {
            icon: "🟣",
            name: "Lounge & Хобі"
        },

        11: {
            icon: "🎓",
            name: "Академія & Soft Skills"
        },

        22: {
            icon: "🟣",
            name: "Lounge & Хобі"
        },

        25: {
            icon: "🎓",
            name: "Академія & Soft Skills"
        }

    }

};


/* =========================================================
   8. СТАН ГРИ
========================================================= */

const gameState = {

    phase: "start",

    currentTurn: "player",

    diceValue: null,

    targetPosition: null,

    targetCircle: null,

    dreamOptions: [],

    pendingDream: null,


    player: {

        id: "player",

        name: "",

        gender: null,

        token: null,

        sector: null,

        careerLevel: 0,

        dream: null,

        money: 0,

        reputation: 0,

        knowledge: 0,

        energy: 0,

        circle: "big",

        position: 1,

        finished: false

    },


    opponents: []

};


/* =========================================================
   9. ДОПОМІЖНІ ФУНКЦІЇ
========================================================= */

function randomItem(array) {

    return array[
        Math.floor(
            Math.random() * array.length
        )
    ];

}


function randomNumber(min, max) {

    return Math.floor(
        Math.random() * (max - min + 1)
    ) + min;

}


function shuffleArray(array) {

    const result =
        [...array];


    for (
        let i = result.length - 1;
        i > 0;
        i--
    ) {

        const j =
            Math.floor(
                Math.random() * (i + 1)
            );


        [
            result[i],
            result[j]
        ] =
        [
            result[j],
            result[i]
        ];

    }


    return result;

}


function setScreen(html) {

    app.innerHTML =
        html;

}


function copyStartingStats(target) {

    const stats =
        CAREER_LEVEL_STATS[0];


    target.money =
        stats.money;


    target.reputation =
        stats.reputation;


    target.knowledge =
        stats.knowledge;


    target.energy =
        stats.energy;

}


/* =========================================================
   ПРОФЕСІЯ ВІДПОВІДНО ДО СТАТІ
========================================================= */

function getProfessionName(
    profession,
    gender
) {

    if (!profession) {

        return "";

    }


    if (
        profession ===
        "Медсестра / Медбрат"
    ) {

        return gender === "female"
            ? "Медсестра"
            : "Медбрат";

    }


    if (
        profession ===
        "CTO / Технічний директор"
    ) {

        return profession;

    }


    if (
        !profession.includes("/")
    ) {

        return profession.trim();

    }


    const variants =
        profession
            .split("/")
            .map(
                item =>
                    item.trim()
            );


    return gender === "female"
        ? variants[1]
        : variants[0];

}


function getParticipantProfession(
    participant
) {

    if (
        !participant ||
        !participant.sector
    ) {

        return "";

    }


    return getProfessionName(

        participant
            .sector
            .levels[
                participant.careerLevel
            ],

        participant.gender

    );

}


/* =========================================================
   10. СТАРТОВИЙ ЕКРАН
========================================================= */

function showStartScreen() {

    gameState.phase =
        "start";


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
        .getElementById(
            "startGameButton"
        )
        .addEventListener(
            "click",
            showModeSelection
        );

}


/* =========================================================
   11. ВИБІР РЕЖИМУ ГРИ
========================================================= */

function showModeSelection() {

    gameState.phase =
        "mode";


    setScreen(`

        <section class="game-screen mode-screen">

            <div class="mode-modal">

                <button
                    id="closeModeButton"
                    class="screen-close-button"
                    type="button"
                >
                    ✕
                </button>


                <h2>
                    ОБЕРИ РЕЖИМ ГРИ
                </h2>


                <p>
                    Як ти хочеш пройти свою історію?
                </p>


                <div class="mode-options">


                    <button
                        id="soloModeButton"
                        class="mode-option"
                        type="button"
                    >

                        <span class="mode-icon">
                            👤
                        </span>

                        <strong>
                            ГРАТИ ОДНОМУ
                        </strong>

                        <small>
                            Ти + 2 віртуальні гравці
                        </small>

                    </button>


                    <button
                        id="groupModeButton"
                        class="mode-option"
                        type="button"
                    >

                        <span class="mode-icon">
                            👥
                        </span>

                        <strong>
                            СПІЛЬНА ГРА
                        </strong>

                        <small>
                            Створити або приєднатися
                            до кімнати
                        </small>

                    </button>


                </div>


                <div
                    id="modeMessage"
                    class="form-error form-error-card"
                ></div>

            </div>

        </section>

    `);


    document
        .getElementById(
            "soloModeButton"
        )
        .addEventListener(
            "click",
            showNameScreen
        );


    document
        .getElementById(
            "groupModeButton"
        )
        .addEventListener(
            "click",
            () => {

                document
                    .getElementById(
                        "modeMessage"
                    )
                    .textContent =
                    "Спільний режим додамо наступним етапом 🙂";

            }
        );


    document
        .getElementById(
            "closeModeButton"
        )
        .addEventListener(
            "click",
            showStartScreen
        );

}


/* =========================================================
   12. СТВОРЕННЯ ГЕРОЯ
   ІМ'Я + ХЛОПЧИК / ДІВЧИНКА
========================================================= */

function showNameScreen() {

    gameState.phase =
        "name";


    setScreen(`

        <section class="game-screen">

            <button
                id="backFromName"
                class="screen-back-button"
                type="button"
            >
                ← Назад
            </button>


            <div class="temporary-game-card name-screen-card">


                <img
                    src="assets/raifik.png"
                    class="small-game-logo"
                    alt="Райфик"
                >


                <div class="name-screen-content">


                    <h2>
                        Привіт! 👋
                    </h2>


                    <p class="raifik-intro-text">

                        Я Райфик.
                        Спочатку створімо твого героя.

                    </p>


                    <p class="name-question">

                        Як тебе звати?

                    </p>


                    <input
                        id="playerNameInput"
                        class="player-name-input"
                        maxlength="20"
                        placeholder="Введи своє ім'я"
                        autocomplete="off"
                        value="${gameState.player.name || ""}"
                    >


                    <div class="gender-section">


                        <p class="gender-title">

                            Хто ти?

                        </p>


                        <div class="gender-options">


                            <button
                                class="
                                    gender-button
                                    ${
                                        gameState.player.gender === "male"
                                            ? "selected"
                                            : ""
                                    }
                                "
                                data-gender="male"
                                type="button"
                            >

                                <span>
                                    👦
                                </span>

                                <strong>
                                    Я хлопчик
                                </strong>

                            </button>


                            <button
                                class="
                                    gender-button
                                    ${
                                        gameState.player.gender === "female"
                                            ? "selected"
                                            : ""
                                    }
                                "
                                data-gender="female"
                                type="button"
                            >

                                <span>
                                    👧
                                </span>

                                <strong>
                                    Я дівчинка
                                </strong>

                            </button>


                        </div>

                    </div>


                    <button
                        id="continueNameButton"
                        class="main-game-btn"
                    >
                        ПРОДОВЖИТИ
                    </button>


                    <div
                        id="nameError"
                        class="form-error form-error-card"
                    ></div>


                </div>

            </div>

        </section>

    `);


    const input =
        document.getElementById(
            "playerNameInput"
        );


    input.focus();


    document
        .querySelectorAll(
            ".gender-button"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    gameState.player.gender =
                        button.dataset.gender;


                    document
                        .querySelectorAll(
                            ".gender-button"
                        )
                        .forEach(
                            item =>
                                item.classList.remove(
                                    "selected"
                                )
                        );


                    button.classList.add(
                        "selected"
                    );

                }
            );

        });


    document
        .getElementById(
            "continueNameButton"
        )
        .addEventListener(
            "click",
            savePlayerName
        );


    document
        .getElementById(
            "backFromName"
        )
        .addEventListener(
            "click",
            showModeSelection
        );


    input.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Enter"
            ) {

                savePlayerName();

            }

        }
    );

}


/* =========================================================
   13. ЗБЕРЕЖЕННЯ ІМЕНІ
========================================================= */

function savePlayerName() {

    const input =
        document.getElementById(
            "playerNameInput"
        );


    const error =
        document.getElementById(
            "nameError"
        );


    const name =
        input.value.trim();


    if (!name) {

        error.textContent =
            "Напиши своє ім'я 🙂";

        return;

    }


    if (
        !gameState.player.gender
    ) {

        error.textContent =
            "Обери: хлопчик чи дівчинка 🙂";

        return;

    }


    error.textContent =
        "";


    gameState.player.name =
        name;


    showTokenSelection();

}


/* =========================================================
   14. ВИБІР ФІШКИ
========================================================= */

function showTokenSelection() {

    gameState.phase =
        "token-selection";


    const tokensHTML =
        TOKENS
            .map(token => `

                <button
                    class="
                        token-option
                        ${
                            gameState.player.token &&
                            gameState.player.token.id === token.id
                                ? "selected"
                                : ""
                        }
                    "
                    data-token="${token.id}"
                    type="button"
                >

                    <img
                        src="${token.image}"
                        alt="${token.name}"
                    >

                    <span>
                        ${token.name}
                    </span>

                </button>

            `)
            .join("");


    setScreen(`

        <section class="game-screen">


            <button
                id="backFromTokens"
                class="screen-back-button"
                type="button"
            >
                ← Назад
            </button>


            <div class="temporary-game-card token-selection-card">


                <img
                    src="assets/raifik.png"
                    class="small-game-logo"
                    alt="Райфик"
                >


                <div class="token-selection-content">


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


    document
        .getElementById(
            "backFromTokens"
        )
        .addEventListener(
            "click",
            showNameScreen
        );

}


/* =========================================================
   15. ЗБЕРЕЖЕННЯ ФІШКИ
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


    showCareerRandomScreen();

}


/* =========================================================
   16. ЕКРАН ВИПАДКОВОЇ ПРОФЕСІЇ
========================================================= */

function showCareerRandomScreen() {

    gameState.phase =
        "career-random";


    const careersHTML =
        CAREER_SECTORS
            .map(sector => {

                const firstProfession =
                    getProfessionName(
                        sector.levels[0],
                        gameState.player.gender
                    );


                return `

                    <div class="career-random-option">

                        <div class="career-random-icon">
                            ${sector.icon}
                        </div>

                        <strong>
                            ${firstProfession}
                        </strong>

                    </div>

                `;

            })
            .join("");


    setScreen(`

        <section class="game-screen">


            <button
                id="backFromCareerRandom"
                class="screen-back-button"
                type="button"
            >
                ← Назад
            </button>


            <div class="temporary-game-card career-random-card">


                <h2>
                    ТВОЯ ПРОФЕСІЙНА ІСТОРІЯ
                </h2>


                <p>

                    Життя саме визначить,
                    з якої професії почнеться твій шлях.

                </p>


                <div class="career-random-box">


                    <div class="career-random-dice">
                        🎲
                    </div>


                    <strong>
                        ГОТОВИЙ?
                    </strong>


                    <span>

                        Натисни кнопку,
                        щоб випадково отримати професію.

                    </span>


                </div>


                <button
                    id="randomCareerButton"
                    class="main-game-btn"
                    type="button"
                >
                    🎲 ОТРИМАТИ ПРОФЕСІЮ
                </button>


                <div class="career-random-grid">

                    ${careersHTML}

                </div>


            </div>

        </section>

    `);


    document
        .getElementById(
            "randomCareerButton"
        )
        .addEventListener(
            "click",
            () => {

                if (
                    gameState.player.sector
                ) {

                    showCareerReveal();

                }
                else {

                    assignRandomCareer();

                }

            }
        );


    document
        .getElementById(
            "backFromCareerRandom"
        )
        .addEventListener(
            "click",
            showTokenSelection
        );

}


/* =========================================================
   17. ВИПАДКОВА ПРОФЕСІЙНА СФЕРА
========================================================= */

function assignRandomCareer() {

    const sector =
        randomItem(
            CAREER_SECTORS
        );


    gameState.player.sector =
        sector;


    gameState.player.careerLevel =
        0;


    copyStartingStats(
        gameState.player
    );


    showCareerReveal();

}


/* =========================================================
   18. ЕКРАН — ТВІЙ ЖИТТЄВИЙ ШЛЯХ
========================================================= */

function showCareerReveal() {

    gameState.phase =
        "career";


    const player =
        gameState.player;


    const sector =
        player.sector;


    const levels =
        sector.levels.map(
            (
                profession,
                index
            ) => {

                const stats =
                    CAREER_LEVEL_STATS[
                        index
                    ];


                const isCurrent =
                    index ===
                    player.careerLevel;


                return {

                    index,

                    profession:
                        getProfessionName(
                            profession,
                            player.gender
                        ),

                    stats,

                    isCurrent

                };

            }
        );


    const careerHTML =
        levels
            .reverse()
            .map(level => `

                <div
                    class="
                        career-path-card
                        career-step
                        ${
                            level.isCurrent
                                ? "career-current"
                                : "career-locked"
                        }
                    "
                    data-level="${level.index + 1}"
                >


                    <div class="career-level-top">


                        <span class="career-level-number">

                            ${level.index + 1}

                        </span>


                        ${
                            level.isCurrent

                                ? `

                                    <span class="career-current-label">

                                        👤 ТИ ТУТ

                                    </span>

                                  `

                                : `

                                    <span class="career-up-label">

                                        ↑

                                    </span>

                                  `
                        }


                    </div>


                    <div class="career-job-name">

                        ${level.profession}

                    </div>


                    <div class="career-level-stats">


                        <span>

                            💰
                            ${level.stats.money.toLocaleString("uk-UA")}

                        </span>


                        <span>

                            ⭐
                            ${level.stats.reputation}

                        </span>


                        <span>

                            🧠
                            ${level.stats.knowledge}

                        </span>


                        <span>

                            ⚡
                            ${level.stats.energy}

                        </span>


                    </div>


                </div>

            `)
            .join("");


    setScreen(`

        <section class="game-screen">


            <button
                id="backFromCareer"
                class="screen-back-button"
                type="button"
            >
                ← Назад
            </button>


            <div class="temporary-game-card career-screen-card">


                <div class="career-raifik-side">


                    <img
                        src="assets/raifik.png"
                        class="small-game-logo"
                        alt="Райфик"
                    >


                    <div class="raifik-career-message">


                        <strong>

                            Мрія — твоя ціль.

                        </strong>


                        <br>


                        А кар'єра — шлях,
                        який допоможе тобі
                        до неї дістатися.


                    </div>


                </div>


                <div class="career-content">


                    <div class="career-sector-badge">


                        <span>
                            ${sector.icon}
                        </span>


                        <strong>
                            ${sector.name}
                        </strong>


                    </div>


                    <h2>

                        Ось твій життєвий шлях

                    </h2>


                    <p class="career-description">

                        Ти починаєш із першої сходинки.

                        Розвивай знання,
                        репутацію та фінансові можливості,
                        щоб поступово підніматися
                        кар'єрним шляхом.

                    </p>


                    <div class="career-path career-ladder">


                        <div class="career-goal-label">

                            🏆 КАР'ЄРНА ВЕРШИНА

                        </div>


                        ${careerHTML}


                        <div class="career-start-label">

                            👤 ТИ ПОЧИНАЄШ ТУТ

                        </div>


                    </div>


                    <button
                        id="chooseDreamButton"
                        class="main-game-btn"
                        type="button"
                    >
                        ОБРАТИ МРІЮ
                    </button>


                </div>


            </div>

        </section>

    `);


    document
        .getElementById(
            "chooseDreamButton"
        )
        .addEventListener(
            "click",
            showDreamSelection
        );


    document
        .getElementById(
            "backFromCareer"
        )
        .addEventListener(
            "click",
            showCareerRandomScreen
        );

}


/* =========================================================
   19. ГЕНЕРАЦІЯ 4 МРІЙ
========================================================= */

function prepareDreamOptions() {

    if (
        gameState.dreamOptions.length
    ) {

        return;

    }


    gameState.dreamOptions =
        shuffleArray(
            DREAMS
        )
        .slice(
            0,
            4
        );

}


/* =========================================================
   20. ЕКРАН ВИБОРУ МРІЇ
========================================================= */

function showDreamSelection() {

    gameState.phase =
        "dream";


    prepareDreamOptions();


    const dreamsHTML =
        gameState.dreamOptions
            .map(dream => `

                <button
                    class="
                        dream-option
                        dream-card
                        ${
                            gameState.pendingDream &&
                            gameState.pendingDream.id === dream.id
                                ? "selected"
                                : ""
                        }
                    "
                    data-dream="${dream.id}"
                    type="button"
                >


                    <div class="dream-card-top">

                        <div class="dream-icon">

                            ${dream.icon}

                        </div>

                    </div>


                    <strong class="dream-name">

                        ${dream.name}

                    </strong>


                </button>

            `)
            .join("");


    setScreen(`

        <section class="game-screen">


            <button
                id="backFromDream"
                class="screen-back-button"
                type="button"
            >
                ← Назад
            </button>


            <div class="temporary-game-card dream-selection-card">


                <img
                    src="assets/raifik.png"
                    class="small-game-logo"
                    alt="Райфик"
                >


                <div class="dream-selection-content">


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


                    <div
                        id="dreamDetails"
                        class="dream-details"
                    ></div>


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

                    previewDream(
                        button.dataset.dream
                    );

                }
            );

        });


    document
        .getElementById(
            "backFromDream"
        )
        .addEventListener(
            "click",
            showCareerReveal
        );


    if (
        gameState.pendingDream
    ) {

        renderDreamDetails();

    }

}


/* =========================================================
   21. ПЕРЕГЛЯД МРІЇ
========================================================= */

function previewDream(dreamId) {

    const dream =
        gameState
            .dreamOptions
            .find(
                item =>
                    item.id === dreamId
            );


    if (!dream) {

        return;

    }


    gameState.pendingDream =
        dream;


    document
        .querySelectorAll(
            ".dream-option"
        )
        .forEach(button => {

            button
                .classList
                .toggle(

                    "selected",

                    button.dataset.dream ===
                    dreamId

                );

        });


    renderDreamDetails();

}


/* =========================================================
   22. ПОКАЗ ПОКАЗНИКІВ МРІЇ
========================================================= */

function renderDreamDetails() {

    const container =
        document.getElementById(
            "dreamDetails"
        );


    const dream =
        gameState.pendingDream;


    if (
        !container ||
        !dream
    ) {

        return;

    }


    container.innerHTML = `

        <div class="dream-details-card">


            <h3>

                ${dream.icon}
                ${dream.name}

            </h3>


            <p>

                Для здійснення цієї Мрії потрібно:

            </p>


            <div class="dream-requirements">


                <span>

                    💰
                    ${dream.requirements.money.toLocaleString("uk-UA")}

                </span>


                <span>

                    ⭐
                    ${dream.requirements.reputation}

                </span>


                <span>

                    🧠
                    ${dream.requirements.knowledge}

                </span>


                <span>

                    ⚡
                    ${dream.requirements.energy}

                </span>


            </div>


            <button
                id="confirmDreamButton"
                class="main-game-btn"
                type="button"
            >
                ОБРАТИ ЦЮ МРІЮ
            </button>


        </div>

    `;


    document
        .getElementById(
            "confirmDreamButton"
        )
        .addEventListener(
            "click",
            confirmDream
        );

}


/* =========================================================
   23. ПІДТВЕРДЖЕННЯ МРІЇ
========================================================= */

function confirmDream() {

    if (
        !gameState.pendingDream
    ) {

        return;

    }


    gameState.player.dream =
        gameState.pendingDream;


    showDreamConfirmed();

}


/* =========================================================
   24. МРІЮ ОБРАНО
========================================================= */

function showDreamConfirmed() {

    gameState.phase =
        "dream-confirmed";


    const player =
        gameState.player;


    setScreen(`

        <section class="game-screen">


            <div class="dream-confirmed-card">


                <div class="dream-confirmed-icon">

                    ✨

                </div>


                <h2>

                    МРІЮ ОБРАНО

                </h2>


                <div class="dream-confirmed-sector">

                    ${player.sector.icon}

                    <strong>

                        ${player.sector.name}

                    </strong>

                </div>


                <h3>

                    ${player.dream.icon}

                    ${player.dream.name}

                </h3>


                <div class="dream-confirmed-actions">


                    <button
                        id="changeDreamButton"
                        class="secondary-game-btn"
                        type="button"
                    >
                        ← ЗМІНИТИ МРІЮ
                    </button>


                    <button
                        id="continueAfterDreamButton"
                        class="main-game-btn"
                        type="button"
                    >
                        ПРОДОВЖИТИ
                    </button>


                </div>


            </div>


        </section>

    `);


    document
        .getElementById(
            "changeDreamButton"
        )
        .addEventListener(
            "click",
            showDreamSelection
        );


    document
        .getElementById(
            "continueAfterDreamButton"
        )
        .addEventListener(
            "click",
            () => {

                createAIPlayers();

                showBeforeGameScreen();

            }
        );

}


/* =========================================================
   25. СТВОРЕННЯ AI-СУПЕРНИКІВ
========================================================= */

function createAIPlayers() {

    gameState.opponents =
        [];


    /*
       Викидаємо фішку,
       яку вибрав гравець.

       Потім перемішуємо —
       тому AI також не повторяться.
    */

    const availableTokens =
        shuffleArray(

            TOKENS.filter(
                token =>
                    token.id !==
                    gameState.player.token.id
            )

        );


    const availablePeople =
        shuffleArray([

            {
                name: "Марко",
                gender: "male"
            },

            {
                name: "Софія",
                gender: "female"
            },

            {
                name: "Макс",
                gender: "male"
            },

            {
                name: "Анна",
                gender: "female"
            },

            {
                name: "Лео",
                gender: "male"
            },

            {
                name: "Мія",
                gender: "female"
            }

        ]);


    const availableDreams =
        shuffleArray(

            DREAMS.filter(
                dream =>
                    !gameState.player.dream ||
                    dream.id !==
                    gameState.player.dream.id
            )

        );


    for (
        let i = 0;
        i < GAME_CONFIG.aiPlayers;
        i++
    ) {

        const person =
            availablePeople[i];


        const sector =
            randomItem(
                CAREER_SECTORS
            );


        const ai = {

            id:
                `ai-${i + 1}`,

            name:
                person.name,

            gender:
                person.gender,

            token:
                availableTokens[i],

            sector,

            careerLevel:
                0,

            dream:
                availableDreams[i],

            money:
                0,

            reputation:
                0,

            knowledge:
                0,

            energy:
                0,

            circle:
                "big",

            position:
                1,

            finished:
                false

        };


        copyStartingStats(
            ai
        );


        gameState.opponents.push(
            ai
        );

    }

}


/* =========================================================
   26. ЕКРАН ТРЬОХ УЧАСНИКІВ
========================================================= */

function showBeforeGameScreen() {

    gameState.phase =
        "before-game";


    const participants = [

        gameState.player,

        ...gameState.opponents

    ];


    const participantsHTML =
        participants
            .map(participant => {

                const isPlayer =
                    participant.id ===
                    "player";


                return `

                    <div
                        class="
                            participant-preview-card
                            ${
                                isPlayer
                                    ? "participant-is-player"
                                    : ""
                            }
                        "
                    >


                        ${
                            isPlayer

                                ? `

                                    <div class="participant-you-label">

                                        ЦЕ ТИ

                                    </div>

                                  `

                                : ""
                        }


                        <img
                            src="${participant.token.image}"
                            class="participant-preview-token"
                            alt="${participant.name}"
                        >


                        <strong class="participant-preview-name">

                            ${participant.name}

                        </strong>


                        <span class="participant-preview-profession">

                            ${participant.sector.icon}

                            ${getParticipantProfession(participant)}

                        </span>


                        <span class="participant-preview-dream">

                            ✨ Мрія:

                            <strong>

                                ${participant.dream.name}

                            </strong>

                        </span>


                    </div>

                `;

            })
            .join("");


    setScreen(`

        <section class="game-screen">


            <button
                id="backFromPlayers"
                class="screen-back-button"
                type="button"
            >
                ← Назад
            </button>


            <div class="before-game-content">


                <h2>

                    Ти не один у цій історії 😉

                </h2>


                <p>

                    Разом із тобою свій шлях
                    проходитимуть ще двоє гравців.

                </p>


                <div class="participants-preview-grid">

                    ${participantsHTML}

                </div>


                <button
                    id="goToBoardButton"
                    class="main-game-btn"
                    type="button"
                >
                    ПОЧАТИ ГРУ
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


    document
        .getElementById(
            "backFromPlayers"
        )
        .addEventListener(
            "click",
            showDreamConfirmed
        );

}


/* =========================================================
   27. ІГРОВИЙ ЕКРАН
========================================================= */

function showGameBoard() {

    gameState.phase =
        "game";


    const player =
        gameState.player;


    const legendHTML =
        Object
            .values(
                CELL_TYPES
            )
            .map(type => `

                <button
                    class="cell-type-info-button"
                    data-type="${type.id}"
                    type="button"
                >

                    <span>
                        ${type.icon}
                    </span>

                    <strong>
                        ${type.name}
                    </strong>

                </button>

            `)
            .join("");


    const opponentsHTML =
        gameState.opponents
            .map(ai => `

                <button
                    class="mini-opponent-button"
                    data-player="${ai.id}"
                    type="button"
                >

                    <img
                        src="${ai.token.image}"
                        alt="${ai.name}"
                    >

                    <span>
                        ${ai.name}
                    </span>

                </button>

            `)
            .join("");


    setScreen(`

        <section class="main-board-screen">


            <!-- МАЛЕНЬКЕ ЛОГО -->

            <img
                src="assets/logo.png"
                class="board-small-logo"
                alt="CV Життя"
            >


            <!-- ЛІВА ПАНЕЛЬ -->

            <aside class="game-info-panel">


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

                            ${getParticipantProfession(player)}

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


                    <span>

                        ✨ Моя Мрія

                    </span>


                    <strong>

                        ${player.dream.name}

                    </strong>


                </div>


                <div class="board-help-block">


                    <h3>

                        ТИПИ КОМІРОК

                    </h3>


                    <div class="cell-type-list">

                        ${legendHTML}

                    </div>


                </div>


            </aside>


            <!-- ЦЕНТРАЛЬНЕ ПОЛЕ -->

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


                <div
                    id="dreamCenter"
                    class="dream-center"
                >

                    <span>

                        ✨

                    </span>

                    <strong>

                        МРІЯ

                    </strong>

                </div>


                <div
                    id="eventCardPanel"
                    class="event-card-panel"
                >

                    <span class="event-card-question">

                        ?

                    </span>


                    <strong>

                        ПОТОЧНА КАРТКА

                    </strong>


                    <small>

                        Тут з'явиться подія
                        після твого ходу.

                    </small>


                </div>


            </main>


            <!-- ПРАВА ПАНЕЛЬ -->

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
                    type="button"
                >
                    КИНУТИ КУБИК
                </button>


                <div
                    id="diceMessage"
                    class="dice-message"
                >

                    Райфик: кидай кубик 🎲

                </div>


                <div class="other-players-block">


                    <h3>

                        ГРАВЦІ

                    </h3>


                    <div class="mini-opponents-list">

                        ${opponentsHTML}

                    </div>


                </div>


                <div
                    id="gameLog"
                    class="game-log"
                ></div>


            </aside>


            <!-- МОДАЛКА -->

            <div
                id="gameInfoModal"
                class="game-info-modal"
                hidden
            >


                <div class="game-info-modal-card">


                    <button
                        id="closeGameInfoModal"
                        class="game-info-close"
                        type="button"
                    >

                        ✕

                    </button>


                    <div
                        id="gameInfoModalContent"
                    ></div>


                </div>


            </div>


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


    document
        .querySelectorAll(
            ".cell-type-info-button"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    showCellTypeInfo(
                        button.dataset.type
                    );

                }
            );

        });


    document
        .querySelectorAll(
            ".mini-opponent-button"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    showParticipantInfo(
                        button.dataset.player
                    );

                }
            );

        });


    document
        .getElementById(
            "closeGameInfoModal"
        )
        .addEventListener(
            "click",
            closeGameInfoModal
        );


    const dreamCenter =
        document.getElementById(
            "dreamCenter"
        );


    dreamCenter.addEventListener(
        "dragover",
        event => {

            event.preventDefault();

        }
    );


    dreamCenter.addEventListener(
        "drop",
        event => {

            event.preventDefault();

            tryMovePlayerToDream();

        }
    );


    dreamCenter.addEventListener(
        "click",
        tryMovePlayerToDream
    );

}


/* =========================================================
   28. СТВОРЕННЯ ПОЛЯ
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
   29. ТИП КОМІРКИ
========================================================= */

function getCellType(
    circleName,
    position
) {

    const special =
        SPECIAL_CELLS[
            circleName
        ]?.[
            position
        ];


    if (special) {

        return {

            id: "special",

            icon:
                special.icon,

            name:
                special.name,

            description:
                "Спеціальна комірка. Її механіку допишемо окремо.",

            special:
                true

        };

    }


    if (
        circleName === "big" &&
        position === 1
    ) {

        return CELL_TYPES.income;

    }


    const pattern = [

        CELL_TYPES.bank,

        CELL_TYPES.event,

        CELL_TYPES.life,

        CELL_TYPES.fate,

        CELL_TYPES.energy,

        CELL_TYPES.event

    ];


    return pattern[
        (
            position -
            2 +
            pattern.length
        )
        %
        pattern.length
    ];

}


/* =========================================================
   30. СТВОРЕННЯ 56 / 28 КОМІРОК

   ВЕЛИКЕ:
   1 → 56 ПРОТИ ГОДИННИКОВОЇ СТРІЛКИ

   МАЛЕ:
   1 → 28 ЗА ГОДИННИКОВОЮ СТРІЛКОЮ
========================================================= */

function createCircleCells(
    container,
    amount,
    circleName
) {

    container.innerHTML =
        "";


    for (
        let i = 1;
        i <= amount;
        i++
    ) {

        const cell =
            document.createElement(
                "div"
            );


        const type =
            getCellType(
                circleName,
                i
            );


        cell.className =
            `board-cell ${circleName}-cell`;


        if (
            type.special
        ) {

            cell.classList.add(
                "special-board-cell"
            );

        }


        cell.dataset.circle =
            circleName;


        cell.dataset.position =
            i;


        cell.dataset.type =
            type.id;


        const direction =
            circleName === "big"
                ? -1
                : 1;


        const startAngle =
            -90;


        const angle =
            startAngle +
            direction *
            (
                (i - 1) *
                360 /
                amount
            );


        const radians =
            angle *
            Math.PI /
            180;


        const radius =
            47;


        const x =
            50 +
            radius *
            Math.cos(
                radians
            );


        const y =
            50 +
            radius *
            Math.sin(
                radians
            );


        cell.style.left =
            `${x}%`;


        cell.style.top =
            `${y}%`;


        cell.style.transform =
            "translate(-50%, -50%)";


        cell.innerHTML = `

            <span class="cell-number">

                ${i}

            </span>


            <span class="cell-icon">

                ${type.icon}

            </span>

        `;


        cell.title =
            type.name;


        cell.addEventListener(
            "click",
            () => {

                if (
                    gameState.targetPosition !==
                    null
                ) {

                    tryMovePlayerToCell(
                        cell
                    );

                }
                else {

                    showCellInfo(
                        circleName,
                        i
                    );

                }

            }
        );


        cell.addEventListener(
            "dragover",
            event => {

                event.preventDefault();

            }
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


        container.appendChild(
            cell
        );

    }

}


/* =========================================================
   31. РОЗМІЩЕННЯ ВСІХ ФІШОК
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
   32. РОЗМІЩЕННЯ ОДНІЄЇ ФІШКИ
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


    if (
        draggable
    ) {

        piece.draggable =
            true;


        piece.addEventListener(
            "dragstart",
            event => {

                event
                    .dataTransfer
                    .setData(
                        "text/plain",
                        participant.id
                    );

            }
        );

    }


    cell.appendChild(
        piece
    );

}


/* =========================================================
   33. КУБИК
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


    button.disabled =
        true;


    let count =
        0;


    const animation =
        setInterval(
            () => {

                dice.textContent =
                    DICE_FACES[
                        randomNumber(
                            0,
                            5
                        )
                    ];


                count++;


                if (
                    count >= 10
                ) {

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

                        <strong>
                            ${value}
                        </strong>.

                        <br>

                        Перенеси свою фішку
                        на підсвічену комірку.

                    `;

                }

            },

            70
        );

}


/* =========================================================
   34. РОЗРАХУНОК НАСТУПНОЇ ПОЗИЦІЇ
========================================================= */

function calculateNextPosition(
    participant,
    steps
) {

    if (
        participant.circle ===
        "big"
    ) {

        const total =
            participant.position +
            steps;


        if (
            total <=
            GAME_CONFIG.bigCircleCells
        ) {

            return {

                circle:
                    "big",

                position:
                    total

            };

        }


        return {

            circle:
                "small",

            position:
                total -
                GAME_CONFIG.bigCircleCells

        };

    }


    if (
        participant.circle ===
        "small"
    ) {

        const total =
            participant.position +
            steps;


        if (
            total <=
            GAME_CONFIG.smallCircleCells
        ) {

            return {

                circle:
                    "small",

                position:
                    total

            };

        }


        return {

            circle:
                "dream",

            position:
                1

        };

    }


    return {

        circle:
            "dream",

        position:
            1

    };

}


/* =========================================================
   35. ПІДСВІЧЕННЯ ЦІЛЬОВОЇ КОМІРКИ
========================================================= */

function calculateTargetCell(
    steps
) {

    clearTargetCells();


    const target =
        calculateNextPosition(

            gameState.player,

            steps

        );


    gameState.targetCircle =
        target.circle;


    gameState.targetPosition =
        target.position;


    if (
        target.circle ===
        "dream"
    ) {

        const dreamCenter =
            document.getElementById(
                "dreamCenter"
            );


        if (
            dreamCenter
        ) {

            dreamCenter
                .classList
                .add(
                    "target-cell"
                );

        }


        return;

    }


    const targetCell =
        document.querySelector(

            `.${target.circle}-cell[data-position="${target.position}"]`

        );


    if (
        targetCell
    ) {

        targetCell
            .classList
            .add(
                "target-cell"
            );

    }

}


/* =========================================================
   36. РУХ ФІШКИ ГРАВЦЯ
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
        gameState.targetCircle
    ) {

        return;

    }


    if (
        cellPosition !==
        gameState.targetPosition
    ) {

        return;

    }


    gameState.player.circle =
        circle;


    gameState.player.position =
        cellPosition;


    movePieceDOM(
        "player",
        cell
    );


    clearTargetCells();


    gameState.targetPosition =
        null;


    gameState.targetCircle =
        null;


    const message =
        document.getElementById(
            "diceMessage"
        );


    if (
        message
    ) {

        message.innerHTML = `

            Чудово!

            <br>

            Ти на комірці

            <strong>
                ${cellPosition}
            </strong>.

        `;

    }


    showCurrentCellCard(
        circle,
        cellPosition
    );


    addLog(

        `${gameState.player.name} →
        ${
            circle === "big"
                ? "велике"
                : "мале"
        } коло,
        клітинка ${cellPosition}`

    );


    startAITurns();

}


/* =========================================================
   37. ПЕРЕХІД ДО МРІЇ
========================================================= */

function tryMovePlayerToDream() {

    if (
        gameState.targetCircle !==
        "dream"
    ) {

        return;

    }


    gameState.player.finished =
        true;


    const dreamCenter =
        document.getElementById(
            "dreamCenter"
        );


    movePieceDOM(
        "player",
        dreamCenter
    );


    clearTargetCells();


    gameState.targetCircle =
        null;


    gameState.targetPosition =
        null;


    const message =
        document.getElementById(
            "diceMessage"
        );


    if (
        message
    ) {

        message.innerHTML = `

            ✨ Ти дістався до Мрії!

        `;

    }

}


/* =========================================================
   38. ПЕРЕМІЩЕННЯ ФІШКИ В DOM
========================================================= */

function movePieceDOM(
    participantId,
    destination
) {

    const piece =
        document.querySelector(

            `[data-player-id="${participantId}"]`

        );


    if (
        piece &&
        destination
    ) {

        destination.appendChild(
            piece
        );

    }

}


/* =========================================================
   39. ПОТОЧНА КАРТКА / ПОДІЯ
========================================================= */

function showCurrentCellCard(
    circleName,
    position
) {

    const panel =
        document.getElementById(
            "eventCardPanel"
        );


    if (
        !panel
    ) {

        return;

    }


    const type =
        getCellType(
            circleName,
            position
        );


    panel.innerHTML = `

        <span class="event-card-question">

            ${type.icon}

        </span>


        <strong>

            ${type.name}

        </strong>


        <small>

            ${type.description}

        </small>

    `;

}


/* =========================================================
   40. AI-СУПЕРНИКИ
========================================================= */

function startAITurns() {

    gameState.currentTurn =
        "ai";


    const rollButton =
        document.getElementById(
            "rollDiceButton"
        );


    if (
        rollButton
    ) {

        rollButton.disabled =
            true;

    }


    let index =
        0;


    function nextAI() {

        if (
            index >=
            gameState.opponents.length
        ) {

            gameState.currentTurn =
                "player";


            if (
                rollButton
            ) {

                rollButton.disabled =
                    false;

            }


            const message =
                document.getElementById(
                    "diceMessage"
                );


            if (
                message
            ) {

                message.innerHTML = `

                    Твій хід!

                    <br>

                    Кидай кубик 🎲

                `;

            }


            return;

        }


        const ai =
            gameState.opponents[
                index
            ];


        if (
            ai.finished
        ) {

            index++;

            nextAI();

            return;

        }


        const dice =
            randomNumber(
                1,
                6
            );


        const target =
            calculateNextPosition(
                ai,
                dice
            );


        if (
            target.circle ===
            "dream"
        ) {

            ai.finished =
                true;


            const dreamCenter =
                document.getElementById(
                    "dreamCenter"
                );


            movePieceDOM(
                ai.id,
                dreamCenter
            );

        }
        else {

            ai.circle =
                target.circle;


            ai.position =
                target.position;


            const cell =
                document.querySelector(

                    `.${target.circle}-cell[data-position="${target.position}"]`

                );


            movePieceDOM(
                ai.id,
                cell
            );

        }


        addLog(

            `${ai.name} 🎲 ${dice} → ${
                target.circle === "dream"
                    ? "Мрія"
                    : `клітинка ${target.position}`
            }`

        );


        index++;


        setTimeout(
            nextAI,
            650
        );

    }


    nextAI();

}


/* =========================================================
   41. ІНФОРМАЦІЯ ПРО ТИП КОМІРКИ
========================================================= */

function showCellTypeInfo(
    typeId
) {

    const type =
        CELL_TYPES[
            typeId
        ];


    if (
        !type
    ) {

        return;

    }


    openGameInfoModal(`

        <div class="cell-info-popup">


            <div class="cell-info-icon">

                ${type.icon}

            </div>


            <h3>

                ${type.name}

            </h3>


            <p>

                ${type.description}

            </p>


        </div>

    `);

}


/* =========================================================
   42. ІНФОРМАЦІЯ ПРО КОНКРЕТНУ КОМІРКУ
========================================================= */

function showCellInfo(
    circleName,
    position
) {

    const type =
        getCellType(
            circleName,
            position
        );


    openGameInfoModal(`

        <div class="cell-info-popup">


            <div class="cell-info-icon">

                ${type.icon}

            </div>


            <h3>

                Комірка ${position}

            </h3>


            <strong>

                ${type.name}

            </strong>


            <p>

                ${type.description}

            </p>


        </div>

    `);

}


/* =========================================================
   43. ІНФОРМАЦІЯ ПРО ІНШОГО ГРАВЦЯ
========================================================= */

function showParticipantInfo(
    participantId
) {

    const participant =
        gameState
            .opponents
            .find(
                item =>
                    item.id ===
                    participantId
            );


    if (
        !participant
    ) {

        return;

    }


    openGameInfoModal(`

        <div class="participant-info-popup">


            <img
                src="${participant.token.image}"
                class="participant-popup-token"
                alt="${participant.name}"
            >


            <h3>

                ${participant.name}

            </h3>


            <p>

                ${participant.sector.icon}

                ${getParticipantProfession(participant)}

            </p>


            <div class="participant-popup-career">

                Кар'єрний рівень:

                <strong>

                    ${participant.careerLevel + 1}

                </strong>

            </div>


            <div class="participant-popup-stats">


                <span>

                    💰
                    ${participant.money.toLocaleString("uk-UA")}

                </span>


                <span>

                    ⭐
                    ${participant.reputation}

                </span>


                <span>

                    🧠
                    ${participant.knowledge}

                </span>


                <span>

                    ⚡
                    ${participant.energy}

                </span>


            </div>


            <div class="participant-popup-dream">

                ✨ Мрія:

                <strong>

                    ${participant.dream.name}

                </strong>

            </div>


        </div>

    `);

}


/* =========================================================
   44. МОДАЛКА ІНФОРМАЦІЇ
========================================================= */

function openGameInfoModal(
    html
) {

    const modal =
        document.getElementById(
            "gameInfoModal"
        );


    const content =
        document.getElementById(
            "gameInfoModalContent"
        );


    if (
        !modal ||
        !content
    ) {

        return;

    }


    content.innerHTML =
        html;


    modal.hidden =
        false;

}


function closeGameInfoModal() {

    const modal =
        document.getElementById(
            "gameInfoModal"
        );


    if (
        modal
    ) {

        modal.hidden =
            true;

    }

}


/* =========================================================
   45. ОЧИЩЕННЯ ПІДСВІЧЕНОЇ КОМІРКИ
========================================================= */

function clearTargetCells() {

    document
        .querySelectorAll(
            ".target-cell"
        )
        .forEach(
            cell =>
                cell
                    .classList
                    .remove(
                        "target-cell"
                    )
        );

}


/* =========================================================
   46. ЖУРНАЛ ГРИ
========================================================= */

function addLog(text) {

    const log =
        document.getElementById(
            "gameLog"
        );


    if (
        !log
    ) {

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
   ЗАПУСК ГРИ
========================================================= */

showStartScreen();
