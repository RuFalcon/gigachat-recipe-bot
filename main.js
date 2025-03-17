import TelegramBot from 'node-telegram-bot-api';
import { GigaChat } from 'gigachat-node';
import * as dotenv from 'dotenv'; 
dotenv.config();

// Ключ от Telegram Bot API
const TG_API_TOKEN = process.env.TG_API_TOKEN;
// Ключ от GigaChat API
const GIGACHAT_API_TOKEN = process.env.GIGACHAT_API_TOKEN;

const bot = new TelegramBot(TG_API_TOKEN, { polling: true });

let ingredients = [];
let isWaitingForIngredients = false;

// Инициализация класса GigaChat и передача объекта конфигурации в конструктор
const client = new GigaChat({
  clientSecretKey: GIGACHAT_API_TOKEN,
  isIgnoreTSL: true,
  isPersonal: true,
  autoRefreshToken: true,
});

const main = async () => {
  // Получение токена GigaChat для аутентификации запросов
  await client.createToken();

  bot.onText(/\/start/, (msg) => {
    ingredients = []; // Очищаем ингредиенты при старте
    isWaitingForIngredients = true; 
    bot.sendMessage(
      msg.chat.id,
      'Привет! Введи первый ингредиент из которого хочешь приготовить блюдо',
    );
  });

  bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const messageText = msg.text?.trim();

    if (!messageText) return;
    
    if (messageText === '/start') return;

    if (isWaitingForIngredients) {
        ingredients.push(messageText);
        bot.sendMessage(
          chatId,
          'Добавь ещё ингредиент или нажми на кнопку "Получить рецепт" если все ингредиенты уже указаны',
          {
            reply_markup: {
              inline_keyboard: [
                [{ text: 'Получить рецепт', callback_data: 'get_recipe' }],
              ],
            },
          },
        );
      }
  });

  // Обработчик нажатия на inline-кнопку
  bot.on('callback_query', async (query) => {
    const chatId = query.message.chat.id;
    const data = query.data;

    if (data === 'get_recipe') {
      // Вызываем функцию getRecipe только при нажатии на кнопку "Получить рецепт"
      isWaitingForIngredients = false;
      bot.sendMessage(chatId, 'Собираю рецепт, пожалуйста, подождите...');
      await getRecipe(chatId, ingredients.join(', '));
      ingredients.length = 0; 
    } else if (data === 'new_recipe') {
        isWaitingForIngredients = true;
        ingredients = [];
        bot.sendMessage(chatId, 'Хорошо, введи первый ингредиент для нового рецепта.');
    }

    // Отвечаем на callback_query, чтобы убрать "часики" на кнопке
    bot.answerCallbackQuery(query);
  });
};

const getRecipe = async (chatId, ingredient) => {
  try {
    // Отправка сообщения в GigaChat
    const response = await client.completion({
      model: 'GigaChat:latest',
      messages: [
        {
          role: 'user',
          content: `На основе данных ингредиентов: ${ingredient} напиши рецепт блюда, *отформатированный в Markdown*. Используй заголовки, списки и выделение текста.`,
        },
      ],
    });

    // Проверка на пустой ответ
    if (!response || !response.choices || response.choices.length === 0) {
      bot.sendMessage(chatId, 'Произошла ошибка при обработке запроса.');
      return;
    }

    const replyText = response.choices[0].message.content;

    // Отправка ответа пользователю с Markdown-разметкой
    bot.sendMessage(chatId, replyText, {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [{ text: 'Новый рецепт', callback_data: 'new_recipe' }],
          ],
        },
      });
  } catch (error) {
    console.error(error);
    // Обработка ошибок при запросе к GigaChat
    bot.sendMessage(
      chatId,
      'Произошла ошибка при общении с GigaChat. Попробуйте снова позже.',
    );
  }
};

main();
