'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowRight, 
  ArrowLeft, 
  Menu, 
  X, 
  Phone, 
  Mail, 
  Instagram, 
  Facebook, 
  MapPin, 
  CheckCircle, 
  Star,
  Play,
  Pause,
  ChevronRight,
  MessageCircle,
  PenTool,
  Ruler,
  Hammer,
  Sparkles,
  Send,
  Loader2,
  Lightbulb
} from 'lucide-react';

/* --- CONFIGURAÇÃO GEMINI API --- */
const apiKey = ""; // A chave é fornecida pelo ambiente

async function callGemini(prompt, systemInstruction = "") {
  try {
    let delay = 1000;
    for (let i = 0; i < 5; i++) {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          systemInstruction: systemInstruction ? { parts: [{ text: systemInstruction }] } : undefined
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text;
      }
      
      if (response.status === 429 || response.status >= 500) {
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2;
      } else {
        break;
      }
    }
    throw new Error("Falha ao conectar com a IA após várias tentativas.");
  } catch (error) {
    console.error("Erro Gemini:", error);
    return null;
  }
}

/* --- HOOKS & UTILITÁRIOS --- */

const useScrollReveal = () => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => setIsVisible(entry.isIntersecting));
    });
    const currentElement = domRef.current;
    if (currentElement) observer.observe(currentElement);
    return () => {
      if (currentElement) observer.unobserve(currentElement);
    };
  }, []);

  return [isVisible, domRef];
};

const Reveal = ({ children, className = "" }) => {
  const [isVisible, domRef] = useScrollReveal();
  return (
    <div 
      ref={domRef} 
      className={`transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'} ${className}`}
    >
      {children}
    </div>
  );
};

/* --- NOVO COMPONENTE: CONSULTOR IA --- */

const AIConsultant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Olá! Sou seu assistente de design ✨. Como posso ajudar a transformar seu ambiente hoje?' }
  ]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input;
    setInput("");
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    const systemPrompt = "Você é um arquiteto sênior e consultor de design da Rio Arq Design, uma empresa de móveis planejados de alto padrão no Rio de Janeiro. Ajude o usuário com ideias de decoração, escolha de materiais (Laca, MDF, Vidro, Ferragens Blum) e otimização de espaço. Seja elegante, profissional e criativo. Sempre mencione a qualidade da Rio Arq.";
    
    const response = await callGemini(userMsg, systemPrompt);
    
    setLoading(false);
    if (response) {
      setMessages(prev => [...prev, { role: 'ai', text: response }]);
    } else {
      setMessages(prev => [...prev, { role: 'ai', text: "Desculpe, tive um pequeno problema técnico. Poderia repetir?" }]);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-24 right-6 z-50 bg-black text-white p-4 rounded-full shadow-2xl hover:bg-zinc-800 transition-all duration-300 flex items-center justify-center border border-white/20"
      >
        <Sparkles className="w-6 h-6 text-yellow-400" />
      </button>

      {isOpen && (
        <div className="fixed bottom-40 right-6 z-50 w-[350px] md:w-[400px] bg-white shadow-2xl rounded-2xl flex flex-col overflow-hidden border border-gray-100 animate-in slide-in-from-bottom-5">
          <div className="bg-black text-white p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              <span className="font-bold text-sm tracking-widest uppercase">Consultoria ✨</span>
            </div>
            <button onClick={() => setIsOpen(false)}><X className="w-5 h-5"/></button>
          </div>
          
          <div className="h-[400px] overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${m.role === 'user' ? 'bg-black text-white rounded-br-none' : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-none'}`}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-xs text-gray-400">Criando conceitos...</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="p-4 border-t border-gray-100 bg-white flex gap-2">
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ex: Ideias para cozinha pequena..."
              className="flex-1 bg-gray-100 border-none rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-black outline-none transition-all"
            />
            <button 
              onClick={handleSend}
              disabled={loading}
              className="bg-black text-white p-2 rounded-full hover:scale-105 transition-transform disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

/* --- COMPONENTES ORIGINAIS --- */

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const SLIDE_DURATION = 6000;
  
  const slides = [
    {
      id: 1,
      title: "Design que Inspira",
      subtitle: "Móveis Planejados",
      description: "Transforme cada canto da sua casa em uma expressão de arte e funcionalidade com nossos projetos exclusivos.",
      image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop"
    },
    {
      id: 2,
      title: "Cozinhas Modernas",
      subtitle: "Sofisticação & Prática",
      description: "O coração da casa merece o melhor. Acabamentos premium e ergonomia pensada para o seu dia a dia.",
      image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=2070&auto=format&fit=crop"
    },
    {
      id: 3,
      title: "Conforto no Dormitório",
      subtitle: "Seu Refúgio Particular",
      description: "Ambientes acolhedores projetados para o descanso perfeito, unindo texturas suaves e iluminação ideal.",
      image: "https://images.unsplash.com/photo-1616594039964-40891a909d99?q=80&w=2070&auto=format&fit=crop"
    }
  ];

  useEffect(() => {
    let interval;
    if (!isPaused) {
      const startTime = Date.now() - (progress / 100) * SLIDE_DURATION;
      interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const newProgress = (elapsed / SLIDE_DURATION) * 100;
        
        if (newProgress >= 100) {
          setCurrentSlide(prev => (prev + 1) % slides.length);
          setProgress(0);
        } else {
          setProgress(newProgress);
        }
      }, 16);
    }
    return () => clearInterval(interval);
  }, [currentSlide, isPaused, progress]);

  return (
    <div 
      className="relative h-screen w-full overflow-hidden bg-zinc-900 text-white"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {slides.map((slide, index) => (
        <div 
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent z-10" />
          <img 
            src={slide.image} 
            alt={slide.title}
            className={`w-full h-full object-cover transition-transform duration-[10000ms] ease-out ${index === currentSlide ? 'scale-110' : 'scale-100'}`} 
          />
          
          <div className="absolute inset-0 z-20 flex items-center justify-start container mx-auto px-6 md:px-12">
            <div className={`max-w-3xl text-left transition-all duration-1000 transform ${index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <div className="overflow-hidden mb-6">
                 <span className="inline-block py-1 px-4 border border-white/30 rounded-full text-xs tracking-[0.3em] uppercase backdrop-blur-sm">
                  {slide.subtitle}
                </span>
              </div>
              <h1 className="text-5xl md:text-8xl font-light mb-6 leading-tight tracking-tight drop-shadow-lg">
                {slide.title.split(' ').map((word, i) => (
                  <span key={i} className="block">{word}</span>
                ))}
              </h1>
              <p className="text-lg md:text-xl text-gray-200 mb-10 font-light max-w-xl leading-relaxed drop-shadow-md">
                {slide.description}
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="group bg-white text-black px-10 py-4 text-sm font-bold uppercase tracking-widest hover:bg-neutral-200 transition-all flex items-center gap-3">
                  Ver Projetos
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
                <button 
                  onClick={() => document.getElementById('contato').scrollIntoView({ behavior: 'smooth' })}
                  className="group bg-transparent border border-white/40 text-white px-10 py-4 text-sm font-bold uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-3"
                >
                  Falar com IA ✨
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className="absolute bottom-0 left-0 w-full z-30 border-t border-white/10 bg-black/30 backdrop-blur-md">
        <div className="container mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4 w-full md:w-1/3">
            <span className="text-3xl font-light font-mono">{String(currentSlide + 1).padStart(2, '0')}</span>
            <div className="h-[2px] w-full bg-white/20 relative rounded-full overflow-hidden">
              <div 
                className="absolute top-0 left-0 h-full bg-white transition-all duration-100 ease-linear rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-sm text-white/50 font-mono">{String(slides.length).padStart(2, '0')}</span>
          </div>
          <div className="hidden md:flex gap-4">
            <button onClick={() => setCurrentSlide((c) => (c - 1 + slides.length) % slides.length)} className="p-3 hover:bg-white/10 rounded-full transition-colors border border-white/20"><ArrowLeft className="w-5 h-5"/></button>
            <button onClick={() => setIsPaused(!isPaused)} className="p-3 hover:bg-white/10 rounded-full transition-colors border border-white/20">{isPaused ? <Play className="w-5 h-5"/> : <Pause className="w-5 h-5"/>}</button>
            <button onClick={() => setCurrentSlide((c) => (c + 1) % slides.length)} className="p-3 hover:bg-white/10 rounded-full transition-colors border border-white/20"><ArrowRight className="w-5 h-5"/></button>
          </div>
        </div>
      </div>
    </div>
  );
};

const AmbientesSection = () => {
  const categories = [
    { name: "Cozinhas", desc: "Funcionalidade e Estilo", img: "https://images.unsplash.com/photo-1556910103-1c02745a30bf?q=80&w=2070&auto=format&fit=crop", size: "col-span-1 md:col-span-2 row-span-2" },
    { name: "Dormitórios", desc: "Conforto Supremo", img: "https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?q=80&w=2071&auto=format&fit=crop", size: "col-span-1 md:col-span-1 row-span-1" },
    { name: "Home Office", desc: "Produtividade", img: "https://images.unsplash.com/photo-1593642532400-2682810df593?q=80&w=2069&auto=format&fit=crop", size: "col-span-1 md:col-span-1 row-span-1" },
    { name: "Banheiros", desc: "Spa em Casa", img: "https://images.unsplash.com/photo-1620626011761-996317b8d101?q=80&w=2069&auto=format&fit=crop", size: "col-span-1 md:col-span-1 row-span-1" },
    { name: "Salas de Estar", desc: "Convivência", img: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1974&auto=format&fit=crop", size: "col-span-1 md:col-span-1 row-span-1" }
  ];

  return (
    <section className="py-32 bg-white" id="ambientes">
      <div className="container mx-auto px-6">
        <Reveal>
          <div className="text-center mb-20">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-[0.3em] mb-4">Portfólio Exclusivo</h3>
            <h2 className="text-5xl font-light text-gray-900 mb-6">Ambientes Planejados</h2>
            <div className="w-16 h-1 bg-black mx-auto"></div>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 auto-rows-[350px]">
          {categories.map((cat, idx) => (
            <Reveal key={idx} className={`relative group overflow-hidden cursor-pointer ${cat.size}`}>
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/50 transition-colors duration-500 z-10" />
              <img 
                src={cat.img} 
                alt={cat.name} 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
              />
              <div className="absolute bottom-8 left-8 z-20 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="text-3xl font-light mb-1">{cat.name}</h3>
                <p className="text-sm font-light text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 mb-4">{cat.desc}</p>
                <div className="h-[1px] w-12 bg-white group-hover:w-full transition-all duration-700 ease-out"></div>
              </div>
              <div className="absolute top-8 right-8 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200 bg-white text-black rounded-full p-3">
                <ArrowRight className="w-5 h-5 -rotate-45 group-hover:rotate-0 transition-transform duration-500" />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

const ProcessSection = () => {
  const steps = [
    { icon: <MessageCircle className="w-8 h-8"/>, title: "1. Briefing", desc: "Entendemos seus desejos, necessidades e estilo de vida em uma conversa detalhada." },
    { icon: <Ruler className="w-8 h-8"/>, title: "2. Medição & Projeto", desc: "Nossos arquitetos criam o design 3D sob medida para o seu espaço." },
    { icon: <PenTool className="w-8 h-8"/>, title: "3. Aprovação", desc: "Apresentação do projeto com materiais reais para sua validação final." },
    { icon: <Hammer className="w-8 h-8"/>, title: "4. Instalação", desc: "Entrega pontual e montagem por equipe própria especializada." },
  ];

  return (
    <section className="py-24 bg-zinc-50 border-y border-zinc-200">
      <div className="container mx-auto px-6">
        <Reveal>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-light text-gray-900">Como Trabalhamos</h2>
            <p className="text-gray-500 mt-4 max-w-2xl mx-auto font-light">Um processo transparente e organizado para garantir que o resultado final supere suas expectativas.</p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {steps.map((step, idx) => (
            <Reveal key={idx} className="bg-white p-8 shadow-sm hover:shadow-lg transition-shadow duration-300 border-t-2 border-transparent hover:border-black group">
              <div className="mb-6 text-gray-400 group-hover:text-black transition-colors">{step.icon}</div>
              <h3 className="text-xl font-medium mb-3">{step.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

const DiferenciaisSection = () => {
  return (
    <section className="py-32 bg-white" id="sobre">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
        <Reveal>
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-[0.3em] mb-4">Nossa Essência</h3>
          <h2 className="text-5xl font-light text-gray-900 mb-8 leading-tight">
            A união perfeita entre <br/> <span className="italic font-serif">design</span> e técnica.
          </h2>
          <p className="text-gray-600 leading-relaxed mb-6 font-light text-lg">
            Há mais de 20 anos no mercado carioca, a <strong>Rio Arq Móveis</strong> redefine o conceito de morar bem. Não vendemos apenas móveis; entregamos soluções que valorizam o seu patrimônio.
          </p>
          
          <div className="space-y-6 mt-10">
            {[
              "Acabamentos High-End (Laca, Vidro, Couro)",
              "Ferragens Austríacas Blum com Amortecimento",
              "Garantia estendida de 5 anos em contrato"
            ].map((item, i) => (
              <div key={i} className="flex items-center text-gray-800 group">
                <CheckCircle className="w-6 h-6 text-zinc-300 mr-4 group-hover:text-green-600 transition-colors" />
                <span className="font-light">{item}</span>
              </div>
            ))}
          </div>

          <button className="mt-12 px-10 py-4 border border-black text-black uppercase tracking-widest text-xs font-bold hover:bg-black hover:text-white transition-all duration-300">
            Conheça Nossa Fábrica
          </button>
        </Reveal>
        
        <Reveal className="relative h-[600px]">
          <div className="absolute top-0 right-0 w-5/6 h-5/6 z-10 overflow-hidden">
             {/** biome-ignore lint/performance/noImgElement: <explanation> */}
<img src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1974&auto=format&fit=crop" className="w-full h-full object-cover shadow-2xl hover:scale-105 transition-transform duration-1000" alt="Office" />
          </div>
          <div className="absolute bottom-0 left-0 w-1/2 h-1/2 z-20 border-8 border-white shadow-2xl overflow-hidden">
             {/** biome-ignore lint/performance/noImgElement: <explanation> */}
<img src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1974&auto=format&fit=crop" className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000" alt="Detail" />
          </div>
          <div className="absolute -z-10 top-10 right-10 w-full h-full border border-gray-100" />
        </Reveal>
      </div>
    </section>
  );
};

const ContactSection = () => {
  const [msg, setMsg] = useState("");
  const [aiAnalysis, setAiAnalysis] = useState("");
  const [analyzing, setAnalyzing] = useState(false);

  const analyzeMessage = async () => {
    if (!msg.trim()) return;
    setAnalyzing(true);
    const prompt = `Analise brevemente este pedido de móveis planejados e sugira o tipo de acabamento ou material ideal: "${msg}". Seja muito breve (1 parágrafo).`;
    const result = await callGemini(prompt, "Você é um técnico de materiais de marcenaria. Dê uma sugestão técnica rápida baseada no desejo do cliente.");
    setAiAnalysis(result);
    setAnalyzing(false);
  };

  return (
    <section className="py-24 bg-white" id="contato">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <Reveal>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-[0.3em] mb-4">Fale Conosco</h3>
            <h2 className="text-4xl font-light text-gray-900 mb-6">Vamos realizar seu projeto?</h2>
            <p className="text-gray-600 mb-10 font-light">Preencha o formulário e um de nossos consultores entrará em contato em até 24 horas.</p>
            
            <div className="space-y-6">
               <div className="flex items-center gap-4 text-gray-700">
                 <div className="w-12 h-12 bg-gray-100 flex items-center justify-center rounded-full"><Phone className="w-5 h-5"/></div>
                 <div>
                   <p className="text-xs text-gray-500 uppercase font-bold">Telefone</p>
                   <p className="text-lg">(21) 2123-4567</p>
                 </div>
               </div>
               <div className="flex items-center gap-4 text-gray-700">
                 <div className="w-12 h-12 bg-gray-100 flex items-center justify-center rounded-full"><Mail className="w-5 h-5"/></div>
                 <div>
                   <p className="text-xs text-gray-500 uppercase font-bold">Email</p>
                   <p className="text-lg">contato@rioarqmoveis.com.br</p>
                 </div>
               </div>
            </div>
          </Reveal>

          <Reveal className="bg-gray-50 p-10 shadow-xl relative">
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Nome</label>
                  <input type="text" className="w-full bg-white border border-gray-200 px-4 py-3 focus:outline-none focus:border-black transition-colors" placeholder="Seu nome" />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Telefone</label>
                  <input type="text" className="w-full bg-white border border-gray-200 px-4 py-3 focus:outline-none focus:border-black transition-colors" placeholder="(21) 99999-9999" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Mensagem</label>
                <div className="relative">
                  <textarea 
                    value={msg}
                    onChange={(e) => setMsg(e.target.value)}
                    rows="4" 
                    className="w-full bg-white border border-gray-200 px-4 py-3 focus:outline-none focus:border-black transition-colors pr-12" 
                    placeholder="Conte um pouco sobre seu projeto..."
                  ></textarea>
                  <button 
                    type="button"
                    onClick={analyzeMessage}
                    title="Analisar com IA ✨"
                    className="absolute right-3 top-3 p-2 bg-black text-white rounded-full hover:scale-110 transition-transform"
                  >
                    <Lightbulb className="w-4 h-4 text-yellow-400" />
                  </button>
                </div>
              </div>

              {analyzing && (
                <div className="flex items-center gap-2 text-xs text-gray-400 italic">
                  <Loader2 className="w-3 h-3 animate-spin" /> Gerando sugestão inteligente...
                </div>
              )}

              {aiAnalysis && (
                <div className="bg-zinc-900 text-white p-4 rounded-lg text-xs leading-relaxed border-l-4 border-yellow-400 animate-in fade-in zoom-in duration-300">
                  <div className="flex items-center gap-1 mb-1 font-bold uppercase tracking-widest text-[10px]">
                    <Sparkles className="w-3 h-3 text-yellow-400" /> Sugestão da IA ✨
                  </div>
                  {aiAnalysis}
                </div>
              )}

              <button className="w-full bg-black text-white py-4 font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors">
                Solicitar Orçamento
              </button>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-white/95 text-black shadow-md py-4 backdrop-blur-md' : 'bg-transparent text-white py-8'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-2 group cursor-pointer">
             <div className={`w-10 h-10 border-2 flex items-center justify-center font-serif font-bold text-xl transition-colors duration-300 ${scrolled ? 'border-black group-hover:bg-black group-hover:text-white' : 'border-white group-hover:bg-white group-hover:text-black'}`}>R</div>
             <span className="text-2xl font-light tracking-[0.2em]">RIO<span className="font-bold">ARQ</span></span>
          </div>

          <div className="hidden md:flex items-center gap-10 text-xs font-bold tracking-widest uppercase">
            <a href="#" className="hover:text-gray-400 transition-colors relative">Home</a>
            <a href="#ambientes" className="hover:text-gray-400 transition-colors relative">Ambientes</a>
            <a href="#sobre" className="hover:text-gray-400 transition-colors relative">Sobre</a>
            <a href="#contato" className={`px-6 py-3 border ${scrolled ? 'border-black text-black hover:bg-black hover:text-white' : 'border-white text-white hover:bg-white hover:text-black'} transition-all duration-300 flex items-center gap-2`}>
               Orçamento ✨
            </a>
          </div>

          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden">
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>

        <div className={`absolute top-full left-0 w-full bg-white text-black overflow-hidden transition-all duration-500 ease-in-out ${menuOpen ? 'max-h-screen py-10 opacity-100 shadow-xl' : 'max-h-0 py-0 opacity-0'}`}>
           <div className="flex flex-col items-center gap-6 text-sm font-bold uppercase tracking-widest">
             <a href="#" onClick={() => setMenuOpen(false)}>Home</a>
             <a href="#ambientes" onClick={() => setMenuOpen(false)}>Ambientes</a>
             <a href="#sobre" onClick={() => setMenuOpen(false)}>Sobre</a>
             <a href="#contato" onClick={() => setMenuOpen(false)} className="bg-black text-white px-8 py-3 mt-4">Solicitar Orçamento</a>
           </div>
        </div>
      </nav>
      
      <AIConsultant />

      <a href="#" className="fixed bottom-6 right-6 z-50 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center group">
         <MessageCircle className="w-6 h-6" />
         <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-2 transition-all duration-500 whitespace-nowrap font-bold text-sm">Fale no WhatsApp</span>
      </a>
    </>
  );
};

const Footer = () => {
  return (
    <footer className="bg-zinc-950 text-white pt-24 pb-10 border-t border-white/5">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
        <div className="col-span-1 md:col-span-1">
          <div className="flex items-center gap-2 mb-8">
             <div className="w-10 h-10 border-2 border-white flex items-center justify-center font-bold text-xl">R</div>
             <span className="text-2xl font-light tracking-[0.2em]">RIO<span className="font-bold">ARQ</span></span>
          </div>
          <p className="text-zinc-400 text-sm leading-relaxed mb-8 font-light">
            Especialistas em transformar sonhos em realidade através da marcenaria de alto padrão. Atendemos todo o Rio de Janeiro com excelência.
          </p>
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300"><Instagram className="w-5 h-5"/></a>
            <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300"><Facebook className="w-5 h-5"/></a>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-widest mb-8">Navegação</h4>
          <ul className="space-y-4 text-zinc-400 text-sm font-light">
            <li><a href="#" className="hover:text-white transition-colors">Home</a></li>
            <li><a href="#ambientes" className="hover:text-white transition-colors">Projetos</a></li>
            <li><a href="#sobre" className="hover:text-white transition-colors">A Empresa</a></li>
            <li><a href="#contato" className="hover:text-white transition-colors">Contato</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-widest mb-8">Localização</h4>
          <ul className="space-y-6 text-zinc-400 text-sm font-light">
            <li className="flex items-start gap-4">
              <MapPin className="w-5 h-5 mt-1 shrink-0 text-white" />
              <span>Av. Ator José Wilker, 605<br/>Barra da Tijuca, Rio de Janeiro - RJ</span>
            </li>
            <li className="flex items-center gap-4">
              <Phone className="w-5 h-5 shrink-0 text-white" />
              <span>(21) 2123-4567</span>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-widest mb-8">Newsletter</h4>
          <p className="text-zinc-400 text-sm mb-6 font-light">Cadastre-se para receber tendências de decoração.</p>
          <div className="flex flex-col gap-3">
            <input type="email" placeholder="Seu melhor e-mail" className="bg-transparent border border-white/20 px-4 py-3 text-white text-sm focus:outline-none focus:border-white transition-colors" />
            <button className="bg-white text-black px-4 py-3 text-sm font-bold uppercase hover:bg-zinc-200 transition-colors">
              Inscrever-se
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-zinc-600">
        <p>&copy; 2024 Rio Arquitetura e Móveis. Todos os direitos reservados.</p>
        <p className="font-mono flex items-center gap-1">Powered by Gemini AI <Sparkles className="w-3 h-3 text-yellow-400" /></p>
      </div>
    </footer>
  );
};

export default function Page() {
  return (
    <div className="font-sans text-gray-900 selection:bg-black selection:text-white antialiased">
      <Navbar />
      <HeroSlider />
      <AmbientesSection />
      <ProcessSection />
      <DiferenciaisSection />
      <ContactSection />
      <Footer />
    </div>
  );
}