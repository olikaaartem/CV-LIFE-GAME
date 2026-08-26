/* =========================================================
   CV ЖИТТЯ — ЛЮБИ. МРІЙ. ДІЙ.
   SCRIPT.JS

   НОВА СТРУКТУРА

   - 1 робоча панель справа
   - велике прямокутне поле
   - внутрішній шлях 28
   - зовнішній шлях 56
   - START
   - ручний ПЕРЕХІД на велике поле
   - нижній HUD гравця
   - жовтий клікабельний профіль
   - кар'єрний прогрес по кліку
   - Мрія в центрі поля
   - прогрес Мрії по кліку
   - показники професій усередині кожної професії
   - 20 Мрій
   - картки:
       БЕРУ
       БЕРУ ЧАСТКОВО
       НЕ БЕРУ
   - ручне завершення ходу
   - повільні AI
   - журнал ходів
   - завершення гри
========================================================= */


const app =
    document.getElementById(
        "financeGameApp"
    );


/* =========================================================
   1. ОСНОВНІ НАЛАШТУВАННЯ
========================================================= */

const GAME_CONFIG = {

    innerCells: 28,
    outerCells: 56,

    aiPlayers: 2,

    aiThinkDelay: 1700,
    aiStepDelay: 330,
    aiResultDelay: 2300,

    incomeAmount: 10000

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
   3. ПРОФЕСІЇ + ПОКАЗНИКИ

   ВАЖЛИВО:

   level 1:
   stats = З ЧИМ СТАРТУЄ ГРАВЕЦЬ

   levels 2–4:
   requirements = ЩО ПОТРІБНО,
   ЩОБ ПЕРЕЙТИ НА ЦЕЙ РІВЕНЬ

   ТУТ ПОТІМ ПРОСТО МІНЯЄМО ЦИФРИ.
========================================================= */

const CAREER_SECTORS = [

    {
        id: "it",
        name: "IT Сфера",
        icon: "💻",

        levels: [

            {
                profession: {
                    boy: "Програміст",
                    girl: "Програмістка"
                },

                stats: {
                    money: 10000,
                    reputation: 10,
                    knowledge: 10,
                    energy: 100
                }
            },

            {
                profession: {
                    boy: "Керівник команди розробки",
                    girl: "Керівниця команди розробки"
                },

                requirements: {
                    money: 25000,
                    reputation: 25,
                    knowledge: 30,
                    energy: 80
                }
            },

            {
                profession: {
                    boy: "IT-директор",
                    girl: "IT-директорка"
                },

                requirements: {
                    money: 50000,
                    reputation: 45,
                    knowledge: 55,
                    energy: 70
                }
            },

            {
                profession: {
                    boy: "CTO",
                    girl: "Технічна директорка"
                },

                requirements: {
                    money: 100000,
                    reputation: 70,
                    knowledge: 80,
                    energy: 60
                }
            }

        ]
    },


    {
        id: "restaurant",
        name: "Ресторанний бізнес",
        icon: "☕",

        levels: [

            {
                profession: {
                    boy: "Бариста",
                    girl: "Бариста"
                },

                stats: {
                    money: 10000,
                    reputation: 10,
                    knowledge: 10,
                    energy: 100
                }
            },

            {
                profession: {
                    boy: "Адміністратор ресторану",
                    girl: "Адміністраторка ресторану"
                },

                requirements: {
                    money: 25000,
                    reputation: 25,
                    knowledge: 25,
                    energy: 80
                }
            },

            {
                profession: {
                    boy: "Керуючий рестораном",
                    girl: "Керуюча рестораном"
                },

                requirements: {
                    money: 50000,
                    reputation: 50,
                    knowledge: 50,
                    energy: 70
                }
            },

            {
                profession: {
                    boy: "Власник ресторану",
                    girl: "Власниця ресторану"
                },

                requirements: {
                    money: 100000,
                    reputation: 75,
                    knowledge: 70,
                    energy: 60
                }
            }

        ]
    },


    {
        id: "education",
        name: "Освіта",
        icon: "🎓",

        levels: [

            {
                profession: {
                    boy: "Вчитель",
                    girl: "Вчителька"
                },

                stats: {
                    money: 10000,
                    reputation: 10,
                    knowledge: 10,
                    energy: 100
                }
            },

            {
                profession: {
                    boy: "Директор закладу освіти",
                    girl: "Директорка закладу освіти"
                },

                requirements: {
                    money: 25000,
                    reputation: 30,
                    knowledge: 40,
                    energy: 80
                }
            },

            {
                profession: {
                    boy: "Ректор університету",
                    girl: "Ректорка університету"
                },

                requirements: {
                    money: 50000,
                    reputation: 55,
                    knowledge: 65,
                    energy: 70
                }
            },

            {
                profession: {
                    boy: "Міністр освіти і науки України",
                    girl: "Міністерка освіти і науки України"
                },

                requirements: {
                    money: 100000,
                    reputation: 85,
                    knowledge: 90,
                    energy: 60
                }
            }

        ]
    },


    {
        id: "art",
        name: "Мистецтво",
        icon: "🎨",

        levels: [

            {
                profession: {
                    boy: "Художник",
                    girl: "Художниця"
                },

                stats: {
                    money: 10000,
                    reputation: 10,
                    knowledge: 10,
                    energy: 100
                }
            },

            {
                profession: {
                    boy: "Артдиректор",
                    girl: "Артдиректорка"
                },

                requirements: {
                    money: 25000,
                    reputation: 25,
                    knowledge: 30,
                    energy: 80
                }
            },

            {
                profession: {
                    boy: "Власник артгалереї",
                    girl: "Власниця артгалереї"
                },

                requirements: {
                    money: 50000,
                    reputation: 50,
                    knowledge: 55,
                    energy: 70
                }
            },

            {
                profession: {
                    boy: "Директор музею",
                    girl: "Директорка музею"
                },

                requirements: {
                    money: 100000,
                    reputation: 75,
                    knowledge: 80,
                    energy: 60
                }
            }

        ]
    },


    {
        id: "medicine",
        name: "Медицина",
        icon: "🩺",

        levels: [

            {
                profession: {
                    boy: "Медбрат",
                    girl: "Медсестра"
                },

                stats: {
                    money: 10000,
                    reputation: 10,
                    knowledge: 10,
                    energy: 100
                }
            },

            {
                profession: {
                    boy: "Лікар",
                    girl: "Лікарка"
                },

                requirements: {
                    money: 25000,
                    reputation: 25,
                    knowledge: 40,
                    energy: 80
                }
            },

            {
                profession: {
                    boy: "Завідувач відділення",
                    girl: "Завідувачка відділення"
                },

                requirements: {
                    money: 50000,
                    reputation: 50,
                    knowledge: 70,
                    energy: 70
                }
            },

            {
                profession: {
                    boy: "Головний лікар",
                    girl: "Головна лікарка"
                },

                requirements: {
                    money: 100000,
                    reputation: 80,
                    knowledge: 90,
                    energy: 60
                }
            }

        ]
    },


    {
        id: "media",
        name: "Медіа",
        icon: "🎥",

        levels: [

            {
                profession: {
                    boy: "Контент-креатор",
                    girl: "Контент-креаторка"
                },

                stats: {
                    money: 10000,
                    reputation: 10,
                    knowledge: 10,
                    energy: 100
                }
            },

            {
                profession: {
                    boy: "YouTube-блогер",
                    girl: "YouTube-блогерка"
                },

                requirements: {
                    money: 25000,
                    reputation: 30,
                    knowledge: 30,
                    energy: 80
                }
            },

            {
                profession: {
                    boy: "Продюсер контенту",
                    girl: "Продюсерка контенту"
                },

                requirements: {
                    money: 50000,
                    reputation: 55,
                    knowledge: 55,
                    energy: 70
                }
            },

            {
                profession: {
                    boy: "Власник медіакомпанії",
                    girl: "Власниця медіакомпанії"
                },

                requirements: {
                    money: 100000,
                    reputation: 80,
                    knowledge: 75,
                    energy: 60
                }
            }

        ]
    },


    {
        id: "logistics",
        name: "Логістика",
        icon: "🚚",

        levels: [

            {
                profession: {
                    boy: "Логіст",
                    girl: "Логістка"
                },

                stats: {
                    money: 10000,
                    reputation: 10,
                    knowledge: 10,
                    energy: 100
                }
            },

            {
                profession: {
                    boy: "Координатор логістики",
                    girl: "Координаторка логістики"
                },

                requirements: {
                    money: 25000,
                    reputation: 25,
                    knowledge: 30,
                    energy: 80
                }
            },

            {
                profession: {
                    boy: "Менеджер з логістики",
                    girl: "Менеджерка з логістики"
                },

                requirements: {
                    money: 50000,
                    reputation: 45,
                    knowledge: 55,
                    energy: 70
                }
            },

            {
                profession: {
                    boy: "Директор з логістики",
                    girl: "Директорка з логістики"
                },

                requirements: {
                    money: 100000,
                    reputation: 70,
                    knowledge: 80,
                    energy: 60
                }
            }

        ]
    },


    {
        id: "finance",
        name: "Фінанси",
        icon: "🏦",

        levels: [

            {
                profession: {
                    boy: "Банківський працівник",
                    girl: "Банківська працівниця"
                },

                stats: {
                    money: 10000,
                    reputation: 10,
                    knowledge: 10,
                    energy: 100
                }
            },

            {
                profession: {
                    boy: "Бухгалтер",
                    girl: "Бухгалтерка"
                },

                requirements: {
                    money: 25000,
                    reputation: 25,
                    knowledge: 35,
                    energy: 80
                }
            },

            {
                profession: {
                    boy: "Фінансовий директор",
                    girl: "Фінансова директорка"
                },

                requirements: {
                    money: 50000,
                    reputation: 50,
                    knowledge: 65,
                    energy: 70
                }
            },

            {
                profession: {
                    boy: "Власник фінансової компанії",
                    girl: "Власниця фінансової компанії"
                },

                requirements: {
                    money: 100000,
                    reputation: 80,
                    knowledge: 85,
                    energy: 60
                }
            }

        ]
    },


    {
        id: "military",
        name: "Військова справа",
        icon: "🛡️",

        levels: [

            {
                profession: {
                    boy: "Оператор БпЛА",
                    girl: "Операторка БпЛА"
                },

                stats: {
                    money: 10000,
                    reputation: 10,
                    knowledge: 10,
                    energy: 100
                }
            },

            {
                profession: {
                    boy: "Інструктор",
                    girl: "Інструкторка"
                },

                requirements: {
                    money: 25000,
                    reputation: 30,
                    knowledge: 40,
                    energy: 85
                }
            },

            {
                profession: {
                    boy: "Офіцер",
                    girl: "Офіцерка"
                },

                requirements: {
                    money: 50000,
                    reputation: 55,
                    knowledge: 60,
                    energy: 75
                }
            },

            {
                profession: {
                    boy: "Начальник штабу",
                    girl: "Начальниця штабу"
                },

                requirements: {
                    money: 100000,
                    reputation: 85,
                    knowledge: 80,
                    energy: 65
                }
            }

        ]
    },


    {
        id: "agro",
        name: "Агро",
        icon: "🌾",

        levels: [

            {
                profession: {
                    boy: "Фермер",
                    girl: "Фермерка"
                },

                stats: {
                    money: 10000,
                    reputation: 10,
                    knowledge: 10,
                    energy: 100
                }
            },

            {
                profession: {
                    boy: "Агроном",
                    girl: "Агрономка"
                },

                requirements: {
                    money: 25000,
                    reputation: 25,
                    knowledge: 35,
                    energy: 80
                }
            },

            {
                profession: {
                    boy: "Керівник агропідприємства",
                    girl: "Керівниця агропідприємства"
                },

                requirements: {
                    money: 50000,
                    reputation: 50,
                    knowledge: 60,
                    energy: 70
                }
            },

            {
                profession: {
                    boy: "Власник агрохолдингу",
                    girl: "Власниця агрохолдингу"
                },

                requirements: {
                    money: 100000,
                    reputation: 75,
                    knowledge: 80,
                    energy: 60
                }
            }

        ]
    }

];


/* =========================================================
   4. МРІЇ — 20

   ТУТ ТЕЖ ПОТІМ ПРОСТО МІНЯЄМО ЦИФРИ.
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
   5. ТИПИ КОМІРОК
========================================================= */

const CELL_TYPES = {

    start: {
        id: "start",
        icon: "🚩",
        name: "Старт",
        description:
            "Тут починається твій життєвий шлях."
    },

    income: {
        id: "income",
        icon: "💰",
        name: "Дохід",
        description:
            "Отримання зарплати та інших доходів."
    },

    bank: {
        id: "bank",
        icon: "🏦",
        name: "Банк",
        description:
            "Фінансові рішення, можливості, кредити, накопичення та заощадження."
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
            "Життєва ситуація, яка впливає на твої ресурси."
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
            "Відпочинок, хобі та відновлення енергії."
    },

    academy: {
        id: "academy",
        icon: "🎓",
        name: "Академія & Soft Skills",
        description:
            "Розвиток знань, навичок та репутації."
    },

    transition: {
        id: "transition",
        icon: "➡️",
        name: "Перехід",
        description:
            "Ти завершив або завершила внутрішній шлях і можеш перейти на велике поле."
    },

    dreamCheck: {
        id: "dreamCheck",
        icon: "✨",
        name: "Перевірка Мрії",
        description:
            "Перевіряємо твій прогрес до Мрії."
    }

};


/* =========================================================
   6. ВНУТРІШНЄ ПОЛЕ — 28
========================================================= */

const INNER_BOARD = [

    "start",        // 1
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
   7. ЗОВНІШНЄ ПОЛЕ — 56
========================================================= */

const OUTER_BOARD = Array.from(
    { length: 56 },
    (_, index) => {

        const position =
            index + 1;


        if (
            position === 1
        ) {
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


        if (
            position === 56
        ) {
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
   8. ТЕСТОВІ КАРТКИ
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
                "Ти отримуєш складне завдання, яке може дати тобі новий досвід.",

            effects: {
                knowledge: 15,
                energy: -10
            }
        },

        {
            title: "Корисне знайомство",
            text:
                "Нове знайомство може відкрити перед тобою цікаві можливості.",

            effects: {
                reputation: 10
            }
        },

        {
            title: "Помилка — теж досвід",
            text:
                "Не все вдалося, але ти можеш зробити важливі висновки.",

            effects: {
                knowledge: 10,
                money: -5000
            }
        },

        {
            title: "Вдалий день",
            text:
                "Сьогодні обставини складаються на твою користь.",

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
                "Ти можеш грамотно розподілити свої гроші.",

            effects: {
                money: 15000,
                knowledge: 5
            }
        },

        {
            title: "Фінансова консультація",
            text:
                "Тобі пропонують отримати корисні знання про особисті фінанси.",

            effects: {
                knowledge: 10
            }
        },

        {
            title: "Несподівана витрата",
            text:
                "Виникла витрата, на яку доведеться використати частину накопичень.",

            effects: {
                money: -10000
            }
        },

        {
            title: "Вигідна можливість",
            text:
                "Перед тобою фінансова можливість, яка може принести прибуток.",

            effects: {
                money: 20000,
                reputation: 5
            }
        },

        {
            title: "Фінансова дисципліна",
            text:
                "Ти можеш відмовитися від імпульсивної покупки та зберегти гроші.",

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
                "У тебе з'явилась можливість відпочити та відновити сили.",

            effects: {
                energy: 15
            }
        },

        {
            title: "Новий курс",
            text:
                "Ти можеш інвестувати час у нове навчання.",

            effects: {
                knowledge: 15,
                energy: -5
            }
        },

        {
            title: "Допомога друзям",
            text:
                "Друзі просять твоєї допомоги.",

            effects: {
                reputation: 10,
                energy: -5
            }
        },

        {
            title: "Велика покупка",
            text:
                "Є можливість придбати річ, яку ти давно хотів або хотіла.",

            effects: {
                money: -15000,
                energy: 10
            }
        },

        {
            title: "Баланс",
            text:
                "Ти можеш виділити час на баланс між справами та відпочинком.",

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
                "Сьогодні тобі випала фінансова удача.",

            effects: {
                money: 20000
            }
        },

        {
            title: "Неочікуваний поворот",
            text:
                "Плани різко змінилися, але ситуація може дати тобі новий досвід.",

            effects: {
                knowledge: 10,
                energy: -10
            }
        },

        {
            title: "Приємний сюрприз",
            text:
                "Ти отримуєш гарну новину.",

            effects: {
                reputation: 10,
                energy: 10
            }
        },

        {
            title: "Складний день",
            text:
                "Обставини забрали частину твоєї енергії.",

            effects: {
                energy: -15
            }
        },

        {
            title: "Вдалий шанс",
            text:
                "Випадкова можливість може дати хороший результат.",

            effects: {
                money: 10000,
                reputation: 10
            }
        }

    ]

};


/* =========================================================
   9. СТАН ГРИ
========================================================= */

const gameState = {

    phase: "start",

    mode: null,

    currentTurn: "player",

    diceValue: null,

    target: null,

    pendingCard: null,

    waitingForPlayerDecision: false,

    selectedDreamId: null,

    turnNumber: 1,

    history: [],


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
   10. ДОПОМІЖНІ ФУНКЦІЇ
========================================================= */

function randomItem(array) {

    return array[
        Math.floor(
            Math.random() *
            array.length
        )
    ];

}


function randomNumber(
    min,
    max
) {

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


function setScreen(html) {

    app.innerHTML =
        html;


    window.scrollTo({
        top: 0,
        behavior: "auto"
    });

}


function formatMoney(value) {

    return Number(value)
        .toLocaleString(
            "uk-UA"
        );

}


function getRemainingValue(
    current,
    required
) {

    return Math.max(
        0,
        required - current
    );

}


function getCareerProfession(
    participant,
    levelIndex =
        participant.careerLevel
) {

    if (
        !participant.sector
    ) {
        return "";
    }


    const level =
        participant
            .sector
            .levels[
                levelIndex
            ];


    if (!level) {
        return "";
    }


    return level
        .profession[
            participant.gender
        ];

}


/* =========================================================
   11. ЖУРНАЛ
========================================================= */

function addHistory(
    participant,
    action,
    details = ""
) {

    gameState.history.unshift({

        turn:
            gameState.turnNumber,

        participantId:
            participant.id,

        participantName:
            participant.name,

        action,

        details,

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


    renderJournalIndicator();

}


function renderJournalIndicator() {

    const badge =
        document.getElementById(
            "journalCount"
        );


    if (badge) {

        badge.textContent =
            gameState.history.length;

    }

}


/* =========================================================
   12. СТАРТОВИЙ ЕКРАН
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
   13. ВИБІР РЕЖИМУ
========================================================= */

function showModeScreen() {

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
                            Підключимо наступним етапом
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
   14. СПІЛЬНА ГРА
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
   15. ІМ'Я + СТАТЬ
========================================================= */

function showNameScreen() {

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
                        Створімо твого героя.

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
   16. ЗБЕРЕЖЕННЯ ІМЕНІ
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
   17. ВИБІР ФІШКИ
========================================================= */

function showTokenSelection() {

    const tokensHTML =
        TOKENS.map(
            token => `

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
   18. ЗБЕРЕЖЕННЯ ФІШКИ
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
   19. ВИПАДКОВА ПРОФЕСІЯ
========================================================= */

function showCareerRandomScreen() {

    const careersHTML =
        CAREER_SECTORS.map(
            sector => `

                <div class="career-random-option">

                    <span class="career-random-icon">
                        ${sector.icon}
                    </span>

                    <strong>

                        ${
                            sector
                                .levels[0]
                                .profession[
                                    gameState.player.gender
                                ]
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
                    Життя визначить,
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
                        ГОТОВ${gameState.player.gender === "girl" ? "А" : "ИЙ"}?
                    </strong>

                    <span>
                        Натисни кнопку,
                        щоб отримати професію.
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
   20. ПРИЗНАЧЕННЯ ПРОФЕСІЇ
========================================================= */

function assignRandomCareer() {

    const sector =
        randomItem(
            CAREER_SECTORS
        );


    const player =
        gameState.player;


    player.sector =
        sector;


    player.careerLevel =
        0;


    const startStats =
        sector
            .levels[0]
            .stats;


    player.money =
        startStats.money;

    player.reputation =
        startStats.reputation;

    player.knowledge =
        startStats.knowledge;

    player.energy =
        startStats.energy;


    showCareerResult();

}


/* =========================================================
   21. ПОКАЗ ОТРИМАНОЇ ПРОФЕСІЇ
========================================================= */

function showCareerResult() {

    const player =
        gameState.player;


    const sector =
        player.sector;


    const profession =
        getCareerProfession(
            player
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
        oldButton.cloneNode(
            true
        );


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
   22. КАР'ЄРНА ДРАБИНА
========================================================= */

function showCareerReveal() {

    const player =
        gameState.player;


    const sector =
        player.sector;


    const levelsHTML =
        sector.levels
            .map(
                (level, index) => {

                    const profession =
                        level
                            .profession[
                                player.gender
                            ];


                    const current =
                        index ===
                        player.careerLevel;


                    const values =
                        index === 0
                        ? level.stats
                        : level.requirements;


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
                                    💰 ${formatMoney(values.money)}
                                </span>

                                <span>
                                    ⭐ ${values.reputation}
                                </span>

                                <span>
                                    🧠 ${values.knowledge}
                                </span>

                                <span>
                                    ⚡ ${values.energy}
                                </span>

                            </div>

                        </div>

                    `;

                }
            )
            .reverse()
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

                        Кар'єра — один зі шляхів,
                        який допоможе до неї дістатися.

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

                        Показники біля кожної сходинки —
                        це вимоги для переходу на цей рівень.

                    </p>


                    <div class="career-ladder">

                        <div class="career-goal-label">
                            🏆 КАР'ЄРНА ВЕРШИНА
                        </div>

                        ${levelsHTML}

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
   23. ВИБІР МРІЇ
========================================================= */

function showDreamSelection() {

    const dreamsHTML =
        DREAMS.map(
            dream => `

                <button
                    class="dream-option"
                    data-dream="${dream.id}"
                >

                    <div class="dream-icon">
                        ${dream.icon}
                    </div>

                    <div class="dream-name">
                        ${dream.name}
                    </div>

                </button>

            `
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

}


/* =========================================================
   24. ПОКАЗ МРІЇ
========================================================= */

function previewDream(
    dreamId
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
                Для цієї Мрії потрібно:
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


    details.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
    });

}


/* =========================================================
   25. ЗБЕРЕЖЕННЯ МРІЇ
========================================================= */

function selectDream(
    dreamId
) {

    const dream =
        DREAMS.find(
            item =>
                item.id ===
                dreamId
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
   26. AI
========================================================= */

function createAIPlayers() {

    gameState.opponents = [];


    const profiles = [

        {
            name: "Софія",
            gender: "girl"
        },

        {
            name: "Марко",
            gender: "boy"
        }

    ];


    const availableTokens =
        TOKENS.filter(
            token =>
                token.id !==
                gameState.player.token.id
        );


    profiles.forEach(
        (
            profile,
            index
        ) => {

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


            const start =
                sector
                    .levels[0]
                    .stats;


            gameState.opponents.push({

                id:
                    `ai-${index + 1}`,

                name:
                    profile.name,

                gender:
                    profile.gender,

                token,

                sector,

                careerLevel: 0,

                dream:
                    randomItem(
                        DREAMS
                    ),

                money:
                    start.money,

                reputation:
                    start.reputation,

                knowledge:
                    start.knowledge,

                energy:
                    start.energy,

                board: "inner",

                position: 1

            });

        }
    );

}


/* =========================================================
   27. ЕКРАН ПЕРЕД СТАРТОМ
========================================================= */

function showBeforeGameScreen() {

    const participants = [

        gameState.player,
        ...gameState.opponents

    ];


    const html =
        participants
            .map(
                participant => `

                    <div class="participant-preview-card">


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

                            ${getCareerProfession(participant)}

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

                `
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

                    ${html}

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
   28. ГОЛОВНИЙ ЕКРАН

   БІЛЬШЕ НЕМАЄ ЛІВОЇ ПАНЕЛІ.

   - лого поверх поля
   - велике поле
   - HUD унизу
   - робоча панель справа
========================================================= */

function showGameBoard() {

    gameState.phase =
        "game";


    gameState.currentTurn =
        "player";


    gameState.waitingForPlayerDecision =
        false;


    gameState.pendingCard =
        null;


    const player =
        gameState.player;


    const opponentsHTML =
        gameState.opponents
            .map(
                ai => `

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

                `
            )
            .join("");


    setScreen(`

        <section class="main-board-screen">


            <!-- =======================================
                 ВЕЛИКЕ ПОЛЕ
            ======================================== -->

            <main
                id="board"
                class="
                    game-board
                    rectangle-game-board
                "
            >


                <img
                    src="assets/logo.png"
                    class="board-floating-logo"
                    alt="CV Життя"
                >


                <div
                    id="outerBoard"
                    class="
                        rectangle-board
                        outer-rectangle-board
                    "
                ></div>


                <div
                    id="innerBoard"
                    class="
                        rectangle-board
                        inner-rectangle-board
                    "
                ></div>


                <!-- ЦЕНТР / МРІЯ -->

                <button
                    id="dreamCenter"
                    class="dream-center"
                >

                    <span class="dream-center-logo-text">
                        CV ЖИТТЯ
                    </span>

                    <span class="dream-center-small">
                        ЛЮБИ · МРІЙ · ДІЙ
                    </span>

                    <span class="dream-center-icon">
                        ${player.dream.icon}
                    </span>

                    <strong>
                        ${player.dream.name}
                    </strong>

                    <small>
                        Натисни, щоб побачити прогрес
                    </small>

                </button>


                <!-- ===================================
                     HUD ГРАВЦЯ
                ==================================== -->

                <div class="player-bottom-hud">


                    <button
                        id="careerHudButton"
                        class="player-career-hud"
                    >

                        <img
                            src="${player.token.image}"
                            alt="${player.token.name}"
                        >

                        <span class="hud-player-name">
                            ${player.name}
                        </span>

                        <span class="hud-player-profession">
                            ${getCareerProfession(player)}
                        </span>

                    </button>


                    <div class="hud-player-stats">

                        <span>
                            💰
                            <strong id="moneyValue">
                                ${formatMoney(player.money)}
                            </strong>
                        </span>

                        <span>
                            ⭐
                            <strong id="reputationValue">
                                ${player.reputation}
                            </strong>
                        </span>

                        <span>
                            🧠
                            <strong id="knowledgeValue">
                                ${player.knowledge}
                            </strong>
                        </span>

                        <span>
                            ⚡
                            <strong id="energyValue">
                                ${player.energy}
                            </strong>
                        </span>

                    </div>


                </div>


            </main>


            <!-- =======================================
                 РОБОЧА ПАНЕЛЬ СПРАВА
            ======================================== -->

            <aside class="game-work-panel">


                <div class="dice-section">

                    <div
                        id="diceTitle"
                        class="dice-title"
                    >
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
                        Райфик: кидай кубик 🎲
                    </div>

                </div>


                <!-- ПОТОЧНА КАРТКА -->

                <div
                    id="currentCardPanel"
                    class="current-card-panel"
                >

                    <div class="current-card-empty">

                        <span>?</span>

                        <strong>
                            ПОТОЧНА КАРТКА
                        </strong>

                        <small>
                            Тут з'явиться твоя подія
                        </small>

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


                <!-- НИЖНІ КНОПКИ -->

                <div class="work-panel-actions">


                    <button
                        id="cellInfoButton"
                        class="work-panel-button"
                    >
                        ℹ️ Як грати
                    </button>


                    <button
                        id="journalButton"
                        class="work-panel-button"
                    >
                        📜 Журнал ходів

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
                        ⏹ Завершити гру
                    </button>


                </div>


            </aside>


            <!-- МОДАЛКА -->

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


    createBoard();


    placeAllPieces();


    updatePlayerStatsUI();


    /* КУБИК */

    document
        .getElementById(
            "rollDiceButton"
        )
        .addEventListener(
            "click",
            rollDice
        );


    /* МРІЯ */

    document
        .getElementById(
            "dreamCenter"
        )
        .addEventListener(
            "click",
            () =>
                showDreamProgress(
                    false
                )
        );


    /* КАР'ЄРА */

    document
        .getElementById(
            "careerHudButton"
        )
        .addEventListener(
            "click",
            showCareerProgress
        );


    /* AI */

    document
        .querySelectorAll(
            ".mini-opponent-button"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () =>
                    showParticipantInfo(
                        button.dataset.playerId
                    )
            );

        });


    /* ЯК ГРАТИ */

    document
        .getElementById(
            "cellInfoButton"
        )
        .addEventListener(
            "click",
            showAllCellTypes
        );


    /* ЖУРНАЛ */

    document
        .getElementById(
            "journalButton"
        )
        .addEventListener(
            "click",
            showGameJournal
        );


    /* ЗАВЕРШИТИ */

    document
        .getElementById(
            "finishGameButton"
        )
        .addEventListener(
            "click",
            showFinishGameConfirm
        );


    document
        .getElementById(
            "gameInfoClose"
        )
        .addEventListener(
            "click",
            closeGameInfoModal
        );


    showRaifikCurrentCardMessage(

        "🚩 Усі починають зі START. Кидай кубик і починай свій шлях!"

    );

}


/* =========================================================
   29. ПОЛЕ
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
   30. КООРДИНАТИ ПРЯМОКУТНОГО ПОЛЯ

   Горизонтальні сторони довші,
   тому точки розподіляються
   по реальному "прямокутному" периметру.
========================================================= */

function getRectanglePosition(
    index,
    amount,
    direction = "clockwise"
) {

    let normalized =
        index / amount;


    if (
        direction ===
        "counterclockwise"
    ) {

        normalized =
            1 - normalized;

    }


    /*
       Умовний прямокутник:
       ширина = 1.6
       висота = 1

       Стартуємо:
       зверху по центру.
    */

    const width =
        1.6;

    const height =
        1;


    const total =
        width * 2 +
        height * 2;


    let distance =
        normalized *
        total;


    /*
       Старт = середина верхньої сторони.
       Тому зміщуємо на половину ширини.
    */

    distance +=
        width / 2;


    while (
        distance >= total
    ) {

        distance -=
            total;

    }


    let x;
    let y;


    /* ВЕРХ */

    if (
        distance <= width
    ) {

        x =
            (
                distance /
                width
            ) * 100;

        y = 0;

    }


    /* ПРАВА */

    else if (
        distance <=
        width + height
    ) {

        x = 100;

        y =
            (
                (
                    distance -
                    width
                ) /
                height
            ) * 100;

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
            ) * 100;

        y = 100;

    }


    /* ЛІВА */

    else {

        x = 0;

        y =
            100 -
            (
                (
                    distance -
                    width * 2 -
                    height
                ) /
                height
            ) * 100;

    }


    return {
        x,
        y
    };

}


/* =========================================================
   31. СТВОРЕННЯ ПОЛЯ
========================================================= */

function createRectangleBoard(
    container,
    boardData,
    boardName
) {

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


        const cell =
            document.createElement(
                "div"
            );


        cell.className =
            `board-cell ${boardName}-cell`;


        cell.dataset.board =
            boardName;


        cell.dataset.position =
            i;


        cell.dataset.type =
            typeId;


        if (
            typeId === "start"
        ) {

            cell.classList.add(
                "start-board-cell"
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
            [
                "income",
                "lounge",
                "academy",
                "dreamCheck"
            ].includes(
                typeId
            )
        ) {

            cell.classList.add(
                "special-board-cell"
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
                typeId === "start"
                ? `
                    <span class="cell-special-label">
                        START
                    </span>
                  `
                : ""
            }

            ${
                typeId === "transition"
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
            () =>
                handleBoardCellClick(
                    cell
                )
        );


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


        container.appendChild(
            cell
        );

    }

}


/* =========================================================
   32. КЛІК ПО КОМІРЦІ
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


    showCellTypeInfo(
        cell.dataset.type
    );

}


/* =========================================================
   33. ФІШКИ
========================================================= */

function placeAllPieces() {

    placePiece(
        gameState.player,
        true
    );


    gameState.opponents
        .forEach(
            ai =>
                placePiece(
                    ai,
                    false
                )
        );

}


/* =========================================================
   34. ОДНА ФІШКА
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
   35. КУБИК
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
            "player" ||
        gameState.target ||
        gameState.waitingForPlayerDecision
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


        await delay(
            80
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


    addHistory(

        gameState.player,

        `🎲 Кубик: ${value}`,

        ""

    );

}


/* =========================================================
   36. РОЗРАХУНОК ЦІЛІ
========================================================= */

function calculateDestination(
    participant,
    steps
) {

    if (
        participant.board ===
        "inner"
    ) {

        const raw =
            participant.position +
            steps;


        /*
           На першому маршруті
           НЕ перестрибуємо через 28.

           Якщо хід мав би піти далі —
           зупиняємось на переході.
        */

        return {

            board: "inner",

            position:
                Math.min(
                    raw,
                    GAME_CONFIG.innerCells
                )

        };

    }


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
   37. РУХ ГРАВЦЯ
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


    gameState.waitingForPlayerDecision =
        true;


    addHistory(

        player,

        `Перехід на комірку ${position}`,

        board === "inner"
        ? "Внутрішній шлях"
        : "Зовнішній шлях"

    );


    if (
        board === "inner" &&
        position ===
            GAME_CONFIG.innerCells
    ) {

        showTransitionCard();

        return;

    }


    await resolvePlayerCell();

}


/* =========================================================
   38. РУЧНИЙ ПЕРЕХІД НА ВЕЛИКЕ ПОЛЕ
========================================================= */

function showTransitionCard() {

    const panel =
        document.getElementById(
            "currentCardPanel"
        );


    panel.innerHTML = `

        <div class="
            revealed-current-card
            transition-card
        ">

            <div class="revealed-card-type">
                ➡️ ПЕРЕХІД
            </div>


            <h3>
                Перший етап завершено! 🎉
            </h3>


            <p>

                Ти пройшов або пройшла
                внутрішній життєвий шлях.

                <br><br>

                Тепер час перейти
                на велике поле.

            </p>


            <button
                id="confirmTransitionButton"
                class="main-game-btn"
            >
                ПЕРЕЙТИ НА ВЕЛИКИЙ ШЛЯХ →
            </button>

        </div>

    `;


    document
        .getElementById(
            "confirmTransitionButton"
        )
        .addEventListener(
            "click",
            transitionPlayerToOuterBoard
        );

}


function transitionPlayerToOuterBoard() {

    const player =
        gameState.player;


    player.board =
        "outer";


    player.position =
        1;


    const cell =
        document.querySelector(
            `.outer-cell[data-position="1"]`
        );


    if (cell) {

        movePieceDOM(
            player.id,
            cell
        );

    }


    addHistory(

        player,

        "➡️ Перехід на велике поле",

        "Старт зовнішнього життєвого шляху"

    );


    /*
       Зовнішня комірка 1 = дохід.
    */

    applyEffects(
        player,
        {
            money:
                GAME_CONFIG.incomeAmount
        }
    );


    showManualResultCard(

        CELL_TYPES.income,

        "Новий життєвий етап",

        "Ти переходиш на велике поле та отримуєш дохід.",

        {
            money:
                GAME_CONFIG.incomeAmount
        }

    );

}


/* =========================================================
   39. DOM РУХ
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
   40. ТИП КОМІРКИ
========================================================= */

function getParticipantCellType(
    participant
) {

    const boardData =
        participant.board ===
            "inner"
        ? INNER_BOARD
        : OUTER_BOARD;


    return boardData[
        participant.position - 1
    ];

}


/* =========================================================
   41. ОБРОБКА КОМІРКИ
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


    switch (
        typeId
    ) {


        case "start":

            showManualResultCard(

                type,

                "Твій шлях починається",

                "Ти на старті. Попереду багато рішень і можливостей.",

                {}

            );

            break;


        case "income":

            applyEffects(

                player,

                {
                    money:
                        GAME_CONFIG.incomeAmount
                }

            );


            showManualResultCard(

                type,

                "Отримання доходу",

                "Ти отримуєш свій дохід.",

                {
                    money:
                        GAME_CONFIG.incomeAmount
                }

            );

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


            showManualResultCard(

                type,

                "Lounge & Хобі",

                "Ти відпочиваєш і відновлюєш сили.",

                {
                    energy: 15
                }

            );

            break;


        case "academy":

            applyEffects(

                player,

                {
                    knowledge: 15,
                    reputation: 5
                }

            );


            showManualResultCard(

                type,

                "Академія & Soft Skills",

                "Нові знання та навички допомагають тобі рухатися вперед.",

                {
                    knowledge: 15,
                    reputation: 5
                }

            );

            break;


        case "dreamCheck":

            showDreamProgress(
                true
            );

            break;


        default:

            showEndTurnButtonOnly();

    }

}


/* =========================================================
   42. РАЙФИК
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
   43. 3 КАРТКИ
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
                            (
                                card,
                                index
                            ) => `

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
   44. ЖИТТЯ — ЧИСЛО
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
        !Number.isInteger(
            value
        ) ||
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
   45. ДОЛЯ
========================================================= */

async function showRandomFateCard() {

    showRaifikCurrentCardMessage(

        "⚡ Доля обирає картку..."

    );


    await delay(
        1200
    );


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
   46. ОБРАНА КАРТКА
========================================================= */

function resolveChosenPlayerCard(
    deckName,
    card
) {

    gameState.pendingCard = {

        deckName,
        card

    };


    gameState.waitingForPlayerDecision =
        true;


    showDecisionCard(
        deckName,
        card
    );

}


/* =========================================================
   47. РІШЕННЯ
========================================================= */

function showDecisionCard(
    deckName,
    card
) {

    const panel =
        document.getElementById(
            "currentCardPanel"
        );


    const type =
        CELL_TYPES[
            deckName
        ];


    panel.innerHTML = `

        <div
            class="
                revealed-current-card
                decision-card
            "
        >


            <div class="revealed-card-type">

                ${type.icon}
                ${type.name}

            </div>


            <h3>
                ${card.title}
            </h3>


            <p class="decision-card-text">
                ${card.text}
            </p>


            <div class="card-effect-title">
                Якщо погодишся:
            </div>


            <div class="revealed-card-effects">

                ${effectsHTML(
                    card.effects
                )}

            </div>


            <div class="card-question">
                Що робимо?
            </div>


            <div class="card-decision-buttons">


                <button
                    id="acceptCardButton"
                    class="
                        card-action-btn
                        accept-card-btn
                    "
                >
                    ✓ БЕРУ
                </button>


                <button
                    id="partialCardButton"
                    class="
                        card-action-btn
                        partial-card-btn
                    "
                >
                    ◐ БЕРУ ЧАСТКОВО
                </button>


                <button
                    id="declineCardButton"
                    class="
                        card-action-btn
                        decline-card-btn
                    "
                >
                    ✕ НЕ БЕРУ
                </button>


            </div>


        </div>

    `;


    document
        .getElementById(
            "acceptCardButton"
        )
        .addEventListener(
            "click",
            () =>
                acceptCurrentCard(
                    "full"
                )
        );


    document
        .getElementById(
            "partialCardButton"
        )
        .addEventListener(
            "click",
            () =>
                acceptCurrentCard(
                    "partial"
                )
        );


    document
        .getElementById(
            "declineCardButton"
        )
        .addEventListener(
            "click",
            () =>
                acceptCurrentCard(
                    "decline"
                )
        );

}


/* =========================================================
   48. ЗАСТОСУВАННЯ РІШЕННЯ
========================================================= */

function acceptCurrentCard(
    choice
) {

    if (
        !gameState.pendingCard
    ) {
        return;
    }


    const {
        deckName,
        card
    } =
        gameState.pendingCard;


    let effects = {};


    if (
        choice === "full"
    ) {

        effects = {
            ...card.effects
        };

    }


    if (
        choice === "partial"
    ) {

        Object
            .entries(
                card.effects
            )
            .forEach(
                (
                    [
                        key,
                        value
                    ]
                ) => {

                    effects[key] =
                        Math.round(
                            value *
                            0.5
                        );

                }
            );

    }


    if (
        choice !== "decline"
    ) {

        applyEffects(
            gameState.player,
            effects
        );

    }


    const choiceText =

        choice === "full"
        ? "БЕРУ"

        : choice === "partial"
        ? "БЕРУ ЧАСТКОВО"

        : "НЕ БЕРУ";


    addHistory(

        gameState.player,

        `${CELL_TYPES[deckName].icon} ${card.title}`,

        `${choiceText} · ${effectsHistoryText(effects)}`

    );


    showCardDecisionResult(

        deckName,
        card,
        choice,
        effects

    );


    gameState.pendingCard =
        null;

}


/* =========================================================
   49. РЕЗУЛЬТАТ КАРТКИ
========================================================= */

function showCardDecisionResult(
    deckName,
    card,
    choice,
    effects
) {

    const panel =
        document.getElementById(
            "currentCardPanel"
        );


    const type =
        CELL_TYPES[
            deckName
        ];


    const text =

        choice === "full"
        ? "Ти вирішуєш скористатися цією можливістю."

        : choice === "partial"
        ? "Ти використовуєш можливість частково."

        : "Ти вирішуєш відмовитися.";


    panel.innerHTML = `

        <div
            class="
                revealed-current-card
                card-result-card
            "
        >


            <div class="revealed-card-type">
                ${type.icon}
                ${type.name}
            </div>


            <h3>
                ${card.title}
            </h3>


            <p>
                ${text}
            </p>


            ${
                Object.keys(
                    effects
                ).length

                ? `

                    <div class="revealed-card-effects">

                        ${effectsHTML(
                            effects
                        )}

                    </div>

                  `

                : `

                    <div class="no-card-effect">
                        Показники не змінилися.
                    </div>

                  `
            }


            <button
                id="finishTurnButton"
                class="
                    main-game-btn
                    finish-turn-btn
                "
            >
                ЗАВЕРШИТИ ХІД →
            </button>


        </div>

    `;


    document
        .getElementById(
            "finishTurnButton"
        )
        .addEventListener(
            "click",
            finishPlayerTurn
        );

}


/* =========================================================
   50. АВТОМАТИЧНІ РЕЗУЛЬТАТИ
========================================================= */

function showManualResultCard(
    type,
    title,
    text,
    effects
) {

    gameState.waitingForPlayerDecision =
        true;


    const panel =
        document.getElementById(
            "currentCardPanel"
        );


    panel.innerHTML = `

        <div
            class="
                revealed-current-card
                automatic-result-card
            "
        >


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


            <button
                id="continueTurnButton"
                class="
                    main-game-btn
                    finish-turn-btn
                "
            >
                ПРОДОВЖИТИ →
            </button>


        </div>

    `;


    addHistory(

        gameState.player,

        `${type.icon} ${title}`,

        effectsHistoryText(
            effects
        )

    );


    document
        .getElementById(
            "continueTurnButton"
        )
        .addEventListener(
            "click",
            finishPlayerTurn
        );

}


/* =========================================================
   51. ЗАВЕРШЕННЯ ХОДУ
========================================================= */

function finishPlayerTurn() {

    gameState.waitingForPlayerDecision =
        false;


    gameState.pendingCard =
        null;


    startAITurns();

}


/* =========================================================
   52. ЕФЕКТИ
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
            (
                [
                    key,
                    value
                ]
            ) => {

                if (
                    typeof participant[key] ===
                    "number"
                ) {

                    participant[key] +=
                        value;

                }

            }
        );


    participant.money =
        Math.max(
            0,
            participant.money
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


    participant.energy =
        Math.max(
            0,
            participant.energy
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
   53. ЕФЕКТИ HTML / ЖУРНАЛ
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
            (
                [
                    key,
                    value
                ]
            ) => `

                <span>

                    ${icons[key]}

                    ${
                        value > 0
                        ? "+"
                        : ""
                    }

                    ${formatMoney(
                        value
                    )}

                </span>

            `
        )
        .join("");

}


function effectsHistoryText(
    effects
) {

    if (
        !effects ||
        !Object.keys(
            effects
        ).length
    ) {

        return "";

    }


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
            (
                [
                    key,
                    value
                ]
            ) =>
                `${icons[key]} ${
                    value > 0
                    ? "+"
                    : ""
                }${formatMoney(value)}`
        )
        .join(" · ");

}


/* =========================================================
   54. ПОКАЗНИКИ HUD
========================================================= */

function updatePlayerStatsUI() {

    const player =
        gameState.player;


    const data = {

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
        .entries(
            data
        )
        .forEach(
            (
                [
                    id,
                    value
                ]
            ) => {

                const element =
                    document
                        .getElementById(
                            id
                        );


                if (
                    element
                ) {

                    element.textContent =
                        value;

                }

            }
        );

}


/* =========================================================
   55. КАР'ЄРНИЙ ПРОГРЕС
========================================================= */

function checkCareerProgress(
    participant
) {

    if (
        participant.careerLevel >=
        participant.sector.levels.length - 1
    ) {

        return;

    }


    const nextLevel =
        participant
            .sector
            .levels[
                participant.careerLevel + 1
            ];


    const required =
        nextLevel.requirements;


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


    participant.careerLevel++;


    addHistory(

        participant,

        "🎉 Кар'єрне зростання",

        `Новий рівень: ${
            getCareerProfession(
                participant
            )
        }`

    );


    updateCareerHud();

}


function updateCareerHud() {

    const player =
        gameState.player;


    const profession =
        document.querySelector(
            ".hud-player-profession"
        );


    if (
        profession
    ) {

        profession.textContent =
            getCareerProfession(
                player
            );

    }

}


/* =========================================================
   56. КЛІК ПО ЖОВТІЙ ПЛАШЦІ КАР'ЄРИ
========================================================= */

function showCareerProgress() {

    const player =
        gameState.player;


    const currentProfession =
        getCareerProfession(
            player
        );


    /*
       ВЖЕ ОСТАННІЙ РІВЕНЬ
    */

    if (
        player.careerLevel >=
        player.sector.levels.length - 1
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


                <h3>
                    ${player.sector.icon}
                    ${currentProfession}
                </h3>


                <div class="career-max-level">
                    🏆 Ти вже на найвищій
                    кар'єрній сходинці!
                </div>


            </div>

        `);


        return;

    }


    const nextLevel =
        player
            .sector
            .levels[
                player.careerLevel + 1
            ];


    const nextProfession =
        nextLevel
            .profession[
                player.gender
            ];


    const req =
        nextLevel.requirements;


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


            <div class="next-career-level">

                <span>
                    НАСТУПНА СХОДИНКА
                </span>

                <strong>
                    ${nextProfession}
                </strong>

            </div>


            <p class="progress-help-text">

                Ось що потрібно,
                щоб перейти на наступний рівень:

            </p>


            ${createRequirementRow(

                "💰",
                "Гроші",
                player.money,
                req.money

            )}


            ${createRequirementRow(

                "⭐",
                "Репутація",
                player.reputation,
                req.reputation

            )}


            ${createRequirementRow(

                "🧠",
                "Знання",
                player.knowledge,
                req.knowledge

            )}


            ${createRequirementRow(

                "⚡",
                "Енергія",
                player.energy,
                req.energy

            )}


        </div>

    `);

}


/* =========================================================
   57. МРІЯ
========================================================= */

function showDreamProgress(
    turnCheck = false
) {

    const player =
        gameState.player;


    const dream =
        player.dream;


    const req =
        dream.requirements;


    const ready =

        player.money >= req.money &&
        player.reputation >= req.reputation &&
        player.knowledge >= req.knowledge &&
        player.energy >= req.energy;


    openGameInfoModal(`

        <div class="dream-progress-popup">


            <div class="dream-confirmed-icon">
                ${dream.icon}
            </div>


            <h2>
                ТВОЯ МРІЯ
            </h2>


            <h3>
                ${dream.name}
            </h3>


            ${
                turnCheck

                ? `

                    <div
                        class="
                            dream-check-message
                            ${
                                ready
                                ? "dream-ready"
                                : "dream-not-ready"
                            }
                        "
                    >

                        ${
                            ready

                            ? `
                                🎉 У тебе вже достатньо
                                ресурсів для Мрії!
                              `

                            : `
                                Мрія вже ближче.
                                Подивись,
                                чого ще не вистачає.
                              `
                        }

                    </div>

                  `

                : ""
            }


            ${createRequirementRow(

                "💰",
                "Гроші",
                player.money,
                req.money

            )}


            ${createRequirementRow(

                "⭐",
                "Репутація",
                player.reputation,
                req.reputation

            )}


            ${createRequirementRow(

                "🧠",
                "Знання",
                player.knowledge,
                req.knowledge

            )}


            ${createRequirementRow(

                "⚡",
                "Енергія",
                player.energy,
                req.energy

            )}


            ${
                turnCheck

                ? `

                    <button
                        id="dreamContinueButton"
                        class="main-game-btn"
                    >
                        ПРОДОВЖИТИ →
                    </button>

                  `

                : ""
            }


        </div>

    `);


    if (
        turnCheck
    ) {

        gameState.waitingForPlayerDecision =
            true;


        document
            .getElementById(
                "dreamContinueButton"
            )
            .addEventListener(
                "click",
                () => {

                    closeGameInfoModal();

                    finishPlayerTurn();

                }
            );

    }

}


/* =========================================================
   58. УНІВЕРСАЛЬНИЙ РЯДОК ПРОГРЕСУ

   У тебе
   Потрібно
   Ще бракує
========================================================= */

function createRequirementRow(
    icon,
    label,
    current,
    required
) {

    const remaining =
        getRemainingValue(
            current,
            required
        );


    const percent =
        Math.min(
            100,
            Math.round(
                (
                    current /
                    required
                ) *
                100
            )
        );


    return `

        <div class="requirement-progress-row">


            <div class="requirement-progress-head">

                <strong>
                    ${icon} ${label}
                </strong>

                <span>
                    ${percent}%
                </span>

            </div>


            <div class="requirement-values">


                <div>

                    <small>
                        У тебе
                    </small>

                    <strong>
                        ${formatMoney(current)}
                    </strong>

                </div>


                <div>

                    <small>
                        Потрібно
                    </small>

                    <strong>
                        ${formatMoney(required)}
                    </strong>

                </div>


                <div>

                    <small>
                        Ще бракує
                    </small>

                    <strong>

                        ${
                            remaining === 0
                            ? "✓ Готово"
                            : formatMoney(
                                remaining
                            )
                        }

                    </strong>

                </div>


            </div>


            <div class="requirement-progress-bar">

                <div
                    class="requirement-progress-fill"
                    style="width:${percent}%"
                ></div>

            </div>


        </div>

    `;

}


/* =========================================================
   59. AI — ПОЧАТОК
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


    if (
        button
    ) {

        button.disabled =
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


    gameState.turnNumber++;


    gameState.currentTurn =
        "player";


    gameState.waitingForPlayerDecision =
        false;


    if (
        button
    ) {

        button.disabled =
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
            "Твій хід";

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


    showRaifikCurrentCardMessage(

        `${gameState.player.name}, твій хід. Кидай кубик 🎲`

    );

}


/* =========================================================
   60. AI ХІД
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


    if (
        title
    ) {

        title.textContent =
            `Хід: ${ai.name}`;

    }


    showRaifikCurrentCardMessage(

        `Зараз ходить ${ai.name}.`

    );


    await delay(
        GAME_CONFIG.aiThinkDelay
    );


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


    addHistory(

        ai,

        `🎲 Кубик: ${dice}`,

        ""

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
   61. РУХ AI
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


    /*
       AI також переходить
       із 28 на зовнішню 1.
    */

    if (
        ai.board ===
            "inner" &&
        ai.position ===
            GAME_CONFIG.innerCells
    ) {

        await delay(
            700
        );


        ai.board =
            "outer";


        ai.position =
            1;


        const cell =
            document.querySelector(
                `.outer-cell[data-position="1"]`
            );


        if (
            cell
        ) {

            movePieceDOM(
                ai.id,
                cell
            );

        }


        addHistory(

            ai,

            "➡️ Перехід на велике поле",

            ""

        );

    }

}


/* =========================================================
   62. AI КОМІРКА
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


    switch (
        typeId
    ) {


        case "income":

            applyEffects(
                ai,
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


            addHistory(

                ai,

                `${type.icon} ${card.title}`,

                effectsHistoryText(
                    card.effects
                )

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

            break;


        case "academy":

            applyEffects(
                ai,
                {
                    knowledge: 15,
                    reputation: 5
                }
            );

            break;

    }

}


/* =========================================================
   63. AI RESULT
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

                <div class="revealed-card-effects">

                    ${effectsHTML(
                        effects
                    )}

                </div>

            </div>

        </div>

    `;

}


/* =========================================================
   64. ІНФО ПРО AI
========================================================= */

function showParticipantInfo(
    participantId
) {

    const participant =
        gameState.opponents
            .find(
                item =>
                    item.id ===
                    participantId
            );


    if (!participant) {
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

                ${getCareerProfession(participant)}

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
                    participant.board ===
                    "inner"
                    ? "Внутрішній шлях"
                    : "Зовнішній шлях"
                }

                · комірка

                ${participant.position}

            </div>


        </div>

    `);

}


/* =========================================================
   65. ЯК ГРАТИ / ТИПИ КОМІРОК
========================================================= */

function showAllCellTypes() {

    const types = [

        CELL_TYPES.start,
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


    openGameInfoModal(`

        <div class="all-cell-types-popup">


            <h2>
                Як грати
            </h2>


            <p>
                Натискай на комірки,
                щоб дізнатися їх значення.
            </p>


            <div class="all-cell-types-list">

                ${
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
                        .join("")
                }

            </div>


        </div>

    `);

}


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
   66. ЖУРНАЛ ХОДІВ
========================================================= */

function showGameJournal() {

    const historyHTML =
        gameState.history.length

        ? gameState.history
            .map(
                entry => `

                    <div class="journal-entry">

                        <div class="journal-entry-head">

                            <strong>
                                ${entry.participantName}
                            </strong>

                            <span>
                                Хід ${entry.turn}
                                · ${entry.time}
                            </span>

                        </div>


                        <div class="journal-entry-action">
                            ${entry.action}
                        </div>


                        ${
                            entry.details

                            ? `

                                <div class="journal-entry-details">
                                    ${entry.details}
                                </div>

                              `

                            : ""
                        }


                    </div>

                `
            )
            .join("")

        : `

            <div class="journal-empty">
                Ходів ще немає.
            </div>

          `;


    openGameInfoModal(`

        <div class="game-journal-popup">

            <h2>
                📜 Журнал ходів
            </h2>

            <p>
                Тут можна подивитися,
                що відбувалося у грі
                та які рішення приймали гравці.
            </p>

            <div class="journal-list">
                ${historyHTML}
            </div>

        </div>

    `);

}


/* =========================================================
   67. ЗАВЕРШИТИ ГРУ
========================================================= */

function showFinishGameConfirm() {

    openGameInfoModal(`

        <div class="finish-game-popup">

            <h2>
                Завершити гру?
            </h2>

            <p>
                Поточний прогрес буде втрачено.
            </p>


            <div class="finish-game-actions">


                <button
                    id="cancelFinishButton"
                    class="secondary-game-btn"
                >
                    ПРОДОВЖИТИ ГРУ
                </button>


                <button
                    id="confirmFinishButton"
                    class="main-game-btn"
                >
                    ЗАВЕРШИТИ
                </button>


            </div>

        </div>

    `);


    document
        .getElementById(
            "cancelFinishButton"
        )
        .addEventListener(
            "click",
            closeGameInfoModal
        );


    document
        .getElementById(
            "confirmFinishButton"
        )
        .addEventListener(
            "click",
            resetGame
        );

}


function resetGame() {

    gameState.phase =
        "start";


    gameState.mode =
        null;


    gameState.currentTurn =
        "player";


    gameState.diceValue =
        null;


    gameState.target =
        null;


    gameState.pendingCard =
        null;


    gameState.waitingForPlayerDecision =
        false;


    gameState.selectedDreamId =
        null;


    gameState.turnNumber =
        1;


    gameState.history =
        [];


    gameState.player = {

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

    };


    gameState.opponents =
        [];


    showStartScreen();

}


/* =========================================================
   68. МОДАЛКА
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


    if (
        modal
    ) {

        modal.hidden =
            true;

    }

}


/* =========================================================
   69. ЗАПАСНА КНОПКА ЗАВЕРШИТИ ХІД
========================================================= */

function showEndTurnButtonOnly() {

    const panel =
        document.getElementById(
            "currentCardPanel"
        );


    panel.innerHTML = `

        <div class="revealed-current-card">

            <h3>
                Хід завершено
            </h3>

            <button
                id="finishTurnButton"
                class="main-game-btn"
            >
                ЗАВЕРШИТИ ХІД →
            </button>

        </div>

    `;


    document
        .getElementById(
            "finishTurnButton"
        )
        .addEventListener(
            "click",
            finishPlayerTurn
        );

}


/* =========================================================
   70. TARGET
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
   71. ЗАПУСК
========================================================= */

showStartScreen();


