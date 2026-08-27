/* =========================================================
   CV ЖИТТЯ
   ФІНАНСОВА ГРА

   SCRIPT.JS
   ЧАСТИНА 1 / 3

   БАЗОВІ ДАНІ
   СТАН ГРИ
   ПРОФЕСІЇ
   МРІЇ
   ФІШКИ
   БАНК
   КАРТКИ
   СТАРТОВІ ЕКРАНИ
========================================================= */


/* =========================================================
   1. НАЛАШТУВАННЯ ГРИ
========================================================= */

const GAME_CONFIG = {

    innerCells: 28,
    outerCells: 56,

    startingMoney: 30000,

    startingReputation: 20,
    startingKnowledge: 20,
    startingEnergy: 70,

    incomeAmount: 15000,

    aiCount: 3,

    aiThinkDelay: 650,
    aiStepDelay: 180,
    aiResultDelay: 850

};


/* =========================================================
   2. ДОПОМІЖНІ ФУНКЦІЇ
========================================================= */

function randomNumber(min, max) {

    return Math.floor(
        Math.random() *
        (max - min + 1)
    ) + min;

}


function randomItem(array) {

    return array[
        Math.floor(
            Math.random() *
            array.length
        )
    ];

}


function delay(ms) {

    return new Promise(
        resolve =>
            setTimeout(
                resolve,
                ms
            )
    );

}


function formatMoney(value) {

    const number =
        Number(value) || 0;


    return new Intl.NumberFormat(
        "uk-UA"
    ).format(
        Math.round(number)
    ) + " ₴";

}


function clamp(
    value,
    min,
    max
) {

    return Math.min(
        max,
        Math.max(
            min,
            value
        )
    );

}


/* =========================================================
   3. ГОЛОВНИЙ КОНТЕЙНЕР
========================================================= */

function getApp() {

    return document.getElementById(
        "financeGameApp"
    );

}


function setScreen(html) {

    const app =
        getApp();


    if (!app) {
        console.error(
            'Не знайдено контейнер з id="financeGameApp.'
        );
        return;
    }
    app.innerHTML =
        html;
    window.scrollTo({
       top: 0,
       behavior: "instant"
   });

}


/* =========================================================
   4. ФІШКИ ГРАВЦІВ

   ФАЙЛИ:
   assets/token1.png
   assets/token2.png
   ...
========================================================= */

const PLAYER_TOKENS = [

    {
        id: "token1",
        name: "Монета",
        image: "assets/token1.png"
    },

    {
        id: "token2",
        name: "Картка",
        image: "assets/token2.png"
    },

    {
        id: "token3",
        name: "Грошовий мішечок",
        image: "assets/token3.png"
    },

    {
        id: "token4",
        name: "Відсоток",
        image: "assets/token4.png"
    },

    {
        id: "token5",
        name: "Скарбничка",
        image: "assets/token5.png"
    },

    {
        id: "token6",
        name: "Портфель",
        image: "assets/token6.png"
    },

    {
        id: "token7",
        name: "Гаманець",
        image: "assets/token7.png"
    },

    {
        id: "token8",
        name: "Кристал",
        image: "assets/token8.png"
    }

];


/* =========================================================
   5. ПРОФЕСІЙНІ СЕКТОРИ

   КОЖЕН СЕКТОР МАЄ СВОЮ КАР'ЄРНУ ДРАБИНУ.
========================================================= */

const CAREER_SECTORS = [

    {
        id: "finance",

        icon: "💼",

        name: "Фінанси",

        levels: [

            {
                male: "Фінансовий асистент",
                female: "Фінансова асистентка"
            },

            {
                male: "Фінансовий спеціаліст",
                female: "Фінансова спеціалістка"
            },

            {
                male: "Старший фінансовий спеціаліст",
                female: "Старша фінансова спеціалістка"
            },

            {
                male: "Фінансовий менеджер",
                female: "Фінансова менеджерка"
            },

            {
                male: "Фінансовий директор",
                female: "Фінансова директорка"
            }

        ]

    },


    {
        id: "it",

        icon: "💻",

        name: "IT",

        levels: [

            {
                male: "Junior IT Specialist",
                female: "Junior IT Specialist"
            },

            {
                male: "IT Specialist",
                female: "IT Specialist"
            },

            {
                male: "Senior IT Specialist",
                female: "Senior IT Specialist"
            },

            {
                male: "IT Lead",
                female: "IT Lead"
            },

            {
                male: "IT Director",
                female: "IT Director"
            }

        ]

    },


    {
        id: "marketing",

        icon: "📣",

        name: "Маркетинг",

        levels: [

            {
                male: "Асистент маркетолога",
                female: "Асистентка маркетолога"
            },

            {
                male: "Маркетолог",
                female: "Маркетологиня"
            },

            {
                male: "Старший маркетолог",
                female: "Старша маркетологиня"
            },

            {
                male: "Marketing Lead",
                female: "Marketing Lead"
            },

            {
                male: "Директор з маркетингу",
                female: "Директорка з маркетингу"
            }

        ]

    },


    {
        id: "business",

        icon: "🚀",

        name: "Бізнес",

        levels: [

            {
                male: "Бізнес-асистент",
                female: "Бізнес-асистентка"
            },

            {
                male: "Підприємець",
                female: "Підприємиця"
            },

            {
                male: "Власник малого бізнесу",
                female: "Власниця малого бізнесу"
            },

            {
                male: "Власник компанії",
                female: "Власниця компанії"
            },

            {
                male: "CEO",
                female: "CEO"
            }

        ]

    },


    {
        id: "creative",

        icon: "🎨",

        name: "Креатив",

        levels: [

            {
                male: "Junior Creator",
                female: "Junior Creator"
            },

            {
                male: "Creator",
                female: "Creator"
            },

            {
                male: "Senior Creator",
                female: "Senior Creator"
            },

            {
                male: "Creative Lead",
                female: "Creative Lead"
            },

            {
                male: "Creative Director",
                female: "Creative Director"
            }

        ]

    }

];


/* =========================================================
   6. ОТРИМАТИ НАЗВУ ПРОФЕСІЇ
========================================================= */

function getProfessionName(
    profession,
    gender = "female"
) {

    if (!profession) {

        return "Професія";

    }


    if (
        typeof profession ===
        "string"
    ) {

        return profession;

    }


    if (
        gender === "male"
    ) {

        return (
            profession.male ||
            profession.female ||
            "Професія"
        );

    }


    return (
        profession.female ||
        profession.male ||
        "Професія"
    );

}


/* =========================================================
   7. ВИМОГИ ДЛЯ КАР'ЄРНОГО ЗРОСТАННЯ

   ІНДЕКС = РІВЕНЬ КАР'ЄРИ.

   0 — стартова професія.
========================================================= */

const CAREER_LEVEL_STATS = [

    {
        money: 0,
        reputation: 0,
        knowledge: 0,
        energy: 0
    },

    {
        money: 45000,
        reputation: 30,
        knowledge: 30,
        energy: 55
    },

    {
        money: 80000,
        reputation: 45,
        knowledge: 45,
        energy: 50
    },

    {
        money: 140000,
        reputation: 65,
        knowledge: 65,
        energy: 45
    },

    {
        money: 220000,
        reputation: 85,
        knowledge: 85,
        energy: 40
    }

];


/* =========================================================
   8. РОЗРАХУНОК — СКІЛЬКИ БРАКУЄ
   ДО НАСТУПНОЇ КАР'ЄРНОЇ СХОДИНКИ
========================================================= */

function getCareerMissingStats(
    participant
) {

    const nextLevel =
        participant.careerLevel + 1;


    if (
        nextLevel >=
        CAREER_LEVEL_STATS.length
    ) {

        return null;

    }


    const required =
        CAREER_LEVEL_STATS[
            nextLevel
        ];


    return {

        money:
            Math.max(
                0,
                required.money -
                participant.money
            ),

        reputation:
            Math.max(
                0,
                required.reputation -
                participant.reputation
            ),

        knowledge:
            Math.max(
                0,
                required.knowledge -
                participant.knowledge
            ),

        energy:
            Math.max(
                0,
                required.energy -
                participant.energy
            )

    };

}


/* =========================================================
   9. МРІЇ

   ЗАРАЗ ЗАКЛАДАЄМО 20 ВАРІАНТІВ.
========================================================= */

const DREAMS = [

    {
        id: "home",

        icon: "🏡",

        name: "Власний дім",

        description:
            "Створити свій затишний простір.",

        requirements: {
            money: 300000,
            reputation: 55,
            knowledge: 50,
            energy: 45
        }
    },


    {
        id: "travel",

        icon: "🌍",

        name: "Подорож світом",

        description:
            "Побачити країни, про які давно мріяв.",

        requirements: {
            money: 220000,
            reputation: 45,
            knowledge: 45,
            energy: 60
        }
    },


    {
        id: "business",

        icon: "🚀",

        name: "Власний бізнес",

        description:
            "Створити справу, яка приносить дохід і розвиток.",

        requirements: {
            money: 280000,
            reputation: 70,
            knowledge: 75,
            energy: 55
        }
    },


    {
        id: "education",

        icon: "🎓",

        name: "Освіта мрії",

        description:
            "Навчатися там, де завжди хотілося.",

        requirements: {
            money: 180000,
            reputation: 45,
            knowledge: 80,
            energy: 50
        }
    },


    {
        id: "car",

        icon: "🚗",

        name: "Авто мрії",

        description:
            "Придбати автомобіль, про який давно мріяв.",

        requirements: {
            money: 250000,
            reputation: 50,
            knowledge: 40,
            energy: 45
        }
    },


    {
        id: "family",

        icon: "❤️",

        name: "Щаслива родина",

        description:
            "Мати ресурс для родини, дому та спільного майбутнього.",

        requirements: {
            money: 200000,
            reputation: 65,
            knowledge: 50,
            energy: 65
        }
    },


    {
        id: "freedom",

        icon: "🕊️",

        name: "Фінансова свобода",

        description:
            "Створити фінансову подушку та більше свободи у виборі.",

        requirements: {
            money: 350000,
            reputation: 55,
            knowledge: 75,
            energy: 50
        }
    },


    {
        id: "startup",

        icon: "💡",

        name: "Запустити стартап",

        description:
            "Перетворити свою ідею на справжній проєкт.",

        requirements: {
            money: 260000,
            reputation: 70,
            knowledge: 80,
            energy: 60
        }
    },


    {
        id: "career",

        icon: "🏆",

        name: "Кар'єра мрії",

        description:
            "Дійти до найвищої професійної сходинки.",

        requirements: {
            money: 220000,
            reputation: 90,
            knowledge: 90,
            energy: 50
        }
    },


    {
        id: "studio",

        icon: "🎨",

        name: "Власна студія",

        description:
            "Відкрити простір для творчості та роботи.",

        requirements: {
            money: 230000,
            reputation: 65,
            knowledge: 70,
            energy: 55
        }
    },


    {
        id: "charity",

        icon: "🤝",

        name: "Благодійний проєкт",

        description:
            "Створити ініціативу, яка допомагає іншим.",

        requirements: {
            money: 180000,
            reputation: 90,
            knowledge: 65,
            energy: 60
        }
    },


    {
        id: "cafe",

        icon: "☕",

        name: "Власна кав'ярня",

        description:
            "Відкрити атмосферне місце зі своєю історією.",

        requirements: {
            money: 250000,
            reputation: 65,
            knowledge: 65,
            energy: 55
        }
    },


    {
        id: "countryHouse",

        icon: "🌳",

        name: "Будинок за містом",

        description:
            "Мати місце для спокою, природи та відпочинку.",

        requirements: {
            money: 320000,
            reputation: 50,
            knowledge: 50,
            energy: 55
        }
    },


    {
        id: "sabbatical",

        icon: "🌴",

        name: "Рік для себе",

        description:
            "Мати достатньо ресурсу, щоб зробити довгу паузу.",

        requirements: {
            money: 270000,
            reputation: 50,
            knowledge: 55,
            energy: 80
        }
    },


    {
        id: "investor",

        icon: "📈",

        name: "Стати інвестором",

        description:
            "Створити власний інвестиційний портфель.",

        requirements: {
            money: 330000,
            reputation: 60,
            knowledge: 90,
            energy: 45
        }
    },


    {
        id: "book",

        icon: "📚",

        name: "Написати книгу",

        description:
            "Створити власну книгу та поділитися своїми ідеями.",

        requirements: {
            money: 150000,
            reputation: 75,
            knowledge: 85,
            energy: 65
        }
    },


    {
        id: "petProject",

        icon: "🐾",

        name: "Допомагати тваринам",

        description:
            "Створити або підтримувати великий pet-friendly проєкт.",

        requirements: {
            money: 180000,
            reputation: 85,
            knowledge: 60,
            energy: 65
        }
    },


    {
        id: "technology",

        icon: "🤖",

        name: "Створити технологічний продукт",

        description:
            "Розробити продукт, яким користуються люди.",

        requirements: {
            money: 260000,
            reputation: 70,
            knowledge: 90,
            energy: 60
        }
    },


    {
        id: "retirement",

        icon: "🏖️",

        name: "Капітал на майбутнє",

        description:
            "Створити достатній запас коштів для майбутнього.",

        requirements: {
            money: 400000,
            reputation: 55,
            knowledge: 75,
            energy: 45
        }
    },


    {
        id: "dreamLife",

        icon: "✨",

        name: "Життя мрії",

        description:
            "Досягти балансу між розвитком, фінансами та життям.",

        requirements: {
            money: 300000,
            reputation: 80,
            knowledge: 80,
            energy: 75
        }
    }

];


/* =========================================================
   10. ТИПИ ПОЛІВ

   ЦЕЙ БЛОК ВИКОРИСТОВУЄТЬСЯ ТАКОЖ
   ДЛЯ КНОПКИ "ТИПИ ПОЛІВ".
========================================================= */

const CELL_TYPES = {

    income: {

        id: "income",

        icon: "💰",

        name: "Дохід",

        description:
            "Отримай дохід. Його розмір може залежати від твоєї кар'єрної сходинки."

    },


    bank: {

        id: "bank",

        icon: "🏦",

        name: "Банк",

        description:
            "Фінансові рішення: кредит, депозит, страхування, інвестиції або валютні операції."

    },


    event: {

        id: "event",

        icon: "🎴",

        name: "Подія",

        description:
            "Обери картку та прийми рішення. Подія може вплинути на гроші, репутацію, знання або енергію."

    },


    life: {

        id: "life",

        icon: "❤️",

        name: "Життя",

        description:
            "Життєва ситуація. Обери число від 1 до 20 та відкрий свою картку."

    },


    fate: {

        id: "fate",

        icon: "⚡",

        name: "Доля",

        description:
            "Випадкова ситуація, яку не завжди можна передбачити або контролювати."

    },


    lounge: {

        id: "lounge",

        icon: "☕",

        name: "Lounge & Хобі",

        description:
            "Час на відпочинок і захоплення. Допомагає відновлювати енергію."

    },


    academy: {

        id: "academy",

        icon: "🎓",

        name: "Академія & Soft Skills",

        description:
            "Навчання та розвиток навичок додають знання й можуть підвищувати репутацію."

    },


    transition: {

        id: "transition",

        icon: "➡️",

        name: "Перехід",

        description:
            "Перехід між етапами життєвого шляху."

    },


    dreamCheck: {

        id: "dreamCheck",

        icon: "✨",

        name: "Перевірка Мрії",

        description:
            "Перевір, наскільки ти наблизився до своєї Мрії та яких ресурсів ще бракує."

    }

};


/* =========================================================
   11. ВНУТРІШНЄ ПОЛЕ — 28 КОМІРОК
========================================================= */

const INNER_BOARD = [

    "income",
    "event",
    "life",
    "bank",
    "fate",
    "lounge",
    "event",

    "academy",
    "income",
    "life",
    "bank",
    "event",
    "fate",
    "lounge",

    "income",
    "academy",
    "event",
    "life",
    "bank",
    "fate",
    "event",

    "lounge",
    "income",
    "academy",
    "life",
    "event",
    "dreamCheck",
    "transition"

];


/* =========================================================
   12. ЗОВНІШНЄ ПОЛЕ — 56 КОМІРОК
========================================================= */

const OUTER_BOARD = [

    "income",
    "event",
    "life",
    "bank",
    "fate",
    "event",
    "lounge",

    "academy",
    "income",
    "life",
    "event",
    "bank",
    "fate",
    "event",

    "income",
    "lounge",
    "life",
    "academy",
    "event",
    "bank",
    "fate",

    "event",
    "income",
    "life",
    "lounge",
    "event",
    "academy",
    "bank",

    "fate",
    "income",
    "event",
    "life",
    "bank",
    "event",
    "lounge",

    "academy",
    "income",
    "fate",
    "event",
    "life",
    "bank",
    "event",

    "lounge",
    "income",
    "academy",
    "life",
    "event",
    "fate",
    "dreamCheck",

    "income",
    "bank",
    "event",
    "life",
    "lounge",
    "academy",
    "dreamCheck"

];


/* =========================================================
   13. БАНК — ПРОДУКТИ

   ВАЖЛИВО:
   УСІ БАНКІВСЬКІ ПРОДУКТИ ВЖЕ ВИНЕСЕНІ ОКРЕМО.

   ПОТІМ МИ ЗМОЖЕМО МІНЯТИ ЇХНЮ ЛОГІКУ
   БЕЗ ПЕРЕПИСУВАННЯ ВСІЄЇ ГРИ.
========================================================= */

const BANK_PRODUCTS = [

    {
        id: "credit",

        icon: "💳",

        name: "Кредит",

        description:
            "Отримай кошти зараз і повертай їх за визначеними умовами.",

        actionText:
            "ВЗЯТИ КРЕДИТ"
    },


    {
        id: "deposit",

        icon: "🏦",

        name: "Депозит",

        description:
            "Відклади частину коштів і отримуй дохід за умовами депозиту.",

        actionText:
            "ВІДКРИТИ ДЕПОЗИТ"
    },


    {
        id: "insurance",

        icon: "🛡️",

        name: "Страхування",

        description:
            "Захисти себе від частини непередбачених фінансових ризиків.",

        actionText:
            "ОФОРМИТИ СТРАХУВАННЯ"
    },


    {
        id: "investment",

        icon: "📈",

        name: "Інвестиції",

        description:
            "Інвестуй частину коштів із можливістю отримати прибуток або збиток.",

        actionText:
            "ІНВЕСТУВАТИ"
    },


    {
        id: "currency",

        icon: "💱",

        name: "Валютні операції",

        description:
            "Обмінюй валюту та враховуй курс і можливу комісію.",

        actionText:
            "ОБМІНЯТИ ВАЛЮТУ"
    }

];


/* =========================================================
   14. БАНК — МІСЦЕ ДЛЯ ФІНАНСОВИХ ФОРМУЛ

   ПІЗНІШЕ ЗМІНЮЄМО ПЕРЕВАЖНО ЦЕЙ БЛОК
   + ВІДПОВІДНУ ФУНКЦІЮ ПРОДУКТУ.
========================================================= */

const BANK_RULES = {

    credit: {

        enabled: true,

        minAmount: null,
        maxAmount: null,

        interestRate: null,
        term: null,

        payment: null,
        penalty: null

    },


    deposit: {

        enabled: true,

        minAmount: null,

        interestRate: null,
        term: null,

        payout: null

    },


    insurance: {

        enabled: true,

        price: null,

        coverage: null,

        protectedEvents: [],

        payout: null

    },


    investment: {

        enabled: true,

        minAmount: null,

        riskLevel: null,

        profit: null,
        loss: null

    },


    currency: {

        enabled: true,

        currencies: [],

        exchangeRate: null,

        commission: null

    }

};


/* =========================================================
   15. СТВОРЕННЯ ПОРОЖНЬОГО БАНКІВСЬКОГО СТАНУ
========================================================= */

function createEmptyBankState() {

    return {

        products: [],


        credit: {

            active: false,

            amount: 0,

            debt: 0,

            interestRate: 0,

            payment: 0,

            paymentsLeft: 0

        },


        deposit: {

            active: false,

            amount: 0,

            interestRate: 0,

            earned: 0,

            turnsLeft: 0

        },


        insurance: {

            active: false,

            type: null,

            price: 0,

            coverage: 0

        },


        investment: {

            active: false,

            amount: 0,

            value: 0,

            profit: 0

        },


        currency: {

            balances: {},

            lastRate: null

        }

    };

}


/* =========================================================
   16. ПЕРЕВІРКА БАНКІВСЬКОГО СТАНУ
========================================================= */

function ensurePlayerBankState() {

    if (
        !gameState.player
    ) {
        return;
    }


    if (
        !gameState.player.bank
    ) {

        gameState.player.bank =
            createEmptyBankState();

    }


    if (
        !Array.isArray(
            gameState.player.bank.products
        )
    ) {

        gameState.player.bank.products =
            [];

    }

}


/* =========================================================
   17. КАРТКИ ГРИ

   decisionType:

   "choice"
   = Беру / Не беру / Частково

   "mandatory"
   = обов'язкова ситуація,
     без кнопки "Частково"

   У ЧАСТИНІ 3 БУДЕ ПОВНА ЛОГІКА РІШЕНЬ.
========================================================= */

const CARD_DECKS = {

    event: [

        {
            id: "event_1",

            title:
                "Новий професійний курс",

            text:
                "Ти знайшов курс, який може допомогти у кар'єрі.",

            decisionType:
                "choice",

            amount:
                8000,

            effects: {
                money: -8000,
                knowledge: 15,
                reputation: 5
            }
        },


        {
            id: "event_2",

            title:
                "Нова техніка",

            text:
                "Стара техніка працює, але дуже хочеться оновлення.",

            decisionType:
                "choice",

            amount:
                15000,

            effects: {
                money: -15000,
                energy: 8
            }
        },


        {
            id: "event_3",

            title:
                "Професійна конференція",

            text:
                "Участь може дати нові знання та корисні знайомства.",

            decisionType:
                "choice",

            amount:
                10000,

            effects: {
                money: -10000,
                knowledge: 10,
                reputation: 10
            }
        },


        {
            id: "event_4",

            title:
                "Підробіток",

            text:
                "Є можливість додатково заробити, але доведеться витратити частину сил.",

            decisionType:
                "choice",

            amount:
                0,

            effects: {
                money: 12000,
                energy: -10
            }
        },


        {
            id: "event_5",

            title:
                "Волонтерський проєкт",

            text:
                "Можеш долучитися до важливої ініціативи.",

            decisionType:
                "choice",

            amount:
                5000,

            effects: {
                money: -5000,
                reputation: 15,
                energy: -5
            }
        },


        {
            id: "event_6",

            title:
                "Ремонт техніки",

            text:
                "Ноутбук несподівано зламався. Ремонт необхідний.",

            decisionType:
                "mandatory",

            amount:
                9000,

            effects: {
                money: -9000
            }
        }

    ],


    life: [

        {
            id: "life_1",

            title:
                "День народження друга",

            text:
                "Ти плануєш подарунок і святкування.",

            decisionType:
                "choice",

            amount:
                4000,

            effects: {
                money: -4000,
                reputation: 5,
                energy: 5
            }
        },


        {
            id: "life_2",

            title:
                "Незапланований ремонт",

            text:
                "Удома виникла поломка, яку потрібно терміново усунути.",

            decisionType:
                "mandatory",

            amount:
                12000,

            effects: {
                money: -12000,
                energy: -5
            }
        },


        {
            id: "life_3",

            title:
                "Міні-відпустка",

            text:
                "Кілька днів відпочинку допоможуть відновити сили.",

            decisionType:
                "choice",

            amount:
                10000,

            effects: {
                money: -10000,
                energy: 20
            }
        },


        {
            id: "life_4",

            title:
                "Подарунок від близьких",

            text:
                "Приємний фінансовий сюрприз.",

            decisionType:
                "mandatory",

            amount:
                0,

            effects: {
                money: 7000,
                energy: 5
            }
        },


        {
            id: "life_5",

            title:
                "Новий спорт",

            text:
                "Хочеться спробувати нове заняття та додати активності.",

            decisionType:
                "choice",

            amount:
                6000,

            effects: {
                money: -6000,
                energy: 15,
                reputation: 3
            }
        },


        {
            id: "life_6",

            title:
                "Побутові витрати",

            text:
                "Цього місяця витрати на побут виявилися більшими.",

            decisionType:
                "mandatory",

            amount:
                6500,

            effects: {
                money: -6500
            }
        }

    ],


    fate: [

        {
            id: "fate_1",

            title:
                "Повернення коштів",

            text:
                "Тобі несподівано повернули старий борг.",

            decisionType:
                "mandatory",

            amount:
                0,

            effects: {
                money: 10000
            }
        },


        {
            id: "fate_2",

            title:
                "Штраф",

            text:
                "Неочікувана фінансова втрата.",

            decisionType:
                "mandatory",

            amount:
                5000,

            effects: {
                money: -5000,
                reputation: -2
            }
        },


        {
            id: "fate_3",

            title:
                "Премія",

            text:
                "Твою роботу помітили та винагородили.",

            decisionType:
                "mandatory",

            amount:
                0,

            effects: {
                money: 15000,
                reputation: 8
            }
        },


        {
            id: "fate_4",

            title:
                "Несподівана поломка",

            text:
                "Доведеться витратитися на терміновий ремонт.",

            decisionType:
                "mandatory",

            amount:
                11000,

            effects: {
                money: -11000,
                energy: -5
            }
        },


        {
            id: "fate_5",

            title:
                "Корисне знайомство",

            text:
                "Випадкова зустріч відкрила нові можливості.",

            decisionType:
                "mandatory",

            amount:
                0,

            effects: {
                reputation: 12,
                knowledge: 5
            }
        },


        {
            id: "fate_6",

            title:
                "Вигідна можливість",

            text:
                "Тобі запропонували невеликий додатковий проєкт.",

            decisionType:
                "choice",

            amount:
                0,

            effects: {
                money: 9000,
                reputation: 5,
                energy: -8
            }
        }

    ]

};


/* =========================================================
   18. СТАН ГРИ
========================================================= */

const gameState = {

    phase:
        "start",

    mode:
        "single",

    player:
        null,

    opponents:
        [],

    currentTurn:
        "player",

    diceValue:
        null,

    target:
        null,

    pendingCard:
        null,

    pendingDecision:
        null,

    turnNumber:
        1,

    history:
        [],

    gameFinished:
        false

};


/* =========================================================
   19. СТВОРЕННЯ УЧАСНИКА
========================================================= */

function createParticipant({

    id,
    name,
    gender,
    token,
    sector,
    dream,
    isAI = false

}) {

    return {

        id,
        name,
        gender,

        token,
        sector,
        dream,

        isAI,

        board:
            "inner",

        position:
            1,

        careerLevel:
            0,

        money:
            GAME_CONFIG.startingMoney,

        reputation:
            GAME_CONFIG.startingReputation,

        knowledge:
            GAME_CONFIG.startingKnowledge,

        energy:
            GAME_CONFIG.startingEnergy,

        bank:
            createEmptyBankState(),

        completedTurns:
            0

    };

}


/* =========================================================
   20. AI — ІМЕНА
========================================================= */

const AI_NAMES = [

    {
        name: "Марко",
        gender: "male"
    },

    {
        name: "Софія",
        gender: "female"
    },

    {
        name: "Андрій",
        gender: "male"
    },

    {
        name: "Катерина",
        gender: "female"
    },

    {
        name: "Максим",
        gender: "male"
    },

    {
        name: "Анна",
        gender: "female"
    },

    {
        name: "Данило",
        gender: "male"
    },

    {
        name: "Дарина",
        gender: "female"
    }

];


/* =========================================================
   21. ТИМЧАСОВІ ДАНІ СТВОРЕННЯ ГРАВЦЯ
========================================================= */

const playerSetup = {

    name:
        "",

    gender:
        "female",

    token:
        null,

    sector:
        null,

    dream:
        null

};


/* =========================================================
   22. СТАРТОВИЙ ЕКРАН

   ФОН НЕ ЗМІНЮЄМО.
   ВИКОРИСТОВУЄМО ТВОЄ ЗОБРАЖЕННЯ:
   assets/bg-start.png
========================================================= */

function showStartScreen() {

    gameState.phase =
        "start";


    setScreen(`

        <section class="start-screen">

            <div class="start-screen-overlay"></div>


            <div class="start-main-content">


                <img
                    src="assets/logo.png"
                    class="start-game-logo"
                    alt="CV Життя"
                >


                <div class="start-game-message">

                    <h1>
                        СВІТ. ЖИТТЯ.
                        <br>
                        ЛЮБИ. МРІЙ. ДІЙ.
                    </h1>


                    <p>
                        Фінансова гра про рішення,
                        розвиток, ризики,
                        кар'єру та шлях до своєї Мрії.
                    </p>


                    <button
                        id="startGameButton"
                        class="main-game-btn start-game-btn"
                    >
                        ПОЧАТИ ГРУ
                    </button>

                </div>

            </div>


            <img
                src="assets/raifik.png"
                class="start-raifik"
                alt="Райфик"
            >

        </section>

    `);


    const button =
        document.getElementById(
            "startGameButton"
        );


    if (button) {

        button.addEventListener(
            "click",
            showModeSelection
        );

    }

}


/* =========================================================
   23. ВИБІР РЕЖИМУ

   ПОКИ ПОВНІСТЮ ПРАЦЮЄ
   ОДИНОЧНА ГРА.

   МІСЦЕ ПІД ЗАГАЛЬНУ ГРУ ЗАЛИШАЄМО.
========================================================= */

function showModeSelection() {

    gameState.phase =
        "mode";


    setScreen(`

        <section class="setup-screen">

            <div class="setup-screen-card">

                <span class="setup-small-label">
                    CV ЖИТТЯ
                </span>


                <h2>
                    Обери формат гри
                </h2>


                <p class="setup-description">

                    Почни власний життєвий шлях
                    або приєднайся до спільної гри.

                </p>


                <div class="mode-selection-grid">


                    <button
                        id="singleGameButton"
                        class="mode-selection-card"
                    >

                        <span class="mode-icon">
                            👤
                        </span>

                        <strong>
                            ОДИН ГРАВЕЦЬ
                        </strong>

                        <small>
                            Грай проти AI-учасників
                        </small>

                    </button>


                    <button
                        id="multiplayerGameButton"
                        class="
                            mode-selection-card
                            mode-selection-disabled
                        "
                    >

                        <span class="mode-icon">
                            👥
                        </span>

                        <strong>
                            ЗАГАЛЬНА ГРА
                        </strong>

                        <small>
                            Скоро буде доступно
                        </small>

                    </button>

                </div>


                <button
                    id="modeBackButton"
                    class="secondary-game-btn"
                >
                    ← НАЗАД
                </button>

            </div>

        </section>

    `);


    document
        .getElementById(
            "singleGameButton"
        )
        .addEventListener(
            "click",
            () => {

                gameState.mode =
                    "single";

                showPlayerNameScreen();

            }
        );


    document
        .getElementById(
            "modeBackButton"
        )
        .addEventListener(
            "click",
            showStartScreen
        );

}


/* =========================================================
   24. ІМ'Я ГРАВЦЯ
========================================================= */

function showPlayerNameScreen() {

    setScreen(`

        <section class="setup-screen">

            <div class="setup-screen-card">

                <span class="setup-small-label">
                    СТВОРЕННЯ ГЕРОЯ
                </span>


                <h2>
                    Як тебе звати?
                </h2>


                <p class="setup-description">

                    Це ім'я буде відображатися
                    на твоєму профілі та в журналі гри.

                </p>


                <input
                    id="playerNameInput"
                    class="setup-input"
                    type="text"
                    maxlength="24"
                    placeholder="Введи ім'я"
                    value="${playerSetup.name}"
                >


                <div
                    id="playerNameError"
                    class="form-error"
                ></div>


                <button
                    id="playerNameContinue"
                    class="main-game-btn"
                >
                    ДАЛІ
                </button>


                <button
                    id="playerNameBack"
                    class="secondary-game-btn"
                >
                    ← НАЗАД
                </button>

            </div>

        </section>

    `);


    document
        .getElementById(
            "playerNameContinue"
        )
        .addEventListener(
            "click",
            () => {

                const input =
                    document.getElementById(
                        "playerNameInput"
                    );


                const name =
                    input.value.trim();


                if (!name) {

                    document
                        .getElementById(
                            "playerNameError"
                        )
                        .textContent =
                        "Напиши своє ім'я 🙂";

                    return;

                }


                playerSetup.name =
                    name;


                showGenderSelection();

            }
        );


    document
        .getElementById(
            "playerNameBack"
        )
        .addEventListener(
            "click",
            showModeSelection
        );

}


/* =========================================================
   25. ВИБІР СТАТІ

   ВИКОРИСТОВУЄМО ДЛЯ НАЗВ ПРОФЕСІЙ.
========================================================= */

function showGenderSelection() {

    setScreen(`

        <section class="setup-screen">

            <div class="setup-screen-card">

                <span class="setup-small-label">
                    СТВОРЕННЯ ГЕРОЯ
                </span>


                <h2>
                    Обери героя
                </h2>


                <p class="setup-description">

                    Це допоможе коректно
                    відображати назви професій.

                </p>


                <div class="gender-selection-grid">


                    <button
                        class="gender-selection-card"
                        data-gender="female"
                    >

                        <span>
                            👩
                        </span>

                        <strong>
                            ДІВЧИНА
                        </strong>

                    </button>


                    <button
                        class="gender-selection-card"
                        data-gender="male"
                    >

                        <span>
                            👨
                        </span>

                        <strong>
                            ХЛОПЕЦЬ
                        </strong>

                    </button>

                </div>


                <button
                    id="genderBackButton"
                    class="secondary-game-btn"
                >
                    ← НАЗАД
                </button>

            </div>

        </section>

    `);


    document
        .querySelectorAll(
            ".gender-selection-card"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    playerSetup.gender =
                        button.dataset.gender;


                    showTokenSelection();

                }
            );

        });


    document
        .getElementById(
            "genderBackButton"
        )
        .addEventListener(
            "click",
            showPlayerNameScreen
        );

}


/* =========================================================
   26. ВИБІР ФІШКИ
========================================================= */

function showTokenSelection() {

    const tokensHTML =
        PLAYER_TOKENS
            .map(token => `

                <button
                    class="token-selection-card"
                    data-token-id="${token.id}"
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

        <section class="setup-screen">

            <div class="
                setup-screen-card
                setup-screen-card-wide
            ">

                <span class="setup-small-label">
                    СТВОРЕННЯ ГЕРОЯ
                </span>


                <h2>
                    Обери свою фішку
                </h2>


                <p class="setup-description">

                    Вона буде рухатися
                    разом із тобою ігровим полем.

                </p>


                <div class="token-selection-grid">

                    ${tokensHTML}

                </div>


                <button
                    id="tokenBackButton"
                    class="secondary-game-btn"
                >
                    ← НАЗАД
                </button>

            </div>

        </section>

    `);


    document
        .querySelectorAll(
            ".token-selection-card"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    playerSetup.token =
                        PLAYER_TOKENS.find(
                            token =>
                                token.id ===
                                button.dataset.tokenId
                        );


                    showCareerSectorSelection();

                }
            );

        });


    document
        .getElementById(
            "tokenBackButton"
        )
        .addEventListener(
            "click",
            showGenderSelection
        );

}


/* =========================================================
   27. ВИБІР ПРОФЕСІЙНОГО НАПРЯМУ

   У ГРІ ЦЕ СТАРТОВИЙ КАР'ЄРНИЙ ШЛЯХ.
========================================================= */

function showCareerSectorSelection() {

    const sectorsHTML =
        CAREER_SECTORS
            .map(sector => `

                <button
                    class="career-sector-card"
                    data-sector-id="${sector.id}"
                >

                    <span class="career-sector-icon">
                        ${sector.icon}
                    </span>

                    <strong>
                        ${sector.name}
                    </strong>

                    <small>
                        ${
                            getProfessionName(
                                sector.levels[0],
                                playerSetup.gender
                            )
                        }
                    </small>

                </button>

            `)
            .join("");


    setScreen(`

        <section class="setup-screen">

            <div class="
                setup-screen-card
                setup-screen-card-wide
            ">

                <span class="setup-small-label">
                    КАР'ЄРНИЙ ШЛЯХ
                </span>


                <h2>
                    Обери напрям
                </h2>


                <p class="setup-description">

                    Ти почнеш із першої
                    кар'єрної сходинки
                    та зможеш розвиватися під час гри.

                </p>


                <div class="career-sector-grid">

                    ${sectorsHTML}

                </div>


                <button
                    id="careerSectorBack"
                    class="secondary-game-btn"
                >
                    ← НАЗАД
                </button>

            </div>

        </section>

    `);


    document
        .querySelectorAll(
            ".career-sector-card"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    playerSetup.sector =
                        CAREER_SECTORS.find(
                            sector =>
                                sector.id ===
                                button.dataset.sectorId
                        );


                    showDreamSelection();

                }
            );

        });


    document
        .getElementById(
            "careerSectorBack"
        )
        .addEventListener(
            "click",
            showTokenSelection
        );

}


/* =========================================================
   28. ВИБІР МРІЇ
========================================================= */

function showDreamSelection() {

    const dreamsHTML =
        DREAMS
            .map(dream => `

                <button
                    class="dream-selection-card"
                    data-dream-id="${dream.id}"
                >

                    <span class="dream-selection-icon">
                        ${dream.icon}
                    </span>

                    <strong>
                        ${dream.name}
                    </strong>

                    <small>
                        ${dream.description}
                    </small>

                </button>

            `)
            .join("");


    setScreen(`

        <section class="setup-screen">

            <div class="
                setup-screen-card
                setup-screen-card-extra-wide
            ">

                <span class="setup-small-label">
                    ТВОЯ МРІЯ
                </span>


                <h2>
                    До чого ти хочеш прийти?
                </h2>


                <p class="setup-description">

                    У грі важливо не просто
                    накопичити гроші.

                    Розвивай кар'єру,
                    знання, репутацію та енергію,
                    щоб наближатися до своєї Мрії.

                </p>


                <div class="dream-selection-grid">

                    ${dreamsHTML}

                </div>


                <button
                    id="dreamBackButton"
                    class="secondary-game-btn"
                >
                    ← НАЗАД
                </button>

            </div>

        </section>

    `);


    document
        .querySelectorAll(
            ".dream-selection-card"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    playerSetup.dream =
                        DREAMS.find(
                            dream =>
                                dream.id ===
                                button.dataset.dreamId
                        );


                    createNewGame();

                }
            );

        });


    document
        .getElementById(
            "dreamBackButton"
        )
        .addEventListener(
            "click",
            showCareerSectorSelection
        );

}


/* =========================================================
   29. СТВОРЕННЯ НОВОЇ ГРИ
========================================================= */

function createNewGame() {

    gameState.history =
        [];

    gameState.turnNumber =
        1;

    gameState.gameFinished =
        false;

    gameState.target =
        null;

    gameState.pendingCard =
        null;

    gameState.pendingDecision =
        null;


    gameState.player =
        createParticipant({

            id:
                "player",

            name:
                playerSetup.name,

            gender:
                playerSetup.gender,

            token:
                playerSetup.token,

            sector:
                playerSetup.sector,

            dream:
                playerSetup.dream,

            isAI:
                false

        });


    createAIOpponents();


    /*
       showGameBoard()
       знаходиться у ЧАСТИНІ 2.
    */

    showGameBoard();

}


/* =========================================================
   30. СТВОРЕННЯ AI-ГРАВЦІВ
========================================================= */

function createAIOpponents() {

    gameState.opponents =
        [];


    const availableNames =
        [...AI_NAMES]
            .sort(
                () =>
                    Math.random() - 0.5
            );


    const availableTokens =
        PLAYER_TOKENS
            .filter(
                token =>
                    !gameState.player ||
                    token.id !==
                    gameState.player.token.id
            )
            .sort(
                () =>
                    Math.random() - 0.5
            );


    for (
        let i = 0;
        i < GAME_CONFIG.aiCount;
        i++
    ) {

        const aiIdentity =
            availableNames[
                i %
                availableNames.length
            ];


        const token =
            availableTokens[
                i %
                availableTokens.length
            ];


        const sector =
            randomItem(
                CAREER_SECTORS
            );


        const dream =
            randomItem(
                DREAMS
            );


        const ai =
            createParticipant({

                id:
                    `ai-${i + 1}`,

                name:
                    aiIdentity.name,

                gender:
                    aiIdentity.gender,

                token,

                sector,

                dream,

                isAI:
                    true

            });


        gameState.opponents.push(
            ai
        );

    }

}


/* =========================================================
   КІНЕЦЬ ЧАСТИНИ 1 / 3

   НІЧОГО НИЖЧЕ ПОКИ НЕ ДОДАВАЙ.

   ЧАСТИНА 2 ПОЧНЕТЬСЯ З:

   31. ГОЛОВНИЙ ІГРОВИЙ ЕКРАН

========================================================= */
/* =========================================================
   CV ЖИТТЯ
   SCRIPT.JS
   ЧАСТИНА 2 / 3

   ГОЛОВНИЙ ІГРОВИЙ ЕКРАН
   ПОЛЕ
   HUD
   КУБИК
   РУХ
   ФІШКИ
   МОДАЛЬНЕ ВІКНО
========================================================= */


/* =========================================================
   31. ГОЛОВНИЙ ІГРОВИЙ ЕКРАН
========================================================= */

function showGameBoard() {

    if (
        !gameState.player
    ) {

        console.error(
            "Немає створеного гравця."
        );

        return;

    }


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
                ],

            player.gender

        );


    const opponentsHTML =
        gameState.opponents
            .map(ai => {

                const aiProfession =
                    getProfessionName(

                        ai
                            .sector
                            .levels[
                                ai.careerLevel
                            ],

                        ai.gender

                    );


                return `

                    <button
                        class="mini-opponent-button"
                        data-player-id="${ai.id}"
                    >

                        <img
                            src="${ai.token.image}"
                            alt="${ai.name}"
                        >

                        <div>

                            <strong>
                                ${ai.name}
                            </strong>

                            <small>
                                ${aiProfession}
                            </small>

                        </div>

                    </button>

                `;

            })
            .join("");


    setScreen(`

        <section class="main-board-screen">


            <!-- =========================================
                 ІГРОВЕ ПОЛЕ
            ========================================== -->

            <main
                id="board"
                class="game-board rectangle-game-board"
            >


                <!-- ЗОВНІШНІЙ МАРШРУТ -->

                <div
                    id="outerBoard"
                    class="
                        rectangle-board
                        outer-rectangle-board
                    "
                ></div>


                <!-- ВНУТРІШНІЙ МАРШРУТ -->

                <div
                    id="innerBoard"
                    class="
                        rectangle-board
                        inner-rectangle-board
                    "
                ></div>


                <!-- =========================================
                     ЛОГО ТЕПЕР НЕ У КУТКУ,
                     А ВСЕРЕДИНІ МАЛОГО ПОЛЯ
                ========================================== -->

                <div class="board-center-brand">

                    <img
                        src="assets/logo.png"
                        class="board-center-logo"
                        alt="CV Життя"
                    >

                </div>


                <!-- =========================================
                     НИЖНІЙ HUD
                ========================================== -->

                <div class="player-bottom-hud">


                    <!-- ПРОФІЛЬ / КАР'ЄРА -->

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


                            <span
                                id="hudProfessionValue"
                                class="hud-player-profession"
                            >

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

                                    ${formatMoney(
                                        player.money
                                    )}

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


            <!-- =========================================
                 ПРАВА ПАНЕЛЬ
            ========================================== -->

            <aside class="game-work-panel">


                <!-- ХІД -->

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


                <!-- =========================================
                     РАЙФИК

                     КАРТКИ ТУТ БІЛЬШЕ
                     НЕ ВІДКРИВАЄМО.

                     ВОНИ ЙДУТЬ У ЦЕНТРАЛЬНУ МОДАЛКУ.
                ========================================== -->

                <div
                    id="raifikBoardPanel"
                    class="raifik-board-panel"
                >

                    <img
                        src="assets/raifik.png"
                        alt="Райфик"
                    >


                    <div>

                        <strong>
                            Райфик
                        </strong>

                        <p id="raifikBoardText">

                            Починаємо зі START.

                            Кидай кубик
                            і починай свій шлях!

                        </p>

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


                <!-- =========================================
                     ДОДАТКОВІ КНОПКИ
                ========================================== -->

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

                            ${gameState.history.length}

                        </span>

                    </button>


                    <button
                        id="finishGameButton"
                        class="
                            work-panel-button
                            finish-game-button
                        "
                    >

                        <span>
                            ⏹ Завершити гру
                        </span>

                        <span>
                            →
                        </span>

                    </button>


                </div>


            </aside>


            <!-- =========================================
                 ЦЕНТРАЛЬНА МОДАЛКА

                 КАРТКИ,
                 БАНК,
                 КАР'ЄРА,
                 МРІЯ,
                 ЖУРНАЛ,
                 ТИПИ ПОЛІВ,
                 ЗАВЕРШЕННЯ ГРИ
            ========================================== -->

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


                    <div
                        id="gameInfoContent"
                        class="game-info-content"
                    ></div>


                </div>

            </div>


        </section>

    `);


    /* =============================================
       СТВОРЕННЯ ПОЛЯ
    ============================================== */

    createBoard();


    placeAllPieces();


    updatePlayerStatsUI();


    updateJournalCount();


    /* =============================================
       КУБИК
    ============================================== */

    const rollButton =
        document.getElementById(
            "rollDiceButton"
        );


    if (rollButton) {

        rollButton.addEventListener(
            "click",
            rollDice
        );

    }


    /* =============================================
       КАР'ЄРА
    ============================================== */

    document
        .getElementById(
            "careerHudButton"
        )
        ?.addEventListener(
            "click",
            showCareerProgressModal
        );


    /* =============================================
       МРІЯ
    ============================================== */

    document
        .getElementById(
            "dreamHudButton"
        )
        ?.addEventListener(
            "click",
            showDreamProgress
        );


    /* =============================================
       БАНК
    ============================================== */

    document
        .getElementById(
            "bankHudButton"
        )
        ?.addEventListener(
            "click",
            showBankHub
        );


    /* =============================================
       AI
    ============================================== */

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


    /* =============================================
       ТИПИ ПОЛІВ
    ============================================== */

    document
        .getElementById(
            "cellInfoButton"
        )
        ?.addEventListener(
            "click",
            showAllCellTypes
        );


    /* =============================================
       ЖУРНАЛ
    ============================================== */

    document
        .getElementById(
            "journalButton"
        )
        ?.addEventListener(
            "click",
            showGameJournal
        );


    /* =============================================
       ЗАВЕРШИТИ ГРУ
    ============================================== */

    document
        .getElementById(
            "finishGameButton"
        )
        ?.addEventListener(
            "click",
            showFinishGameModal
        );


    /* =============================================
       ЗАКРИТТЯ МОДАЛКИ
    ============================================== */

    document
        .getElementById(
            "gameInfoClose"
        )
        ?.addEventListener(
            "click",
            closeGameInfoModal
        );


    const modal =
        document.getElementById(
            "gameInfoModal"
        );


    if (modal) {

        modal.addEventListener(
            "click",
            event => {

                if (
                    event.target ===
                    modal
                ) {

                    closeGameInfoModal();

                }

            }
        );

    }


    showRaifikMessage(

        "Починаємо зі START. Кидай кубик 🎲"

    );


    addLog({

        participant:
            player.name,

        action:
            "Початок гри",

        details:
            `Стартова професія: ${profession}. Мрія: ${player.dream.name}.`

    });

}


/* =========================================================
   32. СТВОРЕННЯ ДВОХ МАРШРУТІВ
========================================================= */

function createBoard() {

    const outer =
        document.getElementById(
            "outerBoard"
        );


    const inner =
        document.getElementById(
            "innerBoard"
        );


    if (
        !outer ||
        !inner
    ) {

        return;

    }


    outer.innerHTML =
        "";


    inner.innerHTML =
        "";


    createRectangleBoard(

        outer,

        OUTER_BOARD,

        "outer"

    );


    createRectangleBoard(

        inner,

        INNER_BOARD,

        "inner"

    );

}


/* =========================================================
   33. КООРДИНАТИ ПРЯМОКУТНОГО МАРШРУТУ

   INNER:
   рух за годинниковою

   OUTER:
   рух проти годинникової
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


    /*
       СПІВВІДНОШЕННЯ ШИРИНИ ТА ВИСОТИ
       ЗАЛИШАЄМО ПІД ШИРОКИЙ ЕКРАН.
    */

    const width =
        1.78;


    const height =
        1;


    const perimeter =
        width * 2 +
        height * 2;


    /*
       START —
       приблизно середина верхнього боку.
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


    while (
        distance <
        0
    ) {

        distance +=
            perimeter;

    }


    let x = 0;
    let y = 0;


    /* ВЕРХ */

    if (
        distance <=
        width
    ) {

        x =
            (
                distance /
                width
            ) *
            100;


        y =
            0;

    }


    /* ПРАВА СТОРОНА */

    else if (
        distance <=
        width +
        height
    ) {

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


    /* НИЗ */

    else if (
        distance <=
        width * 2 +
        height
    ) {

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


    /* ЛІВА СТОРОНА */

    else {

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
   34. СТВОРЕННЯ ОДНОГО МАРШРУТУ
========================================================= */

function createRectangleBoard(
    container,
    boardData,
    boardName
) {

    if (
        !container
    ) {

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


        if (
            !type
        ) {

            continue;

        }


        const cell =
            document.createElement(
                "div"
            );


        const isStart =
            boardName ===
                "inner" &&
            i === 1;


        cell.className =
            `board-cell ${boardName}-cell`;


        cell.dataset.board =
            boardName;


        cell.dataset.position =
            i;


        cell.dataset.type =
            typeId;


        /* =============================================
           КОЛІР КОМІРКИ ЗАЛЕЖНО ВІД ТИПУ
        ============================================== */

        cell.classList.add(
            `cell-type-${typeId}`
        );


        if (
            isStart
        ) {

            cell.classList.add(
                "start-board-cell"
            );

        }


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


        if (
            typeId ===
            "bank"
        ) {

            cell.classList.add(
                "bank-board-cell"
            );

        }


        /* =============================================
           КООРДИНАТИ
        ============================================== */

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


        /* =============================================
           ОКРЕМА ЗОНА ПІД ФІШКИ

           ІКОНКА ПОЛЯ НЕ ПЕРЕКРИВАЄТЬСЯ.
        ============================================== */

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


            <div
                class="cell-piece-zone"
                data-piece-zone="${boardName}-${i}"
            ></div>

        `;


        /* =============================================
           КЛІК ПО КОМІРЦІ
        ============================================== */

        cell.addEventListener(
            "click",
            () => {

                handleBoardCellClick(
                    cell
                );

            }
        );


        /* =============================================
           DRAG & DROP
        ============================================== */

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
   35. КЛІК ПО КОМІРЦІ
========================================================= */

function handleBoardCellClick(
    cell
) {

    const board =
        cell.dataset.board;


    const position =
        Number(
            cell.dataset.position
        );


    /*
       ЯКЩО ЦЕ ПІДСВІЧЕНА КОМІРКА ПІСЛЯ КУБИКА —
       РУХАЄМО ГРАВЦЯ.
    */

    if (
        gameState.target &&
        gameState.target.board ===
            board &&
        gameState.target.position ===
            position
    ) {

        tryMovePlayerToCell(
            cell
        );


        return;

    }


    /*
       ІНАКШЕ ПОКАЗУЄМО ІНФОРМАЦІЮ ПРО ПОЛЕ.
    */

    showCellTypeInfo(
        cell.dataset.type
    );

}


/* =========================================================
   36. РОЗМІЩЕННЯ ВСІХ ФІШОК
========================================================= */

function placeAllPieces() {

    if (
        !gameState.player
    ) {

        return;

    }


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


    refreshAllPiecePositions();

}


/* =========================================================
   37. РОЗМІЩЕННЯ ОДНІЄЇ ФІШКИ
========================================================= */

function placePiece(
    participant,
    draggable = false
) {

    if (
        !participant ||
        !participant.token
    ) {

        return;

    }


    const cell =
        document.querySelector(

            `.${participant.board}-cell[data-position="${participant.position}"]`

        );


    if (
        !cell
    ) {

        return;

    }


    const pieceZone =
        cell.querySelector(
            ".cell-piece-zone"
        );


    if (
        !pieceZone
    ) {

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


    piece.title =
        participant.name;


    piece.dataset.playerId =
        participant.id;


    piece.className =
        participant.id ===
        "player"

            ? "board-piece player-piece"

            : "board-piece ai-piece";


    if (
        draggable
    ) {

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


    pieceZone.appendChild(
        piece
    );

}


/* =========================================================
   38. ОНОВЛЕННЯ ПОЗИЦІЇ ФІШОК У КОМІРЦІ

   ЯКЩО В ОДНІЙ КОМІРЦІ 2–3 ГРАВЦІ,
   ФІШКИ РОЗКЛАДАЄМО ПОРЯД,
   А НЕ ОДНА НА ОДНУ.
========================================================= */

function refreshAllPiecePositions() {

    document
        .querySelectorAll(
            ".cell-piece-zone"
        )
        .forEach(zone => {

            const pieces =
                Array.from(
                    zone.querySelectorAll(
                        ".board-piece"
                    )
                );


            pieces.forEach(
                (
                    piece,
                    index
                ) => {

                    piece.dataset.stackIndex =
                        index;

                }
            );


            zone.dataset.pieceCount =
                pieces.length;

        });

}


/* =========================================================
   39. ПЕРЕМІЩЕННЯ ФІШКИ В DOM
========================================================= */

function movePieceDOM(
    participantId,
    targetCell
) {

    const piece =
        document.querySelector(

            `.board-piece[data-player-id="${participantId}"]`

        );


    if (
        !piece ||
        !targetCell
    ) {

        return;

    }


    const pieceZone =
        targetCell.querySelector(
            ".cell-piece-zone"
        );


    if (
        !pieceZone
    ) {

        return;

    }


    pieceZone.appendChild(
        piece
    );


    refreshAllPiecePositions();

}


/* =========================================================
   40. КУБИК
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
        gameState.gameFinished
    ) {

        return;

    }


    if (
        gameState.currentTurn !==
        "player"
    ) {

        return;

    }


    if (
        gameState.target
    ) {

        showRaifikMessage(

            "Спочатку перейди на підсвічену комірку 🙂"

        );


        return;

    }


    /*
       Якщо є незавершене рішення по картці,
       новий кубик кидати не дозволяємо.
    */

    if (
        gameState.pendingCard
    ) {

        showRaifikMessage(

            "Спочатку заверши рішення по поточній картці."

        );


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


    if (
        !button ||
        !dice
    ) {

        return;

    }


    button.disabled =
        true;


    showRaifikMessage(

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


        await delay(
            65
        );

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


    const destination =
        gameState.target;


    const typeId =
        getCellTypeByPosition(
            destination.board,
            destination.position
        );


    const type =
        CELL_TYPES[
            typeId
        ];


    addLog({

        participant:
            gameState.player.name,

        dice:
            value,

        board:
            destination.board,

        position:
            destination.position,

        field:
            type
                ? type.name
                : "",

        action:
            `Кубик: ${value}`,

        details:
            type
                ? `Ціль — ${type.icon} ${type.name}, комірка ${destination.position}.`
                : `Ціль — комірка ${destination.position}.`

    });


    const message =
        document.getElementById(
            "diceMessage"
        );


    if (
        message
    ) {

        message.innerHTML = `

            Випало
            <strong>${value}</strong>.

            <br>

            Перейди на
            підсвічену комірку.

        `;

    }


    showRaifikMessage(

        `Випало ${value}! Натисни на підсвічену комірку або перенеси туди свою фішку.`

    );

}


/* =========================================================
   41. ОТРИМАТИ ТИП КОМІРКИ
========================================================= */

function getCellTypeByPosition(
    boardName,
    position
) {

    const board =
        boardName ===
        "inner"

            ? INNER_BOARD

            : OUTER_BOARD;


    return board[
        position - 1
    ];

}


/* =========================================================
   42. РОЗРАХУНОК МІСЦЯ ПІСЛЯ КУБИКА
========================================================= */

function calculateDestination(
    participant,
    steps
) {

    if (
        participant.board ===
        "inner"
    ) {

        const rawTarget =
            participant.position +
            steps;


        /*
           НЕ ДОЙШЛИ ДО КІНЦЯ
        */

        if (
            rawTarget <=
            GAME_CONFIG.innerCells
        ) {

            return {

                board:
                    "inner",

                position:
                    rawTarget

            };

        }


        /*
           ПЕРЕХІД НА ЗОВНІШНЄ ПОЛЕ

           Наприклад:
           стоїмо 27,
           випало 4.

           28 — 1 крок.
           Залишається 3.
           Отже зовнішнє поле — позиція 3.
        */

        const overflow =
            rawTarget -
            GAME_CONFIG.innerCells;


        return {

            board:
                "outer",

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

        board:
            "outer",

        position:
            target

    };

}


/* =========================================================
   43. ПІДСВІЧЕННЯ ЦІЛЬОВОЇ КОМІРКИ
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


    if (
        cell
    ) {

        cell.classList.add(
            "target-cell"
        );

    }

}


/* =========================================================
   44. РУХ ГРАВЦЯ
========================================================= */

async function tryMovePlayerToCell(
    cell
) {

    if (
        !gameState.target
    ) {

        return;

    }


    if (
        gameState.currentTurn !==
        "player"
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


    const typeId =
        getParticipantCellType(
            player
        );


    const type =
        CELL_TYPES[
            typeId
        ];


    addLog({

        participant:
            player.name,

        dice:
            gameState.diceValue,

        board:
            board,

        position:
            position,

        field:
            type
                ? type.name
                : "",

        action:
            "Перехід на поле",

        details:
            `${type?.icon || ""} ${type?.name || ""} · комірка ${position}`

    });


    /*
       ЯКЩО ПОТРАПИЛИ НА ПЕРЕХІД
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
   45. ПЕРЕХІД З МАЛОГО ПОЛЯ НА ВЕЛИКЕ
========================================================= */

async function handleInnerToOuterTransition(
    participant
) {

    showRaifikMessage(

        "🎉 Перший етап завершено! Тепер ти переходиш на велике поле."

    );


    addLog({

        participant:
            participant.name,

        board:
            "inner",

        position:
            GAME_CONFIG.innerCells,

        field:
            "Перехід",

        action:
            "Перехід на зовнішнє поле",

        details:
            "Гравець завершив внутрішній життєвий шлях."

    });


    await delay(
        900
    );


    participant.board =
        "outer";


    participant.position =
        1;


    const outerStart =
        document.querySelector(

            `.outer-cell[data-position="1"]`

        );


    if (
        outerStart
    ) {

        movePieceDOM(
            participant.id,
            outerStart
        );

    }


    addLog({

        participant:
            participant.name,

        board:
            "outer",

        position:
            1,

        field:
            CELL_TYPES[
                OUTER_BOARD[0]
            ]?.name || "",

        action:
            "Старт зовнішнього поля",

        details:
            "Гравець починає другий етап життєвого шляху."

    });


    await resolvePlayerCell();

}


/* =========================================================
   46. ПОТОЧНА КОМІРКА УЧАСНИКА
========================================================= */

function getParticipantCellType(
    participant
) {

    if (
        !participant
    ) {

        return null;

    }


    return getCellTypeByPosition(

        participant.board,

        participant.position

    );

}


/* =========================================================
   47. ОБРОБКА КОМІРКИ ГРАВЦЯ

   ВАЖЛИВО:
   КАРТКИ НЕ ПОКАЗУЄМО СПРАВА.

   ВОНИ ВІДКРИВАЮТЬСЯ
   У ЦЕНТРАЛЬНІЙ МОДАЛЦІ.
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


    if (
        !type
    ) {

        finishPlayerTurn();

        return;

    }


    showRaifikMessage(

        `${type.icon} Ти потрапив на «${type.name}».`

    );


    switch (
        typeId
    ) {

        /* =========================================
           ДОХІД
        ========================================== */

        case "income": {

            const income =
                calculatePlayerIncome(
                    player
                );


            applyEffects(
                player,
                {
                    money:
                        income
                }
            );


            addLog({

                participant:
                    player.name,

                dice:
                    gameState.diceValue,

                board:
                    player.board,

                position:
                    player.position,

                field:
                    type.name,

                action:
                    "Отримання доходу",

                details:
                    `+${formatMoney(income)}`

            });


            showSimpleResultModal({

                icon:
                    type.icon,

                typeName:
                    type.name,

                title:
                    "Отримання доходу",

                text:
                    "Ти отримуєш дохід відповідно до своєї поточної кар'єрної сходинки.",

                effects: {
                    money:
                        income
                }

            });


            break;

        }


        /* =========================================
           ПОДІЯ
        ========================================== */

        case "event":

            showThreeCardChoice(
                "event"
            );

            break;


        /* =========================================
           БАНК
        ========================================== */

        case "bank":

            showBankFieldChoice();

            break;


        /* =========================================
           ЖИТТЯ
        ========================================== */

        case "life":

            showLifeNumberChoice();

            break;


        /* =========================================
           ДОЛЯ
        ========================================== */

        case "fate":

            showRandomFateCard();

            break;


        /* =========================================
           LOUNGE
        ========================================== */

        case "lounge":

            showMandatoryEffectModal({

                type,

                title:
                    "Час для себе",

                text:
                    "Ти відпочиваєш і відновлюєш сили.",

                effects: {
                    energy:
                        15
                }

            });

            break;


        /* =========================================
           АКАДЕМІЯ
        ========================================== */

        case "academy":

            showMandatoryEffectModal({

                type,

                title:
                    "Розвиток навичок",

                text:
                    "Ти навчаєшся та розвиваєш свої soft skills.",

                effects: {

                    knowledge:
                        15,

                    reputation:
                        5

                }

            });

            break;


        /* =========================================
           ПЕРЕВІРКА МРІЇ
        ========================================== */

        case "dreamCheck":

            showDreamProgress(
                true
            );

            break;


        default:

            finishPlayerTurn();

    }

}


/* =========================================================
   48. ДОХІД ЗАЛЕЖНО ВІД КАР'ЄРИ

   ТЕПЕР "ДОХІД" ДІЙСНО РАХУЄТЬСЯ.

   ЧИМ ВИЩА КАР'ЄРА —
   ТИМ БІЛЬШИЙ ДОХІД.
========================================================= */

function calculatePlayerIncome(
    participant
) {

    const base =
        GAME_CONFIG.incomeAmount;


    const careerMultiplier =
        1 +
        participant.careerLevel *
        0.35;


    return Math.round(
        base *
        careerMultiplier
    );

}


/* =========================================================
   49. РАЙФИК — ТЕКСТ СПРАВА
========================================================= */

function showRaifikMessage(
    text
) {

    const textElement =
        document.getElementById(
            "raifikBoardText"
        );


    if (
        textElement
    ) {

        textElement.innerHTML =
            text;

    }

}


/* =========================================================
   50. МОДАЛЬНЕ ВІКНО
========================================================= */

function openGameInfoModal(
    html,
    options = {}
) {

    const modal =
        document.getElementById(
            "gameInfoModal"
        );


    const content =
        document.getElementById(
            "gameInfoContent"
        );


    const closeButton =
        document.getElementById(
            "gameInfoClose"
        );


    if (
        !modal ||
        !content
    ) {

        return;

    }


    content.innerHTML =
        html;


    /*
       Для картки,
       де рішення обов'язкове,
       можна заборонити закривати X.
    */

    if (
        closeButton
    ) {

        closeButton.hidden =
            options.locked ===
            true;

    }


    modal.hidden =
        false;


    document.body.classList.add(
        "game-modal-open"
    );

}


/* =========================================================
   51. ЗАКРИТТЯ МОДАЛКИ
========================================================= */

function closeGameInfoModal() {

    /*
       Якщо є незавершена картка —
       просто закрити її не можна.
    */

    if (
        gameState.pendingCard
    ) {

        showRaifikMessage(

            "Спочатку прийми рішення по картці 🙂"

        );


        return;

    }


    const modal =
        document.getElementById(
            "gameInfoModal"
        );


    const closeButton =
        document.getElementById(
            "gameInfoClose"
        );


    if (
        modal
    ) {

        modal.hidden =
            true;

    }


    if (
        closeButton
    ) {

        closeButton.hidden =
            false;

    }


    document.body.classList.remove(
        "game-modal-open"
    );

}


/* =========================================================
   52. ПРИМУСОВО ЗАКРИТИ МОДАЛКУ

   ВИКОРИСТОВУЄМО ПІСЛЯ
   ПРИЙНЯТОГО РІШЕННЯ.
========================================================= */

function forceCloseGameInfoModal() {

    const modal =
        document.getElementById(
            "gameInfoModal"
        );


    const closeButton =
        document.getElementById(
            "gameInfoClose"
        );


    if (
        modal
    ) {

        modal.hidden =
            true;

    }


    if (
        closeButton
    ) {

        closeButton.hidden =
            false;

    }


    document.body.classList.remove(
        "game-modal-open"
    );

}


/* =========================================================
   53. ПРОСТИЙ РЕЗУЛЬТАТ У МОДАЛЦІ

   Є КНОПКА "ЗАВЕРШИТИ ХІД".
========================================================= */

function showSimpleResultModal({

    icon,
    typeName,
    title,
    text,
    effects = {}

}) {

    openGameInfoModal(`

        <div class="game-result-popup">


            <div class="modal-type-badge">

                ${icon}
                ${typeName}

            </div>


            <h2>
                ${title}
            </h2>


            <p class="modal-main-text">

                ${text}

            </p>


            <div class="modal-effects">

                ${effectsHTML(
                    effects
                )}

            </div>


            <button
                id="simpleFinishTurnButton"
                class="
                    main-game-btn
                    finish-turn-btn
                "
            >
                ЗАВЕРШИТИ ХІД
            </button>


        </div>

    `, {
        locked:
            true
    });


    document
        .getElementById(
            "simpleFinishTurnButton"
        )
        ?.addEventListener(
            "click",
            () => {

                forceCloseGameInfoModal();

                finishPlayerTurn();

            }
        );

}


/* =========================================================
   54. ОБОВ'ЯЗКОВИЙ ЕФЕКТ

   ТУТ НЕМАЄ:
   - НЕ БЕРУ
   - ЧАСТКОВО

   БО СИТУАЦІЯ ОБОВ'ЯЗКОВА.
========================================================= */

function showMandatoryEffectModal({

    type,
    title,
    text,
    effects

}) {

    gameState.pendingCard = {

        type:
            "mandatory",

        title,

        effects

    };


    openGameInfoModal(`

        <div class="game-result-popup">


            <div class="modal-type-badge">

                ${type.icon}
                ${type.name}

            </div>


            <h2>
                ${title}
            </h2>


            <p class="modal-main-text">

                ${text}

            </p>


            <div class="modal-effects">

                ${effectsHTML(
                    effects
                )}

            </div>


            <div class="mandatory-card-note">

                Ця ситуація є обов'язковою.

            </div>


            <button
                id="mandatoryAcceptButton"
                class="
                    main-game-btn
                    finish-turn-btn
                "
            >

                ПРИЙНЯТИ

            </button>


        </div>

    `, {
        locked:
            true
    });


    document
        .getElementById(
            "mandatoryAcceptButton"
        )
        ?.addEventListener(
            "click",
            () => {

                applyEffects(
                    gameState.player,
                    effects
                );


                addLog({

                    participant:
                        gameState.player.name,

                    dice:
                        gameState.diceValue,

                    board:
                        gameState.player.board,

                    position:
                        gameState.player.position,

                    field:
                        type.name,

                    action:
                        title,

                    decision:
                        "Обов'язкова подія",

                    details:
                        effectsToText(
                            effects
                        )

                });


                gameState.pendingCard =
                    null;


                forceCloseGameInfoModal();


                finishPlayerTurn();

            }
        );

}


/* =========================================================
   55. ЕФЕКТИ — HTML
========================================================= */

function effectsHTML(
    effects = {}
) {

    const icons = {

        money:
            "💰",

        reputation:
            "⭐",

        knowledge:
            "🧠",

        energy:
            "⚡"

    };


    const labels = {

        money:
            "Гроші",

        reputation:
            "Репутація",

        knowledge:
            "Знання",

        energy:
            "Енергія"

    };


    return Object
        .entries(
            effects
        )
        .map(
            ([key, value]) => {

                let valueText;


                if (
                    key ===
                    "money"
                ) {

                    valueText =
                        `${
                            value > 0
                                ? "+"
                                : ""
                        }${formatMoney(value)}`;

                }

                else {

                    valueText =
                        `${
                            value > 0
                                ? "+"
                                : ""
                        }${value}`;

                }


                return `

                    <div class="modal-effect-item">

                        <span>
                            ${icons[key] || "•"}
                        </span>

                        <div>

                            <small>
                                ${labels[key] || key}
                            </small>

                            <strong>
                                ${valueText}
                            </strong>

                        </div>

                    </div>

                `;

            }
        )
        .join("");

}


/* =========================================================
   56. ЕФЕКТИ — ТЕКСТ ДЛЯ ЖУРНАЛУ
========================================================= */

function effectsToText(
    effects = {}
) {

    const labels = {

        money:
            "Гроші",

        reputation:
            "Репутація",

        knowledge:
            "Знання",

        energy:
            "Енергія"

    };


    return Object
        .entries(
            effects
        )
        .map(
            ([key, value]) => {

                let formatted =
                    value;


                if (
                    key ===
                    "money"
                ) {

                    formatted =
                        formatMoney(
                            value
                        );

                }


                return (
                    `${labels[key] || key}: ` +
                    `${value > 0 ? "+" : ""}` +
                    `${formatted}`
                );

            }
        )
        .join(" · ");

}


/* =========================================================
   57. ЗАСТОСУВАННЯ ЕФЕКТІВ
========================================================= */

function applyEffects(
    participant,
    effects = {}
) {

    if (
        !participant
    ) {

        return;

    }


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
                        Number(value);

                }

            }
        );


    /*
       НЕ ДАЄМО ПОКАЗНИКАМ
       ПАДАТИ НИЖЧЕ НУЛЯ.

       ГРОШІ МОЖУТЬ БУТИ МІНУСОВИМИ,
       БО ПІЗНІШЕ ПІДКЛЮЧИМО БОРГИ / КРЕДИТ.
    */

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


    participant.energy =
        clamp(
            participant.energy,
            0,
            100
        );


    checkCareerProgress(
        participant
    );


    if (
        participant.id ===
        "player"
    ) {

        updatePlayerStatsUI();

    }

}


/* =========================================================
   58. ОНОВЛЕННЯ HUD
========================================================= */

function updatePlayerStatsUI() {

    const player =
        gameState.player;


    if (
        !player
    ) {

        return;

    }


    const moneyElement =
        document.getElementById(
            "moneyValue"
        );


    const reputationElement =
        document.getElementById(
            "reputationValue"
        );


    const knowledgeElement =
        document.getElementById(
            "knowledgeValue"
        );


    const energyElement =
        document.getElementById(
            "energyValue"
        );


    const professionElement =
        document.getElementById(
            "hudProfessionValue"
        );


    if (
        moneyElement
    ) {

        moneyElement.textContent =
            formatMoney(
                player.money
            );

    }


    if (
        reputationElement
    ) {

        reputationElement.textContent =
            player.reputation;

    }


    if (
        knowledgeElement
    ) {

        knowledgeElement.textContent =
            player.knowledge;

    }


    if (
        energyElement
    ) {

        energyElement.textContent =
            player.energy;

    }


    if (
        professionElement
    ) {

        professionElement.textContent =
            getProfessionName(

                player
                    .sector
                    .levels[
                        player.careerLevel
                    ],

                player.gender

            );

    }

}


/* =========================================================
   59. ПЕРЕВІРКА КАР'ЄРНОГО ЗРОСТАННЯ
========================================================= */

function checkCareerProgress(
    participant
) {

    if (
        !participant ||
        !participant.sector
    ) {

        return;

    }


    const nextLevel =
        participant.careerLevel + 1;


    if (
        nextLevel >=
        participant.sector.levels.length
    ) {

        return;

    }


    const required =
        CAREER_LEVEL_STATS[
            nextLevel
        ];


    if (
        !required
    ) {

        return;

    }


    const ready =

        participant.money >=
            required.money &&

        participant.reputation >=
            required.reputation &&

        participant.knowledge >=
            required.knowledge &&

        participant.energy >=
            required.energy;


    if (
        !ready
    ) {

        return;

    }


    participant.careerLevel =
        nextLevel;


    const profession =
        getProfessionName(

            participant
                .sector
                .levels[
                    participant.careerLevel
                ],

            participant.gender

        );


    addLog({

        participant:
            participant.name,

        action:
            "Кар'єрне зростання",

        details:
            `Нова професія: ${profession}.`

    });


    if (
        participant.id ===
        "player"
    ) {

        showRaifikMessage(

            `🎉 Нова кар'єрна сходинка: ${profession}!`

        );

    }

}


/* =========================================================
   60. ОЧИЩЕННЯ ПІДСВІЧЕНИХ КОМІРОК
========================================================= */

function clearTargetCells() {

    document
        .querySelectorAll(
            ".target-cell"
        )
        .forEach(cell => {

            cell.classList.remove(
                "target-cell"
            );

        });

}


/* =========================================================
   61. ЗАВЕРШЕННЯ ХОДУ ГРАВЦЯ

   ПІСЛЯ КНОПКИ
   "ЗАВЕРШИТИ ХІД"
   ПОЧИНАЮТЬ ХОДИТИ AI.
========================================================= */

function finishPlayerTurn() {

    if (
        gameState.gameFinished
    ) {

        return;

    }


    gameState.player.completedTurns++;


    gameState.pendingCard =
        null;


    gameState.pendingDecision =
        null;


    gameState.diceValue =
        null;


    gameState.target =
        null;


    clearTargetCells();


    addLog({

        participant:
            gameState.player.name,

        action:
            "Хід завершено",

        details:
            `Хід №${gameState.turnNumber}`

    });


    gameState.turnNumber++;


    startAITurns();

}


/* =========================================================
   62. СТАРТ ХОДІВ AI
========================================================= */

async function startAITurns() {

    if (
        gameState.gameFinished
    ) {

        return;

    }


    if (
        gameState.currentTurn ===
        "ai"
    ) {

        return;

    }


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


    for (
        const ai of
        gameState.opponents
    ) {

        await runAITurn(
            ai
        );

    }


    if (
        gameState.gameFinished
    ) {

        return;

    }


    gameState.currentTurn =
        "player";


    if (
        rollButton
    ) {

        rollButton.disabled =
            false;

    }


    const title =
        document.getElementById(
            "diceTitle"
        );


    if (
        title
    ) {

        title.textContent =
            "ТВІЙ ХІД";

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


    showRaifikMessage(

        `${gameState.player.name}, тепер твій хід. Кидай кубик 🎲`

    );

}


/* =========================================================
   63. ХІД AI
========================================================= */

async function runAITurn(
    ai
) {

    if (
        gameState.gameFinished
    ) {

        return;

    }


    const title =
        document.getElementById(
            "diceTitle"
        );


    const diceElement =
        document.getElementById(
            "dice"
        );


    if (
        title
    ) {

        title.textContent =
            `ХІД: ${ai.name}`;

    }


    showRaifikMessage(

        `Зараз ходить ${ai.name}.`

    );


    await delay(
        GAME_CONFIG.aiThinkDelay
    );


    for (
        let i = 0;
        i < 6;
        i++
    ) {

        if (
            diceElement
        ) {

            diceElement.textContent =
                randomItem(
                    DICE_FACES
                );

        }


        await delay(
            75
        );

    }


    const dice =
        randomNumber(
            1,
            6
        );


    if (
        diceElement
    ) {

        diceElement.textContent =
            DICE_FACES[
                dice - 1
            ];

    }


    const destination =
        calculateDestination(
            ai,
            dice
        );


    addLog({

        participant:
            ai.name,

        dice,

        board:
            destination.board,

        position:
            destination.position,

        action:
            `Кубик: ${dice}`,

        details:
            "AI виконує свій хід."

    });


    await moveAIToDestination(

        ai,

        destination

    );


    await resolveAICell(
        ai
    );


    ai.completedTurns++;


    await delay(
        GAME_CONFIG.aiResultDelay
    );

}


/* =========================================================
   64. РУХ AI ПО КРОКАХ
========================================================= */

async function moveAIToDestination(
    ai,
    destination
) {

    /*
       РУХ ПОТОЧНИМ МАРШРУТОМ ДО ЦІЛІ.
       Для AI робимо анімовані покрокові переходи.
    */

    while (
        ai.board !==
            destination.board ||
        ai.position !==
            destination.position
    ) {

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


        if (
            cell
        ) {

            movePieceDOM(
                ai.id,
                cell
            );

        }


        await delay(
            GAME_CONFIG.aiStepDelay
        );

    }

}


/* =========================================================
   65. AI — ОБРОБКА ПОЛЯ
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


    if (
        !type
    ) {

        return;

    }


    showRaifikMessage(

        `${ai.name}: ${type.icon} ${type.name}`

    );


    let effects = {};


    let resultTitle =
        type.name;


    switch (
        typeId
    ) {

        case "income":

            effects = {

                money:
                    calculatePlayerIncome(
                        ai
                    )

            };


            resultTitle =
                "Отримання доходу";

            break;


        case "event":

            {

                const card =
                    randomItem(
                        CARD_DECKS.event
                    );


                /*
                   AI автоматично приймає
                   приблизно 65% добровільних рішень.
                */

                const accept =
                    card.decisionType ===
                    "mandatory" ||
                    Math.random() <
                    0.65;


                if (
                    accept
                ) {

                    effects =
                        card.effects;

                    resultTitle =
                        card.title;

                }

                else {

                    effects =
                        {};

                    resultTitle =
                        `${card.title} — відмова`;

                }

            }

            break;


        case "life":

            {

                const card =
                    randomItem(
                        CARD_DECKS.life
                    );


                const accept =
                    card.decisionType ===
                    "mandatory" ||
                    Math.random() <
                    0.65;


                if (
                    accept
                ) {

                    effects =
                        card.effects;

                    resultTitle =
                        card.title;

                }

                else {

                    resultTitle =
                        `${card.title} — відмова`;

                }

            }

            break;


        case "fate":

            {

                const card =
                    randomItem(
                        CARD_DECKS.fate
                    );


                effects =
                    card.effects;


                resultTitle =
                    card.title;

            }

            break;


        case "bank":

            /*
               ПОКИ AI ОТРИМУЄ
               НЕВЕЛИКИЙ ФІНАНСОВИЙ ЕФЕКТ.

               Повна логіка банку
               для AI підключиться пізніше.
            */

            effects = {

                knowledge:
                    3

            };


            resultTitle =
                "Фінансове рішення";

            break;


        case "lounge":

            effects = {

                energy:
                    15

            };

            break;


        case "academy":

            effects = {

                knowledge:
                    15,

                reputation:
                    5

            };

            break;


        case "dreamCheck":

            effects =
                {};

            resultTitle =
                "Перевірка Мрії";

            break;


        case "transition":

            effects =
                {};

            break;

    }


    if (
        Object.keys(
            effects
        ).length
    ) {

        applyEffects(
            ai,
            effects
        );

    }


    addLog({

        participant:
            ai.name,

        board:
            ai.board,

        position:
            ai.position,

        field:
            type.name,

        action:
            resultTitle,

        details:
            Object.keys(
                effects
            ).length

                ? effectsToText(
                    effects
                )

                : "Без зміни показників."

    });


    showAIResultInPanel(

        ai,

        resultTitle,

        effects

    );

}


/* =========================================================
   66. РЕЗУЛЬТАТ AI У ПРАВІЙ ПАНЕЛІ

   ВЕЛИКІ КАРТКИ ГРАВЦЯ —
   ТІЛЬКИ В МОДАЛЬНОМУ ВІКНІ.

   AI МОЖЕ КОРОТКО ПОКАЗУВАТИСЯ СПРАВА.
========================================================= */

function showAIResultInPanel(
    ai,
    title,
    effects = {}
) {

    const panel =
        document.getElementById(
            "raifikBoardPanel"
        );


    if (
        !panel
    ) {

        return;

    }


    panel.innerHTML = `

        <img
            src="${ai.token.image}"
            class="ai-panel-token"
            alt="${ai.name}"
        >


        <div>

            <strong>
                ${ai.name}
            </strong>


            <p>
                ${title}
            </p>


            ${
                Object.keys(
                    effects
                ).length

                    ? `

                        <div class="mini-ai-effects">

                            ${effectsHTML(
                                effects
                            )}

                        </div>

                      `

                    : ""
            }

        </div>

    `;

}


/* =========================================================
   67. ІНФО ПРО СУПЕРНИКА
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


    if (
        !participant
    ) {

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


            <h2>
                ${participant.name}
            </h2>


            <p class="participant-profession">

                ${participant.sector.icon}

                ${profession}

            </p>


            <div class="participant-popup-stats">


                <span>
                    💰 ${formatMoney(
                        participant.money
                    )}
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

                <small>
                    МРІЯ
                </small>

                <strong>

                    ${participant.dream.icon}

                    ${participant.dream.name}

                </strong>

            </div>


            <div class="participant-popup-position">

                ${
                    participant.board ===
                    "inner"

                        ? "Внутрішнє поле"

                        : "Зовнішнє поле"
                }

                · комірка

                ${participant.position}

            </div>


        </div>

    `);

}


/* =========================================================
   68. КІНЕЦЬ ЧАСТИНИ 2 / 3

   ЧАСТИНА 3 БУДЕ МІСТИТИ:

   - картки Подія
   - картки Життя
   - Доля
   - "БЕРУ"
   - "НЕ БЕРУ"
   - "ЧАСТКОВО"
   - при мінусовій обов'язковій події
     НЕ БУДЕ "ЧАСТКОВО"

   - поле введення часткової суми
   - кнопка "ЗАВЕРШИТИ ХІД"

   - Банк:
     кредит
     депозит
     страхування
     інвестиції
     валютні операції
     + окремі місця під майбутні формули

   - кар'єра:
     поточна сходинка
     наступна сходинка
     скільки саме бракує
     по кожному показнику

   - Мрія:
     скільки вже є
     скільки потрібно
     скільки бракує

   - Типи полів у модалці

   - клікабельний Журнал ходів:
     кубик
     комірка
     тип поля
     картка
     рішення
     сума
     ефекти

   - Завершити гру

========================================================= */
/* =========================================================
   CV ЖИТТЯ
   SCRIPT.JS
   ЧАСТИНА 3 / 3

   КАРТКИ
   РІШЕННЯ
   БАНК
   КАР'ЄРА
   МРІЯ
   ТИПИ ПОЛІВ
   ЖУРНАЛ
   ЗАВЕРШЕННЯ ГРИ
========================================================= */


/* =========================================================
   69. ПОДІЯ — ВИБІР 1 З 3 КАРТОК
========================================================= */

function showThreeCardChoice(
    deckName
) {

    const deck =
        CARD_DECKS[
            deckName
        ];


    if (
        !deck ||
        !deck.length
    ) {

        finishPlayerTurn();

        return;

    }


    const choices =
        [...deck]
            .sort(
                () =>
                    Math.random() -
                    0.5
            )
            .slice(
                0,
                Math.min(
                    3,
                    deck.length
                )
            );


    const type =
        CELL_TYPES[
            deckName
        ];


    gameState.pendingCard = {
        type:
            "choice"
    };


    openGameInfoModal(`

        <div class="three-card-popup">


            <div class="modal-type-badge">

                ${type.icon}
                ${type.name}

            </div>


            <h2>
                Обери картку
            </h2>


            <p class="modal-main-text">

                Перед тобою три можливі ситуації.

                <br>

                Обери одну — і дізнайся,
                що сталося у твоєму житті.

            </p>


            <div class="three-card-choice">

                ${
                    choices
                        .map(
                            (card, index) => `

                                <button
                                    class="hidden-game-card"
                                    data-choice="${index}"
                                >

                                    <span class="hidden-card-icon">
                                        ?
                                    </span>

                                    <small>
                                        КАРТКА
                                        ${index + 1}
                                    </small>

                                </button>

                            `
                        )
                        .join("")
                }

            </div>


        </div>

    `, {
        locked:
            true
    });


    document
        .querySelectorAll(
            ".hidden-game-card"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const index =
                        Number(
                            button.dataset.choice
                        );


                    const card =
                        choices[
                            index
                        ];


                    showPlayerDecisionCard(

                        deckName,

                        card

                    );

                }
            );

        });

}


/* =========================================================
   70. КАРТКА ГРАВЦЯ

   ПІДТРИМУЄ:
   - БЕРУ
   - НЕ БЕРУ
   - ЧАСТКОВО
   - ОБОВ'ЯЗКОВУ ПОДІЮ

   decisionType:
   "optional"
   "mandatory"

   allowPartial:
   true / false
========================================================= */

function showPlayerDecisionCard(
    deckName,
    card
) {

    if (
        !card
    ) {

        return;

    }


    const type =
        CELL_TYPES[
            deckName
        ];


    const decisionType =
        card.decisionType ||
        "optional";


    const isMandatory =
        decisionType ===
        "mandatory";


    /*
       ЧАСТКОВО дозволяємо
       тільки якщо це прямо вказано у картці.
    */

    const allowPartial =
        card.allowPartial ===
        true &&
        !isMandatory;


    gameState.pendingCard = {

        type:
            "card",

        deckName,

        card

    };


    let buttonsHTML =
        "";


    /* =============================================
       ОБОВ'ЯЗКОВА ПОДІЯ
    ============================================== */

    if (
        isMandatory
    ) {

        buttonsHTML = `

            <button
                id="mandatoryCardAccept"
                class="
                    main-game-btn
                    card-decision-main
                "
            >

                ПРИЙНЯТИ

            </button>

        `;

    }


    /* =============================================
       ДОБРОВІЛЬНА ПОДІЯ
    ============================================== */

    else {

        buttonsHTML = `

            <button
                id="cardTakeButton"
                class="
                    main-game-btn
                    card-decision-main
                "
            >

                БЕРУ

            </button>


            <button
                id="cardSkipButton"
                class="
                    secondary-game-btn
                    card-decision-secondary
                "
            >

                НЕ БЕРУ

            </button>


            ${
                allowPartial

                    ? `

                        <button
                            id="cardPartialButton"
                            class="
                                secondary-game-btn
                                card-decision-partial
                            "
                        >

                            ЧАСТКОВО

                        </button>

                      `

                    : ""
            }

        `;

    }


    openGameInfoModal(`

        <div class="decision-card-popup">


            <div class="modal-type-badge">

                ${type.icon}
                ${type.name}

            </div>


            <h2>
                ${card.title}
            </h2>


            <p class="modal-main-text">

                ${card.text}

            </p>


            <div class="modal-effects">

                ${effectsHTML(
                    card.effects
                )}

            </div>


            ${
                isMandatory

                    ? `

                        <div class="mandatory-card-note">

                            ⚠️ Ця ситуація є
                            обов'язковою.

                        </div>

                      `

                    : `

                        <div class="optional-card-note">

                            Ти можеш прийняти
                            або відхилити цю можливість.

                        </div>

                      `
            }


            <div class="card-decision-buttons">

                ${buttonsHTML}

            </div>


            <div
                id="partialDecisionArea"
                class="partial-decision-area"
                hidden
            ></div>


        </div>

    `, {
        locked:
            true
    });


    /* =============================================
       ОБОВ'ЯЗКОВА
    ============================================== */

    document
        .getElementById(
            "mandatoryCardAccept"
        )
        ?.addEventListener(
            "click",
            () => {

                acceptFullCard(
                    deckName,
                    card,
                    "Обов'язкова подія"
                );

            }
        );


    /* =============================================
       БЕРУ
    ============================================== */

    document
        .getElementById(
            "cardTakeButton"
        )
        ?.addEventListener(
            "click",
            () => {

                acceptFullCard(
                    deckName,
                    card,
                    "Беру"
                );

            }
        );


    /* =============================================
       НЕ БЕРУ
    ============================================== */

    document
        .getElementById(
            "cardSkipButton"
        )
        ?.addEventListener(
            "click",
            () => {

                rejectCard(
                    deckName,
                    card
                );

            }
        );


    /* =============================================
       ЧАСТКОВО
    ============================================== */

    document
        .getElementById(
            "cardPartialButton"
        )
        ?.addEventListener(
            "click",
            () => {

                showPartialCardDecision(

                    deckName,

                    card

                );

            }
        );

}


/* =========================================================
   71. БЕРУ / ОБОВ'ЯЗКОВА ПОДІЯ
========================================================= */

function acceptFullCard(
    deckName,
    card,
    decision
) {

    applyEffects(

        gameState.player,

        card.effects

    );


    addLog({

        participant:
            gameState.player.name,

        dice:
            gameState.diceValue,

        board:
            gameState.player.board,

        position:
            gameState.player.position,

        field:
            CELL_TYPES[
                deckName
            ]?.name || "",

        card:
            card.title,

        action:
            card.title,

        decision,

        details:
            effectsToText(
                card.effects
            )

    });


    gameState.pendingCard =
        null;


    showDecisionResult({

        title:
            card.title,

        text:
            decision ===
            "Беру"

                ? "Рішення прийнято."

                : "Подію застосовано.",

        effects:
            card.effects

    });

}


/* =========================================================
   72. НЕ БЕРУ
========================================================= */

function rejectCard(
    deckName,
    card
) {

    addLog({

        participant:
            gameState.player.name,

        dice:
            gameState.diceValue,

        board:
            gameState.player.board,

        position:
            gameState.player.position,

        field:
            CELL_TYPES[
                deckName
            ]?.name || "",

        card:
            card.title,

        action:
            card.title,

        decision:
            "Не беру",

        details:
            "Гравець відмовився від можливості."

    });


    gameState.pendingCard =
        null;


    showDecisionResult({

        title:
            card.title,

        text:
            "Ти вирішив(ла) не брати цю можливість.",

        effects:
            {}

    });

}


/* =========================================================
   73. ЧАСТКОВЕ РІШЕННЯ

   ПРИКЛАД:
   картка має money: -20000

   Гравець може сам ввести,
   яку частину суми готовий витратити.

   Інші позитивні/негативні показники
   масштабуються пропорційно.
========================================================= */

function showPartialCardDecision(
    deckName,
    card
) {

    const area =
        document.getElementById(
            "partialDecisionArea"
        );


    if (
        !area
    ) {

        return;

    }


    const moneyEffect =
        Number(
            card.effects?.money ||
            0
        );


    const maxAmount =
        Math.abs(
            moneyEffect
        );


    if (
        maxAmount <=
        0
    ) {

        area.hidden =
            false;


        area.innerHTML = `

            <div class="form-error">

                Для цієї картки
                часткову суму визначити неможливо.

            </div>

        `;


        return;

    }


    area.hidden =
        false;


    area.innerHTML = `

        <div class="partial-card-box">


            <label
                for="partialAmountInput"
            >

                Яку суму ти готовий(а)
                взяти / витратити?

            </label>


            <div class="partial-money-input">

                <input
                    id="partialAmountInput"
                    type="number"
                    min="1"
                    max="${maxAmount}"
                    step="100"
                    placeholder="Введи суму"
                >

                <span>
                    грн
                </span>

            </div>


            <small>

                Максимум:
                ${formatMoney(
                    maxAmount
                )}

            </small>


            <div
                id="partialAmountError"
                class="form-error"
            ></div>


            <button
                id="confirmPartialAmount"
                class="main-game-btn"
            >

                ПІДТВЕРДИТИ СУМУ

            </button>


        </div>

    `;


    document
        .getElementById(
            "confirmPartialAmount"
        )
        ?.addEventListener(
            "click",
            () => {

                resolvePartialCardDecision(

                    deckName,

                    card,

                    maxAmount

                );

            }
        );

}


/* =========================================================
   74. ЗАСТОСУВАТИ ЧАСТКОВУ СУМУ
========================================================= */

function resolvePartialCardDecision(
    deckName,
    card,
    maxAmount
) {

    const input =
        document.getElementById(
            "partialAmountInput"
        );


    const error =
        document.getElementById(
            "partialAmountError"
        );


    if (
        !input
    ) {

        return;

    }


    const amount =
        Number(
            input.value
        );


    if (
        !amount ||
        amount <= 0 ||
        amount >
            maxAmount
    ) {

        if (
            error
        ) {

            error.textContent =
                `Введи суму від 1 до ${formatMoney(maxAmount)}.`;

        }


        return;

    }


    const ratio =
        amount /
        maxAmount;


    const partialEffects =
        {};


    Object
        .entries(
            card.effects
        )
        .forEach(
            ([key, value]) => {

                if (
                    key ===
                    "money"
                ) {

                    partialEffects.money =
                        value < 0

                            ? -amount

                            : amount;

                }

                else {

                    partialEffects[key] =
                        Math.round(
                            value *
                            ratio
                        );

                }

            }
        );


    applyEffects(

        gameState.player,

        partialEffects

    );


    addLog({

        participant:
            gameState.player.name,

        dice:
            gameState.diceValue,

        board:
            gameState.player.board,

        position:
            gameState.player.position,

        field:
            CELL_TYPES[
                deckName
            ]?.name || "",

        card:
            card.title,

        action:
            card.title,

        decision:
            "Частково",

        amount,

        details:
            effectsToText(
                partialEffects
            )

    });


    gameState.pendingCard =
        null;


    showDecisionResult({

        title:
            card.title,

        text:
            `Ти обрав(ла) частковий варіант на ${formatMoney(amount)}.`,

        effects:
            partialEffects

    });

}


/* =========================================================
   75. РЕЗУЛЬТАТ РІШЕННЯ
========================================================= */

function showDecisionResult({

    title,
    text,
    effects = {}

}) {

    openGameInfoModal(`

        <div class="decision-result-popup">


            <div class="decision-result-icon">
                ✓
            </div>


            <h2>
                ${title}
            </h2>


            <p class="modal-main-text">

                ${text}

            </p>


            ${
                Object.keys(
                    effects
                ).length

                    ? `

                        <div class="modal-effects">

                            ${effectsHTML(
                                effects
                            )}

                        </div>

                      `

                    : ""
            }


            <button
                id="decisionFinishTurnButton"
                class="main-game-btn"
            >

                ЗАВЕРШИТИ ХІД

            </button>


        </div>

    `, {
        locked:
            true
    });


    document
        .getElementById(
            "decisionFinishTurnButton"
        )
        ?.addEventListener(
            "click",
            () => {

                forceCloseGameInfoModal();

                finishPlayerTurn();

            }
        );

}


/* =========================================================
   76. ЖИТТЯ — ЧИСЛО ВІД 1 ДО 20
========================================================= */

function showLifeNumberChoice() {

    gameState.pendingCard = {
        type:
            "life-number"
    };


    openGameInfoModal(`

        <div class="life-number-popup">


            <div class="modal-type-badge">

                ❤️ ЖИТТЯ

            </div>


            <h2>
                Обери число
            </h2>


            <p class="modal-main-text">

                Загадай число від 1 до 20.

                <br>

                За кожним числом
                прихована життєва ситуація.

            </p>


            <input
                id="lifeNumberInput"
                class="life-number-input"
                type="number"
                min="1"
                max="20"
                placeholder="1–20"
            >


            <div
                id="lifeNumberError"
                class="form-error"
            ></div>


            <button
                id="lifeNumberButton"
                class="main-game-btn"
            >

                ВІДКРИТИ КАРТКУ

            </button>


        </div>

    `, {
        locked:
            true
    });


    document
        .getElementById(
            "lifeNumberButton"
        )
        ?.addEventListener(
            "click",
            resolveLifeNumber
        );

}


/* =========================================================
   77. ЖИТТЯ — ВІДКРИТТЯ КАРТКИ
========================================================= */

function resolveLifeNumber() {

    const input =
        document.getElementById(
            "lifeNumberInput"
        );


    const error =
        document.getElementById(
            "lifeNumberError"
        );


    if (
        !input
    ) {

        return;

    }


    const value =
        Number(
            input.value
        );


    if (
        value < 1 ||
        value > 20
    ) {

        if (
            error
        ) {

            error.textContent =
                "Введи число від 1 до 20 🙂";

        }


        return;

    }


    const deck =
        CARD_DECKS.life;


    const index =
        (
            value - 1
        ) %
        deck.length;


    const card =
        deck[
            index
        ];


    showPlayerDecisionCard(

        "life",

        card

    );

}


/* =========================================================
   78. ДОЛЯ

   ТУТ ГРАВЕЦЬ НЕ ОБИРАЄ КАРТКУ.
   ДОЛЯ ВИПАДАЄ ВИПАДКОВО.

   І ПОДІЯ ЗАСТОСОВУЄТЬСЯ ОБОВ'ЯЗКОВО.
========================================================= */

async function showRandomFateCard() {

    gameState.pendingCard = {
        type:
            "fate"
    };


    openGameInfoModal(`

        <div class="fate-loading-popup">


            <div class="fate-big-icon">
                ⚡
            </div>


            <h2>
                Доля
            </h2>


            <p class="modal-main-text">

                Тут ти нічого не обираєш.

                <br>

                Подивимось,
                що приготувало життя...

            </p>


            <div class="fate-loading">
                ✦ ✦ ✦
            </div>


        </div>

    `, {
        locked:
            true
    });


    await delay(
        1100
    );


    const card =
        randomItem(
            CARD_DECKS.fate
        );


    /*
       Для Долі примусово
       робимо картку обов'язковою,
       незалежно від старих налаштувань.
    */

    const fateCard = {

        ...card,

        decisionType:
            "mandatory",

        allowPartial:
            false

    };


    showPlayerDecisionCard(

        "fate",

        fateCard

    );

}


/* =========================================================
   79. БАНК — ПОЛЕ БАНК

   КОЛИ ГРАВЕЦЬ СТАЄ НА БАНК,
   ВІН ОБИРАЄ, ЩО ХОЧЕ ЗРОБИТИ.
========================================================= */

function showBankFieldChoice() {

    ensurePlayerBankState();


    gameState.pendingCard = {
        type:
            "bank-field"
    };


    openGameInfoModal(`

        <div class="bank-field-popup">


            <div class="bank-hub-header">

                <div class="bank-hub-main-icon">
                    🏦
                </div>


                <div>

                    <span class="bank-hub-label">
                        ФІНАНСОВЕ РІШЕННЯ
                    </span>

                    <h2>
                        БАНК
                    </h2>

                </div>

            </div>


            <p class="modal-main-text">

                Ти потрапив(ла) на поле Банку.

                <br>

                Обери фінансову дію,
                яку хочеш виконати.

            </p>


            <div class="bank-action-grid">


                <button
                    class="bank-action-card"
                    data-bank-action="credit"
                >

                    <span>
                        💳
                    </span>

                    <strong>
                        Взяти кредит
                    </strong>

                    <small>
                        Позичити кошти у банку
                    </small>

                </button>


                <button
                    class="bank-action-card"
                    data-bank-action="deposit"
                >

                    <span>
                        🏦
                    </span>

                    <strong>
                        Відкрити депозит
                    </strong>

                    <small>
                        Відкласти кошти
                        та отримувати дохід
                    </small>

                </button>


                <button
                    class="bank-action-card"
                    data-bank-action="insurance"
                >

                    <span>
                        🛡️
                    </span>

                    <strong>
                        Страхування
                    </strong>

                    <small>
                        Захиститися
                        від частини ризиків
                    </small>

                </button>


                <button
                    class="bank-action-card"
                    data-bank-action="investment"
                >

                    <span>
                        📈
                    </span>

                    <strong>
                        Інвестиції
                    </strong>

                    <small>
                        Інвестувати частину коштів
                    </small>

                </button>


                <button
                    class="bank-action-card"
                    data-bank-action="currency"
                >

                    <span>
                        💱
                    </span>

                    <strong>
                        Валютні операції
                    </strong>

                    <small>
                        Купівля або продаж валюти
                    </small>

                </button>


            </div>


            <button
                id="skipBankActionButton"
                class="secondary-game-btn"
            >

                НІЧОГО НЕ РОБИТИ

            </button>


        </div>

    `, {
        locked:
            true
    });


    document
        .querySelectorAll(
            ".bank-action-card"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    openBankAction(

                        button.dataset.bankAction,

                        true

                    );

                }
            );

        });


    document
        .getElementById(
            "skipBankActionButton"
        )
        ?.addEventListener(
            "click",
            () => {

                addLog({

                    participant:
                        gameState.player.name,

                    dice:
                        gameState.diceValue,

                    board:
                        gameState.player.board,

                    position:
                        gameState.player.position,

                    field:
                        "Банк",

                    action:
                        "Банк",

                    decision:
                        "Нічого не робити",

                    details:
                        "Гравець пропустив банківську дію."

                });


                gameState.pendingCard =
                    null;


                forceCloseGameInfoModal();


                finishPlayerTurn();

            }
        );

}


/* =========================================================
   80. БАНК — ГОЛОВНИЙ HUD

   ЦЕ ВІКНО МОЖНА ВІДКРИВАТИ
   У БУДЬ-ЯКИЙ МОМЕНТ,
   ЩОБ ПОДИВИТИСЯ СВОЇ ПРОДУКТИ.

   ФІНАНСОВУ ОПЕРАЦІЮ З HUD
   ПОКИ НЕ ПРОВОДИМО,
   ЯКЩО ГРАВЕЦЬ НЕ НА ПОЛІ БАНК.
========================================================= */

function showBankHub() {

    ensurePlayerBankState();


    const bank =
        gameState.player.bank;


    const credit =
        bank.credit;


    const deposit =
        bank.deposit;


    const insurance =
        bank.insurance;


    const investment =
        bank.investment;


    const currency =
        bank.currency;


    openGameInfoModal(`

        <div class="bank-hub-popup">


            <div class="bank-hub-header">

                <div class="bank-hub-main-icon">
                    🏦
                </div>


                <div>

                    <span class="bank-hub-label">
                        МОЇ ФІНАНСИ
                    </span>

                    <h2>
                        БАНК
                    </h2>

                </div>

            </div>


            <div class="bank-status-grid">


                <div class="bank-status-card">

                    <span>
                        💳
                    </span>

                    <div>

                        <small>
                            КРЕДИТ
                        </small>

                        <strong>

                            ${
                                credit.active

                                    ? formatMoney(
                                        credit.balance
                                    )

                                    : "Немає"
                            }

                        </strong>

                    </div>

                </div>


                <div class="bank-status-card">

                    <span>
                        🏦
                    </span>

                    <div>

                        <small>
                            ДЕПОЗИТ
                        </small>

                        <strong>

                            ${
                                deposit.active

                                    ? formatMoney(
                                        deposit.balance
                                    )

                                    : "Немає"
                            }

                        </strong>

                    </div>

                </div>


                <div class="bank-status-card">

                    <span>
                        🛡️
                    </span>

                    <div>

                        <small>
                            СТРАХУВАННЯ
                        </small>

                        <strong>

                            ${
                                insurance.active

                                    ? "Активне"

                                    : "Немає"
                            }

                        </strong>

                    </div>

                </div>


                <div class="bank-status-card">

                    <span>
                        📈
                    </span>

                    <div>

                        <small>
                            ІНВЕСТИЦІЇ
                        </small>

                        <strong>

                            ${
                                investment.active

                                    ? formatMoney(
                                        investment.balance
                                    )

                                    : "Немає"
                            }

                        </strong>

                    </div>

                </div>


                <div class="bank-status-card">

                    <span>
                        💱
                    </span>

                    <div>

                        <small>
                            ВАЛЮТА
                        </small>

                        <strong>

                            ${
                                currency.balance
                                    ? currency.balance.toFixed(2)
                                    : "0"
                            }

                            ${currency.code || "USD"}

                        </strong>

                    </div>

                </div>


            </div>


            <div class="bank-hub-note">

                💡 Банківські продукти
                вже мають окремі блоки логіки.

                Ми зможемо змінювати
                формули кредиту,
                депозиту,
                страхування,
                інвестицій
                та валюти окремо,
                не переписуючи всю гру.

            </div>


        </div>

    `);

}


/* =========================================================
   81. ВІДКРИТИ КОНКРЕТНУ БАНКІВСЬКУ ДІЮ
========================================================= */

function openBankAction(
    actionId,
    fromBankField = false
) {

    switch (
        actionId
    ) {

        case "credit":

            showCreditAction(
                fromBankField
            );

            break;


        case "deposit":

            showDepositAction(
                fromBankField
            );

            break;


        case "insurance":

            showInsuranceAction(
                fromBankField
            );

            break;


        case "investment":

            showInvestmentAction(
                fromBankField
            );

            break;


        case "currency":

            showCurrencyAction(
                fromBankField
            );

            break;

    }

}


/* =========================================================
   82. КРЕДИТ

   =========================================================
   МІСЦЕ ДЛЯ МАЙБУТНЬОЇ ЛОГІКИ КРЕДИТУ

   Тут потім змінюємо:
   - доступні суми
   - відсоткову ставку
   - строк
   - щомісячний / покроковий платіж
   - прострочення
   - вплив на репутацію
   =========================================================
========================================================= */

function showCreditAction(
    fromBankField
) {

    const bank =
        gameState.player.bank;


    const credit =
        bank.credit;


    openGameInfoModal(`

        <div class="bank-operation-popup">


            <div class="bank-operation-icon">
                💳
            </div>


            <h2>
                Кредит
            </h2>


            ${
                credit.active

                    ? `

                        <div class="bank-existing-product">

                            <small>
                                ПОТОЧНИЙ БОРГ
                            </small>

                            <strong>

                                ${formatMoney(
                                    credit.balance
                                )}

                            </strong>

                            <p>

                                Ставка:
                                ${credit.rate}%

                            </p>

                        </div>

                      `

                    : `

                        <p class="modal-main-text">

                            Обери суму кредиту.

                        </p>


                        <div class="bank-amount-options">

                            ${createMoneyOptionButtons(
                                [
                                    10000,
                                    25000,
                                    50000,
                                    100000
                                ],
                                "credit"
                            )}

                        </div>

                      `
            }


            <button
                id="bankBackButton"
                class="secondary-game-btn"
            >

                ← НАЗАД

            </button>


        </div>

    `, {
        locked:
            fromBankField
    });


    document
        .querySelectorAll(
            '[data-money-action="credit"]'
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    takeCredit(

                        Number(
                            button.dataset.amount
                        ),

                        fromBankField

                    );

                }
            );

        });


    document
        .getElementById(
            "bankBackButton"
        )
        ?.addEventListener(
            "click",
            () => {

                if (
                    fromBankField
                ) {

                    showBankFieldChoice();

                }

                else {

                    showBankHub();

                }

            }
        );

}


/* =========================================================
   83. ВЗЯТИ КРЕДИТ

   ТИМЧАСОВА ФОРМУЛА.
   ПОТІМ ЗМІНИМО ТІЛЬКИ ЦЮ ФУНКЦІЮ.
========================================================= */

function takeCredit(
    amount,
    fromBankField
) {

    const player =
        gameState.player;


    const credit =
        player.bank.credit;


    /*
       =================================================
       TODO — КРЕДИТНА ФОРМУЛА

       ЗАРАЗ:
       ставка = 10%

       борг =
       сума кредиту + 10%

       ПІЗНІШЕ СЮДИ ДОДАМО
       справжню механіку гри.
       =================================================
    */

    const rate =
        10;


    const debt =
        Math.round(
            amount *
            (
                1 +
                rate / 100
            )
        );


    player.money +=
        amount;


    credit.active =
        true;


    credit.principal +=
        amount;


    credit.balance +=
        debt;


    credit.rate =
        rate;


    updatePlayerStatsUI();


    addLog({

        participant:
            player.name,

        field:
            "Банк",

        action:
            "Кредит",

        decision:
            "Взяти кредит",

        amount,

        details:
            `Отримано ${formatMoney(amount)}. Борг: ${formatMoney(debt)}.`

    });


    gameState.pendingCard =
        null;


    showBankOperationResult(

        "💳",

        "Кредит оформлено",

        `На рахунок зараховано ${formatMoney(amount)}.`,

        `Поточний борг: ${formatMoney(credit.balance)}.`,

        fromBankField

    );

}


/* =========================================================
   84. ДЕПОЗИТ
========================================================= */

function showDepositAction(
    fromBankField
) {

    const player =
        gameState.player;


    const deposit =
        player.bank.deposit;


    openGameInfoModal(`

        <div class="bank-operation-popup">


            <div class="bank-operation-icon">
                🏦
            </div>


            <h2>
                Депозит
            </h2>


            ${
                deposit.active

                    ? `

                        <div class="bank-existing-product">

                            <small>
                                НА ДЕПОЗИТІ
                            </small>

                            <strong>

                                ${formatMoney(
                                    deposit.balance
                                )}

                            </strong>

                            <p>

                                Ставка:
                                ${deposit.rate}%

                            </p>

                        </div>

                      `

                    : ""
            }


            <p class="modal-main-text">

                Обери суму,
                яку хочеш відкласти.

            </p>


            <div class="bank-amount-options">

                ${createMoneyOptionButtons(
                    [
                        5000,
                        10000,
                        25000,
                        50000
                    ],
                    "deposit"
                )}

            </div>


            <button
                id="bankBackButton"
                class="secondary-game-btn"
            >

                ← НАЗАД

            </button>


        </div>

    `, {
        locked:
            fromBankField
    });


    document
        .querySelectorAll(
            '[data-money-action="deposit"]'
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    openDeposit(

                        Number(
                            button.dataset.amount
                        ),

                        fromBankField

                    );

                }
            );

        });


    document
        .getElementById(
            "bankBackButton"
        )
        ?.addEventListener(
            "click",
            () => {

                fromBankField
                    ? showBankFieldChoice()
                    : showBankHub();

            }
        );

}


/* =========================================================
   85. ВІДКРИТИ / ПОПОВНИТИ ДЕПОЗИТ

   TODO:
   ПІЗНІШЕ ТУТ МІНЯЄМО
   ФОРМУЛУ ДОХІДНОСТІ.
========================================================= */

function openDeposit(
    amount,
    fromBankField
) {

    const player =
        gameState.player;


    if (
        player.money <
        amount
    ) {

        showBankError(

            "Недостатньо грошей",

            "Ти не можеш покласти на депозит більше, ніж маєш."

        );


        return;

    }


    const deposit =
        player.bank.deposit;


    /*
       TODO — ДЕПОЗИТНА ФОРМУЛА
    */

    const rate =
        5;


    player.money -=
        amount;


    deposit.active =
        true;


    deposit.balance +=
        amount;


    deposit.rate =
        rate;


    updatePlayerStatsUI();


    addLog({

        participant:
            player.name,

        field:
            "Банк",

        action:
            "Депозит",

        decision:
            "Відкрити / поповнити",

        amount,

        details:
            `${formatMoney(amount)} переведено на депозит.`

    });


    gameState.pendingCard =
        null;


    showBankOperationResult(

        "🏦",

        "Депозит відкрито",

        `На депозиті: ${formatMoney(deposit.balance)}.`,

        `Тимчасова ставка: ${rate}%.`,

        fromBankField

    );

}


/* =========================================================
   86. СТРАХУВАННЯ

   TODO:
   Пізніше тут визначимо:
   - які ризики покриває
   - скільки коштує
   - скільки компенсує
========================================================= */

function showInsuranceAction(
    fromBankField
) {

    const player =
        gameState.player;


    const insurance =
        player.bank.insurance;


    const price =
        5000;


    openGameInfoModal(`

        <div class="bank-operation-popup">


            <div class="bank-operation-icon">
                🛡️
            </div>


            <h2>
                Страхування
            </h2>


            ${
                insurance.active

                    ? `

                        <div class="bank-existing-product">

                            <strong>
                                ✓ Страхування активне
                            </strong>

                        </div>

                      `

                    : `

                        <p class="modal-main-text">

                            Тимчасова вартість:

                            <strong>
                                ${formatMoney(price)}
                            </strong>

                        </p>


                        <button
                            id="buyInsuranceButton"
                            class="main-game-btn"
                        >

                            ОФОРМИТИ СТРАХУВАННЯ

                        </button>

                      `
            }


            <button
                id="bankBackButton"
                class="secondary-game-btn"
            >

                ← НАЗАД

            </button>


        </div>

    `, {
        locked:
            fromBankField
    });


    document
        .getElementById(
            "buyInsuranceButton"
        )
        ?.addEventListener(
            "click",
            () => {

                buyInsurance(

                    price,

                    fromBankField

                );

            }
        );


    document
        .getElementById(
            "bankBackButton"
        )
        ?.addEventListener(
            "click",
            () => {

                fromBankField
                    ? showBankFieldChoice()
                    : showBankHub();

            }
        );

}


/* =========================================================
   87. КУПИТИ СТРАХУВАННЯ
========================================================= */

function buyInsurance(
    price,
    fromBankField
) {

    const player =
        gameState.player;


    if (
        player.money <
        price
    ) {

        showBankError(

            "Недостатньо грошей",

            "Зараз тобі не вистачає коштів для оформлення страхування."

        );


        return;

    }


    player.money -=
        price;


    player.bank.insurance.active =
        true;


    player.bank.insurance.price =
        price;


    /*
       TODO:
       coverage змінюємо,
       коли визначимо правила.
    */

    player.bank.insurance.coverage =
        0.5;


    updatePlayerStatsUI();


    addLog({

        participant:
            player.name,

        field:
            "Банк",

        action:
            "Страхування",

        decision:
            "Оформити",

        amount:
            price,

        details:
            "Страхування активовано."

    });


    gameState.pendingCard =
        null;


    showBankOperationResult(

        "🛡️",

        "Страхування активне",

        `Сплачено ${formatMoney(price)}.`,

        "Механіку покриття ризиків підключимо окремо.",

        fromBankField

    );

}


/* =========================================================
   88. ІНВЕСТИЦІЇ
========================================================= */

function showInvestmentAction(
    fromBankField
) {

    openGameInfoModal(`

        <div class="bank-operation-popup">


            <div class="bank-operation-icon">
                📈
            </div>


            <h2>
                Інвестиції
            </h2>


            <p class="modal-main-text">

                Обери суму,
                яку хочеш інвестувати.

            </p>


            <div class="bank-amount-options">

                ${createMoneyOptionButtons(
                    [
                        5000,
                        10000,
                        25000,
                        50000
                    ],
                    "investment"
                )}

            </div>


            <div class="bank-hub-note">

                📌 Пізніше тут
                підключимо ризик,
                дохідність
                та різні типи інвестицій.

            </div>


            <button
                id="bankBackButton"
                class="secondary-game-btn"
            >

                ← НАЗАД

            </button>


        </div>

    `, {
        locked:
            fromBankField
    });


    document
        .querySelectorAll(
            '[data-money-action="investment"]'
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    makeInvestment(

                        Number(
                            button.dataset.amount
                        ),

                        fromBankField

                    );

                }
            );

        });


    document
        .getElementById(
            "bankBackButton"
        )
        ?.addEventListener(
            "click",
            () => {

                fromBankField
                    ? showBankFieldChoice()
                    : showBankHub();

            }
        );

}


/* =========================================================
   89. ЗРОБИТИ ІНВЕСТИЦІЮ
========================================================= */

function makeInvestment(
    amount,
    fromBankField
) {

    const player =
        gameState.player;


    if (
        player.money <
        amount
    ) {

        showBankError(

            "Недостатньо грошей",

            "Для цієї інвестиції тобі не вистачає коштів."

        );


        return;

    }


    player.money -=
        amount;


    player.bank.investment.active =
        true;


    player.bank.investment.balance +=
        amount;


    /*
       TODO — ІНВЕСТИЦІЙНА ФОРМУЛА

       Тут пізніше:
       riskLevel
       expectedReturn
       actualReturn
       duration
    */

    player.bank.investment.riskLevel =
        "medium";


    updatePlayerStatsUI();


    addLog({

        participant:
            player.name,

        field:
            "Банк",

        action:
            "Інвестиції",

        decision:
            "Інвестувати",

        amount,

        details:
            `Інвестовано ${formatMoney(amount)}.`

    });


    gameState.pendingCard =
        null;


    showBankOperationResult(

        "📈",

        "Інвестицію створено",

        `Інвестовано ${formatMoney(amount)}.`,

        "Результат інвестиції буде визначатися окремою механікою.",

        fromBankField

    );

}


/* =========================================================
   90. ВАЛЮТНІ ОПЕРАЦІЇ
========================================================= */

function showCurrencyAction(
    fromBankField
) {

    const player =
        gameState.player;


    const currency =
        player.bank.currency;


    /*
       TODO — КУРС ВАЛЮТИ

       ЗАРАЗ ТИМЧАСОВО:
       1 USD = 45 грн

       Потім змінюємо
       ТІЛЬКИ ЦЮ ЧАСТИНУ.
    */

    const rate =
        45;


    openGameInfoModal(`

        <div class="bank-operation-popup">


            <div class="bank-operation-icon">
                💱
            </div>


            <h2>
                Валютні операції
            </h2>


            <div class="bank-existing-product">

                <small>
                    У ТЕБЕ
                </small>

                <strong>

                    ${currency.balance.toFixed(2)}
                    ${currency.code}

                </strong>

            </div>


            <p class="modal-main-text">

                Тимчасовий ігровий курс:

                <strong>
                    1 USD = ${rate} грн
                </strong>

            </p>


            <label
                for="currencyUAHInput"
            >
                Сума в гривнях
            </label>


            <input
                id="currencyUAHInput"
                type="number"
                min="1"
                placeholder="Наприклад 4500"
            >


            <div
                id="currencyError"
                class="form-error"
            ></div>


            <button
                id="buyCurrencyButton"
                class="main-game-btn"
            >

                КУПИТИ USD

            </button>


            <button
                id="bankBackButton"
                class="secondary-game-btn"
            >

                ← НАЗАД

            </button>


        </div>

    `, {
        locked:
            fromBankField
    });


    document
        .getElementById(
            "buyCurrencyButton"
        )
        ?.addEventListener(
            "click",
            () => {

                buyCurrency(

                    rate,

                    fromBankField

                );

            }
        );


    document
        .getElementById(
            "bankBackButton"
        )
        ?.addEventListener(
            "click",
            () => {

                fromBankField
                    ? showBankFieldChoice()
                    : showBankHub();

            }
        );

}


/* =========================================================
   91. КУПИТИ ВАЛЮТУ
========================================================= */

function buyCurrency(
    rate,
    fromBankField
) {

    const input =
        document.getElementById(
            "currencyUAHInput"
        );


    const error =
        document.getElementById(
            "currencyError"
        );


    if (
        !input
    ) {

        return;

    }


    const amount =
        Number(
            input.value
        );


    const player =
        gameState.player;


    if (
        amount <= 0
    ) {

        if (
            error
        ) {

            error.textContent =
                "Введи суму.";

        }


        return;

    }


    if (
        player.money <
        amount
    ) {

        if (
            error
        ) {

            error.textContent =
                "Недостатньо коштів.";

        }


        return;

    }


    const usd =
        amount /
        rate;


    player.money -=
        amount;


    player.bank.currency.balance +=
        usd;


    player.bank.currency.rate =
        rate;


    updatePlayerStatsUI();


    addLog({

        participant:
            player.name,

        field:
            "Банк",

        action:
            "Валютна операція",

        decision:
            "Купити USD",

        amount,

        details:
            `Куплено ${usd.toFixed(2)} USD за ${formatMoney(amount)}.`

    });


    gameState.pendingCard =
        null;


    showBankOperationResult(

        "💱",

        "Валюту придбано",

        `Куплено ${usd.toFixed(2)} USD.`,

        `Витрачено ${formatMoney(amount)}.`,

        fromBankField

    );

}


/* =========================================================
   92. КНОПКИ СУМ БАНКУ
========================================================= */

function createMoneyOptionButtons(
    amounts,
    action
) {

    return amounts
        .map(
            amount => `

                <button
                    class="bank-money-option"
                    data-money-action="${action}"
                    data-amount="${amount}"
                >

                    ${formatMoney(
                        amount
                    )}

                </button>

            `
        )
        .join("");

}


/* =========================================================
   93. РЕЗУЛЬТАТ БАНКІВСЬКОЇ ОПЕРАЦІЇ
========================================================= */

function showBankOperationResult(
    icon,
    title,
    text,
    note,
    fromBankField
) {

    openGameInfoModal(`

        <div class="decision-result-popup">


            <div class="bank-operation-icon">

                ${icon}

            </div>


            <h2>
                ${title}
            </h2>


            <p class="modal-main-text">

                ${text}

            </p>


            <div class="bank-hub-note">

                ${note}

            </div>


            ${
                fromBankField

                    ? `

                        <button
                            id="finishBankTurnButton"
                            class="main-game-btn"
                        >

                            ЗАВЕРШИТИ ХІД

                        </button>

                      `

                    : `

                        <button
                            id="backToBankHubButton"
                            class="main-game-btn"
                        >

                            ДО БАНКУ

                        </button>

                      `
            }


        </div>

    `, {
        locked:
            fromBankField
    });


    document
        .getElementById(
            "finishBankTurnButton"
        )
        ?.addEventListener(
            "click",
            () => {

                forceCloseGameInfoModal();

                finishPlayerTurn();

            }
        );


    document
        .getElementById(
            "backToBankHubButton"
        )
        ?.addEventListener(
            "click",
            showBankHub
        );

}


/* =========================================================
   94. ПОМИЛКА БАНКУ
========================================================= */

function showBankError(
    title,
    text
) {

    openGameInfoModal(`

        <div class="bank-error-popup">


            <div class="bank-operation-icon">
                ⚠️
            </div>


            <h2>
                ${title}
            </h2>


            <p class="modal-main-text">

                ${text}

            </p>


            <button
                id="bankErrorBackButton"
                class="main-game-btn"
            >

                ПОВЕРНУТИСЯ

            </button>


        </div>

    `, {
        locked:
            true
    });


    document
        .getElementById(
            "bankErrorBackButton"
        )
        ?.addEventListener(
            "click",
            showBankFieldChoice
        );

}


/* =========================================================
   95. КАР'ЄРА

   ПОКАЗУЄМО:
   - поточну професію
   - наступну професію
   - вимоги
   - скільки вже є
   - скільки ще бракує
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
                ],

            player.gender

        );


    const nextIndex =
        player.careerLevel + 1;


    /* =============================================
       МАКСИМАЛЬНА КАР'ЄРА
    ============================================== */

    if (
        nextIndex >=
        player.sector.levels.length
    ) {

        openGameInfoModal(`

            <div class="career-progress-popup">


                <img
                    src="${player.token.image}"
                    class="career-popup-token"
                    alt="${player.name}"
                >


                <h2>
                    ${player.name}
                </h2>


                <div class="career-current-level">

                    <small>
                        ПОТОЧНА ПРОФЕСІЯ
                    </small>

                    <strong>

                        ${player.sector.icon}

                        ${currentProfession}

                    </strong>

                </div>


                <div class="career-max-level">

                    🏆 Ти вже на найвищій
                    кар'єрній сходинці!

                </div>


            </div>

        `);


        return;

    }


    const nextProfession =
        getProfessionName(

            player
                .sector
                .levels[
                    nextIndex
                ],

            player.gender

        );


    const required =
        CAREER_LEVEL_STATS[
            nextIndex
        ];


    openGameInfoModal(`

        <div class="career-progress-popup">


            <div class="career-popup-profile">


                <img
                    src="${player.token.image}"
                    class="career-popup-token"
                    alt="${player.name}"
                >


                <div>

                    <small>
                        ТВОЯ КАР'ЄРА
                    </small>

                    <h2>
                        ${player.name}
                    </h2>

                </div>


            </div>


            <div class="career-current-level">

                <small>
                    ЗАРАЗ
                </small>

                <strong>

                    ${player.sector.icon}

                    ${currentProfession}

                </strong>

            </div>


            <div class="career-arrow">
                ↓
            </div>


            <div class="next-career-level">

                <small>
                    НАСТУПНА СХОДИНКА
                </small>

                <strong>
                    ${nextProfession}
                </strong>

            </div>


            <h3 class="career-requirements-title">

                Що потрібно для переходу:

            </h3>


            <div class="career-requirements-list">


                ${createCareerRequirementRow(

                    "💰",
                    "Гроші",
                    player.money,
                    required.money,
                    true

                )}


                ${createCareerRequirementRow(

                    "⭐",
                    "Репутація",
                    player.reputation,
                    required.reputation

                )}


                ${createCareerRequirementRow(

                    "🧠",
                    "Знання",
                    player.knowledge,
                    required.knowledge

                )}


                ${createCareerRequirementRow(

                    "⚡",
                    "Енергія",
                    player.energy,
                    required.energy

                )}


            </div>


            <div class="career-progress-note">

                💡 Коли всі чотири
                показники досягнуть потрібного рівня,
                ти автоматично перейдеш
                на наступну кар'єрну сходинку.

            </div>


        </div>

    `);

}


/* =========================================================
   96. ОДИН РЯДОК КАР'ЄРНОЇ ВИМОГИ
========================================================= */

function createCareerRequirementRow(
    icon,
    label,
    current,
    required,
    isMoney = false
) {

    const missing =
        Math.max(
            0,
            required -
            current
        );


    const percent =
        required > 0

            ? Math.min(
                100,
                Math.round(
                    current /
                    required *
                    100
                )
            )

            : 100;


    const currentText =
        isMoney

            ? formatMoney(
                current
            )

            : current;


    const requiredText =
        isMoney

            ? formatMoney(
                required
            )

            : required;


    const missingText =
        isMoney

            ? formatMoney(
                missing
            )

            : missing;


    return `

        <div class="career-requirement-row">


            <div class="career-requirement-top">

                <span>

                    ${icon}
                    ${label}

                </span>


                <strong>

                    ${currentText}
                    /
                    ${requiredText}

                </strong>

            </div>


            <div class="career-progress-bar">

                <div
                    class="career-progress-fill"
                    style="width:${percent}%"
                ></div>

            </div>


            <div class="
                career-missing-value
                ${
                    missing === 0
                        ? "career-requirement-ready"
                        : ""
                }
            ">

                ${
                    missing === 0

                        ? "✓ Виконано"

                        : `Ще потрібно: ${missingText}`
                }

            </div>


        </div>

    `;

}


/* =========================================================
   97. МРІЯ
========================================================= */

function showDreamProgress(
    fromDreamField = false
) {

    const player =
        gameState.player;


    const dream =
        player.dream;


    if (
        !dream
    ) {

        return;

    }


    const req =
        dream.requirements;


    const completed =
        isDreamCompleted(
            player
        );


    openGameInfoModal(`

        <div class="dream-progress-popup">


            <div class="dream-confirmed-icon">

                ${dream.icon}

            </div>


            <small class="dream-popup-label">

                МОЯ МРІЯ

            </small>


            <h2>
                ${dream.name}
            </h2>


            ${
                completed

                    ? `

                        <div class="dream-ready-message">

                            ✨ У тебе вже достатньо
                            ресурсів для здійснення мрії!

                        </div>

                      `

                    : `

                        <p class="modal-main-text">

                            Розвивайся,
                            приймай рішення
                            та збирай ресурси,
                            щоб наблизитися до своєї мрії.

                        </p>

                      `
            }


            ${createDreamProgressRow(

                "💰",
                "Гроші",
                player.money,
                req.money,
                true

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


            ${
                fromDreamField

                    ? `

                        <button
                            id="finishDreamCheckTurn"
                            class="main-game-btn"
                        >

                            ЗАВЕРШИТИ ХІД

                        </button>

                      `

                    : ""
            }


        </div>

    `, {
        locked:
            fromDreamField
    });


    document
        .getElementById(
            "finishDreamCheckTurn"
        )
        ?.addEventListener(
            "click",
            () => {

                gameState.pendingCard =
                    null;


                forceCloseGameInfoModal();


                finishPlayerTurn();

            }
        );

}


/* =========================================================
   98. РЯДОК ПРОГРЕСУ МРІЇ
========================================================= */

function createDreamProgressRow(
    icon,
    label,
    current,
    required,
    isMoney = false
) {

    const safeRequired =
        Math.max(
            1,
            required
        );


    const percent =
        Math.min(
            100,
            Math.max(
                0,
                Math.round(
                    current /
                    safeRequired *
                    100
                )
            )
        );


    const missing =
        Math.max(
            0,
            required -
            current
        );


    const currentText =
        isMoney

            ? formatMoney(
                current
            )

            : current;


    const requiredText =
        isMoney

            ? formatMoney(
                required
            )

            : required;


    const missingText =
        isMoney

            ? formatMoney(
                missing
            )

            : missing;


    return `

        <div class="dream-progress-row">


            <div class="dream-progress-title">

                <span>

                    ${icon}
                    ${label}

                </span>


                <strong>

                    ${currentText}

                    /

                    ${requiredText}

                </strong>

            </div>


            <div class="dream-progress-bar">

                <div
                    class="dream-progress-fill"
                    style="width:${percent}%"
                ></div>

            </div>


            <div class="
                dream-progress-missing
                ${
                    missing === 0
                        ? "dream-progress-ready"
                        : ""
                }
            ">

                ${
                    missing === 0

                        ? "✓ Достатньо"

                        : `Ще потрібно: ${missingText}`
                }

            </div>


        </div>

    `;

}


/* =========================================================
   99. ЧИ ВИКОНАНА МРІЯ
========================================================= */

function isDreamCompleted(
    participant
) {

    if (
        !participant?.dream
    ) {

        return false;

    }


    const req =
        participant
            .dream
            .requirements;


    return (

        participant.money >=
            req.money &&

        participant.reputation >=
            req.reputation &&

        participant.knowledge >=
            req.knowledge &&

        participant.energy >=
            req.energy

    );

}


/* =========================================================
   100. УСІ ТИПИ ПОЛІВ

   ТУТ ВИПАДАЄ ІНФОРМАЦІЯ:
   - що це за поле
   - що на ньому відбувається
========================================================= */

function showAllCellTypes() {

    const ids = [

        "income",
        "bank",
        "event",
        "life",
        "fate",
        "lounge",
        "academy",
        "transition",
        "dreamCheck"

    ];


    const rows =
        ids
            .map(
                typeId => {

                    const type =
                        CELL_TYPES[
                            typeId
                        ];


                    if (
                        !type
                    ) {

                        return "";

                    }


                    return `

                        <button
                            class="all-cell-type-row"
                            data-cell-info="${typeId}"
                        >

                            <span class="all-cell-type-icon">

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


                            <span class="all-cell-type-arrow">
                                →
                            </span>


                        </button>

                    `;

                }
            )
            .join("");


    openGameInfoModal(`

        <div class="all-cell-types-popup">


            <div class="modal-type-badge">

                ℹ️ ДОВІДКА

            </div>


            <h2>
                Типи полів
            </h2>


            <p class="modal-main-text">

                Кожне поле запускає
                окрему життєву,
                фінансову
                або кар'єрну ситуацію.

                Натисни на поле,
                щоб прочитати детальніше.

            </p>


            <div class="all-cell-types-list">

                ${rows}

            </div>


        </div>

    `);


    document
        .querySelectorAll(
            "[data-cell-info]"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    showCellTypeInfo(

                        button.dataset.cellInfo

                    );

                }
            );

        });

}


/* =========================================================
   101. ІНФОРМАЦІЯ ПРО ОДИН ТИП ПОЛЯ
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


    const extra =
        getCellTypeExtraInfo(
            typeId
        );


    openGameInfoModal(`

        <div class="cell-info-popup">


            <div class="cell-info-icon">

                ${type.icon}

            </div>


            <h2>
                ${type.name}
            </h2>


            <p class="modal-main-text">

                ${type.description}

            </p>


            <div class="cell-info-extra">

                ${extra}

            </div>


            <button
                id="backToCellTypesButton"
                class="secondary-game-btn"
            >

                ← ДО ВСІХ ПОЛІВ

            </button>


        </div>

    `);


    document
        .getElementById(
            "backToCellTypesButton"
        )
        ?.addEventListener(
            "click",
            showAllCellTypes
        );

}


/* =========================================================
   102. РОЗШИРЕНЕ ПОЯСНЕННЯ ПОЛІВ
========================================================= */

function getCellTypeExtraInfo(
    typeId
) {

    const info = {

        income: `

            <strong>
                Що відбувається:
            </strong>

            <p>
                Ти отримуєш дохід.
                Його розмір залежить
                від твоєї поточної
                кар'єрної сходинки.
            </p>

        `,


        bank: `

            <strong>
                Можливі дії:
            </strong>

            <p>
                💳 кредит<br>
                🏦 депозит<br>
                🛡️ страхування<br>
                📈 інвестиції<br>
                💱 валютні операції
            </p>

        `,


        event: `

            <strong>
                Як працює:
            </strong>

            <p>
                Обираєш одну з трьох
                закритих карток.

                Подія може дати
                можливість,
                витрати,
                дохід
                або зміну інших показників.
            </p>

        `,


        life: `

            <strong>
                Як працює:
            </strong>

            <p>
                Обираєш число від 1 до 20
                і відкриваєш
                відповідну життєву ситуацію.
            </p>

        `,


        fate: `

            <strong>
                Як працює:
            </strong>

            <p>
                Доля обирає картку випадково.

                Відмовитися
                від такої ситуації не можна.
            </p>

        `,


        lounge: `

            <strong>
                Що дає:
            </strong>

            <p>
                Відпочинок,
                хобі та відновлення
                допомагають повернути енергію.
            </p>

        `,


        academy: `

            <strong>
                Що дає:
            </strong>

            <p>
                Навчання та розвиток
                soft skills
                збільшують знання
                і можуть покращувати репутацію.
            </p>

        `,


        transition: `

            <strong>
                Що означає:
            </strong>

            <p>
                Це перехід
                між етапами життєвого шляху.
            </p>

        `,


        dreamCheck: `

            <strong>
                Перевірка прогресу:
            </strong>

            <p>
                Тут ти бачиш,
                наскільки наблизився(лась)
                до своєї мрії
                і яких ресурсів ще бракує.
            </p>

        `

    };


    return info[
        typeId
    ] || "";

}


/* =========================================================
   103. ЖУРНАЛ ХОДІВ
========================================================= */

function showGameJournal() {

    const history =
        gameState.history;


    const rows =
        history.length

            ? history
                .slice()
                .reverse()
                .map(
                    (
                        item,
                        index
                    ) => `

                        <div class="journal-entry">


                            <div class="journal-entry-number">

                                #${
                                    history.length -
                                    index
                                }

                            </div>


                            <div class="journal-entry-main">


                                <strong>

                                    ${item.participant || "Гравець"}

                                </strong>


                                ${
                                    item.dice

                                        ? `

                                            <span>
                                                🎲 ${item.dice}
                                            </span>

                                          `

                                        : ""
                                }


                                ${
                                    item.position

                                        ? `

                                            <span>

                                                📍 ${
                                                    item.board ===
                                                    "inner"

                                                        ? "внутрішнє"

                                                        : "зовнішнє"
                                                }

                                                · ${item.position}

                                            </span>

                                          `

                                        : ""
                                }


                                ${
                                    item.field

                                        ? `

                                            <span>

                                                Поле:
                                                ${item.field}

                                            </span>

                                          `

                                        : ""
                                }


                                ${
                                    item.card

                                        ? `

                                            <span>

                                                Картка:
                                                ${item.card}

                                            </span>

                                          `

                                        : ""
                                }


                                ${
                                    item.action

                                        ? `

                                            <span>

                                                ${item.action}

                                            </span>

                                          `

                                        : ""
                                }


                                ${
                                    item.decision

                                        ? `

                                            <span class="journal-decision">

                                                Рішення:
                                                ${item.decision}

                                            </span>

                                          `

                                        : ""
                                }


                                ${
                                    item.amount

                                        ? `

                                            <span>

                                                Сума:
                                                ${formatMoney(
                                                    item.amount
                                                )}

                                            </span>

                                          `

                                        : ""
                                }


                                ${
                                    item.details

                                        ? `

                                            <small>

                                                ${item.details}

                                            </small>

                                          `

                                        : ""
                                }


                            </div>


                        </div>

                    `
                )
                .join("")

            : `

                <div class="journal-empty">

                    Журнал поки порожній.

                </div>

              `;


    openGameInfoModal(`

        <div class="game-journal-popup">


            <div class="modal-type-badge">

                📜 ІСТОРІЯ ГРИ

            </div>


            <h2>
                Журнал ходів
            </h2>


            <p class="modal-main-text">

                Тут зберігаються
                ходи,
                картки,
                рішення
                та зміни під час гри.

            </p>


            <div class="journal-list">

                ${rows}

            </div>


        </div>

    `);

}


/* =========================================================
   104. ДОДАТИ ЗАПИС У ЖУРНАЛ

   ПРИЙМАЄ:
   addLog("текст")

   АБО

   addLog({
       participant,
       dice,
       board,
       position,
       field,
       card,
       action,
       decision,
       amount,
       details
   })
========================================================= */

function addLog(
    data
) {

    let entry;


    if (
        typeof data ===
        "string"
    ) {

        entry = {

            participant:
                "",

            action:
                data,

            time:
                Date.now()

        };

    }

    else {

        entry = {

            ...data,

            time:
                Date.now()

        };

    }


    gameState.history.push(
        entry
    );


    updateJournalCount();

}


/* =========================================================
   105. ЛІЧИЛЬНИК ЖУРНАЛУ
========================================================= */

function updateJournalCount() {

    const element =
        document.getElementById(
            "journalCount"
        );


    if (
        element
    ) {

        element.textContent =
            gameState.history.length;

    }

}


/* =========================================================
   106. ЗАВЕРШИТИ ГРУ

   КНОПКА ЗНАХОДИТЬСЯ
   ВНИЗУ ПРАВОЇ ПАНЕЛІ
   ПІД ЖУРНАЛОМ.
========================================================= */

function showFinishGameModal() {

    if (
        gameState.pendingCard
    ) {

        showRaifikMessage(

            "Спочатку заверши поточну ситуацію."

        );


        return;

    }


    const player =
        gameState.player;


    const profession =
        getProfessionName(

            player
                .sector
                .levels[
                    player.careerLevel
                ],

            player.gender

        );


    const dreamReady =
        isDreamCompleted(
            player
        );


    openGameInfoModal(`

        <div class="finish-game-popup">


            <div class="finish-game-icon">
                🏁
            </div>


            <h2>
                Завершити гру?
            </h2>


            <p class="modal-main-text">

                Твій поточний результат:

            </p>


            <div class="finish-game-summary">


                <div>

                    <small>
                        КАР'ЄРА
                    </small>

                    <strong>

                        ${player.sector.icon}

                        ${profession}

                    </strong>

                </div>


                <div>

                    <small>
                        ГРОШІ
                    </small>

                    <strong>

                        ${formatMoney(
                            player.money
                        )}

                    </strong>

                </div>


                <div>

                    <small>
                        РЕПУТАЦІЯ
                    </small>

                    <strong>
                        ${player.reputation}
                    </strong>

                </div>


                <div>

                    <small>
                        ЗНАННЯ
                    </small>

                    <strong>
                        ${player.knowledge}
                    </strong>

                </div>


                <div>

                    <small>
                        ЕНЕРГІЯ
                    </small>

                    <strong>
                        ${player.energy}
                    </strong>

                </div>


                <div>

                    <small>
                        МРІЯ
                    </small>

                    <strong>

                        ${player.dream.icon}

                        ${player.dream.name}

                    </strong>

                </div>


            </div>


            <div class="
                finish-dream-status
                ${
                    dreamReady
                        ? "dream-ready"
                        : "dream-not-ready"
                }
            ">

                ${
                    dreamReady

                        ? "✨ Ресурсів для мрії вже достатньо!"

                        : "🌱 Твій шлях до мрії ще триває."
                }

            </div>


            <div class="finish-game-buttons">


                <button
                    id="confirmFinishGameButton"
                    class="main-game-btn"
                >

                    ТАК, ЗАВЕРШИТИ

                </button>


                <button
                    id="continueGameButton"
                    class="secondary-game-btn"
                >

                    ПРОДОВЖИТИ ГРУ

                </button>


            </div>


        </div>

    `);


    document
        .getElementById(
            "confirmFinishGameButton"
        )
        ?.addEventListener(
            "click",
            finishGame
        );


    document
        .getElementById(
            "continueGameButton"
        )
        ?.addEventListener(
            "click",
            closeGameInfoModal
        );

}


/* =========================================================
   107. ФІНАЛ ГРИ
========================================================= */

function finishGame() {

    const player =
        gameState.player;


    gameState.gameFinished =
        true;


    gameState.currentTurn =
        null;


    gameState.target =
        null;


    gameState.pendingCard =
        null;


    clearTargetCells();


    addLog({

        participant:
            player.name,

        action:
            "Гру завершено",

        details:
            `Кар'єрний рівень: ${player.careerLevel + 1}.`

    });


    const profession =
        getProfessionName(

            player
                .sector
                .levels[
                    player.careerLevel
                ],

            player.gender

        );


    const dreamReady =
        isDreamCompleted(
            player
        );


    setScreen(`

        <section class="final-screen">


            <div class="final-screen-overlay"></div>


            <div class="final-content">


                <img
                    src="assets/logo.png"
                    class="final-logo"
                    alt="CV Життя"
                >


                <div class="final-raifik">

                    <img
                        src="assets/raifik.png"
                        alt="Райфик"
                    >

                </div>


                <div class="final-card">


                    <span class="final-label">

                        ТВОЯ ІСТОРІЯ

                    </span>


                    <h1>

                        ${player.name},
                        гру завершено!

                    </h1>


                    <p>

                        У цій грі важливо було
                        не просто заробити гроші.

                        Ти розвивав(ла) кар'єру,
                        приймав(ла) рішення,
                        реагував(ла) на ризики
                        та життєві ситуації
                        і поступово рухався(лась)
                        до своєї мрії.

                    </p>


                    <div class="final-player-result">


                        <div>

                            <small>
                                КАР'ЄРА
                            </small>

                            <strong>

                                ${player.sector.icon}

                                ${profession}

                            </strong>

                        </div>


                        <div>

                            <small>
                                ГРОШІ
                            </small>

                            <strong>

                                ${formatMoney(
                                    player.money
                                )}

                            </strong>

                        </div>


                        <div>

                            <small>
                                РЕПУТАЦІЯ
                            </small>

                            <strong>

                                ⭐
                                ${player.reputation}

                            </strong>

                        </div>


                        <div>

                            <small>
                                ЗНАННЯ
                            </small>

                            <strong>

                                🧠
                                ${player.knowledge}

                            </strong>

                        </div>


                        <div>

                            <small>
                                ЕНЕРГІЯ
                            </small>

                            <strong>

                                ⚡
                                ${player.energy}

                            </strong>

                        </div>


                        <div>

                            <small>
                                МРІЯ
                            </small>

                            <strong>

                                ${player.dream.icon}

                                ${player.dream.name}

                            </strong>

                        </div>


                    </div>


                    <div class="final-dream-result">

                        ${
                            dreamReady

                                ? `

                                    <strong>
                                        ✨ МРІЯ ДОСЯЖНА
                                    </strong>

                                    <p>

                                        Ти зібрав(ла)
                                        достатньо ресурсів,
                                        щоб здійснити свою мрію.

                                    </p>

                                  `

                                : `

                                    <strong>
                                        🌱 ШЛЯХ ТРИВАЄ
                                    </strong>

                                    <p>

                                        Не всі ресурси
                                        для мрії ще зібрані,
                                        але твоя історія
                                        на цьому не закінчується.

                                    </p>

                                  `
                        }

                    </div>


                    <div class="final-buttons">


                        <button
                            id="restartGameButton"
                            class="main-game-btn"
                        >

                            ЗІГРАТИ ЩЕ РАЗ

                        </button>


                        <button
                            id="finalJournalButton"
                            class="secondary-game-btn"
                        >

                            📜 ПЕРЕГЛЯНУТИ ЖУРНАЛ

                        </button>


                    </div>


                </div>


            </div>


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


                    <div
                        id="gameInfoContent"
                        class="game-info-content"
                    ></div>


                </div>

            </div>


        </section>

    `);


    document
        .getElementById(
            "restartGameButton"
        )
        ?.addEventListener(
            "click",
            restartWholeGame
        );


    document
        .getElementById(
            "finalJournalButton"
        )
        ?.addEventListener(
            "click",
            showGameJournal
        );


    document
        .getElementById(
            "gameInfoClose"
        )
        ?.addEventListener(
            "click",
            closeGameInfoModal
        );

}


/* =========================================================
   108. НОВА ГРА
========================================================= */

function restartWholeGame() {

    /*
       ЗБЕРІГАЄМО ТІЛЬКИ
       ПОЧАТКОВІ НАЛАШТУВАННЯ.

       ВСЯ ПОТОЧНА ГРА
       СКИДАЄТЬСЯ.
    */


    gameState.phase =
        "start";


    gameState.player =
        null;


    gameState.opponents =
        [];


    gameState.currentTurn =
        null;


    gameState.diceValue =
        null;


    gameState.target =
        null;


    gameState.pendingCard =
        null;


    gameState.pendingDecision =
        null;


    gameState.turnNumber =
        1;


    gameState.gameFinished =
        false;


    gameState.history =
        [];


    showStartScreen();

}


/* =========================================================
   109. КІНЕЦЬ SCRIPT.JS
========================================================= */


/*
   =========================================================
   ВАЖЛИВО

   ЦЕЙ РЯДОК МАЄ БУТИ
   САМЕ В САМОМУ КІНЦІ
   ВСЬОГО SCRIPT.JS.

   Якщо showStartScreen();
   вже залишився у тебе
   після Частини 1 —
   ДРУГИЙ РАЗ ЙОГО НЕ ДОДАВАЙ.
   =========================================================
*/


showStartScreen();
