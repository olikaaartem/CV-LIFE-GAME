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
   - перехід з малого на велике коло
   - повторні проходження кіл
   - бонуси START
   - зарплата кожні 3 власні ходи
   - кубик
   - повільні AI
   - картки Подія / Банк / Життя / Доля
   - Райфик-підказки
========================================================= */
     

const app =
    document.getElementById(
        "financeGameApp"
    );


/* =========================================================
   1. ОСНОВНІ НАЛАШТУВАННЯ
========================================================= */

const GAME_CONFIG = {

    /* Кількість клітинок */

    innerCells: 28,
    outerCells: 56,


    /* AI-гравці */

    aiPlayers: 2,


    /* Швидкість ходів AI */

    aiThinkDelay: 1200,
    aiStepDelay: 220,
    aiResultDelay: 1700,


    /* =====================================================
       ФІНАНСОВИЙ ПЕРІОД

       Кожні 3 ВЛАСНІ ходи
       гравець отримує зарплату
       відповідно до актуального
       професійного рівня.
    ===================================================== */
    financialPeriodTurns: 3,
    careerFirstPromotionMinTurn: 5,
    careerMinTurnsBetweenPromotions: 4,
    /* =====================================================
       УМОВА ПЕРЕХОДУ НА ВЕЛИКЕ КОЛО
       careerLevel у JS рахується від 0:
       0 = професійний рівень 1
       1 = професійний рівень 2
       2 = професійний рівень 3
       3 = професійний рівень 4

       Для переходу потрібен
       щонайменше професійний рівень 2.
    ===================================================== */

    outerUnlockCareerLevel: 1,


    /* =====================================================
       START — МАЛЕНЬКЕ КОЛО

       Точна зупинка:
       +50 000 грн

       Перетин START:
       +5 репутації
       +5 знань

       За одне проходження
       дається лише ОДИН бонус.
    ===================================================== */

    innerExactStartMoney: 50000,
    innerPassedStartReputation: 5,
    innerPassedStartKnowledge: 5,


    /* =====================================================
       START — ВЕЛИКЕ КОЛО

       Точна зупинка:
       +100 000 грн

       Перетин START:
       +10 репутації
       +10 знань

       За одне проходження
       дається лише ОДИН бонус.
    ===================================================== */

    outerExactStartMoney: 100000,
    outerPassedStartReputation: 10,
    outerPassedStartKnowledge: 10,


    /* =====================================================
       ДОДАТКОВІ ЗВЕРНЕННЯ ДО БАНКУ

       На початку гри:
       3 додаткові звернення.

       Premium:
       +1 додаткове звернення.
    ===================================================== */

    startingBankTokens: 3,
    premiumExtraBankTokens: 1,


    /* Максимальна енергія */

    maxEnergy: 100

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

   Для кожної сфери:
   - 4 кар'єрні рівні
   - salary = зарплата за фінансовий період
   - reputation = репутація
   - knowledge = знання
   - energy = енергія

   ПОРЯДОК НАЗВ:
   чоловічий варіант / жіночий варіант
========================================================= */

const CAREER_SECTORS = [

    /* =====================================================
       IT
    ===================================================== */

    {
        id: "it",
        name: "IT Сфера",
        icon: "💻",

        levels: [
            "Програміст / Програмістка",
            "Керівник команди розробки / Керівниця команди розробки",
            "IT-директор / IT-директорка",
            "CTO / Технічна директорка"
        ],

        stats: [

            {
                level: 1,
                salary: 15000,
                reputation: 10,
                knowledge: 20,
                energy: 95
            },

            {
                level: 2,
                salary: 38000,
                reputation: 30,
                knowledge: 45,
                energy: 85
            },

            {
                level: 3,
                salary: 70000,
                reputation: 55,
                knowledge: 68,
                energy: 75
            },

            {
                level: 4,
                salary: 130000,
                reputation: 80,
                knowledge: 88,
                energy: 70
            }

        ]
    },


    /* =====================================================
       РЕСТОРАННИЙ БІЗНЕС
    ===================================================== */

    {
        id: "restaurant",
        name: "Ресторанний бізнес",
        icon: "☕",

        levels: [
            "Бариста / Бариста",
            "Адміністратор ресторану / Адміністраторка ресторану",
            "Керуючий рестораном / Керуюча рестораном",
            "Власник ресторану / Власниця ресторану"
        ],

        stats: [

            {
                level: 1,
                salary: 11000,
                reputation: 15,
                knowledge: 10,
                energy: 100
            },

            {
                level: 2,
                salary: 28000,
                reputation: 35,
                knowledge: 30,
                energy: 90
            },

            {
                level: 3,
                salary: 58000,
                reputation: 60,
                knowledge: 50,
                energy: 80
            },

            {
                level: 4,
                salary: 120000,
                reputation: 85,
                knowledge: 75,
                energy: 75
            }

        ]
    },


    /* =====================================================
       ОСВІТА
    ===================================================== */

    {
        id: "education",
        name: "Освіта",
        icon: "🎓",

        levels: [
            "Вчитель / Вчителька",
            "Директор закладу освіти / Директорка закладу освіти",
            "Ректор університету / Ректорка університету",
            "Міністр освіти і науки України / Міністерка освіти і науки України"
        ],

        stats: [

            {
                level: 1,
                salary: 10000,
                reputation: 20,
                knowledge: 15,
                energy: 100
            },

            {
                level: 2,
                salary: 26000,
                reputation: 40,
                knowledge: 35,
                energy: 90
            },

            {
                level: 3,
                salary: 55000,
                reputation: 65,
                knowledge: 60,
                energy: 80
            },

            {
                level: 4,
                salary: 110000,
                reputation: 90,
                knowledge: 85,
                energy: 70
            }

        ]
    },


    /* =====================================================
       МИСТЕЦТВО
    ===================================================== */

    {
        id: "art",
        name: "Мистецтво",
        icon: "🎨",

        levels: [
            "Художник / Художниця",
            "Артдиректор / Артдиректорка",
            "Власник артгалереї / Власниця артгалереї",
            "Директор музею / Директорка музею"
        ],

        stats: [

            {
                level: 1,
                salary: 9000,
                reputation: 15,
                knowledge: 10,
                energy: 100
            },

            {
                level: 2,
                salary: 25000,
                reputation: 35,
                knowledge: 30,
                energy: 90
            },

            {
                level: 3,
                salary: 52000,
                reputation: 60,
                knowledge: 55,
                energy: 80
            },

            {
                level: 4,
                salary: 105000,
                reputation: 85,
                knowledge: 80,
                energy: 75
            }

        ]
    },


    /* =====================================================
       МЕДИЦИНА
    ===================================================== */

    {
        id: "medicine",
        name: "Медицина",
        icon: "🩺",

        levels: [
            "Медбрат / Медсестра",
            "Лікар / Лікарка",
            "Завідувач відділення / Завідувачка відділення",
            "Головний лікар / Головна лікарка"
        ],

        stats: [

            {
                level: 1,
                salary: 10000,
                reputation: 10,
                knowledge: 20,
                energy: 90
            },

            {
                level: 2,
                salary: 25000,
                reputation: 25,
                knowledge: 30,
                energy: 90
            },

            {
                level: 3,
                salary: 50000,
                reputation: 45,
                knowledge: 55,
                energy: 80
            },

            {
                level: 4,
                salary: 100000,
                reputation: 70,
                knowledge: 80,
                energy: 70
            }

        ]
    },


    /* =====================================================
       МЕДІА
    ===================================================== */

    {
        id: "media",
        name: "Медіа",
        icon: "🎥",

        levels: [
            "Контент-креатор / Контент-креаторка",
            "YouTube-блогер / YouTube-блогерка",
            "Продюсер контенту / Продюсерка контенту",
            "Власник медіакомпанії / Власниця медіакомпанії"
        ],

        stats: [

            {
                level: 1,
                salary: 8000,
                reputation: 15,
                knowledge: 10,
                energy: 100
            },

            {
                level: 2,
                salary: 24000,
                reputation: 35,
                knowledge: 25,
                energy: 90
            },

            {
                level: 3,
                salary: 56000,
                reputation: 60,
                knowledge: 50,
                energy: 75
            },

            {
                level: 4,
                salary: 115000,
                reputation: 90,
                knowledge: 75,
                energy: 65
            }

        ]
    },


    /* =====================================================
       ЛОГІСТИКА
    ===================================================== */

    {
        id: "logistics",
        name: "Логістика",
        icon: "🚚",

        levels: [
            "Логіст / Логістка",
            "Координатор логістики / Координаторка логістики",
            "Менеджер з логістики / Менеджерка з логістики",
            "Директор з логістики / Директорка з логістики"
        ],

        stats: [

            {
                level: 1,
                salary: 12000,
                reputation: 10,
                knowledge: 10,
                energy: 95
            },

            {
                level: 2,
                salary: 27000,
                reputation: 30,
                knowledge: 30,
                energy: 85
            },

            {
                level: 3,
                salary: 52000,
                reputation: 50,
                knowledge: 55,
                energy: 75
            },

            {
                level: 4,
                salary: 110000,
                reputation: 75,
                knowledge: 75,
                energy: 65
            }

        ]
    },


    /* =====================================================
       ФІНАНСИ
    ===================================================== */

    {
        id: "finance",
        name: "Фінанси",
        icon: "🏦",

        levels: [
            "Банківський працівник / Банківська працівниця",
            "Бухгалтер / Бухгалтерка",
            "Фінансовий директор / Фінансова директорка",
            "Власник фінансової компанії / Власниця фінансової компанії"
        ],

        stats: [

            {
                level: 1,
                salary: 14000,
                reputation: 10,
                knowledge: 15,
                energy: 95
            },

            {
                level: 2,
                salary: 32000,
                reputation: 25,
                knowledge: 35,
                energy: 85
            },

            {
                level: 3,
                salary: 65000,
                reputation: 50,
                knowledge: 60,
                energy: 75
            },

            {
                level: 4,
                salary: 135000,
                reputation: 75,
                knowledge: 85,
                energy: 70
            }

        ]
    },


    /* =====================================================
       ВІЙСЬКОВА СПРАВА
    ===================================================== */

    {
        id: "military",
        name: "Військова справа",
        icon: "🛡️",

        levels: [
            "Оператор БпЛА / Операторка БпЛА",
            "Інструктор / Інструкторка",
            "Офіцер / Офіцерка",
            "Начальник штабу / Начальниця штабу"
        ],

        stats: [

            {
                level: 1,
                salary: 16000,
                reputation: 10,
                knowledge: 15,
                energy: 95
            },

            {
                level: 2,
                salary: 35000,
                reputation: 30,
                knowledge: 35,
                energy: 85
            },

            {
                level: 3,
                salary: 62000,
                reputation: 55,
                knowledge: 55,
                energy: 75
            },

            {
                level: 4,
                salary: 125000,
                reputation: 85,
                knowledge: 80,
                energy: 70
            }

        ]
    },


    /* =====================================================
       АГРО
    ===================================================== */

    {
        id: "agro",
        name: "Агро",
        icon: "🌾",

        levels: [
            "Фермер / Фермерка",
            "Агроном / Агрономка",
            "Керівник агропідприємства / Керівниця агропідприємства",
            "Власник агрохолдингу / Власниця агрохолдингу"
        ],

        stats: [

            {
                level: 1,
                salary: 12000,
                reputation: 15,
                knowledge: 10,
                energy: 100
            },

            {
                level: 2,
                salary: 28000,
                reputation: 30,
                knowledge: 35,
                energy: 90
            },

            {
                level: 3,
                salary: 54000,
                reputation: 50,
                knowledge: 60,
                energy: 80
            },

            {
                level: 4,
                salary: 120000,
                reputation: 80,
                knowledge: 80,
                energy: 70
            }

        ]
    }

];


/* =========================================================
   4. ОТРИМАННЯ ПАРАМЕТРІВ КАР'ЄРИ
========================================================= */

function getCareerSectorById(sectorId) {

    return CAREER_SECTORS.find(
        sector =>
            sector.id === sectorId
    );

}


function getCareerStats(
    sectorId,
    level = 1
) {

    const sector =
        getCareerSectorById(
            sectorId
        );


    if (
        !sector ||
        !sector.stats
    ) {

        return null;

    }


    return (

        sector.stats.find(
            item =>
                item.level === level
        )

        ||

        sector.stats[0]

    );

}


/* =========================================================
   5. МРІЇ — 20 ШТУК

   Кар'єра НЕ є фінальною метою.

   Для переходу до реалізації Мрії
   необхідно:

   1. Досягти 4 професійного рівня.
   2. Виконати всі умови своєї Мрії.
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

    /* =====================================================
       START

       Зарплата НЕ прив'язана
       до клітинки START.

       Зарплата виплачується
       окремо кожні 3 власні ходи.
    ===================================================== */

    start: {
        id: "start",
        icon: "🏁",
        name: "START",
        description:
            "Початок нового проходження кола."
    },


    /* =====================================================
       БАНК
    ===================================================== */

    bank: {
        id: "bank",
        icon: "🏦",
        name: "Банк",
        description:
            "Банківський продукт або фінансове рішення."
    },


    /* =====================================================
       ПОДІЯ
    ===================================================== */

    event: {
        id: "event",
        icon: "🎲",
        name: "Подія",
        description:
            "Професійна або фінансова ситуація, у якій потрібно прийняти рішення."
    },


    /* =====================================================
       ЖИТТЯ

       Використовується на великому колі.
       Рішення обов'язкове.

       Якщо гравець відмовляється
       приймати рішення —
       пропускає наступний хід.
    ===================================================== */

    life: {
        id: "life",
        icon: "❤️",
        name: "Життя",
        description:
            "Життєва ситуація зі свідомим вибором та наслідками."
    },


    /* =====================================================
       ДОЛЯ

       Використовується на великому колі.
       Відмовитися від наслідків не можна.
    ===================================================== */

    fate: {
        id: "fate",
        icon: "⚡",
        name: "Доля",
        description:
            "Випадкова подія, яка спрацьовує незалежно від бажання гравця."
    },


    /* =====================================================
       LOUNGE
    ===================================================== */

    lounge: {
        id: "lounge",
        icon: "🎯",
        name: "Lounge & Хобі",
        description:
            "Відновлення енергії до максимального значення."
    },


    /* =====================================================
       АКАДЕМІЯ
    ===================================================== */

    academy: {
        id: "academy",
        icon: "🎓",
        name: "Академія & Soft Skills",
        description:
            "Обери один із варіантів розвитку навичок."
    },


    /* =====================================================
       ПЕРЕХІД

       Це НЕ автоматичний перехід.

       Умови:
       - мале коло вже пройдене;
       - професійний рівень не нижче 2.
    ===================================================== */

    transition: {
        id: "transition",
        icon: "➡️",
        name: "Перехід на велике коло",
        description:
            "Перевіряємо умови переходу на великий життєвий шлях."
    },


    /* =====================================================
       ПЕРЕВІРКА МРІЇ
    ===================================================== */

    dreamCheck: {
        id: "dreamCheck",
        icon: "✨",
        name: "Перевірка Мрії",
        description:
            "Перевіряємо фінальний професійний рівень та всі умови твоєї Мрії."
    }

};


/* =========================================================
   7. МАЛЕНЬКЕ КОЛО — 28 КЛІТИНОК

   Рух за годинниковою стрілкою.

   За правилами:

   - гра починається тут;
   - основне завдання:
     професійний розвиток
     + накопичення ресурсів;

   - картки Життя та Доля
     додаються вже на великому колі.

   СПЕЦІАЛЬНІ ПОЛЯ:

   1  — START
   6  — Lounge
   11 — Academy
   22 — Lounge
   25 — Academy
   28 — подія
========================================================= */

const INNER_BOARD = [

    "start",        // 1

    "bank",         // 2
    "event",        // 3
    "bank",         // 4
    "event",        // 5

    "lounge",       // 6

    "event",        // 7
    "bank",         // 8
    "event",        // 9
    "bank",         // 10

    "academy",      // 11

    "event",        // 12
    "bank",         // 13
    "event",        // 14
    "bank",         // 15
    "event",        // 16
    "bank",         // 17
    "event",        // 18
    "bank",         // 19
    "event",        // 20
    "bank",         // 21

    "lounge",       // 22

    "event",        // 23
    "bank",         // 24

    "academy",      // 25

    "event",        // 26
    "bank",         // 27

    "event"    // 28

];


/* =========================================================
   8. ВЕЛИКЕ КОЛО — 56 КЛІТИНОК

   Рух проти годинникової стрілки.

   На великому колі
   до гри додаються:

   - Життя
   - Доля

   СПЕЦІАЛЬНІ ПОЛЯ:

   1  — START
   10 — Lounge
   20 — Academy
   38 — Lounge
   48 — Academy
   56 — Перевірка Мрії
========================================================= */

const OUTER_BOARD =
    Array.from(
        {
            length:
                GAME_CONFIG.outerCells
        },
        (_, index) => {

            const position =
                index + 1;


            /* START */

            if (position === 1) {

                return "start";

            }


            /* Lounge */

            if (
                position === 10 ||
                position === 38
            ) {

                return "lounge";

            }


            /* Academy */

            if (
                position === 20 ||
                position === 48
            ) {

                return "academy";

            }


            /* Перевірка Мрії */

            if (position === 56) {

                return "dreamCheck";

            }


            /* =================================================
               ЗВИЧАЙНІ ПОЛЯ ВЕЛИКОГО КОЛА
            ================================================= */

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
   9. КОЛОДИ КАРТОК

   ФІНАЛЬНІ КАРТКИ ПІДКЛЮЧИМО
   В НАСТУПНІЙ ЧАСТИНІ.

   ВАЖЛИВО:

   - Події Кола 1
     і Події Кола 2
     будуть окремими.

   - Життя та Доля
     використовуються на великому колі.

   - Банк матиме власний
     каталог продуктів.

   Поки залишаємо структуру,
   щоб інші функції гри
   не падали під час підключення.
========================================================= */

const INNER_CARD_DECKS = {

    event: [],

    bank: []

};


const OUTER_CARD_DECKS = {

    event: [],

    bank: [],

    life: [],

    fate: []

};


/* =========================================================
   10. СТАН ГРИ
========================================================= */

const gameState = {

    phase: "start",

    mode: null,

    currentTurn: "player",


    /* =====================================================
       ХОДИ ТА ФІНАНСОВІ ПЕРІОДИ
    ===================================================== */

    playerTurns: 0,

    financialPeriod: 0,


    /* Поточне значення кубика */

    diceValue: null,


    /* Поточна ціль руху */

    target: null,


    /* Обрана Мрія */

    selectedDreamId: null,


    /* Журнал гри */

    history: [],


    /* =====================================================
       ГРАВЕЦЬ
    ===================================================== */

    player: {

        id: "player",

        name: "",

        gender: null,

        token: null,

        sector: null,


        /* 0 = професійний рівень 1 */

        careerLevel: 0,

        dream: null,
       
      /* Виконані Мрії */
      completedDreams: [],


        /* =================================================
           ФІНАНСИ
        ================================================= */

        salary: 0,

        money: 0,


        /* Додатковий регулярний дохід
           з карток / активів */

        passiveIncome: 0,


        /* =================================================
           ОСНОВНІ РЕСУРСИ
        ================================================= */

        reputation: 0,

        knowledge: 0,

        energy: 0,


        /* =================================================
           ПОЛЕ
        ================================================= */

        board: "inner",

        position: 1,


        /* =================================================
           ПРОХОДЖЕННЯ КІЛ
        ================================================= */

        innerLaps: 0,

        outerLaps: 0,


        /* Після виконання умов
           на повторному малому колі
           перехід робимо
           перед наступним ходом */

        pendingOuterTransition: false,


        /* =================================================
           ПРОПУСК ХОДУ

           Використовується,
           наприклад,
           для карток Життя.
        ================================================= */

        skipTurns: 0,


        /* =================================================
           БАНК
        ================================================= */

        bank: {

            /* 3 додаткові звернення */

            extraVisits:
                GAME_CONFIG
                    .startingBankTokens,

            premium: false,

            premiumExtraGranted: false,

            products: [],

            debts: []

        },


        /* =================================================
           ТИМЧАСОВІ / ПОСТІЙНІ ЕФЕКТИ
        ================================================= */

        effects: {

            /* Якщо Lounge був відвіданий
               при енергії 100,
               наступне повне коло
               енергія не зменшується */

            protectEnergyForLap: false,

            protectedEnergyBoard: null,

            protectedEnergyLap: null,


            /* Сімейне вогнище */

            familyHearth: false,


            /* Тимчасові бонуси енергії */

            energyPerTurn: 0,

            energyPerTurnTurnsLeft: 0,


            /* Постійний дохід */

            incomePerTurn: 0,


            /* Відкладені виплати */

            delayedPayments: []

        }

    },


    /* =====================================================
       AI
    ===================================================== */

    opponents: []

};

/* =========================================================
   11. ДОПОМІЖНІ ФУНКЦІЇ
========================================================= */

function randomItem(array) {

    if (
        !Array.isArray(array) ||
        array.length === 0
    ) {

        return null;

    }


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
            setTimeout(
                resolve,
                ms
            )
    );

}

/* =========================================================
   ЖУРНАЛ ХОДІВ
========================================================= */

function addLog(
    text
) {

    if (!text) {
        return;
    }


    if (
        !Array.isArray(
            gameState.history
        )
    ) {

        gameState.history =
            [];

    }


    gameState.history.push({

        text:
            String(text),

        turn:
            Number(
                gameState.playerTurns
            ) || 0,

        time:
            new Date()
                .toLocaleTimeString(
                    "uk-UA",
                    {
                        hour: "2-digit",
                        minute: "2-digit"
                    }
                )

    });


    const journalCount =
        document.getElementById(
            "journalCount"
        );


    if (journalCount) {

        journalCount.textContent =
            gameState.history.length;

    }

}

/* =========================================================
   ЗАМІНА ЕКРАНА
========================================================= */

function setScreen(html) {

    app.innerHTML =
        html;


    window.scrollTo({

        top: 0,

        behavior: "instant"

    });

}


/* =========================================================
   ФОРМАТ ГРОШЕЙ
========================================================= */

function formatMoney(value) {

    return Number(
        value || 0
    ).toLocaleString(
        "uk-UA"
    );

}


/* =========================================================
   ОБМЕЖЕННЯ ПОКАЗНИКІВ

   Репутація та знання
   не можуть бути менше 0.

   Енергія:
   0–100.
========================================================= */

function clampPlayerResources(
    participant
) {

    if (!participant) {
        return;
    }


    participant.reputation =
        Math.max(
            0,
            Number(
                participant.reputation
            ) || 0
        );


    participant.knowledge =
        Math.max(
            0,
            Number(
                participant.knowledge
            ) || 0
        );


    participant.energy =
        Math.max(
            0,
            Math.min(
                GAME_CONFIG.maxEnergy,
                Number(
                    participant.energy
                ) || 0
            )
        );

}


/* =========================================================
   12. ТЕКСТ ЗА СТАТТЮ
========================================================= */

function isGirl(
    gender =
        gameState.player.gender
) {

    return (
        gender === "girl"
    );

}


/* =========================================================
   ГОТОВА / ГОТОВИЙ
========================================================= */

function getReadyText() {

    return isGirl()

        ? "ГОТОВА?"

        : "ГОТОВИЙ?";

}


/* =========================================================
   ПРОФЕСІЯ ЗА СТАТТЮ

   У CAREER_SECTORS назви записані:

   чоловіча форма /
   жіноча форма
========================================================= */

function getProfessionName(
    profession,
    gender =
        gameState.player.gender
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


    if (
        parts.length < 2
    ) {

        return profession;

    }


    return (
        gender === "girl"
    )

        ? parts[1]

        : parts[0];

}


/* =========================================================
   ТЕКСТ "ПІДНЯВСЯ / ПІДНЯЛАСЯ"
========================================================= */

function getCareerPromotionText(
    participant =
        gameState.player
) {

    return (
        participant.gender === "girl"
    )

        ? "Ти піднялася на нову професійну сходинку!"

        : "Ти піднявся на нову професійну сходинку!";

}


/* =========================================================
   ТЕКСТ "ПОТРАПИВ / ПОТРАПИЛА"
========================================================= */

function getLandedText(
    participant =
        gameState.player
) {

    return (
        participant.gender === "girl"
    )

        ? "Ти потрапила"

        : "Ти потрапив";

}


/* =========================================================
   ПОТОЧНИЙ ПРОФЕСІЙНИЙ РІВЕНЬ

   У коді:
   careerLevel 0 = рівень 1
   careerLevel 1 = рівень 2
   careerLevel 2 = рівень 3
   careerLevel 3 = рівень 4
========================================================= */

function getDisplayedCareerLevel(
    participant
) {

    return (
        Number(
            participant?.careerLevel
        ) || 0
    ) + 1;

}


/* =========================================================
   ЧИ Є ФІНАЛЬНИЙ ПРОФЕСІЙНИЙ РІВЕНЬ
========================================================= */

function hasFinalCareerLevel(
    participant
) {

    if (
        !participant ||
        !participant.sector
    ) {

        return false;

    }


    return (
        participant.careerLevel >=
        participant.sector.levels.length - 1
    );

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
                                        gameState.player.gender === "girl"
                                        ? "selected"
                                        : ""
                                    }
                                "
                                data-gender="girl"
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
        .forEach(
            button => {

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

            }
        );


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
                event.key === "Enter"
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


    if (
        !gameState.player.gender
    ) {

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

            .map(
                token => `

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

                `
            )

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
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        selectToken(
                            button.dataset.token
                        );

                    }
                );

            }
        );


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

            .map(
                sector => `

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

                `
            )

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

   ВАЖЛИВЕ ВИПРАВЛЕННЯ:

   На початку гри баланс грошей
   дорівнює зарплаті першого
   професійного рівня.

   У попередньому коді:
   salary записувалась,
   а money залишалось 0.
========================================================= */

function assignRandomCareer() {

    const sector =
        randomItem(
            CAREER_SECTORS
        );


    if (!sector) {

        return;

    }


    gameState.player.sector =
        sector;


    gameState.player.careerLevel =
        0;


    const stats =
        getCareerStats(
            sector.id,
            1
        );


    if (!stats) {

        return;

    }


    gameState.player.salary =
        stats.salary;


    /* =====================================================
       СТАРТОВИЙ БАЛАНС
    ===================================================== */

    gameState.player.money =
        stats.salary;


    gameState.player.reputation =
        stats.reputation;


    gameState.player.knowledge =
        stats.knowledge;


    gameState.player.energy =
        stats.energy;


    clampPlayerResources(
        gameState.player
    );


    showCareerResult();

}


/* =========================================================
   22. ПОКАЗ ОТРИМАНОЇ ПРОФЕСІЇ
========================================================= */

function showCareerResult() {

    const player =
        gameState.player;


    const sector =
        player.sector;


    if (!sector) {

        return;

    }


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


    if (
        !box ||
        !oldButton
    ) {

        return;

    }


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


            <div class="career-result-start-money">

                💰 Стартовий баланс:
                <strong>
                    ${formatMoney(player.money)} грн
                </strong>

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
   23. ЖИТТЄВИЙ ШЛЯХ / КАР'ЄРНІ РІВНІ
========================================================= */

function showCareerReveal() {

    gameState.phase =
        "career";


    const player =
        gameState.player;


    const sector =
        player.sector;


    if (!sector) {

        return;

    }


    const levels =
        sector.levels

            .map(
                (
                    profession,
                    index
                ) => ({

                    profession,
                    index

                })
            )

            .reverse();


    const careerHTML =
        levels

            .map(
                item => {

                    const index =
                        item.index;


                    const stats =
                        getCareerStats(
                            sector.id,
                            index + 1
                        );


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
                                    💰 ${formatMoney(stats.salary)}
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

                }
            )

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

                        Розвивай знання,
                        репутацію та енергію,
                        щоб переходити
                        на наступні професійні рівні.

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

        gameState.player.dream?.id

        ||

        null;


    const dreamsHTML =
        DREAMS

            .map(
                dream => {

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

const isCompleted =
    Array.isArray(
        gameState.player.completedDreams
    )
    &&
    gameState.player.completedDreams.includes(
        dream.id
    );

                    return `

                        <button
                           class="  dream-option
    ${
        gameState.selectedDreamId === dream.id
        ? "selected"
        : ""
    }
    ${
        isCompleted
        ? "dream-completed"
        : ""
    }
"
data-dream="${dream.id}"
${isCompleted ? "disabled" : ""}
                   >

                            ${visual}


                            <div class="dream-name">
                                ${dream.name}
                            </div>

${
    isCompleted

    ? `
        <div class="dream-completed-label">
            ✅ ЗДІЙСНЕНО
        </div>
      `

    : ""
}

                        </button>

                    `;

                }
            )

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
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        previewDream(
                            button.dataset.dream
                        );

                    }
                );

            }
        );


document
    .getElementById(
        "dreamBackButton"
    )
    ?.addEventListener(
        "click",
        () => {

            if (
                gameState.player.turnsCompleted > 0
            ) {

                showGameBoard();

            }

            else {

                showCareerReveal();

            }

        }
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
        .forEach(
            button => {

                button.classList.toggle(

                    "selected",

                    button.dataset.dream ===
                        dreamId

                );

            }
        );


    const details =
        document.getElementById(
            "dreamDetails"
        );


    if (!details) {

        return;

    }


    details.innerHTML = `

        <div class="dream-details-card">


            <h3>

                ${dream.icon}
                ${dream.name}

            </h3>


            <p>
                Для реалізації цієї Мрії потрібно:
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


            <div class="dream-final-career-note">

                🏆 Також потрібно досягти
                фінального,
                4-го професійного рівня.

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
            () => {

                selectDream(
                    dreamId
                );

            }
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
/* =========================================================
   26. ЗБЕРЕЖЕННЯ МРІЇ

   Якщо Мрію обираємо на старті —
   продовжуємо стартовий сценарій.

   Якщо Мрію обираємо вже під час гри —
   повертаємося на ігрове поле.
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


    /* =====================================================
       НЕ ДОЗВОЛЯЄМО ПОВТОРНО
       ОБРАТИ ВЖЕ ВИКОНАНУ МРІЮ
    ===================================================== */

    if (
        Array.isArray(
            gameState.player.completedDreams
        )
        &&
        gameState.player.completedDreams.includes(
            dreamId
        )
    ) {

        return;

    }


    gameState.player.dream =
        dream;


    gameState.selectedDreamId =
        dreamId;


    /* =====================================================
       ЯКЩО ГРА ВЖЕ ЙДЕ —
       ПРОСТО ПОВЕРТАЄМОСЯ НА ПОЛЕ
    ===================================================== */

    if (
        gameState.player.turnsCompleted > 0
        ||
        gameState.phase === "game"
    ) {

        addLog(
            `✨ ${gameState.player.name} обрав(ла) нову Мрію «${dream.name}».`
        );


        showGameBoard();

        return;

    }


    /* =====================================================
       ЯКЩО ЦЕ ПЕРШИЙ ВИБІР МРІЇ
       ПЕРЕД ПОЧАТКОМ ГРИ
    ===================================================== */

    createAIPlayers();


    showBeforeGameScreen();

}

/* =========================================================
   27. СТВОРЕННЯ AI

   AI стартують за тими ж
   базовими правилами:

   - професійний рівень 1;
   - стартовий баланс =
     зарплата 1 рівня;
   - починають на малому колі;
   - мають 3 звернення до Банку;
   - проходять ті ж кола.
========================================================= */

function createAIPlayers() {

    gameState.opponents =
        [];


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


        const sector =
            randomItem(
                CAREER_SECTORS
            );


        const stats =
            getCareerStats(
                sector.id,
                1
            );


        const ai = {

            id:
                `ai-${i + 1}`,

            name:
                profile.name,

            gender:
                profile.gender,

            token,

            sector,


            /* =============================================
               КАР'ЄРА
            ============================================= */

            careerLevel: 0,

            dream:
                randomItem(
                    DREAMS
                ),


            /* =============================================
               ФІНАНСИ
            ============================================= */

            salary:
                stats.salary,

            money:
                stats.salary,

            passiveIncome: 0,


            /* =============================================
               РЕСУРСИ
            ============================================= */

            reputation:
                stats.reputation,

            knowledge:
                stats.knowledge,

            energy:
                stats.energy,


            /* =============================================
               ПОЛЕ
            ============================================= */

            board: "inner",

            position: 1,

            innerLaps: 0,

            outerLaps: 0,

            pendingOuterTransition:
                false,


            /* =============================================
               ПРОПУСК ХОДУ
            ============================================= */

            skipTurns: 0,


            /* =============================================
               БАНК
            ============================================= */

            bank: {

                extraVisits:
                    GAME_CONFIG
                        .startingBankTokens,

                premium: false,

                premiumExtraGranted:
                    false,

                products: [],

                debts: []

            },


            /* =============================================
               ЕФЕКТИ
            ============================================= */

            effects: {

                protectEnergyForLap:
                    false,

                protectedEnergyBoard:
                    null,

                protectedEnergyLap:
                    null,

                familyHearth:
                    false,

                energyPerTurn:
                    0,

                energyPerTurnTurnsLeft:
                    0,

                incomePerTurn:
                    0,

                delayedPayments:
                    []

            }

        };


        clampPlayerResources(
            ai
        );


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

            .map(
                participant => {


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


                            <div class="participant-preview-level">

                                Професійний рівень:
                                <strong>
                                    ${
                                        getDisplayedCareerLevel(
                                            participant
                                        )
                                    }
                                </strong>

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

                }
            )

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


                <div class="before-game-rules-note">

                    <strong>
                        🏁 Починаємо з маленького кола.
                    </strong>

                    <br>

                    Щоб перейти на велике,
                    потрібно пройти маленьке коло
                    щонайменше один раз
                    і досягти мінімум
                    2-го професійного рівня.

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
   КІНЕЦЬ ЧАСТИНИ 2

   НАСТУПНА ЧАСТИНА ПОЧИНАЄТЬСЯ:

   29. ГОЛОВНИЙ ЕКРАН ГРИ

   Там уже будуть:

   - саме поле;
   - 28 + 56 клітинок;
   - правильний рух;
   - START;
   - повторні кола;
   - перехід на велике коло;
   - кубик;
   - AI;
   - HUD показників;
   - журнал;
   - модалки;
   - фінансові періоди.
========================================================= */
/* =========================================================
   СТАН БАНКУ ГРАВЦЯ

   Тимчасова базова версія,
   поки повний Банк ще не підключений.
========================================================= */

function ensurePlayerBankState() {

    const player =
        gameState.player;


    if (!player.bank) {

        player.bank = {};

    }


    if (
        typeof player.bank.extraVisits !==
        "number"
    ) {

        player.bank.extraVisits =
            GAME_CONFIG.startingBankTokens;

    }


    if (
        typeof player.bank.premium !==
        "boolean"
    ) {

        player.bank.premium =
            false;

    }


    if (
        typeof player.bank.premiumExtraGranted !==
        "boolean"
    ) {

        player.bank.premiumExtraGranted =
            false;

    }


    if (
        !Array.isArray(
            player.bank.products
        )
    ) {

        player.bank.products =
            [];

    }


    if (
        !Array.isArray(
            player.bank.debts
        )
    ) {

        player.bank.debts =
            [];

    }

}

/* =========================================================
   29. ГОЛОВНИЙ ЕКРАН ГРИ

   ЛІВА / НИЖНЯ ЧАСТИНА:
   - професія
   - показники
   - Мрія
   - Банк

   ЦЕНТР:
   - мале коло
   - велике коло

   ПРАВА ПАНЕЛЬ:
   - кубик
   - Райфик
   - картки
   - AI
   - журнал
========================================================= */

function showGameBoard() {
    // Створюємо AI, якщо список гравців порожній.
     // Наявних AI та їхній прогрес зберігаємо.
    if (
        GAME_CONFIG.aiPlayers > 0 &&
        (
            !Array.isArray(gameState.opponents) ||
            gameState.opponents.length === 0
        )
    ) {
        createAIPlayers();
    }

    ensureGameRuntimeState();

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

        .map(
            ai => {

                const aiProfession =
                    getProfessionName(
                        ai.sector.levels[
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

                        <div class="mini-opponent-info">

                            <strong>
                                ${ai.name}
                            </strong>

                            <small>
                                ${aiProfession}
                            </small>

                            <div class="mini-opponent-stats">

                                <span>
                                    💰 ${formatMoney(ai.money)}
                                </span>

                                <span>
                                    ⭐ ${ai.reputation}
                                </span>

                                <span>
                                    🧠 ${ai.knowledge}
                                </span>

                                <span>
                                    ⚡ ${ai.energy}
                                </span>

                            </div>

                            <small>
                                🏆 Рівень ${getDisplayedCareerLevel(ai)}
                            </small>

                        </div>

                    </button>

                `;

            }
        )

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


                <!-- ЗОВНІШНЄ КОЛО -->

                <div
                    id="outerBoard"
                    class="
                        rectangle-board
                        outer-rectangle-board
                    "
                ></div>


                <!-- ВНУТРІШНЄ КОЛО -->

                <div
                    id="innerBoard"
                    class="
                        rectangle-board
                        inner-rectangle-board
                    "
                ></div>


                <!-- ЛОГО -->

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

                            <span
                                id="hudPlayerProfession"
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

    ${player.dream?.icon || "✨"}

</span>



                        <div>

                            <small>
                                МОЯ МРІЯ
                            </small>

                            <strong>
    ${
        player.dream
            ? player.dream.name
            : "Обрати нову Мрію"
    }
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


                <!-- КУБИК -->

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


                <!-- РАЙФИК / КАРТКА -->

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


                <!-- ДОДАТКОВІ ДІЇ -->
               <!-- ДОДАТКОВІ ДІЇ -->

                <div class="work-panel-actions">

                    <button
                        id="cellInfoButton"
                        class="work-panel-button"
                        type="button"
                    >
                        <span>
                            ℹ️ Типи полів
                        </span>

                        <span>
                            →
                        </span>
                    </button>


                    <button
                        id="glossaryButton"
                        class="work-panel-button"
                        type="button"
                    >
                        <span>
                            📖 Словничок
                        </span>

                        <span>
                            →
                        </span>
                    </button>


                    <button
                        id="journalButton"
                        class="work-panel-button"
                        type="button"
                    >
                        <span>
                            📜 Журнал ходів
                        </span>

                        <span id="journalCount">
                            ${
                                gameState.history
                                    ? gameState.history.length
                                    : 0
                            }
                        </span>
                    </button>


                    <button
                        id="finishGameButton"
                        class="work-panel-button finish-game-button"
                        type="button"
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


                    <div
                        id="gameInfoContent"
                    ></div>

                </div>

            </div>


        </section>

    `);


    /* =====================================================
       СТВОРЕННЯ ПОЛЯ
    ===================================================== */

    createBoard();

placeAllPieces();

updatePlayerStatsUI();

initializeGameCycle();


    /* =====================================================
       КУБИК
    ===================================================== */

    document
        .getElementById(
            "rollDiceButton"
        )
        .addEventListener(
            "click",
            rollDice
        );


    /* =====================================================
       ПРОФЕСІЯ
    ===================================================== */

    document
        .getElementById(
            "careerHudButton"
        )
        .addEventListener(
            "click",
            showCareerProgressModal
        );
/* =====================================================
   МРІЯ
===================================================== */

document
    .getElementById(
        "dreamHudButton"
    )
    ?.addEventListener(
        "click",
        () => {

            if (
                gameState.player.dream
            ) {

                showDreamProgress();

            }

            else {

                showDreamSelection();

            }

        }
    );

    /* =====================================================
       БАНК
    ===================================================== */

    document
        .getElementById(
            "bankHudButton"
        )
        .addEventListener(
            "click",
            showBankHub
        );


    /* =====================================================
       AI
    ===================================================== */

    document
        .querySelectorAll(
            ".mini-opponent-button"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        showParticipantInfo(
                            button.dataset.playerId
                        );

                    }
                );

            }
        );


    /* =====================================================
       ТИПИ ПОЛІВ
    ===================================================== */

    document
        .getElementById(
            "cellInfoButton"
        )
        .addEventListener(
            "click",
            showAllCellTypes
        );

   /* =====================================================
       СЛОВНИЧОК
    ===================================================== */

    document
        .getElementById(
            "glossaryButton"
        )
        ?.addEventListener(
            "click",
            showGameGlossary
        );

    /* =====================================================
       ЖУРНАЛ
    ===================================================== */

    document
        .getElementById(
            "journalButton"
        )
        .addEventListener(
            "click",
            showGameJournal
        );


    /* =====================================================
       ЗАВЕРШИТИ ГРУ
    ===================================================== */

    document
        .getElementById(
            "finishGameButton"
        )
        .addEventListener(
            "click",
            showFinishGameModal
        );


    /* =====================================================
       ЗАКРИТИ МОДАЛКУ
    ===================================================== */

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
   30. СТВОРЕННЯ ПОЛЯ
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
   31. КООРДИНАТИ ПРЯМОКУТНОГО МАРШРУТУ

   INNER:
   рух за годинниковою.

   OUTER:
   рух проти годинникової.
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
            1 -
            normalized;

    }


    const width =
        1.72;


    const height =
        1;


    const perimeter =
        width * 2 +
        height * 2;


    /* Починаємо
       із середини верхньої сторони */

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
   32. СТВОРЕННЯ ОДНОГО КОЛА
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
        boardName === "inner"

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


        if (!type) {

            continue;

        }


        const cell =
            document.createElement(
                "div"
            );


        /* =================================================
           START Є І НА МАЛОМУ,
           І НА ВЕЛИКОМУ КОЛІ
        ================================================= */

        const isStart =
            typeId ===
            "start";


        cell.className =
            `board-cell ${boardName}-cell`;


        cell.dataset.board =
            boardName;


        cell.dataset.position =
            i;


        cell.dataset.type =
            typeId;


        /* START */

        if (isStart) {

            cell.classList.add(
                "start-board-cell"
            );

        }


        /* СПЕЦІАЛЬНІ ПОЛЯ */

        if (
            [
                "start",
                "lounge",
                "academy",
                "transition",
                "dreamCheck"
            ]
                .includes(
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
            "dreamCheck"
        ) {

            cell.classList.add(
                "dream-check-board-cell"
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

<span class="cell-type-label">
    ${type.name}
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


            ${
                typeId ===
                "dreamCheck"

                ? `

                    <span class="cell-special-label">
                        МРІЯ
                    </span>

                  `

                : ""
            }

        `;


        /* =================================================
           КЛІК ПО ПОЛЮ

           Залишаємо для перегляду
           інформації про клітинку.
        ================================================= */

        cell.addEventListener(
            "click",
            () => {

                handleBoardCellClick(
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
   33. ІНФОРМАЦІЯ ПРО КЛІТИНКУ
========================================================= */
/* =========================================================
   33. КЛІК ПО КЛІТИНЦІ

   Якщо після кидка кубика
   це цільова клітинка —
   завершуємо ручний рух.

   Якщо це звичайний клік —
   просто показуємо інформацію.
========================================================= */

async function handleBoardCellClick(
    cell
) {

    if (!cell) {
        return;
    }


    const board =
        cell.dataset.board;


    const position =
        Number(
            cell.dataset.position
        );


    /* =====================================================
       ЦІЛЬ ПІСЛЯ КИДКА КУБИКА
    ===================================================== */

    if (
        gameState.target
        &&
        gameState.target.board === board
        &&
        gameState.target.position === position
    ) {

        const target =
            gameState.target;


        await finishManualPlayerMove(
            target
        );


        return;

    }


    /* =====================================================
       ЗВИЧАЙНИЙ КЛІК —
       ПОКАЗУЄМО ІНФОРМАЦІЮ
    ===================================================== */

    const typeId =
        cell.dataset.type;


    const type =
        CELL_TYPES[
            typeId
        ];


    if (!type) {
        return;
    }


    openGameInfoModal(`

        <div class="cell-info-modal">

            <div class="cell-info-big-icon">
                ${type.icon}
            </div>

            <h2>
                ${type.name}
            </h2>

            <p>
                ${type.description}
            </p>

        </div>

    `);

}


/* =========================================================
   34. РОЗМІЩЕННЯ ВСІХ ФІШОК
========================================================= */

function placeAllPieces() {

    placePiece(
        gameState.player
    );


    gameState.opponents
        .forEach(
            ai => {

                placePiece(
                    ai
                );

            }
        );

}


/* =========================================================
   35. РОЗМІЩЕННЯ ОДНІЄЇ ФІШКИ

   ВИПРАВЛЕННЯ:

   У старому коді селектор
   був зламаний:

   {participant.position}

   Тепер використовуємо
   нормальний template string.
========================================================= */

function placePiece(
    participant
) {

    if (
        !participant ||
        !participant.token
    ) {

        return;

    }


    const oldPiece =
        document.querySelector(

            `[data-player-id="${participant.id}"]`

        );


    if (oldPiece) {

        oldPiece.remove();

    }


    const cell =
        document.querySelector(

            `.${participant.board}-cell[data-position="${participant.position}"]`

        );


    if (!cell) {

        return;

    }


    const piece =
        document.createElement(
            "div"
        );


 piece.className =
    participant.id === "player"

    ? "board-player-piece player-board-piece"

    : "board-player-piece ai-board-piece";



    piece.dataset.playerId =
        participant.id;


    piece.innerHTML = `

        <img
            src="${participant.token.image}"
            alt="${participant.name}"
        >

    `;


    cell.appendChild(
        piece
    );

}


/* =========================================================
   36. ЗНАЧКИ КУБИКА
========================================================= */

const DICE_FACES = [

    "⚀",
    "⚁",
    "⚂",
    "⚃",
    "⚄",
    "⚅"

];


/* =========================================================
   37. КИДОК КУБИКА ГРАВЦЯ
========================================================= */

async function rollDice() {

    if (
        gameState.currentTurn !==
        "player"
    ) {

        return;

    }


    const player =
        gameState.player;


    const button =
        document.getElementById(
            "rollDiceButton"
        );


    /* =====================================================
       ПРОПУСК ХОДУ
    ===================================================== */

    if (
        player.skipTurns > 0
    ) {

        player.skipTurns -=
            1;


        addLog(
            `⏭ ${player.name} пропускає хід.`
        );


        showRaifikCurrentCardMessage(

            "⏭ Цей хід ти пропускаєш."

        );


        if (button) {

            button.disabled =
                true;

        }


        await delay(
            1200
        );


        startAITurns();


        return;

    }


    /* =====================================================
       ПЕРЕХІД НА ВЕЛИКЕ КОЛО

       За правилами:

       якщо мале коло вже пройдене
       і 2-й професійний рівень
       отримано під час повторного
       проходження —

       завершувати поточне коло
       не потрібно.

       Перед наступним ходом
       переміщаємо гравця
       на START великого кола.
    ===================================================== */

    if (
        player.pendingOuterTransition
    ) {

        await moveParticipantToOuterStart(
            player
        );

    }


    if (button) {

        button.disabled =
            true;

    }


    gameState.currentTurn =
        "moving";


    const dice =
        document.getElementById(
            "dice"
        );


    const message =
        document.getElementById(
            "diceMessage"
        );


    /* Анімація кубика */

    for (
        let i = 0;
        i < 8;
        i++
    ) {

        const randomFace =
            randomNumber(
                1,
                6
            );


        if (dice) {

            dice.textContent =
                DICE_FACES[
                    randomFace - 1
                ];

        }


        await delay(
            70
        );

    }


    const value =
        randomNumber(
            1,
            6
        );


    gameState.diceValue =
        value;


    if (dice) {

        dice.textContent =
            DICE_FACES[
                value - 1
            ];

    }


    if (message) {

        message.textContent =
            `Випало: ${value}`;

    }


    addLog(

        `🎲 ${player.name}: випало ${value}`

    );


    await delay(
        450
    );

prepareManualPlayerMove(
    value
);


}


/* =========================================================
   38. РОЗРАХУНОК РУХУ

   ВАЖЛИВО:

   Тут більше НЕМАЄ
   автоматичного:

   28 → велике коло.

   Гравець може проходити
   мале коло декілька разів.
========================================================= */

function calculateDestination(
    participant,
    steps
) {

    const boardName =
        participant.board;


    const boardLength =
        boardName === "inner"

        ? GAME_CONFIG.innerCells

        : GAME_CONFIG.outerCells;


    const currentPosition =
        participant.position;


    const rawTarget =
        currentPosition +
        steps;


    const crossedStart =
        rawTarget >
        boardLength;


    const destinationPosition =
        crossedStart

        ? (
            (
                rawTarget - 1
            ) %
            boardLength
        ) + 1

        : rawTarget;


    return {

        board:
            boardName,

        position:
            destinationPosition,

        crossedStart,

        landedExactlyOnStart:
            crossedStart &&
            destinationPosition === 1

    };

} 


/* =========================================================
   37. КИДОК КУБИКА ГРАВЦЯ
========================================================= */

async function rollDice() {

    if (
        gameState.currentTurn !==
        "player"
    ) {

        return;

    }


    const player =
        gameState.player;


    const button =
        document.getElementById(
            "rollDiceButton"
        );


    /* =====================================================
       ПРОПУСК ХОДУ
    ===================================================== */

    if (
        player.skipTurns > 0
    ) {

        player.skipTurns -=
            1;


        addLog(
            `⏭ ${player.name} пропускає хід.`
        );


        showRaifikCurrentCardMessage(

            "⏭ Цей хід ти пропускаєш."

        );


        if (button) {

            button.disabled =
                true;

        }


        await delay(
            1200
        );


        startAITurns();


        return;

    }


    /* =====================================================
       ПЕРЕХІД НА ВЕЛИКЕ КОЛО

       За правилами:

       якщо мале коло вже пройдене
       і 2-й професійний рівень
       отримано під час повторного
       проходження —

       завершувати поточне коло
       не потрібно.

       Перед наступним ходом
       переміщаємо гравця
       на START великого кола.
    ===================================================== */

    if (
        player.pendingOuterTransition
    ) {

        await moveParticipantToOuterStart(
            player
        );

    }


    if (button) {

        button.disabled =
            true;

    }


    gameState.currentTurn =
        "moving";


    const dice =
        document.getElementById(
            "dice"
        );


    const message =
        document.getElementById(
            "diceMessage"
        );


    /* Анімація кубика */

    for (
        let i = 0;
        i < 8;
        i++
    ) {

        const randomFace =
            randomNumber(
                1,
                6
            );


        if (dice) {

            dice.textContent =
                DICE_FACES[
                    randomFace - 1
                ];

        }


        await delay(
            70
        );

    }


    const value =
        randomNumber(
            1,
            6
        );


    gameState.diceValue =
        value;


    if (dice) {

        dice.textContent =
            DICE_FACES[
                value - 1
            ];

    }


    if (message) {

        message.textContent =
            `Випало: ${value}`;

    }


    addLog(

        `🎲 ${player.name}: випало ${value}`

    );


    await delay(
        450
    );


    prepareManualPlayerMove(
    value
);


}


/* =========================================================
   38. РОЗРАХУНОК РУХУ

   ВАЖЛИВО:

   Тут більше НЕМАЄ
   автоматичного:

   28 → велике коло.

   Гравець може проходити
   мале коло декілька разів.
========================================================= */

function calculateDestination(
    participant,
    steps
) {

    const boardName =
        participant.board;


    const boardLength =
        boardName === "inner"

        ? GAME_CONFIG.innerCells

        : GAME_CONFIG.outerCells;


    const currentPosition =
        participant.position;


    const rawTarget =
        currentPosition +
        steps;


    const crossedStart =
        rawTarget >
        boardLength;


    const destinationPosition =
        crossedStart

        ? (
            (
                rawTarget - 1
            ) %
            boardLength
        ) + 1

        : rawTarget;


    return {

        board:
            boardName,

        position:
            destinationPosition,

        crossedStart,

        landedExactlyOnStart:
            crossedStart &&
            destinationPosition === 1

    };

}
/* =========================================================
   38.1. РУЧНИЙ РУХ ФІШКИ ГРАВЦЯ

   Після кидка кубика:
   - рахуємо кінцеву клітинку;
   - підсвічуємо її;
   - гравець може перетягнути фішку
     АБО натиснути на підсвічену клітинку;
   - після цього запускається дія клітинки.
========================================================= */

function prepareManualPlayerMove(
    steps
) {

    const player =
        gameState.player;


    const target =
        calculateDestination(
            player,
            steps
        );


    gameState.target =
        target;


    /* Прибираємо стару підсвітку */

    document
        .querySelectorAll(
            ".board-cell"
        )
        .forEach(
            cell =>
                cell.classList.remove(
                    "target-cell"
                )
        );


    const targetCell =
        document.querySelector(

            `.${target.board}-cell[data-position="${target.position}"]`

        );


    const piece =
        document.querySelector(

            `.board-player-piece[data-player-id="player"]`

        );


    if (
        !targetCell ||
        !piece
    ) {

        console.warn(
            "Не вдалося підготувати ручний рух.",
            target
        );

        return;

    }


    targetCell.classList.add(
        "target-cell"
    );


    piece.draggable =
        true;


    showRaifikCurrentCardMessage(

        `🎲 Випало ${steps}. Перетягни фішку або натисни на підсвічену клітинку.`

    );


    let moveCompleted =
        false;


    const completeManualMove =
        async () => {

            if (
                moveCompleted
            ) {

                return;

            }


            moveCompleted =
                true;


            await finishManualPlayerMove(
                target
            );

        };


    /* =====================================================
       ПЕРЕТЯГУВАННЯ ФІШКИ
    ===================================================== */

    piece.addEventListener(
        "dragstart",
        event => {

            event.dataTransfer.effectAllowed =
                "move";


            event.dataTransfer.setData(
                "text/plain",
                "player"
            );

        }
    );


    targetCell.addEventListener(
        "dragenter",
        event => {

            event.preventDefault();

        }
    );


    targetCell.addEventListener(
        "dragover",
        event => {

            event.preventDefault();


            event.dataTransfer.dropEffect =
                "move";

        }
    );


    targetCell.addEventListener(
        "drop",
        async event => {

            event.preventDefault();

            event.stopPropagation();


            await completeManualMove();

        },
        {
            once: true
        }
    );


    /* =====================================================
       КЛІК ПО ПІДСВІЧЕНІЙ КЛІТИНЦІ

       Запасний і більш надійний спосіб.
    ===================================================== */

    targetCell.addEventListener(
        "click",
        async event => {

            event.preventDefault();

            event.stopPropagation();


            await completeManualMove();

        },
        {
            once: true
        }
    );

}

/* =========================================================
   38.2. ЗАВЕРШЕННЯ РУЧНОГО РУХУ
========================================================= */

async function finishManualPlayerMove(
    target
) {

    const player =
        gameState.player;


    const oldBoard =
        player.board;


    player.position =
        target.position;


    player.board =
        target.board;


    if (
        target.crossedStart
    ) {

        if (
            oldBoard === "inner"
        ) {

            player.innerLaps +=
                1;

        }

        else {

            player.outerLaps +=
                1;

        }

    }


    const targetCell =
        document.querySelector(

            `.${target.board}-cell[data-position="${target.position}"]`

        );


    const piece =
        document.querySelector(

            `.board-player-piece[data-player-id="player"]`

        );


    if (
        targetCell &&
        piece
    ) {

        targetCell.appendChild(
            piece
        );

    }


    document
        .querySelectorAll(
            ".board-cell"
        )
        .forEach(
            cell =>
                cell.classList.remove(
                    "target-cell"
                )
        );


    if (piece) {

        piece.draggable =
            false;

    }


    gameState.target =
        null;


    if (
        target.crossedStart
    ) {

        await handleCompletedLap(

            player,

            target.landedExactlyOnStart

        );

    }


    await resolvePlayerCell();

}



/* =========================================================
   39. ПОКРОКОВИЙ РУХ ГРАВЦЯ
========================================================= */

async function movePlayerStepByStep(
    steps
) {

    const player =
        gameState.player;


    const startBoard =
        player.board;


    const boardLength =
        startBoard === "inner"

        ? GAME_CONFIG.innerCells

        : GAME_CONFIG.outerCells;


    let crossedStart =
        false;


    let landedExactlyOnStart =
        false;


    for (
        let step = 0;
        step < steps;
        step++
    ) {


        let nextPosition =
            player.position + 1;


        /* =================================================
           ПЕРЕТИН START
        ================================================= */

        if (
            nextPosition >
            boardLength
        ) {

            nextPosition =
                1;


            crossedStart =
                true;


            /* =================================================
               ЗАВЕРШЕНО ПОВНЕ КОЛО
            ================================================= */

            if (
                player.board ===
                "inner"
            ) {

                player.innerLaps +=
                    1;

            }

            else {

                player.outerLaps +=
                    1;

            }

        }


        player.position =
            nextPosition;


        const cell =
            document.querySelector(

                `.${player.board}-cell[data-position="${player.position}"]`

            );


        if (cell) {

            movePieceDOM(
                player.id,
                cell
            );

        }


        await delay(
            180
        );

    }


    /* =====================================================
       ТОЧНА ЗУПИНКА НА START
    ===================================================== */

    landedExactlyOnStart =
        crossedStart &&
        player.position === 1;


    /* =====================================================
       ОБРОБКА ЗАВЕРШЕННЯ КОЛА
    ===================================================== */

    if (crossedStart) {

        await handleCompletedLap(

            player,

            landedExactlyOnStart

        );

    }


    gameState.target = {

        board:
            player.board,

        position:
            player.position

    };


    await resolvePlayerCell();

}


/* =========================================================
   40. РУХ DOM-ФІШКИ
========================================================= */
function movePieceDOM(
    participantId,
    cell
) {

    if (!cell) {
        return;
    }


    const piece =
        document.querySelector(
            `.board-player-piece[data-player-id="${participantId}"]`
        );


    if (!piece) {

        console.warn(
            "Не знайдено фішку:",
            participantId
        );

        return;
    }


    cell.appendChild(
        piece
    );

}



/* =========================================================
   41. ЗАВЕРШЕННЯ ПОВНОГО КОЛА

   INNER:

   Якщо після проходження
   малого кола вже є
   професійний рівень 2+:

   → ставимо перехід
     на велике коло
     перед наступним ходом.

   Якщо рівня 2 ще немає:

   → гравець залишається
     на малому колі
   → отримує бонус START.

   OUTER:

   → гравець продовжує
     велике коло
   → отримує бонус START.
========================================================= */

async function handleCompletedLap(
    participant,
    exactStart
) {

    if (!participant) {

        return;

    }


    /* =====================================================
       МАЛЕНЬКЕ КОЛО
    ===================================================== */

    if (
        participant.board ===
        "inner"
    ) {


        const canMoveToOuter =
            participant.innerLaps >= 1
            &&
            participant.careerLevel >=
                GAME_CONFIG
                    .outerUnlockCareerLevel;


        /* =================================================
           УМОВИ ПЕРЕХОДУ ВИКОНАНІ

           Людина НЕ отримує
           бонус повторного START,
           бо вона вже не залишається
           проходити мале коло знову.
        ================================================= */

        if (canMoveToOuter) {

            participant.pendingOuterTransition =
                true;


            addLog(

                `➡️ ${participant.name} виконав(ла) умови переходу на велике коло.`

            );


            if (
                participant.id ===
                "player"
            ) {

                showRaifikCurrentCardMessage(

                    "🎉 Маленьке коло пройдено, а 2-й професійний рівень уже досягнуто. Перед наступним ходом ти переходиш на START великого кола."

                );

            }


            return;

        }


        /* =================================================
           ЗАЛИШАЄМОСЯ НА МАЛОМУ КОЛІ

           ТУТ ДАЄМО БОНУС START.
        ================================================= */

        applyInnerStartBonus(

            participant,

            exactStart

        );


        if (
            participant.id ===
            "player"
        ) {

            showRaifikCurrentCardMessage(

                "🔄 Перше коло завершено, але для переходу потрібен щонайменше 2-й професійний рівень. Продовжуємо мале коло."

            );

        }


        return;

    }


    /* =====================================================
       ВЕЛИКЕ КОЛО
    ===================================================== */

    if (
        participant.board ===
        "outer"
    ) {

        applyOuterStartBonus(

            participant,

            exactStart

        );

    }

}


/* =========================================================
   42. БОНУС START — МАЛЕ КОЛО

   ЗА ПРАВИЛАМИ:

   точна зупинка:
   +50 000 грн

   перетин:
   +5 репутації
   +5 знань

   За один START —
   лише один бонус.
========================================================= */

function applyInnerStartBonus(
    participant,
    exactStart
) {

    if (exactStart) {

        participant.money +=
            GAME_CONFIG
                .innerExactStartMoney;


        addLog(

            `🏁 ${participant.name}: точна зупинка на START малого кола +${formatMoney(GAME_CONFIG.innerExactStartMoney)} грн`

        );


        if (
            participant.id ===
            "player"
        ) {

            showRaifikCurrentCardMessage(

                `🏁 Точна зупинка на START! +${formatMoney(GAME_CONFIG.innerExactStartMoney)} грн.`

            );

        }

    }

    else {

        participant.reputation +=
            GAME_CONFIG
                .innerPassedStartReputation;


        participant.knowledge +=
            GAME_CONFIG
                .innerPassedStartKnowledge;


        addLog(

            `🏁 ${participant.name}: перетин START малого кола +${GAME_CONFIG.innerPassedStartReputation} репутації, +${GAME_CONFIG.innerPassedStartKnowledge} знань`

        );


        if (
            participant.id ===
            "player"
        ) {

            showRaifikCurrentCardMessage(

                `🏁 Ти перетнув(ла) START: +${GAME_CONFIG.innerPassedStartReputation} репутації та +${GAME_CONFIG.innerPassedStartKnowledge} знань.`

            );

        }

    }


    clampPlayerResources(
        participant
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
   43. БОНУС START — ВЕЛИКЕ КОЛО

   ЗА ПРАВИЛАМИ:

   точна зупинка:
   +100 000 грн

   перетин:
   +10 репутації
   +10 знань.
========================================================= */

function applyOuterStartBonus(
    participant,
    exactStart
) {

    if (exactStart) {

        participant.money +=
            GAME_CONFIG
                .outerExactStartMoney;


        addLog(

            `🏁 ${participant.name}: точна зупинка на START великого кола +${formatMoney(GAME_CONFIG.outerExactStartMoney)} грн`

        );


        if (
            participant.id ===
            "player"
        ) {

            showRaifikCurrentCardMessage(

                `🏁 Точна зупинка на START великого кола! +${formatMoney(GAME_CONFIG.outerExactStartMoney)} грн.`

            );

        }

    }

    else {

        participant.reputation +=
            GAME_CONFIG
                .outerPassedStartReputation;


        participant.knowledge +=
            GAME_CONFIG
                .outerPassedStartKnowledge;


        addLog(

            `🏁 ${participant.name}: перетин START великого кола +${GAME_CONFIG.outerPassedStartReputation} репутації, +${GAME_CONFIG.outerPassedStartKnowledge} знань`

        );


        if (
            participant.id ===
            "player"
        ) {

            showRaifikCurrentCardMessage(

                `🏁 Перетин START великого кола: +${GAME_CONFIG.outerPassedStartReputation} репутації та +${GAME_CONFIG.outerPassedStartKnowledge} знань.`

            );

        }

    }


    clampPlayerResources(
        participant
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
   44. ПЕРЕХІД НА START ВЕЛИКОГО КОЛА

   Виконується ПЕРЕД наступним ходом.
========================================================= */

async function moveParticipantToOuterStart(
    participant
) {

    if (!participant) {

        return;

    }


    participant.board =
        "outer";


    participant.position =
        1;


    participant.pendingOuterTransition =
        false;


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

        `➡️ ${participant.name} переходить на START великого кола.`

    );


    if (
        participant.id ===
        "player"
    ) {

        showRaifikCurrentCardMessage(

            "➡️ Ти переходиш на START великого кола. Тепер починається наступний етап твого життя!"

        );


        await delay(
            700
        );

    }

}


/* =========================================================
   45. ТИП ПОТОЧНОЇ КЛІТИНКИ
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
   46. ОБРОБКА КЛІТИНКИ ГРАВЦЯ

   КАРТКИ ПІДКЛЮЧИМО
   В НАСТУПНІЙ ЧАСТИНІ.
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


    if (!type) {

        startAITurns();

        return;

    }


    /* =====================================================
       START

       Сам факт стояння на START
       НЕ дає зарплату.

       START-бонус уже був
       оброблений під час
       проходження кола.
    ===================================================== */

    if (
        typeId ===
        "start"
    ) {

        showRaifikCurrentCardMessage(

            "🏁 START. Зарплата виплачується окремо кожні 3 твої ходи."

        );


        await delay(
            1000
        );


        startAITurns();


        return;

    }


    showRaifikCurrentCardMessage(

        `${type.icon} ${getLandedText(player)} на «${type.name}».`

    );


    switch (
        typeId
    ) {


        /* =================================================
           ПОДІЯ
        ================================================= */

        case "event":

            startCardTurn(
                "event"
            );

            break;


        /* =================================================
           БАНК
        ================================================= */

        case "bank":

            startCardTurn(
                "bank"
            );

            break;


        /* =================================================
           ЖИТТЯ
        ================================================= */

        case "life":

            startCardTurn(
                "life"
            );

            break;


        /* =================================================
           ДОЛЯ
        ================================================= */

        case "fate":

            startCardTurn(
                "fate"
            );

            break;


        /* =================================================
           LOUNGE
        ================================================= */

        case "lounge":

            handleLoungeCell(
                player
            );

            break;


        /* =================================================
           АКАДЕМІЯ
        ================================================= */

        case "academy":

            showAcademyChoice();

            break;


        /* =================================================
           ПОЛЕ ПЕРЕХОДУ

           Саме поле 28
           більше НЕ переносить
           автоматично на outer.
        ================================================= */

        case "transition":

            await handleTransitionCell(
                player
            );

            break;


        /* =================================================
           МРІЯ
        ================================================= */

        case "dreamCheck":

            handleDreamCheckCell(
                player
            );

            break;


        default:

            startAITurns();

            break;

    }

}


/* =========================================================
   47. КЛІТИНКА ПЕРЕХОДУ МАЛОГО КОЛА

   Це інформаційна зона.

   Сам факт попадання на 28
   НЕ означає автоматичний перехід.

   Треба:
   - пройти мале коло;
   - мати 2-й професійний рівень.
========================================================= */

async function handleTransitionCell(
    participant
) {

    const ready =
        participant.innerLaps >= 1
        &&
        participant.careerLevel >=
            GAME_CONFIG
                .outerUnlockCareerLevel;


    if (ready) {

        participant.pendingOuterTransition =
            true;


        showRaifikCurrentCardMessage(

            "➡️ Умови переходу виконані. Перед наступним ходом ти перейдеш на START великого кола."

        );


        addLog(

            `➡️ ${participant.name}: готовий(а) до переходу на велике коло.`

        );

    }

    else {

        const level =
            getDisplayedCareerLevel(
                participant
            );


        showRaifikCurrentCardMessage(

            `➡️ Для переходу потрібно пройти мале коло щонайменше один раз і досягти 2-го професійного рівня. Зараз твій рівень: ${level}.`

        );

    }


    await delay(
        1300
    );


    startAITurns();

}


/* =========================================================
   39. ПОКРОКОВИЙ РУХ ГРАВЦЯ
========================================================= */

async function movePlayerStepByStep(
    steps
) {

    const player =
        gameState.player;


    const startBoard =
        player.board;


    const boardLength =
        startBoard === "inner"

        ? GAME_CONFIG.innerCells

        : GAME_CONFIG.outerCells;


    let crossedStart =
        false;


    let landedExactlyOnStart =
        false;


    for (
        let step = 0;
        step < steps;
        step++
    ) {


        let nextPosition =
            player.position + 1;


        /* =================================================
           ПЕРЕТИН START
        ================================================= */

        if (
            nextPosition >
            boardLength
        ) {

            nextPosition =
                1;


            crossedStart =
                true;


            /* =================================================
               ЗАВЕРШЕНО ПОВНЕ КОЛО
            ================================================= */

            if (
                player.board ===
                "inner"
            ) {

                player.innerLaps +=
                    1;

            }

            else {

                player.outerLaps +=
                    1;

            }

        }


        player.position =
            nextPosition;


        const cell =
            document.querySelector(

                `.${player.board}-cell[data-position="${player.position}"]`

            );


        if (cell) {

            movePieceDOM(
                player.id,
                cell
            );

        }


        await delay(
            180
        );

    }


    /* =====================================================
       ТОЧНА ЗУПИНКА НА START
    ===================================================== */

    landedExactlyOnStart =
        crossedStart &&
        player.position === 1;


    /* =====================================================
       ОБРОБКА ЗАВЕРШЕННЯ КОЛА
    ===================================================== */

    if (crossedStart) {

        await handleCompletedLap(

            player,

            landedExactlyOnStart

        );

    }


    gameState.target = {

        board:
            player.board,

        position:
            player.position

    };


    await resolvePlayerCell();

}


/* =========================================================
   40. РУХ DOM-ФІШКИ
========================================================= */
function movePieceDOM(
    participantId,
    cell
) {

    if (!cell) {
        return;
    }


    const piece =
        document.querySelector(
            `.board-player-piece[data-player-id="${participantId}"]`
        );


    if (!piece) {

        console.warn(
            "Не знайдено фішку:",
            participantId
        );

        return;
    }


    cell.appendChild(
        piece
    );

}



/* =========================================================
   41. ЗАВЕРШЕННЯ ПОВНОГО КОЛА

   INNER:

   Якщо після проходження
   малого кола вже є
   професійний рівень 2+:

   → ставимо перехід
     на велике коло
     перед наступним ходом.

   Якщо рівня 2 ще немає:

   → гравець залишається
     на малому колі
   → отримує бонус START.

   OUTER:

   → гравець продовжує
     велике коло
   → отримує бонус START.
========================================================= */

async function handleCompletedLap(
    participant,
    exactStart
) {

    if (!participant) {

        return;

    }


    /* =====================================================
       МАЛЕНЬКЕ КОЛО
    ===================================================== */

    if (
        participant.board ===
        "inner"
    ) {


        const canMoveToOuter =
            participant.innerLaps >= 1
            &&
            participant.careerLevel >=
                GAME_CONFIG
                    .outerUnlockCareerLevel;


        /* =================================================
           УМОВИ ПЕРЕХОДУ ВИКОНАНІ

           Людина НЕ отримує
           бонус повторного START,
           бо вона вже не залишається
           проходити мале коло знову.
        ================================================= */

        if (canMoveToOuter) {

            participant.pendingOuterTransition =
                true;


            addLog(

                `➡️ ${participant.name} виконав(ла) умови переходу на велике коло.`

            );


            if (
                participant.id ===
                "player"
            ) {

                showRaifikCurrentCardMessage(

                    "🎉 Маленьке коло пройдено, а 2-й професійний рівень уже досягнуто. Перед наступним ходом ти переходиш на START великого кола."

                );

            }


            return;

        }


        /* =================================================
           ЗАЛИШАЄМОСЯ НА МАЛОМУ КОЛІ

           ТУТ ДАЄМО БОНУС START.
        ================================================= */

        applyInnerStartBonus(

            participant,

            exactStart

        );


        if (
            participant.id ===
            "player"
        ) {

            showRaifikCurrentCardMessage(

                "🔄 Перше коло завершено, але для переходу потрібен щонайменше 2-й професійний рівень. Продовжуємо мале коло."

            );

        }


        return;

    }


    /* =====================================================
       ВЕЛИКЕ КОЛО
    ===================================================== */

    if (
        participant.board ===
        "outer"
    ) {

        applyOuterStartBonus(

            participant,

            exactStart

        );

    }

}


/* =========================================================
   42. БОНУС START — МАЛЕ КОЛО

   ЗА ПРАВИЛАМИ:

   точна зупинка:
   +50 000 грн

   перетин:
   +5 репутації
   +5 знань

   За один START —
   лише один бонус.
========================================================= */

function applyInnerStartBonus(
    participant,
    exactStart
) {

    if (exactStart) {

        participant.money +=
            GAME_CONFIG
                .innerExactStartMoney;


        addLog(

            `🏁 ${participant.name}: точна зупинка на START малого кола +${formatMoney(GAME_CONFIG.innerExactStartMoney)} грн`

        );


        if (
            participant.id ===
            "player"
        ) {

            showRaifikCurrentCardMessage(

                `🏁 Точна зупинка на START! +${formatMoney(GAME_CONFIG.innerExactStartMoney)} грн.`

            );

        }

    }

    else {

        participant.reputation +=
            GAME_CONFIG
                .innerPassedStartReputation;


        participant.knowledge +=
            GAME_CONFIG
                .innerPassedStartKnowledge;


        addLog(

            `🏁 ${participant.name}: перетин START малого кола +${GAME_CONFIG.innerPassedStartReputation} репутації, +${GAME_CONFIG.innerPassedStartKnowledge} знань`

        );


        if (
            participant.id ===
            "player"
        ) {

            showRaifikCurrentCardMessage(

                `🏁 Ти перетнув(ла) START: +${GAME_CONFIG.innerPassedStartReputation} репутації та +${GAME_CONFIG.innerPassedStartKnowledge} знань.`

            );

        }

    }


    clampPlayerResources(
        participant
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
   43. БОНУС START — ВЕЛИКЕ КОЛО

   ЗА ПРАВИЛАМИ:

   точна зупинка:
   +100 000 грн

   перетин:
   +10 репутації
   +10 знань.
========================================================= */

function applyOuterStartBonus(
    participant,
    exactStart
) {

    if (exactStart) {

        participant.money +=
            GAME_CONFIG
                .outerExactStartMoney;


        addLog(

            `🏁 ${participant.name}: точна зупинка на START великого кола +${formatMoney(GAME_CONFIG.outerExactStartMoney)} грн`

        );


        if (
            participant.id ===
            "player"
        ) {

            showRaifikCurrentCardMessage(

                `🏁 Точна зупинка на START великого кола! +${formatMoney(GAME_CONFIG.outerExactStartMoney)} грн.`

            );

        }

    }

    else {

        participant.reputation +=
            GAME_CONFIG
                .outerPassedStartReputation;


        participant.knowledge +=
            GAME_CONFIG
                .outerPassedStartKnowledge;


        addLog(

            `🏁 ${participant.name}: перетин START великого кола +${GAME_CONFIG.outerPassedStartReputation} репутації, +${GAME_CONFIG.outerPassedStartKnowledge} знань`

        );


        if (
            participant.id ===
            "player"
        ) {

            showRaifikCurrentCardMessage(

                `🏁 Перетин START великого кола: +${GAME_CONFIG.outerPassedStartReputation} репутації та +${GAME_CONFIG.outerPassedStartKnowledge} знань.`

            );

        }

    }


    clampPlayerResources(
        participant
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
   44. ПЕРЕХІД НА START ВЕЛИКОГО КОЛА

   Виконується ПЕРЕД наступним ходом.
========================================================= */

async function moveParticipantToOuterStart(
    participant
) {

    if (!participant) {

        return;

    }


    participant.board =
        "outer";


    participant.position =
        1;


    participant.pendingOuterTransition =
        false;


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

        `➡️ ${participant.name} переходить на START великого кола.`

    );


    if (
        participant.id ===
        "player"
    ) {

        showRaifikCurrentCardMessage(

            "➡️ Ти переходиш на START великого кола. Тепер починається наступний етап твого життя!"

        );


        await delay(
            700
        );

    }

}


/* =========================================================
   45. ТИП ПОТОЧНОЇ КЛІТИНКИ
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
   46. ОБРОБКА КЛІТИНКИ ГРАВЦЯ

   КАРТКИ ПІДКЛЮЧИМО
   В НАСТУПНІЙ ЧАСТИНІ.
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


    if (!type) {

        startAITurns();

        return;

    }


    /* =====================================================
       START

       Сам факт стояння на START
       НЕ дає зарплату.

       START-бонус уже був
       оброблений під час
       проходження кола.
    ===================================================== */

    if (
        typeId ===
        "start"
    ) {

        showRaifikCurrentCardMessage(

            "🏁 START. Зарплата виплачується окремо кожні 3 твої ходи."

        );


        await delay(
            1000
        );


        startAITurns();


        return;

    }


    showRaifikCurrentCardMessage(

        `${type.icon} ${getLandedText(player)} на «${type.name}».`

    );


    switch (
        typeId
    ) {


        /* =================================================
           ПОДІЯ
        ================================================= */

        case "event":

            startCardTurn(
                "event"
            );

            break;


        /* =================================================
           БАНК
        ================================================= */

        case "bank":

            startCardTurn(
                "bank"
            );

            break;


        /* =================================================
           ЖИТТЯ
        ================================================= */

        case "life":

            startCardTurn(
                "life"
            );

            break;


        /* =================================================
           ДОЛЯ
        ================================================= */

        case "fate":

            startCardTurn(
                "fate"
            );

            break;


        /* =================================================
           LOUNGE
        ================================================= */

        case "lounge":

            handleLoungeCell(
                player
            );

            break;


        /* =================================================
           АКАДЕМІЯ
        ================================================= */

        case "academy":

            showAcademyChoice();

            break;


        /* =================================================
           ПОЛЕ ПЕРЕХОДУ

           Саме поле 28
           більше НЕ переносить
           автоматично на outer.
        ================================================= */

        case "transition":

            await handleTransitionCell(
                player
            );

            break;


        /* =================================================
           МРІЯ
        ================================================= */

        case "dreamCheck":

            handleDreamCheckCell(
                player
            );

            break;


        default:

            startAITurns();

            break;

    }

}


/* =========================================================
   47. КЛІТИНКА ПЕРЕХОДУ МАЛОГО КОЛА

   Це інформаційна зона.

   Сам факт попадання на 28
   НЕ означає автоматичний перехід.

   Треба:
   - пройти мале коло;
   - мати 2-й професійний рівень.
========================================================= */

async function handleTransitionCell(
    participant
) {

    const ready =
        participant.innerLaps >= 1
        &&
        participant.careerLevel >=
            GAME_CONFIG
                .outerUnlockCareerLevel;


    if (ready) {

        participant.pendingOuterTransition =
            true;


        showRaifikCurrentCardMessage(

            "➡️ Умови переходу виконані. Перед наступним ходом ти перейдеш на START великого кола."

        );


        addLog(

            `➡️ ${participant.name}: готовий(а) до переходу на велике коло.`

        );

    }

    else {

        const level =
            getDisplayedCareerLevel(
                participant
            );


        showRaifikCurrentCardMessage(

            `➡️ Для переходу потрібно пройти мале коло щонайменше один раз і досягти 2-го професійного рівня. Зараз твій рівень: ${level}.`

        );

    }


    await delay(
        1300
    );


    startAITurns();

}


/* =========================================================
   48. РАЙФИК — ПОВІДОМЛЕННЯ
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
   КІНЕЦЬ ЧАСТИНИ 3

   НАСТУПНА ЧАСТИНА:

   - КАРТКИ ПОДІЯ
   - окремо Коло 1 / Коло 2
   - другий кидок кубика = номер картки
   - БАНК
   - ЖИТТЯ
   - ДОЛЯ
   - Lounge за правилами
   - Академія з 3 варіантами
   - ефекти карток
   - кнопка "ЗАВЕРШИТИ ХІД"
========================================================= */

/* =========================================================
   49. СИСТЕМА КАРТОК

   ВАЖЛИВО:

   Картки тепер залежать від кола.

   INNER:
   - Подія
   - Банк

   OUTER:
   - Подія
   - Банк
   - Життя
   - Доля

   Старі тестові CARD_DECKS
   більше не використовуємо.
========================================================= */


/* =========================================================
   49.1 ПОДІЇ — МАЛЕНЬКЕ КОЛО

   Джерело:
   актуальний файл карток Подій.

   У документі зазначено:
   "Картки 1–25",

   але фактично після картки №24
   одразу починається Коло 2.

   Тому тут 24 картки.
   Нічого не додаємо від себе.
========================================================= */

INNER_CARD_DECKS.event = [

    /* =====================================================
       КАРТКА 1
    ===================================================== */

    {
        id: "inner-event-01",
        number: 1,

        title:
            "Перший фріланс-замовник",

        story:
            "Тобі довірили невелике тестове комерційне замовлення. Це чудовий шанс заробити перші реальні гроші для старту та заявити про себе як про надійного виконавця.",

        requirementText:
            "Без вимог (Стартовий рівень)",

        requirements: {},

        choices: [

            {
                id: "quality",

                title:
                    "Виконати замовлення якісно та вчасно",

                costText:
                    "⚡ -10 енергії",

                resultText:
                    "💰 +10 000 грн | 🧠 +10 знань | ⭐ +10 репутації",

                effects: {
                    money: 10000,
                    energy: -10,
                    knowledge: 10,
                    reputation: 10
                }
            },

            {
                id: "fast",

                title:
                    "Зробити швидко та без перевірки",

                costText:
                    "⚡ -5 енергії",

                resultText:
                    "💰 +5 000 грн | ⭐ -5 репутації",

                effects: {
                    money: 5000,
                    energy: -5,
                    reputation: -5
                }
            }

        ]
    },


    /* =====================================================
       КАРТКА 2
    ===================================================== */

    {
        id: "inner-event-02",
        number: 2,

        title:
            "Онлайн-інтенсив із професії",

        story:
            "З'явилася можливість пройти актуальний практичний курс від практиків ринку для прокачування фундаментальних професійних навичок.",

        requirementText:
            "💰 5 000 грн",

        requirements: {},

        choices: [

            {
                id: "paid-course",

                title:
                    "Оплатити та пройти повний інтенсив",

                costText:
                    "💰 -5 000 грн | ⚡ -10 енергії",

                resultText:
                    "🧠 +15 знань | ⭐ +5 репутації",

                minimum: {
                    money: 5000
                },

                effects: {
                    money: -5000,
                    energy: -10,
                    knowledge: 15,
                    reputation: 5
                }
            },

            {
                id: "self-study",

                title:
                    "Вчитися самостійно за відкритими відео",

                costText:
                    "⚡ -15 енергії",

                resultText:
                    "🧠 +5 знань",

                effects: {
                    energy: -15,
                    knowledge: 5
                }
            }

        ]
    },


    /* =====================================================
       КАРТКА 3
    ===================================================== */

    {
        id: "inner-event-03",
        number: 3,

        title:
            "Молодіжний бізнес-нетворкінг",

        story:
            "У місті проходить масштабна офлайн-зустріч активної молоді та молодих підприємців. Час активно заводити корисні ділові знайомства!",

        requirementText:
            "⚡ 15+ енергії",

        requirements: {
            energy: 15
        },

        choices: [

            {
                id: "network",

                title:
                    "Презентувати себе та обмінюватися контактами",

                costText:
                    "⚡ -10 енергії | 💰 -5 000 грн",

                resultText:
                    "⭐ +15 репутації | 🧠 +15 знань",

                minimum: {
                    money: 5000
                },

                effects: {
                    energy: -10,
                    money: -5000,
                    reputation: 15,
                    knowledge: 15
                }
            },

            {
                id: "listen",

                title:
                    "Бути пасивним слухачем у залі",

                costText:
                    "⚡ -5 енергії",

                resultText:
                    "🧠 +5 знань",

                effects: {
                    energy: -5,
                    knowledge: 5
                }
            }

        ]
    },


    /* =====================================================
       КАРТКА 4
    ===================================================== */

    {
        id: "inner-event-04",
        number: 4,

        title:
            "Підвищення на першій роботі",

        story:
            "Керівництво високо оцінило твою сумлінну щоденну працю і пропонує відчутне підвищення посадового окладу з розширенням повноважень.",

        requirementText:
            "🧠 15+ знань, ⭐ 15+ репутації",

        requirements: {
            knowledge: 15,
            reputation: 15
        },

        choices: [

            {
                id: "accept",

                title:
                    "Прийняти нові відповідальні обов'язки",

                costText:
                    "⚡ -10 регулярної енергії",

                resultText:
                    "💰 +5 000 грн до регулярного доходу | ⭐ +5 репутації",

                effects: {
                    reputation: 5
                },

                persistentEffects: {
                    passiveIncome: 5000,
                    energyPerPeriod: -10
                }
            },

            {
                id: "keep-schedule",

                title:
                    "Зберегти поточний вільний графік",

                costText:
                    "Без змін",

                resultText:
                    "Збереження вільного часу для розвитку власного стартапу",

                effects: {}
            }

        ]
    },


    /* =====================================================
       КАРТКА 5
    ===================================================== */

    {
        id: "inner-event-05",
        number: 5,

        title:
            "Вірусний запуск у соцмережах",

        story:
            "Ти знімаєш перший креативний промо-ролик про свої комерційні послуги чи міні-стартап для залучення нових клієнтів.",

        requirementText:
            "⚡ 10+ енергії",

        requirements: {
            energy: 10
        },

        choices: [

            {
                id: "launch",

                title:
                    "Запустити таргетовану рекламну кампанію",

                costText:
                    "⚡ -10 енергії | 💰 -5 000 грн на рекламу",

                resultText:
                    "Після вибору кидаємо кубик на охоплення",

                minimum: {
                    money: 5000
                },

                effects: {
                    energy: -10,
                    money: -5000
                },

                diceOutcomes: [

                    {
                        min: 1,
                        max: 2,

                        text:
                            "Мале охоплення: 🧠 +5 знань",

                        effects: {
                            knowledge: 5
                        }
                    },

                    {
                        min: 3,
                        max: 4,

                        text:
                            "Чудовий відгук: ⭐ +10 репутації, 💰 +5 000 грн",

                        effects: {
                            reputation: 10,
                            money: 5000
                        }
                    },

                    {
                        min: 5,
                        max: 6,

                        text:
                            "Вірусний тренд: ⭐ +15 репутації, 💰 +10 000 грн",

                        effects: {
                            reputation: 15,
                            money: 10000
                        }
                    }

                ]
            }

        ]
    },


    /* =====================================================
       КАРТКА 6
    ===================================================== */

    {
        id: "inner-event-06",
        number: 6,

        title:
            "Дисципліна та режим дня",

        story:
            "Поєднання навчання, кар'єри та бізнесу вимагає чіткого балансу. Час оптимізувати свій щоденний графік та подолати втому.",

        requirementText:
            "Без вимог",

        requirements: {},

        choices: [

            {
                id: "healthy",

                title:
                    "Налагодити здоровий сон та тайм-менеджмент",

                costText:
                    "💰 -5 000 грн",

                resultText:
                    "⚡ +15 регулярної енергії | 🧠 +5 знань",

                minimum: {
                    money: 5000
                },

                effects: {
                    money: -5000,
                    knowledge: 5
                },

                persistentEffects: {
                    energyPerPeriod: 15
                }
            },

            {
                id: "overwork",

                title:
                    "Працювати без відпочинку та вихідних",

                costText:
                    "⚡ -10 енергії",

                resultText:
                    "Без бонусів",

                effects: {
                    energy: -10
                }
            }

        ]
    },


    /* =====================================================
       КАРТКА 7
    ===================================================== */

    {
        id: "inner-event-07",
        number: 7,

        title:
            "Локальний міський фестиваль-ярмарок",

        story:
            "З'явилася вигідна нагода представити власні крафтові товари чи сервісні послуги на популярному міському фестивалі їжі та хендмейду.",

        requirementText:
            "💰 5 000 грн",

        requirements: {},

        choices: [

            {
                id: "festival",

                title:
                    "Орендувати фірмовий стенд та провести розпродаж",

                costText:
                    "💰 -5 000 грн | ⚡ -15 енергії",

                resultText:
                    "Через 1 хід 💰 +15 000 грн | ⭐ +10 репутації",

                minimum: {
                    money: 5000
                },

                effects: {
                    money: -5000,
                    energy: -15,
                    reputation: 10
                },

                delayedEffect: {
                    turns: 1,
                    effects: {
                        money: 15000
                    },
                    text:
                        "Прибуток із фестивалю"
                }
            },

            {
                id: "skip",

                title:
                    "Пропустити участь у фестивалі",

                costText:
                    "Без змін",

                resultText:
                    "Збереження сил та енергії",

                effects: {}
            }

        ]
    },


    /* =====================================================
       КАРТКА 8
    ===================================================== */

    {
        id: "inner-event-08",
        number: 8,

        title:
            "Постійний задоволений клієнт",

        story:
            "Ключовий клієнт залишився надзвичайно вражений якістю сервісу і пропонує підписати довгостроковий договір на щомісячне абонентське обслуговування.",

        requirementText:
            "🧠 20+ знань, ⭐ 20+ репутації",

        requirements: {
            knowledge: 20,
            reputation: 20
        },

        choices: [

            {
                id: "contract",

                title:
                    "Укласти довгостроковий абонентський контракт",

                costText:
                    "⚡ -5 регулярної енергії",

                resultText:
                    "💰 +5 000 грн регулярного доходу | ⭐ +10 репутації",

                effects: {
                    reputation: 10
                },

                persistentEffects: {
                    passiveIncome: 5000,
                    energyPerPeriod: -5
                }
            },

            {
                id: "single-orders",

                title:
                    "Обслуговувати лише за разовими заявками",

                costText:
                    "Без змін",

                resultText:
                    "💰 +5 000 грн",

                effects: {
                    money: 5000
                }
            }

        ]
    },


    /* =====================================================
       КАРТКА 9
    ===================================================== */

    {
        id: "inner-event-09",
        number: 9,

        title:
            "Оновлення робочого гаджета",

        story:
            "Застарілий ноутбук та повільний смартфон гальмують розвиток справи. Купівля швидкої техніки суттєво підвищить твою особисту швидкість роботи.",

        requirementText:
            "💰 10 000 грн",

        requirements: {},

        choices: [

            {
                id: "new-device",

                title:
                    "Придбати сучасний швидкий робочий ноутбук",

                costText:
                    "💰 -10 000 грн",

                resultText:
                    "⚡ +15 регулярної енергії | 🧠 +10 знань",

                minimum: {
                    money: 10000
                },

                effects: {
                    money: -10000,
                    knowledge: 10
                },

                persistentEffects: {
                    energyPerPeriod: 15
                }
            },

            {
                id: "repair",

                title:
                    "Зробити недорогий сервісний ремонт старого",

                costText:
                    "💰 -5 000 грн | ⚡ -5 енергії",

                resultText:
                    "⚡ +5 регулярної енергії",

                minimum: {
                    money: 5000
                },

                effects: {
                    money: -5000,
                    energy: -5
                },

                persistentEffects: {
                    energyPerPeriod: 5
                }
            }

        ]
    },


    /* =====================================================
       КАРТКА 10
    ===================================================== */

    {
        id: "inner-event-10",
        number: 10,

        title:
            "Молодіжний стартап-грант",

        story:
            "Міжнародний фонд підтримки молоді оголосив відкритий конкурс мікрогрантів для фінансування перших перспективних бізнес-ідей молодих українців.",

        requirementText:
            "🧠 25+ знань",

        requirements: {
            knowledge: 25
        },

        taskText:
            "🗣 1 хвилина пітчу перед гравцями",

        choices: [

            {
                id: "apply",

                title:
                    "Подати структурований бізнес-план на конкурс",

                costText:
                    "⚡ -10 енергії",

                resultText:
                    "Кидок кубика визначить результат захисту",

                effects: {
                    energy: -10
                },

                diceOutcomes: [

                    {
                        min: 1,
                        max: 2,

                        text:
                            "Заявку відхилено: 🧠 +5 знань",

                        effects: {
                            knowledge: 5
                        }
                    },

                    {
                        min: 3,
                        max: 4,

                        text:
                            "2-ге місце: 💰 +10 000 грн | ⭐ +10 репутації",

                        effects: {
                            money: 10000,
                            reputation: 10
                        }
                    },

                    {
                        min: 5,
                        max: 6,

                        text:
                            "Переможець: 💰 +15 000 грн | ⭐ +15 репутації | 🧠 +10 знань",

                        effects: {
                            money: 15000,
                            reputation: 15,
                            knowledge: 10
                        }
                    }

                ]
            }

        ]
    },


    /* =====================================================
       КАРТКА 11
    ===================================================== */

    {
        id: "inner-event-11",
        number: 11,

        title:
            "Конфлікт із вибагливим клієнтом",

        story:
            "Через непорозуміння у технічному завданні клієнт висловлює претензії та вимагає або переробити все заново, або терміново повернути сплачені гроші.",

        requirementText:
            "Без вимог",

        requirements: {},

        choices: [

            {
                id: "diplomacy",

                title:
                    "Дипломатично доопрацювати та узгодити деталі",

                costText:
                    "⚡ -10 енергії | 💰 -5 000 грн",

                resultText:
                    "⭐ +10 репутації | 🧠 +5 знань",

                minimum: {
                    money: 5000
                },

                effects: {
                    energy: -10,
                    money: -5000,
                    reputation: 10,
                    knowledge: 5
                }
            },

            {
                id: "refund",

                title:
                    "Повернути кошти без зайвих розмов",

                costText:
                    "💰 -5 000 грн",

                resultText:
                    "⭐ +5 репутації",

                minimum: {
                    money: 5000
                },

                effects: {
                    money: -5000,
                    reputation: 5
                }
            },

            {
                id: "conflict",

                title:
                    "Піти на різкий відкритий конфлікт",

                costText:
                    "⭐ -10 репутації",

                resultText:
                    "Гроші та енергія збережені",

                effects: {
                    reputation: -10
                }
            }

        ]
    },


    /* =====================================================
       КАРТКА 12
    ===================================================== */

    {
        id: "inner-event-12",
        number: 12,

        title:
            "Вступ до професійного бізнес-клубу",

        story:
            "Тобі пропонують стати дійсним членом закритого клубу молодих підприємців та лідерів думок твоєї галузі для щомісячного обміну досвідом.",

        requirementText:
            "⭐ 20+ репутації",

        requirements: {
            reputation: 20
        },

        choices: [

            {
                id: "join",

                title:
                    "Сплатити членський внесок та активно відвідувати зустрічі",

                costText:
                    "💰 -5 000 грн | ⚡ -10 енергії",

                resultText:
                    "🧠 +10 знань | ⭐ +10 репутації",

                minimum: {
                    money: 5000
                },

                effects: {
                    money: -5000,
                    energy: -10,
                    knowledge: 10,
                    reputation: 10
                }
            },

            {
                id: "decline",

                title:
                    "Відмовитися від вступу до клубу",

                costText:
                    "Без змін",

                resultText:
                    "Збереження бюджету",

                effects: {}
            }

        ]
    },


    /* =====================================================
       КАРТКА 13
    ===================================================== */

    {
        id: "inner-event-13",
        number: 13,

        title:
            "Кар'єрне підвищення до Рівня 2",

        story:
            "Ти здобув вагомий практичний досвід і готовий зробити наступний кар'єрний крок. Щоб отримати підвищення, презентуй іншим учасникам свою діяльність.",

        requirementText:
            "Відповідність вимогам Рівня 2: ⭐ min 25, 🧠 min 25",

        requirements: {
            reputation: 25,
            knowledge: 25
        },

        taskText:
            "🗣 Презентуй іншим учасникам свою діяльність",

        choices: [

            {
                id: "promotion",

                title:
                    "Успішно презентувати свою діяльність",

                costText:
                    "⚡ -10 енергії",

                resultText:
                    "Перехід на 2-й кар'єрний рівень | ⭐ +10 репутації",

                effects: {
                    energy: -10,
                    reputation: 10
                },

                specialAction:
                    "promoteToLevel2"
            }

        ]
    },


    /* =====================================================
       КАРТКА 14
    ===================================================== */

    {
        id: "inner-event-14",
        number: 14,

        title:
            "Галузева олімпіада",

        story:
            "Тобі випала честь представити свій навчальний заклад або команду на престижній всеукраїнській олімпіаді з підприємництва та інновацій.",

        requirementText:
            "🧠 20+ знань",

        requirements: {
            knowledge: 20
        },

        choices: [

            {
                id: "participate",

                title:
                    "Взяти активну участь у турнірі інноваторів",

                costText:
                    "⚡ -10 енергії",

                resultText:
                    "Кидок кубика визначить результат",

                effects: {
                    energy: -10
                },

                diceOutcomes: [

                    {
                        min: 1,
                        max: 2,

                        text:
                            "Сертифікат фіналіста: 🧠 +5 знань",

                        effects: {
                            knowledge: 5
                        }
                    },

                    {
                        min: 3,
                        max: 4,

                        text:
                            "Призове місце: 🧠 +10 | ⭐ +10 | 💰 +5 000 грн",

                        effects: {
                            knowledge: 10,
                            reputation: 10,
                            money: 5000
                        }
                    },

                    {
                        min: 5,
                        max: 6,

                        text:
                            "1-ше місце: 🧠 +16 | ⭐ +15 | 💰 +10 000 грн",

                        effects: {
                            knowledge: 16,
                            reputation: 15,
                            money: 10000
                        }
                    }

                ]
            }

        ]
    },


    /* =====================================================
       КАРТКА 15
    ===================================================== */

    {
        id: "inner-event-15",
        number: 15,

        title:
            "Брак сировини та робота над помилками",

        story:
            "Через брак досвіду перша партія матеріалів від ненадійного постачальника виявилася дефектною. Час зробити правильні фінансові висновки.",

        requirementText:
            "Без вимог",

        requirements: {},

        choices: [

            {
                id: "analysis",

                title:
                    "Провести аналіз та укласти договір із сертифікованим партнером",

                costText:
                    "💰 -5 000 грн | ⚡ -10 енергії",

                resultText:
                    "🧠 +10 знань",

                minimum: {
                    money: 5000
                },

                effects: {
                    money: -5000,
                    energy: -10,
                    knowledge: 10
                }
            },

            {
                id: "loss",

                title:
                    "Списати бракований товар у прямі збитки",

                costText:
                    "💰 -5 000 грн",

                resultText:
                    "Без бонусів",

                minimum: {
                    money: 5000
                },

                effects: {
                    money: -5000
                }
            }

        ]
    },


   /* =====================================================
   КАРТКА 16
===================================================== */
{
    id: "inner-event-16",
    number: 16,

    title:
        "ДТП з твоєї вини",

    story:
        "Під час паркування ти випадково пошкоджуєш іншу автівку. Відшкодування збитків становить 5 000 грн. Перевір, чи є страховий захист!",

    requirementText:
        "Несподівана дорожня пригода",

    requirements: {},

    choices: [
        {
            id: "insured",

            title:
                "Скористатися добровільною автоцивілкою",

            conditionProduct:
                "extra_motor_insurance",

            costText:
                "💰 0 грн | ⚡ -10 енергії",

            resultText:
                "🛡️ Страховка покриває 5 000 грн збитків | 🧠 +10 знань",

            effects: {
                energy: -10,
                knowledge: 10
            },

            consumeBankProduct:
                "extra_motor_insurance"
        },

        {
            id: "not-insured",

            title:
                "Відшкодувати збитки самостійно",

            costText:
                "💰 -5 000 грн | ⚡ -10 енергії",

            resultText:
                "🧠 +5 знань",

            effects: {
                money: -5000,
                energy: -10,
                knowledge: 5
            }
        }
    ]
},

    /* =====================================================
       КАРТКА 17
    ===================================================== */
{
    id: "inner-event-17",
    number: 17,

    title:
        "Затоплення оселі",

    story:
        "У сусідній оселі вночі прорвало трубу — вода частково пошкодила меблі та робочу документацію.",

    requirementText:
        "Комунальна аварія в будівлі",

    requirements: {},

    choices: [
        {
            id: "home-insurance",

            title:
                "Скористатися страхуванням оселі",

            conditionProduct:
                "home_insurance",

            costText:
                "💰 -1 000 грн | ⚡ -10 енергії",

            resultText:
                "🛡️ Страховка покриває 4 000 грн із 5 000 грн збитків | ⭐ +10 репутації",

            effects: {
                money: -1000,
                energy: -10,
                reputation: 10
            },

            consumeBankProduct:
                "home_insurance"
        },

        {
            id: "repair",

            title:
                "Сплатити ремонт самостійно",

            costText:
                "💰 -5 000 грн | ⚡ -10 енергії",

            resultText:
                "🧠 +5 знань",

            effects: {
                money: -5000,
                energy: -10,
                knowledge: 5
            }
        }
    ]
},



    /* =====================================================
       КАРТКА 18
    ===================================================== */

    {
        id: "inner-event-18",
        number: 18,

        title:
            "Втрата смартфона та шахрайство",

        story:
            "Ти випадково загубив робочий смартфон із незаблокованими банківськими додатками. Час швидко реагувати на кіберзагрозу!",

        requirementText:
            "Ризик кібершахрайства",

        requirements: {},

        choices: [

            {
                id: "fast-block",

                title:
                    "Миттєво заблокувати рахунки та увімкнути 2FA",

                costText:
                    "💰 -5 000 грн | ⚡ -5 енергії",

                resultText:
                    "🧠 +10 знань | ⭐ +5 репутації",

                effects: {
                    money: -5000,
                    energy: -5,
                    knowledge: 10,
                    reputation: 5
                }
            },

            {
                id: "late",

                title:
                    "Запізніла реакція на блокування карт",

                costText:
                    "💰 -10 000 грн | ⚡ -10 енергії",

                resultText:
                    "🧠 +15 знань",

                effects: {
                    money: -10000,
                    energy: -10,
                    knowledge: 15
                }
            }

        ]
    },


    /* =====================================================
       КАРТКА 19
    ===================================================== */

    {
        id: "inner-event-19",
        number: 19,

        title:
            "Фінал Кола 1: Підсумковий річний звіт",

        story:
            "Твій перший повноцінний фінансовий рік завершено! Час проаналізувати здобуті навички, підбити сальдо та вийти на масштабний рівень гри.",

        requirementText:
            "Завершення Кола 1",

        requirements: {},

        choices: [

            {
                id: "report",

                title:
                    "Підбити річний баланс та реінвестувати накопичений капітал",

                costText:
                    "Безкоштовно",

                resultText:
                    "Якщо ⭐ Репутація + 🧠 Знання ≥ 60 → 💰 +15 000 грн",

                effects: {},

                specialAction:
                    "circleOneReport"
            }

        ]
    },


    /* =====================================================
       КАРТКА 20
    ===================================================== */

    {
        id: "inner-event-20",
        number: 20,

        title:
            "Підвищення зарплати",

        story:
            "Керівництво високо оцінило результати твоєї роботи та лояльність! Тобі пропонують суттєве підвищення зарплати та нові відповідальні обов'язки.",

        requirementText:
            "🧠 20+ знань, ⭐ 30+ репутації",

        requirements: {
            knowledge: 20,
            reputation: 30
        },

        choices: [

            {
                id: "salary-up",

                title:
                    "Прийняти заохочення",

                costText:
                    "⚡ -5 енергії",

                resultText:
                    "💰 +5 000 грн до регулярного доходу | ⭐ +5 репутації",

                effects: {
                    energy: -5,
                    reputation: 5
                },

                persistentEffects: {
                    passiveIncome: 5000
                }
            }

        ]
    },


    /* =====================================================
       КАРТКА 21
    ===================================================== */

    {
        id: "inner-event-21",
        number: 21,

        title:
            "Кар'єрне підвищення",

        story:
            "Твоя наполеглива праця та високі результати принесли свої плоди — тобі пропонують нову, більш відповідальну посаду. Підвищення можливе лише на 1 рівень.",

        requirementText:
            "Виконати вимоги наступної професійної сходинки",

        requirements: {},

        choices: [

            {
                id: "career-up",

                title:
                    "Прийняти кар'єрне підвищення",

                costText:
                    "⚡ -10 енергії",

                resultText:
                    "Перехід на наступний рівень | 💰 +10 000 грн | ⭐ +10 репутації",

                effects: {
                    energy: -10,
                    money: 10000,
                    reputation: 10
                },

                specialAction:
                    "promoteOneLevelIfReady"
            }

        ]
    },


    /* =====================================================
       КАРТКА 22
    ===================================================== */

    {
        id: "inner-event-22",
        number: 22,

        title:
            "Запрошення до великої компанії",

        story:
            "Твої унікальні навички та висока репутація привернули увагу хедхантерів відомої компанії. Тобі пропонують вигідний контракт та можливість спробувати себе в новій професії!",

        requirementText:
            "🧠 20+ знань, ⭐ 40+ репутації",

        requirements: {
            knowledge: 20,
            reputation: 40
        },

        choices: [

            {
                id: "accept-company",

                title:
                    "Прийняти запрошення",

                costText:
                    "⚡ -5 енергії",

                resultText:
                    "Зміна посади/професії без зміни ресурсів | 💰 +15 000 грн | ⭐ +10 репутації",

                effects: {
                    energy: -5,
                    money: 15000,
                    reputation: 10
                },

                specialAction:
                    "changeCareerSector"
            }

        ]
    },


    /* =====================================================
       КАРТКА 23
    ===================================================== */

    {
        id: "inner-event-23",
        number: 23,

        title:
            "Вдале професійне знайомство",

        story:
            "Під час важливої події ти встановив корисний контакт із впливовою людиною. Інвестуй час у підтримку стосунків — і це відкриє перед тобою нові двері.",

        requirementText:
            "⭐ 25+ репутації",

        requirements: {
            reputation: 25
        },

        choices: [

            {
                id: "keep-contact",

                title:
                    "Підтримувати контакт",

                costText:
                    "💰 -5 000 грн",

                resultText:
                    "Наступна кар'єрна подія: додатково 💰 +10 000 грн та ⭐ +10 репутації",

                minimum: {
                    money: 5000
                },

                effects: {
                    money: -5000
                },

                specialAction:
                    "grantNextCareerEventBonus"
            },

            {
                id: "stop-contact",

                title:
                    "Не продовжувати спілкування",

                costText:
                    "Без змін",

                resultText:
                    "Збереження поточного стану",

                effects: {}
            }

        ]
    },


    /* =====================================================
       КАРТКА 24
    ===================================================== */

    {
        id: "inner-event-24",
        number: 24,

        title:
            "Рік особистого розвитку",

        story:
            "Ти вирішуєш зробити стратегічну паузу, щоб інвестувати час і гроші у власний розвиток. Це вимагає ресурсів сьогодні заради масштабних здобутків завтра.",

        requirementText:
            "Без вимог",

        requirements: {},

        choices: [

            {
                id: "development",

                title:
                    "Інвестувати у розвиток",

                costText:
                    "💰 -5 000 грн | ⚡ -5 енергії",

                resultText:
                    "🧠 +10 знань. Якщо після цього 🧠 80+ → ⭐ +5 репутації",

                minimum: {
                    money: 5000
                },

                effects: {
                    money: -5000,
                    energy: -5,
                    knowledge: 10
                },

                specialAction:
                    "personalDevelopmentBonus"
            },

            {
                id: "nothing",

                title:
                    "Нічого не змінювати",

                costText:
                    "Без змін",

                resultText:
                    "Збереження поточного стану",

                effects: {}
            }

        ]
    }

];


/* =========================================================
   50. ЗАПУСК КАРТКОВОГО ХОДУ

   За правилами:

   1-й кидок — рух.
   2-й кидок — визначає картку.

   У веб-версії колоди мають
   більше ніж 6 карток.

   Тому цифровий "другий кидок"
   генерує номер у межах
   кількості карток конкретної колоди.

   Це дозволяє використати
   всі картки документа.
========================================================= */

function startCardTurn(
    deckName
) {

    const player =
        gameState.player;


    const deck =
        getDeckForParticipant(
            player,
            deckName
        );


    if (
        !deck ||
        deck.length === 0
    ) {

        showRaifikCurrentCardMessage(

            "Ця колода ще не підключена."

        );


        setTimeout(
            startAITurns,
            1000
        );


        return;

    }


    showSecondCardRoll(
        deckName,
        deck
    );

}


/* =========================================================
   51. ОТРИМАТИ КОЛОДУ ДЛЯ КОЛА
========================================================= */

function getDeckForParticipant(
    participant,
    deckName
) {

    if (
        participant.board ===
        "inner"
    ) {

        return (
            INNER_CARD_DECKS[
                deckName
            ] || []
        );

    }


    return (
        OUTER_CARD_DECKS[
            deckName
        ] || []
    );

}


/* =========================================================
   52. ДРУГИЙ КИДОК —
   ВИЗНАЧЕННЯ НОМЕРА КАРТКИ
========================================================= */

function showSecondCardRoll(
    deckName,
    deck
) {

    const type =
        CELL_TYPES[
            deckName
        ];


    openGameInfoModal(`

        <div class="card-roll-modal">


            <div class="card-roll-icon">

                ${type.icon}

            </div>


            <h2>

                ${type.name}

            </h2>


            <p>

                Перший кидок визначив,
                куди ти потрапив.

            </p>


            <p>

                Тепер другий кидок
                визначить номер картки.

            </p>


            <div
                id="secondCardDice"
                class="second-card-dice"
            >

                ?

            </div>


            <button
                id="secondCardRollButton"
                class="main-game-btn"
            >

                🎲 КИНУТИ ЩЕ РАЗ

            </button>


        </div>

    `);


    document
        .getElementById(
            "secondCardRollButton"
        )
        .addEventListener(
            "click",
            () => {

                rollForCardNumber(
                    deckName,
                    deck
                );

            }
        );

}


/* =========================================================
   53. РАНДОМНИЙ НОМЕР КАРТКИ
========================================================= */

async function rollForCardNumber(
    deckName,
    deck
) {

    const button =
        document.getElementById(
            "secondCardRollButton"
        );


    const display =
        document.getElementById(
            "secondCardDice"
        );


    if (button) {

        button.disabled =
            true;

    }


    for (
        let i = 0;
        i < 9;
        i++
    ) {

        const temp =
            randomNumber(
                1,
                deck.length
            );


        if (display) {

            display.textContent =
                temp;

        }


        await delay(
            70
        );

    }


    const number =
        randomNumber(
            1,
            deck.length
        );


    if (display) {

        display.textContent =
            number;

    }


    await delay(
        450
    );


    const card =
        deck[
            number - 1
        ];


    addLog(

        `${CELL_TYPES[deckName].icon} ${CELL_TYPES[deckName].name}: картка №${card.number}`

    );


    showDecisionCard(
        deckName,
        card
    );

}


/* =========================================================
   54. ПЕРЕВІРКА УМОВ КАРТКИ
========================================================= */

function checkCardRequirements(
    participant,
    requirements = {}
) {

    const failed = [];


    if (
        requirements.money &&
        participant.money <
            requirements.money
    ) {

        failed.push(
            `💰 ${formatMoney(requirements.money)} грн`
        );

    }


    if (
        requirements.reputation &&
        participant.reputation <
            requirements.reputation
    ) {

        failed.push(
            `⭐ ${requirements.reputation}`
        );

    }


    if (
        requirements.knowledge &&
        participant.knowledge <
            requirements.knowledge
    ) {

        failed.push(
            `🧠 ${requirements.knowledge}`
        );

    }


    if (
        requirements.energy &&
        participant.energy <
            requirements.energy
    ) {

        failed.push(
            `⚡ ${requirements.energy}`
        );

    }


    return {

        passed:
            failed.length === 0,

        failed

    };

}


/* =========================================================
   55. ПОКАЗ КАРТКИ З РІШЕННЯМИ
========================================================= */

function showDecisionCard(
    deckName,
    card
) {

    const player =
        gameState.player;


    const requirementCheck =
        checkCardRequirements(

            player,

            card.requirements

        );


    const choicesHTML =
        card.choices

            .map(
                (
                    choice,
                    index
                ) => {


                    const minimumCheck =
                        checkCardRequirements(

                            player,

                            choice.minimum ||
                            {}

                        );


                    const disabled =
                        !minimumCheck.passed;


                    return `

                        <button
                            class="
                                card-decision-button
                                ${
                                    disabled
                                    ? "card-decision-disabled"
                                    : ""
                                }
                            "
                            data-choice-index="${index}"
                            ${
                                disabled
                                ? "disabled"
                                : ""
                            }
                        >


                            <strong>

                                ${choice.title}

                            </strong>


                            <span class="card-decision-cost">

                                ${
                                    choice.costText ||
                                    "Без витрат"
                                }

                            </span>


                            <span class="card-decision-result">

                                ${
                                    choice.resultText ||
                                    ""
                                }

                            </span>


                        </button>

                    `;

                }
            )

            .join("");


    openGameInfoModal(`

        <div class="decision-card-modal">


            <div class="decision-card-number">

                Картка №${card.number}

            </div>


            <div class="decision-card-type">

                ${CELL_TYPES[deckName].icon}
                ${CELL_TYPES[deckName].name}

            </div>


            <h2>

                ${card.title}

            </h2>


            <p class="decision-card-story">

                ${card.story}

            </p>


            <div class="decision-card-requirement">

                <strong>
                    🎯 Умова:
                </strong>

                ${card.requirementText}

            </div>


            ${
                card.taskText

                ? `

                    <div class="decision-card-task">

                        ${card.taskText}

                    </div>

                  `

                : ""
            }


            ${
                !requirementCheck.passed

                ? `

                    <div class="card-requirement-warning">

                        ⚠️ Для повної активації
                        не вистачає:

                        <strong>

                            ${requirementCheck.failed.join(", ")}

                        </strong>

                    </div>

                  `

                : ""
            }


            <div class="card-decisions-list">

                ${choicesHTML}

            </div>


        </div>

    `);


    document
        .querySelectorAll(
            ".card-decision-button"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        const index =
                            Number(
                                button.dataset.choiceIndex
                            );


                        resolveCardChoice(

                            deckName,

                            card,

                            card.choices[index]

                        );

                    }
                );

            }
        );

}


/* =========================================================
   56. ОБРОБКА ВИБОРУ
========================================================= */

async function resolveCardChoice(
    deckName,
    card,
    choice
) {

    const player =
        gameState.player;


    /* ОСНОВНІ ЕФЕКТИ */

    applyEffects(

        player,

        choice.effects ||
        {}

    );


    /* ПОСТІЙНІ ЕФЕКТИ */

    applyPersistentEffects(

        player,

        choice.persistentEffects

    );


    /* ВІДКЛАДЕНИЙ ЕФЕКТ */

    if (
        choice.delayedEffect
    ) {

        addDelayedEffect(

            player,

            choice.delayedEffect

        );

    }


    /* СПЕЦІАЛЬНА ДІЯ */

    if (
        choice.specialAction
    ) {

        applyCardSpecialAction(

            player,

            choice.specialAction

        );

    }


    /* КИДОК КУБИКА ВСЕРЕДИНІ КАРТКИ */

    if (
        choice.diceOutcomes
    ) {

        await resolveCardDiceOutcome(

            card,

            choice

        );


        return;

    }


    addLog(

        `${player.name}: ${card.title} → ${choice.title}`

    );


    showCardFinalResult(

        deckName,

        card,

        choice,

        choice.resultText

    );

}


/* =========================================================
   57. ПОСТІЙНІ ЕФЕКТИ КАРТКИ
========================================================= */

function applyPersistentEffects(
    participant,
    persistentEffects
) {

    if (
        !persistentEffects
    ) {

        return;

    }


    if (
        persistentEffects.passiveIncome
    ) {

        participant.passiveIncome +=
            persistentEffects.passiveIncome;

    }


    if (
        persistentEffects.energyPerPeriod
    ) {

        participant.effects.energyPerTurn +=
            persistentEffects.energyPerPeriod;

    }

}


/* =========================================================
   58. ВІДКЛАДЕНІ ВИПЛАТИ
========================================================= */

function addDelayedEffect(
    participant,
    delayedEffect
) {

    participant
        .effects
        .delayedPayments
        .push({

            turnsLeft:
                delayedEffect.turns,

            effects:
                delayedEffect.effects,

            text:
                delayedEffect.text ||
                "Відкладений ефект"

        });

}


/* =========================================================
   59. КИДОК КУБИКА УСЕРЕДИНІ КАРТКИ
========================================================= */

async function resolveCardDiceOutcome(
    card,
    choice
) {

    const player =
        gameState.player;


    openGameInfoModal(`

        <div class="card-extra-roll">

            <h2>
                🎲 Кидок кубика
            </h2>

            <p>
                Результат визначить,
                що станеться далі.
            </p>

            <div
                id="cardExtraDice"
                class="second-card-dice"
            >
                ⚀
            </div>

        </div>

    `);


    const display =
        document.getElementById(
            "cardExtraDice"
        );


    for (
        let i = 0;
        i < 8;
        i++
    ) {

        const temp =
            randomNumber(
                1,
                6
            );


        if (display) {

            display.textContent =
                DICE_FACES[
                    temp - 1
                ];

        }


        await delay(
            80
        );

    }


    const value =
        randomNumber(
            1,
            6
        );


    if (display) {

        display.textContent =
            DICE_FACES[
                value - 1
            ];

    }


    await delay(
        450
    );


    const outcome =
        choice
            .diceOutcomes
            .find(
                item =>

                    value >= item.min
                    &&
                    value <= item.max
            );


    if (outcome) {

        applyEffects(

            player,

            outcome.effects ||
            {}

        );

    }


    addLog(

        `🎲 ${card.title}: випало ${value}`

    );


    showCardFinalResult(

        "event",

        card,

        choice,

        outcome
            ? outcome.text
            : "Без додаткових змін"

    );

}


/* =========================================================
   60. СПЕЦІАЛЬНІ ДІЇ
========================================================= */

function applyCardSpecialAction(
    participant,
    action
) {

    switch (
        action
    ) {


        /* =================================================
           КАРТКА 13
        ================================================= */

        case "promoteToLevel2":

            if (
                participant.careerLevel < 1
            ) {

                participant.careerLevel =
                    1;


                const stats =
                    getCareerStats(

                        participant.sector.id,

                        2

                    );


                participant.salary =
                    stats.salary;

            }

            break;


        /* =================================================
           КАРТКА 19
        ================================================= */

        case "circleOneReport":

            if (
                participant.reputation +
                participant.knowledge >=
                60
            ) {

                participant.money +=
                    15000;

            }

            break;


        /* =================================================
           КАРТКА 21
        ================================================= */

        case "promoteOneLevelIfReady":

            promoteParticipantOneLevelIfReady(
                participant
            );

            break;


        /* =================================================
           КАРТКА 22

           Документ говорить про
           "зміну посади/професії",
           але не визначає,
           ЯКУ саме професію обрати.

           Тому автоматично
           професію НЕ змінюємо.

           Грошовий та репутаційний
           ефект уже застосовано.
        ================================================= */

        case "changeCareerSector":

            addLog(

                "ℹ️ Картка передбачає зміну професії, але конкретний механізм вибору професії у файлі не визначений."

            );

            break;


        /* =================================================
           КАРТКА 23
        ================================================= */

        case "grantNextCareerEventBonus":

            participant.effects
                .nextCareerEventBonus = {

                    money: 10000,
                    reputation: 10

                };

            break;


        /* =================================================
           КАРТКА 24
        ================================================= */

        case "personalDevelopmentBonus":

            if (
                participant.knowledge >=
                80
            ) {

                participant.reputation +=
                    5;

            }

            break;

    }


    clampPlayerResources(
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
   61. ПІДВИЩЕННЯ НА 1 РІВЕНЬ
   ЛИШЕ ЯКЩО ВИКОНАНІ УМОВИ
========================================================= */

function promoteParticipantOneLevelIfReady(
    participant
) {

    const sector =
        participant.sector;


    if (!sector) {

        return false;

    }


    if (
        participant.careerLevel >=
        sector.levels.length - 1
    ) {

        return false;

    }


    const nextLevel =
        participant.careerLevel +
        1;


    const nextStats =
        getCareerStats(

            sector.id,

            nextLevel + 1

        );


    const ready =

        participant.reputation >=
            nextStats.reputation

        &&

        participant.knowledge >=
            nextStats.knowledge

        &&

        participant.energy >=
            nextStats.energy;


    if (!ready) {

        return false;

    }


    participant.careerLevel =
        nextLevel;


    participant.salary =
        nextStats.salary;


    addLog(

        `🎉 ${participant.name}: професійний рівень ${nextLevel + 1}`

    );


    return true;

}


/* =========================================================
   62. ФІНАЛ КАРТКИ

   Хід НЕ переходить до AI
   автоматично.

   Гравець сам натискає:
   "ЗАВЕРШИТИ ХІД".
========================================================= */

function showCardFinalResult(
    deckName,
    card,
    choice,
    resultText
) {

    const type =
        CELL_TYPES[
            deckName
        ];


    openGameInfoModal(`

        <div class="card-final-result">


            <div class="decision-card-type">

                ${type.icon}
                ${type.name}

            </div>


            <h2>

                ${card.title}

            </h2>


            <div class="card-result-choice">

                Твоє рішення:

                <strong>

                    ${choice.title}

                </strong>

            </div>


            <div class="card-result-text">

                ${resultText || "Без змін"}

            </div>


            <button
                id="finishCardTurnButton"
                class="main-game-btn"
            >

                ЗАВЕРШИТИ ХІД

            </button>


        </div>

    `);


    document
        .getElementById(
            "finishCardTurnButton"
        )
        .addEventListener(
            "click",
            finishPlayerCardTurn
        );

}


/* =========================================================
   63. ЗАВЕРШИТИ КАРТКОВИЙ ХІД
========================================================= */

function finishPlayerCardTurn() {

    closeGameInfoModal();


    startAITurns();

}


/* =========================================================
   КІНЕЦЬ ЧАСТИНИ 4А

   ДАЛІ — ЧАСТИНА 4Б:

   - Події ВЕЛИКОГО кола
   - 29 карток Кола 2
   - умови банківських продуктів
   - інтернет-еквайринг
   - валютний рахунок
   - інвестиції
   - масштабування
   - AI
========================================================= */
   /* =====================================================
       події велике коло
    ===================================================== */
OUTER_CARD_DECKS.event = [

   /* =====================================================
       КАРТКА 6
    ===================================================== */

    {
        id: "outer-event-06",
        number: 6,

        title:
            "Грант на розвиток",

        story:
            "Твій проєкт отримав можливість виграти грант — безповоротне фінансування на розвиток власної справи без віддачі частки інвесторам! Це твоя нагода прискорити зростання.",

        requirementText:
            "🧠 55+ знань та наявність активного проєкту",

        requirements: {
            knowledge: 55
        },

        taskText:
            "🗣 Маєш 2 хвилини, щоб описати свій грант перед іншими гравцями. Якщо 51%+ проголосують «за» — проєкт реалізовано. При 50/50 вирішує ведучий.",

        choices: [

            {
                id: "grant-success",

                title:
                    "Отримати грант при успішному голосуванні",

                costText:
                    "🗣 2 хвилини презентації проєкту",

                resultText:
                    "💰 +20 000 грн | ⭐ +10 репутації",

                effects: {
                    money: 20000,
                    reputation: 10
                }
            }

        ]
    },


    /* =====================================================
       КАРТКА 7
    ===================================================== */

    {
        id: "outer-event-07",
        number: 7,

        title:
            "Авторська методика",

        story:
            "Твоя унікальна авторська методика роботи була успішно протестована й готова до широкого впровадження. Це справжній тріумф твого інтелекту та професіоналізму!",

        requirementText:
            "🧠 70+ знань",

        requirements: {
            knowledge: 70
        },

        choices: [

            {
                id: "launch-method",

                title:
                    "Прийняти заохочення та запустити методику",

                costText:
                    "Без додаткових витрат",

                resultText:
                    "💰 +10 000 грн | 💰 +5 000 грн регулярного доходу | ⭐ +10 репутації | 🧠 +5 знань",

                effects: {
                    money: 10000,
                    reputation: 10,
                    knowledge: 5
                },

                persistentEffects: {
                    passiveIncome: 5000
                }
            }

        ]
    },


    /* =====================================================
       КАРТКА 8
    ===================================================== */

    {
        id: "outer-event-08",
        number: 8,

        title:
            "Наставник року",

        story:
            "Тебе запросили стати ментором для молодих спеціалістів. Це чудова нагода поділитися досвідом та укріпити свій статус експерта, хоч це й потребуватиме твоїх сил.",

        requirementText:
            "⭐ 35+ репутації",

        requirements: {
            reputation: 35
        },

        choices: [

            {
                id: "mentor",

                title:
                    "Прийняти роль наставника",

                costText:
                    "⚡ -5 енергії",

                resultText:
                    "⭐ +5 репутації | 🧠 +10 знань | наступне підвищення знань коштує на 50% дешевше",

                effects: {
                    energy: -5,
                    reputation: 5,
                    knowledge: 10
                },

                specialAction:
                    "knowledgeDiscount"
            },

            {
                id: "mentor-decline",

                title:
                    "Відмовитися",

                costText:
                    "Без змін",

                resultText:
                    "Збереження поточного стану",

                effects: {}
            },

            {
                id: "mentor-risk",

                title:
                    "Альтернатива з ризиком",

                costText:
                    "Результат визначає кубик",

                resultText:
                    "🎲 Кидок кубика",

                effects: {},

                diceOutcomes: [

                    {
                        min: 1,
                        max: 2,

                        text:
                            "Учні втратили інтерес: ⭐ +5 репутації",

                        effects: {
                            reputation: 5
                        }
                    },

                    {
                        min: 3,
                        max: 4,

                        text:
                            "Успішне менторство: ⭐ +10 репутації | 🧠 +10 знань",

                        effects: {
                            reputation: 10,
                            knowledge: 10
                        }
                    },

                    {
                        min: 5,
                        max: 6,

                        text:
                            "Зірковий випускник: ⭐ +15 репутації | 💰 +5 000 грн",

                        effects: {
                            reputation: 15,
                            money: 5000
                        }
                    }

                ]
            }

        ]
    },


    /* =====================================================
       КАРТКА 9
    ===================================================== */

    {
        id: "outer-event-09",
        number: 9,

        title:
            "Публікація в професійному виданні",

        story:
            "Твою аналітичну статтю прийняли до публікації в престижному журналі! Ти можеш одразу випустити матеріал для швидкого визнання або доопрацювати його заради ще більшого ефекту.",

        requirementText:
            "🧠 50+ знань",

        requirements: {
            knowledge: 50
        },

        choices: [

            {
                id: "publish-now",

                title:
                    "Опублікувати одразу",

                costText:
                    "⚡ -5 енергії",

                resultText:
                    "⭐ +10 репутації",

                effects: {
                    energy: -5,
                    reputation: 10
                }
            },

            {
                id: "improve",

                title:
                    "Доопрацювати матеріал",

                costText:
                    "⚡ -10 енергії",

                resultText:
                    "🧠 +10 знань | ⭐ +15 репутації",

                effects: {
                    energy: -10,
                    knowledge: 10,
                    reputation: 15
                }
            },

            {
                id: "publication-risk",

                title:
                    "Випробувати вдачу",

                costText:
                    "Результат визначає кубик",

                resultText:
                    "🎲 Кидок кубика",

                effects: {},

                diceOutcomes: [

                    {
                        min: 1,
                        max: 2,

                        text:
                            "Стаття залишилася непоміченою: ⭐ +5 репутації",

                        effects: {
                            reputation: 5
                        }
                    },

                    {
                        min: 3,
                        max: 4,

                        text:
                            "Спільнота тепло прийняла статтю: ⭐ +10 репутації",

                        effects: {
                            reputation: 10
                        }
                    },

                    {
                        min: 5,
                        max: 6,

                        text:
                            "Публікація стала хітом: ⭐ +15 репутації | 💰 +10 000 грн",

                        effects: {
                            reputation: 15,
                            money: 10000
                        }
                    }

                ]
            }

        ]
    },


    /* =====================================================
       КАРТКА 10
    ===================================================== */

    {
        id: "outer-event-10",
        number: 10,

        title:
            "Запуск власного курсу",

        story:
            "Ти створив власний навчальний курс! Це важливий крок до монетизації твоєї експертизи. Ти можеш інвестувати кошти в його негайний запуск або трохи зачекати.",

        requirementText:
            "🧠 60+ знань",

        requirements: {
            knowledge: 60
        },

        bankRequirement: {
            product:
                "internet_acquiring",

            text:
                "💳 Наявність інтернет-еквайрингу"
        },

        choices: [

            {
                id: "course-launch",

                title:
                    "Запустити курс",

                costText:
                    "💰 -5 000 грн | ⚡ -5 енергії",

                resultText:
                    "💰 +5 000 грн регулярного доходу | ⭐ +5 репутації",

                minimum: {
                    money: 5000
                },

                effects: {
                    money: -5000,
                    energy: -5,
                    reputation: 5
                },

                persistentEffects: {
                    passiveIncome: 5000
                }
            },

            {
                id: "course-delay",

                title:
                    "Відкласти запуск",

                costText:
                    "Без змін",

                resultText:
                    "Збереження поточного стану",

                effects: {}
            },

            {
                id: "course-risk",

                title:
                    "Ризикнути із запуском",

                costText:
                    "Результат визначає кубик",

                resultText:
                    "🎲 Кидок кубика",

                effects: {},

                diceOutcomes: [

                    {
                        min: 1,
                        max: 2,

                        text:
                            "Проєкт не окупився.",

                        effects: {}
                    },

                    {
                        min: 3,
                        max: 4,

                        text:
                            "Курс має стабільний попит: 💰 +10 000 грн | ⭐ +5 репутації",

                        effects: {
                            money: 10000,
                            reputation: 5
                        }
                    },

                    {
                        min: 5,
                        max: 6,

                        text:
                            "Абсолютний успіх: 💰 +10 000 грн | ⭐ +10 репутації | отримай картку Доля",

                        effects: {
                            money: 10000,
                            reputation: 10
                        },

                        specialAction:
                            "drawFateCard"
                    }

                ]
            }

        ]
    },


    /* =====================================================
       КАРТКА 11
    ===================================================== */

    {
        id: "outer-event-11",
        number: 11,

        title:
            "Запрошення до експертної ради",

        story:
            "Завдяки твоєму авторитету тебе запросили стати членом експертної ради. Це почесна місія, яка зміцнить твою репутацію, хоча й вимагатиме сил.",

        requirementText:
            "⭐ 45+ репутації",

        requirements: {
            reputation: 45
        },

        choices: [

            {
                id: "expert-board",

                title:
                    "Приєднатися до експертної ради",

                costText:
                    "⚡ -5 енергії",

                resultText:
                    "⭐ +10 репутації | один раз можна перекинути кубик",

                effects: {
                    energy: -5,
                    reputation: 10
                },

                specialAction:
                    "grantReroll"
            },

            {
                id: "expert-decline",

                title:
                    "Відмовитися",

                costText:
                    "Без змін",

                resultText:
                    "💰 +5 000 грн | ⚡ +5 енергії",

                effects: {
                    money: 5000,
                    energy: 5
                }
            }

        ]
    },


    /* =====================================================
       КАРТКА 12
    ===================================================== */

    {
        id: "outer-event-12",
        number: 12,

        title:
            "Автоматизація роботи",

        story:
            "Ти знайшов дієвий спосіб автоматизувати свою щоденну рутину. Впровадження системи вимагає вкладень зараз, зате звільнить час та енергію в майбутньому.",

        requirementText:
            "🧠 55+ знань",

        requirements: {
            knowledge: 55
        },

        choices: [

            {
                id: "automation",

                title:
                    "Впровадити зміни",

                costText:
                    "💰 -5 000 грн",

                resultText:
                    "⚡ +10 регулярної енергії",

                minimum: {
                    money: 5000
                },

                effects: {
                    money: -5000
                },

                persistentEffects: {
                    energyPerPeriod: 10
                }
            },

            {
                id: "automation-risk",

                title:
                    "Тестування системи",

                costText:
                    "Результат визначає кубик",

                resultText:
                    "🎲 Кидок кубика",

                effects: {},

                diceOutcomes: [

                    {
                        min: 1,
                        max: 3,

                        text:
                            "Помилка системи: 💰 -10 000 грн | ⚡ -15 енергії",

                        effects: {
                            money: -10000,
                            energy: -15
                        }
                    },

                    {
                        min: 4,
                        max: 6,

                        text:
                            "Ідеальна інтеграція: ⚡ +15 енергії | 💰 +15 000 грн",

                        effects: {
                            energy: 15,
                            money: 15000
                        }
                    }

                ]
            }

        ]
    },


    /* =====================================================
       КАРТКА 13
    ===================================================== */

    {
        id: "outer-event-13",
        number: 13,

        title:
            "Успішний виступ у медіа",

        story:
            "Тебе запросили стати гостем популярного подкасту чи телеефіру. Це нагода заявити про себе на широку аудиторію.",

        requirementText:
            "⭐ 40+ репутації",

        requirements: {
            reputation: 40
        },

        choices: [

            {
                id: "media",

                title:
                    "Погодитися на виступ",

                costText:
                    "⚡ -5 енергії",

                resultText:
                    "⭐ +5 репутації",

                effects: {
                    energy: -5,
                    reputation: 5
                }
            },

            {
                id: "media-risk",

                title:
                    "Спонтанний ефір",

                costText:
                    "Результат визначає кубик",

                resultText:
                    "🎲 Кидок кубика",

                effects: {},

                diceOutcomes: [

                    {
                        min: 1,
                        max: 2,

                        text:
                            "Нейтральний результат.",

                        effects: {}
                    },

                    {
                        min: 3,
                        max: 4,

                        text:
                            "Вдалий виступ: ⭐ +5 репутації",

                        effects: {
                            reputation: 5
                        }
                    },

                    {
                        min: 5,
                        max: 6,

                        text:
                            "Вірусний успіх: ⭐ +10 репутації | 💰 +5 000 грн",

                        effects: {
                            reputation: 10,
                            money: 5000
                        }
                    }

                ]
            }

        ]
    },


    /* =====================================================
       КАРТКА 14
    ===================================================== */

    {
        id: "outer-event-14",
        number: 14,

        title:
            "Міжнародний проєкт",

        story:
            "У тебе з'явилася можливість попрацювати з передовою міжнародною командою. Це виклик, який вимагатиме максимуму сил, але дасть цінний досвід та фінансовий бонус.",

        requirementText:
            "🧠 65+ знань, ⭐ 35+ репутації",

        requirements: {
            knowledge: 65,
            reputation: 35
        },

        bankRequirement: {
            product:
                "currency_account",

            text:
                "🌐 Валютний рахунок"
        },

        choices: [

            {
                id: "international",

                title:
                    "Приєднатися до проєкту",

                costText:
                    "⚡ -10 енергії",

                resultText:
                    "🧠 +5 знань | 💰 +10 000 грн регулярного доходу",

                effects: {
                    energy: -10,
                    knowledge: 5
                },

                persistentEffects: {
                    passiveIncome: 10000
                }
            },

            {
                id: "international-decline",

                title:
                    "Відмовитися",

                costText:
                    "Без змін",

                resultText:
                    "⭐ +5 репутації",

                effects: {
                    reputation: 5
                }
            }

        ]
    },


    /* =====================================================
       КАРТКА 15
    ===================================================== */

    {
        id: "outer-event-15",
        number: 15,

        title:
            "Патент або реєстрація розробки",

        story:
            "Ти створив авторське рішення й маєш можливість офіційно його зареєструвати. Це потребує вкладень, але юридично закріпить права та підвищить статус.",

        requirementText:
            "🧠 75+ знань",

        requirements: {
            knowledge: 75
        },

        bankRequirement: {
            product:
                "internet_acquiring",

            text:
                "💳 Наявність інтернет-еквайрингу"
        },

        choices: [

            {
                id: "patent",

                title:
                    "Зареєструвати розробку",

                costText:
                    "💰 -5 000 грн",

                resultText:
                    "⭐ +10 репутації | 💰 +10 000 грн",

                minimum: {
                    money: 5000
                },

                effects: {
                    money: 5000,
                    reputation: 10
                }
            },

            {
                id: "patent-risk",

                title:
                    "Спроба прискореної реєстрації",

                costText:
                    "Результат визначає кубик",

                resultText:
                    "🎲 Кидок кубика",

                effects: {},

                diceOutcomes: [

                    {
                        min: 1,
                        max: 2,

                        text:
                            "Бюрократичні затримки: 💰 -5 000 грн",

                        effects: {
                            money: -5000
                        }
                    },

                    {
                        min: 3,
                        max: 4,

                        text:
                            "Патент закріплено: ⭐ +10 репутації | 💰 +10 000 грн",

                        effects: {
                            reputation: 10,
                            money: 10000
                        }
                    },

                    {
                        min: 5,
                        max: 6,

                        text:
                            "Міжнародний патент: ⭐ +15 репутації | 💰 +20 000 грн",

                        effects: {
                            reputation: 15,
                            money: 20000
                        }
                    }

                ]
            }

        ]
    },


    /* =====================================================
       КАРТКА 16
    ===================================================== */

    {
        id: "outer-event-16",
        number: 16,

        title:
            "Кризовий менеджмент",

        story:
            "Важливий проєкт опинився під загрозою зриву! Тобі пропонують очолити антикризову команду.",

        requirementText:
            "🧠 50+ знань, ⭐ 30+ репутації",

        requirements: {
            knowledge: 50,
            reputation: 30
        },

        choices: [

            {
                id: "crisis-lead",

                title:
                    "Взяти лідерство в проєкті",

                costText:
                    "⚡ -10 енергії",

                resultText:
                    "💰 +10 000 грн | ⭐ +10 репутації",

                effects: {
                    energy: -10,
                    money: 10000,
                    reputation: 10
                }
            },

            {
                id: "crisis-decline",

                title:
                    "Відмовитися від ризику",

                costText:
                    "Без змін",

                resultText:
                    "Збереження поточного стану",

                effects: {}
            },

            {
                id: "crisis-risk",

                title:
                    "Ризикнути",

                costText:
                    "Результат визначає кубик",

                resultText:
                    "🎲 Кидок кубика",

                effects: {},

                diceOutcomes: [

                    {
                        min: 1,
                        max: 2,

                        text:
                            "Не вдалося врятувати проєкт: ⚡ -5 | ⭐ -5",

                        effects: {
                            energy: -5,
                            reputation: -5
                        }
                    },

                    {
                        min: 3,
                        max: 4,

                        text:
                            "Кризу частково подолано: ⭐ +5 | 💰 +5 000 грн | ⚡ -5",

                        effects: {
                            reputation: 5,
                            money: 5000,
                            energy: -5
                        }
                    },

                    {
                        min: 5,
                        max: 6,

                        text:
                            "Тріумфальний порятунок: ⭐ +10 | 💰 +10 000 грн",

                        effects: {
                            reputation: 10,
                            money: 10000
                        }
                    }

                ]
            }

        ]
    },


    /* =====================================================
       КАРТКА 17
    ===================================================== */

    {
        id: "outer-event-17",
        number: 17,

        title:
            "Технологічна олімпіада",

        story:
            "Твоя команда розробила проривний прототип під час олімпіади. Рішення вразило інвесторів: можна масштабувати розробку або забрати призовий грант.",

        requirementText:
            "🧠 60+ знань",

        requirements: {
            knowledge: 60
        },

        choices: [

            {
                id: "scale-tech",

                title:
                    "Масштабувати розробку",

                costText:
                    "💰 -5 000 грн | ⚡ -5 енергії",

                resultText:
                    "🧠 +5 знань | ⭐ +5 репутації",

                minimum: {
                    money: 5000
                },

                effects: {
                    money: -5000,
                    energy: -5,
                    knowledge: 5,
                    reputation: 5
                }
            },

            {
                id: "take-grant",

                title:
                    "Забрати призовий грант",

                costText:
                    "Без додаткових витрат",

                resultText:
                    "💰 +10 000 грн | ⭐ +5 репутації",

                effects: {
                    money: 10000,
                    reputation: 5
                }
            },

            {
                id: "tech-risk",

                title:
                    "Випробувати вдачу",

                costText:
                    "Результат визначає кубик",

                resultText:
                    "🎲 Кидок кубика",

                effects: {},

                diceOutcomes: [

                    {
                        min: 1,
                        max: 2,

                        text:
                            "Прототип потребує доопрацювання: ⚡ -5",

                        effects: {
                            energy: -5
                        }
                    },

                    {
                        min: 3,
                        max: 4,

                        text:
                            "Комерційний грант: 💰 +10 000 грн | ⭐ +5",

                        effects: {
                            money: 10000,
                            reputation: 5
                        }
                    },

                    {
                        min: 5,
                        max: 6,

                        text:
                            "Яскрава перемога: 💰 +15 000 грн | ⭐ +10 | 🧠 +5",

                        effects: {
                            money: 15000,
                            reputation: 10,
                            knowledge: 5
                        }
                    }

                ]
            }

        ]
    },


    /* =====================================================
       КАРТКА 18
    ===================================================== */

    {
        id: "outer-event-18",
        number: 18,

        title:
            "Менторська програма для лідерів",

        story:
            "Тобі запропонували пройти ексклюзивне менторство від міжнародного експерта. Навчання вимагає інвестицій та часу, але розширить стратегічне бачення.",

        requirementText:
            "⭐ 40+ репутації",

        requirements: {
            reputation: 40
        },

        choices: [

            {
                id: "leader-mentoring",

                title:
                    "Пройти менторську програму",

                costText:
                    "💰 -5 000 грн | ⚡ -5 енергії",

                resultText:
                    "🧠 +10 знань | ⭐ +5 репутації | жетон «Преміум-контакт»",

                minimum: {
                    money: 5000
                },

                effects: {
                    money: -5000,
                    energy: -5,
                    knowledge: 10,
                    reputation: 5
                },

                specialAction:
                    "premiumContact"
            },

            {
                id: "leader-mentoring-delay",

                title:
                    "Відкласти навчання",

                costText:
                    "Без змін",

                resultText:
                    "Збереження поточного стану",

                effects: {}
            }

        ]
    },


    /* =====================================================
       КАРТКА 19
    ===================================================== */

    {
        id: "outer-event-19",
        number: 19,

        title:
            "Стратегічний ребрендинг",

        story:
            "Твій бізнес та персональний бренд вийшли на новий рівень. Ребрендинг дозволить залучити преміальних клієнтів, але вимагатиме інвестицій.",

        requirementText:
            "⭐ 35+ репутації, 🧠 45+ знань",

        requirements: {
            reputation: 35,
            knowledge: 45
        },

        choices: [

            {
                id: "rebrand",

                title:
                    "Провести ребрендинг",

                costText:
                    "💰 -5 000 грн | ⚡ -5 енергії",

                resultText:
                    "⭐ +10 репутації | 💰 +10 000 грн регулярного доходу",

                minimum: {
                    money: 5000
                },

                effects: {
                    money: -5000,
                    energy: -5,
                    reputation: 10
                },

                persistentEffects: {
                    passiveIncome: 10000
                }
            },

            {
                id: "rebrand-risk",

                title:
                    "Спроба самостійного ребрендингу",

                costText:
                    "Результат визначає кубик",

                resultText:
                    "🎲 Кидок кубика",

                effects: {},

                diceOutcomes: [

                    {
                        min: 1,
                        max: 2,

                        text:
                            "Стиль сприйнято неоднозначно: 💰 -5 000 грн",

                        effects: {
                            money: -5000
                        }
                    },

                    {
                        min: 3,
                        max: 4,

                        text:
                            "Помірне зростання: ⭐ +5 | 💰 +5 000 грн",

                        effects: {
                            reputation: 5,
                            money: 5000
                        }
                    },

                    {
                        min: 5,
                        max: 6,

                        text:
                            "Повний захват ринку: ⭐ +10 | 💰 +10 000 грн",

                        effects: {
                            reputation: 10,
                            money: 10000
                        }
                    }

                ]
            }

        ]
    },


    /* =====================================================
       КАРТКА 20
    ===================================================== */

    {
        id: "outer-event-20",
        number: 20,

        title:
            "Впровадження штучного інтелекту",

        story:
            "На ринку з'явилися інструменти штучного інтелекту, здатні автоматизувати складні завдання твого бізнесу.",

        requirementText:
            "🧠 60+ знань",

        requirements: {
            knowledge: 60
        },

        choices: [

            {
                id: "ai-system",

                title:
                    "Впровадити AI-системи",

                costText:
                    "💰 -5 000 грн",

                resultText:
                    "🧠 +5 знань | ⚡ +10 регулярної енергії | 💰 +5 000 грн",

                minimum: {
                    money: 5000
                },

                effects: {
                    money: 0,
                    knowledge: 5
                },

                persistentEffects: {
                    energyPerPeriod: 10
                }
            },

            {
                id: "traditional",

                title:
                    "Зберегти традиційні процеси",

                costText:
                    "Без змін",

                resultText:
                    "Збереження поточного стану",

                effects: {}
            },

            {
                id: "ai-risk",

                title:
                    "Інтеграція з ризиком",

                costText:
                    "Результат визначає кубик",

                resultText:
                    "🎲 Кидок кубика",

                effects: {},

                diceOutcomes: [

                    {
                        min: 1,
                        max: 2,

                        text:
                            "Технічні збої: ⚡ -5 | 💰 -5 000 грн",

                        effects: {
                            energy: -5,
                            money: -5000
                        }
                    },

                    {
                        min: 3,
                        max: 4,

                        text:
                            "Часткова автоматизація: ⚡ +5",

                        effects: {
                            energy: 5
                        }
                    },

                    {
                        min: 5,
                        max: 6,

                        text:
                            "Технологічний прорив: ⚡ +10 | 💰 +5 000 грн | ⭐ +5",

                        effects: {
                            energy: 10,
                            money: 5000,
                            reputation: 5
                        }
                    }

                ]
            }

        ]
    },


    /* =====================================================
       КАРТКА 21
    ===================================================== */

    {
        id: "outer-event-21",
        number: 21,

        title:
            "Масштабування франшизи",

        story:
            "Твоя бізнес-модель показала високу ефективність. Підприємці пропонують купувати франшизу твого бренду.",

        requirementText:
            "⭐ 50+ репутації, 🧠 65+ знань",

        requirements: {
            reputation: 50,
            knowledge: 65
        },

        bankRequirement: {
            product:
                "internet_acquiring",

            text:
                "💳 Наявність інтернет-еквайрингу"
        },

        choices: [

            {
                id: "franchise",

                title:
                    "Запустити франчайзингову мережу",

                costText:
                    "⚡ -10 регулярної енергії",

                resultText:
                    "💰 +15 000 грн | 💰 +5 000 грн регулярного доходу | ⭐ +10 репутації",

                effects: {
                    money: 15000,
                    reputation: 10
                },

                persistentEffects: {
                    passiveIncome: 5000,
                    energyPerPeriod: -10
                }
            },

            {
                id: "franchise-delay",

                title:
                    "Відкласти розширення",

                costText:
                    "Без змін",

                resultText:
                    "Збереження поточного стану",

                effects: {}
            }

        ]
    },


    /* =====================================================
       КАРТКА 22
    ===================================================== */

    {
        id: "outer-event-22",
        number: 22,

        title:
            "Стратегічний альянс",

        story:
            "Сильний гравець ринку пропонує тобі об'єднати зусилля для спільного проєкту. Синергія ресурсів обіцяє високі дивіденди.",

        requirementText:
            "⭐ 40+ репутації",

        requirements: {
            reputation: 40
        },

        choices: [

            {
                id: "alliance",

                title:
                    "Укласти стратегічний альянс",

                costText:
                    "⚡ -5 енергії",

                resultText:
                    "💰 +10 000 грн | ⭐ +5 репутації",

                effects: {
                    energy: -5,
                    money: 10000,
                    reputation: 5
                }
            },

            {
                id: "solo",

                title:
                    "Обрати самостійний розвиток",

                costText:
                    "Без змін",

                resultText:
                    "⭐ +2 репутації",

                effects: {
                    reputation: 2
                }
            }

        ]
    },


    /* =====================================================
       КАРТКА 23
    ===================================================== */

    {
        id: "outer-event-23",
        number: 23,

        title:
            "Соціальна та екологічна ініціатива",

        story:
            "Ти вирішуєш впровадити соціально відповідальні практики й підтримати важливий екологічний проєкт.",

        requirementText:
            "⭐ 30+ репутації",

        requirements: {
            reputation: 30
        },

        choices: [

            {
                id: "social-project",

                title:
                    "Підтримати соціальний проєкт",

                costText:
                    "💰 -5 000 грн",

                resultText:
                    "⭐ +10 репутації | 💰 +10 000 грн",

                minimum: {
                    money: 5000
                },

                effects: {
                    money: 5000,
                    reputation: 10
                }
            },

            {
                id: "social-risk",

                title:
                    "Оцінити ефективність ініціативи",

                costText:
                    "Результат визначає кубик",

                resultText:
                    "🎲 Кидок кубика",

                effects: {},

                diceOutcomes: [

                    {
                        min: 1,
                        max: 3,

                        text:
                            "Ініціатива не залучила широкої уваги: ⭐ +5",

                        effects: {
                            reputation: 5
                        }
                    },

                    {
                        min: 4,
                        max: 6,

                        text:
                            "Впливова відзнака: ⭐ +20 | 💰 +15 000 грн",

                        effects: {
                            reputation: 20,
                            money: 15000
                        }
                    }

                ]
            }

        ]
    },


    /* =====================================================
       КАРТКА 24
    ===================================================== */

    {
        id: "outer-event-24",
        number: 24,

        title:
            "Вихід на новий регіональний ринок",

        story:
            "У тебе з'явилася можливість відкрити філіал у новому регіоні. Це потребує аналізу ринку, зате розширить базу клієнтів і підвищить стабільність бізнесу.",

        requirementText:
            "🧠 55+ знань, ⭐ 35+ репутації",

        requirements: {
            knowledge: 55,
            reputation: 35
        },

        bankRequirement: {
            product:
                "internet_acquiring",

            text:
                "💳 Наявність інтернет-еквайрингу"
        },

        choices: [

            {
                id: "regional-branch",

                title:
                    "Відкрити регіональний філіал",

                costText:
                    "⚡ -10 енергії",

                resultText:
                    "💰 +10 000 грн регулярного доходу | ⭐ +5 репутації",

                effects: {
                    energy: -10,
                    reputation: 5
                },

                persistentEffects: {
                    passiveIncome: 10000
                }
            },

            {
                id: "regional-test",

                title:
                    "Протестувати ринок",

                costText:
                    "Результат визначає кубик",

                resultText:
                    "🎲 Кидок кубика",

                effects: {},

                diceOutcomes: [

                    {
                        min: 1,
                        max: 2,

                        text:
                            "Ціновий демпінг конкурентів: 💰 -5 000 грн",

                        effects: {
                            money: -5000
                        }
                    },

                    {
                        min: 3,
                        max: 4,

                        text:
                            "Стабільний старт: 💰 +10 000 грн",

                        effects: {
                            money: 10000
                        }
                    },

                    {
                        min: 5,
                        max: 6,

                        text:
                            "Захоплення ринку: 💰 +15 000 грн | ⭐ +5 репутації",

                        effects: {
                            money: 15000,
                            reputation: 5
                        }
                    }

                ]
            }

        ]
    }

];

/* =========================================================
   64.5. БАНКІВСЬКІ КАРТКИ — 24 КАРТКИ

   Джерело:
   "Картки Банк 6.docx"

   Одна спільна колода працює
   і на малому, і на великому колі.
========================================================= */

const BANK_CARD_DECK = [

    {
        id: "bank-01",
        number: 1,
        productId: "deposit_classic",

        title:
            "Депозит «Класичний Строковий»",

        story:
            "Строковий депозит у MyRaif. Ти вкладаєш гроші на визначений строк і наприкінці отримуєш вклад разом із доходом.",

      rulesText:
    "Сплати 2 000 грн при підключенні. Далі сплачуй по 2 000 грн кожного 2-го ходу після підключення. На кожному 6-му ході отримуй 8 000 грн. Один раз протягом дії продукту можна скасувати втрату 15 енергії від життєвої події.",

          
        initialEffects: {
            money: -4000,
            reputation: 10,
            energy: -5,
            knowledge: 10
        }
    },


    {
        id: "bank-02",
        number: 2,
        productId: "deposit_growing",

        title:
            "Депозит «Зростаючий»",

        story:
            "Гнучкий депозит, який можна поповнювати або закрити, коли тобі потрібні гроші.",

        rulesText:
            "Вклади 4 000 грн. Отримуй +2 000 грн один раз на 3 ходи. Можеш у будь-який момент повернути вкладені 4 000 грн і закрити депозит.",

        initialEffects: {
            money: -4000,
            reputation: 10,
            energy: -5,
            knowledge: 5
        }
    },


    {
        id: "bank-03",
        number: 3,
        productId: "deposit_chest",

        title:
            "Депозит «Скриня»",

        story:
            "Продукт для поступового накопичення грошей на мету або фінансовий резерв.",

        rulesText:
            "Вклади 4 000 грн. Отримуй +1 000 грн один раз на 3 ходи. Основну суму можна повернути у будь-який хід.",

        initialEffects: {
            money: -4000,
            reputation: 10,
            energy: 10,
            knowledge: 10
        }
    },


    {
        id: "bank-04",
        number: 4,
        productId: "my_fop",

        title:
            "Рахунок «Мій ФОП»",

        story:
            "Окремий рахунок для підприємницької діяльності: отримання оплат, сплати податків та бізнес-витрат.",

        rulesText:
            "Заплати 1 000 грн за відкриття. Отримуй +2 000 грн один раз на 2 ходи. Кожного 6-го ходу сплачуй 1 000 грн за обслуговування.",

        initialEffects: {
            money: -1000,
            reputation: 10,
            energy: -5,
            knowledge: 10
        }
    },


    {
        id: "bank-05",
        number: 5,
        productId: "cash_credit",

        title:
            "Кредит готівкою",

        story:
            "Банк одразу надає гроші на особисті потреби, а ти поступово повертаєш кредит.",

        rulesText:
            "Отримай +5 000 грн. Потім сплачуй по 1 000 грн кожного 2-го ходу, загалом 6 платежів. Якщо грошей на платіж немає — -2 репутації, а платіж переноситься.",

        initialEffects: {
            money: 5000,
            reputation: 10,
            energy: -5,
            knowledge: 10
        }
    },


    {
        id: "bank-06",
        number: 6,
        productId: "credit_card_100",

        title:
            "Кредитна картка «100 днів 2.0»",

        story:
            "Картка з кредитними коштами банку для покупок та непередбачених витрат.",

        rulesText:
            "Отримай +3 000 грн. Повертай по 1 000 грн кожного 2-го ходу. Якщо прострочив повернення — додається додаткова плата 1 000 грн.",

        initialEffects: {
            money: 3000,
            reputation: 5,
            energy: -5,
            knowledge: 10
        }
    },


    {
        id: "bank-07",
        number: 7,
        productId: "premium_cash_credit",

        title:
            "Premium кредит готівкою",

        story:
            "Кредит для Premium-клієнтів на великі покупки або значні особисті витрати.",

        rulesText:
            "Доступний, якщо маєш щонайменше 20 000 грн і статус Premium. Отримай +30 000 грн. Сплачуй по 6 000 грн кожного 2-го ходу, загалом 6 платежів.",

        premiumRequired: true,
        moneyRequired: 20000,

        initialEffects: {
            money: 30000,
            reputation: 15,
            energy: -5,
            knowledge: 15
        }
    },


    {
        id: "bank-08",
        number: 8,
        productId: "premium_credit_card",

        title:
            "Premium кредитна картка «100 днів 2.0»",

        story:
            "Кредитна картка з підвищеним кредитним лімітом для Premium-клієнтів.",

        rulesText:
            "Доступна при статусі Premium та наявності щонайменше 20 000 грн. Отримай +9 000 грн. Повертай по 3 000 грн кожного 2-го ходу.",

        premiumRequired: true,
        moneyRequired: 20000,

        initialEffects: {
            money: 9000,
            reputation: 15,
            energy: -5,
            knowledge: 15
        }
    },


    {
        id: "bank-09",
        number: 9,
        productId: "ovdp",

        title:
            "ОВДП",

        story:
            "Ти позичаєш гроші державі через купівлю державних облігацій.",

        rulesText:
            "Вклади 5 000 грн. Отримуй +1 000 грн один раз на 2 ходи. На 7-му ході поверни собі 5 000 грн. При достроковому закритті повертається лише 3 000 грн.",

        initialEffects: {
            money: -5000,
            reputation: 10,
            energy: -5,
            knowledge: 10
        }
    },


    {
        id: "bank-10",
        number: 10,
        productId: "etf",

        title:
            "ETF — кошик акцій",

        story:
            "Одна інвестиція дозволяє вкладати гроші одразу в набір різних компаній.",

        rulesText:
            "Вклади 4 000 грн. Отримуй +1 000 грн один раз на 2 ходи. На 7-му ході поверни вкладені 4 000 грн.",

        initialEffects: {
            money: -4000,
            reputation: 10,
            energy: -5,
            knowledge: 10
        }
    },


    {
        id: "bank-11",
        number: 11,
        productId: "green_card",

        title:
            "Зелена картка",

        story:
            "Страхування відповідальності водія під час поїздок автомобілем за кордон.",

        rulesText:
            "Сплати 2 000 грн. Один раз картка може скасувати до 4 000 грн грошової втрати від дорожньої події.",

        initialEffects: {
            money: -2000,
            reputation: 10,
            energy: 10,
            knowledge: 10
        }
    },


    {
        id: "bank-12",
        number: 12,
        productId: "home_insurance",

        title:
            "Страхування оселі",

        story:
            "Захист квартири або будинку від затоплення, пожежі, пошкодження майна та інших ризиків.",

        rulesText:
            "Сплати 2 000 грн. Один раз картка може скасувати до 4 000 грн втрати від побутової події або пошкодження майна.",

        initialEffects: {
            money: -2000,
            reputation: 15,
            energy: 10,
            knowledge: 15
        }
    },


    {
        id: "bank-13",
        number: 13,
        productId: "varta_247",

        title:
            "«Варта 24/7»",

        story:
            "Захист грошей на банківських рахунках від окремих шахрайських операцій.",

        rulesText:
            "Сплати 2 000 грн. Картка діє 6 ходів. Один раз за цей строк може скасувати втрату 10 енергії.",

        initialEffects: {
            money: -2000,
            reputation: 15,
            energy: 10,
            knowledge: 10
        }
    },


    {
        id: "bank-14",
        number: 14,
        productId: "life_insurance",

        title:
            "Накопичувальне страхування життя",

        story:
            "Поєднання довгострокового накопичення грошей і страхового захисту.",

        rulesText:
            "Сплачуй по 2 000 грн кожного ходу. На кожному 6-му ході отримуй 8 000 грн. Один раз можна скасувати втрату 15 енергії від життєвої події.",

        initialEffects: {
            money: -2000,
            reputation: 5,
            energy: 10,
            knowledge: 5
        }
    },


    {
        id: "bank-15",
        number: 15,
        productId: "common_stock",

        title:
            "Прості акції",

        story:
            "Купуючи акції, ти отримуєш частку компанії та можливість заробити на її розвитку.",

        rulesText:
            "Вклади 4 000 грн. Отримуй +3 000 грн один раз на 3 ходи. На 7-му ході продай актив та отримай 5 000 грн.",

        initialEffects: {
            money: -4000,
            reputation: 10,
            energy: -5,
            knowledge: 10
        }
    },


    {
        id: "bank-16",
        number: 16,
        productId: "preferred_stock",

        title:
            "Привілейовані акції",

        story:
            "Вид акцій із перевагами щодо отримання виплат.",

        rulesText:
            "Вклади 4 000 грн. Отримуй +2 000 грн один раз на 3 ходи. На 7-му ході продай актив та отримай 5 000 грн.",

        initialEffects: {
            money: -4000,
            reputation: 10,
            energy: -5,
            knowledge: 10
        }
    },


    {
        id: "bank-17",
        number: 17,
        productId: "dividend_stock",

        title:
            "Дивідендні акції",

        story:
            "Акції компаній, які можуть регулярно виплачувати частину прибутку своїм акціонерам.",

        rulesText:
            "Вклади 4 000 грн. Отримуй +5 000 грн один раз на 3 ходи. На 7-му ході продай актив та отримай 5 000 грн.",

        initialEffects: {
            money: -4000,
            reputation: 10,
            energy: -5,
            knowledge: 10
        }
    },


    {
        id: "bank-18",
        number: 18,
        productId: "deposit_line",

        title:
            "Депозитна лінія",

        story:
            "Бізнес може тимчасово розміщувати вільні гроші й отримувати дохід.",

        rulesText:
            "Розмісти 6 000 грн. Продукт діє 6 ходів. Після кожного 2-го ходу отримуй +2 000 грн. Наприкінці поверни вкладені 6 000 грн.",

        initialEffects: {
            money: -6000,
            reputation: 15,
            energy: -5,
            knowledge: 10
        }
    },


    {
        id: "bank-19",
        number: 19,
        productId: "currency_account",

        title:
            "Валютний рахунок",

        story:
            "Рахунок для зберігання та проведення операцій в іноземній валюті.",

        rulesText:
            "Розмісти 6 000 грн. Рахунок діє 6 ходів. Отримуй +2 000 грн кожного ходу. Після 6-го ходу поверни вкладені 6 000 грн.",

        initialEffects: {
            money: -6000,
            reputation: 15,
            energy: 5,
            knowledge: 10
        }
    },


    {
        id: "bank-20",
        number: 20,
        productId: "internet_acquiring",

        title:
            "Інтернет-еквайринг",

        story:
            "Сервіс для приймання безготівкових оплат на сайті або онлайн-платформі.",

        rulesText:
            "Сплати 3 000 грн за підключення. Сервіс діє 6 ходів. Після онлайн-продажу отримуй +2 000 грн, але не більше 4 разів.",

        initialEffects: {
            money: -3000,
            reputation: 10,
            energy: 5,
            knowledge: 10
        }
    },


    {
        id: "bank-21",
        number: 21,
        productId: "business_elite",

        title:
            "Пакет «Бізнес Еліт+»",

        story:
            "Преміальний пакет банківських послуг для підприємців і компаній.",

        rulesText:
            "Для підключення потрібно мати щонайменше 25 000 грн. Сплати 10 000 грн. Пакет діє 6 ходів. Кожного 2-го ходу отримуй +3 000 грн економії.",

        moneyRequired: 25000,

        initialEffects: {
            money: -10000,
            reputation: 15,
            energy: 15,
            knowledge: 10
        }
    },


    {
        id: "bank-22",
        number: 22,
        productId: "extra_motor_insurance",

        title:
            "Добровільна автоцивілка",

        story:
            "Додатковий страховий захист відповідальності водія.",

        rulesText:
            "Сплати 2 000 грн. Один раз страховка може скасувати до 12 000 грн втрати через ДТП з твоєї вини.",

        initialEffects: {
            money: -2000,
            reputation: 5,
            energy: 5,
            knowledge: 5
        }
    },


    {
        id: "bank-23",
        number: 23,
        productId: "overdraft",

        title:
            "Овердрафт 180 днів",

        story:
            "Короткостроковий фінансовий резерв для бізнесу, коли на рахунку тимчасово бракує власних коштів.",

        rulesText:
            "Сума овердрафту залежить від знань і репутації. За використані кошти сплачуються відсотки. Якщо не можеш виконати платіж — -10 репутації та -10 енергії.",

        initialEffects: {
            reputation: 10,
            energy: -15,
            knowledge: 10
        }
    },


    {
        id: "bank-24",
        number: 24,
        productId: "acquiring",

        title:
            "Еквайринг",

        story:
            "Сервіс, який дозволяє бізнесу приймати безготівкові платежі карткою або смартфоном.",

        rulesText:
            "Сплати 3 000 грн за підключення. Протягом наступних 6 ходів отримуй +2 000 грн кожного ходу завдяки додатковим безготівковим продажам.",

        initialEffects: {
            money: -3000,
            reputation: 15,
            energy: 10,
            knowledge: 10
        }
    }

];


/* =========================================================
   ОДНА БАНКІВСЬКА КОЛОДА
   ДЛЯ ОБОХ КІЛ
========================================================= */

INNER_CARD_DECKS.bank =
    BANK_CARD_DECK;

OUTER_CARD_DECKS.bank =
    BANK_CARD_DECK;

/* =========================================================
   65. ПЕРЕВІРКА БАНКІВСЬКОЇ УМОВИ КАРТКИ

   Деякі Події великого кола
   потребують конкретного
   банківського продукту:

   - валютний рахунок;
   - інтернет-еквайринг.

   Реальні продукти Банку
   додамо в наступній частині.
========================================================= */
function hasBankProduct(
    participant,
    productId
) {

    if (
        !participant
        ||
        !participant.bank
        ||
        !Array.isArray(
            participant.bank.products
        )
    ) {
        return false;
    }


    return participant
        .bank
        .products
        .some(
            product => {

                if (
                    typeof product ===
                    "string"
                ) {

                    return (
                        product === productId
                    );

                }


                return (
                    product?.id === productId
                    &&
                    product.active !== false
                );

            }
        );

}

/* =========================================================
   66. ПОВНА ПЕРЕВІРКА
   УМОВ АКТИВАЦІЇ КАРТКИ
========================================================= */

function checkFullCardRequirements(
    participant,
    card
) {

    const resourceCheck =
        checkCardRequirements(

            participant,

            card.requirements ||
            {}

        );


    const failed =
        [
            ...resourceCheck.failed
        ];


    /* =====================================================
       БАНКІВСЬКА УМОВА
    ===================================================== */

    if (
        card.bankRequirement
        &&
        !hasBankProduct(

            participant,

            card.bankRequirement.product

        )
    ) {

        failed.push(

            `🏦 ${card.bankRequirement.text}`

        );

    }


    return {

        passed:
            failed.length === 0,

        failed

    };

}


/* =========================================================
   67. ОНОВЛЕНА ФУНКЦІЯ
   ПОКАЗУ КАРТКИ

   ЦЯ ФУНКЦІЯ ЗАМІНЮЄ
   showDecisionCard()
   З ЧАСТИНИ 4А.

   НЕ ТРИМАЙ ДВІ ОДНАКОВІ
   ФУНКЦІЇ У ФІНАЛЬНОМУ ФАЙЛІ.

   У JS остання декларація
   використається автоматично,
   тому зараз ця версія
   перекриє попередню.
========================================================= */

function showDecisionCard(
    deckName,
    card
) {

    const player =
        gameState.player;


    const requirementCheck =
        checkFullCardRequirements(

            player,

            card

        );


    /* =====================================================
       ЯКЩО УМОВИ КАРТКИ
       НЕ ВИКОНАНІ
    ===================================================== */

    if (
        !requirementCheck.passed
    ) {

        openGameInfoModal(`

            <div class="decision-card-modal">


                <div class="decision-card-number">

                    Картка №${card.number}

                </div>


                <div class="decision-card-type">

                    ${CELL_TYPES[deckName].icon}
                    ${CELL_TYPES[deckName].name}

                </div>


                <h2>

                    ${card.title}

                </h2>


                <p class="decision-card-story">

                    ${card.story}

                </p>


                <div class="card-requirement-warning">

                    <strong>
                        ⚠️ Картка не активується
                    </strong>

                    <br><br>

                    Не виконані умови:

                    <br>

                    ${
                        requirementCheck
                            .failed
                            .join("<br>")
                    }

                </div>


                <button
                    id="finishUnavailableCardButton"
                    class="main-game-btn"
                >

                    ЗАВЕРШИТИ ХІД

                </button>


            </div>

        `);


        document
            .getElementById(
                "finishUnavailableCardButton"
            )
            .addEventListener(
                "click",
                finishPlayerCardTurn
            );


        return;

    }


    /* =====================================================
       КАРТКА ДОСТУПНА
    ===================================================== */

    const choicesHTML =
        card.choices

            .map(
                (
                    choice,
                    index
                ) => {


                    const minimumCheck =
                        checkCardRequirements(

                            player,

                            choice.minimum ||
                            {}

                        );


                    const productAllowed =
                        !choice.conditionProduct

                        ||

                        hasBankProduct(

                            player,

                            choice.conditionProduct

                        );


                    const disabled =
                        !minimumCheck.passed
                        ||
                        !productAllowed;


                    return `

                        <button
                            class="
                                card-decision-button
                                ${
                                    disabled
                                    ? "card-decision-disabled"
                                    : ""
                                }
                            "
                            data-choice-index="${index}"
                            ${
                                disabled
                                ? "disabled"
                                : ""
                            }
                        >


                            <strong>

                                ${choice.title}

                            </strong>


                            <span class="card-decision-cost">

                                ${
                                    choice.costText ||
                                    "Без витрат"
                                }

                            </span>


                            <span class="card-decision-result">

                                ${
                                    choice.resultText ||
                                    ""
                                }

                            </span>


                            ${
                                !productAllowed

                                ? `

                                    <span class="card-choice-warning">

                                        🏦 Немає необхідного
                                        банківського продукту

                                    </span>

                                  `

                                : ""
                            }


                        </button>

                    `;

                }
            )

            .join("");


    openGameInfoModal(`

        <div class="decision-card-modal">


            <div class="decision-card-number">

                Картка №${card.number}

            </div>


            <div class="decision-card-type">

                ${CELL_TYPES[deckName].icon}

                ${CELL_TYPES[deckName].name}

            </div>


            <h2>

                ${card.title}

            </h2>


            <p class="decision-card-story">

                ${card.story}

            </p>


            <div class="decision-card-requirement">

                <strong>
                    🎯 Умова:
                </strong>

                ${card.requirementText}

            </div>


            ${
                card.bankRequirement

                ? `

                    <div class="decision-card-bank-requirement">

                        <strong>
                            🏦 Банківська умова:
                        </strong>

                        ${card.bankRequirement.text}

                    </div>

                  `

                : ""
            }


            ${
                card.taskText

                ? `

                    <div class="decision-card-task">

                        ${card.taskText}

                    </div>

                  `

                : ""
            }


            <div class="card-decisions-list">

                ${choicesHTML}

            </div>


        </div>

    `);


    document
        .querySelectorAll(
            ".card-decision-button"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        const index =
                            Number(
                                button.dataset.choiceIndex
                            );


                        resolveCardChoice(

                            deckName,

                            card,

                            card.choices[index]

                        );

                    }
                );

            }
        );

}


/* =========================================================
   68. РОЗШИРЕНІ СПЕЦІАЛЬНІ ЕФЕКТИ

   ЦЯ ФУНКЦІЯ ЗАМІНЮЄ
   applyCardSpecialAction()
   З ЧАСТИНИ 4А.
========================================================= */

function applyCardSpecialAction(
    participant,
    action
) {

    switch (
        action
    ) {


        /* =================================================
           ПЕРЕХІД ДО 2 РІВНЯ
        ================================================= */

        case "promoteToLevel2":

            if (
                participant.careerLevel < 1
            ) {

                participant.careerLevel =
                    1;


                const stats =
                    getCareerStats(

                        participant.sector.id,

                        2

                    );


                participant.salary =
                    stats.salary;

            }

            break;


        /* =================================================
           ПІДСУМКОВИЙ ЗВІТ КОЛА 1
        ================================================= */

        case "circleOneReport":

            if (
                participant.reputation +
                participant.knowledge >=
                60
            ) {

                participant.money +=
                    15000;

            }

            break;


        /* =================================================
           КАР'ЄРНЕ ПІДВИЩЕННЯ
        ================================================= */

        case "promoteOneLevelIfReady":

            promoteParticipantOneLevelIfReady(
                participant
            );

            break;


        /* =================================================
           ЗМІНА ПРОФЕСІЇ

           У ДОКУМЕНТІ НЕ ВКАЗАНО,
           ЯК САМЕ ОБИРАЄМО
           НОВУ ПРОФЕСІЮ.

           ТОМУ НЕ ВИГАДУЄМО.
        ================================================= */

        case "changeCareerSector":

            addLog(

                "ℹ️ Отримано можливість змінити професію. Механізм вибору нової професії ще потрібно визначити."

            );

            break;


        /* =================================================
           НАСТУПНА КАР'ЄРНА ПОДІЯ
        ================================================= */

        case "grantNextCareerEventBonus":

            participant
                .effects
                .nextCareerEventBonus = {

                    money: 10000,

                    reputation: 10

                };

            break;


        /* =================================================
           ОСОБИСТИЙ РОЗВИТОК
        ================================================= */

        case "personalDevelopmentBonus":

            if (
                participant.knowledge >=
                80
            ) {

                participant.reputation +=
                    5;

            }

            break;


        /* =================================================
           ЗНИЖКА НА ЗНАННЯ
        ================================================= */

        case "knowledgeDiscount":

            participant
                .effects
                .knowledgeDiscount =
                0.5;

            break;


        /* =================================================
           ПЕРЕКИД КУБИКА
        ================================================= */

        case "grantReroll":

            participant
                .effects
                .rerolls =
                (
                    participant
                        .effects
                        .rerolls ||
                    0
                ) + 1;

            break;


        /* =================================================
           ПРЕМІУМ-КОНТАКТ
        ================================================= */

        case "premiumContact":

            participant
                .effects
                .premiumContact =
                true;

            break;


        /* =================================================
           ОТРИМАТИ КАРТКУ ДОЛЯ

           Саму колоду Долі
           підключаємо далі.
        ================================================= */

        case "drawFateCard":

            participant
                .effects
                .pendingFateCard =
                true;

            break;

    }


    clampPlayerResources(
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
   69. КАРТКИ ЖИТТЯ — ВЕЛИКЕ КОЛО

   Усього у файлі:
   18 карток.

   МЕХАНІКА:
   - гравець має зробити вибір;
   - якщо відмовляється —
     пропускає наступний хід.
========================================================= */

OUTER_CARD_DECKS.life = [

    /* =====================================================
       КАРТКА ЖИТТЯ 1
    ===================================================== */

    {
        id: "life-01",
        number: 1,

        title:
            "Благодійна акція та волонтерство",

        story:
            "Громадська організація запрошує тебе долучитися до масштабної міської благодійної ініціативи з відбудови та підтримки громади. Твоя участь публічна та суттєво зміцнює твій авторитет і довіру у суспільстві.",

        requirementText:
            "Свідомий вибір",

        requirements: {},

        allowRefuse:
            true,

        choices: [

            {
                id: "charity-money",

                title:
                    "Фінансова благодійність",

                costText:
                    "💰 -15 000 грн",

                resultText:
                    "⭐ +25 репутації | ⚡ енергія відновлюється до 100",

                minimum: {
                    money: 15000
                },

                effects: {
                    money: -15000,
                    reputation: 25
                },

                specialAction:
                    "restoreEnergyTo100"
            },

            {
                id: "charity-volunteering",

                title:
                    "Особисте волонтерство",

                costText:
                    "Пропусти наступний хід",

                resultText:
                    "⭐ +25 репутації | 🧠 +15 знань | ⚡ енергія до 100",

                effects: {
                    reputation: 25,
                    knowledge: 15
                },

                specialActions: [
                    "restoreEnergyTo100",
                    "skipNextTurn"
                ]
            }

        ]
    },


    /* =====================================================
       КАРТКА ЖИТТЯ 2
    ===================================================== */

    {
        id: "life-02",
        number: 2,

        title:
            "Конфлікт у команді / Партнерстві",

        story:
            "Під час реалізації важливого етапу проєкту виникла гостра суперечка з ключовим партнером щодо розподілу обов'язків та прибутку. Напруга загрожує зупинити роботу всієї справи.",

        requirementText:
            "Свідомий вибір",

        requirements: {},

        allowRefuse:
            true,

        choices: [

            {
                id: "conflict-pressure",

                title:
                    "Ігнорувати та тиснути авторитетом",

                costText:
                    "⭐ -25 репутації | ⚡ -20 енергії",

                resultText:
                    "Конфлікт залишається прихованим. Прибуток зменшується на 10 000 грн протягом 2 виплат.",

                effects: {
                    reputation: -25,
                    energy: -20
                },

                specialAction:
                    "reduceIncomeTwoPeriods"
            },

            {
                id: "conflict-compromise",

                title:
                    "Відкриті переговори та компроміс",

                costText:
                    "⚡ -15 енергії",

                resultText:
                    "🎲 Кидок кубика",

                effects: {
                    energy: -15
                },

                diceOutcomes: [

                    {
                        min: 1,
                        max: 3,

                        text:
                            "Важкі поступки: 💰 -10 000 грн | ⭐ -10 репутації",

                        effects: {
                            money: -10000,
                            reputation: -10
                        }
                    },

                    {
                        min: 4,
                        max: 6,

                        text:
                            "Тріумфальний компроміс: ⭐ +10 репутації | 🧠 +10 знань",

                        effects: {
                            reputation: 10,
                            knowledge: 10
                        }
                    }

                ]
            },

            {
                id: "conflict-presentation",

                title:
                    "Публічна презентація вирішення",

                costText:
                    "🗣 1 хвилина аргументації перед іншими гравцями",

                resultText:
                    "Якщо більшість підтримує: ⭐ +20 репутації | ⚡ +15 енергії",

                effects: {},

                specialAction:
                    "playerVoteConflict"
            }

        ]
    },


    /* =====================================================
       КАРТКА ЖИТТЯ 3
    ===================================================== */

    {
        id: "life-03",
        number: 3,

        title:
            "Кохання та підтримка партнера",

        story:
            "У твоєму житті з'являється кохана людина, яка щиро вірить у твої амбітні мрії та надає надійну психологічну підтримку у найважчі періоди кар'єри й бізнесу.",

        requirementText:
            "Свідомий вибір",

        requirements: {},

        allowRefuse:
            true,

        choices: [

            {
                id: "relationship",

                title:
                    "Інвестувати час та увагу в стосунки",

                costText:
                    "💰 -15 000 грн",

                resultText:
                    "⚡ +30 енергії | ⭐ +15 репутації | 🛡️ ефект «Сімейне вогнище»",

                minimum: {
                    money: 15000
                },

                effects: {
                    money: -15000,
                    energy: 30,
                    reputation: 15
                },

                specialAction:
                    "familyHearth"
            }

        ]
    },


    /* =====================================================
       КАРТКА ЖИТТЯ 4
    ===================================================== */

    {
        id: "life-04",
        number: 4,

        title:
            "Міжнародне стажування / Релокація",

        story:
            "Тобі пропонують вигідний контракт на відкриття філії або проходження експертного стажування в країнах ЄС. Це вихід на міжнародний рівень, але вимагає значних витрат на облаштування.",

        requirementText:
            "Свідомий вибір",

        requirements: {},

        allowRefuse:
            true,

        choices: [

            {
                id: "relocation",

                title:
                    "Прийняти міжнародний виклик",

                costText:
                    "💰 -25 000 грн",

                resultText:
                    "⭐ +20 репутації | 🧠 +25 знань | за бажанням можна ризикнути кубиком",

                minimum: {
                    money: 25000
                },

                effects: {
                    money: -25000,
                    reputation: 20,
                    knowledge: 25
                },

                optionalRisk: {

                    cost: {
                        knowledge: -5
                    },

                    diceOutcomes: [

                        {
                            min: 1,
                            max: 3,

                            text:
                                "Надбавки до доходу немає. +25 знань зберігаються.",

                            effects: {}
                        },

                        {
                            min: 4,
                            max: 6,

                            text:
                                "💰 +15 000 грн регулярного доходу",

                            persistentEffects: {
                                passiveIncome: 15000
                            }
                        }

                    ]
                }
            },

            {
                id: "stay-ukraine",

                title:
                    "Залишитися та зміцнювати позиції в Україні",

                costText:
                    "Без витрат",

                resultText:
                    "⚡ +15 енергії | 💰 +10 000 грн",

                effects: {
                    energy: 15,
                    money: 10000
                }
            }

        ]
    },


    /* =====================================================
       КАРТКА ЖИТТЯ 5
    ===================================================== */

    {
        id: "life-05",
        number: 5,

        title:
            "Народження дитини / Поповнення сім'ї",

        story:
            "У твоїй родині довгоочікувана щаслива подія — народження дитини! Це приносить новий життєвий сенс, величезну радість та водночас вимагає значних фінансових вкладень.",

        requirementText:
            "Свідомий вибір",

        requirements: {},

        allowRefuse:
            true,

        choices: [

            {
                id: "child-care",

                title:
                    "Організувати якісний догляд та дитячий фонд",

                costText:
                    "💰 -30 000 грн",

                resultText:
                    "⭐ +25 репутації | ⚡ +25 енергії | наступні 3 ходи +10 енергії щоходу",

                minimum: {
                    money: 30000
                },

                effects: {
                    money: -30000,
                    reputation: 25,
                    energy: 25
                },

                specialAction:
                    "familyEnergyThreeTurns"
            }

        ]
    },


    /* =====================================================
       КАРТКА ЖИТТЯ 6
    ===================================================== */

    {
        id: "life-06",
        number: 6,

        title:
            "Неочікувана спадщина / Сімейний капітал",

        story:
            "Тобі передано у спадок сімейні заощадження та цінні папери на суму 60 000 грн. Це дає можливість суттєво наблизитися до купівлі своєї Мрії або вигідно реінвестувати капітал.",

        requirementText:
            "Свідомий вибір",

        requirements: {},

        allowRefuse:
            true,

        choices: [

            {
                id: "inheritance-cash",

                title:
                    "Забрати всю готівку у свій капітал",

                costText:
                    "Без витрат",

                resultText:
                    "💰 +60 000 грн | ⚡ +15 енергії",

                effects: {
                    money: 60000,
                    energy: 15
                }
            },

            {
                id: "inheritance-invest",

                title:
                    "Реінвестувати у високоврожайний інвестфонд",

                costText:
                    "💰 60 000 грн вкладаються на 2 ходи",

                resultText:
                    "Через 2 ходи 💰 +90 000 грн | ⭐ +15 репутації",

                minimum: {
                    money: 60000
                },

                effects: {
                    money: -60000,
                    reputation: 15
                },

                delayedEffect: {
                    turns: 2,

                    effects: {
                        money: 90000
                    },

                    text:
                        "Повернення інвестиції зі спадщини"
                }
            }

        ]
    },


    /* =====================================================
       КАРТКА ЖИТТЯ 7
    ===================================================== */

    {
        id: "life-07",
        number: 7,

        title:
            "Спільний проривний проєкт",

        story:
            "Твій проєкт отримав загальнонаціональне визнання. Партнерство з колегами по грі дозволяє масштабувати бізнес у кілька разів та отримати солідний прибуток.",

        requirementText:
            "Свідомий вибір",

        requirements: {},

        allowRefuse:
            true,

        choices: [

            {
                id: "project-alone",

                title:
                    "Реалізувати проєкт самостійно",

                costText:
                    "⚡ -20 енергії",

                resultText:
                    "💰 +40 000 грн | ⭐ +20 репутації",

                effects: {
                    energy: -20,
                    money: 40000,
                    reputation: 20
                }
            },

            {
                id: "project-partner",

                title:
                    "Залучити іншого гравця до партнерства",

                costText:
                    "⚡ -10 енергії тобі та -10 партнеру",

                resultText:
                    "Ти: 💰 +40 000 | ⭐ +25 | 🧠 +5. Партнер: 💰 +25 000 | ⭐ +10.",

                effects: {
                    energy: -10,
                    money: 40000,
                    reputation: 25,
                    knowledge: 5
                },

                specialAction:
                    "collaborationWithPlayer"
            }

        ]
    },


    /* =====================================================
       КАРТКА ЖИТТЯ 8
    ===================================================== */

    {
        id: "life-08",
        number: 8,

        title:
            "Інвестиція у новий ринковий напрямок",

        story:
            "З'явилася можливість вийти у нову перспективну нішу зі стрімким попитом — AI, біотех, експорт або відновлювальна енергетика. Запуск створить постійний пасивний грошовий потік.",

        requirementText:
            "Свідомий вибір",

        requirements: {},

        allowRefuse:
            true,

        choices: [

            {
                id: "new-market-invest",

                title:
                    "Проінвестувати запуск напрямку",

                costText:
                    "💰 -22 000 грн | ⚡ -15 енергії",

                resultText:
                    "🧠 +25 знань | через 2 ходи запускається 💰 +15 000 грн кожного ходу",

                minimum: {
                    money: 22000
                },

                effects: {
                    money: -22000,
                    energy: -15,
                    knowledge: 25
                },

                specialAction:
                    "newMarketTwoTurns"
            },

            {
                id: "new-market-decline",

                title:
                    "Відмовитися від ризику",

                costText:
                    "Без змін",

                resultText:
                    "Збереження поточного капіталу",

                effects: {}
            }

        ]
    },


    /* =====================================================
       КАРТКА ЖИТТЯ 9
    ===================================================== */

    {
        id: "life-09",
        number: 9,

        title:
            "Позаплановий державний / податковий аудит",

        story:
            "У твій бізнес завітала контролююча комісія для повної перевірки ліцензій, трудових договорів та сплати податків. Твоя експертиза та знання вирішують усе.",

        requirementText:
            "Перевірка рівня знань",

        requirements: {},

        allowRefuse:
            true,

        choices: [

            {
                id: "audit-check",

                title:
                    "Пройти перевірку",

                costText:
                    "Результат залежить від рівня 🧠 знань",

                resultText:
                    "🧠 65+ → ⭐ +15 репутації. Менше 65 → 💰 -15 000 | ⭐ -20 | ⚡ -20.",

                effects: {},

                specialAction:
                    "taxAudit"
            }

        ],

        cooperationText:
            "🤝 Якщо за столом є Фінансист або Юрист, вони можуть за домовленістю додати +20 знань на час цієї перевірки."
    },
   /* =====================================================
       КАРТКА ЖИТТЯ 10
    ===================================================== */

    {
        id: "life-10",
        number: 10,

        title:
            "Масштабна реферальна / партнерська мережа",

        story:
            "Ти запускаєш авторську партнерську мережу. Твій авторитет дозволяє запропонувати іншим гравцям взаємовигідну співпрацю з розподілом бонусів.",

        requirementText:
            "Свідомий вибір",

        requirements: {},

        allowRefuse:
            true,

        choices: [

            {
                id: "referral-network",

                title:
                    "Запропонувати партнерство від 1 до 3 гравцям",

                costText:
                    "Кожен гравець сам погоджується або відмовляється",

                resultText:
                    "За кожного партнера: ти 💰 +8 000 грн та ⭐ +5. Партнер 🧠 +10 та ⚡ +10.",

                effects: {},

                specialAction:
                    "referralNetwork"
            }

        ]
    },


    /* =====================================================
       КАРТКА ЖИТТЯ 11
    ===================================================== */

    {
        id: "life-11",
        number: 11,

        title:
            "Професійне вигорання та стрес",

        story:
            "Надмірне навантаження, постійні дедлайни та відсутність вихідних виснажили твій організм. Без термінового відновлення продовжувати ефективну роботу неможливо.",

        requirementText:
            "Свідомий вибір",

        requirements: {},

        allowRefuse:
            true,

        choices: [

            {
                id: "vacation",

                title:
                    "Організувати повноцінну відпустку",

                costText:
                    "💰 -10 000 грн | пропуск 1 ходу",

                resultText:
                    "⚡ енергія до 100 | ⭐ +10 репутації",

                minimum: {
                    money: 10000
                },

                effects: {
                    money: -10000,
                    reputation: 10
                },

                specialActions: [
                    "restoreEnergyTo100",
                    "skipNextTurn"
                ]
            }

        ]
    },


    /* =====================================================
       КАРТКА ЖИТТЯ 12
    ===================================================== */

    {
        id: "life-12",
        number: 12,

        title:
            "Зустріч з VIP-ментором / Стратегічним радником",

        story:
            "На закритому бізнес-форумі ти знайомишся з топ-інвестором, який вражений твоєю стратегією і готовий стати твоїм особистим ментором та лобістом.",

        requirementText:
            "Свідомий вибір",

        requirements: {},

        allowRefuse:
            true,

        choices: [

            {
                id: "vip-mentor",

                title:
                    "Укласти угоду про менторство",

                costText:
                    "💰 -10 000 грн",

                resultText:
                    "⭐ +25 репутації | 🧠 +25 знань | жетон «Преміум-контакт»",

                minimum: {
                    money: 10000
                },

                effects: {
                    money: -10000,
                    reputation: 25,
                    knowledge: 25
                },

                specialAction:
                    "premiumContact"
            }

        ]
    },


    /* =====================================================
       КАРТКА ЖИТТЯ 13
    ===================================================== */

    {
        id: "life-13",
        number: 13,

        title:
            "Ризикована спекуляція / Фінансова пастка",

        story:
            "Тобі запропонували сумнівну, але надзвичайно привабливу операцію з обіцянкою швидкого подвоєння капіталу. Жадібність чи обачність?",

        requirementText:
            "Свідомий вибір",

        requirements: {},

        allowRefuse:
            true,

        choices: [

            {
                id: "speculation-risk",

                title:
                    "Ризикнути 25 000 грн",

                costText:
                    "💰 -25 000 грн",

                resultText:
                    "🎲 5–6: 💰 +75 000 грн | ⭐ +15. 1–4: гроші втрачено | ⭐ -20 | ⚡ -20.",

                minimum: {
                    money: 25000
                },

                effects: {
                    money: -25000
                },

                diceOutcomes: [

                    {
                        min: 1,
                        max: 4,

                        text:
                            "Схема прогоріла: вкладені гроші втрачено | ⭐ -20 репутації | ⚡ -20 енергії",

                        effects: {
                            reputation: -20,
                            energy: -20
                        }
                    },

                    {
                        min: 5,
                        max: 6,

                        text:
                            "Куш! 💰 +75 000 грн | ⭐ +15 репутації",

                        effects: {
                            money: 75000,
                            reputation: 15
                        }
                    }

                ]
            },

            {
                id: "speculation-decline",

                title:
                    "Відмовитися та слідувати стратегії",

                costText:
                    "Без витрат",

                resultText:
                    "🧠 +15 знань | ⭐ +10 репутації",

                effects: {
                    knowledge: 15,
                    reputation: 10
                }
            }

        ]
    },


    /* =====================================================
       КАРТКА ЖИТТЯ 14
    ===================================================== */

    {
        id: "life-14",
        number: 14,

        title:
            "Купівля комерційної / житлової нерухомості",

        story:
            "Ти вирішуєш придбати власне приміщення для бізнесу або статусну квартиру. Це вагомий крок до капіталізації та відчуття впевненості.",

        requirementText:
            "Свідомий вибір",

        requirements: {},

        allowRefuse:
            true,

        choices: [

            {
                id: "property-full-payment",

                title:
                    "Повна виплата вартості нерухомості",

                costText:
                    "💰 -65 000 грн",

                resultText:
                    "⭐ +30 репутації | ⚡ +25 енергії | капіталізація активів",

                minimum: {
                    money: 65000
                },

                effects: {
                    money: -65000,
                    reputation: 30,
                    energy: 25
                },

                specialAction:
                    "addPropertyAsset"
            },

            {
                id: "property-mortgage",

                title:
                    "Оформити вигідну бізнес-іпотеку",

                costText:
                    "💰 -25 000 грн перший внесок + 💰 -10 000 грн протягом 4 ходів",

                resultText:
                    "⭐ +25 репутації | ⚡ +15 енергії | 🧠 +5 знань",

                minimum: {
                    money: 25000
                },

                effects: {
                    money: -25000,
                    reputation: 25,
                    energy: 15,
                    knowledge: 5
                },

                specialAction:
                    "propertyMortgageFourTurns"
            }

        ]
    },


    /* =====================================================
       КАРТКА ЖИТТЯ 15
    ===================================================== */

    {
        id: "life-15",
        number: 15,

        title:
            "Запуск франчайзингової мережі",

        story:
            "Твоя бізнес-концепція настільки успішна, що готова до тиражування по всій Україні. Інші підприємці готові платити за твій бренд.",

        requirementText:
            "Свідомий вибір",

        requirements: {},

        allowRefuse:
            true,

        choices: [

            {
                id: "life-franchise",

                title:
                    "Упакувати та продати перші франшизи",

                costText:
                    "💰 -25 000 грн | ⚡ -20 енергії",

                resultText:
                    "⭐ +30 репутації | з наступного ходу 💰 +20 000 грн кожного ходу",

                minimum: {
                    money: 25000
                },

                effects: {
                    money: -25000,
                    energy: -20,
                    reputation: 30
                },

                specialAction:
                    "franchiseIncomeFromNextTurn"
            }

        ]
    },


    /* =====================================================
       КАРТКА ЖИТТЯ 16
    ===================================================== */

    {
        id: "life-16",
        number: 16,

        title:
            "Криза довіри та антикризовий піар",

        story:
            "В інтернеті розгорнулася масштабна дезінформаційна кампанія проти твого продукту. Клієнти сумніваються, а партнери очікують твоєї реакції.",

        requirementText:
            "Свідомий вибір",

        requirements: {},

        allowRefuse:
            true,

        choices: [

            {
                id: "anti-crisis-pr",

                title:
                    "Провести відкриту пресконференцію та аудит",

                costText:
                    "💰 -12 000 грн | ⚡ -10 енергії",

                resultText:
                    "⭐ +30 репутації | 🧠 +15 знань | продажі зростають на 30%",

                minimum: {
                    money: 12000
                },

                effects: {
                    money: -12000,
                    energy: -10,
                    reputation: 30,
                    knowledge: 15
                },

                specialAction:
                    "salesGrowth30Percent"
            },

            {
                id: "ignore-crisis",

                title:
                    "Проігнорувати хейт у соцмережах",

                costText:
                    "⭐ -35 репутації | 💰 -20 000 грн",

                resultText:
                    "Урок про ціну публічної репутації",

                effects: {
                    reputation: -35,
                    money: -20000
                }
            }

        ]
    },


    /* =====================================================
       КАРТКА ЖИТТЯ 17
    ===================================================== */

    {
        id: "life-17",
        number: 17,

        title:
            "Створення стратегічного синдикату",

        story:
            "Тобі пропонують об'єднати капітал із двома найсильнішими гравцями за столом для спільного викупу промислового комплексу або IT-платформи.",

        requirementText:
            "Свідомий вибір",

        requirements: {},

        allowRefuse:
            true,

        choices: [

            {
                id: "syndicate",

                title:
                    "Увійти в синдикат з іншими учасниками",

                costText:
                    "💰 -30 000 грн від кожного учасника",

                resultText:
                    "Через 2 ходи кожен учасник отримує 💰 +65 000 грн | ⭐ +25 репутації",

                minimum: {
                    money: 30000
                },

                effects: {},

                specialAction:
                    "strategicSyndicate"
            },

            {
                id: "syndicate-alone",

                title:
                    "Працювати на ринку самостійно",

                costText:
                    "💰 -20 000 грн",

                resultText:
                    "Через 2 ходи 💰 +35 000 грн",

                minimum: {
                    money: 20000
                },

                effects: {
                    money: -20000
                },

                delayedEffect: {
                    turns: 2,

                    effects: {
                        money: 35000
                    },

                    text:
                        "Прибуток від самостійного розвитку"
                }
            }

        ]
    },


    /* =====================================================
       КАРТКА ЖИТТЯ 18
    ===================================================== */

    {
        id: "life-18",
        number: 18,

        title:
            "Здійснення Головної Мрії",

        story:
            "Ти зібрав необхідний капітал, здобув колосальний досвід, репутацію та готовий офіційно реалізувати свою заповітну Мрію.",

        requirementText:
            "Потрібно виконати всі умови своєї Мрії та досягти фінального професійного рівня",

        requirements: {},

        allowRefuse:
            true,

        choices: [

            {
                id: "realize-dream",

                title:
                    "Оплатити вартість своєї Мрії",

                costText:
                    "💰 Вартість залежить від обраної картки Мрії",

                resultText:
                    "⭐ +50 репутації | ⚡ енергія до 100 | ✨ МРІЮ ДОСЯГНУТО",

                effects: {},

                specialAction:
                    "realizeDream"
            }

        ]
    }

];


/* =========================================================
   70. ВІДМОВА ВІД КАРТКИ ЖИТТЯ

   За правилами:
   якщо гравець не приймає
   жодного рішення —

   пропускає наступний хід.
========================================================= */

function refuseLifeDecision() {

    const player =
        gameState.player;


    player.skipTurns +=
        1;


    addLog(

        `❤️ ${player.name} відмовився(лася) від рішення картки Життя та пропускає наступний хід.`

    );


    openGameInfoModal(`

        <div class="life-refuse-result">

            <div class="cell-info-big-icon">
                ❤️
            </div>


            <h2>
                Рішення не прийнято
            </h2>


            <p>

                За правилами карток Життя
                ти пропускаєш свій
                наступний хід.

            </p>


            <button
                id="finishLifeRefuseButton"
                class="main-game-btn"
            >

                ЗАВЕРШИТИ ХІД

            </button>

        </div>

    `);


    document
        .getElementById(
            "finishLifeRefuseButton"
        )
        .addEventListener(
            "click",
            finishPlayerCardTurn
        );

}


/* =========================================================
   71. КНОПКА ВІДМОВИ
   ДЛЯ КАРТКИ ЖИТТЯ

   ЇЇ ДОДАМО В showDecisionCard()
   У НАСТУПНОМУ СЕРВІСНОМУ БЛОЦІ.
========================================================= */
/* =========================================================
   72. КАРТКИ ДОЛЯ — ВЕЛИКЕ КОЛО

   Доля відрізняється від Життя:

   - гравець НЕ обирає рішення;
   - подія відбувається автоматично;
   - відмовитися не можна;
   - наслідки застосовуються одразу.

   У цьому блоці:
   картки №1–7.
========================================================= */

OUTER_CARD_DECKS.fate = [

    /* =====================================================
       КАРТКА ДОЛІ 1
    ===================================================== */

    {
        id: "fate-01",
        number: 1,

        title:
            "Колега привласнив вашу ідею",

        story:
            "Ваша ідея була представлена як чужа, а ваша роль залишилася непоміченою. Це вплинуло на вашу репутацію та мотивацію.",

        advice:
            "Фіксуйте свої ідеї письмово та діліться ними вчасно. Будьте проактивними та заявляйте про свій внесок.",

        effects: {
            money: -15000,
            knowledge: -10,
            energy: -10,
            reputation: -7
        },

        resultText:
            "💰 -15 000 грн | 🧠 -10 знань | ⚡ -10 енергії | ⭐ -7 репутації"
    },


    /* =====================================================
       КАРТКА ДОЛІ 2
    ===================================================== */

    {
        id: "fate-02",
        number: 2,

        title:
            "Публікація про вас",

        story:
            "Місцеве медіа або університет написали про ваш успішний проєкт чи досягнення. Ваша історія надихає інших і відкриває нові можливості.",

        advice:
            "Публічність посилює довіру до вас і може привести корисні знайомства та нові можливості.",

        effects: {
            money: 10000,
            knowledge: 15,
            energy: 15,
            reputation: 15
        },

        resultText:
            "💰 +10 000 грн | 🧠 +15 знань | ⚡ +15 енергії | ⭐ +15 репутації"
    },


    /* =====================================================
       КАРТКА ДОЛІ 3
    ===================================================== */

    {
        id: "fate-03",
        number: 3,

        title:
            "HR побачив ваше резюме і запропонував вакансію мрії",

        story:
            "HR випадково натрапив на ваше резюме в базі чи на LinkedIn через тривалий час. Ваша експертиза і досвід виявилися саме тим, що потрібно для відкритої позиції мрії.",

        advice:
            "Оновлюйте професійний профіль, підтримуйте нетворк і будьте відкриті до нових можливостей.",

        effects: {
            money: 25000,
            knowledge: 10,
            energy: 10,
            reputation: 7
        },

        resultText:
            "💰 +25 000 грн | 🧠 +10 знань | ⚡ +10 енергії | ⭐ +7 репутації"
    },


    /* =====================================================
       КАРТКА ДОЛІ 4
    ===================================================== */

    {
        id: "fate-04",
        number: 4,

        title:
            "Терміновий візит до лікаря",

        story:
            "Несподіване погіршення самопочуття змусило вас терміново звернутися до лікаря. Доведеться витратити час, гроші та сили.",

        advice:
            "Слідкуйте за своїм здоров'ям та не ігноруйте симптоми. Профілактика допомагає уникнути більших витрат і проблем.",

        effects: {
            money: -8000,
            knowledge: -10,
            energy: -10,
            reputation: -5
        },

        resultText:
            "💰 -8 000 грн | 🧠 -10 знань | ⚡ -10 енергії | ⭐ -5 репутації"
    },


    /* =====================================================
       КАРТКА ДОЛІ 5
    ===================================================== */

    {
        id: "fate-05",
        number: 5,

        title:
            "Отримання гранту",

        story:
            "Ви стали переможцем грантової програми та отримали фінансову підтримку для реалізації свого проєкту або навчання.",

        advice:
            "Грант відкриває нові можливості, дає ресурси для розвитку та підвищує впевненість у власних силах.",

        effects: {
            money: 15000,
            knowledge: 10,
            energy: 10,
            reputation: 10
        },

        resultText:
            "💰 +15 000 грн | 🧠 +10 знань | ⚡ +10 енергії | ⭐ +10 репутації"
    },


    /* =====================================================
       КАРТКА ДОЛІ 6
    ===================================================== */

    {
        id: "fate-06",
        number: 6,

        title:
            "Перевірка",

        story:
            "Вас або вашу діяльність перевіряють керівництво, банк чи державні органи. Потрібно підготувати документи, витратити час і ресурси, щоб усе було в порядку.",

        advice:
            "Перевірки забирають час, нерви та ресурси, навіть якщо все в порядку.",

        effects: {
            money: -10000,
            knowledge: -10,
            energy: -15,
            reputation: -5
        },

        resultText:
            "💰 -10 000 грн | 🧠 -10 знань | ⚡ -15 енергії | ⭐ -5 репутації"
    },


    /* =====================================================
       КАРТКА ДОЛІ 7
    ===================================================== */

    {
        id: "fate-07",
        number: 7,

        title:
            "Рахунки заблоковано",

        story:
            "Банк заблокував ваші рахунки через підозрілу операцію. Потрібно витратити час на з'ясування обставин та підтвердження особи.",

        advice:
            "Уважно стежте за операціями та безпекою. Краще попередити проблему, ніж вирішувати її.",

        effects: {
            money: -20000,
            knowledge: -10,
            energy: -10,
            reputation: -5
        },

        resultText:
            "💰 -20 000 грн | 🧠 -10 знань | ⚡ -10 енергії | ⭐ -5 репутації"
    },
    /* =====================================================
   КАРТКА ДОЛІ 8
===================================================== */

{
    id: "fate-08",
    number: 8,

    title:
        "Затоплення",

    story:
        "Несподіване затоплення спричинило пошкодження майна та додаткові витрати на відновлення. Вам доведеться витратити гроші, час і сили на вирішення наслідків.",

    advice:
        "Страхування житла може суттєво зменшити фінансові втрати у випадку непередбачених ситуацій.",

    effects: {
        money: -20000,
        knowledge: 5,
        energy: -10,
        reputation: -5
    },

    resultText:
        "💰 -20 000 грн | 🧠 +5 знань | ⚡ -10 енергії | ⭐ -5 репутації",

    insuranceProtection: {
        product:
            "home_insurance",

        refundMoney:
            4000,

        consumeAfterUse:
            true,

        text:
            "🏠 Спрацювало страхування оселі: компенсація 4 000 грн."
    }
},



    /* =====================================================
       КАРТКА ДОЛІ 9
    ===================================================== */

    {
        id: "fate-09",
        number: 9,

        title:
            "Звільнення близької людини",

        story:
            "Близька вам людина втратила роботу. Це тимчасово впливає на ваші фінанси та емоційний стан, але разом ви зможете пройти цей етап і знайти нові можливості.",

        advice:
            "Фінансова подушка та підтримка одне одного допомагають легше пройти тимчасові труднощі.",

        effects: {
            money: -15000,
            knowledge: 10,
            energy: -10,
            reputation: 0
        },

        resultText:
            "💰 -15 000 грн | 🧠 +10 знань | ⚡ -10 енергії | ⭐ без змін"
    },


    /* =====================================================
       КАРТКА ДОЛІ 10
    ===================================================== */

    {
        id: "fate-10",
        number: 10,

        title:
            "Пройшли відбір на безкоштовний професійний курс",

        story:
            "Вас відібрали для участі в програмі професійного розвитку. Навчання повністю оплачене організаторами. Використайте цю можливість для свого зростання!",

        advice:
            "Нові знання відкривають нові двері та можуть підвищити вашу ефективність і майбутній дохід.",

        effects: {
            money: 20000,
            knowledge: 10,
            energy: 15,
            reputation: 10
        },

        resultText:
            "💰 +20 000 грн економії | 🧠 +10 знань | ⚡ +15 енергії | ⭐ +10 репутації"
    },


    /* =====================================================
       КАРТКА ДОЛІ 11
    ===================================================== */

    {
        id: "fate-11",
        number: 11,

        title:
            "Захворів колега перед важливою презентацією",

        story:
            "Ви взяли на себе відповідальність у вирішальний момент і успішно провели презентацію. Керівництво помітило ваш професіоналізм та ініціативність.",

        advice:
            "Іноді можливості приходять несподівано. Будьте готові проявити себе.",

        effects: {
            money: 10000,
            knowledge: 10,
            energy: 10,
            reputation: 10
        },

        resultText:
            "💰 +10 000 грн | 🧠 +10 знань | ⚡ +10 енергії | ⭐ +10 репутації"
    },


    /* =====================================================
       КАРТКА ДОЛІ 12
    ===================================================== */

    {
        id: "fate-12",
        number: 12,

        title:
            "Пост у сторіс",

        story:
            "Ваш пост у сторіс побачила потрібна людина. Вона запропонувала рішення, яке допомогло вам вийти із ситуації та знайти найкращий варіант.",

        advice:
            "Цінність мережі контактів зростає з кожним днем. Діліться, просіть поради та будьте відкриті до спілкування.",

        effects: {
            money: 10000,
            knowledge: 10,
            energy: 10,
            reputation: 10
        },

        resultText:
            "💰 +10 000 грн | 🧠 +10 знань | ⚡ +10 енергії | ⭐ +10 репутації"
    },


    /* =====================================================
       КАРТКА ДОЛІ 13
    ===================================================== */

    {
        id: "fate-13",
        number: 13,

        title:
            "Діпфейк",

        story:
            "Зловмисники створили та поширюють діпфейк-відео з неправдивою інформацією про вас. Це шкодить вашій репутації та викликає недовіру оточення. Доведеться витратити час і ресурси, щоб відновити правду.",

        advice:
            "Перевіряйте інформацію, не довіряйте сумнівному контенту та реагуйте швидко на фейки.",

        effects: {
            money: -15000,
            knowledge: -5,
            energy: -10,
            reputation: -10
        },

        resultText:
            "💰 -15 000 грн | 🧠 -5 знань | ⚡ -10 енергії | ⭐ -10 репутації"
    },


    /* =====================================================
       КАРТКА ДОЛІ 14
    ===================================================== */

    {
        id: "fate-14",
        number: 14,

        title:
            "Важливі документи загубились",

        story:
            "Ви виявили, що загубили важливі документи. Їх потрібно відновити, що займе час і кошти.",

        advice:
            "Зберігайте копії документів у хмарі та окремо від оригіналів. Це допоможе швидше відновити їх у разі втрати.",

        effects: {
            money: -10000,
            knowledge: 10,
            energy: -10,
            reputation: -5
        },

        resultText:
            "💰 -10 000 грн | 🧠 +10 знань | ⚡ -10 енергії | ⭐ -5 репутації"
    }

];


/* =========================================================
   73. АВТОМАТИЧНЕ РОЗІГРУВАННЯ ДОЛІ

   У ДОЛІ НЕМАЄ ВИБОРУ.
   КАРТКА СПРАЦЬОВУЄ ОДРАЗУ.
========================================================= */

function resolveFateCard(
    card
) {

    const player =
        gameState.player;


    if (!card) {

        finishPlayerCardTurn();

        return;

    }


    let finalEffects = {

        ...(card.effects || {})

    };


    let protectionMessage =
        "";


    /* =====================================================
       СТРАХУВАННЯ ОСЕЛІ

       Картка №8:
       якщо є страхування житла,
       страхова компенсує
       20 000 грн.
    ===================================================== */

    if (
        card.insuranceProtection
        &&
        hasBankProduct(

            player,

            card.insuranceProtection.product

        )
    ) {

        finalEffects.money =
            (
                finalEffects.money || 0
            )
            +
            (
                card
                    .insuranceProtection
                    .refundMoney || 0
            );


        protectionMessage =
            card
                .insuranceProtection
                .text;

    }


    applyEffects(

        player,

        finalEffects

    );


    addLog(

        `⚡ Доля №${card.number}: ${card.title}`

    );


    showFateResult(

        card,

        finalEffects,

        protectionMessage

    );

}


/* =========================================================
   74. ПОКАЗ РЕЗУЛЬТАТУ ДОЛІ
========================================================= */

function showFateResult(
    card,
    effects,
    protectionMessage = ""
) {

    openGameInfoModal(`

        <div class="fate-result-modal">


            <div class="decision-card-number">

                Картка Долі №${card.number}

            </div>


            <div class="decision-card-type">

                ⚡ ДОЛЯ

            </div>


            <h2>

                ${card.title}

            </h2>


            <p class="decision-card-story">

                ${card.story}

            </p>


            <div class="revealed-card-effects">

                ${effectsHTML(effects)}

            </div>


            ${
                protectionMessage

                ? `

                    <div class="fate-protection-message">

                        ${protectionMessage}

                    </div>

                  `

                : ""
            }


            ${
                card.advice

                ? `

                    <div class="fate-advice">

                        <strong>
                            💡 Порада
                        </strong>

                        <p>
                            ${card.advice}
                        </p>

                    </div>

                  `

                : ""
            }


            <button
                id="finishFateTurnButton"
                class="main-game-btn"
            >

                ЗАВЕРШИТИ ХІД

            </button>


        </div>

    `);


    document
        .getElementById(
            "finishFateTurnButton"
        )
        .addEventListener(
            "click",
            finishPlayerCardTurn
        );

}


/* =========================================================
   75. ДРУГИЙ КИДОК ДЛЯ ДОЛІ

   Після визначення номера
   картки Долі вона
   застосовується автоматично.
========================================================= */

function showFateCardByNumber(
    number
) {

    const deck =
        OUTER_CARD_DECKS.fate;


    if (
        !deck ||
        deck.length === 0
    ) {

        return;

    }


    const index =
        (
            Number(number) - 1
        )
        %
        deck.length;


    const card =
        deck[
            index
        ];


    resolveFateCard(
        card
    );

}


/* =========================================================
   КІНЕЦЬ ЧАСТИНИ 4Г-2

   ДАЛІ:

   4Д — БАНК

   У НЬОМУ ЗРОБИМО:

   1. окрему велику модалку Банку;
   2. каталог усіх 24 продуктів;
   3. короткі пояснення для дітей;
   4. категорії продуктів;
   5. позначку "використовується у грі";
   6. реальні ігрові банківські картки;
   7. 3 додаткові звернення до Банку;
   8. +1 звернення за Premium;
   9. зв'язок із Подіями,
      Життям та Долею.
========================================================= */
/* =========================================================
   76. СЛУЖБОВИЙ СТАН ЦИКЛУ ГРИ

   ЦЕЙ БЛОК РОБИТЬ ГРУ ЦИКЛІЧНОЮ:

   - початок ходу;
   - завершення ходу;
   - зарплата кожні 3 ходи;
   - регулярні доходи;
   - відкладені платежі;
   - регулярна енергія;
   - кар'єрне зростання;
   - повідомлення між ходами;
   - перевірка Мрії.
========================================================= */

function ensureGameRuntimeState() {

    if (!gameState.runtime) {

        gameState.runtime = {

            noticeQueue: [],

            processingNotice:
                false,

            gameFinished:
                false

        };

    }


    const participants = [

        gameState.player,

        ...gameState.opponents

    ];


    participants.forEach(
        participant => {

            if (!participant) {
                return;
            }


            if (
                typeof participant.turnsCompleted !==
                "number"
            ) {

                participant.turnsCompleted =
                    0;

            }


            if (
                typeof participant.financialPeriods !==
                "number"
            ) {

                participant.financialPeriods =
                    0;

            }


            if (
                typeof participant.totalSalaryReceived !==
                "number"
            ) {

                participant.totalSalaryReceived =
                    0;

            }


            if (
                typeof participant.totalPassiveIncomeReceived !==
                "number"
            ) {

                participant.totalPassiveIncomeReceived =
                    0;

            }


            if (!participant.effects) {

                participant.effects = {};

            }


            if (
                !Array.isArray(
                    participant.effects.delayedPayments
                )
            ) {

                participant.effects.delayedPayments =
                    [];

            }


            if (
                typeof participant.effects.energyPerTurn !==
                "number"
            ) {

                participant.effects.energyPerTurn =
                    0;

            }


            if (
                typeof participant.effects.incomePerTurn !==
                "number"
            ) {

                participant.effects.incomePerTurn =
                    0;

            }


            if (
                typeof participant.passiveIncome !==
                "number"
            ) {

                participant.passiveIncome =
                    0;

            }


            if (
                typeof participant.skipTurns !==
                "number"
            ) {

                participant.skipTurns =
                    0;

            }

        }
    );

}


/* =========================================================
   77. ЧЕРГА ІГРОВИХ ПОВІДОМЛЕНЬ

   Щоб модалки не накладалися:

   наприклад:
   1. зарплата;
   2. кар'єрне підвищення;
   3. перехід на велике коло.

   Вони показуються одна за одною.
========================================================= */

function queueGameNotice(
    notice
) {

    ensureGameRuntimeState();


    gameState
        .runtime
        .noticeQueue
        .push(
            notice
        );

}


/* =========================================================
   78. ПОКАЗ НАСТУПНОГО ПОВІДОМЛЕННЯ
========================================================= */

function showNextGameNotice(
    onComplete = null
) {

    ensureGameRuntimeState();


    if (
        gameState.runtime.processingNotice
    ) {

        return;

    }


    const notice =
        gameState
            .runtime
            .noticeQueue
            .shift();


    if (!notice) {

        if (
            typeof onComplete ===
            "function"
        ) {

            onComplete();

        }


        return;

    }


    gameState.runtime.processingNotice =
        true;


    let html = "";


    /* =====================================================
       ЗАРПЛАТА
    ===================================================== */

    if (
        notice.type ===
        "salary"
    ) {

        html = `

            <div class="cycle-notice salary-notice">

                <div class="cycle-notice-icon">
                    💰
                </div>


                <h2>
                    Зарплата надійшла!
                </h2>


                <p>

                    Завершено ще один
                    фінансовий період.

                </p>


                <div class="cycle-notice-main-value">

                    +${formatMoney(notice.salary)} грн

                </div>


                ${
                    notice.passiveIncome > 0

                    ? `

                        <div class="cycle-notice-extra">

                            Додатковий регулярний дохід:

                            <strong>

                                +${formatMoney(notice.passiveIncome)} грн

                            </strong>

                        </div>

                      `

                    : ""
                }


                <div class="cycle-notice-info">

                    Професійний рівень:

                    <strong>
                        ${notice.careerLevel}
                    </strong>

                    <br>

                    ${notice.profession}

                </div>


                <button
                    id="continueCycleNoticeButton"
                    class="main-game-btn"
                >

                    ПРОДОВЖИТИ

                </button>

            </div>

        `;

    }


    /* =====================================================
       КАР'ЄРНЕ ЗРОСТАННЯ
    ===================================================== */

    else if (
        notice.type ===
        "career"
    ) {

        html = `

            <div class="cycle-notice career-notice">

                <div class="cycle-notice-icon">
                    🎉
                </div>


                <h2>
                    Вітаємо!
                </h2>


                <p>
                    Ти переходиш
                    на наступну кар'єрну сходинку!
                </p>


                <div class="career-notice-change">

                    <span>
                        ${notice.oldProfession}
                    </span>

                    <strong>
                        ↓
                    </strong>

                    <span>
                        ${notice.newProfession}
                    </span>

                </div>


                <div class="career-notice-level">

                    Рівень ${notice.level}

                </div>


                <div class="career-notice-salary">

                    Нова зарплата:

                    <strong>

                        💰 ${formatMoney(notice.salary)} грн

                    </strong>

                </div>


                <button
                    id="continueCycleNoticeButton"
                    class="main-game-btn"
                >

                    КРУТО! ПРОДОВЖУЄМО

                </button>

            </div>

        `;

    }


    /* =====================================================
       ВІДКЛАДЕНИЙ ПЛАТІЖ
    ===================================================== */

    else if (
        notice.type ===
        "delayed"
    ) {

        html = `

            <div class="cycle-notice delayed-notice">

                <div class="cycle-notice-icon">
                    ⏳
                </div>


                <h2>
                    Спрацювала попередня подія
                </h2>


                <p>
                    ${notice.text}
                </p>


                <div class="revealed-card-effects">

                    ${effectsHTML(notice.effects)}

                </div>


                <button
                    id="continueCycleNoticeButton"
                    class="main-game-btn"
                >

                    ПРОДОВЖИТИ

                </button>

            </div>

        `;

    }


    else {

        gameState.runtime.processingNotice =
            false;


        showNextGameNotice(
            onComplete
        );


        return;

    }


    openGameInfoModal(
        html
    );


    const button =
        document.getElementById(
            "continueCycleNoticeButton"
        );


    if (!button) {

        gameState.runtime.processingNotice =
            false;


        showNextGameNotice(
            onComplete
        );


        return;

    }


    button.addEventListener(
        "click",
        () => {

            closeGameInfoModal();


            gameState.runtime.processingNotice =
                false;


            showNextGameNotice(
                onComplete
            );

        }
    );

}


/* =========================================================
   79. ПОЧАТОК ХОДУ ГРАВЦЯ

   Тут спрацьовують:

   - Сімейне вогнище;
   - регулярна енергія;
   - регулярний дохід "кожного ходу";
   - відкладені ефекти;
   - перехід на велике коло.
========================================================= */

async function preparePlayerTurn() {

    ensureGameRuntimeState();


    const player =
        gameState.player;


    if (
        gameState.runtime.gameFinished
    ) {

        return;

    }


    /* =====================================================
       СІМЕЙНЕ ВОГНИЩЕ

       Енергія не падає нижче 70.
    ===================================================== */

    if (
        player.effects.familyHearth
        &&
        player.energy < 70
    ) {

        player.energy =
            70;


        addLog(

            "🛡️ Сімейне вогнище відновило енергію до 70."

        );

    }


    /* =====================================================
       РЕГУЛЯРНА ЕНЕРГІЯ
    ===================================================== */

    if (
        player.effects.energyPerTurn
    ) {

        applyEffects(

            player,

            {
                energy:
                    player
                        .effects
                        .energyPerTurn
            }

        );


        addLog(

            `⚡ Регулярна зміна енергії: ${
                player.effects.energyPerTurn > 0
                    ? "+"
                    : ""
            }${player.effects.energyPerTurn}`

        );

    }


    /* =====================================================
       ДОХІД КОЖНОГО ХОДУ

       Окремий від зарплати.
    ===================================================== */

    if (
        player.effects.incomePerTurn > 0
    ) {

        player.money +=
            player.effects.incomePerTurn;


        player.totalPassiveIncomeReceived +=
            player.effects.incomePerTurn;


        addLog(

            `💰 Регулярний дохід: +${formatMoney(player.effects.incomePerTurn)} грн`

        );

    }


    /* =====================================================
       ВІДКЛАДЕНІ ЕФЕКТИ
    ===================================================== */

    processDelayedEffects(
        player
    );


    /* =====================================================
       ПЕРЕХІД НА ВЕЛИКЕ КОЛО
    ===================================================== */

    if (
        player.pendingOuterTransition
    ) {

        await moveParticipantToOuterStart(
            player
        );

    }


    clampPlayerResources(
        player
    );


    updatePlayerStatsUI();

}


/* =========================================================
   80. ВІДКЛАДЕНІ ЕФЕКТИ
========================================================= */

function processDelayedEffects(
    participant
) {

    if (
        !participant?.effects ||
        !Array.isArray(
            participant.effects.delayedPayments
        )
    ) {

        return;

    }


    const remaining = [];


    participant
        .effects
        .delayedPayments
        .forEach(
            item => {

                item.turnsLeft -=
                    1;


                if (
                    item.turnsLeft <= 0
                ) {

                    applyEffects(

                        participant,

                        item.effects ||
                        {}

                    );


                    if (
                        participant.id ===
                        "player"
                    ) {

                        queueGameNotice({

                            type:
                                "delayed",

                            text:
                                item.text ||
                                "Відкладений ефект",

                            effects:
                                item.effects ||
                                {}

                        });

                    }


                    addLog(

                        `⏳ ${item.text || "Відкладений ефект"}`

                    );

                }

                else {

                    remaining.push(
                        item
                    );

                }

            }
        );


    participant.effects.delayedPayments =
        remaining;

}


/* =========================================================
   81. ЗАВЕРШЕННЯ ВЛАСНОГО ХОДУ

   ЦЕ ГОЛОВНА ТОЧКА ЦИКЛУ.

   Один натиск / одна картка /
   одна дія = один завершений хід.
========================================================= */

async function completePlayerTurn() {

    ensureGameRuntimeState();


    const player =
        gameState.player;


    if (
        gameState.runtime.gameFinished
    ) {

        return;

    }


    player.turnsCompleted +=
        1;


    gameState.playerTurns =
        player.turnsCompleted;


    addLog(

        `🔄 ${player.name}: завершено хід ${player.turnsCompleted}`

    );


    /* =====================================================
       КОЖЕН ТРЕТІЙ ВЛАСНИЙ ХІД —
       ФІНАНСОВИЙ ПЕРІОД
    ===================================================== */

    if (
        player.turnsCompleted %
            GAME_CONFIG.financialPeriodTurns
        ===
        0
    ) {

        processPlayerFinancialPeriod();

    }


    /* =====================================================
       ПЕРЕВІРЯЄМО КАР'ЄРУ

       Якщо ресурси вже дозволяють
       перейти на наступний рівень.
    ===================================================== */

    checkCareerProgress(
        player
    );


    updatePlayerStatsUI();


    /* =====================================================
       СПОЧАТКУ AI,
       ПОТІМ ПОВІДОМЛЕННЯ,
       ПОТІМ НОВИЙ ХІД.
    ===================================================== */

    await startAITurnsCore();

}


/* =========================================================
   82. ФІНАНСОВИЙ ПЕРІОД ГРАВЦЯ

   Кожні 3 власні ходи.

   Зарплата береться
   за ПОТОЧНИМ кар'єрним рівнем.
========================================================= */

function processPlayerFinancialPeriod() {

    const player =
        gameState.player;


    player.financialPeriods +=
        1;


    gameState.financialPeriod =
        player.financialPeriods;


    const salary =
        Number(
            player.salary
        ) || 0;


    const passiveIncome =
        Number(
            player.passiveIncome
        ) || 0;


    const total =
        salary +
        passiveIncome;


    player.money +=
        total;


    player.totalSalaryReceived +=
        salary;


    player.totalPassiveIncomeReceived +=
        passiveIncome;


    addLog(

        `💰 Фінансовий період ${player.financialPeriods}: зарплата +${formatMoney(salary)} грн${
            passiveIncome > 0
                ? `, регулярний дохід +${formatMoney(passiveIncome)} грн`
                : ""
        }`

    );


    const profession =
        getProfessionName(

            player
                .sector
                .levels[
                    player.careerLevel
                ],

            player.gender

        );


    queueGameNotice({

        type:
            "salary",

        salary,

        passiveIncome,

        careerLevel:
            getDisplayedCareerLevel(
                player
            ),

        profession

    });


    updatePlayerStatsUI();

}


/* =========================================================
   83. НОВА ПЕРЕВІРКА КАР'ЄРИ

   ЗАМІНЮЄ СТАРУ
   checkCareerProgress().

   Підвищення:
   - максимум на 1 сходинку
     за одну перевірку;
   - одразу змінює зарплату;
   - показує окреме вікно.
========================================================= */

function checkCareerProgress(
    participant
) {

    if (
        !participant ||
        !participant.sector
    ) {

        return false;

    }


    const sector =
        participant.sector;
/* =====================================================
   КОНТРОЛЬ ТЕМПУ КАР'ЄРИ
===================================================== */
const currentTurnNumber =
    Number(
        participant.turnsCompleted
    ) || 0;
const lastPromotionTurn =
    Number(
        participant.lastCareerPromotionTurn
    ) || 0;
/*  ПЕРШЕ ПІДВИЩЕННЯ:
   не раніше 5-го власного ходу.*/
if (
    participant.careerLevel === 0
    &&
    currentTurnNumber <
        GAME_CONFIG.careerFirstPromotionMinTurn
) {
    return false;
}
/*   ПОДАЛЬШІ ПІДВИЩЕННЯ:
   між сходинками мінімум 4 ходи.*/
if (
    participant.careerLevel > 0
    &&
    currentTurnNumber -
        lastPromotionTurn <
        GAME_CONFIG.careerMinTurnsBetweenPromotions
) {

    return false;

}


    if (
        participant.careerLevel >=
        sector.levels.length - 1
    ) {

        return false;

    }


    const oldLevel =
        participant.careerLevel;


    const nextLevel =
        oldLevel + 1;


    const nextStats =
        getCareerStats(

            sector.id,

            nextLevel + 1

        );


    if (!nextStats) {

        return false;

    }


    const ready =

        participant.reputation >=
            nextStats.reputation

        &&

        participant.knowledge >=
            nextStats.knowledge

        &&

        participant.energy >=
            nextStats.energy;


    if (!ready) {

        return false;

    }


    const oldProfession =
        getProfessionName(

            sector.levels[
                oldLevel
            ],

            participant.gender

        );


    const newProfession =
        getProfessionName(

            sector.levels[
                nextLevel
            ],

            participant.gender

        );


    participant.careerLevel =
        nextLevel;


    participant.salary =
        nextStats.salary;

participant.lastCareerPromotionTurn =
    currentTurnNumber;

    addLog(

        `🎉 ${participant.name}: ${oldProfession} → ${newProfession}`

    );


    /* =====================================================
       ЯКЩО ГРАВЕЦЬ УЖЕ ПРОЙШОВ
       МАЛЕ КОЛО І ТЕПЕР СТАВ
       РІВНЕМ 2 —

       ПЕРЕХІД НА OUTER
       ВІДБУДЕТЬСЯ ПЕРЕД
       НАСТУПНИМ ХОДОМ.
    ===================================================== */

    if (
        participant.board ===
            "inner"

        &&

        participant.innerLaps >=
            1

        &&

        participant.careerLevel >=
            GAME_CONFIG
                .outerUnlockCareerLevel
    ) {

        participant.pendingOuterTransition =
            true;

    }


    if (
        participant.id ===
        "player"
    ) {

        queueGameNotice({

            type:
                "career",

            oldProfession,

            newProfession,

            level:
                nextLevel + 1,

            salary:
                nextStats.salary

        });


        updateCareerHUD(
            participant
        );

    }


    return true;

}


/* =========================================================
   84. ОНОВЛЕННЯ ПРОФЕСІЇ У HUD
========================================================= */

function updateCareerHUD(
    participant =
        gameState.player
) {

    const element =
        document.getElementById(
            "hudPlayerProfession"
        );


    if (
        !element ||
        !participant.sector
    ) {

        return;

    }


    element.textContent =
        getProfessionName(

            participant
                .sector
                .levels[
                    participant.careerLevel
                ],

            participant.gender

        );

}


/* =========================================================
   85. LOUNGE

   За правилами:

   якщо енергія < 100:
   → відновлюємо до 100.

   якщо енергія вже 100:
   → під час наступного
     повного кола вона
     не зменшується.
========================================================= */

function handleLoungeCell(
    participant
) {

    const alreadyFull =
        participant.energy >=
        GAME_CONFIG.maxEnergy;


    if (
        alreadyFull
    ) {

        participant
            .effects
            .protectEnergyForLap =
            true;


        participant
            .effects
            .protectedEnergyBoard =
            participant.board;


        participant
            .effects
            .protectedEnergyLap =
            participant.board ===
                "inner"

                ? participant.innerLaps

                : participant.outerLaps;


        addLog(

            `🎯 ${participant.name}: енергія захищена на наступне повне коло.`

        );


        if (
            participant.id ===
            "player"
        ) {

            openGameInfoModal(`

                <div class="lounge-result">

                    <div class="cycle-notice-icon">
                        🎯
                    </div>

                    <h2>
                        Lounge & Хобі
                    </h2>

                    <p>

                        У тебе вже максимальна
                        енергія — 100.

                    </p>

                    <p>

                        Тому під час наступного
                        повного кола
                        енергія не буде зменшуватися.

                    </p>

                    <button
                        id="finishLoungeButton"
                        class="main-game-btn"
                    >
                        ЗАВЕРШИТИ ХІД
                    </button>

                </div>

            `);


            document
                .getElementById(
                    "finishLoungeButton"
                )
                .addEventListener(
                    "click",
                    () => {

                        closeGameInfoModal();

                        completePlayerTurn();

                    }
                );

        }


        return;

    }


    const restored =
        GAME_CONFIG.maxEnergy -
        participant.energy;


    participant.energy =
        GAME_CONFIG.maxEnergy;


    addLog(

        `🎯 ${participant.name}: енергія відновлена до 100.`

    );


    if (
        participant.id ===
        "player"
    ) {

        updatePlayerStatsUI();


        openGameInfoModal(`

            <div class="lounge-result">

                <div class="cycle-notice-icon">
                    🎯
                </div>

                <h2>
                    Lounge & Хобі
                </h2>

                <p>
                    Час відпочити та відновити сили.
                </p>

                <div class="cycle-notice-main-value">

                    ⚡ +${restored}

                </div>

                <strong>
                    Енергія: 100
                </strong>

                <button
                    id="finishLoungeButton"
                    class="main-game-btn"
                >
                    ЗАВЕРШИТИ ХІД
                </button>

            </div>

        `);


        document
            .getElementById(
                "finishLoungeButton"
            )
            .addEventListener(
                "click",
                () => {

                    closeGameInfoModal();

                    completePlayerTurn();

                }
            );

    }

}


/* =========================================================
   86. ЗАХИСТ ЕНЕРГІЇ ВІД LOUNGE

   ЦЮ ПЕРЕВІРКУ ВИКОРИСТОВУЄ
   applyEffects().
========================================================= */

function isEnergyProtected(
    participant
) {

    if (
        !participant?.effects
            ?.protectEnergyForLap
    ) {

        return false;

    }


    const currentLap =
        participant.board ===
            "inner"

            ? participant.innerLaps

            : participant.outerLaps;


    const protectedLap =
        participant
            .effects
            .protectedEnergyLap;


    /* =====================================================
       КОЛО ВЖЕ ЗАВЕРШЕНО —
       ЗАХИСТ ЗНІМАЄМО.
    ===================================================== */

    if (
        participant.board !==
            participant
                .effects
                .protectedEnergyBoard

        ||

        currentLap >
            protectedLap + 1
    ) {

        participant
            .effects
            .protectEnergyForLap =
            false;


        participant
            .effects
            .protectedEnergyBoard =
            null;


        participant
            .effects
            .protectedEnergyLap =
            null;


        return false;

    }


    return true;

}


/* =========================================================
   87. НОВА applyEffects()

   ЗАМІНЮЄ ПОПЕРЕДНЮ.

   ВРАХОВУЄ:
   - максимум енергії 100;
   - Сімейне вогнище;
   - Lounge-захист;
   - кар'єрний прогрес.
========================================================= */

function applyEffects(
    participant,
    effects = {}
) {

    if (
        !participant ||
        !effects
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
                    key ===
                    "energy"
                    &&
                    value < 0
                    &&
                    isEnergyProtected(
                        participant
                    )
                ) {

                    return;

                }


                if (
                    typeof participant[key] ===
                    "number"
                ) {

                    participant[key] +=
                        value;

                }

            }
        );


    /* Сімейне вогнище */

    if (
        participant
            .effects
            ?.familyHearth

        &&

        participant.energy <
            70
    ) {

        participant.energy =
            70;

    }


    clampPlayerResources(
        participant
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

    else {

        checkCareerProgress(
            participant
        );

    }

}


/* =========================================================
   88. АКАДЕМІЯ & SOFT SKILLS

   3 ВАРІАНТИ З ПРАВИЛ:

   1. Soft Skills
      -3 000
      +10 знань
      +5 репутації

   2. Hard Skills
      -6 000
      -10 енергії
      +25 знань
      +10 репутації

   3. Ментор
      заплатити 23 000
      іншому гравцю з 70+ знань

      гравець:
      +20 знань

      ментор:
      +23 000
      +5 репутації
========================================================= */

function showAcademyChoice() {

    const player =
        gameState.player;


    const mentors =
        gameState.opponents.filter(

            participant =>
                participant.knowledge >=
                70

        );


    const mentorOptions =
        mentors.length > 0

        ? mentors
            .map(
                mentor => `

                    <option
                        value="${mentor.id}"
                    >
                        ${mentor.name}
                        — 🧠 ${mentor.knowledge}
                    </option>

                `
            )
            .join("")

        : `

            <option value="">
                Немає доступного ментора
            </option>

          `;


    openGameInfoModal(`

        <div class="academy-modal">

            <div class="cycle-notice-icon">
                🎓
            </div>


            <h2>
                Академія & Soft Skills
            </h2>


            <p>
                Обери напрямок розвитку.
            </p>


            <div class="academy-options">


                <button
                    id="academySoftButton"
                    class="card-decision-button"
                    ${
                        player.money < 3000
                            ? "disabled"
                            : ""
                    }
                >

                    <strong>
                        💬 Soft Skills / Комунікація
                    </strong>

                    <span>
                        💰 -3 000 грн
                    </span>

                    <span>
                        🧠 +10 | ⭐ +5
                    </span>

                </button>


                <button
                    id="academyHardButton"
                    class="card-decision-button"
                    ${
                        (
                            player.money < 6000
                            ||
                            player.energy < 10
                        )
                            ? "disabled"
                            : ""
                    }
                >

                    <strong>
                        🧠 Професійна сертифікація / Hard Skills
                    </strong>

                    <span>
                        💰 -6 000 грн | ⚡ -10
                    </span>

                    <span>
                        🧠 +25 | ⭐ +10
                    </span>

                </button>


                <div class="academy-mentor-option">

                    <strong>
                        🤝 Менторська сесія
                    </strong>

                    <p>
                        💰 -23 000 грн → 🧠 +20
                    </p>

                    <select
                        id="academyMentorSelect"
                        ${
                            (
                                player.money < 23000
                                ||
                                mentors.length === 0
                            )
                                ? "disabled"
                                : ""
                        }
                    >

                        ${mentorOptions}

                    </select>


                    <button
                        id="academyMentorButton"
                        class="card-decision-button"
                        ${
                            (
                                player.money < 23000
                                ||
                                mentors.length === 0
                            )
                                ? "disabled"
                                : ""
                        }
                    >
                        ОБРАТИ МЕНТОРА
                    </button>

                </div>


            </div>

        </div>

    `);


    const softButton =
        document.getElementById(
            "academySoftButton"
        );


    if (softButton) {

        softButton.addEventListener(
            "click",
            () => {

                applyEffects(

                    player,

                    {
                        money: -3000,
                        knowledge: 10,
                        reputation: 5
                    }

                );


                addLog(

                    "🎓 Академія: Soft Skills / Комунікація."

                );


                showAcademyResult(

                    "Soft Skills / Комунікація",

                    "💰 -3 000 грн | 🧠 +10 | ⭐ +5"

                );

            }
        );

    }


    const hardButton =
        document.getElementById(
            "academyHardButton"
        );


    if (hardButton) {

        hardButton.addEventListener(
            "click",
            () => {

                applyEffects(

                    player,

                    {
                        money: -6000,
                        energy: -10,
                        knowledge: 25,
                        reputation: 10
                    }

                );


                addLog(

                    "🎓 Академія: Професійна сертифікація."

                );


                showAcademyResult(

                    "Професійна сертифікація / Hard Skills",

                    "💰 -6 000 грн | ⚡ -10 | 🧠 +25 | ⭐ +10"

                );

            }
        );

    }


    const mentorButton =
        document.getElementById(
            "academyMentorButton"
        );


    if (mentorButton) {

        mentorButton.addEventListener(
            "click",
            () => {

                const select =
                    document.getElementById(
                        "academyMentorSelect"
                    );


                const mentor =
                    gameState
                        .opponents
                        .find(
                            item =>
                                item.id ===
                                select.value
                        );


                if (!mentor) {

                    return;

                }


                player.money -=
                    23000;


                player.knowledge +=
                    20;


                mentor.money +=
                    23000;


                mentor.reputation +=
                    5;


                clampPlayerResources(
                    player
                );


                clampPlayerResources(
                    mentor
                );


                checkCareerProgress(
                    player
                );


                checkCareerProgress(
                    mentor
                );


                updatePlayerStatsUI();


                addLog(

                    `🎓 ${player.name}: менторська сесія з ${mentor.name}.`

                );


                showAcademyResult(

                    `Менторська сесія — ${mentor.name}`,

                    `Ти: 💰 -23 000 грн | 🧠 +20. ${mentor.name}: 💰 +23 000 грн | ⭐ +5.`

                );

            }
        );

    }

}


/* =========================================================
   89. РЕЗУЛЬТАТ АКАДЕМІЇ
========================================================= */

function showAcademyResult(
    title,
    result
) {

    openGameInfoModal(`

        <div class="academy-result">

            <div class="cycle-notice-icon">
                🎓
            </div>


            <h2>
                ${title}
            </h2>


            <p>
                ${result}
            </p>


            <button
                id="finishAcademyButton"
                class="main-game-btn"
            >
                ЗАВЕРШИТИ ХІД
            </button>

        </div>

    `);


    document
        .getElementById(
            "finishAcademyButton"
        )
        .addEventListener(
            "click",
            () => {

                closeGameInfoModal();

                completePlayerTurn();

            }
        );

}


/* =========================================================
   90. ПЕРЕВІРКА МРІЇ
========================================================= */

function canRealizeDream(
    participant =
        gameState.player
) {

    if (
        !participant ||
        !participant.dream
    ) {

        return false;

    }


    const req =
        participant
            .dream
            .requirements;


    return (

        hasFinalCareerLevel(
            participant
        )

        &&

        participant.money >=
            req.money

        &&

        participant.reputation >=
            req.reputation

        &&

        participant.knowledge >=
            req.knowledge

        &&

        participant.energy >=
            req.energy

    );

}


/* =========================================================
   91. КЛІТИНКА ПЕРЕВІРКИ МРІЇ
========================================================= */

function handleDreamCheckCell(
    participant =
        gameState.player
) {

    const dream =
        participant.dream;


    if (!dream) {

        completePlayerTurn();

        return;

    }


    const success =
        canRealizeDream(
            participant
        );


    if (success) {

        showDreamReadyModal(
            participant
        );


        return;

    }


    const req =
        dream.requirements;


    openGameInfoModal(`

        <div class="dream-check-modal">

            <div class="cycle-notice-icon">
                ✨
            </div>


            <h2>
                Мрія вже близько
            </h2>


            <p>

                Поки що не всі умови
                виконані.

            </p>


            ${createDreamProgressRow(
                "💰",
                "Гроші",
                participant.money,
                req.money
            )}


            ${createDreamProgressRow(
                "⭐",
                "Репутація",
                participant.reputation,
                req.reputation
            )}


            ${createDreamProgressRow(
                "🧠",
                "Знання",
                participant.knowledge,
                req.knowledge
            )}


            ${createDreamProgressRow(
                "⚡",
                "Енергія",
                participant.energy,
                req.energy
            )}


            <div class="dream-career-check">

                ${
                    hasFinalCareerLevel(
                        participant
                    )

                    ? "✅ Фінальний професійний рівень досягнуто"

                    : "❌ Потрібно досягти 4-го професійного рівня"
                }

            </div>


            <button
                id="continueDreamCheckButton"
                class="main-game-btn"
            >
                ПРОДОВЖИТИ ГРУ
            </button>

        </div>

    `);


    document
        .getElementById(
            "continueDreamCheckButton"
        )
        .addEventListener(
            "click",
            () => {

                closeGameInfoModal();

                completePlayerTurn();

            }
        );

}


/* =========================================================
   92. МРІЯ ГОТОВА ДО РЕАЛІЗАЦІЇ
========================================================= */

function showDreamReadyModal(
    participant
) {

    const dream =
        participant.dream;


    openGameInfoModal(`

        <div class="dream-ready-modal">

            <div class="cycle-notice-icon">
                ✨
            </div>


            <h2>
                Усі умови виконані!
            </h2>


            <p>

                Ти готовий / готова
                реалізувати свою Мрію:

            </p>


            <div class="dream-ready-name">

                ${dream.icon}

                ${dream.name}

            </div>


            <div class="dream-ready-price">

                💰 ${formatMoney(
                    dream.requirements.money
                )} грн

            </div>


            <button
                id="realizeDreamButton"
                class="main-game-btn"
            >
                ✨ ЗДІЙСНИТИ МРІЮ
            </button>


            <button
                id="continueWithoutDreamButton"
                class="secondary-game-btn"
            >
                ПОКИ ПРОДОВЖИТИ ГРУ
            </button>

        </div>

    `);


    document
        .getElementById(
            "realizeDreamButton"
        )
        .addEventListener(
            "click",
            () => {

                realizePlayerDream();

            }
        );


    document
        .getElementById(
            "continueWithoutDreamButton"
        )
        .addEventListener(
            "click",
            () => {

                closeGameInfoModal();

                completePlayerTurn();

            }
        );

}


/* =========================================================
   93. РЕАЛІЗАЦІЯ МРІЇ
========================================================= */

function realizePlayerDream() {

    ensureGameRuntimeState();


    const player =
        gameState.player;


    if (
        !canRealizeDream(
            player
        )
    ) {

        return;

    }


    const completedDream =
        player.dream;


    const price =
        completedDream
            .requirements
            .money;


    /* =====================================================
       ОПЛАЧУЄМО МРІЮ
    ===================================================== */

    player.money -=
        price;


    /* =====================================================
       БОНУС ЗА ВИКОНАНУ МРІЮ
    ===================================================== */

    player.reputation +=
        50;


    player.energy =
        GAME_CONFIG.maxEnergy;


    clampPlayerResources(
        player
    );


    /* =====================================================
       ЗАПИСУЄМО МРІЮ ЯК ВИКОНАНУ
    ===================================================== */

    if (
        !Array.isArray(
            player.completedDreams
        )
    ) {

        player.completedDreams =
            [];

    }


    if (
        !player.completedDreams.includes(
            completedDream.id
        )
    ) {

        player.completedDreams.push(
            completedDream.id
        );

    }


    /* =====================================================
       ПОТОЧНУ МРІЮ ПРИБИРАЄМО

       Гравець потім може
       обрати нову.
    ===================================================== */

    player.dream =
        null;


    gameState.selectedDreamId =
        null;


    addLog(

        `✨ ${player.name} здійснив(ла) Мрію «${completedDream.name}».`

    );


    updatePlayerStatsUI();


    /* =====================================================
       ГРУ НЕ ЗАВЕРШУЄМО
    ===================================================== */

    gameState.runtime.gameFinished =
        false;


    showCompletedDreamModal(
        completedDream
    );

}

/* =========================================================
   93.1. МРІЮ ЗДІЙСНЕНО —
   ВИБІР, ЩО РОБИТИ ДАЛІ
========================================================= */

function showCompletedDreamModal(
    completedDream
) {

    const player =
        gameState.player;


    const completedCount =
        player.completedDreams?.length || 0;


    openGameInfoModal(`

        <div class="dream-ready-modal">

            <div class="cycle-notice-icon">
                🏆
            </div>


            <h2>
                МРІЮ ЗДІЙСНЕНО!
            </h2>


            <div class="dream-ready-name">

                ${completedDream.icon}

                ${completedDream.name}

            </div>


            <p>

                ${
                    player.gender === "girl"

                    ? "Ти здійснила ще одну велику Мрію!"

                    : "Ти здійснив ще одну велику Мрію!"
                }

            </p>


            <p>

                Класна робота! Ти прокачуєш
                фінансову грамотність,
                вчишся керувати ресурсами
                та рухатися до своїх цілей.

            </p>


            <div class="cycle-notice-main-value">

                ✨ Виконано Мрій:
                ${completedCount}
                із
                ${DREAMS.length}

            </div>


            <button
                id="chooseNextDreamButton"
                class="main-game-btn"
            >
                ✨ ОБРАТИ НОВУ МРІЮ
            </button>


            <button
                id="continueAfterDreamButton"
                class="secondary-game-btn"
            >
                ▶ ПРОДОВЖИТИ ГРУ
            </button>


            <button
                id="finishGameAfterDreamButton"
                class="secondary-game-btn"
            >
                🏆 ЗАВЕРШИТИ ГРУ
            </button>

        </div>

    `);


    document
        .getElementById(
            "chooseNextDreamButton"
        )
        ?.addEventListener(
            "click",
            () => {

                closeGameInfoModal();

                showDreamSelection();

            }
        );


    document
        .getElementById(
            "continueAfterDreamButton"
        )
        ?.addEventListener(
            "click",
            () => {

                closeGameInfoModal();

                completePlayerTurn();

            }
        );


    document
        .getElementById(
            "finishGameAfterDreamButton"
        )
        ?.addEventListener(
            "click",
            () => {

                gameState.runtime.gameFinished =
                    true;


                closeGameInfoModal();


                showFinalGameResults();

            }
        );

}


/* =========================================================
   94. ФІНАЛ ГРИ
========================================================= */

function showDreamSuccessScreen() {

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


    const reachedText =
        player.gender ===
            "girl"

            ? "Ти досягла своєї Мрії!"

            : "Ти досяг своєї Мрії!";


    setScreen(`

        <section class="game-screen dream-success-screen">

            <div class="dream-success-card">


                <div class="dream-success-icon">

                    ${player.dream.icon}

                </div>


                <h1>
                    ✨ МРІЮ ДОСЯГНУТО!
                </h1>


                <h2>
                    ${reachedText}
                </h2>


                <div class="dream-success-name">

                    ${player.dream.name}

                </div>


                <p>

                    Ти розвивав / розвивала
                    кар'єру, приймав / приймала
                    фінансові рішення,
                    заробляв / заробляла,
                    навчався / навчалася
                    і поступово наближався /
                    наближалася до своєї цілі.

                </p>


                <div class="dream-success-summary">


                    <div>

                        <span>
                            🏆 Кар'єра
                        </span>

                        <strong>
                            Рівень ${
                                getDisplayedCareerLevel(
                                    player
                                )
                            }
                        </strong>

                        <small>
                            ${profession}
                        </small>

                    </div>


                    <div>

                        <span>
                            💰 Залишок
                        </span>

                        <strong>
                            ${formatMoney(player.money)} грн
                        </strong>

                    </div>


                    <div>

                        <span>
                            💼 Зарплатних періодів
                        </span>

                        <strong>
                            ${player.financialPeriods}
                        </strong>

                    </div>


                    <div>

                        <span>
                            🎲 Ходів
                        </span>

                        <strong>
                            ${player.turnsCompleted}
                        </strong>

                    </div>


                    <div>

                        <span>
                            ⭐ Репутація
                        </span>

                        <strong>
                            ${player.reputation}
                        </strong>

                    </div>


                    <div>

                        <span>
                            🧠 Знання
                        </span>

                        <strong>
                            ${player.knowledge}
                        </strong>

                    </div>


                </div>


                <button
                    id="showFinalResultsButton"
                    class="main-game-btn"
                >
                    ПЕРЕГЛЯНУТИ МОЇ РЕЗУЛЬТАТИ
                </button>


                <button
                    id="playAgainButton"
                    class="secondary-game-btn"
                >
                    ЗІГРАТИ ЩЕ РАЗ
                </button>


            </div>

        </section>

    `);


    document
        .getElementById(
            "showFinalResultsButton"
        )
        .addEventListener(
            "click",
            showFinalGameResults
        );


    document
        .getElementById(
            "playAgainButton"
        )
        .addEventListener(
            "click",
            () => {

                window.location.reload();

            }
        );

}

/* =========================================================
   95. ПІДСУМКИ ГРИ

   Якщо є виконані Мрії —
   показуємо фінансову грамоту.

   Якщо Мрій ще немає —
   показуємо просто тепле завершення гри.
========================================================= */

function showFinalGameResults() {

    const player =
        gameState.player;


    const completedDreams =
        Array.isArray(
            player.completedDreams
        )
            ? player.completedDreams
            : [];


    const completedDreamObjects =
        DREAMS.filter(
            dream =>
                completedDreams.includes(
                    dream.id
                )
        );


    const hasCompletedDreams =
        completedDreamObjects.length > 0;


    const completedDreamsHTML =
        completedDreamObjects.length > 0

            ? completedDreamObjects
                .map(
                    dream => `
                        <span>
                            ${dream.icon}
                            ${dream.name}
                        </span>
                    `
                )
                .join("")

            : "";


    const profession =
        getProfessionName(

            player
                .sector
                .levels[
                    player.careerLevel
                ],

            player.gender

        );


    const finalMainBlock =
        hasCompletedDreams

        ? `

            <div class="final-dream">

                <div class="cycle-notice-icon">
                    🏆
                </div>


                <h2>
                    ФІНАНСОВА ГРАМОТА
                </h2>


                <p>
                    Вітаємо, ${player.name}!
                </p>


                <p>
                    ${
                        player.gender === "girl"

                        ? `Ти круто прокачала свою фінансову грамотність,
                           навчилася приймати рішення,
                           керувати ресурсами
                           та рухатися до великих цілей.`

                        : `Ти круто прокачав свою фінансову грамотність,
                           навчився приймати рішення,
                           керувати ресурсами
                           та рухатися до великих цілей.`
                    }
                </p>


                <div class="cycle-notice-main-value">

                    ${
                        completedDreamObjects.length === 1

                        ? (
                            player.gender === "girl"

                                ? "✨ Ти здійснила свою Мрію!"

                                : "✨ Ти здійснив свою Мрію!"
                          )

                        : (
                            player.gender === "girl"

                                ? `✨ Ти здійснила ${completedDreamObjects.length} Мрії!`

                                : `✨ Ти здійснив ${completedDreamObjects.length} Мрії!`
                          )
                    }

                </div>


                <div class="completed-dreams-summary">

                    ${completedDreamsHTML}

                </div>

            </div>

          `

        : `

            <div class="final-dream">

                <div class="cycle-notice-icon">
                    👋
                </div>


                <h2>
                    ДЯКУЄМО ЗА ГРУ!
                </h2>


                <p>
                    ${
                        player.gender === "girl"

                        ? `Шкода, що цього разу ти завершила гру,
                           не встигнувши здійснити свою Мрію.`

                        : `Шкода, що цього разу ти завершив гру,
                           не встигнувши здійснити свою Мрію.`
                    }
                </p>


                <p>
                    Але кожне фінансове рішення —
                    це досвід.

                    Спробуй ще раз і подивись,
                    куди приведе тебе наступний шлях.
                </p>


                <div class="cycle-notice-main-value">
                    ✨ До зустрічі у наступній грі!
                </div>

            </div>

          `;


    setScreen(`

        <section class="game-screen final-results-screen">

            <div class="final-results-card">


                <h1>
                    Твій шлях у CV ЖИТТЯ
                </h1>


                ${finalMainBlock}


                <div class="final-results-grid">


                    <div>

                        <span>
                            🎲 Ходів
                        </span>

                        <strong>
                            ${player.turnsCompleted}
                        </strong>

                    </div>


                    <div>

                        <span>
                            💰 Фінансових періодів
                        </span>

                        <strong>
                            ${player.financialPeriods}
                        </strong>

                    </div>


                    <div>

                        <span>
                            💵 Отримано зарплати
                        </span>

                        <strong>

                            ${formatMoney(
                                player.totalSalaryReceived
                            )} грн

                        </strong>

                    </div>


                    <div>

                        <span>
                            📈 Регулярний дохід
                        </span>

                        <strong>

                            ${formatMoney(
                                player.totalPassiveIncomeReceived
                            )} грн

                        </strong>

                    </div>


                    <div>

                        <span>
                            🏆 Кар'єрний рівень
                        </span>

                        <strong>

                            ${
                                getDisplayedCareerLevel(
                                    player
                                )
                            }

                        </strong>

                    </div>


                    <div>

                        <span>
                            💼 Професія
                        </span>

                        <strong>
                            ${profession}
                        </strong>

                    </div>


                    <div>

                        <span>
                            ⭐ Репутація
                        </span>

                        <strong>
                            ${player.reputation}
                        </strong>

                    </div>


                    <div>

                        <span>
                            🧠 Знання
                        </span>

                        <strong>
                            ${player.knowledge}
                        </strong>

                    </div>


                    <div>

                        <span>
                            ⚡ Енергія
                        </span>

                        <strong>
                            ${player.energy}
                        </strong>

                    </div>


                </div>


                <button
                    id="finalPlayAgainButton"
                    class="main-game-btn"
                >
                    ЗІГРАТИ ЩЕ РАЗ
                </button>


            </div>

        </section>

    `);


    document
        .getElementById(
            "finalPlayAgainButton"
        )
        ?.addEventListener(
            "click",
            () => {

                window.location.reload();

            }
        );

}


/* =========================================================
   КІНЕЦЬ ЧАСТИНИ 5А

   ДАЛІ — 5Б:

   - правильне завершення карткового ходу;
   - зв'язок Долі з другим кидком;
   - відмова від Життя;
   - усі specialAction карток Життя;
   - регулярні платежі;
   - іпотека;
   - франшиза;
   - сімейне вогнище;
   - Premium-контакт;
   - AI з таким самим циклом;
   - зарплата AI;
   - виправлення старого startAITurns();
   - повернення керування гравцю.

   ПІСЛЯ 5Б ГРУ ВЖЕ МОЖНА БУДЕ
   ПРОГАНЯТИ ВІД СТАРТУ ДО МРІЇ.

   І ТІЛЬКИ ПІСЛЯ ЦЬОГО
   БЕРЕМО БАНК.
========================================================= */
/* =========================================================
   96. ЗАВЕРШЕННЯ КАРТКОВОГО ХОДУ

   ЗАМІНЮЄ ПОПЕРЕДНЮ
   finishPlayerCardTurn().

   Тепер після картки:
   → завершується власний хід;
   → рахується 3-й хід;
   → запускаються AI;
   → повертається керування гравцю.
========================================================= */

function finishPlayerCardTurn() {

    closeGameInfoModal();

    completePlayerTurn();

}


/* =========================================================
   97. СТАРА startAITurns()

   У попередніх частинах деякі функції
   ще викликають startAITurns().

   Тому залишаємо сумісність,
   але тепер вона означає:

   "завершити хід гравця".
========================================================= */

function startAITurns() {

    completePlayerTurn();

}


/* =========================================================
   98. ОСНОВНИЙ ЦИКЛ AI
========================================================= */
/* =========================================================
   98. ОСНОВНИЙ ЦИКЛ AI
========================================================= */

async function startAITurnsCore() {

    ensureGameRuntimeState();

    if (gameState.runtime.gameFinished) {
        return;
    }

    gameState.currentTurn = "ai";

    const rollButton =
        document.getElementById("rollDiceButton");

    if (rollButton) {
        rollButton.disabled = true;
    }

    for (const ai of gameState.opponents) {

        if (gameState.runtime.gameFinished) {
            return;
        }

        await runAITurnCore(ai);

        // Оновлюємо картки AI у боковій панелі.
        updateAIPlayersUI();
    }

    /* =====================================================
       AI ЗАВЕРШИЛИ ХОДИ

       Показуємо зарплату / кар'єрні повідомлення
       та готуємо наступний хід людини.
    ===================================================== */

    gameState.currentTurn = "between-turns";

    showNextGameNotice(() => {
        beginNextPlayerTurn();
    });

}

/* =========================================================
   99. ПОЧАТОК НАСТУПНОГО ХОДУ
========================================================= */

async function beginNextPlayerTurn() {

    if (
        gameState.runtime.gameFinished
    ) {

        return;

    }


    await preparePlayerTurn();


    /*
       preparePlayerTurn()
       міг створити відкладені
       повідомлення.
    */

    if (
        gameState.runtime.noticeQueue.length >
        0
    ) {

        showNextGameNotice(

            () => {

                activatePlayerTurn();

            }

        );


        return;

    }


    activatePlayerTurn();

}


/* =========================================================
   100. ПОВЕРНЕННЯ КЕРУВАННЯ ГРАВЦЮ
========================================================= */

function activatePlayerTurn() {

    if (
        gameState.runtime.gameFinished
    ) {

        return;

    }


    gameState.currentTurn =
        "player";


    const button =
        document.getElementById(
            "rollDiceButton"
        );


    if (button) {

        button.disabled =
            false;

    }


    const title =
        document.getElementById(
            "diceTitle"
        );


    if (title) {

        title.textContent =
            "ТВІЙ ХІД";

    }


    const message =
        document.getElementById(
            "diceMessage"
        );


    if (message) {

        message.innerHTML = `

            Хід ${
                gameState.player.turnsCompleted + 1
            }

            <br>

            Кидай кубик 🎲

        `;

    }


    showRaifikCurrentCardMessage(

        `${gameState.player.name}, твій хід. Кидай кубик 🎲`

    );

}


/* =========================================================
   101. ХІД AI
========================================================= */

async function runAITurnCore(
    ai
) {

    if (!ai) {

        return;

    }


    /* =====================================================
       ПРОПУСК ХОДУ
    ===================================================== */

    if (
        ai.skipTurns > 0
    ) {

        ai.skipTurns -=
            1;


        ai.turnsCompleted +=
            1;


        addLog(

            `⏭ ${ai.name} пропускає хід.`

        );


        processAIFinancialPeriodIfNeeded(
            ai
        );


        return;

    }


    /* =====================================================
       ПОЧАТОК ХОДУ AI
    ===================================================== */

    prepareAITurnEffects(
        ai
    );


    /* =====================================================
       ПЕРЕХІД НА ВЕЛИКЕ КОЛО
    ===================================================== */

    if (
        ai.pendingOuterTransition
    ) {

        await moveParticipantToOuterStart(
            ai
        );

    }


    const title =
        document.getElementById(
            "diceTitle"
        );


    if (title) {

        title.textContent =
            `Хід: ${ai.name}`;

    }


    showRaifikCurrentCardMessage(

        `Зараз ходить ${ai.name} 🙂`

    );


    await delay(
        GAME_CONFIG.aiThinkDelay
    );


    const diceElement =
        document.getElementById(
            "dice"
        );


    for (
        let i = 0;
        i < 6;
        i++
    ) {

        const temp =
            randomNumber(
                1,
                6
            );


        if (diceElement) {

            diceElement.textContent =
                DICE_FACES[
                    temp - 1
                ];

        }


        await delay(
            80
        );

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

        `🎲 ${ai.name}: ${dice}`

    );


    await moveAIStepByStepCore(

        ai,

        dice

    );


    await resolveAICellCore(
        ai
    );


    ai.turnsCompleted +=
        1;


    processAIFinancialPeriodIfNeeded(
        ai
    );


    checkCareerProgress(
        ai
    );


    await delay(
        GAME_CONFIG.aiResultDelay
    );

}


/* =========================================================
   102. ЕФЕКТИ НА ПОЧАТКУ ХОДУ AI
========================================================= */

function prepareAITurnEffects(
    ai
) {

    /* Сімейне вогнище */

    if (
        ai.effects.familyHearth
        &&
        ai.energy < 70
    ) {

        ai.energy =
            70;

    }


    /* Регулярна енергія */

    if (
        ai.effects.energyPerTurn
    ) {

        applyEffects(

            ai,

            {
                energy:
                    ai.effects.energyPerTurn
            }

        );

    }


    /* Дохід кожного ходу */

    if (
        ai.effects.incomePerTurn
    ) {

        ai.money +=
            ai.effects.incomePerTurn;

    }


    processDelayedEffects(
        ai
    );


    clampPlayerResources(
        ai
    );

}


/* =========================================================
   103. РУХ AI

   AI ТЕПЕР ТЕЖ:

   - НЕ переходить автоматично
     після клітинки 28;
   - рахує кола;
   - повинен пройти inner;
   - повинен мати рівень 2;
   - тільки тоді переходить
     на outer.
========================================================= */

async function moveAIStepByStepCore(
    ai,
    steps
) {

    const boardLength =
        ai.board === "inner"

        ? GAME_CONFIG.innerCells

        : GAME_CONFIG.outerCells;


    let crossedStart =
        false;


    let exactStart =
        false;


    for (
        let step = 0;
        step < steps;
        step++
    ) {

        let next =
            ai.position + 1;


        if (
            next >
            boardLength
        ) {

            next =
                1;


            crossedStart =
                true;


            if (
                ai.board ===
                "inner"
            ) {

                ai.innerLaps +=
                    1;

            }

            else {

                ai.outerLaps +=
                    1;

            }

        }


        ai.position =
            next;


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


    exactStart =
        crossedStart
        &&
        ai.position === 1;


    if (
        crossedStart
    ) {

        await handleCompletedLap(

            ai,

            exactStart

        );

    }

}

/* =========================================================
   AI — ПОКАЗ РЕЗУЛЬТАТУ ХОДУ
========================================================= */

function showAIResult(
    ai,
    title,
    effects = {}
) {

    if (!ai) {
        return;
    }


    const parts = [];


    if (effects.money) {
        parts.push(
            `💰 ${effects.money > 0 ? "+" : ""}${formatMoney(effects.money)}`
        );
    }


    if (effects.reputation) {
        parts.push(
            `⭐ ${effects.reputation > 0 ? "+" : ""}${effects.reputation} репутації`
        );
    }


    if (effects.knowledge) {
        parts.push(
            `🧠 ${effects.knowledge > 0 ? "+" : ""}${effects.knowledge} знань`
        );
    }


    if (effects.energy) {
        parts.push(
            `⚡ ${effects.energy > 0 ? "+" : ""}${effects.energy} енергії`
        );
    }


    showRaifikCurrentCardMessage(
        `
        <strong>${ai.name}</strong><br>
        ${title}
        ${
            parts.length
                ? `<br>${parts.join(" • ")}`
                : ""
        }
        `
    );

}

/* =========================================================
   104. КЛІТИНКА AI
========================================================= */

async function resolveAICellCore(
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


    if (!type) {

        return;

    }


    showRaifikCurrentCardMessage(

        `${ai.name} потрапив(ла) на ${type.icon} «${type.name}».`

    );


    await delay(
        500
    );


    switch (
        typeId
    ) {


        /* =================================================
           START
        ================================================= */

        case "start":

            break;


        /* =================================================
           ПОДІЯ
        ================================================= */

        case "event":

            resolveAIDecisionCard(

                ai,

                getAIRandomCard(
                    ai,
                    "event"
                )

            );

            break;


        /* =================================================
           БАНК

           Поки Банк ще не зроблений,
           AI просто проходить клітинку.

           Коли додамо Банк —
           вставимо сюди банківську логіку.
        ================================================= */

        case "bank":

            showAIResult(

                ai,

                "Банк",

                {}

            );

            break;


        /* =================================================
           ЖИТТЯ
        ================================================= */

        case "life":

            resolveAIDecisionCard(

                ai,

                getAIRandomCard(
                    ai,
                    "life"
                )

            );

            break;


        /* =================================================
           ДОЛЯ
        ================================================= */

        case "fate":

            resolveAIFateCard(

                ai,

                getAIRandomCard(
                    ai,
                    "fate"
                )

            );

            break;


        /* =================================================
           LOUNGE
        ================================================= */

        case "lounge":

            resolveAILounge(
                ai
            );

            break;


        /* =================================================
           ACADEMY
        ================================================= */

        case "academy":

            resolveAIAcademy(
                ai
            );

            break;


        /* =================================================
           ПЕРЕХІД
        ================================================= */

        case "transition":

            if (
                ai.innerLaps >= 1
                &&
                ai.careerLevel >=
                    GAME_CONFIG
                        .outerUnlockCareerLevel
            ) {

                ai.pendingOuterTransition =
                    true;

            }

            break;


        /* =================================================
           МРІЯ
        ================================================= */

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
   105. ВИПАДКОВА КАРТКА AI
========================================================= */

function getAIRandomCard(
    ai,
    deckName
) {

    const deck =
        getDeckForParticipant(

            ai,

            deckName

        );


    if (
        !deck ||
        deck.length === 0
    ) {

        return null;

    }


    return randomItem(
        deck
    );

}


/* =========================================================
   106. AI — КАРТКА З ВИБОРОМ

   Для AI:

   1. шукаємо доступні рішення;
   2. відсіюємо ті,
      на які не вистачає грошей;
   3. обираємо випадковий
      доступний варіант.

   Це дозволяє AI проходити гру
   без зупинки модалками.
========================================================= */

function resolveAIDecisionCard(
    ai,
    card
) {

    if (!card) {

        return;

    }


    const fullCheck =
        checkFullCardRequirements(

            ai,

            card

        );


    if (
        !fullCheck.passed
    ) {

        showAIResult(

            ai,

            `${card.title} — умови не виконані`,

            {}

        );


        return;

    }


    const availableChoices =
        (
            card.choices ||
            []
        )
        .filter(
            choice => {

                const minimum =
                    checkCardRequirements(

                        ai,

                        choice.minimum ||
                        {}

                    );


                if (
                    !minimum.passed
                ) {

                    return false;

                }


                if (
                    choice.conditionProduct
                    &&
                    !hasBankProduct(

                        ai,

                        choice.conditionProduct

                    )
                ) {

                    return false;

                }


                return true;

            }
        );


    if (
        availableChoices.length ===
        0
    ) {

        return;

    }


    const choice =
        randomItem(
            availableChoices
        );


    applyEffects(

        ai,

        choice.effects ||
        {}

    );


    applyPersistentEffects(

        ai,

        choice.persistentEffects

    );


    if (
        choice.delayedEffect
    ) {

        addDelayedEffect(

            ai,

            choice.delayedEffect

        );

    }


    applyAllSpecialActions(

        ai,

        choice

    );


    /* =====================================================
       КИДОК ВСЕРЕДИНІ КАРТКИ
    ===================================================== */

    if (
        choice.diceOutcomes
    ) {

        const roll =
            randomNumber(
                1,
                6
            );


        const outcome =
            choice
                .diceOutcomes
                .find(
                    item =>

                        roll >= item.min
                        &&
                        roll <= item.max
                );


        if (outcome) {

            applyEffects(

                ai,

                outcome.effects ||
                {}

            );


            applyPersistentEffects(

                ai,

                outcome.persistentEffects

            );


            if (
                outcome.specialAction
            ) {

                applyCardSpecialAction(

                    ai,

                    outcome.specialAction

                );

            }

        }

    }


    showAIResult(

        ai,

        card.title,

        choice.effects ||
        {}

    );

}


/* =========================================================
   107. AI — ДОЛЯ
========================================================= */

function resolveAIFateCard(
    ai,
    card
) {

    if (!card) {

        return;

    }


    let effects = {

        ...(card.effects || {})

    };


    /* Страхування */

    if (
        card.insuranceProtection
        &&
        hasBankProduct(

            ai,

            card
                .insuranceProtection
                .product

        )
    ) {

        effects.money =
            (
                effects.money || 0
            )
            +
            (
                card
                    .insuranceProtection
                    .refundMoney || 0
            );

    }


    applyEffects(

        ai,

        effects

    );


    showAIResult(

        ai,

        card.title,

        effects

    );

}


/* =========================================================
   108. AI — LOUNGE
========================================================= */

function resolveAILounge(
    ai
) {

    if (
        ai.energy >=
        GAME_CONFIG.maxEnergy
    ) {

        ai.effects
            .protectEnergyForLap =
            true;


        ai.effects
            .protectedEnergyBoard =
            ai.board;


        ai.effects
            .protectedEnergyLap =
            ai.board === "inner"

            ? ai.innerLaps

            : ai.outerLaps;


        showAIResult(

            ai,

            "Lounge: захист енергії",

            {}

        );


        return;

    }


    const gained =
        GAME_CONFIG.maxEnergy -
        ai.energy;


    ai.energy =
        GAME_CONFIG.maxEnergy;


    showAIResult(

        ai,

        "Lounge & Хобі",

        {
            energy:
                gained
        }

    );

}


/* =========================================================
   109. AI — ACADEMY

   AI автоматично обирає
   доступний варіант.

   Пріоритет:
   Hard Skills → Soft Skills.
========================================================= */

function resolveAIAcademy(
    ai
) {

    if (
        ai.money >= 6000
        &&
        ai.energy >= 10
    ) {

        applyEffects(

            ai,

            {
                money: -6000,
                energy: -10,
                knowledge: 25,
                reputation: 10
            }

        );


        showAIResult(

            ai,

            "Hard Skills",

            {
                money: -6000,
                energy: -10,
                knowledge: 25,
                reputation: 10
            }

        );


        return;

    }


    if (
        ai.money >= 3000
    ) {

        applyEffects(

            ai,

            {
                money: -3000,
                knowledge: 10,
                reputation: 5
            }

        );


        showAIResult(

            ai,

            "Soft Skills",

            {
                money: -3000,
                knowledge: 10,
                reputation: 5
            }

        );

    }

}


/* =========================================================
   110. ФІНАНСОВИЙ ПЕРІОД AI

   Кожні 3 ВЛАСНІ ходи AI.
========================================================= */

function processAIFinancialPeriodIfNeeded(
    ai
) {

    if (
        ai.turnsCompleted %
            GAME_CONFIG.financialPeriodTurns
        !==
        0
    ) {

        return;

    }


    ai.financialPeriods +=
        1;


    const salary =
        Number(
            ai.salary
        ) || 0;


    const passive =
        Number(
            ai.passiveIncome
        ) || 0;


    ai.money +=
        salary +
        passive;


    ai.totalSalaryReceived +=
        salary;


    ai.totalPassiveIncomeReceived +=
        passive;


    addLog(

        `💰 ${ai.name}: зарплата +${formatMoney(salary)} грн${
            passive
                ? `, додатковий дохід +${formatMoney(passive)} грн`
                : ""
        }`

    );

}


/* =========================================================
   111. УСІ SPECIAL ACTION
========================================================= */

function applyAllSpecialActions(
    participant,
    source
) {

    if (!source) {

        return;

    }


    if (
        source.specialAction
    ) {

        applyCardSpecialAction(

            participant,

            source.specialAction

        );

    }


    if (
        Array.isArray(
            source.specialActions
        )
    ) {

        source
            .specialActions
            .forEach(
                action => {

                    applyCardSpecialAction(

                        participant,

                        action

                    );

                }
            );

    }

}


/* =========================================================
   112. ОНОВЛЕНА resolveCardChoice()

   ЗАМІНЮЄ ВЕРСІЮ З 4А.

   Працюють:
   - specialAction
   - specialActions
   - delayedEffect
   - diceOutcomes
   - одноразові страхові захисти
========================================================= */

async function resolveCardChoice(
    deckName,
    card,
    choice
) {
    const player =
        gameState.player;

    /* =====================================================
       ОДНОРАЗОВІ ЗАХИСТИ ЕНЕРГІЇ
    ===================================================== */

    const energyLoss =
        Number(choice.effects?.energy) || 0;

    const lifeProduct =
        player.bank?.products?.find(
            product =>
                product &&
                product.id === "life_insurance" &&
                product.active !== false &&
                product.energyProtectionUsed !== true
        );

    const vartaProduct =
        player.bank?.products?.find(
            product =>
                product &&
                product.id === "varta_247" &&
                product.active !== false
        );

    let protectionMessage = "";

    /*
       Для картки Життя спочатку використовуємо
       захист страхування життя.

       Накопичення після використання захисту
       продовжується.
    */

    if (
        deckName === "life" &&
        lifeProduct &&
        energyLoss <= -15
    ) {
        choice = {
            ...choice,

            effects: {
                ...(choice.effects || {}),
                energy: energyLoss + 15
            }
        };

        lifeProduct.energyProtectionUsed = true;

        protectionMessage =
            `🛡️ Страхування життя скасувало 15 одиниць втрати енергії. Замість ${energyLoss}: ${energyLoss + 15}. Одноразовий захист використано; накопичення продовжується.`;
    } else if (
        vartaProduct &&
        energyLoss <= -10
    ) {
        choice = {
            ...choice,

            effects: {
                ...(choice.effects || {}),
                energy: energyLoss + 10
            }
        };

        vartaProduct.active = false;

        protectionMessage =
            `🛡️ «Варта 24/7» скасувала 10 одиниць втрати енергії. Замість ${energyLoss}: ${energyLoss + 10}. Одноразовий захист використано.`;
    }

    if (protectionMessage) {
        // Доповнюємо пояснення, не змінюючи спільну картку.
        choice = {
            ...choice,

            resultText: [
                choice.resultText,
                protectionMessage
            ].filter(Boolean).join(" ")
        };

        addLog(protectionMessage);
    }

    applyEffects(
        player,
        choice.effects || {}
    );

    /* =====================================================
       ОДНОРАЗОВЕ ВИКОРИСТАННЯ БАНКІВСЬКОГО ЗАХИСТУ
    ===================================================== */

    if (
        choice.consumeBankProduct &&
        Array.isArray(player.bank?.products)
    ) {
        const protectionProduct =
            player.bank.products.find(
                product =>
                    product &&
                    product.id === choice.consumeBankProduct &&
                    product.active !== false
            );

        if (protectionProduct) {
            protectionProduct.active = false;

            addLog(
                "🛡️ Одноразовий страховий захист використано."
            );
        }
    }

    applyPersistentEffects(
        player,
        choice.persistentEffects
    );

    if (choice.delayedEffect) {
        addDelayedEffect(
            player,
            choice.delayedEffect
        );
    }

    applyAllSpecialActions(
        player,
        choice
    );

    if (choice.diceOutcomes) {
        await resolveCardDiceOutcome(
            card,
            choice,
            deckName
        );

        return;
    }

    /* =====================================================
       OPTIONAL RISK

       Наприклад: міжнародне стажування.
    ===================================================== */

    if (choice.optionalRisk) {
        showOptionalRiskChoice(
            deckName,
            card,
            choice
        );

        return;
    }

    addLog(
        `${player.name}: ${card.title} → ${choice.title}`
    );

    showCardFinalResult(
        deckName,
        card,
        choice,
        choice.resultText
    );
}

/* =========================================================
   113. КИДОК УСЕРЕДИНІ КАРТКИ

   ОНОВЛЕНА ВЕРСІЯ.
========================================================= */

async function resolveCardDiceOutcome(
    card,
    choice,
    deckName = "event"
) {
    const player =
        gameState.player;

    openGameInfoModal(`
        <div class="card-extra-roll">
            <div class="cycle-notice-icon">
                🎲
            </div>

            <h2>
                Кидок кубика
            </h2>

            <p>
                Зараз випадок визначить результат.
            </p>

            <div
                id="cardExtraDice"
                class="second-card-dice"
            >
                ⚀
            </div>
        </div>
    `);

    const display =
        document.getElementById(
            "cardExtraDice"
        );

    for (
        let i = 0;
        i < 8;
        i++
    ) {
        const temp =
            randomNumber(1, 6);

        if (display) {
            display.textContent =
                DICE_FACES[temp - 1];
        }

        await delay(80);
    }

    const value =
        randomNumber(1, 6);

    if (display) {
        display.textContent =
            DICE_FACES[value - 1];
    }

    await delay(400);

    let outcome =
        choice.diceOutcomes.find(
            item =>
                value >= item.min &&
                value <= item.max
        );

    if (outcome) {
        /* =============================================
           ОДНОРАЗОВІ ЗАХИСТИ ЕНЕРГІЇ
        ============================================= */

        const energyLoss =
            Number(outcome.effects?.energy) || 0;

        const lifeProduct =
            player.bank?.products?.find(
                product =>
                    product &&
                    product.id === "life_insurance" &&
                    product.active !== false &&
                    product.energyProtectionUsed !== true
            );

        const vartaProduct =
            player.bank?.products?.find(
                product =>
                    product &&
                    product.id === "varta_247" &&
                    product.active !== false
            );

        let protectionMessage = "";
        let protectedEnergy = energyLoss;

        if (
            deckName === "life" &&
            lifeProduct &&
            energyLoss <= -15
        ) {
            protectedEnergy = energyLoss + 15;

            lifeProduct.energyProtectionUsed = true;

            protectionMessage =
                `🛡️ Страхування життя скасувало 15 одиниць втрати енергії. Замість ${energyLoss}: ${protectedEnergy}. Захист використано; накопичення продовжується.`;
        } else if (
            vartaProduct &&
            energyLoss <= -10
        ) {
            protectedEnergy = energyLoss + 10;

            vartaProduct.active = false;

            protectionMessage =
                `🛡️ «Варта 24/7» скасувала 10 одиниць втрати енергії. Замість ${energyLoss}: ${protectedEnergy}. Захист використано.`;
        }

        if (protectionMessage) {
            // Не змінюємо результат у спільній колоді.
            outcome = {
                ...outcome,

                effects: {
                    ...(outcome.effects || {}),
                    energy: protectedEnergy
                },

                text: [
                    outcome.text,
                    protectionMessage
                ].filter(Boolean).join(" ")
            };

            addLog(protectionMessage);
        }

        applyEffects(
            player,
            outcome.effects || {}
        );

        applyPersistentEffects(
            player,
            outcome.persistentEffects
        );

        applyAllSpecialActions(
            player,
            outcome
        );
    }

    addLog(
        `🎲 ${card.title}: випало ${value}`
    );

    showCardFinalResult(
        deckName,
        card,
        choice,
        outcome
            ? outcome.text
            : "Без додаткових змін"
    );
}

/* =========================================================
   114. OPTIONAL RISK

   Для карток, де після основного
   рішення можна додатково
   ризикнути.
========================================================= */

function showOptionalRiskChoice(
    deckName,
    card,
    choice
) {

    const risk =
        choice.optionalRisk;


    openGameInfoModal(`

        <div class="optional-risk-modal">

            <div class="cycle-notice-icon">
                🎲
            </div>


            <h2>
                Хочеш ризикнути?
            </h2>


          <p>
    ${
        gameState.player.gender === "girl"

        ? "Основний результат картки ти вже отримала. Хочеш спробувати удачу ще раз?"

        : "Основний результат картки ти вже отримав. Хочеш спробувати удачу ще раз?"
    }
</p>



            <button
                id="takeOptionalRiskButton"
                class="main-game-btn"
            >
                🎲 РИЗИКНУТИ
            </button>


            <button
                id="skipOptionalRiskButton"
                class="secondary-game-btn"
            >
                НЕ РИЗИКУВАТИ
            </button>

        </div>

    `);


    document
        .getElementById(
            "takeOptionalRiskButton"
        )
        .addEventListener(
            "click",
            () => {

                resolveOptionalRisk(

                    deckName,

                    card,

                    choice

                );

            }
        );


    document
        .getElementById(
            "skipOptionalRiskButton"
        )
        .addEventListener(
            "click",
            () => {

                showCardFinalResult(

                    deckName,

                    card,

                    choice,

                    choice.resultText

                );

            }
        );

}


/* =========================================================
   115. РЕЗУЛЬТАТ OPTIONAL RISK
========================================================= */

async function resolveOptionalRisk(
    deckName,
    card,
    choice
) {

    const player =
        gameState.player;


    const risk =
        choice.optionalRisk;


    if (
        risk.cost
    ) {

        applyEffects(

            player,

            risk.cost

        );

    }


    const value =
        randomNumber(
            1,
            6
        );


    const outcome =
        risk
            .diceOutcomes
            .find(
                item =>

                    value >= item.min
                    &&
                    value <= item.max
            );


    if (outcome) {

        applyEffects(

            player,

            outcome.effects ||
            {}

        );


        applyPersistentEffects(

            player,

            outcome.persistentEffects

        );


        applyAllSpecialActions(

            player,

            outcome

        );

    }


    showCardFinalResult(

        deckName,

        card,

        choice,

        `🎲 Випало ${value}. ${
            outcome
                ? outcome.text
                : ""
        }`

    );

}


/* =========================================================
   116. РОЗШИРЕНІ SPECIAL ACTIONS

   ЦЯ ВЕРСІЯ ЗАМІНЮЄ
   applyCardSpecialAction()
   З ПОПЕРЕДНІХ ЧАСТИН.
========================================================= */

function applyCardSpecialAction(
    participant,
    action
) {

    if (
        !participant ||
        !action
    ) {

        return;

    }


    switch (
        action
    ) {


        /* =================================================
           ЕНЕРГІЯ ДО 100
        ================================================= */

        case "restoreEnergyTo100":

            participant.energy =
                GAME_CONFIG.maxEnergy;

            break;


        /* =================================================
           ПРОПУСК НАСТУПНОГО ХОДУ
        ================================================= */

        case "skipNextTurn":

            participant.skipTurns +=
                1;

            break;


        /* =================================================
           СІМЕЙНЕ ВОГНИЩЕ
        ================================================= */

        case "familyHearth":

            participant.effects.familyHearth =
                true;


            if (
                participant.energy < 70
            ) {

                participant.energy =
                    70;

            }

            break;


        /* =================================================
           +10 ЕНЕРГІЇ 3 ХОДИ
        ================================================= */

        case "familyEnergyThreeTurns":

            addTimedTurnEffect(

                participant,

                {
                    turns: 3,

                    effects: {
                        energy: 10
                    },

                    text:
                        "Родинне натхнення"
                }

            );

            break;


        /* =================================================
           -10 000 ДОХОДУ
           ПРОТЯГОМ 2 ФІНПЕРІОДІВ
        ================================================= */

        case "reduceIncomeTwoPeriods":

            addFinancialModifier(

                participant,

                {
                    periods: 2,

                    amount: -10000,

                    text:
                        "Наслідки конфлікту"
                }

            );

            break;


        /* =================================================
           НОВИЙ РИНОК:
           ЧЕРЕЗ 2 ХОДИ
           +15 000 КОЖНОГО ХОДУ
        ================================================= */

        case "newMarketTwoTurns":

            addDelayedEffect(

                participant,

                {
                    turns: 2,

                    effects: {},

                    text:
                        "Новий напрямок запущено",

                    specialAction:
                        "activateNewMarketIncome"
                }

            );

            break;


        case "activateNewMarketIncome":

            participant.effects.incomePerTurn +=
                15000;

            break;


        /* =================================================
           НЕРУХОМІСТЬ
        ================================================= */

        case "addPropertyAsset":

            if (
                typeof participant.effects.properties !==
                "number"
            ) {

                participant.effects.properties =
                    0;

            }


            participant.effects.properties +=
                1;

            break;


        /* =================================================
           ІПОТЕКА:
           -10 000 ЩОХОДУ × 4
        ================================================= */

        case "propertyMortgageFourTurns":

            addTimedTurnEffect(

                participant,

                {
                    turns: 4,

                    effects: {
                        money: -10000
                    },

                    text:
                        "Платіж за бізнес-іпотекою"
                }

            );

            break;


        /* =================================================
           ФРАНШИЗА:
           З НАСТУПНОГО ХОДУ
           +20 000 ЩОХОДУ
        ================================================= */

        case "franchiseIncomeFromNextTurn":

            addDelayedEffect(

                participant,

                {
                    turns: 1,

                    effects: {},

                    text:
                        "Франчайзингова мережа почала приносити дохід",

                    specialAction:
                        "activateFranchiseIncome"
                }

            );

            break;


        case "activateFranchiseIncome":

            participant.effects.incomePerTurn +=
                20000;

            break;


        /* =================================================
           VIP / PREMIUM CONTACT
        ================================================= */

        case "premiumContact":

            participant.effects.premiumContact =
                true;

            break;


        /* =================================================
           ПЕРЕКИД КУБИКА
        ================================================= */

        case "grantReroll":

            participant.effects.rerolls =
                (
                    participant.effects.rerolls ||
                    0
                ) + 1;

            break;


        /* =================================================
           НАСТУПНІ ЗНАННЯ
           НА 50% ДЕШЕВШЕ

           Поки зберігаємо жетон.
           Використання прив'яжемо
           до платних освітніх рішень.
        ================================================= */

        case "nextKnowledgeUpgradeHalfPrice":

        case "knowledgeDiscount":

            participant.effects.knowledgeDiscount =
                0.5;

            break;


        /* =================================================
           РІСТ ПРОДАЖІВ 30%

           Зберігаємо як окремий
           бізнес-ефект.

           Якщо вже є регулярний дохід,
           збільшуємо його на 30%.
        ================================================= */

        case "salesGrowth30Percent": {

            participant.effects.salesGrowth =
                0.30;


            if (
                participant.passiveIncome > 0
            ) {

                const bonus =
                    Math.round(
                        participant.passiveIncome *
                        0.30
                    );


                participant.passiveIncome +=
                    bonus;

            }

            break;
        }


        /* =================================================
           КАР'ЄРНИЙ РІВЕНЬ 2
        ================================================= */

        case "promoteToLevel2":

            if (
                participant.careerLevel < 1
            ) {

                participant.careerLevel =
                    1;


                const stats =
                    getCareerStats(

                        participant.sector.id,

                        2

                    );


                participant.salary =
                    stats.salary;

            }

            break;


        /* =================================================
           ПІДСУМКОВИЙ ЗВІТ
        ================================================= */

        case "circleOneReport":

            if (
                participant.reputation +
                participant.knowledge >=
                60
            ) {

                participant.money +=
                    15000;

            }

            break;


        /* =================================================
           ПІДВИЩЕННЯ НА 1 РІВЕНЬ
        ================================================= */

        case "promoteOneLevelIfReady":

            promoteParticipantOneLevelIfReady(
                participant
            );

            break;


        /* =================================================
           НОВА ПРОФЕСІЯ

           У ДЖЕРЕЛІ НЕ ВКАЗАНО
           СПОСІБ ВИБОРУ.

           Тому поки тільки
           фіксуємо можливість.
        ================================================= */

        case "changeCareerSector":

            participant.effects
                .careerChangeAvailable =
                true;

            break;


        /* =================================================
           БОНУС НА НАСТУПНУ
           КАР'ЄРНУ ПОДІЮ
        ================================================= */

        case "grantNextCareerEventBonus":

            participant.effects
                .nextCareerEventBonus = {

                    money: 10000,

                    reputation: 10

                };

            break;


        /* =================================================
           РІК ОСОБИСТОГО РОЗВИТКУ
        ================================================= */

        case "personalDevelopmentBonus":

            if (
                participant.knowledge >=
                80
            ) {

                participant.reputation +=
                    5;

            }

            break;


        /* =================================================
           ОТРИМАТИ ДОЛЮ
        ================================================= */

        case "drawFateCard":

            participant.effects.pendingFateCard =
                true;

            break;


        /* =================================================
           КОЛАБОРАЦІЯ

           Для одиночного режиму
           зберігаємо прапорець.
           Повноцінний вибір партнера
           зробимо окремою модалкою
           після базового тестування.
        ================================================= */

        case "collaborationWithPlayer":

            participant.effects
                .collaborationAvailable =
                true;

            break;


        case "referralNetwork":

            participant.effects
                .referralNetworkAvailable =
                true;

            break;


        case "playerVoteConflict":

            participant.effects
                .manualVoteRequired =
                true;

            break;


        /* =================================================
           СИНДИКАТ

           Для основного циклу:
           гравець вносить свою частку,
           через 2 ходи отримує
           свою частину результату.
        ================================================= */

        case "strategicSyndicate":

            if (
                participant.money >=
                30000
            ) {

                participant.money -=
                    30000;


                addDelayedEffect(

                    participant,

                    {
                        turns: 2,

                        effects: {
                            money: 65000,
                            reputation: 25
                        },

                        text:
                            "Прибуток стратегічного синдикату"
                    }

                );

            }

            break;


        /* =================================================
           ПОДАТКОВИЙ АУДИТ
        ================================================= */

        case "taxAudit":

            if (
                participant.knowledge >=
                65
            ) {

                participant.reputation +=
                    15;

            }

            else {

                participant.money -=
                    15000;


                participant.reputation -=
                    20;


                participant.energy -=
                    20;

            }

            break;


        /* =================================================
           МРІЯ
        ================================================= */

        case "realizeDream":

            if (
                participant.id ===
                "player"
            ) {

                if (
                    canRealizeDream(
                        participant
                    )
                ) {

                    realizePlayerDream();

                }

            }

            break;

    }


    clampPlayerResources(
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
   117. ТИМЧАСОВІ ЕФЕКТИ
   "КОЖНОГО ХОДУ N РАЗІВ"
========================================================= */

function addTimedTurnEffect(
    participant,
    effect
) {

    if (
        !Array.isArray(
            participant.effects.timedTurnEffects
        )
    ) {

        participant.effects.timedTurnEffects =
            [];

    }


    participant
        .effects
        .timedTurnEffects
        .push({

            turnsLeft:
                effect.turns,

            effects:
                effect.effects ||
                {},

            text:
                effect.text ||
                "Тимчасовий ефект"

        });

}


/* =========================================================
   118. ОБРОБКА ТИМЧАСОВИХ ЕФЕКТІВ
========================================================= */

function processTimedTurnEffects(
    participant
) {

    if (
        !Array.isArray(
            participant.effects.timedTurnEffects
        )
    ) {

        return;

    }


    const remaining = [];


    participant
        .effects
        .timedTurnEffects
        .forEach(
            effect => {

                applyEffects(

                    participant,

                    effect.effects ||
                    {}

                );


                addLog(

                    `⏱ ${participant.name}: ${effect.text}`

                );


                effect.turnsLeft -=
                    1;


                if (
                    effect.turnsLeft > 0
                ) {

                    remaining.push(
                        effect
                    );

                }

            }
        );


    participant.effects.timedTurnEffects =
        remaining;

}


/* =========================================================
   119. ФІНАНСОВІ МОДИФІКАТОРИ
========================================================= */

function addFinancialModifier(
    participant,
    modifier
) {

    if (
        !Array.isArray(
            participant.effects.financialModifiers
        )
    ) {

        participant.effects.financialModifiers =
            [];

    }


    participant
        .effects
        .financialModifiers
        .push({

            periodsLeft:
                modifier.periods,

            amount:
                modifier.amount,

            text:
                modifier.text ||
                "Фінансовий ефект"

        });

}


/* =========================================================
   120. ЗАСТОСУВАННЯ ФІНАНСОВИХ
   МОДИФІКАТОРІВ
========================================================= */

function getFinancialModifiersTotal(
    participant
) {

    if (
        !Array.isArray(
            participant.effects.financialModifiers
        )
    ) {

        return 0;

    }


    let total =
        0;


    const remaining = [];


    participant
        .effects
        .financialModifiers
        .forEach(
            modifier => {

                total +=
                    Number(
                        modifier.amount
                    ) || 0;


                modifier.periodsLeft -=
                    1;


                if (
                    modifier.periodsLeft > 0
                ) {

                    remaining.push(
                        modifier
                    );

                }

            }
        );


    participant.effects.financialModifiers =
        remaining;


    return total;

}


/* =========================================================
   121. ОНОВЛЕНА ФІНАНСОВА ВИПЛАТА

   ЗАМІНЮЄ processPlayerFinancialPeriod()
   З 5А.

   Тепер враховує:
   - зарплату;
   - регулярний дохід;
   - тимчасові фінансові ефекти.
========================================================= */

function processPlayerFinancialPeriod() {

    const player =
        gameState.player;


    player.financialPeriods +=
        1;


    gameState.financialPeriod =
        player.financialPeriods;


    const salary =
        Number(
            player.salary
        ) || 0;


    const passiveIncome =
        Number(
            player.passiveIncome
        ) || 0;


    const modifiers =
        getFinancialModifiersTotal(
            player
        );


    const total =
        salary +
        passiveIncome +
        modifiers;


    player.money +=
        total;


    player.totalSalaryReceived +=
        salary;


    player.totalPassiveIncomeReceived +=
        passiveIncome;


    addLog(

        `💰 Фінансовий період ${player.financialPeriods}: ${total >= 0 ? "+" : ""}${formatMoney(total)} грн`

    );


    const profession =
        getProfessionName(

            player
                .sector
                .levels[
                    player.careerLevel
                ],

            player.gender

        );


    queueGameNotice({

        type:
            "salary",

        salary:
            salary + modifiers,

        passiveIncome,

        careerLevel:
            getDisplayedCareerLevel(
                player
            ),

        profession

    });


    updatePlayerStatsUI();

}


/* =========================================================
   122. ОНОВЛЕНА ФІНАНСОВА ВИПЛАТА AI
========================================================= */

function processAIFinancialPeriodIfNeeded(
    ai
) {

    if (
        ai.turnsCompleted === 0
        ||
        ai.turnsCompleted %
            GAME_CONFIG.financialPeriodTurns
        !==
        0
    ) {

        return;

    }


    ai.financialPeriods +=
        1;


    const salary =
        Number(
            ai.salary
        ) || 0;


    const passive =
        Number(
            ai.passiveIncome
        ) || 0;


    const modifiers =
        getFinancialModifiersTotal(
            ai
        );


    ai.money +=
        salary +
        passive +
        modifiers;


    ai.totalSalaryReceived +=
        salary;


    ai.totalPassiveIncomeReceived +=
        passive;


    addLog(

        `💰 ${ai.name}: фінансовий період ${ai.financialPeriods}`

    );

}


/* =========================================================
   123. ОНОВЛЕНА preparePlayerTurn()

   ДОДАЄ:
   - тимчасові ефекти;
   - pending Fate.
========================================================= */

async function preparePlayerTurn() {

    ensureGameRuntimeState();


    const player =
        gameState.player;


    if (
        gameState.runtime.gameFinished
    ) {

        return;

    }


    /* =====================================================
       СІМЕЙНЕ ВОГНИЩЕ
    ===================================================== */

    if (
        player.effects.familyHearth
        &&
        player.energy < 70
    ) {

        player.energy =
            70;

    }


    /* =====================================================
       ПОСТІЙНА ЕНЕРГІЯ
    ===================================================== */

    if (
        player.effects.energyPerTurn
    ) {

        applyEffects(

            player,

            {
                energy:
                    player.effects.energyPerTurn
            }

        );

    }


    /* =====================================================
       ПОСТІЙНИЙ ДОХІД КОЖНОГО ХОДУ
    ===================================================== */

    if (
        player.effects.incomePerTurn
    ) {

        player.money +=
            player.effects.incomePerTurn;


        player.totalPassiveIncomeReceived +=
            player.effects.incomePerTurn;


        addLog(

            `💰 Регулярний дохід: +${formatMoney(player.effects.incomePerTurn)} грн`

        );

    }


    /* =====================================================
       ТИМЧАСОВІ ЕФЕКТИ
    ===================================================== */

    processTimedTurnEffects(
        player
    );


    /* =====================================================
       ВІДКЛАДЕНІ ЕФЕКТИ
    ===================================================== */

    processDelayedEffectsAdvanced(
        player
    );


    /* =====================================================
       ПЕРЕХІД НА OUTER
    ===================================================== */

    if (
        player.pendingOuterTransition
    ) {

        await moveParticipantToOuterStart(
            player
        );

    }


    clampPlayerResources(
        player
    );


    updatePlayerStatsUI();

}


/* =========================================================
   124. РОЗШИРЕНІ ВІДКЛАДЕНІ ЕФЕКТИ

   Підтримує не тільки effects,
   а й specialAction.
========================================================= */

function processDelayedEffectsAdvanced(
    participant
) {

    if (
        !Array.isArray(
            participant.effects.delayedPayments
        )
    ) {

        return;

    }


    const remaining = [];


    participant
        .effects
        .delayedPayments
        .forEach(
            item => {

                item.turnsLeft -=
                    1;


                if (
                    item.turnsLeft <= 0
                ) {

                    applyEffects(

                        participant,

                        item.effects ||
                        {}

                    );


                    if (
                        item.specialAction
                    ) {

                        applyCardSpecialAction(

                            participant,

                            item.specialAction

                        );

                    }


                    if (
                        participant.id ===
                        "player"
                    ) {

                        queueGameNotice({

                            type:
                                "delayed",

                            text:
                                item.text ||
                                "Спрацював відкладений ефект",

                            effects:
                                item.effects ||
                                {}

                        });

                    }


                    addLog(

                        `⏳ ${participant.name}: ${item.text || "відкладений ефект"}`

                    );

                }

                else {

                    remaining.push(
                        item
                    );

                }

            }
        );


    participant.effects.delayedPayments =
        remaining;

}


/* =========================================================
   125. ОНОВЛЕНА addDelayedEffect()

   Зберігає specialAction.
========================================================= */

function addDelayedEffect(
    participant,
    delayedEffect
) {

    if (
        !Array.isArray(
            participant.effects.delayedPayments
        )
    ) {

        participant.effects.delayedPayments =
            [];

    }


    participant
        .effects
        .delayedPayments
        .push({

            turnsLeft:
                delayedEffect.turns,

            effects:
                delayedEffect.effects ||
                {},

            specialAction:
                delayedEffect.specialAction ||
                null,

            text:
                delayedEffect.text ||
                "Відкладений ефект"

        });

}


/* =========================================================
   126. ФІНАЛЬНА ПЕРЕВІРКА ДОЛІ

   Якщо картка Події дала
   "отримай картку Доля",
   вона відкривається
   перед наступним ходом.
========================================================= */

function resolvePendingFateCard() {

    const player =
        gameState.player;


    if (
        !player.effects.pendingFateCard
    ) {

        return false;

    }


    player.effects.pendingFateCard =
        false;


    const deck =
        OUTER_CARD_DECKS.fate;


    if (
        !deck ||
        deck.length === 0
    ) {

        return false;

    }


    const card =
        randomItem(
            deck
        );


    resolveFateCard(
        card
    );


    return true;

}


/* =========================================================
   127. РУЧНЕ ЗАВЕРШЕННЯ ГРИ

   Кнопка справа
   "Завершити гру".
========================================================= */

function showFinishGameModal() {

    const player =
        gameState.player;


    openGameInfoModal(`

        <div class="finish-game-modal">

            <div class="cycle-notice-icon">
                ⏹
            </div>


            <h2>
                Завершити гру?
            </h2>


            <p>

                Поточний прогрес:

            </p>


            <div class="finish-game-stats">

                <span>
                    🎲 Ходів:
                    <strong>
                        ${player.turnsCompleted || 0}
                    </strong>
                </span>

                <span>
                    💰 Гроші:
                    <strong>
                        ${formatMoney(player.money)} грн
                    </strong>
                </span>

                <span>
                    🏆 Кар'єрний рівень:
                    <strong>
                        ${getDisplayedCareerLevel(player)}
                    </strong>
                </span>

                <span>
                    ✨ Мрія:
                    <strong>
                        ${player.dream.name}
                    </strong>
                </span>

            </div>


            <button
                id="confirmFinishGameButton"
                class="main-game-btn"
            >
                ТАК, ЗАВЕРШИТИ
            </button>


            <button
                id="cancelFinishGameButton"
                class="secondary-game-btn"
            >
                ПРОДОВЖИТИ ГРУ
            </button>

        </div>

    `);


    document
        .getElementById(
            "confirmFinishGameButton"
        )
        .addEventListener(
            "click",
            () => {

                gameState.runtime.gameFinished =
                    true;


                showFinalGameResults();

            }
        );


    document
        .getElementById(
            "cancelFinishGameButton"
        )
        .addEventListener(
            "click",
            closeGameInfoModal
        );

}


/* =========================================================
   128. ПЕРШИЙ ЗАПУСК ЦИКЛУ

   showGameBoard() вже створює поле.
   Ця функція тільки гарантує,
   що службові лічильники існують.
========================================================= */
/* ===========================
function initializeGameCycle() {

    ensureGameRuntimeState();


    updatePlayerStatsUI();


    gameState.currentTurn =
        "player";

}
======== */

/* =========================================================
   КІНЕЦЬ ЧАСТИНИ 5Б

   ПІСЛЯ ЦЬОГО У НАС Є:

   ✅ хід гравця
   ✅ хід двох AI
   ✅ зарплата кожні 3 власні ходи
   ✅ зарплата за поточним рівнем
   ✅ регулярний дохід
   ✅ відкладені виплати
   ✅ тимчасові витрати
   ✅ кар'єрне зростання
   ✅ нова зарплата після підвищення
   ✅ повідомлення про підвищення
   ✅ мале → велике коло
   ✅ Lounge
   ✅ Academy
   ✅ Подія
   ✅ Життя
   ✅ Доля
   ✅ Мрія
   ✅ фінальний екран
   ✅ ручне завершення гри
   ✅ AI більше не перестрибує
      автоматично з 28 на outer

   БАНК ПОКИ НЕ ЧІПАЄМО.
========================================================= */
/* =========================================================
   129. ТЕХНІЧНЕ З'ЄДНАННЯ ГРИ

   Цей блок ставимо В КІНЦІ script.js
   перед останнім:

   showStartScreen();

   Він з'єднує:
   - рух;
   - картки;
   - завершення ходу;
   - AI;
   - зарплату;
   - кар'єру;
   - Долю;
   - Мрію.
========================================================= */


/* =========================================================
   130. БЕЗПЕЧНИЙ effectsHTML

   Показує тільки основні ресурси.
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


    return Object
        .entries(
            effects
        )
        .filter(
            ([key, value]) =>

                icons[key]
                &&
                typeof value ===
                    "number"
                &&
                value !== 0
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

                    ${
                        key === "money"

                        ? `${formatMoney(value)} грн`

                        : value
                    }

                </span>

            `
        )
        .join("");

}


/* =========================================================
   131. ОНОВЛЕННЯ HUD ТА КАРТОК AI
========================================================= */

function updateAIPlayersUI() {

    const list =
        document.querySelector(".mini-opponents-list");

    if (!list) {
        return;
    }

    list.replaceChildren();

    list.style.cssText =
        "display:grid;" +
        "gap:4px;" +
        "margin:0;" +
        "padding:0;";

    const opponents =
        Array.isArray(gameState.opponents)
            ? gameState.opponents
            : [];

    for (const ai of opponents) {

        if (!ai) {
            continue;
        }

        const button =
            document.createElement("button");

        button.type = "button";
        button.dataset.playerId = ai.id;

        button.style.cssText =
            "display:flex;" +
            "align-items:center;" +
            "justify-content:space-between;" +
            "width:100%;" +
            "min-height:0;" +
            "margin:0;" +
            "padding:6px 0;" +
            "border:0;" +
            "border-radius:0;" +
            "background:transparent;" +
            "box-shadow:none;" +
            "color:inherit;" +
            "font:inherit;" +
            "font-size:14px;" +
            "font-weight:600;" +
            "text-align:left;" +
            "cursor:pointer;";

        const name =
            document.createElement("span");

        name.textContent =
            ai.name || "Гравець";

        const arrow =
            document.createElement("span");

        arrow.textContent = "→";
        arrow.setAttribute("aria-hidden", "true");

        button.append(name, arrow);

        button.addEventListener("click", () => {
            showParticipantInfo(ai.id);
        });

        list.append(button);
    }
}


function updatePlayerStatsUI() {

    const player =
        gameState.player;

    if (!player) {
        return;
    }

    clampPlayerResources(player);

    const fields = {

        moneyValue:
            formatMoney(player.money),

        reputationValue:
            player.reputation,

        knowledgeValue:
            player.knowledge,

        energyValue:
            player.energy

    };

    for (const [id, value] of Object.entries(fields)) {

        const element =
            document.getElementById(id);

        if (element) {
            element.textContent = value;
        }
    }

    updateCareerHUD(player);

    updateAIPlayersUI();
}


/* =========================================================
   ОНОВЛЕННЯ ПІСЛЯ ОПЕРАЦІЙ БАНКУ
========================================================= */

function updateGameUI() {

    updatePlayerStatsUI();

}
/* =========================================================
   131.1. СЛОВНИЧОК ГРИ

   Фінансові терміни, кар'єра та бізнес.
   Пошук за назвою або поясненням.
========================================================= */

function showGameGlossary(returnTerms = false) {


    const terms = [

        [
            "3D Secure",
            "Додаткова перевірка під час оплати карткою в інтернеті. Банк може попросити підтвердити покупку кодом або в застосунку."
        ],

        [
            "Apple Pay",
            "Спосіб оплачувати покупки сумісним пристроєм Apple, використовуючи додану до цифрового гаманця банківську картку."
        ],

        [
            "Google Pay",
            "Спосіб оплачувати покупки за допомогою цифрового гаманця Google та доданої банківської картки."
        ],

        [
            "MyRaif",
            "Мобільний застосунок Райффайзен Банку для керування рахунками, перегляду балансу, переказів та інших банківських операцій."
        ],

        [
            "POS-термінал",
            "Пристрій, через який продавець приймає оплату банківською карткою або сумісним телефоном."
        ],

        [
            "Акції",
            "Цінні папери, які представляють частку власності в компанії. Їхня вартість може зростати або знижуватися; виплати дивідендів не гарантовані."
        ],

        [
            "Антикризова команда",
            "Команда, яка допомагає вирішувати складні проблеми та виходити з кризової ситуації."
        ],

        [
            "Бізнес",
            "Діяльність зі створення та продажу товарів або послуг з метою отримання доходу."
        ],

        [
            "Біржовий фонд (ETF)",
            "Фонд, частки якого продаються на біржі. Він може об'єднувати багато активів, наприклад акції різних компаній. Розподіл вкладень зменшує залежність від одного активу, але не усуває ризик збитків."
        ],

        [
            "Дебетова картка",
            "Банківська картка для використання власних грошей на рахунку. Кредитні можливості, якщо вони є, визначаються окремими умовами."
        ],

        [
            "Депозит (вклад)",
            "Гроші, розміщені в банку на погоджених умовах. Строк, дохід, можливість поповнення та зняття залежать від виду депозиту."
        ],

        [
            "Депозитна лінія",
            "Формат розміщення вільних коштів бізнесу в банку. Поповнення, зняття та нарахування відсотків визначаються умовами договору."
        ],

        [
            "Дивіденди",
            "Частина прибутку компанії, яку за рішенням про виплату можуть отримати її акціонери."
        ],

        [
            "Еквайринг",
            "Послуга, яка дозволяє бізнесу приймати безготівкову оплату банківськими картками, наприклад через термінал."
        ],

        [
            "Зелена картка",
            "Міжнародне страхування відповідальності водія. За умовами страхування воно покриває шкоду, завдану іншим учасникам дорожнього руху під час поїздки за кордон."
        ],

        [
            "Інвестор",
            "Людина або організація, яка вкладає кошти в актив чи проєкт, очікуючи майбутнього доходу та приймаючи пов'язані ризики."
        ],

        [
            "Інвестувати кошти",
            "Вкладати гроші з метою отримання майбутнього доходу. Результат інвестиції може відрізнятися від очікуваного."
        ],

        [
            "Інновації",
            "Нові або вдосконалені ідеї, технології, продукти чи способи роботи."
        ],

        [
            "Інноваційний проєкт",
            "Проєкт, у якому використовують нову ідею, технологію або спосіб вирішення проблеми."
        ],

        [
            "Інтеграція",
            "Поєднання систем, процесів або ресурсів, щоб вони працювали разом."
        ],

        [
            "Інтернет-еквайринг",
            "Послуга для приймання оплати банківськими картками на сайті, в онлайн-магазині або іншому цифровому сервісі."
        ],

        [
            "Ключовий клієнт",
            "Важливий для бізнесу клієнт, який приносить значний дохід або має стратегічне значення."
        ],

        [
            "Компанія",
            "Організація, яка об'єднує людей і ресурси для певної діяльності, зокрема виробництва товарів або надання послуг."
        ],

        [
            "Крафтові товари",
            "Авторські товари, які виготовляють вручну або невеликими партіями."
        ],

        [
            "Кредит",
            "Гроші, які кредитор надає в борг. Їх потрібно повернути відповідно до договору та сплатити передбачені ним відсотки й інші платежі."
        ],

        [
            "Кредитна картка",
            "Картка, яка дозволяє використовувати гроші банку в межах кредитного ліміту. Використані кошти потрібно повертати за умовами договору."
        ],

        [
            "Ліквідація компанії",
            "Процес припинення компанії, під час якого врегульовують її зобов'язання та завершують діяльність."
        ],

        [
            "Мікрогрант",
            "Фінансова підтримка для започаткування або розвитку справи. Використовувати її потрібно за умовами програми."
        ],

        [
            "Монетизація експертизи",
            "Отримання доходу завдяки власним знанням і навичкам, наприклад через консультації або навчання."
        ],

        [
            "ОВДП",
            "Облігації внутрішньої державної позики. Купуючи їх, інвестор позичає гроші державі, яка має повернути кошти та виплатити передбачений умовами дохід."
        ],

        [
            "Овердрафт",
            "Кредитний ліміт на банківському рахунку, який дозволяє провести платіж, коли власних коштів недостатньо. Використану суму потрібно погасити."
        ],

        [
            "Підприємець",
            "Людина, яка організовує власну справу та бере на себе відповідальність за її роботу й результати."
        ],

        [
            "Поліс",
            "Документ, що підтверджує страхування. У ньому та умовах договору визначено, що саме захищено й за яких обставин можлива виплата."
        ],

        [
            "Преміум-клієнт",
            "Клієнт, який користується преміальним банківським обслуговуванням. Послуги, вимоги та вартість залежать від обраного пакета."
        ],

        [
            "Рахунок (банківський рахунок)",
            "Рахунок у банку для зберігання коштів, отримання платежів та проведення інших операцій. До нього може бути прив'язана банківська картка."
        ],

        [
            "Реінвестувати капітал",
            "Повторно вкладати отриманий дохід або накопичені кошти для подальшого розвитку."
        ],

        [
            "Річний баланс",
            "Звіт про активи, зобов'язання та власний капітал на визначену дату наприкінці звітного року."
        ],

        [
            "Синергія ресурсів",
            "Поєднання ресурсів, завдяки якому спільна робота дає більший результат."
        ],

        [
            "Стати ментором",
            "Передавати власний досвід, давати поради та допомагати іншій людині розвиватися."
        ],

        [
            "Страхування",
            "Фінансовий захист від визначених договором ризиків. Страхові внески та можливі виплати залежать від умов страхування."
        ],

        [
            "Тайм-менеджмент",
            "Планування та організація власного часу для виконання завдань і відпочинку."
        ],

        [
            "Фізична особа",
            "Людина як учасник правових відносин."
        ],

        [
            "Фінансовий рік",
            "Звітний період, за який підбивають фінансові підсумки діяльності."
        ],

        [
            "ФОП",
            "Фізична особа — підприємець. Людина, яка зареєструвала підприємницьку діяльність і веде власну справу."
        ],

        [
            "Франшиза",
            "У бізнесі — право працювати за моделлю та брендом іншої компанії на погоджених умовах. У страхуванні — частина збитку, яку за договором не відшкодовує страховик."
        ],

        [
            "Хедхантер",
            "Фахівець, який шукає та залучає потрібних працівників для компаній."
        ],

        [
            "Шахрайські операції",
            "Дії, спрямовані на незаконне отримання грошей або даних через обман, наприклад підроблені повідомлення чи сайти."
        ],

        [
            "Юридична особа",
            "Організація, яка має власні права та обов'язки й діє як окремий учасник правових відносин."
        ]

    ];

      // Повертаємо пояснення для підказок у картках.
    if (returnTerms === true) {
        return terms;
    }


    terms.sort((first, second) => {
        return first[0].localeCompare(second[0], "uk");
    });

    openGameInfoModal(`

        <div class="glossary-modal">

            <div class="cycle-notice-icon">
                📖
            </div>

            <h2>
                Словничок
            </h2>

            <p>
                Фінанси, кар'єра та бізнес простими словами.
            </p>

            <label
                for="glossarySearch"
                style="display:block;margin-bottom:8px;"
            >
                Знайти термін
            </label>

            <input
                id="glossarySearch"
                type="search"
                placeholder="Наприклад: депозит, ФОП, ментор"
                style="
                    display:block;
                    width:100%;
                    box-sizing:border-box;
                    padding:12px;
                    margin-bottom:16px;
                    border:1px solid #cccccc;
                    border-radius:12px;
                    font:inherit;
                "
            >

            <div
                id="glossaryResults"
                style="display:grid;gap:12px;"
            ></div>

            <button
                id="closeGlossaryButton"
                class="main-game-btn"
                type="button"
                style="margin-top:20px;"
            >
                ПРОДОВЖИТИ ГРУ
            </button>

        </div>

    `);

    const search =
        document.getElementById("glossarySearch");

    const results =
        document.getElementById("glossaryResults");

    if (!search || !results) {
        return;
    }

    function renderTerms() {

        const query =
            search.value
                .trim()
                .toLocaleLowerCase("uk");

        const matchingTerms =
            terms.filter(([name, explanation]) => {

                const text =
                    `${name} ${explanation}`
                        .toLocaleLowerCase("uk");

                return text.includes(query);
            });

        results.replaceChildren();

        for (const [name, explanation] of matchingTerms) {

            const item =
                document.createElement("div");

            item.style.cssText =
                "padding:14px;" +
                "border:1px solid #dddddd;" +
                "border-radius:12px;" +
                "text-align:left;";

            const title =
                document.createElement("strong");

            title.textContent = name;

            const description =
                document.createElement("p");

            description.textContent = explanation;

            description.style.cssText =
                "margin:8px 0 0;" +
                "line-height:1.5;";

            item.append(title, description);

            results.append(item);
        }

        if (!matchingTerms.length) {

            const message =
                document.createElement("p");

            message.textContent =
                "Нічого не знайдено. Спробуй інше слово.";

            results.append(message);
        }
    }

    search.addEventListener("input", renderTerms);

    document
        .getElementById("closeGlossaryButton")
        ?.addEventListener(
            "click",
            closeGameInfoModal
        );

    renderTerms();

}
   // Повертаємо пояснення для підказок у картках.
    if (returnTerms === true) {
        return terms;
    }

/* =========================================================
   132. ТИПИ ПОЛІВ

   ВАЖЛИВО:
   старого CELL_TYPES.income
   більше немає.

   Тепер є START.
========================================================= */

function showAllCellTypes() {

    const typeIds = [

        "start",
        "bank",
        "event",
        "life",
        "fate",
        "lounge",
        "academy",
        "transition",
        "dreamCheck"

    ];


    const types =
        typeIds

            .map(
                id =>
                    CELL_TYPES[id]
            )

            .filter(
                Boolean
            );


    const rows =
        types

            .map(
                type => `

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

                `
            )

            .join("");


    openGameInfoModal(`

        <div class="all-cell-types-popup">

            <h2>
                Поля гри
            </h2>


            <p>

                Кожен тип поля запускає
                окрему життєву,
                кар'єрну або
                фінансову ситуацію.

            </p>


            <div class="all-cell-types-list">

                ${rows}

            </div>

        </div>

    `);

}


/* =========================================================
   133. ДРУГИЙ КИДОК ДЛЯ КАРТКИ

   Поки залишаємо цифровий вибір
   номера по всій колоді,
   щоб у тесті були доступні
   ВСІ картки.

   Пізніше можемо окремо
   узгодити фізичну механіку d6.
========================================================= */

async function rollForCardNumber(
    deckName,
    deck
) {

    if (
        !Array.isArray(deck)
        ||
        deck.length === 0
    ) {

        return;

    }


    const button =
        document.getElementById(
            "secondCardRollButton"
        );


    const display =
        document.getElementById(
            "secondCardDice"
        );


    if (button) {

        button.disabled =
            true;

    }


    for (
        let i = 0;
        i < 9;
        i++
    ) {

        const temp =
            randomNumber(
                1,
                deck.length
            );


        if (display) {

            display.textContent =
                temp;

        }


        await delay(
            65
        );

    }


    const index =
        randomNumber(
            0,
            deck.length - 1
        );


    const card =
        deck[index];


    if (display) {

        display.textContent =
            card.number ||
            index + 1;

    }


    await delay(
        350
    );


    addLog(

        `${CELL_TYPES[deckName]?.icon || "🎴"} ${
            CELL_TYPES[deckName]?.name || deckName
        }: картка №${card.number || index + 1}`

    );


    /* =====================================================
       ДОЛЯ — БЕЗ ВИБОРУ
    ===================================================== */

    if (
        deckName ===
        "fate"
    ) {

        resolveFateCard(
            card
        );


        return;

    }


    /* =====================================================
       ПОДІЯ / ЖИТТЯ / БАНК
    ===================================================== */

    showDecisionCard(

        deckName,

        card

    );

}


/* =========================================================
   134. START CARD TURN

   ЄДИНА ТОЧКА ВХОДУ
   В УСІ КАРТКИ.
========================================================= */

function startCardTurn(
    deckName
) {

    const player =
        gameState.player;


    const deck =
        getDeckForParticipant(

            player,

            deckName

        );


    /* =====================================================
       БАНК ЩЕ НЕ ПІДКЛЮЧЕНИЙ

       Щоб гра НЕ зависала,
       хід можна завершити.
    ===================================================== */

    if (
        !deck ||
        deck.length === 0
    ) {

        openGameInfoModal(`

            <div class="decision-card-modal">

                <div class="cycle-notice-icon">

                    ${
                        CELL_TYPES[deckName]?.icon ||
                        "🏦"
                    }

                </div>


                <h2>

                    ${
                        CELL_TYPES[deckName]?.name ||
                        "Картка"
                    }

                </h2>


                <p>

                    Цей блок ще буде
                    підключений на наступному етапі.

                </p>


                <button
                    id="finishEmptyDeckTurnButton"
                    class="main-game-btn"
                >
                    ЗАВЕРШИТИ ХІД
                </button>

            </div>

        `);


        document
            .getElementById(
                "finishEmptyDeckTurnButton"
            )
            .addEventListener(
                "click",
                finishPlayerCardTurn
            );


        return;

    }


    showSecondCardRoll(

        deckName,

        deck

    );

}


/* =========================================================
   135. КАРТКА ЖИТТЯ

   В оновлених правилах
   відмовитися від Життя НЕ МОЖНА.

   Тому кнопки "відмовитись"
   не додаємо.
========================================================= */


/* =========================================================
   136. PROMOTION HELPER

   Використовується для карток,
   які прямо дають
   професійне підвищення.
========================================================= */

function promoteParticipantToLevel(
    participant,
    targetLevel
) {

    if (
        !participant ||
        !participant.sector
    ) {

        return false;

    }


    const maxLevel =
        participant
            .sector
            .levels
            .length - 1;


    const safeTarget =
        Math.min(
            targetLevel,
            maxLevel
        );


    if (
        safeTarget <=
        participant.careerLevel
    ) {

        return false;

    }


    const oldLevel =
        participant.careerLevel;


    const oldProfession =
        getProfessionName(

            participant
                .sector
                .levels[
                    oldLevel
                ],

            participant.gender

        );


    participant.careerLevel =
        safeTarget;


    const stats =
        getCareerStats(

            participant.sector.id,

            safeTarget + 1

        );


    participant.salary =
        stats.salary;


    const newProfession =
        getProfessionName(

            participant
                .sector
                .levels[
                    safeTarget
                ],

            participant.gender

        );


    addLog(

        `🎉 ${participant.name}: ${oldProfession} → ${newProfession}`

    );


    if (
        participant.board ===
            "inner"
        &&
        participant.innerLaps >=
            1
        &&
        participant.careerLevel >=
            GAME_CONFIG
                .outerUnlockCareerLevel
    ) {

        participant.pendingOuterTransition =
            true;

    }


    if (
        participant.id ===
        "player"
    ) {

        queueGameNotice({

            type:
                "career",

            oldProfession,

            newProfession,

            level:
                safeTarget + 1,

            salary:
                stats.salary

        });


        updateCareerHUD(
            participant
        );

    }


    return true;

}


/* =========================================================
   137. SPECIAL ACTIONS WRAPPER

   Перехоплюємо кар'єрні дії,
   щоб вони теж давали
   модалку "Нова сходинка".
========================================================= */

function applyAllSpecialActions(
    participant,
    source
) {

    if (!source) {

        return;

    }


    const actions = [];


    if (
        source.specialAction
    ) {

        actions.push(
            source.specialAction
        );

    }


    if (
        Array.isArray(
            source.specialActions
        )
    ) {

        actions.push(
            ...source.specialActions
        );

    }


    actions.forEach(
        action => {


            /* =================================================
               ПРЯМИЙ ПЕРЕХІД НА РІВЕНЬ 2
            ================================================= */

            if (
                action ===
                "promoteToLevel2"
            ) {

                promoteParticipantToLevel(

                    participant,

                    1

                );


                return;

            }


            /* =================================================
               ПІДВИЩЕННЯ НА НАСТУПНИЙ
               РІВЕНЬ, ЯКЩО ВИСТАЧАЄ
               РЕСУРСІВ
            ================================================= */

            if (
                action ===
                "promoteOneLevelIfReady"
            ) {

                checkCareerProgress(
                    participant
                );


                return;

            }


            applyCardSpecialAction(

                participant,

                action

            );

        }
    );

}


/* =========================================================
   138. ПЕРЕВІРКА КАРТКИ ЖИТТЯ /
   ПОДІЇ / БАНКУ

   Ця версія:
   - перевіряє ресурси;
   - банківські умови;
   - не дає зіграти недоступний варіант;
   - не зависає, якщо варіантів немає.
========================================================= */
/* =========================================================
   138. КАРТКА ПОДІЇ / ЖИТТЯ
   ПОКАЗ У ПРАВІЙ ПАНЕЛІ

   ПОДІЯ:
   - можна зіграти;
   - можна не брати картку.

   ЖИТТЯ:
   - відмовитися не можна;
   - потрібно обрати доступне рішення.

   БАНК:
   - окремо доробимо пізніше.
========================================================= */

function showDecisionCard(
    deckName,
    card
) {

    const player =
        gameState.player;


    const panel =
        document.getElementById(
            "currentCardPanel"
        );


    /*
       На випадок, якщо стара модалка
       ще залишилась відкритою.
    */

    closeGameInfoModal();


    if (
        !card ||
        !panel
    ) {

        finishPlayerCardTurn();

        return;

    }


    const type =
        CELL_TYPES[
            deckName
        ] || {};


    const isEvent =
        deckName === "event";


    const isLife =
        deckName === "life";


    const requirementCheck =
        checkFullCardRequirements(
            player,
            card
        );

/* =====================================================
   БАНКІВСЬКА КАРТКА
===================================================== */

if (
    deckName === "bank"
) {

    showBankCard(
        card
    );

    return;

}

    /* =====================================================
       КАРТКА ВЗАГАЛІ НЕДОСТУПНА
    ===================================================== */

    if (
        !requirementCheck.passed
    ) {

        panel.innerHTML = `

            <div class="revealed-current-card">

                <div class="decision-card-number">
                    Картка №${card.number}
                </div>


                <div class="revealed-card-type">

                    ${type.icon || "🎴"}

                    ${type.name || ""}

                </div>


                <h3>
                    ${card.title}
                </h3>


                <p class="decision-card-text">
                    ${card.story || ""}
                </p>


                <div class="card-requirement-warning">

                    <strong>
                        ⚠️ Умови не виконані
                    </strong>

                    <br><br>

                    ${
                        requirementCheck
                            .failed
                            .join("<br>")
                    }

                </div>


               <button
    id="finishUnavailableCardButton"
    class="side-card-finish-btn"
>
    ПРОПУСТИТИ КАРТКУ І ЗАВЕРШИТИ ХІД
</button>


            </div>

        `;


        panel
            .querySelector(
                "#finishUnavailableCardButton"
            )
            ?.addEventListener(
                "click",
                finishPlayerCardTurn
            );


        return;

    }


    const availableChoices =
        card.choices || [];


    /* =====================================================
       ЯКЩО В КАРТЦІ НЕМАЄ ВАРІАНТІВ
    ===================================================== */

    if (
        availableChoices.length === 0
    ) {

        panel.innerHTML = `

            <div class="revealed-current-card">

                <div class="decision-card-number">
                    Картка №${card.number}
                </div>


                <div class="revealed-card-type">

                    ${type.icon || "🎴"}

                    ${type.name || ""}

                </div>


                <h3>
                    ${card.title}
                </h3>


                <p class="decision-card-text">
                    ${card.story || ""}
                </p>


                <button
                    id="finishNoChoiceCardButton"
                    class="main-game-btn finish-turn-btn"
                >
                    ПРОДОВЖИТИ
                </button>

            </div>

        `;


        panel
            .querySelector(
                "#finishNoChoiceCardButton"
            )
            ?.addEventListener(
                "click",
                finishPlayerCardTurn
            );


        return;

    }


    /* =====================================================
       ВАРІАНТИ РІШЕННЯ
    ===================================================== */

    const choicesHTML =
        availableChoices

            .map(
                (
                    choice,
                    index
                ) => {


                    const minimumCheck =
                        checkCardRequirements(
                            player,
                            choice.minimum || {}
                        );


                    const productAllowed =
                        !choice.conditionProduct
                        ||
                        hasBankProduct(
                            player,
                            choice.conditionProduct
                        );


                    const disabled =
                        !minimumCheck.passed
                        ||
                        !productAllowed;


                    return `

                        <button
                            class="
                                card-decision-button
                                ${
                                    disabled
                                        ? "card-decision-disabled"
                                        : ""
                                }
                            "
                            data-choice-index="${index}"
                            ${
                                disabled
                                    ? "disabled"
                                    : ""
                            }
                        >

                            <strong>
                                ${choice.title}
                            </strong>


                            <span class="card-decision-cost">

                                ${
                                    choice.costText
                                    || "Без витрат"
                                }

                            </span>


                            <span class="card-decision-result">

                                ${
                                    choice.resultText
                                    || ""
                                }

                            </span>

                        </button>

                    `;

                }
            )

            .join("");


    /* =====================================================
       КНОПКА ВІДМОВИ

       ТІЛЬКИ ДЛЯ ПОДІЇ.
       ДЛЯ ЖИТТЯ ЇЇ НЕМАЄ.
    ===================================================== */

    const declineHTML =
        isEvent

            ? `

                <button
                    id="declineEventCardButton"
                    class="
                        secondary-game-btn
                        finish-turn-btn
                    "
                >
                    НЕ БРАТИ КАРТКУ
                </button>

              `

            : "";


    /* =====================================================
       МАЛЮЄМО КАРТКУ СПРАВА
    ===================================================== */

    panel.innerHTML = `

        <div class="revealed-current-card">

            <div class="decision-card-number">

                Картка №${card.number}

            </div>


            <div class="revealed-card-type">

                ${type.icon || "🎴"}

                ${type.name || ""}

            </div>


            <h3>

                ${card.title}

            </h3>


            <p class="decision-card-text">

                ${card.story || ""}

            </p>


            ${
                card.requirementText

                    ? `

                        <div class="decision-card-requirement">

                            <strong>
                                🎯 Умова:
                            </strong>

                            ${card.requirementText}

                        </div>

                      `

                    : ""
            }


            ${
                card.bankRequirement

                    ? `

                        <div class="decision-card-bank-requirement">

                            <strong>
                                🏦 Банківська умова:
                            </strong>

                            ${card.bankRequirement.text}

                        </div>

                      `

                    : ""
            }


            ${
                card.taskText

                    ? `

                        <div class="decision-card-task">

                            ${card.taskText}

                        </div>

                      `

                    : ""
            }


            ${
                card.cooperationText

                    ? `

                        <div class="decision-card-task">

                            ${card.cooperationText}

                        </div>

                      `

                    : ""
            }


            ${
                isLife

                    ? `

                        <div class="decision-card-task">

                            ❤️ Це картка Життя.
                            Обери одне з доступних рішень.

                        </div>

                      `

                    : ""
            }


            <div class="card-decisions-list">

                ${choicesHTML}

            </div>


            ${declineHTML}

        </div>

    `;


    /* =====================================================
       КЛІК ПО ВАРІАНТУ
    ===================================================== */

    panel
        .querySelectorAll(
            ".card-decision-button"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {


                        const index =
                            Number(
                                button.dataset.choiceIndex
                            );


                        const choice =
                            availableChoices[
                                index
                            ];


                        if (!choice) {

                            return;

                        }


                        resolveCardChoice(
                            deckName,
                            card,
                            choice
                        );

                    }
                );

            }
        );


    /* =====================================================
       ВІДМОВА ВІД ПОДІЇ
    ===================================================== */

    if (isEvent) {

        panel
            .querySelector(
                "#declineEventCardButton"
            )
            ?.addEventListener(
                "click",
                () => {


                    addLog(
                        `🎴 ${player.name}: не бере картку «${card.title}».`
                    );


                    showRaifikCurrentCardMessage(
                        "Картку Події пропущено. Хід завершено."
                    );


                    setTimeout(
                        finishPlayerCardTurn,
                        500
                    );

                }
            );

    }

}

/* =========================================================
   139. ДОЛЯ

   Доля завжди спрацьовує
   автоматично.
========================================================= */

function resolveFateCard(
    card
) {

    const player =
        gameState.player;


    if (!card) {

        finishPlayerCardTurn();

        return;

    }


    let finalEffects = {

        ...(card.effects || {})

    };


    let protectionMessage =
        "";


    /* =====================================================
       СТРАХОВИЙ ЗАХИСТ
    ===================================================== */
if (
    card.insuranceProtection
    &&
    hasBankProduct(
        player,
        card
            .insuranceProtection
            .product
    )
) {

    const insuranceProduct =
        player.bank.products.find(
            product =>
                typeof product !== "string"
                &&
                product.id ===
                    card.insuranceProtection.product
                &&
                product.active !== false
        );


    finalEffects.money =
        (
            finalEffects.money || 0
        )
        +
        (
            card
                .insuranceProtection
                .refundMoney || 0
        );


    protectionMessage =
        card
            .insuranceProtection
            .text
        ||
        "🛡️ Спрацював страховий захист.";


    /* =============================================
       ОДНОРАЗОВЕ СТРАХУВАННЯ
    ============================================= */

    if (
        card
            .insuranceProtection
            .consumeAfterUse
        &&
        insuranceProduct
    ) {

        insuranceProduct.active =
            false;


        addLog(
            `🛡️ ${insuranceProduct.id}: страховий захист використано.`
        );

    }

}

/* =====================================================
   «ВАРТА 24/7» — ЗАХИСТ У КАРТЦІ ДОЛІ
===================================================== */

const vartaProduct =
    player.bank?.products?.find(
        product =>
            product &&
            product.id === "varta_247" &&
            product.active !== false
    );

const energyLoss =
    Number(finalEffects.energy) || 0;

if (
    vartaProduct &&
    energyLoss <= -10
) {
    finalEffects.energy = energyLoss + 10;

    vartaProduct.active = false;

    const vartaMessage =
        "🛡️ «Варта 24/7»: скасовано втрату 10 енергії. Захист використано.";

    protectionMessage = [
        protectionMessage,
        vartaMessage
    ].filter(Boolean).join(" ");

    addLog(vartaMessage);
}


    applyEffects(

        player,

        finalEffects

    );


    addLog(

        `⚡ Доля №${card.number}: ${card.title}`

    );


    openGameInfoModal(`

        <div class="fate-result-modal">

            <div class="decision-card-number">

                Картка Долі №${card.number}

            </div>


            <div class="decision-card-type">

                ⚡ ДОЛЯ

            </div>


            <h2>
                ${card.title}
            </h2>


            <p class="decision-card-story">

                ${card.story}

            </p>


            <div class="revealed-card-effects">

                ${effectsHTML(
                    finalEffects
                )}

            </div>


            ${
                protectionMessage

                ? `

                    <div class="fate-protection-message">

                        ${protectionMessage}

                    </div>

                  `

                : ""
            }


            ${
                card.advice

                ? `

                    <div class="fate-advice">

                        <strong>
                            💡 Порада
                        </strong>

                        <p>
                            ${card.advice}
                        </p>

                    </div>

                  `

                : ""
            }


            <button
                id="finishFateTurnButton"
                class="main-game-btn"
            >
                ЗАВЕРШИТИ ХІД
            </button>

        </div>

    `);


    document
        .getElementById(
            "finishFateTurnButton"
        )
        .addEventListener(
            "click",
            finishPlayerCardTurn
        );

}


/* =========================================================
   140. ПІДГОТОВКА AI

   ВАЖЛИВО:
   використовуємо РОЗШИРЕНІ
   delayed effects.
========================================================= */

function prepareAITurnEffects(
    ai
) {

    if (
        ai.effects.familyHearth
        &&
        ai.energy < 70
    ) {

        ai.energy =
            70;

    }


    if (
        ai.effects.energyPerTurn
    ) {

        applyEffects(

            ai,

            {
                energy:
                    ai.effects.energyPerTurn
            }

        );

    }


    if (
        ai.effects.incomePerTurn
    ) {

        ai.money +=
            ai.effects.incomePerTurn;


        ai.totalPassiveIncomeReceived +=
            ai.effects.incomePerTurn;

    }


    processTimedTurnEffects(
        ai
    );


    processDelayedEffectsAdvanced(
        ai
    );


    clampPlayerResources(
        ai
    );

}


/* =========================================================
   141. ПРАВИЛЬНИЙ ПЕРШИЙ ХІД

   Викликається після створення поля.
========================================================= */

function initializeGameCycle() {

    ensureGameRuntimeState();


    const player =
        gameState.player;


    player.turnsCompleted =
        Number(
            player.turnsCompleted
        ) || 0;


    gameState.playerTurns =
        player.turnsCompleted;


    gameState.currentTurn =
        "player";


    updatePlayerStatsUI();


    const button =
        document.getElementById(
            "rollDiceButton"
        );


    if (button) {

        button.disabled =
            false;

    }


    const title =
        document.getElementById(
            "diceTitle"
        );


    if (title) {

        title.textContent =
            "ТВІЙ ХІД";

    }

}


/* =========================================================
   142. ЗАХИСТ ВІД ПОДВІЙНОГО
   ЗАВЕРШЕННЯ ХОДУ

   Іноді користувач може
   двічі натиснути кнопку.
========================================================= */

let playerTurnClosing =
    false;


async function completePlayerTurn() {

    ensureGameRuntimeState();


    if (
        playerTurnClosing
        ||
        gameState.runtime.gameFinished
    ) {

        return;

    }


    playerTurnClosing =
        true;


    const player =
        gameState.player;


    player.turnsCompleted +=
        1;


    gameState.playerTurns =
        player.turnsCompleted;
   
processActiveBankProducts(
    player
);


    addLog(

        `🔄 ${player.name}: завершено хід ${player.turnsCompleted}`

    );


    /* =====================================================
       КОЖЕН 3-Й ХІД
    ===================================================== */

    if (
        player.turnsCompleted %
            GAME_CONFIG.financialPeriodTurns
        ===
        0
    ) {

        processPlayerFinancialPeriod();

    }


  checkCareerProgress(
    player
);


updatePlayerStatsUI();


try {

    /* =====================================================
       СПОЧАТКУ ПОКАЗУЄМО ЗАРПЛАТУ /
       КАР'ЄРНЕ ПІДВИЩЕННЯ

       І ЛИШЕ ПІСЛЯ ЦЬОГО
       ПОЧИНАЮТЬ ХОДИТИ AI.
    ===================================================== */

    if (
        gameState.runtime.noticeQueue.length >
        0
    ) {

        await new Promise(
            resolve => {

                showNextGameNotice(
                    resolve
                );

            }
        );

    }


    await startAITurnsCore();

}

finally {

    playerTurnClosing =
        false;

}


}


/* =========================================================
   143. ПОЧАТОК НОВОГО ХОДУ

   Тут також перевіряємо
   додаткову картку Долі,
   отриману з іншої картки.
========================================================= */

async function beginNextPlayerTurn() {

    if (
        gameState.runtime.gameFinished
    ) {

        return;

    }


    await preparePlayerTurn();


    /* =====================================================
       СПОЧАТКУ ПОВІДОМЛЕННЯ
       ПРО ВІДКЛАДЕНІ ЕФЕКТИ
    ===================================================== */

    if (
        gameState.runtime.noticeQueue.length >
        0
    ) {

        showNextGameNotice(

            () => {

                beginNextPlayerTurnAfterNotices();

            }

        );


        return;

    }


    beginNextPlayerTurnAfterNotices();

}


/* =========================================================
   144. ПІСЛЯ СЛУЖБОВИХ МОДАЛОК
========================================================= */

function beginNextPlayerTurnAfterNotices() {

    const player =
        gameState.player;


    /* =====================================================
       БОНУСНА ДОЛЯ

       Вона не є окремим ходом.

       Тому після неї треба
       просто активувати кубик,
       а НЕ рахувати ще один хід.
    ===================================================== */

    if (
        player.effects.pendingFateCard
    ) {

        player.effects.pendingFateCard =
            false;


        const card =
            randomItem(
                OUTER_CARD_DECKS.fate
            );


        if (card) {

            resolveBonusFateCard(
                card
            );


            return;

        }

    }


    activatePlayerTurn();

}


/* =========================================================
   145. БОНУСНА ДОЛЯ

   Не завершує ще один хід.
========================================================= */

function resolveBonusFateCard(
    card
) {

    const player =
        gameState.player;


    let effects = {

        ...(card.effects || {})

    };


    let protectionMessage =
        "";


    if (
        card.insuranceProtection
        &&
        hasBankProduct(

            player,

            card
                .insuranceProtection
                .product

        )
    ) {

        effects.money =
            (
                effects.money || 0
            )
            +
            (
                card
                    .insuranceProtection
                    .refundMoney || 0
            );


        protectionMessage =
            card
                .insuranceProtection
                .text ||
            "🛡️ Спрацював страховий захист.";

  /* Одноразовий захист використано */

if (
    card.insuranceProtection.consumeAfterUse
) {
    const protectionProduct =
        player.bank.products.find(
            product =>
                product &&
                product.id ===
                    card.insuranceProtection.product &&
                product.active !== false
        );

    if (protectionProduct) {
        protectionProduct.active = false;

        addLog(
            "🛡️ Одноразовий страховий захист використано."
        );
    }
}

    
    }

/* =====================================================
   «ВАРТА 24/7» — ЗАХИСТ У БОНУСНІЙ ДОЛІ
===================================================== */

const vartaProduct =
    player.bank?.products?.find(
        product =>
            product &&
            product.id === "varta_247" &&
            product.active !== false
    );

const energyLoss =
    Number(effects.energy) || 0;

if (
    vartaProduct &&
    energyLoss <= -10
) {
    effects.energy = energyLoss + 10;

    vartaProduct.active = false;

    const vartaMessage =
        "🛡️ «Варта 24/7»: скасовано втрату 10 енергії. Захист використано.";

    protectionMessage = [
        protectionMessage,
        vartaMessage
    ].filter(Boolean).join(" ");

    addLog(vartaMessage);
}

    applyEffects(

        player,

        effects

    );


    openGameInfoModal(`

        <div class="fate-result-modal">

            <div class="decision-card-type">
                ⚡ БОНУСНА КАРТКА ДОЛІ
            </div>


            <h2>
                ${card.title}
            </h2>


            <p>
                ${card.story}
            </p>


            <div class="revealed-card-effects">

                ${effectsHTML(effects)}

            </div>


            ${
                protectionMessage

                ? `

                    <div class="fate-protection-message">
                        ${protectionMessage}
                    </div>

                  `

                : ""
            }


            <button
                id="finishBonusFateButton"
                class="main-game-btn"
            >
                ПРОДОВЖИТИ
            </button>

        </div>

    `);


    document
        .getElementById(
            "finishBonusFateButton"
        )
        .addEventListener(
            "click",
            () => {

                closeGameInfoModal();

                activatePlayerTurn();

            }
        );

}
/* =========================================================
   МОДАЛКА КАР'ЄРНОГО ПРОГРЕСУ
========================================================= */

function showCareerProgressModal() {

    const player =
        gameState.player;


    if (
        !player ||
        !player.sector
    ) {

        return;

    }


    const displayedLevel =
        getDisplayedCareerLevel(
            player
        );


    const currentStats =
        getCareerStats(
            player.sector.id,
            displayedLevel
        );


    const nextLevel =
        Math.min(
            displayedLevel + 1,
            4
        );


    const nextStats =
        getCareerStats(
            player.sector.id,
            nextLevel
        );


    openGameInfoModal(`
        <div class="career-progress-popup">

            <h2>
                📈 Кар'єрний прогрес
            </h2>


            <div class="career-popup-profile">

                <img
                    class="career-popup-token"
                    src="${player.token.image}"
                    alt="${player.name}"
                >

                <div>

                    <strong>
                        ${player.name}
                    </strong>

                    <p>
                        ${currentStats?.name || player.sector.name}
                    </p>

                    <p>
                        Професійний рівень:
                        ${displayedLevel}
                    </p>

                </div>

            </div>


            ${
                displayedLevel < 4

                ? `
                    <div class="next-career-level">

                        <span>
                            Наступна сходинка
                        </span>

                        <strong>
                            ${nextStats?.name || "Наступний рівень"}
                        </strong>

                    </div>

                    <div class="dream-requirements">

                        <span>
                            ⭐ Репутація:
                            ${player.reputation}
                            /
                            ${nextStats?.reputation || 0}
                        </span>

                        <span>
                            🧠 Знання:
                            ${player.knowledge}
                            /
                            ${nextStats?.knowledge || 0}
                        </span>

                        <span>
                            ⚡ Енергія:
                            ${player.energy}
                            /
                            ${nextStats?.energy || 0}
                        </span>

                    </div>
                `

                : `
                    <div class="career-max-level">
                        🏆 Ти вже на максимальному професійному рівні
                    </div>
                `
            }

        </div>
    `);

}
 
/* =========================================================
 ВІДКРИТТЯ УНІВЕРСАЛЬНОЇ МОДАЛКИ

   Залишаємо універсальною.  
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

        console.warn(
            "Не знайдено gameInfoModal або gameInfoContent"
        );

        return;

    }


    content.innerHTML =
        html;


    modal.hidden =
        false;

}
/* =========================================================
   145.1. ПРОГРЕС МРІЇ

   Використовується кнопкою "МОЯ МРІЯ".
   Якщо активної Мрії немає —
   відкриваємо вибір нової.
========================================================= */

function showDreamProgress() {

    const player =
        gameState.player;


    if (
        !player.dream
    ) {

        showDreamSelection();

        return;

    }


    const dream =
        player.dream;


    const req =
        dream.requirements;


    const careerReady =
        hasFinalCareerLevel(
            player
        );


    openGameInfoModal(`

        <div class="dream-check-modal">

            <div class="cycle-notice-icon">
                ${dream.icon || "✨"}
            </div>


            <h2>
                Моя Мрія
            </h2>


            <h3>
                ${dream.name}
            </h3>


            <div class="dream-requirements">

                <span>
                    💰 ${formatMoney(player.money)}
                    /
                    ${formatMoney(req.money)}
                </span>


                <span>
                    ⭐ ${player.reputation}
                    /
                    ${req.reputation}
                </span>


                <span>
                    🧠 ${player.knowledge}
                    /
                    ${req.knowledge}
                </span>


                <span>
                    ⚡ ${player.energy}
                    /
                    ${req.energy}
                </span>

            </div>


            <div class="dream-career-check">

                ${
                    careerReady
                        ? "✅ 4-й професійний рівень досягнуто"
                        : "⏳ Потрібно досягти 4-го професійного рівня"
                }

            </div>


            <p>
                ✨ Виконано Мрій:
                ${
                    Array.isArray(
                        player.completedDreams
                    )
                        ? player.completedDreams.length
                        : 0
                }
                із ${DREAMS.length}
            </p>


            <button
                id="closeDreamProgressButton"
                class="main-game-btn"
            >
                ПРОДОВЖИТИ ГРУ
            </button>

        </div>

    `);


    document
        .getElementById(
            "closeDreamProgressButton"
        )
        ?.addEventListener(
            "click",
            closeGameInfoModal
        );

}

/* =========================================================
   ІНФОРМАЦІЯ ПРО AI-ГРАВЦЯ
========================================================= */

function showParticipantInfo(
    participantId
) {

    const participant =
        gameState.opponents.find(
            ai =>
                ai.id === participantId
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

        <div class="participant-info-modal">

                       <div class="cycle-notice-icon">
                ${
                    participant.token?.image
                        ? `
                            <img
                                src="${participant.token.image}"
                                alt="Фішка гравця"
                                style="
                                    display:block;
                                    width:72px;
                                    height:72px;
                                    object-fit:contain;
                                    margin:0 auto;
                                "
                            >
                        `
                        : ""
                }
            </div>



            <h2>
                ${participant.name}
            </h2>


            <p>
                ${profession}
            </p>


            <div class="participant-popup-stats">

                <span>
                    💰 Гроші:
                    ${formatMoney(participant.money)}
                </span>

                <span>
                    ⭐ Репутація:
                    ${participant.reputation}
                </span>

                <span>
                    🧠 Знання:
                    ${participant.knowledge}
                </span>

                <span>
                    ⚡ Енергія:
                    ${participant.energy}
                </span>

                <span>
                    🏆 Кар'єрний рівень:
                    ${getDisplayedCareerLevel(participant)}
                </span>

                <span>
                    💵 Зарплата:
                    ${formatMoney(participant.salary)}
                </span>

                <span>
                    ✨ Мрія:
                    ${
                        participant.dream
                            ? participant.dream.name
                            : "Ще не обрана"
                    }
                </span>

            </div>


            <button
                id="closeParticipantInfoButton"
                class="main-game-btn"
            >
                ПРОДОВЖИТИ ГРУ
            </button>

        </div>

    `);


    document
        .getElementById(
            "closeParticipantInfoButton"
        )
        ?.addEventListener(
            "click",
            closeGameInfoModal
        );

}
/* =========================================================
   145.2. КАТАЛОГ БАНКІВСЬКИХ ПРОДУКТІВ

   Повна заміна банківського блоку до розділу 145.3.

   1 місяць = 3 особисті завершені ходи.
   Інтервали, зазначені на картках у ходах, збережено.

   audience:
   personal   — фізична особа
   business   — ФОП / бізнес
   investment — фінансові інструменти
========================================================= */

const BANK_PRODUCTS = [

    /* =====================================================
       ФІЗИЧНА ОСОБА — ДЕПОЗИТИ
    ===================================================== */

    {
        id: "deposit_classic",
        audience: "personal",
        category: "deposit",
        gameMode: "active",
        icon: "💰",
        name: "Депозит «Класичний Строковий»",
        shortName: "Класичний Строковий",
        description:
            "Строковий депозит — це гроші, які ти передаєш банку на визначений період. Банк зберігає їх і нараховує дохід. Такий продукт підходить, коли частину грошей ти не плануєш витрачати найближчим часом."
    },

    {
        id: "deposit_growing",
        audience: "personal",
        category: "deposit",
        gameMode: "active",
        icon: "📈",
        name: "Депозит «Зростаючий»",
        shortName: "Зростаючий",
        description:
            "Це депозит, який можна поповнювати. Він допомагає поступово накопичувати гроші та отримувати дохід від заощаджень. Підходить для регулярного формування фінансового запасу."
    },

    {
        id: "deposit_chest",
        audience: "personal",
        category: "deposit",
        gameMode: "active",
        icon: "🪙",
        name: "Депозит «Скриня»",
        shortName: "Скриня",
        description:
            "«Скриня» допомагає відкладати гроші та водночас мати до них доступ. Такий формат зручний для фінансової подушки або накопичення на майбутню покупку."
    },


    /* =====================================================
       ФІЗИЧНА ОСОБА — КРЕДИТИ
    ===================================================== */

    {
        id: "cash_credit",
        audience: "personal",
        category: "credit",
        gameMode: "active",
        icon: "💵",
        name: "Кредит готівкою",
        shortName: "Кредит готівкою",
        description:
            "Кредит — це гроші, які банк дає тобі в борг. Їх можна використати зараз, але потім потрібно поступово повернути банку. Перед оформленням важливо розуміти, чи зможеш ти регулярно сплачувати борг."
    },

    {
        id: "credit_card_100",
        audience: "personal",
        category: "credit",
        gameMode: "active",
        icon: "💳",
        name: "Кредитна картка «100 днів 2.0»",
        shortName: "100 днів 2.0",
        description:
            "Кредитна картка дає доступ до грошей банку в межах встановленого ліміту. Користуватися ними можна для покупок та інших витрат. Використані кредитні кошти потрібно повертати."
    },

    {
        id: "premium_cash_credit",
        audience: "personal",
        category: "credit",
        gameMode: "active",
        icon: "👑",
        name: "Кредит для Premium-клієнтів",
        shortName: "Premium кредит",
        description:
            "Це кредитна пропозиція для клієнтів преміального обслуговування. Вона працює за тим самим принципом: банк надає кошти, які клієнт повертає відповідно до умов договору."
    },

    {
        id: "premium_credit_card",
        audience: "personal",
        category: "credit",
        gameMode: "active",
        icon: "👑",
        name: "Кредитна картка Premium",
        shortName: "Premium кредитна картка",
        description:
            "Кредитна картка в преміальному пакеті поєднує кредитний ліміт та додаткові можливості обслуговування. У грі кредитні платежі та правила прострочення застосовуються за відповідною банківською карткою."
    },


    /* =====================================================
       ФІЗИЧНА ОСОБА — СТРАХУВАННЯ
    ===================================================== */

    {
        id: "green_card",
        audience: "personal",
        category: "insurance",
        gameMode: "active",
        icon: "🚗",
        name: "Зелена картка",
        shortName: "Зелена картка",
        description:
            "«Зелена картка» — це страхування відповідальності водія під час поїздок автомобілем за кордон. Воно допомагає покрити збитки іншим людям у разі ДТП."
    },

    {
        id: "home_insurance",
        audience: "personal",
        category: "insurance",
        gameMode: "active",
        icon: "🏠",
        name: "Страхування оселі",
        shortName: "Страхування оселі",
        description:
            "Страхування оселі допомагає фінансово захистити квартиру або будинок від певних непередбачуваних подій. Якщо настає страховий випадок, страхова компанія може компенсувати передбачені договором збитки."
    },

    {
        id: "varta_247",
        audience: "personal",
        category: "insurance",
        gameMode: "active",
        icon: "🛡️",
        name: "«Варта 24/7»",
        shortName: "Варта 24/7",
        description:
            "Це страхування від карткового шахрайства. Воно допомагає захистити кошти клієнта від окремих шахрайських операцій та передбачає компенсацію у випадках, визначених умовами страхування."
    },

    {
        id: "life_insurance",
        audience: "personal",
        category: "insurance",
        gameMode: "active",
        icon: "❤️",
        name: "Накопичувальне страхування життя",
        shortName: "Страхування життя",
        description:
            "Цей продукт поєднує страхування життя та довгострокове накопичення грошей. Людина регулярно робить внески, формуючи фінансовий резерв на майбутнє."
    },

    {
        id: "extra_motor_insurance",
        audience: "personal",
        category: "insurance",
        gameMode: "active",
        icon: "🚘",
        name: "Додаткова автоцивілка",
        shortName: "Додаткова автоцивілка",
        description:
            "Це добровільне доповнення до основного страхування відповідальності водія. Воно може збільшити суму страхового захисту, якщо стандартного покриття недостатньо."
    },


    /* =====================================================
       ІНВЕСТИЦІЙНІ ІНСТРУМЕНТИ
    ===================================================== */

    {
        id: "ovdp",
        audience: "investment",
        category: "investment",
        gameMode: "active",
        icon: "🇺🇦",
        name: "ОВДП",
        shortName: "ОВДП",
        description:
            "ОВДП — це облігації внутрішньої державної позики. Купуючи їх, інвестор фактично позичає гроші державі, а держава зобов'язується повернути їх у визначений строк разом із передбаченим доходом."
    },

    {
        id: "etf",
        audience: "investment",
        category: "investment",
        gameMode: "active",
        icon: "🧺",
        name: "ETF — кошик активів",
        shortName: "ETF",
        description:
            "ETF — це фонд, у якому може бути одразу багато різних активів, наприклад акцій компаній. Купуючи частку ETF, інвестор не обирає одну компанію, а вкладає кошти одразу в цілий набір активів."
    },

    {
        id: "common_stock",
        audience: "investment",
        category: "investment",
        gameMode: "active",
        icon: "📊",
        name: "Прості акції",
        shortName: "Прості акції",
        description:
            "Акція — це частка власності в компанії. Її вартість може як зростати, так і знижуватися. Інвестиції в акції завжди пов'язані з ризиком."
    },

    {
        id: "preferred_stock",
        audience: "investment",
        category: "investment",
        gameMode: "active",
        icon: "⭐",
        name: "Привілейовані акції",
        shortName: "Привілейовані акції",
        description:
            "Привілейовані акції — це особливий вид акцій, власники яких можуть мати переваги щодо отримання виплат. Умови залежать від конкретної компанії та випуску акцій."
    },

    {
        id: "dividend_stock",
        audience: "investment",
        category: "investment",
        gameMode: "active",
        icon: "💸",
        name: "Дивідендні акції",
        shortName: "Дивідендні акції",
        description:
            "Дивідендними часто називають акції компаній, які регулярно розподіляють частину прибутку між акціонерами. Такі виплати називаються дивідендами."
    },


    /* =====================================================
       ФОП / БІЗНЕС
    ===================================================== */

    {
        id: "my_fop",
        audience: "business",
        category: "account",
        gameMode: "active",
        icon: "🧾",
        name: "Рахунок для ФОП",
        shortName: "Мій ФОП",
        description:
            "Рахунок ФОП використовується підприємцем для отримання оплати, здійснення платежів, сплати податків та інших операцій, пов'язаних із бізнесом."
    },

    {
        id: "deposit_line",
        audience: "business",
        category: "deposit",
        gameMode: "active",
        icon: "🏦",
        name: "Депозитна лінія",
        shortName: "Депозитна лінія",
        description:
            "Депозитна лінія допомагає бізнесу тимчасово розміщувати вільні кошти в банку. Залежно від умов продукту підприємство може поповнювати вклад та використовувати частину коштів."
    },

    {
        id: "currency_account",
        audience: "business",
        category: "account",
        gameMode: "active",
        icon: "💱",
        name: "Валютний рахунок",
        shortName: "Валютний рахунок",
        description:
            "Валютний рахунок використовується для зберігання та проведення операцій у іноземній валюті. Він потрібен бізнесу, який працює з іноземними клієнтами, постачальниками або партнерами."
    },

    {
        id: "internet_acquiring",
        audience: "business",
        category: "payment",
        gameMode: "active",
        icon: "🌐",
        name: "Інтернет-еквайринг",
        shortName: "Інтернет-еквайринг",
        description:
            "Інтернет-еквайринг дозволяє бізнесу приймати оплату банківськими картками на сайті або в онлайн-магазині. Банк допомагає провести платіж від покупця до продавця."
    },

    {
        id: "business_elite",
        audience: "business",
        category: "service",
        gameMode: "active",
        icon: "💼",
        name: "Пакет для бізнесу",
        shortName: "Бізнес Еліт+",
        description:
            "Пакет банківського обслуговування об'єднує декілька послуг для підприємця або компанії. Це може бути рахунок, платежі, картки та додаткові сервіси."
    },

    {
        id: "overdraft",
        audience: "business",
        category: "credit",
        gameMode: "active",
        icon: "📉",
        name: "Овердрафт",
        shortName: "Овердрафт",
        description:
            "Овердрафт — це короткостроковий кредитний ліміт на рахунку бізнесу. Він допомагає оплатити поточні витрати, коли власних грошей на рахунку тимчасово недостатньо."
    },

    {
        id: "acquiring",
        audience: "business",
        category: "payment",
        gameMode: "active",
        icon: "💳",
        name: "Еквайринг",
        shortName: "Еквайринг",
        description:
            "Еквайринг дозволяє бізнесу приймати безготівкову оплату карткою або іншими платіжними способами. Наприклад, через платіжний термінал у магазині або кафе."
    }

];


/* =========================================================
   145.2.0. СПІЛЬНІ ПЕРЕВІРКИ Й ПРАВИЛА
========================================================= */

const BANK_TURNS_PER_MONTH = 3;

const BANK_EARLY_RETURNS = {
    deposit_growing: 4000,
    deposit_chest: 4000,
    ovdp: 3000,
    deposit_line: 6000
};

const BANK_CLASSIC_TERMS = [
    {
        months: 3,
        turns: 9,
        profit: 1000
    },
    {
        months: 6,
        turns: 18,
        profit: 1500
    },
    {
        months: 12,
        turns: 36,
        profit: 2000
    }
];


function ensureBankState(player) {

    if (!player) {
        return null;
    }

    const bank =
        player.bank || (player.bank = {});

    if (!Array.isArray(bank.products)) {
        bank.products = [];
    }

    bank.products = bank.products
        .map(product =>
            typeof product === "string"
                ? {
                    id: product,
                    active: true,
                    activatedTurn:
                        Number(player.turnsCompleted) || 0
                }
                : product
        )
        .filter(Boolean);

    if (!Array.isArray(bank.debts)) {
        bank.debts = [];
    }

    const visits =
        Number(bank.extraVisits);

    bank.extraVisits =
        Number.isFinite(visits) && visits >= 0
            ? Math.floor(visits)
            : Math.max(
                0,
                Number(GAME_CONFIG.startingBankTokens) || 0
            );

    bank.premium =
        bank.premium === true;

    bank.premiumExtraGranted =
        bank.premiumExtraGranted === true;

    return bank;

}


function bankCatalogCard(productId) {

    const card =
        BANK_CARD_DECK.find(
            item => item.productId === productId
        );

    return card
        ? {
            ...card,
            initialEffects: {
                ...(card.initialEffects || {})
            }
        }
        : null;

}


function bankContext(context) {

    return {

        source:
            context?.source === "hub"
                ? "hub"
                : "cell",

        audience:
            [
                "personal",
                "business",
                "investment"
            ].includes(context?.audience)
                ? context.audience
                : "personal"

    };

}


function getBankOverdraftLimit(player) {

    const knowledge =
        Number(player?.knowledge) || 0;

    const reputation =
        Number(player?.reputation) || 0;

    if (
        knowledge >= 80 &&
        reputation >= 85
    ) {
        return 80000;
    }

    if (
        knowledge >= 55 &&
        reputation >= 70
    ) {
        return 40000;
    }

    if (
        knowledge >= 40 &&
        reputation >= 30
    ) {
        return 20000;
    }

    if (
        knowledge >= 10 &&
        reputation >= 20
    ) {
        return 10000;
    }

    return 0;

}


function bankActivationProblem(
    player,
    card,
    context
) {

    if (
        !player ||
        !card ||
        !BANK_PRODUCTS.some(
            item => item.id === card.productId
        )
    ) {
        return "Картку продукту не знайдено.";
    }

    const bank =
        ensureBankState(player);

    if (
        hasBankProduct(
            player,
            card.productId
        )
    ) {
        return "Цей продукт уже підключений.";
    }

    if (
        context.source === "hub" &&
        bank.extraVisits < 1
    ) {
        return "Додаткові звернення вичерпано. Можна підключити продукт, коли випадеш на клітинку Банку.";
    }

    const cost =
        Math.max(
            0,
            -(Number(card.initialEffects?.money) || 0)
        );

    if (
        player.money < cost
    ) {
        return `Для підключення потрібно ${formatMoney(cost)} грн.`;
    }

    if (
        card.moneyRequired &&
        player.money < card.moneyRequired
    ) {
        return `Потрібно мати щонайменше ${formatMoney(card.moneyRequired)} грн.`;
    }

    if (
        card.premiumRequired &&
        !bank.premium &&
        player.money < 20000
    ) {
        return "Для отримання Premium-статусу потрібно мати щонайменше 20 000 грн.";
    }

    if (
        card.productId === "overdraft" &&
        !getBankOverdraftLimit(player)
    ) {
        return "Для овердрафту потрібно щонайменше 10 знань та 20 репутації.";
    }

    return "";

}


function bindBankClick(
    id,
    callback
) {

    document
        .getElementById(id)
        ?.addEventListener(
            "click",
            callback
        );

}


function bankProductName(product) {

    return BANK_PRODUCTS.find(
        item => item.id === product.id
    )?.shortName || product.id;

}


/* =========================================================
   145.2. БАНК — ОСНОВНИЙ HUB

   Кнопка HUD може передати MouseEvent.
   У такому випадку відкриваємо «Для себе».
========================================================= */

function showBankHub(
    audience = "personal"
) {

    if (
        ![
            "personal",
            "business",
            "investment"
        ].includes(audience)
    ) {
        audience = "personal";
    }

    const player =
        gameState.player;

    if (!player) {
        return;
    }

    const bank =
        ensureBankState(player);

    const owned =
        bank.products.filter(
            item => item.active !== false
        );

    const titles = {
        personal: "👤 Для себе",
        business: "💼 Для бізнесу",
        investment: "📈 Інвестиції"
    };

    const cards =
        BANK_PRODUCTS.filter(
            item => item.audience === audience
        );


    openGameInfoModal(`

        <div class="bank-hub-modal">

            <div class="cycle-notice-icon">
                🏦
            </div>

            <h2>
                Банк
            </h2>

            <p>
                Перегляд безкоштовний.
                Підключення через це меню використовує
                одне додаткове звернення
                та не завершує твій хід.
            </p>

            <div class="bank-summary-strip">

                <span>
                    🎟 Звернення:
                    ${bank.extraVisits}
                </span>

                <span>
                    ⭐ Premium:
                    ${bank.premium ? "Так" : "Ні"}
                </span>

                <span>
                    💳 Активних продуктів:
                    ${owned.length}
                </span>

            </div>


            ${
                owned.length

                    ? `

                        <div class="bank-products-section">

                            <h3>
                                💳 Мої активні продукти
                            </h3>

                            <div class="bank-products-grid">

                                ${
                                    owned.map(
                                        (product, index) => {

                                            const catalog =
                                                BANK_PRODUCTS.find(
                                                    item =>
                                                        item.id === product.id
                                                );

                                            const early =
                                                BANK_EARLY_RETURNS[
                                                    product.id
                                                ];

                                            return `

                                                <div class="bank-product-card">

                                                    <span class="bank-product-icon">
                                                        ${catalog?.icon || "🏦"}
                                                    </span>

                                                    <div class="bank-product-card-text">

                                                        <strong>
                                                            ${bankProductName(product)}
                                                        </strong>

                                                        <small>
                                                            ${
                                                                product.id === "overdraft"

                                                                    ? `Борг: ${formatMoney(product.principalDue || 0)} грн`

                                                                    : "Активний продукт"
                                                            }
                                                        </small>

                                                        ${
                                                            early

                                                                ? `

                                                                    <button
                                                                        class="secondary-game-btn"
                                                                        data-bank-close-index="${index}"
                                                                    >
                                                                        ЗАБРАТИ ${formatMoney(early)} ГРН
                                                                    </button>

                                                                  `

                                                                : ""
                                                        }

                                                        ${
                                                            product.id === "my_fop"

                                                                ? `

                                                                    <button
                                                                        class="secondary-game-btn"
                                                                        data-bank-fop-index="${index}"
                                                                    >
                                                                        ЗАКРИТИ РАХУНОК «МІЙ ФОП»
                                                                    </button>

                                                                  `

                                                                : ""
                                                        }

                                                        ${
                                                            product.id === "overdraft"

                                                                ? `

                                                                    <button
                                                                        class="secondary-game-btn"
                                                                        data-bank-repay-index="${index}"
                                                                    >
                                                                        ПОВЕРНУТИ БОРГ
                                                                    </button>

                                                                  `

                                                                : ""
                                                        }

                                                    </div>

                                                </div>

                                            `;

                                        }
                                    ).join("")
                                }

                            </div>

                        </div>

                      `

                    : ""
            }


                     <div
                class="bank-tabs"
                style="
                    display:flex;
                    flex-wrap:wrap;
                    gap:10px;
                    margin:16px 0;
                "
            >

                ${
                    Object.entries(titles)
                        .map(([key, title]) => `

                            <button
                                type="button"
                                class="main-game-btn bank-tab-button ${
                                    key === audience
                                        ? "active"
                                        : ""
                                }"
                                data-bank-tab="${key}"
                                aria-pressed="${key === audience}"
                                style="
                                    flex:1 1 150px;
                                    width:auto;
                                    margin:0;
                                    padding:14px 18px;

                                    ${
                                        key === audience
                                            ? "box-shadow:inset 0 0 0 3px #6b5200;"
                                            : ""
                                    }
                                "
                            >
                                ${title}
                            </button>

                        `)
                        .join("")
                }

            </div>



            <h3>
                ${titles[audience]}
            </h3>


            <div class="bank-products-grid">

                ${
                    cards.map(
                        product => `

                            <button
                                class="bank-product-card"
                                data-bank-product-id="${product.id}"
                            >

                                <span class="bank-product-icon">
                                    ${product.icon}
                                </span>

                                <div class="bank-product-card-text">

                                    <strong>
                                        ${product.shortName}
                                    </strong>

                                    <small>
                                        Умови та підключення →
                                    </small>

                                </div>

                            </button>

                        `
                    ).join("")
                }

            </div>


            <button
                id="closeBankHubButton"
                class="main-game-btn"
            >
                ПРОДОВЖИТИ ГРУ
            </button>

        </div>

    `);


    /* ПЕРЕМИКАННЯ ВКЛАДОК */

    document
        .querySelectorAll(
            "[data-bank-tab]"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        showBankHub(
                            button.dataset.bankTab
                        );

                    }
                );

            }
        );


    /* ВІДКРИТТЯ ІНФОРМАЦІЇ ПРО ПРОДУКТ */

    document
        .querySelectorAll(
            "[data-bank-product-id]"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        showBankProductInfo(
                            button.dataset.bankProductId,
                            audience
                        );

                    }
                );

            }
        );


    /* ДОСТРОКОВЕ ПОВЕРНЕННЯ КОШТІВ */

    document
        .querySelectorAll(
            "[data-bank-close-index]"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    event => {

                        event.stopPropagation();

                        const product =
                            owned[
                                Number(
                                    button.dataset.bankCloseIndex
                                )
                            ];

                        if (
                            !product ||
                            product.active === false
                        ) {
                            return;
                        }

                        closeBankProductWithReturn(
                            player,
                            product,
                            BANK_EARLY_RETURNS[product.id],
                            bankProductName(product)
                        );

                        updateGameUI();

                        showBankHub(
                            audience
                        );

                    }
                );

            }
        );


    /* ЗАКРИТТЯ РАХУНКУ «МІЙ ФОП» */

    document
        .querySelectorAll(
            "[data-bank-fop-index]"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    event => {

                        event.stopPropagation();

                        const product =
                            owned[
                                Number(
                                    button.dataset.bankFopIndex
                                )
                            ];

                        if (
                            !product ||
                            product.active === false
                        ) {
                            return;
                        }

                        product.active = false;

                        addLog(
                            "✅ Рахунок «Мій ФОП» закрито. Реєстрація ФОП не змінюється."
                        );

                        updateGameUI();

                        showBankHub(
                            audience
                        );

                    }
                );

            }
        );


    /* ПОВЕРНЕННЯ ОВЕРДРАФТУ */

    document
        .querySelectorAll(
            "[data-bank-repay-index]"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    event => {

                        event.stopPropagation();

                        showBankOverdraftRepayment(
                            owned[
                                Number(
                                    button.dataset.bankRepayIndex
                                )
                            ],
                            audience
                        );

                    }
                );

            }
        );


    bindBankClick(
        "closeBankHubButton",
        closeGameInfoModal
    );

}


/* =========================================================
   145.2.1. ІНФОРМАЦІЯ ПРО БАНКІВСЬКИЙ ПРОДУКТ

   Звідси можна перейти до підключення.
========================================================= */

function showBankProductInfo(
    productId,
    audience = "personal"
) {

    const product =
        BANK_PRODUCTS.find(
            item => item.id === productId
        );

    if (!product) {
        return;
    }

    const card =
        bankCatalogCard(productId);


    openGameInfoModal(`

        <div class="bank-product-info-modal">

            <div class="cycle-notice-icon">
                ${product.icon}
            </div>

            <h2>
                ${product.name}
            </h2>

            <p>
                ${product.description}
            </p>

            <div class="decision-card-task">
                ${
                    card?.rulesText ||
                    "Картку продукту не знайдено."
                }
            </div>

            ${
                card

                    ? `

                        <button
                            id="bankProductConnectButton"
                            class="main-game-btn"
                        >
                            ПЕРЕЙТИ ДО ПІДКЛЮЧЕННЯ
                        </button>

                      `

                    : ""
            }

            <button
                id="backToBankButton"
                class="secondary-game-btn"
            >
                ← НАЗАД ДО БАНКУ
            </button>

            <button
                id="closeBankProductButton"
                class="work-panel-button"
            >
                ЗАКРИТИ
            </button>

        </div>

    `);


    bindBankClick(
        "bankProductConnectButton",
        () => {

            showBankCard(
                card,
                {
                    source: "hub",
                    audience
                }
            );

        }
    );


    bindBankClick(
        "backToBankButton",
        () => {

            showBankHub(
                audience
            );

        }
    );


    bindBankClick(
        "closeBankProductButton",
        closeGameInfoModal
    );

}


/* =========================================================
   145.2.2. ІГРОВА КАРТКА БАНКУ

   source:
   cell — картка з клітинки Банку
   hub  — підключення за додаткове звернення
========================================================= */

function showBankCard(
    card,
    context = {}
) {

    const player =
        gameState.player;

    const ctx =
        bankContext(context);

    if (
        !player ||
        !card
    ) {

        if (
            ctx.source === "cell"
        ) {
            finishPlayerCardTurn();
        }

        return;

    }

    const problem =
        bankActivationProblem(
            player,
            card,
            ctx
        );

    const product =
        BANK_PRODUCTS.find(
            item => item.id === card.productId
        );


    openGameInfoModal(`

        <div class="bank-card-game-modal">

            <div class="cycle-notice-icon">
                🏦
            </div>

            <div class="decision-card-number">
                Картка Банку №${card.number}
            </div>

            <h2>
                ${card.title}
            </h2>

            <p>
                ${card.story || ""}
            </p>

            <div class="decision-card-task">

                <strong>
                    📋 Як працює у грі
                </strong>

                <br><br>

                ${card.rulesText || ""}

            </div>

            <p>
                ${product?.description || ""}
            </p>

            ${
                ctx.source === "hub"

                    ? `

                        <p>
                            🎟 При успішному підключенні:
                            −1 додаткове звернення.
                        </p>

                      `

                    : ""
            }

            ${
                problem

                    ? `

                        <div class="card-requirement-warning">
                            ⚠️ ${problem}
                        </div>

                      `

                    : `

                        <button
                            id="activateBankProductButton"
                            class="main-game-btn"
                        >
                            ПІДКЛЮЧИТИ ПРОДУКТ
                        </button>

                      `
            }

            <button
                id="declineBankProductButton"
                class="work-panel-button"
            >
                ${
                    ctx.source === "hub"
                        ? "НАЗАД ДО БАНКУ"
                        : "НЕ ПІДКЛЮЧАТИ"
                }
            </button>

        </div>

    `);


    bindBankClick(
        "activateBankProductButton",
        () => {

            activateBankProduct(
                card,
                ctx
            );

        }
    );


    bindBankClick(
        "declineBankProductButton",
        () => {

            if (
                ctx.source === "hub"
            ) {

                showBankHub(
                    ctx.audience
                );

            } else {

                finishPlayerCardTurn();

            }

        }
    );

}


/* =========================================================
   145.2.3. ПІДКЛЮЧЕННЯ БАНКІВСЬКОГО ПРОДУКТУ

   Перед активацією повторно перевіряємо вимоги.
========================================================= */

function activateBankProduct(
    card,
    context = {}
) {

    const player =
        gameState.player;

    const ctx =
        bankContext(context);

    if (
        !player ||
        !card
    ) {
        return;
    }

    const bank =
        ensureBankState(player);

    if (
        bankActivationProblem(
            player,
            card,
            ctx
        )
    ) {

        showBankCard(
            card,
            ctx
        );

        return;

    }


    /* КЛАСИЧНИЙ ДЕПОЗИТ — ОБРАНИЙ СТРОК */

    const term =
        BANK_CLASSIC_TERMS.find(
            item =>
                item.months ===
                Number(
                    card.selectedDepositTerm?.months
                )
        );

    if (
        card.productId === "deposit_classic" &&
        !term
    ) {

        showClassicDepositTermChoice(
            card,
            ctx
        );

        return;

    }


    /*
       Ліміт овердрафту визначаємо ДО застосування
       бонусів знань і репутації самої картки.
    */

    const overdraftLimit =
        card.productId === "overdraft"
            ? getBankOverdraftLimit(player)
            : 0;

    const effects = {
        ...(card.initialEffects || {})
    };

    if (
        overdraftLimit
    ) {
        effects.money = overdraftLimit;
    }


    /* PREMIUM */

    if (
        card.premiumRequired &&
        !bank.premium
    ) {

        bank.premium = true;

        if (
            !bank.premiumExtraGranted
        ) {

            const extra =
                Math.max(
                    0,
                    Number(
                        GAME_CONFIG.premiumExtraBankTokens
                    ) || 0
                );

            bank.extraVisits += extra;

            bank.premiumExtraGranted = true;

            addLog(
                `⭐ Отримано Premium та +${extra} додаткових звернень до Банку.`
            );

        }

    }


    /* ПОЧАТКОВІ ЕФЕКТИ */

    applyEffects(
        player,
        effects
    );


    /* АКТИВНИЙ ПРОДУКТ */

    const product = {

        id:
            card.productId,

        cardId:
            card.id,

        active:
            true,

        /*
           Для клітинки Банку хід придбання не рахуємо.

           Для HUB додаткове звернення не завершує хід,
           тому наступний завершений хід уже рахується.
        */

        activatedTurn:
            (
                Number(
                    player.turnsCompleted
                ) || 0
            ) + (
                ctx.source === "cell"
                    ? 1
                    : 0
            ),

        lastBankProcessedTurn:
            0

    };


    if (term) {

        Object.assign(
            product,
            {
                termMonths:
                    term.months,

                termTurns:
                    term.turns,

                profit:
                    term.profit
            }
        );

    }


    if (
        overdraftLimit
    ) {
        product.principalDue = overdraftLimit;
    }


    bank.products.push(
        product
    );


    /* ЗВЕРНЕННЯ СПИСУЄМО ЛИШЕ ПІСЛЯ УСПІХУ */

    if (
        ctx.source === "hub"
    ) {
        bank.extraVisits -= 1;
    }


    addLog(
        `🏦 Підключено: ${card.title}${
            ctx.source === "hub"
                ? "; використано 1 додаткове звернення"
                : ""
        }.`
    );


    updateGameUI();


    openGameInfoModal(`

        <div class="bank-card-game-modal">

            <div class="cycle-notice-icon">
                ✅
            </div>

            <h2>
                Продукт підключено
            </h2>

            <p>
                ${card.title}
            </p>

            ${
                term

                    ? `

                        <p>

                            📅 ${term.months} міс.
                            = ${term.turns} особистих ходів.

                            <br>

                            💰 Дохід наприкінці:
                            +${formatMoney(term.profit)} грн.

                        </p>

                      `

                    : ""
            }

            ${
                overdraftLimit

                    ? `

                        <p>

                            Борг:
                            ${formatMoney(overdraftLimit)} грн.

                            <br>

                            Відсотки:
                            20% залишку кожного 2-го ходу.

                        </p>

                      `

                    : ""
            }

            <button
                id="bankProductActivatedButton"
                class="main-game-btn"
            >
                ПРОДОВЖИТИ
            </button>

        </div>

    `);


    bindBankClick(
        "bankProductActivatedButton",
        () => {

            if (
                ctx.source === "hub"
            ) {

                showBankHub(
                    ctx.audience
                );

            } else {

                finishPlayerCardTurn();

            }

        }
    );

}


/* =========================================================
   ВИБІР СТРОКУ КЛАСИЧНОГО ДЕПОЗИТУ

   1 місяць = 3 ходи
   3 місяці = 9 ходів
   6 місяців = 18 ходів
   12 місяців = 36 ходів

   Передаємо копію картки.
   Спільну банківську колоду не змінюємо.
========================================================= */

function showClassicDepositTermChoice(
    card,
    context = {}
) {

    if (!card) {
        return;
    }

    const ctx =
        bankContext(context);


    openGameInfoModal(`

        <div class="bank-card-game-modal">

            <h2>
                Класичний Строковий
            </h2>

            <p>
                Обери строк.
                1 місяць = ${BANK_TURNS_PER_MONTH}
                особисті ходи.
            </p>

            <div class="bank-product-options">

                ${
                    BANK_CLASSIC_TERMS.map(
                        term => `

                            <button
                                class="main-game-btn"
                                data-bank-term="${term.months}"
                            >

                                ${term.months} місяців

                                <br>

                                <small>
                                    ${term.turns} ходів
                                    • дохід
                                    +${formatMoney(term.profit)} грн
                                </small>

                            </button>

                        `
                    ).join("")
                }

            </div>

            <button
                id="classicDepositCancelButton"
                class="secondary-game-btn"
            >
                НАЗАД
            </button>

        </div>

    `);


    document
        .querySelectorAll(
            "[data-bank-term]"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        const term =
                            BANK_CLASSIC_TERMS.find(
                                item =>
                                    item.months ===
                                    Number(
                                        button.dataset.bankTerm
                                    )
                            );

                        if (!term) {
                            return;
                        }

                        activateBankProduct(
                            {
                                ...card,

                                selectedDepositTerm: {
                                    ...term
                                }
                            },
                            ctx
                        );

                    }
                );

            }
        );


    bindBankClick(
        "classicDepositCancelButton",
        () => {

            showBankCard(
                card,
                ctx
            );

        }
    );

}


/* =========================================================
   145.2.4. АКТИВНІ БАНКІВСЬКІ ПРОДУКТИ

   Викликається після кожного завершеного
   особистого ходу гравця.

   Захист від повторної обробки того самого ходу.
========================================================= */

function processActiveBankProducts(
    player
) {

    if (
        !player?.bank
    ) {
        return;
    }

    const bank =
        ensureBankState(player);


    bank.products.forEach(
        product => {

            if (
                product.active === false
            ) {
                return;
            }

            const elapsed =
                (
                    Number(
                        player.turnsCompleted
                    ) || 0
                ) - (
                    Number(
                        product.activatedTurn
                    ) || 0
                );

            if (
                elapsed <= 0 ||
                product.lastBankProcessedTurn === elapsed
            ) {
                return;
            }

            product.lastBankProcessedTurn =
                elapsed;


            const income = (
                amount,
                interval,
                end = Infinity
            ) => {

                if (
                    elapsed <= end &&
                    elapsed % interval === 0
                ) {

                    payBankIncome(
                        player,
                        product,
                        amount,
                        bankProductName(product)
                    );

                }

            };


            const close = (
                end,
                amount
            ) => {

                if (
                    elapsed >= end
                ) {

                    closeBankProductWithReturn(
                        player,
                        product,
                        amount,
                        bankProductName(product)
                    );

                }

            };


            switch (
                product.id
            ) {

                /* КЛАСИЧНИЙ СТРОКОВИЙ */

                case "deposit_classic":

                    processClassicDeposit(
                        player,
                        product,
                        elapsed
                    );

                    break;


                /* ЗРОСТАЮЧИЙ */

                case "deposit_growing":

                    income(
                        2000,
                        3
                    );

                    break;


                /* СКРИНЯ */

                case "deposit_chest":

                    income(
                        1000,
                        3
                    );

                    break;


                /* МІЙ ФОП */

                case "my_fop":

                    income(
                        2000,
                        2
                    );

                    if (
                        elapsed % 6 === 0
                    ) {

                        chargeBankPayment(
                            player,
                            product,
                            1000,
                            "Обслуговування «Мій ФОП»"
                        );

                    }

                    break;


                /* КРЕДИТ ГОТІВКОЮ */

                case "cash_credit":

                    processFixedLoan(
                        player,
                        product,
                        elapsed,
                        1000,
                        6,
                        "Кредит готівкою"
                    );

                    break;


                /* КРЕДИТНА КАРТКА */

                case "credit_card_100":

                    processFixedLoan(
                        player,
                        product,
                        elapsed,
                        1000,
                        3,
                        "100 днів 2.0"
                    );

                    break;


                /* PREMIUM КРЕДИТ */

                case "premium_cash_credit":

                    processFixedLoan(
                        player,
                        product,
                        elapsed,
                        6000,
                        6,
                        "Premium кредит"
                    );

                    break;


                /* PREMIUM КРЕДИТНА КАРТКА */

                case "premium_credit_card":

                    processFixedLoan(
                        player,
                        product,
                        elapsed,
                        3000,
                        3,
                        "Premium кредитна картка"
                    );

                    break;


                /* ОВДП */

                case "ovdp":

                    income(
                        1000,
                        2,
                        6
                    );

                    close(
                        7,
                        5000
                    );

                    break;


                /* ETF */

                case "etf":

                    income(
                        1000,
                        2,
                        6
                    );

                    close(
                        7,
                        4000
                    );

                    break;


                /* ПРОСТІ АКЦІЇ */

                case "common_stock":

                    income(
                        3000,
                        3,
                        6
                    );

                    close(
                        7,
                        5000
                    );

                    break;


                /* ПРИВІЛЕЙОВАНІ АКЦІЇ */

                case "preferred_stock":

                    income(
                        2000,
                        3,
                        6
                    );

                    close(
                        7,
                        5000
                    );

                    break;


                /* ДИВІДЕНДНІ АКЦІЇ */

                case "dividend_stock":

                    income(
                        5000,
                        3,
                        6
                    );

                    close(
                        7,
                        5000
                    );

                    break;


                /* ДЕПОЗИТНА ЛІНІЯ */

                case "deposit_line":

                    income(
                        2000,
                        2,
                        6
                    );

                    close(
                        6,
                        6000
                    );

                    break;


                /* ВАЛЮТНИЙ РАХУНОК */

                case "currency_account":

                    income(
                        2000,
                        1,
                        6
                    );

                    close(
                        6,
                        6000
                    );

                    break;


                /* ЕКВАЙРИНГ */

                case "acquiring":

                    income(
                        2000,
                        1,
                        6
                    );

                    close(
                        6,
                        0
                    );

                    break;


                /* БІЗНЕС ЕЛІТ+ */

                case "business_elite":

                    income(
                        3000,
                        2,
                        6
                    );

                    close(
                        6,
                        0
                    );

                    break;


                /* ВАРТА 24/7 */

                case "varta_247":

                    close(
                        6,
                        0
                    );

                    break;


                /* НАКОПИЧУВАЛЬНЕ СТРАХУВАННЯ ЖИТТЯ */

                case "life_insurance":

                    if (
                        elapsed % 2 === 0
                    ) {

                        chargeBankPayment(
                            player,
                            product,
                            2000,
                            "Внесок: страхування життя"
                        );

                    }

                    if (
                        elapsed % 6 === 0
                    ) {

                        payBankIncome(
                            player,
                            product,
                            8000,
                            "Накопичувальне страхування життя"
                        );

                    }

                    break;


                /* ІНТЕРНЕТ-ЕКВАЙРИНГ */

                case "internet_acquiring":

                    if (
                        elapsed >= 6 &&
                        !product.bonusPeriodEnded
                    ) {

                        product.bonusPeriodEnded =
                            true;

                        addLog(
                            "🏦 Інтернет-еквайринг: період бонусів завершено; сервіс залишається підключеним."
                        );

                    }

                    break;


                /* ОВЕРДРАФТ */

                case "overdraft":

                    if (
                        elapsed % 2 === 0
                    ) {

                        const interest =
                            Math.round(
                                (
                                    Number(
                                        product.principalDue
                                    ) || 0
                                ) * 0.2
                            );

                        if (
                            !chargeBankPayment(
                                player,
                                product,
                                interest,
                                "Відсотки за овердрафтом"
                            )
                        ) {

                            applyEffects(
                                player,
                                {
                                    reputation: -10,
                                    energy: -10
                                }
                            );

                            addLog(
                                "⚠️ Овердрафт: несплачений платіж, −10 репутації та −10 енергії."
                            );

                        }

                    }

                    break;

            }

        }
    );


    updatePlayerStatsUI();

}


/* =========================================================
   145.2.5. ДОХІД ВІД БАНКІВСЬКОГО ПРОДУКТУ
========================================================= */

function payBankIncome(
    player,
    product,
    amount,
    title
) {

    const value =
        Number(amount);

    if (
        !player ||
        !product ||
        product.active === false ||
        !Number.isFinite(value) ||
        value <= 0
    ) {
        return;
    }

    player.money += value;

    addLog(
        `🏦 ${title}: +${formatMoney(value)} грн`
    );

}


/* =========================================================
   145.2.6. ПЛАТІЖ ЗА БАНКІВСЬКИМ ПРОДУКТОМ
========================================================= */

function chargeBankPayment(
    player,
    product,
    amount,
    title
) {

    const value =
        Number(amount);

    if (
        !player ||
        !product ||
        product.active === false ||
        !Number.isFinite(value) ||
        value < 0
    ) {
        return false;
    }

    if (
        !value
    ) {
        return true;
    }

    if (
        player.money < value
    ) {

        addLog(
            `⚠️ ${title}: недостатньо грошей для платежу ${formatMoney(value)} грн`
        );

        return false;

    }

    player.money -= value;

    addLog(
        `🏦 ${title}: −${formatMoney(value)} грн`
    );

    return true;

}


/* =========================================================
   145.2.7. КРЕДИТ ІЗ ФІКСОВАНИМИ ПЛАТЕЖАМИ

   Основний платіж — кожного 2-го ходу.
   Несплачений платіж перевіряється наступного ходу.

   Для кредитної картки:
   за прострочення один окремий четвертий платіж.

   За погодженням:
   звичайна і Premium — додаткова плата 1 000 грн.
========================================================= */

function processFixedLoan(
    player,
    product,
    elapsedTurns,
    paymentAmount,
    totalPayments,
    title
) {

    if (
        !player ||
        !product ||
        product.active === false ||
        elapsedTurns <= 0 ||
        product.lastLoanProcessedTurn === elapsedTurns
    ) {
        return;
    }

    const card100 =
        [
            "credit_card_100",
            "premium_credit_card"
        ].includes(
            product.id
        );

    product.paymentsMade =
        Math.max(
            0,
            Number(
                product.paymentsMade
            ) || 0
        );

    product.pendingPayment =
        product.pendingPayment === true;

    /*
       Старі незавершені збереження
       також переводимо на одноразову плату.
    */

    product.lateFeeDue =
        card100 &&
        Number(product.lateFeeDue) > 0
            ? 1000
            : 0;

    const principalDone =
        product.paymentsMade >= totalPayments;

    if (
        principalDone &&
        !product.lateFeeDue
    ) {

        product.active = false;

        return;

    }

    const due =
        product.pendingPayment ||
        elapsedTurns % 2 === 0;

    if (!due) {
        return;
    }

    product.lastLoanProcessedTurn =
        elapsedTurns;


    /* ОКРЕМИЙ ЧЕТВЕРТИЙ ПЛАТІЖ */

    if (
        principalDone
    ) {

        if (
            chargeBankPayment(
                player,
                product,
                product.lateFeeDue,
                `${title}: додатковий четвертий платіж`
            )
        ) {

            product.lateFeeDue = 0;

            product.pendingPayment = false;

            product.active = false;

            addLog(
                `✅ ${title}: зобов'язання повністю виконано.`
            );

        } else {

            product.pendingPayment = true;

        }

        return;

    }


    /* ОСНОВНИЙ ПЛАТІЖ */

    if (
        chargeBankPayment(
            player,
            product,
            paymentAmount,
            title
        )
    ) {

        product.paymentsMade += 1;

        product.pendingPayment = false;

        addLog(
            `🏦 ${title}: платіж ${product.paymentsMade}/${totalPayments}.`
        );

        if (
            product.paymentsMade >= totalPayments &&
            !product.lateFeeDue
        ) {

            product.active = false;

            addLog(
                `✅ ${title}: зобов'язання повністю виконано.`
            );

        }

        return;

    }


    /* ГРОШЕЙ НЕ ВИСТАЧИЛО */

    if (
        card100
    ) {

        if (
            !product.lateFeeAssessed
        ) {

            product.lateFeeAssessed = true;

            product.lateFeeDue = 1000;

            addLog(
                `⚠️ ${title}: платіж перенесено. Після трьох основних платежів — один додатковий платіж 1 000 грн.`
            );

        }

    } else {

        applyEffects(
            player,
            {
                reputation: -2
            }
        );

        addLog(
            `⚠️ ${title}: платіж перенесено; −2 репутації.`
        );

    }

    product.pendingPayment = true;

}


/* =========================================================
   145.2.8. ЗАКРИТТЯ ПРОДУКТУ З ПОВЕРНЕННЯМ КОШТІВ

   Повернення можливе лише один раз.
========================================================= */

function closeBankProductWithReturn(
    player,
    product,
    amount,
    title
) {

    if (
        !player ||
        !product ||
        product.active === false
    ) {
        return;
    }

    const value =
        Math.max(
            0,
            Number(amount) || 0
        );

    player.money += value;

    product.active = false;

    addLog(
        `✅ ${title}: продукт завершено.${
            value
                ? ` Повернення +${formatMoney(value)} грн.`
                : ""
        }`
    );

}


/* =========================================================
   КЛАСИЧНИЙ СТРОКОВИЙ ДЕПОЗИТ — ЗАВЕРШЕННЯ

   1 місяць = 3 особисті ходи.
========================================================= */

function processClassicDeposit(
    player,
    product,
    elapsedTurns
) {

    if (
        !player ||
        !product ||
        product.active === false
    ) {
        return;
    }

    const months =
        Number(
            product.termMonths
        );

    /*
       Узгоджуємо календар і для депозитів,
       підключених до цієї заміни.
    */

    const termTurns =
        months > 0

            ? months * BANK_TURNS_PER_MONTH

            : Number(
                product.termTurns
            );

    if (
        !Number.isFinite(termTurns) ||
        termTurns <= 0 ||
        elapsedTurns < termTurns
    ) {
        return;
    }

    product.termTurns =
        termTurns;

    closeBankProductWithReturn(
        player,
        product,
        4000 + (
            Number(
                product.profit
            ) || 0
        ),
        "Класичний Строковий"
    );

}


/* =========================================================
   ПОВЕРНЕННЯ ОВЕРДРАФТУ

   Частково або повністю.
   Не завершує хід і не витрачає звернення.
========================================================= */

function repayBankOverdraft(
    player,
    product,
    amount
) {

    const value =
        Number(amount);

    if (
        !player ||
        product?.id !== "overdraft" ||
        product.active === false ||
        !Number.isFinite(value) ||
        value <= 0 ||
        value > player.money ||
        value > product.principalDue
    ) {
        return false;
    }

    product.principalDue -= value;

    player.money -= value;

    addLog(
        `🏦 Овердрафт: повернуто ${formatMoney(value)} грн; залишок ${formatMoney(product.principalDue)} грн.`
    );

    if (
        product.principalDue === 0
    ) {
        product.active = false;
    }

    return true;

}


function showBankOverdraftRepayment(
    product,
    audience = "business"
) {

    if (
        !product ||
        product.active === false
    ) {
        return;
    }


    openGameInfoModal(`

        <div class="bank-card-game-modal">

            <h2>
                Повернути овердрафт
            </h2>

            <p>
                Залишок боргу:
                ${formatMoney(product.principalDue || 0)} грн.
            </p>

            <input
                id="bankOverdraftAmount"
                type="number"
                min="1"
                step="1"
                max="${product.principalDue}"
                value="${
                    Math.min(
                        gameState.player.money,
                        product.principalDue
                    )
                }"
            >

            <p id="bankRepaymentMessage"></p>

            <button
                id="bankOverdraftRepayButton"
                class="main-game-btn"
            >
                ПОВЕРНУТИ
            </button>

            <button
                id="bankOverdraftBackButton"
                class="secondary-game-btn"
            >
                НАЗАД
            </button>

        </div>

    `);


    bindBankClick(
        "bankOverdraftRepayButton",
        () => {

            const amount =
                document
                    .getElementById(
                        "bankOverdraftAmount"
                    )
                    ?.value;

            if (
                repayBankOverdraft(
                    gameState.player,
                    product,
                    amount
                )
            ) {

                updateGameUI();

                showBankHub(
                    audience
                );

            } else {

                const message =
                    document.getElementById(
                        "bankRepaymentMessage"
                    );

                if (message) {

                    message.textContent =
                        "Вкажи суму в межах боргу та доступних грошей.";

                }

            }

        }
    );


    bindBankClick(
        "bankOverdraftBackButton",
        () => {

            showBankHub(
                audience
            );

        }
    );

}


/* =========================================================
   ІНТЕГРАЦІЯ З КАРТКАМИ — БОНУС ОНЛАЙН-ПРОДАЖУ

   Викликати тільки для відповідної події продажу.
   Будь-яке надходження грошей не є онлайн-продажем.

   До 4 бонусів за період.
   Не більше одного бонусу за хід.
========================================================= */

function recordBankOnlineSale(
    player
) {

    const product =
        player?.bank?.products?.find(
            item =>
                item?.id === "internet_acquiring" &&
                item.active !== false
        );

    if (!product) {
        return false;
    }

    const turn =
        Number(
            player.turnsCompleted
        ) || 0;

    const elapsed =
        turn - (
            Number(
                product.activatedTurn
            ) || 0
        );

    if (
        elapsed < 0 ||
        elapsed >= 6 ||
        product.bonusPeriodEnded ||
        (
            Number(
                product.saleBonusesPaid
            ) || 0
        ) >= 4 ||
        product.lastOnlineSaleTurn === turn
    ) {
        return false;
    }

    product.lastOnlineSaleTurn =
        turn;

    product.saleBonusesPaid =
        (
            Number(
                product.saleBonusesPaid
            ) || 0
        ) + 1;

    payBankIncome(
        player,
        product,
        2000,
        "Інтернет-еквайринг: онлайн-продаж"
    );

    return true;

}


/* =========================================================
   ІНТЕГРАЦІЯ З КАРТКАМИ — БІЗНЕС-ЗАХИСТ

   protectionType:
   payment_inconvenience — незручна оплата
   business             — відповідна бізнес-подія

   Повертає копію ефектів.
   Використаний захист не припиняє роботу продукту.
========================================================= */

function applyBankBusinessProtection(
    player,
    effects,
    protectionType
) {

    const productId =
        protectionType === "payment_inconvenience"

            ? "internet_acquiring"

            : protectionType === "business"

                ? "business_elite"

                : null;

    const product =
        player?.bank?.products?.find(
            item =>
                item?.id === productId &&
                item.active !== false &&
                !item.protectionUsed
        );

    if (!product) {
        return effects;
    }

    const elapsed =
        (
            Number(
                player.turnsCompleted
            ) || 0
        ) - (
            Number(
                product.activatedTurn
            ) || 0
        );

    if (
        elapsed < 0 ||
        elapsed >= 6
    ) {
        return effects;
    }

    const result = {
        ...(effects || {})
    };

    let protectedValue =
        0;

    if (
        productId === "business_elite" &&
        Number(result.energy) <= -15
    ) {

        result.energy =
            Number(result.energy) + 15;

        protectedValue =
            15;

    } else if (
        Number(result.money) < 0
    ) {

        protectedValue =
            Math.min(
                -Number(result.money),
                productId === "business_elite"
                    ? 5000
                    : 2000
            );

        result.money =
            Number(result.money) + protectedValue;

    }

    if (
        protectedValue > 0
    ) {

        product.protectionUsed =
            true;

        addLog(
            `🛡️ ${bankProductName(product)}: одноразовий захист використано.`
        );

    }

    return result;

}


/* =========================================================
   УЗГОДЖЕНІ ПОЯСНЕННЯ БАНКІВСЬКИХ КАРТОК

   Оновлюємо rulesText у спільній колоді,
   щоб показані правила відповідали механіці.

   Початкові ефекти карток тут не змінюємо.
========================================================= */

const BANK_UPDATED_RULES = {

    deposit_classic:
        "Вклади 4 000 грн. Обери 3, 6 або 12 місяців: 9, 18 або 36 особистих ходів. Наприкінці повертається вклад та дохід +1 000, +1 500 або +2 000 грн відповідно. 1 місяць = 3 особисті ходи.",

    credit_card_100:
        "Отримай +3 000 грн. Три платежі по 1 000 грн кожного 2-го ходу. За прострочення — один окремий четвертий платіж 1 000 грн. Несплачений платіж повторно перевіряється наступного ходу.",

    premium_credit_card:
        "Потрібно мати щонайменше 20 000 грн. Отримай +9 000 грн. Три платежі по 3 000 грн кожного 2-го ходу. Правила прострочення такі самі, як для звичайної картки: один четвертий платіж 1 000 грн.",

    life_insurance:
        "Сплати 2 000 грн за підключення. Далі внесок 2 000 грн кожного 2-го ходу; виплата 8 000 грн кожного 6-го ходу. Один раз захисти 15 енергії на картці Життя; накопичення продовжується.",

    internet_acquiring:
        "Сплати 3 000 грн. Протягом наступних 6 ходів після онлайн-продажу отримуй +2 000 грн, максимум 4 рази та не більше одного разу за хід. Один раз скасуй до 2 000 грн втрати через незручну оплату. Після 6 ходів бонуси завершуються, сервіс залишається підключеним.",

    business_elite:
        "Потрібно мати 25 000 грн. Сплати 10 000 грн. Протягом 6 ходів кожного 2-го ходу отримуй +3 000 грн. Один раз скасуй 15 енергії або до 5 000 грн втрати на відповідній бізнес-події.",

    overdraft:
        "Ліміти за знаннями/репутацією: 10/20 → 10 000 грн; 40/30 → 20 000 грн; 55/70 → 40 000 грн; 80/85 → 80 000 грн. Кожного 2-го ходу сплачуй 20% залишку боргу. Якщо бракує грошей — −10 репутації та −10 енергії. Повернути борг можна через Банк; після повного повернення відсотки припиняються."

};


BANK_CARD_DECK.forEach(
    card => {

        if (
            BANK_UPDATED_RULES[
                card.productId
            ]
        ) {

            card.rulesText =
                BANK_UPDATED_RULES[
                    card.productId
                ];

        }

    }
);


/* =========================================================
   КІНЕЦЬ ЗАМІНИ БАНКІВСЬКОГО БЛОКУ.

   Нижче залиш свій розділ:
   145.3. ЖУРНАЛ ХОДІВ
========================================================= */

/* =========================================================
   145.3. ЖУРНАЛ ХОДІВ
========================================================= */

function showGameJournal() {

    const history =
        Array.isArray(
            gameState.history
        )
            ? gameState.history
            : [];


    const rows =
        history.length

            ? history
                .slice()
                .reverse()
                .map(
                    item => {

                        const text =
                            typeof item === "string"
                                ? item
                                : item.text || "";


                        const time =
                            typeof item === "object"
                                ? item.time || ""
                                : "";


                        const turn =
                            typeof item === "object"
                                ? item.turn || ""
                                : "";


                        return `

                            <div class="journal-row">

                                <small>
                                    ${
                                        turn
                                            ? `Хід ${turn}`
                                            : ""
                                    }

                                    ${
                                        time
                                            ? ` • ${time}`
                                            : ""
                                    }
                                </small>

                                <div>
                                    ${text}
                                </div>

                            </div>

                        `;

                    }
                )
                .join("")

            : `

                <p>
                    Журнал поки порожній.
                </p>

              `;


    openGameInfoModal(`

        <div class="game-journal-modal">

            <h2>
                📋 Журнал ходів
            </h2>


            <div class="game-journal-list">

                ${rows}

            </div>


            <button
                id="closeJournalButton"
                class="main-game-btn"
            >
                ЗАКРИТИ
            </button>

        </div>

    `);


    document
        .getElementById(
            "closeJournalButton"
        )
        ?.addEventListener(
            "click",
            closeGameInfoModal
        );

}

/* =========================================================
   146. КНОПКА ЗАКРИТТЯ МОДАЛКИ

   Залишаємо універсальною.
========================================================= */

function closeGameInfoModal() {

    const modal =
        document.getElementById(
            "gameInfoModal"
        );
    if (!modal) {

        return;
    }

    modal.hidden =
        true;
}


/* =========================================================
   147. ФІНАЛЬНА ПЕРЕВІРКА
   ПЕРЕД СТАРТОМ ГРИ
========================================================= */

function validateGameData() {

    const problems = [];


    if (
        !Array.isArray(
            INNER_CARD_DECKS.event
        )
        ||
        INNER_CARD_DECKS.event.length ===
            0
    ) {

        problems.push(
            "Немає карток Подій малого кола"
        );

    }


    if (
        !Array.isArray(
            OUTER_CARD_DECKS.event
        )
        ||
        OUTER_CARD_DECKS.event.length ===
            0
    ) {

        problems.push(
            "Немає карток Подій великого кола"
        );

    }


    if (
        !Array.isArray(
            OUTER_CARD_DECKS.life
        )
        ||
        OUTER_CARD_DECKS.life.length ===
            0
    ) {

        problems.push(
            "Немає карток Життя"
        );

    }


    if (
        !Array.isArray(
            OUTER_CARD_DECKS.fate
        )
        ||
        OUTER_CARD_DECKS.fate.length ===
            0
    ) {

        problems.push(
            "Немає карток Долі"
        );

    }


    if (
        problems.length > 0
    ) {

        console.warn(
            "CV ЖИТТЯ — перевірка даних:",
            problems
        );

    }


    return (
        problems.length ===
        0
    );

}


/* =========================================================
   КІНЕЦЬ ЧАСТИНИ 5В

   ПІСЛЯ ЦЬОГО МАЄ ПРАЦЮВАТИ:

   START
      ↓
   КУБИК
      ↓
   РУХ
      ↓
   КЛІТИНКА
      ↓
   КАРТКА / LOUNGE / ACADEMY
      ↓
   ЗАВЕРШИТИ ХІД
      ↓
   AI 1
      ↓
   AI 2
      ↓
   КОЖЕН 3-Й ХІД:
   ЗАРПЛАТА
      ↓
   КАР'ЄРНЕ ЗРОСТАННЯ
      ↓
   НОВИЙ ХІД
      ↓
   ...
      ↓
   МРІЯ
      ↓
   ФІНАЛ ГРИ


   БАНК ПОКИ МОЖЕ БУТИ ПОРОЖНІМ.
   ПОПАДАННЯ НА БАНК
   НЕ ЗАВИСИТЬ ГРУ —
   МОЖНА ЗАВЕРШИТИ ХІД.
========================================================= */


showStartScreen();
