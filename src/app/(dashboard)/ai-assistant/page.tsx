"use client";

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Bot, Send, User, Sparkles, AlertCircle, Copy, Check, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { aiVulnerabilityExplanationAndFix } from '@/ai/flows/ai-vulnerability-explanation-and-fix';

type Message = {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  type?: 'explanation' | 'fix' | 'plan';
};

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm your SecureScan AI Security Assistant. I can help explain vulnerabilities, suggest code-level fixes, and create remediation plans. How can I assist you today?",
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      // Logic for determining which flow to call. Here we default to explanation.
      // In a real app, we might use a router or more complex parsing.
      const result = await aiVulnerabilityExplanationAndFix({
        vulnerabilityTitle: input,
        vulnerabilityDescription: "Detailed analysis requested via chat interface.",
        severity: "Medium",
        impact: "Requires expert assessment."
      });

      const assistantMsg: Message = { 
        id: (Date.now() + 1).toString(), 
        role: 'assistant', 
        content: result.explanation + "\n\n**Suggested Fixes:**\n" + result.suggestedFixes + "\n\n**Remediation Plan:**\n" + result.remediationPlan
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        id: (Date.now() + 1).toString(), 
        role: 'assistant', 
        content: "I'm sorry, I encountered an error while analyzing that vulnerability. Please check your input and try again." 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto h-[calc(100vh-12rem)] flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-3xl font-headline font-bold text-white flex items-center gap-3">
          <Bot className="w-8 h-8 text-primary" />
          AI Security Assistant
        </h2>
        <p className="text-muted-foreground">Expert remediation guidance and vulnerability analysis powered by Gemini.</p>
      </div>

      <div className="flex-1 flex flex-col glass-card rounded-2xl overflow-hidden border-border relative">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg) => (
            <div key={msg.id} className={cn(
              "flex gap-4 max-w-[85%]",
              msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
            )}>
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-lg",
                msg.role === 'assistant' ? "cyber-gradient" : "bg-white/10"
              )}>
                {msg.role === 'assistant' ? <Bot className="w-6 h-6 text-white" /> : <User className="w-6 h-6 text-white" />}
              </div>
              <div className={cn(
                "p-4 rounded-2xl text-sm leading-relaxed border",
                msg.role === 'assistant' 
                  ? "bg-white/5 border-white/5 text-white" 
                  : "bg-primary/20 border-primary/20 text-white"
              )}>
                <div className="prose prose-invert max-w-none">
                  {msg.content.split('\n').map((line, i) => (
                    <p key={i} className="mb-2 last:mb-0">
                      {line.startsWith('**') ? <strong className="text-primary">{line.replace(/\*\*/g, '')}</strong> : line}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex gap-4 max-w-[85%] mr-auto">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-lg cyber-gradient">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border-white/5 flex gap-1 items-center">
                <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce delay-100"></span>
                <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce delay-200"></span>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 bg-white/5 border-t border-white/10">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about a vulnerability (e.g., 'What is Log4j?')"
                className="bg-background border-white/10 rounded-xl h-14 pl-4 pr-12 focus:ring-primary/50 text-white"
              />
              <Sparkles className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/50" />
            </div>
            <Button 
              onClick={handleSend}
              className="h-14 w-14 rounded-xl cyber-gradient border-none shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all p-0"
              disabled={isTyping || !input.trim()}
            >
              <Send className="w-6 h-6" />
            </Button>
          </div>
          <div className="mt-3 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {[
              "Explain SQL Injection",
              "How to fix CORS issues?",
              "Generate remediation for XSS",
              "Analyze CVE-2023-0485"
            ].map(suggestion => (
              <button 
                key={suggestion}
                onClick={() => setInput(suggestion)}
                className="whitespace-nowrap px-4 py-1.5 rounded-full bg-white/5 border border-white/5 text-[11px] text-muted-foreground hover:bg-white/10 hover:text-white transition-all"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}