const eightBallResponses = {
  affirmative: [
    { en: "It is certain", ru: "Бесспорно" },
    { en: "It is decidedly so", ru: "Определённо да" },
    { en: "Without a doubt", ru: "Без сомнения" },
    { en: "Yes definitely", ru: "Да, точно" },
    { en: "You may rely on it", ru: "Можешь на этом полагаться" },
    { en: "As I see it, yes", ru: "Как я вижу, да" },
    { en: "Most likely", ru: "Вероятнее всего" },
    { en: "Outlook good", ru: "Перспективы хорошие" },
    { en: "Yes", ru: "Да" },
    { en: "Signs point to yes", ru: "Знаки указывают на да" },
  ],
  negative: [
    { en: "Don't count on it", ru: "Не рассчитывай на это" },
    { en: "My reply is no", ru: "Мой ответ - нет" },
    { en: "My sources say no", ru: "Мои источники говорят нет" },
    { en: "Outlook not so good", ru: "Перспективы не очень хороши" },
    { en: "Very doubtful", ru: "Очень сомнительно" },
  ],
  idk: [
    { en: "Reply hazy, try again", ru: "Ответ неясен, попробуй снова" },
    { en: "Ask again later", ru: "Спроси позже" },
    { en: "Better not tell you now", ru: "Лучше не говорить тебе сейчас" },
    { en: "Cannot predict now", ru: "Невозможно предсказать сейчас" },
    { en: "Concentrate and ask again", ru: "Сосредоточься и спроси снова" },
  ],
};
const pool = yachtShuffle([...eightBallResponses.affirmative, ...eightBallResponses.idk, ...eightBallResponses.negative]);

export default defineEventHandler(async (event) => {
  const cookies = parseCookies(event);
  const answer = pool[randomIntFromInterval(0, pool.length)][cookies.i18n_redirected as "en" | "ru"];

  await new Promise(res => setTimeout(res, 1000));

  return {
    eightBallSays: answer,
  };
});
