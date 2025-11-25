import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Image as ImageIcon, Mic, X, Send, Upload, Volume2, Loader2, StopCircle } from 'lucide-react';
import { AiState } from '../types';
import { sendChatMessage, analyzeImage, generateSpeech } from '../services/geminiService';

interface AiAssistantProps {
  currentSlideText: string;
}

const AiAssistant: React.FC<AiAssistantProps> = ({ currentSlideText }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<'chat' | 'vision'>('chat');
  const [messages, setMessages] = useState<{role: 'user' | 'model', text: string}[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Vision State
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  // Audio State
  const [isPlaying, setIsPlaying] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  // Clean up AudioContext on unmount
  useEffect(() => {
    return () => {
      audioContextRef.current?.close();
    };
  }, []);

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg = { role: 'user' as const, text: inputText };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    const responseText = await sendChatMessage(messages, inputText);
    
    setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    setIsLoading(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleAnalyzeImage = async () => {
    if (!selectedImage) return;
    setIsLoading(true);
    const userMsg = { role: 'user' as const, text: "[Uploaded Image for Analysis]" };
    setMessages(prev => [...prev, userMsg]);
    
    const result = await analyzeImage(selectedImage);
    
    setMessages(prev => [...prev, { role: 'model', text: result }]);
    setIsLoading(false);
    setSelectedImage(null); // Clear after sending
  };

  const handleTTS = async () => {
    if (isPlaying) {
      audioSourceRef.current?.stop();
      setIsPlaying(false);
      return;
    }

    // Initialize Audio Context once
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({sampleRate: 24000});
    }

    if (audioContextRef.current.state === 'suspended') {
      await audioContextRef.current.resume();
    }

    setIsLoading(true);
    const buffer = await generateSpeech(currentSlideText, audioContextRef.current);
    setIsLoading(false);

    if (buffer) {
      const source = audioContextRef.current.createBufferSource();
      source.buffer = buffer;
      source.connect(audioContextRef.current.destination);
      source.onended = () => setIsPlaying(false);
      source.start();
      audioSourceRef.current = source;
      setIsPlaying(true);
    }
  };

  const handleVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice input is not supported in this browser.");
      return;
    }
    
    const recognition = new SpeechRecognition();
    recognition.onresult = (event: any) => {
       const text = event.results[0][0].transcript;
       setInputText(prev => prev ? `${prev} ${text}` : text);
    };
    recognition.start();
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
      
      {/* Main Floating Buttons */}
      <div className="flex gap-2 mb-4 pointer-events-auto">
        <button 
          onClick={handleTTS}
          className={`p-3 rounded-full shadow-lg transition-all ${isPlaying ? 'bg-red-500 hover:bg-red-600' : 'bg-green-600 hover:bg-green-700'} text-white`}
          title={isPlaying ? "Stop Speaking" : "Read Slide"}
        >
          {isLoading && !isOpen ? <Loader2 className="animate-spin" size={24}/> : (isPlaying ? <StopCircle size={24}/> : <Volume2 size={24}/>)}
        </button>

        <button 
          onClick={() => { setIsOpen(true); setMode('vision'); }}
          className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-all"
          title="Analyze Image"
        >
          <ImageIcon size={24}/>
        </button>
        
        <button 
          onClick={() => { setIsOpen(!isOpen); setMode('chat'); }}
          className="p-3 bg-purple-600 hover:bg-purple-700 text-white rounded-full shadow-lg transition-all"
          title="Ask AI"
        >
          {isOpen ? <X size={24}/> : <MessageSquare size={24}/>}
        </button>
      </div>

      {/* Panel */}
      {isOpen && (
        <div className="w-80 sm:w-96 bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col pointer-events-auto transition-all animate-in slide-in-from-bottom-10 fade-in duration-300" style={{height: '500px'}}>
          
          {/* Header */}
          <div className="bg-gray-800 p-4 border-b border-gray-700 flex justify-between items-center">
             <div className="flex gap-4 text-sm font-medium">
                <button 
                  onClick={() => setMode('chat')}
                  className={`pb-1 border-b-2 transition ${mode === 'chat' ? 'border-purple-500 text-purple-400' : 'border-transparent text-gray-400 hover:text-white'}`}
                >
                  Chat
                </button>
                <button 
                  onClick={() => setMode('vision')}
                  className={`pb-1 border-b-2 transition ${mode === 'vision' ? 'border-blue-500 text-blue-400' : 'border-transparent text-gray-400 hover:text-white'}`}
                >
                  Vision
                </button>
             </div>
             <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white"><X size={18}/></button>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#1a1a1a]">
            {mode === 'vision' && (
               <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-700 rounded-lg p-6 bg-gray-800/50">
                  {!selectedImage ? (
                    <label className="cursor-pointer flex flex-col items-center gap-2 text-gray-400 hover:text-blue-400 transition">
                       <Upload size={32}/>
                       <span className="text-sm">Upload Photo</span>
                       <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                    </label>
                  ) : (
                    <div className="relative w-full">
                       <img src={previewUrl!} alt="Preview" className="w-full rounded mb-3 max-h-40 object-contain"/>
                       <button onClick={() => {setSelectedImage(null); setPreviewUrl(null);}} className="absolute top-1 right-1 bg-black/50 rounded-full p-1 hover:bg-red-500 transition text-white"><X size={14}/></button>
                       <button 
                        onClick={handleAnalyzeImage}
                        disabled={isLoading}
                        className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded text-white font-medium flex justify-center items-center gap-2"
                       >
                         {isLoading ? <Loader2 className="animate-spin" size={16}/> : 'Analyze'}
                       </button>
                    </div>
                  )}
               </div>
            )}

            {/* Messages */}
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-lg text-sm ${msg.role === 'user' ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-200 border border-gray-700'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && mode === 'chat' && (
              <div className="flex justify-start">
                 <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
                    <Loader2 className="animate-spin text-purple-400" size={16}/>
                 </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area (Only for Chat) */}
          <form onSubmit={handleChatSubmit} className="p-3 bg-gray-800 border-t border-gray-700 flex gap-2">
            <input 
              type="text" 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={mode === 'chat' ? "Ask about hydrogen..." : "Switch to chat to ask questions"}
              disabled={mode === 'vision' || isLoading}
              className="flex-1 bg-gray-900 border border-gray-600 rounded-full px-4 py-2 text-sm text-white focus:outline-none focus:border-purple-500 disabled:opacity-50"
            />
            <button 
              type="button"
              onClick={handleVoiceInput}
              disabled={mode === 'vision' || isLoading}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full transition disabled:opacity-50"
              title="Voice Input"
            >
              <Mic size={18} />
            </button>
            <button 
              type="submit" 
              disabled={mode === 'vision' || isLoading || !inputText.trim()}
              className="p-2 bg-purple-600 hover:bg-purple-700 rounded-full text-white disabled:opacity-50 disabled:bg-gray-700"
            >
              <Send size={18} />
            </button>
          </form>

        </div>
      )}
    </div>
  );
};

export default AiAssistant;