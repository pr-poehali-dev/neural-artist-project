// Система понимания русского языка для нейросети
export class RussianNLP {
  private questionWords = [
    'что', 'как', 'где', 'когда', 'почему', 'зачем', 'кто', 'куда', 'откуда', 'сколько',
    'какой', 'какая', 'какое', 'какие', 'чей', 'чья', 'чьё', 'чьи'
  ];

  private greetings = [
    'привет', 'здравствуй', 'здравствуйте', 'добро пожаловать', 'салют',
    'доброе утро', 'добрый день', 'добрый вечер', 'хай', 'йо'
  ];

  private farewells = [
    'пока', 'до свидания', 'прощай', 'до встречи', 'увидимся',
    'пока-пока', 'чао', 'бай', 'до скорого'
  ];

  private positiveWords = [
    'хорошо', 'отлично', 'супер', 'круто', 'классно', 'замечательно',
    'прекрасно', 'великолепно', 'шикарно', 'потрясающе', 'нравится',
    'люблю', 'обожаю', 'восторге', 'радует', 'приятно'
  ];

  private negativeWords = [
    'плохо', 'ужасно', 'отвратительно', 'кошмар', 'страшно',
    'не нравится', 'ненавижу', 'бесит', 'раздражает', 'грустно',
    'печально', 'расстроен', 'злой', 'недоволен'
  ];

  private topics = {
    science: ['наука', 'физика', 'химия', 'биология', 'математика', 'астрономия', 'исследование'],
    technology: ['технологии', 'компьютер', 'программирование', 'интернет', 'ии', 'нейросеть', 'робот'],
    life: ['жизнь', 'семья', 'друзья', 'работа', 'учеба', 'дом', 'здоровье', 'счастье'],
    nature: ['природа', 'животные', 'растения', 'погода', 'море', 'лес', 'горы', 'река'],
    culture: ['культура', 'искусство', 'музыка', 'кино', 'книги', 'театр', 'живопись', 'литература'],
    food: ['еда', 'готовка', 'рецепт', 'ресторан', 'кухня', 'вкусно', 'блюдо', 'продукты'],
    sport: ['спорт', 'футбол', 'баскетбол', 'тренировка', 'фитнес', 'здоровье', 'игра', 'команда'],
    philosophy: ['философия', 'смысл', 'жизнь', 'мысли', 'размышления', 'вопросы', 'истина', 'бытие']
  };

  private responseTemplates = {
    greeting: [
      'Привет! Как дела?',
      'Здравствуйте! Рад вас видеть!',
      'Добро пожаловать! Как настроение?',
      'Салют! Что нового?',
      'Привет! Готов к интересному общению!'
    ],
    farewell: [
      'До свидания! Было приятно пообщаться!',
      'Пока! Увидимся позже!',
      'До встречи! Жду новых вопросов!',
      'Прощайте! Хорошего дня!',
      'Пока-пока! Заходите ещё!'
    ],
    positive: [
      'Рад, что вам понравилось!',
      'Отлично! Продолжаем в том же духе!',
      'Спасибо за позитивную оценку!',
      'Замечательно! Это меня мотивирует!',
      'Круто! Стараюсь для вас!'
    ],
    negative: [
      'Понимаю, постараюсь лучше.',
      'Извините, буду улучшаться.',
      'Принимаю критику, спасибо за честность.',
      'Учту ваши замечания для развития.',
      'Жаль, что не понравилось. Работаю над собой!'
    ],
    question: [
      'Интересный вопрос! Размышляю...',
      'Хороший вопрос! Позвольте подумать...',
      'Любопытно! Анализирую информацию...',
      'Отличный вопрос! Формулирую ответ...',
      'Интригующий вопрос! Обрабатываю данные...'
    ],
    default: [
      'Понимаю вас. Интересная тема!',
      'Да, это важная мысль.',
      'Согласен, стоит об этом подумать.',
      'Вы правы, это действительно так.',
      'Интересная точка зрения!'
    ]
  };

  // Анализ типа сообщения
  public analyzeMessageType(text: string): string {
    const lowercaseText = text.toLowerCase();
    
    if (this.containsWords(lowercaseText, this.greetings)) {
      return 'greeting';
    }
    
    if (this.containsWords(lowercaseText, this.farewells)) {
      return 'farewell';
    }
    
    if (this.containsWords(lowercaseText, this.positiveWords)) {
      return 'positive';
    }
    
    if (this.containsWords(lowercaseText, this.negativeWords)) {
      return 'negative';
    }
    
    if (this.containsWords(lowercaseText, this.questionWords)) {
      return 'question';
    }
    
    return 'default';
  }

  // Определение темы разговора
  public detectTopic(text: string): string {
    const lowercaseText = text.toLowerCase();
    
    for (const [topic, keywords] of Object.entries(this.topics)) {
      if (this.containsWords(lowercaseText, keywords)) {
        return topic;
      }
    }
    
    return 'general';
  }

  // Извлечение ключевых слов
  public extractKeywords(text: string): string[] {
    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 2);
    
    const stopWords = [
      'это', 'что', 'как', 'где', 'когда', 'почему', 'зачем', 'кто', 'куда',
      'для', 'при', 'над', 'под', 'про', 'без', 'через', 'после', 'перед',
      'или', 'если', 'чтобы', 'потому', 'поэтому', 'также', 'тоже',
      'можно', 'нужно', 'должен', 'будет', 'была', 'были', 'есть', 'имеет'
    ];
    
    return words.filter(word => !stopWords.includes(word));
  }

  // Генерация контекстного ответа
  public generateContextualResponse(text: string, topic: string, messageType: string): string {
    const templates = this.responseTemplates[messageType as keyof typeof this.responseTemplates] || this.responseTemplates.default;
    const baseResponse = templates[Math.floor(Math.random() * templates.length)];
    
    const keywords = this.extractKeywords(text);
    const keywordPhrase = keywords.length > 0 ? keywords.slice(0, 3).join(', ') : '';
    
    // Добавляем контекст по теме
    const topicResponses = this.getTopicResponse(topic, keywords);
    
    if (messageType === 'question' && topicResponses.length > 0) {
      return `${baseResponse} ${topicResponses[Math.floor(Math.random() * topicResponses.length)]}`;
    }
    
    if (keywordPhrase) {
      return `${baseResponse} Интересно говорить о: ${keywordPhrase}.`;
    }
    
    return baseResponse;
  }

  // Ответы по темам
  private getTopicResponse(topic: string, keywords: string[]): string[] {
    const responses: { [key: string]: string[] } = {
      science: [
        'Наука - это fascinating область знаний!',
        'Научные исследования помогают понять мир.',
        'Я люблю изучать научные факты и теории.',
        'Наука постоянно развивается и удивляет.'
      ],
      technology: [
        'Технологии меняют нашу жизнь каждый день.',
        'Программирование - это современное искусство.',
        'ИИ и нейросети - будущее человечества.',
        'Компьютеры становятся всё умнее.'
      ],
      life: [
        'Жизнь полна интересных моментов.',
        'Семья и друзья - главные ценности.',
        'Каждый день приносит новые возможности.',
        'Важно находить баланс между работой и отдыхом.'
      ],
      nature: [
        'Природа удивительна и прекрасна.',
        'Животные и растения - наши соседи по планете.',
        'Важно беречь окружающую среду.',
        'Природа даёт нам энергию и вдохновение.'
      ],
      culture: [
        'Культура обогащает нашу жизнь.',
        'Искусство выражает человеческие чувства.',
        'Музыка и кино создают особую атмосферу.',
        'Книги открывают новые миры.'
      ],
      food: [
        'Еда - это не только питание, но и удовольствие.',
        'Готовка может быть творческим процессом.',
        'Разные кухни мира имеют свои особенности.',
        'Вкусная еда объединяет людей.'
      ],
      sport: [
        'Спорт развивает тело и характер.',
        'Командные игры учат работать вместе.',
        'Физические упражнения полезны для здоровья.',
        'Спорт может быть очень зрелищным.'
      ],
      philosophy: [
        'Философские вопросы заставляют задуматься.',
        'Смысл жизни - вечная тема для размышлений.',
        'Каждый человек ищет свою истину.',
        'Мысли и идеи формируют наш мир.'
      ]
    };
    
    return responses[topic] || [];
  }

  // Проверка наличия слов в тексте
  private containsWords(text: string, words: string[]): boolean {
    return words.some(word => text.includes(word));
  }

  // Анализ эмоционального тона
  public analyzeEmotionalTone(text: string): 'positive' | 'negative' | 'neutral' {
    const lowercaseText = text.toLowerCase();
    
    let positiveScore = 0;
    let negativeScore = 0;
    
    this.positiveWords.forEach(word => {
      if (lowercaseText.includes(word)) positiveScore++;
    });
    
    this.negativeWords.forEach(word => {
      if (lowercaseText.includes(word)) negativeScore++;
    });
    
    if (positiveScore > negativeScore) return 'positive';
    if (negativeScore > positiveScore) return 'negative';
    return 'neutral';
  }

  // Генерация вопросов для продолжения диалога
  public generateFollowUpQuestions(topic: string): string[] {
    const questions: { [key: string]: string[] } = {
      science: [
        'Какая область науки вам наиболее интересна?',
        'Слышали ли вы о последних научных открытиях?',
        'Что думаете о будущем науки?'
      ],
      technology: [
        'Какие технологии изменили вашу жизнь?',
        'Как вы относитесь к развитию ИИ?',
        'Какую роль играют гаджеты в вашей жизни?'
      ],
      life: [
        'Что для вас самое важное в жизни?',
        'Какие у вас планы на будущее?',
        'Что делает вас счастливым?'
      ],
      general: [
        'Расскажите больше об этом.',
        'Что вас в этом интересует?',
        'Хотели бы обсудить что-то ещё?'
      ]
    };
    
    return questions[topic] || questions.general;
  }
}