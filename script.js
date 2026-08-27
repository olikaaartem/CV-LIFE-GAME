/* =========================================================
   CV ЖИТТЯ — ЛЮБИ. МРІЙ. ДІЙ.
   SCRIPT.JS

   ВЕРСІЯ З КВАДРАТНИМ ПОЛЕМ

   ЛОГІКА:
   - вибір режиму
   - ім'я + стать
   - вибір фішки
   - випадкова професія
   - показ отриманої професії
   - 4 рівні кар'єри
   - 20 мрій
   - 2 AI-гравці
   - внутрішній квадрат: 28
   - зовнішній квадрат: 56
   - перехід 28 → 1 великого квадрату
   - кубик
   - повільні AI
   - картки Подія / Банк / Життя / Доля
   - Райфик-підказки
========================================================= */


const app = document.getElementById("financeGameApp");


/* =========================================================
   1. ОСНОВНІ НАЛАШТУВАННЯ
========================================================= */

const GAME_CONFIG = {

    innerCells: 28,
    outerCells: 56,

    aiPlayers: 2,

    aiThinkDelay: 1200,
    aiStepDelay: 220,
    aiResultDelay: 1700,

    incomeAmount: 10000,

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

   ПОРЯДОК:
   чоловічий варіант / жіночий варіант
========================================================= */

const CAREER_SECTORS = [

    {
        id: "it",
        name: "IT Сфера",
        icon: "💻",

        levels: [
            "Програміст / Програмістка",
            "Керівник команди розробки / Керівниця команди розробки",
            "IT-директор / IT-директорка",
            "CTO / Технічна директорка"
        ]
    },

    {
        id: "restaurant",
        name: "Ресторанний бізнес",
        icon: "☕",

        levels: [
            "Бариста / Бариста",
            "Адміністратор ресторану / Адміністраторка ресторану",
            "Керуючий рестораном / Керуюча рестораном",
            "Власник ресторану / Власниця ресторану"
        ]
    },

    {
        id: "education",
        name: "Освіта",
        icon: "🎓",

        levels: [
            "Вчитель / Вчителька",
            "Директор закладу освіти / Директорка закладу освіти",
            "Ректор університету / Ректорка університету",
            "Міністр освіти і науки України / Міністерка освіти і науки України"
        ]
    },

    {
        id: "art",
        name: "Мистецтво",
        icon: "🎨",

        levels: [
            "Художник / Художниця",
            "Артдиректор / Артдиректорка",
            "Власник артгалереї / Власниця артгалереї",
            "Директор музею / Директорка музею"
        ]
    },

    {
        id: "medicine",
        name: "Медицина",
        icon: "🩺",

        levels: [
            "Медбрат / Медсестра",
            "Лікар / Лікарка",
            "Завідувач відділення / Завідувачка відділення",
            "Головний лікар / Головна лікарка"
        ]
    },

    {
        id: "media",
        name: "Медіа",
        icon: "🎥",

        levels: [
            "Контент-креатор / Контент-креаторка",
            "YouTube-блогер / YouTube-блогерка",
            "Продюсер контенту / Продюсерка контенту",
            "Власник медіакомпанії / Власниця медіакомпанії"
        ]
    },

    {
        id: "logistics",
        name: "Логістика",
        icon: "🚚",

        levels: [
            "Логіст / Логістка",
            "Координатор логістики / Координаторка логістики",
            "Менеджер з логістики / Менеджерка з логістики",
            "Директор з логістики / Директорка з логістики"
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
            "Власник фінансової компанії / Власниця фінансової компанії"
        ]
    },

    {
        id: "military",
        name: "Військова справа",
        icon: "🛡️",

        levels: [
            "Оператор БпЛА / Операторка БпЛА",
            "Інструктор / Інструкторка",
            "Офіцер / Офіцерка",
            "Начальник штабу / Начальниця штабу"
        ]
    },

    {
        id: "agro",
        name: "Агро",
        icon: "🌾",

        levels: [
            "Фермер / Фермерка",
            "Агроном / Агрономка",
            "Керівник агропідприємства / Керівниця агропідприємства",
            "Власник агрохолдингу / Власниця агрохолдингу"
        ]
    }

];


/* =========================================================
   4. ПОКАЗНИКИ КАР'ЄРНИХ РІВНІВ

   ПОКИ СТАЛІ.
   Пізніше можемо задати різні для професій.
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
   5. МРІЇ — 20 ШТУК

   image поки null.
   Коли будуть готові PNG:
   image: "assets/dream-01.png"
========================================================= */

const DREAMS = [

    {
        id: "world_trip",
        icon: "🌍",
        image: null,
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
        image: null,
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
        image: null,
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
        image: null,
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
        image: null,
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
        image: null,
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
        image: null,
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
        image: null,
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
        image: null,
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
        image: null,
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
        image: null,
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
        image: null,
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
        image: null,
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
        image: null,
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
        image: null,
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
        image: null,
        name: "Мрія життя",
        requirements: {
            money: 1000000,
            reputation: 80,
            knowledge: 80,
            energy: 80
        }
    },

    {
        id: "sports_form",
        icon: "🏅",
        image: null,
        name: "Досягти ідеальної спортивної форми",
        requirements: {
            money: 250000,
            reputation: 40,
            knowledge: 50,
            energy: 95
        }
    },

    {
        id: "languages",
        icon: "🗣️",
        image: null,
        name: "Вільно володіти декількома іноземними мовами",
        requirements: {
            money: 300000,
            reputation: 45,
            knowledge: 90,
            energy: 65
        }
    },

    {
        id: "music_album",
        icon: "🎵",
        image: null,
        name: "Записати музичний альбом",
        requirements: {
            money: 500000,
            reputation: 75,
            knowledge: 65,
            energy: 70
        }
    },

    {
        id: "international_project",
        icon: "🌐",
        image: null,
        name: "Реалізувати проєкт міжнародного масштабу",
        requirements: {
            money: 800000,
            reputation: 90,
            knowledge: 80,
            energy: 75
        }
    }

];


/* =========================================================
   6. ТИПИ КОМІРОК
========================================================= */

const CELL_TYPES = {

    income: {
        id: "income",
        icon: "💰",
        name: "Дохід",
        description:
            "Отримання зарплати та доходу від відкритих активів."
    },

    bank: {
        id: "bank",
        icon: "🏦",
        name: "Банк",
        description:
            "Фінансова можливість: заощадження, депозит, кредит або інше рішення."
    },

    event: {
        id: "event",
        icon: "🎲",
        name: "Подія",
        description:
            "Обери одну з трьох карток та дізнайся, що сталося."
    },

    life: {
        id: "life",
        icon: "❤️",
        name: "Життя",
        description:
            "Життєва ситуація, яка може змінити твої показники."
    },

    fate: {
        id: "fate",
        icon: "⚡",
        name: "Доля",
        description:
            "Випадкова подія. Тут усе вирішує випадок."
    },

    lounge: {
        id: "lounge",
        icon: "🎯",
        name: "Lounge & Хобі",
        description:
            "Відпочинок, хобі та можливість відновити енергію."
    },

    academy: {
        id: "academy",
        icon: "🎓",
        name: "Академія & Soft Skills",
        description:
            "Розвиток знань, навичок і кар'єрних можливостей."
    },

    transition: {
        id: "transition",
        icon: "➡️",
        name: "Перехід на велике поле",
        description:
            "Перший етап завершено. Ти переходиш на зовнішній життєвий шлях."
    },

    dreamCheck: {
        id: "dreamCheck",
        icon: "✨",
        name: "Перевірка Мрії",
        description:
            "Перевіряємо, чи достатньо ресурсів для досягнення твоєї Мрії."
    }

};


/* =========================================================
   7. ВНУТРІШНІЙ КВАДРАТ — 28

   Рух за годинниковою стрілкою.

   1  — Старт / Дохід
   6  — Lounge
   11 — Academy
   22 — Lounge
   25 — Academy
   28 — Перехід
========================================================= */

const INNER_BOARD = [

    "income",       // 1
    "bank",         // 2
    "event",        // 3
    "bank",         // 4
    "life",         // 5
    "lounge",       // 6
    "event",        // 7

    "bank",         // 8
    "fate",         // 9
    "life",         // 10
    "academy",      // 11
    "event",        // 12
    "bank",         // 13
    "life",         // 14

    "event",        // 15
    "bank",         // 16
    "fate",         // 17
    "life",         // 18
    "bank",         // 19
    "event",        // 20
    "life",         // 21

    "lounge",       // 22
    "event",        // 23
    "bank",         // 24
    "academy",      // 25
    "event",        // 26
    "bank",         // 27

    "transition"    // 28

];


/* =========================================================
   8. ЗОВНІШНІЙ КВАДРАТ — 56

   Рух проти годинникової стрілки.

   1  — Дохід
   10 — Lounge
   20 — Academy
   38 — Lounge
   48 — Academy
   56 — Перевірка Мрії
========================================================= */

const OUTER_BOARD = Array.from(
    { length: 56 },
    (_, index) => {

        const position =
            index + 1;


        if (position === 1) {
            return "income";
        }


        if (
            position === 10 ||
            position === 38
        ) {
            return "lounge";
        }


        if (
            position === 20 ||
            position === 48
        ) {
            return "academy";
        }


        if (position === 56) {
            return "dreamCheck";
        }


        const pattern = [

            "bank",
            "event",
            "life",
            "bank",
            "fate",
            "event",
            "life"

        ];


        return pattern[
            (position - 2) %
            pattern.length
        ];

    }
);


/* =========================================================
   9. ТЕСТОВІ КАРТКИ

   ПОТІМ ЗАМІНИМО ФІНАЛЬНИМИ.
========================================================= */

const CARD_DECKS = {

    event: [

        {
            title: "Нова можливість",
            text:
                "Тобі запропонували взяти участь у цікавому проєкті.",
            effects: {
                knowledge: 10,
                reputation: 5,
                energy: -5
            }
        },

        {
            title: "Новий виклик",
            text:
                "Ти впорався зі складним завданням і отримав новий досвід.",
            effects: {
                knowledge: 15,
                energy: -10
            }
        },

        {
            title: "Корисне знайомство",
            text:
                "Нове знайомство відкрило перед тобою цікаві можливості.",
            effects: {
                reputation: 10
            }
        },

        {
            title: "Помилка — теж досвід",
            text:
                "Не все вдалося, але ти зробив важливі висновки.",
            effects: {
                knowledge: 10,
                money: -5000
            }
        },

        {
            title: "Вдалий день",
            text:
                "Сьогодні все складається на твою користь.",
            effects: {
                money: 10000,
                energy: 5
            }
        }

    ],


    bank: [

        {
            title: "Вдале заощадження",
            text:
                "Ти грамотно розподілив гроші.",
            effects: {
                money: 15000,
                knowledge: 5
            }
        },

        {
            title: "Фінансова консультація",
            text:
                "Ти отримав корисні знання про особисті фінанси.",
            effects: {
                knowledge: 10
            }
        },

        {
            title: "Несподівана витрата",
            text:
                "Довелося використати частину накопичень.",
            effects: {
                money: -10000
            }
        },

        {
            title: "Вигідна можливість",
            text:
                "Вдале фінансове рішення принесло прибуток.",
            effects: {
                money: 20000,
                reputation: 5
            }
        },

        {
            title: "Фінансова дисципліна",
            text:
                "Ти відмовився від імпульсивної покупки.",
            effects: {
                money: 10000,
                knowledge: 5
            }
        }

    ],


    life: [

        {
            title: "Час для себе",
            text:
                "Ти добре відпочив та відновив сили.",
            effects: {
                energy: 15
            }
        },

        {
            title: "Новий курс",
            text:
                "Ти вирішив інвестувати час у навчання.",
            effects: {
                knowledge: 15,
                energy: -5
            }
        },

        {
            title: "Допомога друзям",
            text:
                "Твоя підтримка не залишилась непоміченою.",
            effects: {
                reputation: 10,
                energy: -5
            }
        },

        {
            title: "Велика покупка",
            text:
                "Ти придбав річ, яку давно хотів.",
            effects: {
                money: -15000,
                energy: 10
            }
        },

        {
            title: "Баланс",
            text:
                "Тобі вдалося поєднати роботу й відпочинок.",
            effects: {
                energy: 10,
                reputation: 5
            }
        }

    ],


    fate: [

        {
            title: "Доля посміхнулась",
            text:
                "Сьогодні тобі щастить.",
            effects: {
                money: 20000
            }
        },

        {
            title: "Неочікуваний поворот",
            text:
                "Плани змінилися, але ти отримав новий досвід.",
            effects: {
                knowledge: 10,
                energy: -10
            }
        },

        {
            title: "Приємний сюрприз",
            text:
                "Ти отримав гарну новину.",
            effects: {
                reputation: 10,
                energy: 10
            }
        },

        {
            title: "Складний день",
            text:
                "Тобі потрібно трохи відновити сили.",
            effects: {
                energy: -15
            }
        },

        {
            title: "Вдалий шанс",
            text:
                "Випадкова можливість принесла хороший результат.",
            effects: {
                money: 10000,
                reputation: 10
            }
        }

    ]

};


/* =========================================================
   10. СТАН ГРИ
========================================================= */

const gameState = {

    phase: "start",

    mode: null,

    currentTurn: "player",

    diceValue: null,

    target: null,

    selectedDreamId: null,

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

        board: "inner",

        position: 1

    },

    opponents: []

};


/* =========================================================
   11. ДОПОМІЖНІ ФУНКЦІЇ
========================================================= */

function randomItem(array) {

    return array[
        Math.floor(
            Math.random() *
            array.length
        )
    ];

}


function randomNumber(min, max) {

    return Math.floor(
        Math.random() *
        (max - min + 1)
    ) + min;

}


function delay(ms) {

    return new Promise(
        resolve =>
            setTimeout(resolve, ms)
    );

}


function setScreen(html) {

    app.innerHTML = html;

    window.scrollTo({
        top: 0,
        behavior: "instant"
    });

}


function formatMoney(value) {

    return Number(value)
        .toLocaleString("uk-UA");

}


/* =========================================================
   12. ТЕКСТ ЗА СТАТТЮ
========================================================= */

function isGirl(
    gender = gameState.player.gender
) {

    return gender === "girl";

}


function getReadyText() {

    return isGirl()
        ? "ГОТОВА?"
        : "ГОТОВИЙ?";

}


function getProfessionName(
    profession,
    gender = gameState.player.gender
) {

    if (!profession) {
        return "";
    }


    const parts =
        profession
            .split("/")
            .map(
                part =>
                    part.trim()
            );


    if (parts.length < 2) {
        return profession;
    }


    return gender === "girl"
        ? parts[1]
        : parts[0];

}


/* =========================================================
   13. СТАРТОВИЙ ЕКРАН
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
            showModeScreen
        );

}


/* =========================================================
   14. ВИБІР РЕЖИМУ
========================================================= */

function showModeScreen() {

    gameState.phase =
        "mode";


    setScreen(`

        <section class="game-screen mode-screen">

            <div class="mode-modal">

                <button
                    id="closeModeButton"
                    class="screen-close-button"
                >
                    ×
                </button>


                <h2>
                    ОБЕРИ РЕЖИМ ГРИ
                </h2>


                <p>
                    Як ти хочеш пройти свою історію?
                </p>


                <div class="mode-options">

                    <button
                        id="singleModeButton"
                        class="mode-option"
                    >

                        <span class="mode-icon">
                            👤
                        </span>

                        <strong>
                            ГРАТИ ОДНОМУ
                        </strong>

                        <small>
                            Ти + два AI-гравці
                        </small>

                    </button>


                    <button
                        id="multiplayerModeButton"
                        class="mode-option"
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

            </div>

        </section>

    `);


    document
        .getElementById(
            "singleModeButton"
        )
        .addEventListener(
            "click",
            () => {

                gameState.mode =
                    "single";

                showNameScreen();

            }
        );


    document
        .getElementById(
            "multiplayerModeButton"
        )
        .addEventListener(
            "click",
            showMultiplayerPlaceholder
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
   15. СПІЛЬНА ГРА — ПОКИ ЗАГЛУШКА
========================================================= */

function showMultiplayerPlaceholder() {

    setScreen(`

        <section class="game-screen">

            <div class="simple-info-card">

                <h2>
                    👥 Спільна гра
                </h2>

                <p>
                    Онлайн-кімнати підключимо
                    на наступному етапі.
                </p>

                <button
                    id="backToModeButton"
                    class="main-game-btn"
                >
                    НАЗАД
                </button>

            </div>

        </section>

    `);


    document
        .getElementById(
            "backToModeButton"
        )
        .addEventListener(
            "click",
            showModeScreen
        );

}


/* =========================================================
   16. ІМ'Я + СТАТЬ
========================================================= */

function showNameScreen() {

    gameState.phase =
        "name";


    setScreen(`

        <section class="game-screen">


            <button
                id="nameBackButton"
                class="screen-back-button"
            >
                ← Назад
            </button>


            <div class="temporary-game-card">


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
                        value="${gameState.player.name}"
                        autocomplete="off"
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
                                        gameState.player.gender === "boy"
                                        ? "selected"
                                        : ""
                                    }
                                "
                                data-gender="boy"
                            >

                                <span>👦</span>

                                <strong>
                                    Я хлопчик
                                </strong>

                            </button>


                            <button
                                class="
                                    gender-button
                                    ${
                                        gameState.player.gender === "girl"
                                        ? "selected"
                                        : ""
                                    }
                                "
                                data-gender="girl"
                            >

                                <span>👧</span>

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
                        class="form-error"
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
                        .forEach(item =>
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
            savePlayerSetup
        );


    input.addEventListener(
        "keydown",
        event => {

            if (
                event.key ===
                "Enter"
            ) {

                savePlayerSetup();

            }

        }
    );


    document
        .getElementById(
            "nameBackButton"
        )
        .addEventListener(
            "click",
            showModeScreen
        );

}


/* =========================================================
   17. ЗБЕРЕЖЕННЯ ІМЕНІ
========================================================= */

function savePlayerSetup() {

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


    if (!gameState.player.gender) {

        error.textContent =
            "Обери: хлопчик чи дівчинка 🙂";

        return;
    }


    gameState.player.name =
        name;


    showTokenSelection();

}


/* =========================================================
   18. ВИБІР ФІШКИ
========================================================= */

function showTokenSelection() {

    gameState.phase =
        "token";


    const tokensHTML =
        TOKENS
            .map(token => `

                <button
                    class="
                        token-option
                        ${
                            gameState.player.token?.id === token.id
                            ? "selected"
                            : ""
                        }
                    "
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

            `)
            .join("");


    setScreen(`

        <section class="game-screen">


            <button
                id="tokenBackButton"
                class="screen-back-button"
            >
                ← Назад
            </button>


            <div
                class="
                    temporary-game-card
                    token-selection-card
                "
            >


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

                        Саме нею ти будеш
                        рухатися життєвим шляхом.

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
                () =>
                    selectToken(
                        button.dataset.token
                    )
            );

        });


    document
        .getElementById(
            "tokenBackButton"
        )
        .addEventListener(
            "click",
            showNameScreen
        );

}


/* =========================================================
   19. ЗБЕРЕЖЕННЯ ФІШКИ
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
   20. ПРОФЕСІЙНА ІСТОРІЯ
========================================================= */

function showCareerRandomScreen() {

    gameState.phase =
        "career-random";


    const careersHTML =
        CAREER_SECTORS
            .map(sector => `

                <div class="career-random-option">

                    <span class="career-random-icon">
                        ${sector.icon}
                    </span>

                    <strong>

                        ${
                            getProfessionName(
                                sector.levels[0]
                            )
                        }

                    </strong>

                </div>

            `)
            .join("");


    setScreen(`

        <section class="game-screen">


            <button
                id="careerRandomBackButton"
                class="screen-back-button"
            >
                ← Назад
            </button>


            <div class="career-random-card">


                <h2>
                    ТВОЯ ПРОФЕСІЙНА ІСТОРІЯ
                </h2>


                <p>

                    Життя саме визначить,
                    з якої професії почнеться твій шлях.

                </p>


                <div
                    id="careerRandomBox"
                    class="career-random-box"
                >

                    <div class="career-random-dice">
                        🎲
                    </div>


                    <strong>
                        ${getReadyText()}
                    </strong>


                    <span>

                        Натисни кнопку,
                        щоб випадково отримати професію.

                    </span>

                </div>


                <button
                    id="getCareerButton"
                    class="main-game-btn"
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
            "getCareerButton"
        )
        .addEventListener(
            "click",
            assignRandomCareer
        );


    document
        .getElementById(
            "careerRandomBackButton"
        )
        .addEventListener(
            "click",
            showTokenSelection
        );

}


/* =========================================================
   21. ВИПАДКОВА ПРОФЕСІЯ
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


    const stats =
        CAREER_LEVEL_STATS[0];


    gameState.player.money =
        stats.money;

    gameState.player.reputation =
        stats.reputation;

    gameState.player.knowledge =
        stats.knowledge;

    gameState.player.energy =
        stats.energy;


    showCareerResult();

}


/* =========================================================
   22. ПОКАЗ ПРОФЕСІЇ
========================================================= */

function showCareerResult() {

    const player =
        gameState.player;


    const sector =
        player.sector;


    const profession =
        getProfessionName(
            sector.levels[0]
        );


    const box =
        document.getElementById(
            "careerRandomBox"
        );


    const oldButton =
        document.getElementById(
            "getCareerButton"
        );


    box.innerHTML = `

        <div class="career-result-reveal">

            <div class="career-result-label">
                🎉 ТВОЯ ПРОФЕСІЯ
            </div>


            <div class="career-result-icon">
                ${sector.icon}
            </div>


            <div class="career-result-profession">
                ${profession}
            </div>


            <div class="career-result-sector">
                ${sector.name}
            </div>


            <div class="career-result-text">

                Це перша сходинка
                твого професійного шляху.

            </div>

        </div>

    `;


    const newButton =
        oldButton.cloneNode(true);


    oldButton.replaceWith(
        newButton
    );


    newButton.textContent =
        "ПРОДОВЖИТИ →";


    newButton.addEventListener(
        "click",
        showCareerReveal
    );

}


/* =========================================================
   23. ЖИТТЄВИЙ ШЛЯХ
========================================================= */

function showCareerReveal() {

    gameState.phase =
        "career";


    const player =
        gameState.player;


    const sector =
        player.sector;


    const levels =
        sector.levels
            .map(
                (profession, index) => ({
                    profession,
                    index
                })
            )
            .reverse();


    const careerHTML =
        levels
            .map(item => {

                const index =
                    item.index;


                const stats =
                    CAREER_LEVEL_STATS[index];


                const profession =
                    getProfessionName(
                        item.profession
                    );


                const current =
                    index ===
                    player.careerLevel;


                return `

                    <div
                        class="
                            career-path-card
                            ${
                                current
                                ? "career-current"
                                : "career-future"
                            }
                        "
                    >

                        <div class="career-level-top">

                            <span class="career-level-number">
                                ${index + 1}
                            </span>

                            ${
                                current

                                ? `
                                    <span class="career-current-label">
                                        ТИ ТУТ
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
                            ${profession}
                        </div>


                        <div class="career-level-stats">

                            <span>
                                💰 ${formatMoney(stats.money)}
                            </span>

                            <span>
                                ⭐ ${stats.reputation}
                            </span>

                            <span>
                                🧠 ${stats.knowledge}
                            </span>

                            <span>
                                ⚡ ${stats.energy}
                            </span>

                        </div>

                    </div>

                `;

            })
            .join("");


    setScreen(`

        <section class="game-screen">


            <button
                id="careerBackButton"
                class="screen-back-button"
            >
                ← Назад
            </button>


            <div
                class="
                    temporary-game-card
                    career-screen-card
                "
            >


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

                        <br><br>

                        А кар'єра — шлях,
                        який допоможе тобі
                        до неї дістатися.

                    </div>

                </div>


                <div class="career-content">


                    <div class="career-sector-badge">

                        ${sector.icon}

                        <strong>
                            ${sector.name}
                        </strong>

                    </div>


                    <h2>
                        Ось твій життєвий шлях
                    </h2>


                    <p class="career-description">

                        Ти починаєш із першої сходинки.
                        Розвивай знання, репутацію
                        та фінансові можливості,
                        щоб підніматися вище.

                    </p>


                    <div class="career-ladder">

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
            "careerBackButton"
        )
        .addEventListener(
            "click",
            showCareerRandomScreen
        );

}


/* =========================================================
   24. ВИБІР МРІЇ — 20
========================================================= */

function showDreamSelection() {

    gameState.phase =
        "dream";


    gameState.selectedDreamId =
        gameState.player.dream?.id ||
        null;


    const dreamsHTML =
        DREAMS
            .map(dream => {

                const visual =
                    dream.image

                    ? `

                        <img
                            src="${dream.image}"
                            class="dream-card-image"
                            alt="${dream.name}"
                        >

                      `

                    : `

                        <div class="dream-icon">
                            ${dream.icon}
                        </div>

                      `;


                return `

                    <button
                        class="
                            dream-option
                            ${
                                gameState.selectedDreamId === dream.id
                                ? "selected"
                                : ""
                            }
                        "
                        data-dream="${dream.id}"
                    >

                        ${visual}

                        <div class="dream-name">
                            ${dream.name}
                        </div>

                    </button>

                `;

            })
            .join("");


    setScreen(`

        <section class="game-screen dream-scroll-screen">


            <button
                id="dreamBackButton"
                class="screen-back-button"
            >
                ← Назад
            </button>


            <div
                class="
                    temporary-game-card
                    dream-selection-card
                "
            >


                <img
                    src="assets/raifik.png"
                    class="small-game-logo"
                    alt="Райфик"
                >


                <div class="dream-selection-content">


                    <h2>
                        Обери свою Мрію ✨
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
                () =>
                    previewDream(
                        button.dataset.dream
                    )
            );

        });


    document
        .getElementById(
            "dreamBackButton"
        )
        .addEventListener(
            "click",
            showCareerReveal
        );


    if (
        gameState.selectedDreamId
    ) {

        previewDream(
            gameState.selectedDreamId,
            false
        );

    }

}


/* =========================================================
   25. ПЕРЕГЛЯД МРІЇ
========================================================= */

function previewDream(
    dreamId,
    scroll = true
) {

    const dream =
        DREAMS.find(
            item =>
                item.id === dreamId
        );


    if (!dream) {
        return;
    }


    gameState.selectedDreamId =
        dreamId;


    document
        .querySelectorAll(
            ".dream-option"
        )
        .forEach(button => {

            button.classList.toggle(
                "selected",
                button.dataset.dream ===
                dreamId
            );

        });


    const details =
        document.getElementById(
            "dreamDetails"
        );


    details.innerHTML = `

        <div class="dream-details-card">

            <h3>

                ${dream.icon}
                ${dream.name}

            </h3>


            <p>
                Для досягнення цієї Мрії потрібно:
            </p>


            <div class="dream-requirements">

                <span>
                    💰 ${formatMoney(dream.requirements.money)}
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


            <button
                id="confirmDreamButton"
                class="main-game-btn"
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
            () =>
                selectDream(
                    dreamId
                )
        );


    if (scroll) {

        details.scrollIntoView({
            behavior: "smooth",
            block: "nearest"
        });

    }

}


/* =========================================================
   26. ЗБЕРЕЖЕННЯ МРІЇ
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
   27. СТВОРЕННЯ AI
========================================================= */

function createAIPlayers() {

    gameState.opponents = [];


    const availableTokens =
        TOKENS.filter(
            token =>
                token.id !==
                gameState.player.token.id
        );


    const profiles = [

        {
            name: "Софія",
            gender: "girl"
        },

        {
            name: "Марко",
            gender: "boy"
        },

        {
            name: "Анна",
            gender: "girl"
        },

        {
            name: "Лео",
            gender: "boy"
        }

    ];


    for (
        let i = 0;
        i < GAME_CONFIG.aiPlayers;
        i++
    ) {

        const profile =
            profiles[i];


        const tokenIndex =
            randomNumber(
                0,
                availableTokens.length - 1
            );


        const token =
            availableTokens.splice(
                tokenIndex,
                1
            )[0];


        const ai = {

            id: `ai-${i + 1}`,

            name:
                profile.name,

            gender:
                profile.gender,

            token,

            sector:
                randomItem(
                    CAREER_SECTORS
                ),

            careerLevel: 0,

            dream:
                randomItem(
                    DREAMS
                ),

            money:
                GAME_CONFIG.startingStats.money,

            reputation:
                GAME_CONFIG.startingStats.reputation,

            knowledge:
                GAME_CONFIG.startingStats.knowledge,

            energy:
                GAME_CONFIG.startingStats.energy,

            board: "inner",

            position: 1

        };


        gameState.opponents.push(
            ai
        );

    }

}


/* =========================================================
   28. ЕКРАН ПЕРЕД СТАРТОМ
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

                const profession =
                    getProfessionName(

                        participant
                            .sector
                            .levels[
                                participant.careerLevel
                            ],

                        participant.gender

                    );


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
                                <span class="participant-you-label">
                                    ЦЕ ТИ
                                </span>
                              `

                            : ""
                        }


                        <img
                            src="${participant.token.image}"
                            class="participant-preview-token"
                            alt="${participant.name}"
                        >


                        <div class="participant-preview-name">
                            ${participant.name}
                        </div>


                        <div class="participant-preview-profession">

                            ${participant.sector.icon}

                            ${profession}

                        </div>


                        <div class="participant-preview-dream">

                            <span>
                                Мрія
                            </span>

                            <strong>

                                ${participant.dream.icon}

                                ${participant.dream.name}

                            </strong>

                        </div>

                    </div>

                `;

            })
            .join("");


    setScreen(`

        <section class="game-screen">


            <button
                id="beforeGameBackButton"
                class="screen-back-button"
            >
                ← Назад
            </button>


            <div class="before-game-content">


                <h2>
                    Ти не один у цій історії 😉
                </h2>


                <p>

                    Разом із тобою
                    свій шлях проходитимуть
                    ще двоє гравців.

                </p>


                <div class="participants-preview-grid">

                    ${participantsHTML}

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


    document
        .getElementById(
            "beforeGameBackButton"
        )
        .addEventListener(
            "click",
            showDreamSelection
        );

}


/* =========================================================
   29. ГОЛОВНИЙ ЕКРАН

   ЛІВА ПАНЕЛЬ:
   - велике лого
   - профіль
   - показники
   - мрія
   - типи комірок

   ЦЕНТР:
   - квадратне поле

   ПРАВА:
   - кубик
   - Райфик
   - поточна картка
   - гравці
========================================================= */
/* =========================================================
   29. БАНК — ПРОДУКТИ

   ПОКИ ЗАКЛАДАЄМО АРХІТЕКТУРУ.

   Гравець може обрати продукти,
   якими хоче користуватися у грі.

   Реальний фінансовий вплив продуктів
   підключимо окремо.
========================================================= */

const BANK_PRODUCTS = [

    {
        id: "deposit",
        icon: "💰",
        name: "Депозит",
        description:
            "Розміщуй частину коштів та отримуй додатковий дохід."
    },

    {
        id: "savings",
        icon: "🐷",
        name: "Накопичення",
        description:
            "Відкладай гроші для великих покупок та своєї Мрії."
    },

    {
        id: "credit",
        icon: "💳",
        name: "Кредит",
        description:
            "Отримуй додаткові кошти для важливих цілей."
    },

    {
        id: "insurance",
        icon: "🛡️",
        name: "Страхування",
        description:
            "Зменшуй вплив окремих непередбачених життєвих подій."
    },

    {
        id: "cashback",
        icon: "🪙",
        name: "Кешбек",
        description:
            "Повертай частину коштів після певних витрат."
    },

    {
        id: "investment",
        icon: "📈",
        name: "Інвестиції",
        description:
            "Використовуй гроші для потенційного зростання капіталу."
    },

    {
        id: "currency",
        icon: "💱",
        name: "Обмін валют",
        description:
            "Користуйся валютними операціями у відповідних ситуаціях."
    },

    {
        id: "card",
        icon: "💳",
        name: "Банківська картка",
        description:
            "Отримуй доступ до додаткових банківських можливостей."
    }

];


/* =========================================================
   30. СТАН БАНКУ ГРАВЦЯ
========================================================= */

function ensurePlayerBankState() {

    if (!gameState.player.bank) {

        gameState.player.bank = {

            products: []

        };

    }

}


/* =========================================================
   31. ГОЛОВНИЙ ІГРОВИЙ ЕКРАН

   КОМПОЗИЦІЯ:

   - великий ігровий фон
   - зовнішній маршрут 56
   - внутрішній маршрут 28
   - CV ЖИТТЯ у лівому верхньому кутку
   - нижній HUD
   - професія
   - показники
   - Мрія
   - Банк
   - панель ходу справа
========================================================= */

function showGameBoard() {

    gameState.phase =
        "game";


    gameState.currentTurn =
        "player";


    gameState.target =
        null;


    ensurePlayerBankState();


    const player =
        gameState.player;


    const profession =
        getProfessionName(

            player
                .sector
                .levels[
                    player.careerLevel
                ]

        );


    const opponentsHTML =
        gameState.opponents
            .map(ai => `

                <button
                    class="mini-opponent-button"
                    data-player-id="${ai.id}"
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


            <!-- =====================================
                 ІГРОВЕ ПОЛЕ
            ====================================== -->

            <main
                id="board"
                class="game-board rectangle-game-board"
            >


                <!-- ЗОВНІШНІЙ ШЛЯХ -->

                <div
                    id="outerBoard"
                    class="rectangle-board outer-rectangle-board"
                ></div>


                <!-- ВНУТРІШНІЙ ШЛЯХ -->

                <div
                    id="innerBoard"
                    class="rectangle-board inner-rectangle-board"
                ></div>


                <!-- CV ЖИТТЯ — ЛІВИЙ ВЕРХ -->

                <div class="board-corner-brand">

                    <img
                        src="assets/logo.png"
                        class="board-corner-logo"
                        alt="CV Життя"
                    >

                </div>


                <!-- =====================================
                     НИЖНІЙ HUD
                ====================================== -->

                <div class="player-bottom-hud">


                    <!-- ПРОФЕСІЯ -->

                    <button
                        id="careerHudButton"
                        class="player-career-hud"
                    >

                        <img
                            src="${player.token.image}"
                            class="hud-token-image"
                            alt="${player.token.name}"
                        >


                        <div class="hud-career-text">

                            <span class="hud-player-name">
                                ${player.name}
                            </span>

                            <span class="hud-player-profession">
                                ${profession}
                            </span>

                            <small>
                                Кар'єрний шлях →
                            </small>

                        </div>

                    </button>


                    <!-- ПОКАЗНИКИ -->

                    <div class="hud-player-stats">


                        <div class="hud-stat-item">

                            <span class="hud-stat-icon">
                                💰
                            </span>

                            <div>

                                <small>
                                    ГРОШІ
                                </small>

                                <strong id="moneyValue">
                                    ${formatMoney(player.money)}
                                </strong>

                            </div>

                        </div>


                        <div class="hud-stat-item">

                            <span class="hud-stat-icon">
                                ⭐
                            </span>

                            <div>

                                <small>
                                    РЕПУТАЦІЯ
                                </small>

                                <strong id="reputationValue">
                                    ${player.reputation}
                                </strong>

                            </div>

                        </div>


                        <div class="hud-stat-item">

                            <span class="hud-stat-icon">
                                🧠
                            </span>

                            <div>

                                <small>
                                    ЗНАННЯ
                                </small>

                                <strong id="knowledgeValue">
                                    ${player.knowledge}
                                </strong>

                            </div>

                        </div>


                        <div class="hud-stat-item">

                            <span class="hud-stat-icon">
                                ⚡
                            </span>

                            <div>

                                <small>
                                    ЕНЕРГІЯ
                                </small>

                                <strong id="energyValue">
                                    ${player.energy}
                                </strong>

                            </div>

                        </div>


                    </div>


                    <!-- МРІЯ -->

                    <button
                        id="dreamHudButton"
                        class="
                            hud-feature-button
                            hud-dream-button
                        "
                    >

                        <span class="hud-feature-icon">

                            ${player.dream.icon}

                        </span>


                        <div>

                            <small>
                                МОЯ МРІЯ
                            </small>

                            <strong>
                                ${player.dream.name}
                            </strong>

                        </div>

                    </button>


                    <!-- БАНК -->

                    <button
                        id="bankHudButton"
                        class="
                            hud-feature-button
                            hud-bank-button
                        "
                    >

                        <span class="hud-feature-icon">
                            🏦
                        </span>


                        <div>

                            <small>
                                БАНК
                            </small>

                            <strong>
                                Фінансові можливості
                            </strong>

                        </div>

                    </button>


                </div>


            </main>


            <!-- =====================================
                 ПРАВА РОБОЧА ПАНЕЛЬ
            ====================================== -->

            <aside class="game-work-panel">


                <div class="dice-section">


                    <div
                        id="diceTitle"
                        class="dice-title"
                    >
                        ТВІЙ ХІД
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

                        Починаємо зі START.

                        <br>

                        Кидай кубик 🎲

                    </div>


                </div>


                <!-- РАЙФИК / ПОТОЧНА КАРТКА -->

                <div
                    id="currentCardPanel"
                    class="current-card-panel"
                >

                    <div class="raifik-board-message">

                        <img
                            src="assets/raifik.png"
                            alt="Райфик"
                        >


                        <div>

                            <strong>
                                Райфик
                            </strong>

                            <p>

                                Починаємо зі START.

                                <br><br>

                                Кидай кубик
                                і починай свій шлях!

                            </p>

                        </div>

                    </div>

                </div>


                <!-- ГРАВЦІ -->

                <div class="other-players-block">

                    <h3>
                        ГРАВЦІ
                    </h3>


                    <div class="mini-opponents-list">

                        ${opponentsHTML}

                    </div>

                </div>


                <!-- ЯК ГРАТИ -->
                
<div class="work-panel-actions">

    <button
        id="cellInfoButton"
        class="work-panel-button"
    >
        <span>
            ℹ️ Типи полів
        </span>

        <span>
            →
        </span>
    </button>


    <button
        id="journalButton"
        class="work-panel-button"
    >
        <span>
            📜 Журнал ходів
        </span>

        <span id="journalCount">
            ${gameState.history ? gameState.history.length : 0}
        </span>
    </button>


    <button
        id="finishGameButton"
        class="work-panel-button finish-game-button"
    >
        <span>
            ⏹ Завершити гру
        </span>

        <span>
            →
        </span>
    </button>

</div>


            <!-- =====================================
                 МОДАЛЬНЕ ВІКНО
            ====================================== -->

            <div
                id="gameInfoModal"
                class="game-info-modal"
                hidden
            >

                <div class="game-info-modal-card">

                    <button
                        id="gameInfoClose"
                        class="game-info-close"
                    >
                        ×
                    </button>


                    <div id="gameInfoContent"></div>

                </div>

            </div>


        </section>

    `);


    /* ================================================
       СТВОРЮЄМО ПОЛЕ
    ================================================= */

    createBoard();


    placeAllPieces();


    updatePlayerStatsUI();


    /* ================================================
       КУБИК
    ================================================= */

    document
        .getElementById(
            "rollDiceButton"
        )
        .addEventListener(
            "click",
            rollDice
        );


    /* ================================================
       ПРОФЕСІЯ
    ================================================= */

    document
        .getElementById(
            "careerHudButton"
        )
        .addEventListener(
            "click",
            showCareerProgressModal
        );


    /* ================================================
       МРІЯ
    ================================================= */

    document
        .getElementById(
            "dreamHudButton"
        )
        .addEventListener(
            "click",
            showDreamProgress
        );


    /* ================================================
       БАНК
    ================================================= */

    document
        .getElementById(
            "bankHudButton"
        )
        .addEventListener(
            "click",
            showBankHub
        );


    /* ================================================
       AI
    ================================================= */

    document
        .querySelectorAll(
            ".mini-opponent-button"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    showParticipantInfo(
                        button.dataset.playerId
                    );

                }
            );

        });


    /* ================================================
       ТИПИ ПОЛІВ
    ================================================= */

    document
        .getElementById(
            "cellInfoButton"
        )
        .addEventListener(
            "click",
            showAllCellTypes
        );


    /* ================================================
       CLOSE MODAL
    ================================================= */

    document
        .getElementById(
            "gameInfoClose"
        )
        .addEventListener(
            "click",
            closeGameInfoModal
        );


    showRaifikCurrentCardMessage(

        "Починаємо зі START. Кидай кубик 🎲"

    );

}


/* =========================================================
   32. СТВОРЕННЯ ПОЛЯ
========================================================= */

function createBoard() {

    createRectangleBoard(

        document.getElementById(
            "outerBoard"
        ),

        OUTER_BOARD,

        "outer"

    );


    createRectangleBoard(

        document.getElementById(
            "innerBoard"
        ),

        INNER_BOARD,

        "inner"

    );

}


/* =========================================================
   32.1 КООРДИНАТИ ПРЯМОКУТНОГО МАРШРУТУ

   ОБИДВА МАРШРУТИ СТАРТУЮТЬ
   З ВЕРХНЬОЇ ЧАСТИНИ.

   INNER — за годинниковою
   OUTER — проти годинникової
========================================================= */

function getRectanglePosition(
    index,
    amount,
    direction = "clockwise"
) {

    let normalized =
        index /
        amount;


    if (
        direction ===
        "counterclockwise"
    ) {

        normalized =
            1 - normalized;

    }


    const width =
        1.72;


    const height =
        1;


    const perimeter =
        width * 2 +
        height * 2;


    /*
       Початок маршруту —
       середина верхньої сторони.
    */

    let distance =
        normalized *
        perimeter +
        width / 2;


    while (
        distance >=
        perimeter
    ) {

        distance -=
            perimeter;

    }


    let x = 0;
    let y = 0;


    if (
        distance <=
        width
    ) {

        /*
           ВЕРХ
        */

        x =
            (
                distance /
                width
            ) *
            100;

        y =
            0;

    }


    else if (
        distance <=
        width +
        height
    ) {

        /*
           ПРАВА СТОРОНА
        */

        x =
            100;

        y =
            (
                (
                    distance -
                    width
                ) /
                height
            ) *
            100;

    }


    else if (
        distance <=
        width * 2 +
        height
    ) {

        /*
           НИЗ
        */

        x =
            100 -
            (
                (
                    distance -
                    width -
                    height
                ) /
                width
            ) *
            100;

        y =
            100;

    }


    else {

        /*
           ЛІВА СТОРОНА
        */

        x =
            0;

        y =
            100 -
            (
                (
                    distance -
                    width * 2 -
                    height
                ) /
                height
            ) *
            100;

    }


    return {
        x,
        y
    };

}


/* =========================================================
   32.2 СТВОРЕННЯ ОДНОГО МАРШРУТУ
========================================================= */

function createRectangleBoard(
    container,
    boardData,
    boardName
) {

    if (!container) {
        return;
    }


    const amount =
        boardData.length;


    const direction =
        boardName ===
        "inner"

        ? "clockwise"

        : "counterclockwise";


    for (
        let i = 1;
        i <= amount;
        i++
    ) {

        const typeId =
            boardData[
                i - 1
            ];


        const type =
            CELL_TYPES[
                typeId
            ];


        const cell =
            document.createElement(
                "div"
            );


        const isStart =
            boardName === "inner" &&
            i === 1;


        cell.className =
            `board-cell ${boardName}-cell`;


        cell.dataset.board =
            boardName;


        cell.dataset.position =
            i;


        cell.dataset.type =
            typeId;


        /* ================================================
           START
        ================================================= */

        if (isStart) {

            cell.classList.add(
                "start-board-cell"
            );

        }


        /* ================================================
           СПЕЦІАЛЬНІ ПОЛЯ
        ================================================= */

        if (
            [
                "income",
                "lounge",
                "academy",
                "transition",
                "dreamCheck"
            ].includes(
                typeId
            )
        ) {

            cell.classList.add(
                "special-board-cell"
            );

        }


        if (
            typeId ===
            "transition"
        ) {

            cell.classList.add(
                "transition-board-cell"
            );

        }


        const coordinates =
            getRectanglePosition(

                i - 1,

                amount,

                direction

            );


        cell.style.left =
            `${coordinates.x}%`;


        cell.style.top =
            `${coordinates.y}%`;


        cell.innerHTML = `

            <span class="cell-number">
                ${i}
            </span>


            <span class="cell-icon">
                ${type.icon}
            </span>


            ${
                isStart

                ? `
                    <span class="cell-special-label">
                        START
                    </span>
                  `

                : ""
            }


            ${
                typeId ===
                "transition"

                ? `
                    <span class="cell-special-label">
                        ПЕРЕХІД
                    </span>
                  `

                : ""
            }

        `;


        cell.addEventListener(
            "click",
            () => {

                handleBoardCellClick(
                    cell
                );

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
   32.3 БАНК — ГОЛОВНЕ МОДАЛЬНЕ ВІКНО
========================================================= */

function showBankHub() {

    ensurePlayerBankState();


    const selectedProducts =
        gameState.player.bank.products;


    const productsHTML =
        BANK_PRODUCTS
            .map(product => {

                const selected =
                    selectedProducts.includes(
                        product.id
                    );


                return `

                    <button
                        class="
                            bank-product-card
                            ${
                                selected
                                ? "bank-product-selected"
                                : ""
                            }
                        "
                        data-bank-product="${product.id}"
                    >

                        <span class="bank-product-icon">
                            ${product.icon}
                        </span>


                        <div class="bank-product-text">

                            <strong>
                                ${product.name}
                            </strong>

                            <small>
                                ${product.description}
                            </small>

                        </div>


                        <span class="bank-product-status">

                            ${
                                selected
                                ? "✓ ВИКОРИСТОВУЄТЬСЯ"
                                : "+ ДОДАТИ"
                            }

                        </span>

                    </button>

                `;

            })
            .join("");


    openGameInfoModal(`

        <div class="bank-hub-popup">


            <div class="bank-hub-header">

                <div class="bank-hub-main-icon">
                    🏦
                </div>


                <div>

                    <span class="bank-hub-label">
                        CV ЖИТТЯ
                    </span>

                    <h2>
                        БАНК
                    </h2>

                </div>

            </div>


            <p class="bank-hub-description">

                Обирай банківські продукти,
                якими хочеш користуватися
                протягом гри.

            </p>


            <div class="bank-products-grid">

                ${productsHTML}

            </div>


            <div class="bank-hub-note">

                💡 Зараз ми формуємо набір продуктів.

                Пізніше кожному продукту
                підключимо власну фінансову механіку
                та вплив на гру.

            </div>

        </div>

    `);


    document
        .querySelectorAll(
            ".bank-product-card"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    toggleBankProduct(
                        button.dataset.bankProduct
                    );

                }
            );

        });

}


/* =========================================================
   32.4 ДОДАТИ / ПРИБРАТИ ПРОДУКТ
========================================================= */

function toggleBankProduct(
    productId
) {

    ensurePlayerBankState();


    const products =
        gameState.player.bank.products;


    const index =
        products.indexOf(
            productId
        );


    if (
        index === -1
    ) {

        products.push(
            productId
        );

    }

    else {

        products.splice(
            index,
            1
        );

    }


    showBankHub();

}


/* =========================================================
   32.5 КАР'ЄРНИЙ ПРОГРЕС У МОДАЛЦІ
========================================================= */

function showCareerProgressModal() {

    const player =
        gameState.player;


    const currentProfession =
        getProfessionName(

            player
                .sector
                .levels[
                    player.careerLevel
                ]

        );


    const nextLevel =
        player.careerLevel + 1;


    let nextHTML = `

        <div class="career-max-level">
            🏆 Ти вже на найвищій кар'єрній сходинці.
        </div>

    `;


    if (
        nextLevel <
        player.sector.levels.length
    ) {

        const nextProfession =
            getProfessionName(

                player
                    .sector
                    .levels[
                        nextLevel
                    ]

            );


        const required =
            CAREER_LEVEL_STATS[
                nextLevel
            ];


        nextHTML = `

            <div class="next-career-level">

                <span>
                    НАСТУПНА СХОДИНКА
                </span>

                <strong>
                    ${nextProfession}
                </strong>

            </div>


            <div class="participant-popup-stats">

                <span>
                    💰 ${formatMoney(required.money)}
                </span>

                <span>
                    ⭐ ${required.reputation}
                </span>

                <span>
                    🧠 ${required.knowledge}
                </span>

                <span>
                    ⚡ ${required.energy}
                </span>

            </div>

        `;

    }


    openGameInfoModal(`

        <div class="career-progress-popup">


            <div class="career-popup-profile">

                <img
                    src="${player.token.image}"
                    class="career-popup-token"
                    alt="${player.name}"
                >


                <div>

                    <h2>
                        ${player.name}
                    </h2>

                    <p>
                        ${player.sector.icon}
                        ${currentProfession}
                    </p>

                </div>

            </div>


            ${nextHTML}


            <p class="progress-help-text">

                Розвивай фінанси,
                репутацію,
                знання та енергію,
                щоб рухатися кар'єрним шляхом.

            </p>


        </div>

    `);

}


/* =========================================================
   32.6 УСІ ТИПИ ПОЛІВ
========================================================= */

function showAllCellTypes() {

    const types = [

        CELL_TYPES.income,
        CELL_TYPES.bank,
        CELL_TYPES.event,
        CELL_TYPES.life,
        CELL_TYPES.fate,
        CELL_TYPES.lounge,
        CELL_TYPES.academy,
        CELL_TYPES.transition,
        CELL_TYPES.dreamCheck

    ];


    const rows =
        types
            .map(type => `

                <div class="all-cell-type-row">

                    <span>
                        ${type.icon}
                    </span>

                    <div>

                        <strong>
                            ${type.name}
                        </strong>

                        <small>
                            ${type.description}
                        </small>

                    </div>

                </div>

            `)
            .join("");


    openGameInfoModal(`

        <div class="all-cell-types-popup">

            <h2>
                Поля гри
            </h2>

            <p>
                Кожен тип поля запускає
                окрему життєву або фінансову ситуацію.
            </p>

            <div class="all-cell-types-list">
                ${rows}
            </div>

        </div>

    `);

}


/* =========================================================
   33. КЛІК ПО КОМІРЦІ
========================================================= */

function handleBoardCellClick(cell) {

    const board =
        cell.dataset.board;


    const position =
        Number(
            cell.dataset.position
        );


    if (
        gameState.target &&
        gameState.target.board === board &&
        gameState.target.position === position
    ) {

        tryMovePlayerToCell(
            cell
        );

        return;
    }


    showCellTypeInfo(
        cell.dataset.type
    );

}


/* =========================================================
   34. ФІШКИ
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
   35. РОЗМІЩЕННЯ ОДНІЄЇ ФІШКИ
========================================================= */

function placePiece(
    participant,
    draggable
) {

    const cell =
        document.querySelector(

            `.${participant.board}-cell[data-position="${participant.position}"]`

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


    piece.alt =
        participant.name;


    piece.dataset.playerId =
        participant.id;


    piece.className =
        participant.id ===
        "player"

        ? "board-piece player-piece"

        : "board-piece ai-piece";


    if (draggable) {

        piece.draggable =
            true;


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


    cell.appendChild(
        piece
    );

}


/* =========================================================
   36. КУБИК
========================================================= */

const DICE_FACES = [

    "⚀",
    "⚁",
    "⚂",
    "⚃",
    "⚄",
    "⚅"

];


async function rollDice() {

    if (
        gameState.currentTurn !==
        "player"
    ) {
        return;
    }


    if (
        gameState.target
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


    button.disabled =
        true;


    showRaifikCurrentCardMessage(

        "Кидаємо кубик... 🎲"

    );


    for (
        let i = 0;
        i < 10;
        i++
    ) {

        dice.textContent =
            randomItem(
                DICE_FACES
            );


        await delay(70);

    }


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


    document
        .getElementById(
            "diceMessage"
        )
        .innerHTML = `

            Випало
            <strong>${value}</strong>.

            <br>

            Перенеси фішку
            на підсвічену комірку.

        `;


    showRaifikCurrentCardMessage(

        `Випало ${value}! Натисни на підсвічену комірку або перенеси туди свою фішку.`

    );

}


/* =========================================================
   37. РОЗРАХУНОК ПРИЗНАЧЕННЯ
========================================================= */

function calculateDestination(
    participant,
    steps
) {

    /*
       ВНУТРІШНЄ ПОЛЕ
    */

    if (
        participant.board ===
        "inner"
    ) {

        const rawTarget =
            participant.position +
            steps;


        /*
           ЩЕ НЕ ДОЙШЛИ ДО 28
        */

        if (
            rawTarget <
            GAME_CONFIG.innerCells
        ) {

            return {
                board: "inner",
                position: rawTarget
            };

        }


        /*
           ТОЧНО НА 28
        */

        if (
            rawTarget ===
            GAME_CONFIG.innerCells
        ) {

            return {
                board: "inner",
                position:
                    GAME_CONFIG.innerCells
            };

        }


        /*
           ПЕРЕЙШЛИ ЧЕРЕЗ 28

           Наприклад:
           стоїмо 27,
           випало 4.

           28 = останній крок внутрішнього,
           решта 3 → зовнішнє.
        */

        const overflow =
            rawTarget -
            GAME_CONFIG.innerCells;


        return {
            board: "outer",
            position:
                Math.max(
                    1,
                    overflow
                )
        };

    }


    /*
       ЗОВНІШНЄ ПОЛЕ
    */

    let target =
        participant.position +
        steps;


    while (
        target >
        GAME_CONFIG.outerCells
    ) {

        target -=
            GAME_CONFIG.outerCells;

    }


    return {
        board: "outer",
        position: target
    };

}


/* =========================================================
   38. ПІДСВІЧЕННЯ ЦІЛІ
========================================================= */

function calculateTargetCell(
    steps
) {

    clearTargetCells();


    const destination =
        calculateDestination(
            gameState.player,
            steps
        );


    gameState.target =
        destination;


    const cell =
        document.querySelector(

            `.${destination.board}-cell[data-position="${destination.position}"]`

        );


    if (cell) {

        cell.classList.add(
            "target-cell"
        );

    }

}


/* =========================================================
   39. РУХ ГРАВЦЯ
========================================================= */

async function tryMovePlayerToCell(
    cell
) {

    if (
        !gameState.target
    ) {
        return;
    }


    const board =
        cell.dataset.board;


    const position =
        Number(
            cell.dataset.position
        );


    if (
        board !==
        gameState.target.board ||
        position !==
        gameState.target.position
    ) {
        return;
    }


    const player =
        gameState.player;


    player.board =
        board;


    player.position =
        position;


    movePieceDOM(
        player.id,
        cell
    );


    clearTargetCells();


    gameState.target =
        null;


    addLog(

        `${player.name} → ${board === "inner" ? "внутрішнє" : "зовнішнє"} поле, комірка ${position}`

    );


    /*
       ПОТРАПИЛИ НА 28.
    */

    if (
        board === "inner" &&
        position ===
        GAME_CONFIG.innerCells
    ) {

        await handleInnerToOuterTransition(
            player
        );

        return;

    }


    await resolvePlayerCell();

}


/* =========================================================
   40. ПЕРЕХІД ВНУТРІШНЄ → ЗОВНІШНЄ
========================================================= */

async function handleInnerToOuterTransition(
    participant
) {

    showRaifikCurrentCardMessage(

        "🎉 Перший етап пройдено! Тепер переходимо на великий життєвий шлях."

    );


    await delay(1400);


    participant.board =
        "outer";


    participant.position =
        1;


    const cell =
        document.querySelector(
            `.outer-cell[data-position="1"]`
        );


    if (cell) {

        movePieceDOM(
            participant.id,
            cell
        );

    }


    addLog(

        `${participant.name} переходить на зовнішнє поле.`

    );


    await resolvePlayerCell();

}


/* =========================================================
   41. DOM РУХ ФІШКИ
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
   42. ТИП ПОТОЧНОЇ КОМІРКИ
========================================================= */

function getParticipantCellType(
    participant
) {

    const board =
        participant.board ===
        "inner"

        ? INNER_BOARD

        : OUTER_BOARD;


    return board[
        participant.position - 1
    ];

}


/* =========================================================
   43. ОБРОБКА КОМІРКИ ГРАВЦЯ
========================================================= */

async function resolvePlayerCell() {

    const player =
        gameState.player;


    const typeId =
        getParticipantCellType(
            player
        );


    const type =
        CELL_TYPES[
            typeId
        ];


    showRaifikCurrentCardMessage(

        `${type.icon} Ти потрапив на «${type.name}».`

    );


    switch (typeId) {

        case "income":

            applyEffects(
                player,
                {
                    money:
                        GAME_CONFIG.incomeAmount
                }
            );


            showResultCard(
                type,
                "Отримання доходу",
                "Ти отримуєш свій дохід.",
                {
                    money:
                        GAME_CONFIG.incomeAmount
                }
            );


            await delay(1600);

            startAITurns();

            break;


        case "event":

            showThreeCardChoice(
                "event"
            );

            break;


        case "bank":

            showThreeCardChoice(
                "bank"
            );

            break;


        case "life":

            showLifeNumberChoice();

            break;


        case "fate":

            await showRandomFateCard();

            break;


        case "lounge":

            applyEffects(
                player,
                {
                    energy: 15
                }
            );


            showResultCard(
                type,
                "Lounge & Хобі",
                "Ти відпочив і відновив свої сили.",
                {
                    energy: 15
                }
            );


            await delay(1600);

            startAITurns();

            break;


        case "academy":

            applyEffects(
                player,
                {
                    knowledge: 15,
                    reputation: 5
                }
            );


            showResultCard(
                type,
                "Академія & Soft Skills",
                "Нові знання допомагають тобі рухатися вперед.",
                {
                    knowledge: 15,
                    reputation: 5
                }
            );


            await delay(1600);

            startAITurns();

            break;


        case "dreamCheck":

            showDreamProgress();


            setTimeout(
                startAITurns,
                1800
            );

            break;


        default:

            startAITurns();

    }

}


/* =========================================================
   44. РАЙФИК СПРАВА
========================================================= */

function showRaifikCurrentCardMessage(
    text
) {

    const panel =
        document.getElementById(
            "currentCardPanel"
        );


    if (!panel) {
        return;
    }


    panel.innerHTML = `

        <div class="raifik-board-message">

            <img
                src="assets/raifik.png"
                alt="Райфик"
            >


            <div>

                <strong>
                    Райфик
                </strong>

                <p>
                    ${text}
                </p>

            </div>

        </div>

    `;

}


/* =========================================================
   45. ПОДІЯ / БАНК — 3 КАРТКИ
========================================================= */

function showThreeCardChoice(
    deckName
) {

    const panel =
        document.getElementById(
            "currentCardPanel"
        );


    const deck =
        CARD_DECKS[
            deckName
        ];


    const choices =
        [...deck]
            .sort(
                () =>
                    Math.random() -
                    0.5
            )
            .slice(
                0,
                3
            );


    const type =
        CELL_TYPES[
            deckName
        ];


    panel.innerHTML = `

        <div class="current-card-choice">


            <div class="current-card-raifik-line">

                <img
                    src="assets/raifik.png"
                    alt="Райфик"
                >


                <div>

                    <strong>

                        ${type.icon}
                        ${type.name}

                    </strong>

                    <p>
                        Обери одну з трьох карток.
                    </p>

                </div>

            </div>


            <div class="three-card-choice">

                ${
                    choices
                        .map(
                            (card, index) => `

                                <button
                                    class="hidden-game-card"
                                    data-choice="${index}"
                                >
                                    ?
                                </button>

                            `
                        )
                        .join("")
                }

            </div>

        </div>

    `;


    document
        .querySelectorAll(
            ".hidden-game-card"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const card =
                        choices[
                            Number(
                                button.dataset.choice
                            )
                        ];


                    resolveChosenPlayerCard(
                        deckName,
                        card
                    );

                }
            );

        });

}


/* =========================================================
   46. ЖИТТЯ — ЧИСЛО 1–20
========================================================= */

function showLifeNumberChoice() {

    const panel =
        document.getElementById(
            "currentCardPanel"
        );


    panel.innerHTML = `

        <div class="life-number-card">


            <div class="current-card-raifik-line">

                <img
                    src="assets/raifik.png"
                    alt="Райфик"
                >


                <div>

                    <strong>
                        ❤️ ЖИТТЯ
                    </strong>

                    <p>
                        Загадай число від 1 до 20.
                    </p>

                </div>

            </div>


            <input
                id="lifeNumberInput"
                type="number"
                min="1"
                max="20"
                placeholder="1–20"
            >


            <button
                id="lifeNumberButton"
                class="main-game-btn"
            >
                ВІДКРИТИ КАРТКУ
            </button>


            <div
                id="lifeNumberError"
                class="form-error"
            ></div>

        </div>

    `;


    document
        .getElementById(
            "lifeNumberButton"
        )
        .addEventListener(
            "click",
            resolveLifeNumber
        );

}


/* =========================================================
   47. РЕЗУЛЬТАТ ЧИСЛА
========================================================= */

function resolveLifeNumber() {

    const value =
        Number(
            document
                .getElementById(
                    "lifeNumberInput"
                )
                .value
        );


    if (
        value < 1 ||
        value > 20
    ) {

        document
            .getElementById(
                "lifeNumberError"
            )
            .textContent =
            "Введи число від 1 до 20 🙂";

        return;
    }


    const deck =
        CARD_DECKS.life;


    const index =
        (value - 1) %
        deck.length;


    resolveChosenPlayerCard(
        "life",
        deck[index]
    );

}


/* =========================================================
   48. ДОЛЯ
========================================================= */

async function showRandomFateCard() {

    showRaifikCurrentCardMessage(

        "⚡ Доля вирішить сама... Відкриваємо випадкову картку."

    );


    await delay(1200);


    const card =
        randomItem(
            CARD_DECKS.fate
        );


    resolveChosenPlayerCard(
        "fate",
        card
    );

}


/* =========================================================
   49. ОБРАНА КАРТКА
========================================================= */

function resolveChosenPlayerCard(
    deckName,
    card
) {

    applyEffects(
        gameState.player,
        card.effects
    );


    showResultCard(
        CELL_TYPES[
            deckName
        ],
        card.title,
        card.text,
        card.effects
    );


    addLog(

        `${gameState.player.name}: ${card.title}`

    );


    setTimeout(
        startAITurns,
        2100
    );

}


/* =========================================================
   50. ЕФЕКТИ
========================================================= */

function applyEffects(
    participant,
    effects
) {

    Object
        .entries(
            effects
        )
        .forEach(
            ([key, value]) => {

                if (
                    typeof participant[key] ===
                    "number"
                ) {

                    participant[key] +=
                        value;

                }

            }
        );


    participant.energy =
        Math.max(
            0,
            participant.energy
        );


    participant.reputation =
        Math.max(
            0,
            participant.reputation
        );


    participant.knowledge =
        Math.max(
            0,
            participant.knowledge
        );


    if (
        participant.id ===
        "player"
    ) {

        updatePlayerStatsUI();

        checkCareerProgress(
            participant
        );

    }

}


/* =========================================================
   51. ЕФЕКТИ — HTML
========================================================= */

function effectsHTML(
    effects
) {

    const icons = {

        money: "💰",
        reputation: "⭐",
        knowledge: "🧠",
        energy: "⚡"

    };


    return Object
        .entries(
            effects
        )
        .map(
            ([key, value]) => `

                <span>

                    ${icons[key]}

                    ${
                        value > 0
                        ? "+"
                        : ""
                    }

                    ${formatMoney(value)}

                </span>

            `
        )
        .join("");

}


/* =========================================================
   52. ВІДКРИТА КАРТКА
========================================================= */

function showResultCard(
    type,
    title,
    text,
    effects
) {

    const panel =
        document.getElementById(
            "currentCardPanel"
        );


    if (!panel) {
        return;
    }


    panel.innerHTML = `

        <div class="revealed-current-card">


            <div class="revealed-card-type">

                ${type.icon}
                ${type.name}

            </div>


            <h3>
                ${title}
            </h3>


            <p>
                ${text}
            </p>


            <div class="revealed-card-effects">

                ${effectsHTML(effects)}

            </div>

        </div>

    `;

}


/* =========================================================
   53. ПОКАЗНИКИ
========================================================= */

function updatePlayerStatsUI() {

    const player =
        gameState.player;


    const fields = {

        moneyValue:
            formatMoney(
                player.money
            ),

        reputationValue:
            player.reputation,

        knowledgeValue:
            player.knowledge,

        energyValue:
            player.energy

    };


    Object
        .entries(fields)
        .forEach(
            ([id, value]) => {

                const element =
                    document.getElementById(
                        id
                    );


                if (element) {

                    element.textContent =
                        value;

                }

            }
        );

}


/* =========================================================
   54. КАР'ЄРНЕ ЗРОСТАННЯ
========================================================= */

function checkCareerProgress(
    participant
) {

    if (
        participant.careerLevel >=
        CAREER_LEVEL_STATS.length - 1
    ) {
        return;
    }


    const nextIndex =
        participant.careerLevel + 1;


    const required =
        CAREER_LEVEL_STATS[
            nextIndex
        ];


    const ready =

        participant.money >=
            required.money &&

        participant.reputation >=
            required.reputation &&

        participant.knowledge >=
            required.knowledge &&

        participant.energy >=
            required.energy;


    if (!ready) {
        return;
    }


    participant.careerLevel =
        nextIndex;


    const profession =
        getProfessionName(

            participant
                .sector
                .levels[
                    nextIndex
                ],

            participant.gender

        );


    addLog(

        `🎉 Кар'єрне зростання: ${profession}`

    );


    showRaifikCurrentCardMessage(

        `🎉 Вітаю! Нова кар'єрна сходинка: ${profession}!`

    );

}


/* =========================================================
   55. AI — ПОЧАТОК
========================================================= */

async function startAITurns() {

    if (
        gameState.currentTurn ===
        "ai"
    ) {
        return;
    }


    gameState.currentTurn =
        "ai";


    const button =
        document.getElementById(
            "rollDiceButton"
        );


    if (button) {
        button.disabled = true;
    }


    for (
        const ai of
        gameState.opponents
    ) {

        await runAITurn(
            ai
        );

    }


    gameState.currentTurn =
        "player";


    if (button) {
        button.disabled = false;
    }


    const title =
        document.getElementById(
            "diceTitle"
        );


    if (title) {

        title.textContent =
            "Твій хід";

    }


    const message =
        document.getElementById(
            "diceMessage"
        );


    if (message) {

        message.innerHTML = `

            Твій хід!

            <br>

            Кидай кубик 🎲

        `;

    }


    showRaifikCurrentCardMessage(

        `${gameState.player.name}, тепер твій хід. Кидай кубик 🎲`

    );

}


/* =========================================================
   56. ХІД AI
========================================================= */

async function runAITurn(
    ai
) {

    const title =
        document.getElementById(
            "diceTitle"
        );


    const diceElement =
        document.getElementById(
            "dice"
        );


    if (title) {

        title.textContent =
            `Хід: ${ai.name}`;

    }


    showRaifikCurrentCardMessage(

        `Зараз ходить ${ai.name}. Подивимось, що випаде 🙂`

    );


    await delay(
        GAME_CONFIG.aiThinkDelay
    );


    for (
        let i = 0;
        i < 7;
        i++
    ) {

        if (diceElement) {

            diceElement.textContent =
                randomItem(
                    DICE_FACES
                );

        }


        await delay(90);

    }


    const dice =
        randomNumber(
            1,
            6
        );


    if (diceElement) {

        diceElement.textContent =
            DICE_FACES[
                dice - 1
            ];

    }


    addLog(

        `${ai.name} 🎲 ${dice}`

    );


    await moveAIStepByStep(
        ai,
        dice
    );


    await resolveAICell(
        ai
    );


    await delay(
        GAME_CONFIG.aiResultDelay
    );

}


/* =========================================================
   57. AI РУХАЄТЬСЯ ПО КЛІТИНКАХ
========================================================= */

async function moveAIStepByStep(
    ai,
    steps
) {

    for (
        let step = 0;
        step < steps;
        step++
    ) {

        /*
           ВНУТРІШНЄ ПОЛЕ
        */

        if (
            ai.board ===
            "inner"
        ) {

            if (
                ai.position <
                GAME_CONFIG.innerCells
            ) {

                ai.position++;

            }

            else {

                ai.board =
                    "outer";

                ai.position =
                    1;

            }

        }


        /*
           ЗОВНІШНЄ
        */

        else {

            ai.position++;


            if (
                ai.position >
                GAME_CONFIG.outerCells
            ) {

                ai.position =
                    1;

            }

        }


        const cell =
            document.querySelector(

                `.${ai.board}-cell[data-position="${ai.position}"]`

            );


        if (cell) {

            movePieceDOM(
                ai.id,
                cell
            );

        }


        await delay(
            GAME_CONFIG.aiStepDelay
        );

    }


    /*
       Якщо AI закінчив рівно на 28.
    */

    if (
        ai.board ===
        "inner" &&
        ai.position ===
        GAME_CONFIG.innerCells
    ) {

        showRaifikCurrentCardMessage(

            `${ai.name} завершує внутрішній шлях і переходить на зовнішній.`

        );


        await delay(700);


        ai.board =
            "outer";


        ai.position =
            1;


        const cell =
            document.querySelector(
                `.outer-cell[data-position="1"]`
            );


        if (cell) {

            movePieceDOM(
                ai.id,
                cell
            );

        }

    }

}


/* =========================================================
   58. AI — КОМІРКА
========================================================= */

async function resolveAICell(
    ai
) {

    const typeId =
        getParticipantCellType(
            ai
        );


    const type =
        CELL_TYPES[
            typeId
        ];


    showRaifikCurrentCardMessage(

        `${ai.name} потрапив(ла) на ${type.icon} «${type.name}».`

    );


    await delay(800);


    switch (typeId) {

        case "income":

            applyEffects(
                ai,
                {
                    money:
                        GAME_CONFIG.incomeAmount
                }
            );


            showAIResult(
                ai,
                "Отримання доходу",
                {
                    money:
                        GAME_CONFIG.incomeAmount
                }
            );

            break;


        case "event":

        case "bank":

        case "life":

        case "fate": {

            const card =
                randomItem(
                    CARD_DECKS[
                        typeId
                    ]
                );


            applyEffects(
                ai,
                card.effects
            );


            showAIResult(
                ai,
                card.title,
                card.effects
            );


            break;

        }


        case "lounge":

            applyEffects(
                ai,
                {
                    energy: 15
                }
            );


            showAIResult(
                ai,
                "Lounge & Хобі",
                {
                    energy: 15
                }
            );

            break;


        case "academy":

            applyEffects(
                ai,
                {
                    knowledge: 15,
                    reputation: 5
                }
            );


            showAIResult(
                ai,
                "Академія & Soft Skills",
                {
                    knowledge: 15,
                    reputation: 5
                }
            );

            break;


        case "dreamCheck":

            showAIResult(
                ai,
                "Перевірка Мрії",
                {}
            );

            break;

    }


    addLog(

        `${ai.name}: ${type.name}, клітинка ${ai.position}`

    );

}


/* =========================================================
   59. AI — РЕЗУЛЬТАТ
========================================================= */

function showAIResult(
    ai,
    title,
    effects
) {

    const panel =
        document.getElementById(
            "currentCardPanel"
        );


    if (!panel) {
        return;
    }


    panel.innerHTML = `

        <div class="ai-turn-result">

            <img
                src="${ai.token.image}"
                alt="${ai.name}"
            >


            <div>

                <strong>
                    ${ai.name}
                </strong>


                <h4>
                    ${title}
                </h4>


                ${
                    Object.keys(
                        effects
                    ).length

                    ? `

                        <div class="revealed-card-effects">

                            ${effectsHTML(effects)}

                        </div>

                      `

                    : ""
                }

            </div>

        </div>

    `;

}


/* =========================================================
   60. ІНФО ПРО ТИП КОМІРКИ
========================================================= */

function showCellTypeInfo(
    typeId
) {

    const type =
        CELL_TYPES[
            typeId
        ];


    if (!type) {
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
   61. ІНФО ПРО СУПЕРНИКА
========================================================= */

function showParticipantInfo(
    participantId
) {

    const participant =
        gameState.opponents.find(
            item =>
                item.id ===
                participantId
        );


    if (!participant) {
        return;
    }


    const profession =
        getProfessionName(

            participant
                .sector
                .levels[
                    participant.careerLevel
                ],

            participant.gender

        );


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

                ${profession}

            </p>


            <div class="participant-popup-stats">

                <span>
                    💰 ${formatMoney(participant.money)}
                </span>

                <span>
                    ⭐ ${participant.reputation}
                </span>

                <span>
                    🧠 ${participant.knowledge}
                </span>

                <span>
                    ⚡ ${participant.energy}
                </span>

            </div>


            <div class="participant-popup-dream">

                ✨ Мрія:

                <strong>
                    ${participant.dream.name}
                </strong>

            </div>


            <div class="participant-popup-position">

                ${
                    participant.board === "inner"
                    ? "Внутрішнє поле"
                    : "Зовнішнє поле"
                }

                · клітинка

                ${participant.position}

            </div>

        </div>

    `);

}


/* =========================================================
   62. ПРОГРЕС МРІЇ
========================================================= */

function showDreamProgress() {

    const player =
        gameState.player;


    const dream =
        player.dream;


    if (!dream) {
        return;
    }


    const req =
        dream.requirements;


    openGameInfoModal(`

        <div class="dream-progress-popup">


            <div class="dream-confirmed-icon">
                ${dream.icon}
            </div>


            <h3>
                ${dream.name}
            </h3>


            <p>
                Твій поточний прогрес:
            </p>


            ${createDreamProgressRow(
                "💰",
                "Гроші",
                player.money,
                req.money
            )}


            ${createDreamProgressRow(
                "⭐",
                "Репутація",
                player.reputation,
                req.reputation
            )}


            ${createDreamProgressRow(
                "🧠",
                "Знання",
                player.knowledge,
                req.knowledge
            )}


            ${createDreamProgressRow(
                "⚡",
                "Енергія",
                player.energy,
                req.energy
            )}

        </div>

    `);

}


/* =========================================================
   63. ПРОГРЕС-БАР
========================================================= */

function createDreamProgressRow(
    icon,
    label,
    current,
    required
) {

    const percent =
        Math.min(
            100,
            Math.round(
                current /
                required *
                100
            )
        );


    return `

        <div class="dream-progress-row">

            <div class="dream-progress-title">

                <span>

                    ${icon}
                    ${label}

                </span>


                <strong>

                    ${formatMoney(current)}
                    /
                    ${formatMoney(required)}

                </strong>

            </div>


            <div class="dream-progress-bar">

                <div
                    class="dream-progress-fill"
                    style="width:${percent}%"
                ></div>

            </div>

        </div>

    `;

}


/* =========================================================
   64. МОДАЛКА
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
            "gameInfoContent"
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


    if (modal) {

        modal.hidden =
            true;

    }

}


/* =========================================================
   65. ОЧИЩЕННЯ ПІДСВІЧЕННЯ
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
   66. ЖУРНАЛ
========================================================= */

function addLog(
    text
) {

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
   67. ЗАПУСК
========================================================= */

showStartScreen();



