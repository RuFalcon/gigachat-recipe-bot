# GigaChat Recipe Bot

Telegram бот, который помогает пользователям создавать рецепты блюд на основе имеющихся ингредиентов с помощью GigaChat API.

## Возможности

- Ввод ингредиентов для создания рецепта
- Генерация рецептов с помощью GigaChat API
- Форматированный вывод рецептов в Markdown
- Возможность создания нового рецепта после завершения текущего

## Требования

- Node.js (версия 14 или выше)
- npm или yarn
- Telegram Bot Token
- GigaChat API Token

## Установка

1. Клонируйте репозиторий:
```bash
git clone https://github.com/your-username/gigachat-recipe-bot.git
cd gigachat-recipe-bot
```

2. Установите зависимости:
```bash
npm install
# или
yarn install
```

3. Создайте файл `.env` в корневой директории проекта и добавьте в него следующие переменные:
```env
TG_API_TOKEN=your_telegram_bot_token
GIGACHAT_API_TOKEN=your_gigachat_api_token
```

4. Запустите бота:
```bash
npm start
# или
yarn start
```

## Использование

1. Отправьте команду `/start` боту в Telegram
2. Введите ингредиенты, которые у вас есть
3. Нажмите кнопку "Получить рецепт"
4. Получите сгенерированный рецепт
5. При желании нажмите "Новый рецепт" для создания другого рецепта

## Лицензия

MIT