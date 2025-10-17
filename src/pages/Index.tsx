import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Icon from '@/components/ui/icon';

type Language = 'ru' | 'en';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const translations = {
  ru: {
    nav: {
      home: 'Главная',
      about: 'О проекте',
      features: 'Возможности',
      faq: 'Вопросы'
    },
    hero: {
      title: 'Корпоративный AI-Ассистент',
      subtitle: 'Профессиональное решение для автоматизации бизнес-процессов',
      cta: 'Начать диалог'
    },
    chat: {
      title: 'AI-Ассистент',
      placeholder: 'Введите ваш вопрос...',
      send: 'Отправить',
      welcome: 'Здравствуйте! Я корпоративный AI-ассистент. Чем могу помочь?'
    },
    about: {
      title: 'О проекте',
      description: 'Наш AI-ассистент создан для повышения эффективности работы вашей команды. Используя передовые технологии искусственного интеллекта, мы предоставляем быстрые и точные ответы на ваши вопросы.'
    },
    features: {
      title: 'Возможности AI',
      items: [
        {
          title: 'Многоязычная поддержка',
          description: 'Работа с запросами на русском и английском языках'
        },
        {
          title: 'Быстрые ответы',
          description: 'Мгновенная обработка запросов и предоставление информации'
        },
        {
          title: 'Контекстное понимание',
          description: 'Анализ контекста для более точных ответов'
        },
        {
          title: 'Безопасность данных',
          description: 'Корпоративный уровень защиты конфиденциальной информации'
        }
      ]
    },
    faq: {
      title: 'Частые вопросы',
      items: [
        {
          question: 'Как начать использовать AI-ассистента?',
          answer: 'Просто введите ваш вопрос в поле чата и нажмите кнопку отправки. Ассистент обработает запрос и предоставит ответ.'
        },
        {
          question: 'На каких языках работает ассистент?',
          answer: 'AI-ассистент поддерживает русский и английский языки. Вы можете переключать язык интерфейса в правом верхнем углу.'
        },
        {
          question: 'Насколько безопасны мои данные?',
          answer: 'Мы используем корпоративные стандарты безопасности. Все данные шифруются и обрабатываются в соответствии с требованиями конфиденциальности.'
        },
        {
          question: 'Можно ли интегрировать ассистента в корпоративную систему?',
          answer: 'Да, наше решение поддерживает интеграцию через API. Свяжитесь с нашей технической поддержкой для уточнения деталей.'
        }
      ]
    }
  },
  en: {
    nav: {
      home: 'Home',
      about: 'About',
      features: 'Features',
      faq: 'FAQ'
    },
    hero: {
      title: 'Corporate AI Assistant',
      subtitle: 'Professional solution for business process automation',
      cta: 'Start Conversation'
    },
    chat: {
      title: 'AI Assistant',
      placeholder: 'Enter your question...',
      send: 'Send',
      welcome: 'Hello! I am your corporate AI assistant. How can I help you?'
    },
    about: {
      title: 'About Project',
      description: 'Our AI assistant is designed to improve your team\'s efficiency. Using advanced artificial intelligence technologies, we provide fast and accurate answers to your questions.'
    },
    features: {
      title: 'AI Capabilities',
      items: [
        {
          title: 'Multilingual Support',
          description: 'Processing requests in Russian and English languages'
        },
        {
          title: 'Fast Responses',
          description: 'Instant query processing and information delivery'
        },
        {
          title: 'Context Understanding',
          description: 'Context analysis for more accurate responses'
        },
        {
          title: 'Data Security',
          description: 'Corporate-level protection of confidential information'
        }
      ]
    },
    faq: {
      title: 'Frequently Asked Questions',
      items: [
        {
          question: 'How to start using AI assistant?',
          answer: 'Simply enter your question in the chat field and press send button. The assistant will process your request and provide an answer.'
        },
        {
          question: 'What languages does the assistant support?',
          answer: 'The AI assistant supports Russian and English languages. You can switch the interface language in the top right corner.'
        },
        {
          question: 'How secure is my data?',
          answer: 'We use corporate security standards. All data is encrypted and processed in accordance with confidentiality requirements.'
        },
        {
          question: 'Can the assistant be integrated into corporate system?',
          answer: 'Yes, our solution supports API integration. Contact our technical support for details.'
        }
      ]
    }
  }
};

export default function Index() {
  const [language, setLanguage] = useState<Language>('ru');
  const [activeSection, setActiveSection] = useState<string>('home');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: translations[language].chat.welcome }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [showChat, setShowChat] = useState(false);

  const t = translations[language];

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = { role: 'user', content: inputValue };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    const thinkingMessage: Message = { role: 'assistant', content: '...' };
    setMessages(prev => [...prev, thinkingMessage]);

    try {
      const response = await fetch('https://functions.poehali.dev/e66d0768-3a94-43d6-a840-7a739e7033ad', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputValue,
          language: language
        })
      });

      const data = await response.json();
      
      setMessages(prev => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = {
          role: 'assistant',
          content: data.response || 'Произошла ошибка. Пожалуйста, попробуйте снова.'
        };
        return newMessages;
      });
    } catch (error) {
      setMessages(prev => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = {
          role: 'assistant',
          content: language === 'ru' 
            ? 'Произошла ошибка при обращении к AI. Пожалуйста, убедитесь, что API ключ настроен.' 
            : 'Error connecting to AI. Please ensure the API key is configured.'
        };
        return newMessages;
      });
    }
  };

  const toggleLanguage = () => {
    const newLang = language === 'ru' ? 'en' : 'ru';
    setLanguage(newLang);
    setMessages([{ role: 'assistant', content: translations[newLang].chat.welcome }]);
  };

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="fixed top-0 w-full bg-white border-b border-border z-50 shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon name="Bot" size={28} className="text-primary" />
            <span className="text-xl font-bold text-foreground">AI Assistant</span>
          </div>
          
          <div className="hidden md:flex items-center gap-6">
            {Object.entries(t.nav).map(([key, label]) => (
              <button
                key={key}
                onClick={() => scrollToSection(key)}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  activeSection === key ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={toggleLanguage}
            className="flex items-center gap-2"
          >
            <Icon name="Languages" size={16} />
            {language.toUpperCase()}
          </Button>
        </div>
      </nav>

      <main className="pt-16">
        <section id="home" className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/20 to-background">
          <div className="container mx-auto px-4 py-20">
            <div className="max-w-4xl mx-auto text-center animate-fade-in">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 text-foreground">
                {t.hero.title}
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                {t.hero.subtitle}
              </p>
              <Button
                size="lg"
                onClick={() => setShowChat(true)}
                className="text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all"
              >
                <Icon name="MessageSquare" size={20} className="mr-2" />
                {t.hero.cta}
              </Button>

              <div className="grid md:grid-cols-3 gap-6 mt-16">
                <Card className="p-6 hover:shadow-lg transition-shadow">
                  <Icon name="Globe" size={40} className="text-primary mb-4" />
                  <h3 className="font-semibold mb-2">Многоязычность</h3>
                  <p className="text-sm text-muted-foreground">RU / EN поддержка</p>
                </Card>
                <Card className="p-6 hover:shadow-lg transition-shadow">
                  <Icon name="Zap" size={40} className="text-primary mb-4" />
                  <h3 className="font-semibold mb-2">Быстрая работа</h3>
                  <p className="text-sm text-muted-foreground">Мгновенные ответы</p>
                </Card>
                <Card className="p-6 hover:shadow-lg transition-shadow">
                  <Icon name="Shield" size={40} className="text-primary mb-4" />
                  <h3 className="font-semibold mb-2">Безопасность</h3>
                  <p className="text-sm text-muted-foreground">Защита данных</p>
                </Card>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-4xl font-bold mb-6">{t.about.title}</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {t.about.description}
              </p>
            </div>
          </div>
        </section>

        <section id="features" className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12">{t.features.title}</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {t.features.items.map((feature, index) => (
                <Card key={index} className="p-6 hover:shadow-lg transition-all hover:-translate-y-1">
                  <Icon name="Check" size={24} className="text-primary mb-4" />
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="faq" className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12">{t.faq.title}</h2>
            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="space-y-4">
                {t.faq.items.map((item, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="bg-card px-6 rounded-lg border">
                    <AccordionTrigger className="text-left font-semibold hover:no-underline">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>
      </main>

      {showChat && (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] shadow-2xl rounded-lg overflow-hidden animate-scale-in z-50">
          <Card className="h-full flex flex-col">
            <div className="bg-primary text-primary-foreground p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon name="Bot" size={24} />
                <h3 className="font-semibold">{t.chat.title}</h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowChat(false)}
                className="text-primary-foreground hover:bg-primary-foreground/20"
              >
                <Icon name="X" size={20} />
              </Button>
            </div>

            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-foreground'
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder={t.chat.placeholder}
                  className="flex-1"
                />
                <Button onClick={handleSendMessage}>
                  <Icon name="Send" size={18} />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {!showChat && (
        <Button
          size="lg"
          onClick={() => setShowChat(true)}
          className="fixed bottom-6 right-6 rounded-full w-16 h-16 shadow-2xl z-50"
        >
          <Icon name="MessageSquare" size={24} />
        </Button>
      )}
    </div>
  );
}