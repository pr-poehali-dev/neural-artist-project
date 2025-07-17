import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { NeuralNetwork } from '@/utils/neuralNetwork';

interface Message {
  id: string;
  text: string;
  type: 'user' | 'ai';
  timestamp: Date;
}

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Привет! Я Dino Tidus - русская нейросеть. Я обучаюсь на каждом вашем сообщении и становлюсь умнее. О чём поговорим?',
      type: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [aiSize, setAiSize] = useState(1.2);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const neuralNetworkRef = useRef<NeuralNetwork>(new NeuralNetwork());
  const [trainingData, setTrainingData] = useState<Array<{ question: string, answer: string }>>([]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      type: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    setIsTyping(true);
    
    // Увеличиваем размер нейросети при общении
    setAiSize(prev => Math.min(prev + 0.1, 5.0));

    // Генерируем ответ с помощью нейросети
    setTimeout(() => {
      const aiResponseText = neuralNetworkRef.current.generateResponse(currentInput);
      
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponseText,
        type: 'ai',
        timestamp: new Date()
      };
      
      // Обучаем нейросеть на паре вопрос-ответ
      neuralNetworkRef.current.train(currentInput, aiResponseText);
      
      // Сохраняем в данные для обучения
      setTrainingData(prev => [...prev, { question: currentInput, answer: aiResponseText }]);
      
      // Обновляем размер нейросети
      setAiSize(neuralNetworkRef.current.getNetworkSize());
      
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  // Инициализация нейросети с базовыми данными
  useEffect(() => {
    const initialTrainingData = [
      { question: 'привет', answer: 'Привет! Как дела?' },
      { question: 'что такое нейросеть', answer: 'Нейросеть - это система, имитирующая работу мозга' },
      { question: 'как дела', answer: 'У меня всё отлично! Обучаюсь и развиваюсь' },
      { question: 'спасибо', answer: 'Пожалуйста! Рад помочь' },
      { question: 'пока', answer: 'До свидания! Было приятно общаться' }
    ];
    
    neuralNetworkRef.current.trainBatch(initialTrainingData);
    setTrainingData(initialTrainingData);
  }, []);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Индикатор размера нейросети */}
      <div className="fixed top-4 right-4 z-10">
        <div className="bg-gray-800 border border-gray-600 rounded-lg px-4 py-2">
          <div className="text-xs text-gray-400 mb-1">Размер нейросети</div>
          <div className="text-lg font-mono text-white">
            {aiSize.toFixed(2)} KB
          </div>
          <div className="w-16 h-2 bg-gray-700 rounded-full mt-2">
            <div 
              className="h-full bg-green-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.min((aiSize / 10) * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Заголовок */}
      <div className="border-b border-gray-800 p-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-white mb-1">DINO TIDUS</h1>
          <p className="text-gray-400 text-sm">Русская нейросеть • Обучение в реальном времени • {trainingData.length} обучающих примеров</p>
        </div>
      </div>

      {/* Область сообщений */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <Card className={`max-w-[70%] p-4 ${
                message.type === 'user' 
                  ? 'bg-gray-800 border-gray-700' 
                  : 'bg-gray-900 border-gray-700'
              }`}>
                <div className="flex items-start space-x-3">
                  {message.type === 'ai' && (
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                        <Icon name="Brain" size={16} />
                      </div>
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="text-white whitespace-pre-wrap">{message.text}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {message.timestamp.toLocaleTimeString('ru-RU', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                  {message.type === 'user' && (
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                        <Icon name="User" size={16} />
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <Card className="max-w-[70%] p-4 bg-gray-900 border-gray-700">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                    <Icon name="Brain" size={16} />
                  </div>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </Card>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Область ввода */}
      <div className="border-t border-gray-800 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex space-x-2">
            <div className="flex-1 relative">
              <Textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Напишите сообщение и обучите нейросеть..."
                className="bg-gray-900 border-gray-700 text-white placeholder-gray-400 resize-none min-h-[50px] max-h-[120px]"
                disabled={isTyping}
              />
            </div>
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isTyping}
              className="bg-green-600 hover:bg-green-700 text-white border-0 px-6"
            >
              <Icon name="Send" size={18} />
            </Button>
          </div>
          
          {/* Быстрые команды для обучения */}
          <div className="flex flex-wrap gap-2 mt-3">
            <button
              onClick={() => setInputValue('Земля круглая и вращается вокруг Солнца')}
              className="px-3 py-1 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-md text-sm text-gray-300 transition-colors"
            >
              📚 Обучить факту
            </button>
            <button
              onClick={() => setInputValue('Что такое искусственный интеллект?')}
              className="px-3 py-1 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-md text-sm text-gray-300 transition-colors"
            >
              ❓ Задать вопрос
            </button>
            <button
              onClick={() => setInputValue('Твой ответ был очень хорошим и полезным')}
              className="px-3 py-1 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-md text-sm text-gray-300 transition-colors"
            >
              👍 Дать оценку
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;