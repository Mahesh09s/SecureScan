
"use client";

import { useState, useRef, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Bot, Send, User, Sparkles, Loader2, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { aiVulnerabilityExplanationAndFix } from '@/ai/flows/ai-vulnerability-explanation-and-fix';
import { useAuth, useFirestore, useCollection } from '@/firebase';
import { collection, addDoc, serverTimestamp, query, orderBy, getDoc, doc, deleteDoc, getDocs } from 'firebase/firestore';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type Message = {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  createdAt?: any;
};

export default function AIAssistantPage() {
  const { currentUser } = useAuth();
  const firestore = useFirestore();
  const searchParams = useSearchParams();
  const vulnId = searchParams.get('vulnId');

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const chatQuery = useMemo(() => {
    if (!firestore || !currentUser) return null;
    return query(
      collection(firestore, `users/${currentUser.uid}/chatHistory`),
      orderBy('createdAt', 'asc')
    );
  }, [firestore, currentUser]);

  const { data: messages, loading: chatLoading } = useCollection<Message>(chatQuery);

  // Handle auto-analysis if vulnId is provided
  useEffect(() => {
    if (vulnId && messages.length === 0 && !isTyping && currentUser) {
      analyzeVulnerabilityContext(vulnId);
    }
  }, [vulnId, messages, currentUser]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const analyzeVulnerabilityContext = async (id: string) => {
    if (!firestore || !currentUser) return;
    setIsTyping(true);
    try {
      const vulnDoc = await getDoc(doc(firestore, 'vulnerabilities', id));
      if (!vulnDoc.exists()) return;
      const vuln = vulnDoc.data();

      const userMsg = `Can you analyze this vulnerability: "${vuln.title}" on ${vuln.assetName}?`;
      await saveMessage('user', userMsg);

      const result = await aiVulnerabilityExplanationAndFix({
        vulnerabilityTitle: vuln.title,
        vulnerabilityDescription: vuln.description,
        severity: vuln.severity,
        impact: vuln.impact || "Undetermined",
        evidence: vuln.evidence,
        affectedCode: vuln.affectedCode
      });

      const assistantMsg = `### Vulnerability Analysis: ${vuln.title}\n\n**Explanation:**\n${result.explanation}\n\n**Suggested Fixes:**\n${result.suggestedFixes}\n\n**Remediation Plan:**\n${result.remediationPlan}\n\n**Best Practices:**\n${result.bestPractices.map(bp => `- ${bp}`).join('\n')}`;
      await saveMessage('assistant', assistantMsg);
    } catch (error) {
      console.error(error);
      await saveMessage('assistant', "I'm sorry, I couldn't analyze that specific vulnerability right now.");
    } finally {
      setIsTyping(false);
    }
  };

  const saveMessage = async (role: 'user' | 'assistant', content: string) => {
    if (!firestore || !currentUser) return;
    await addDoc(collection(firestore, `users/${currentUser.uid}/chatHistory`), {
      role,
      content,
      userId: currentUser.uid,
      createdAt: serverTimestamp(),
    });
  };

  const handleSend = async () => {
    if (!input.trim() || isTyping || !currentUser) return;

    const userText = input;
    setInput('');
    setIsTyping(true);

    try {
      await saveMessage('user', userText);

      // Simple routing based on keywords for now
      let responseContent = "";
      if (userText.toLowerCase().includes('fix') || userText.toLowerCase().includes('remediate')) {
        const result = await aiVulnerabilityExplanationAndFix({
          vulnerabilityTitle: userText,
          vulnerabilityDescription: "User requested remediation via chat.",
          severity: "Medium",
          impact: "Consult expert documentation."
        });
        responseContent = result.suggestedFixes;
      } else {
        // Fallback to a general explanation or help
        const result = await aiVulnerabilityExplanationAndFix({
          vulnerabilityTitle: userText,
          vulnerabilityDescription: "General query.",
          severity: "Info",
          impact: "Educational context."
        });
        responseContent = result.explanation;
      }

      await saveMessage('assistant', responseContent);
    } catch (error) {
      await saveMessage('assistant', "I encountered an error processing your request. Please try again.");
    } finally {
      setIsTyping(false);
    }
  };

  const clearHistory = async () => {
    if (!firestore || !currentUser) return;
    const snapshot = await getDocs(collection(firestore, `users/${currentUser.uid}/chatHistory`));
    const deletePromises = snapshot.docs.map(d => deleteDoc(d.ref));
    await Promise.all(deletePromises);
  };

  return (
    <div className="max-w-5xl mx-auto h-[calc(100vh-12rem)] flex flex-col gap-6">
      <div className="flex justify-between items-end">
        <div className="flex flex-col gap-1">
          <h2 className="text-3xl font-headline font-bold text-white flex items-center gap-3">
            <Bot className="w-8 h-8 text-primary" />
            AI Security Assistant
          </h2>
          <p className="text-muted-foreground">Expert remediation guidance and vulnerability analysis powered by Gemini.</p>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={clearHistory}
          className="text-muted-foreground hover:text-destructive gap-2"
        >
          <Trash2 className="w-4 h-4" />
          Clear Chat
        </Button>
      </div>

      <div className="flex-1 flex flex-col glass-card rounded-2xl overflow-hidden border-border relative">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
          {chatLoading && messages.length === 0 ? (
            <div className="flex justify-center items-center h-full text-muted-foreground gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              Loading history...
            </div>
          ) : (
            <>
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-50">
                  <Bot className="w-12 h-12 text-primary" />
                  <p className="text-sm">No messages yet. Ask me anything about security vulnerabilities.</p>
                </div>
              )}
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
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
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
