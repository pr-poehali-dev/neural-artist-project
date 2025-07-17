// Простая нейросеть для обучения на текстах
export class NeuralNetwork {
  private weights: number[][];
  private biases: number[];
  private learningRate: number = 0.1;
  private vocabulary: Map<string, number> = new Map();
  private vocabSize: number = 1000;
  private inputSize: number = 50;
  private hiddenSize: number = 20;
  private outputSize: number = 50;

  constructor() {
    this.initializeWeights();
  }

  private initializeWeights(): void {
    // Инициализация весов случайными значениями
    this.weights = [
      this.randomMatrix(this.hiddenSize, this.inputSize),
      this.randomMatrix(this.outputSize, this.hiddenSize)
    ];
    
    this.biases = [
      new Array(this.hiddenSize).fill(0).map(() => Math.random() * 0.1 - 0.05),
      new Array(this.outputSize).fill(0).map(() => Math.random() * 0.1 - 0.05)
    ];
  }

  private randomMatrix(rows: number, cols: number): number[][] {
    return new Array(rows).fill(0).map(() =>
      new Array(cols).fill(0).map(() => Math.random() * 0.2 - 0.1)
    );
  }

  private sigmoid(x: number): number {
    return 1 / (1 + Math.exp(-Math.max(-500, Math.min(500, x))));
  }

  private sigmoidDerivative(x: number): number {
    return x * (1 - x);
  }

  private softmax(arr: number[]): number[] {
    const max = Math.max(...arr);
    const exp = arr.map(x => Math.exp(x - max));
    const sum = exp.reduce((a, b) => a + b, 0);
    return exp.map(x => x / sum);
  }

  // Токенизация текста
  private tokenize(text: string): string[] {
    return text.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 0);
  }

  // Создание словаря
  private buildVocabulary(texts: string[]): void {
    const wordCount = new Map<string, number>();
    
    texts.forEach(text => {
      const tokens = this.tokenize(text);
      tokens.forEach(token => {
        wordCount.set(token, (wordCount.get(token) || 0) + 1);
      });
    });

    // Сортировка по частоте и выбор топ-слов
    const sortedWords = Array.from(wordCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, this.vocabSize - 1);

    this.vocabulary.clear();
    this.vocabulary.set('<UNK>', 0);
    sortedWords.forEach(([word], index) => {
      this.vocabulary.set(word, index + 1);
    });
  }

  // Векторизация текста
  private vectorize(text: string): number[] {
    const tokens = this.tokenize(text);
    const vector = new Array(this.inputSize).fill(0);
    
    tokens.forEach(token => {
      const index = this.vocabulary.get(token) || 0;
      if (index < this.inputSize) {
        vector[index] = 1;
      }
    });

    return vector;
  }

  // Прямое распространение
  private forward(input: number[]): { hidden: number[], output: number[] } {
    // Скрытый слой
    const hidden = this.weights[0].map((row, i) => {
      const sum = row.reduce((acc, w, j) => acc + w * input[j], 0) + this.biases[0][i];
      return this.sigmoid(sum);
    });

    // Выходной слой
    const output = this.weights[1].map((row, i) => {
      const sum = row.reduce((acc, w, j) => acc + w * hidden[j], 0) + this.biases[1][i];
      return sum;
    });

    return { hidden, output: this.softmax(output) };
  }

  // Обратное распространение
  private backward(input: number[], target: number[], prediction: { hidden: number[], output: number[] }): void {
    const { hidden, output } = prediction;

    // Ошибка выходного слоя
    const outputError = output.map((o, i) => target[i] - o);
    
    // Ошибка скрытого слоя
    const hiddenError = hidden.map((h, i) => {
      const error = this.weights[1].reduce((acc, row, j) => acc + row[i] * outputError[j], 0);
      return error * this.sigmoidDerivative(h);
    });

    // Обновление весов выходного слоя
    this.weights[1].forEach((row, i) => {
      row.forEach((w, j) => {
        this.weights[1][i][j] += this.learningRate * outputError[i] * hidden[j];
      });
      this.biases[1][i] += this.learningRate * outputError[i];
    });

    // Обновление весов скрытого слоя
    this.weights[0].forEach((row, i) => {
      row.forEach((w, j) => {
        this.weights[0][i][j] += this.learningRate * hiddenError[i] * input[j];
      });
      this.biases[0][i] += this.learningRate * hiddenError[i];
    });
  }

  // Обучение на паре вопрос-ответ
  public train(question: string, answer: string): void {
    const questionVector = this.vectorize(question);
    const answerVector = this.vectorize(answer);
    
    // Создаем целевой вектор из ответа
    const target = new Array(this.outputSize).fill(0);
    answerVector.forEach((val, i) => {
      if (i < this.outputSize) target[i] = val;
    });

    // Обучение
    const prediction = this.forward(questionVector);
    this.backward(questionVector, target, prediction);
  }

  // Генерация ответа с использованием NLP
  public generateResponse(question: string, nlp?: any): string {
    const questionVector = this.vectorize(question);
    const { output } = this.forward(questionVector);
    
    // Найдем наиболее вероятные слова
    const topIndices = output
      .map((prob, index) => ({ prob, index }))
      .sort((a, b) => b.prob - a.prob)
      .slice(0, 5)
      .map(item => item.index);

    // Преобразуем обратно в слова
    const words: string[] = [];
    const reverseVocab = new Map(Array.from(this.vocabulary.entries()).map(([k, v]) => [v, k]));
    
    topIndices.forEach(index => {
      const word = reverseVocab.get(index);
      if (word && word !== '<UNK>') {
        words.push(word);
      }
    });

    // Используем NLP для более умного ответа
    if (nlp) {
      const messageType = nlp.analyzeMessageType(question);
      const topic = nlp.detectTopic(question);
      const emotionalTone = nlp.analyzeEmotionalTone(question);
      
      // Генерируем контекстный ответ
      const contextualResponse = nlp.generateContextualResponse(question, topic, messageType);
      
      if (words.length > 0) {
        return `${contextualResponse} Также связываю это с: ${words.join(', ')}.`;
      }
      
      return contextualResponse;
    }

    // Формируем ответ без NLP
    if (words.length === 0) {
      return 'Обучаюсь на вашем сообщении... Задайте ещё вопросы для улучшения качества ответов.';
    }

    return `Анализируя "${question}", я думаю о: ${words.join(', ')}. Моя нейросеть обновила веса и готова к дальнейшему обучению!`;
  }

  // Обучение на массиве данных
  public trainBatch(trainingData: Array<{ question: string, answer: string }>): void {
    // Сначала строим словарь
    const allTexts = trainingData.flatMap(item => [item.question, item.answer]);
    this.buildVocabulary(allTexts);

    // Затем обучаем
    for (let epoch = 0; epoch < 3; epoch++) {
      trainingData.forEach(item => {
        this.train(item.question, item.answer);
      });
    }
  }

  // Получение размера нейросети (для визуализации)
  public getNetworkSize(): number {
    const totalWeights = this.weights.reduce((sum, layer) => 
      sum + layer.reduce((layerSum, row) => layerSum + row.length, 0), 0
    );
    const totalBiases = this.biases.reduce((sum, layer) => sum + layer.length, 0);
    return (totalWeights + totalBiases) / 1000; // Размер в KB
  }

  // Сохранение модели
  public saveModel(): string {
    return JSON.stringify({
      weights: this.weights,
      biases: this.biases,
      vocabulary: Array.from(this.vocabulary.entries())
    });
  }

  // Загрузка модели
  public loadModel(data: string): void {
    const parsed = JSON.parse(data);
    this.weights = parsed.weights;
    this.biases = parsed.biases;
    this.vocabulary = new Map(parsed.vocabulary);
  }
}