'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, ChevronDown, Send, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

type Message = {
  id: string;
  sender: 'bot' | 'user';
  text: string;
};

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: 'start', 
      sender: 'bot', 
      text: 'Hello! 🇵🇰 Welcome to **VendoraX**. I am your AI Support Assistant. Ask me anything about our events, stall bookings, or how to list your event!' 
    }
  ]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen, isTyping]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    // 1. Add User Message
    const userMsgId = Date.now().toString();
    const newUserMsg: Message = { id: userMsgId, sender: 'user', text: textToSend };
    
    // Optimistically update conversation
    const updatedMessages = [...messages, newUserMsg];
    setMessages(updatedMessages);
    setInputValue('');
    setIsTyping(true);

    try {
      // 2. Call AI API Route
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages })
      });

      if (!response.ok) {
        throw new Error('Failed to get bot response');
      }

      const data = await response.json();
      
      // 3. Add Bot Response
      setMessages(prev => [
        ...prev, 
        { id: (Date.now() + 1).toString(), sender: 'bot', text: data.text }
      ]);
    } catch (error) {
      console.error('Chatbot error:', error);
      setMessages(prev => [
        ...prev, 
        { 
          id: (Date.now() + 1).toString(), 
          sender: 'bot', 
          text: "I'm having some trouble connection to the server. Please try again in a moment!" 
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputValue);
  };

  // Simple formatter for Bold markdown (**text**) in bot responses
  const renderFormattedText = (text: string) => {
    if (!text) return '';
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} className="font-bold text-card-foreground">{part.slice(2, -2)}</strong>;
      }
      // handle simple lists
      if (part.startsWith('* ')) {
        return <span key={index} className="block pl-2 py-0.5">• {part.slice(2)}</span>;
      }
      return part;
    });
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 p-4 bg-primary text-primary-foreground rounded-full shadow-2xl hover:bg-primary/95 transition-all duration-300 transform hover:scale-105 z-50 flex items-center justify-center cursor-pointer",
          isOpen && "scale-0 opacity-0 pointer-events-none"
        )}
      >
        <MessageCircle className="w-6 h-6" />
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-secondary"></span>
        </span>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 sm:w-96 h-[500px] max-h-[85vh] bg-card border border-border shadow-2xl rounded-2xl flex flex-col z-50 overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-secondary text-primary-foreground p-4 flex justify-between items-center shadow-md">
            <div className="font-semibold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent animate-pulse" />
              <div className="text-left">
                <p className="text-sm font-bold leading-tight">VendoraX Agent</p>
                <span className="text-[10px] text-primary-foreground/80 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
                  AI Assistant Online
                </span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1.5 rounded-lg transition-colors cursor-pointer">
              <ChevronDown className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/10 text-left">
            {messages.map((msg) => (
              <div key={msg.id} className={cn("flex", msg.sender === 'user' ? "justify-end" : "justify-start")}>
                <div className={cn(
                  "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-sm whitespace-pre-wrap leading-relaxed",
                  msg.sender === 'user' 
                    ? "bg-primary text-primary-foreground rounded-tr-sm" 
                    : "bg-card border border-border text-card-foreground rounded-tl-sm"
                )}>
                  {renderFormattedText(msg.text)}
                </div>
              </div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-card border border-border text-foreground rounded-2xl rounded-tl-sm px-4 py-3 text-sm shadow-sm flex items-center gap-1 animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Option Chips */}
          {messages.length === 1 && (
            <div className="p-3 bg-muted/5 border-t border-border">
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-2 text-left px-1">Suggested Questions</p>
              <div className="flex flex-wrap gap-1.5">
                <button 
                  onClick={() => handleSendMessage("Are there any food festivals in Lahore?")} 
                  className="text-xs px-2.5 py-1.5 rounded-lg border border-border bg-card hover:bg-muted text-card-foreground transition-all cursor-pointer text-left font-medium"
                >
                  🍔 Lahore Food Festivals
                </button>
                <button 
                  onClick={() => handleSendMessage("Show me tech events in Islamabad")} 
                  className="text-xs px-2.5 py-1.5 rounded-lg border border-border bg-card hover:bg-muted text-card-foreground transition-all cursor-pointer text-left font-medium"
                >
                  💻 Islamabad Tech Events
                </button>
                <button 
                  onClick={() => handleSendMessage("How do I list my event on VendoraX?")} 
                  className="text-xs px-2.5 py-1.5 rounded-lg border border-border bg-card hover:bg-muted text-card-foreground transition-all cursor-pointer text-left font-medium"
                >
                  📢 List my Event
                </button>
              </div>
            </div>
          )}

          {/* Input Area */}
          <form onSubmit={handleFormSubmit} className="p-3 bg-card border-t border-border flex gap-2 items-center">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about events, bookings, support..."
              disabled={isTyping}
              className="flex-1 h-10 px-3.5 py-2 text-xs rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
            />
            <button 
              type="submit" 
              disabled={!inputValue.trim() || isTyping}
              className="p-2.5 bg-primary text-primary-foreground rounded-xl hover:bg-primary/95 transition-all disabled:opacity-40 flex items-center justify-center cursor-pointer shadow-sm"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
