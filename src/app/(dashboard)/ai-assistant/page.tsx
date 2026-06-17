
"use client";

import { useState, useRef, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Bot, 
  Send, 
  User, 
  Sparkles, 
  Loader2, 
  Trash2, 
  Search, 
  ShieldAlert, 
  Zap, 
  History,
  Terminal,
  FileSearch,
  MessageSquare
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { aiVulnerabilityExplanationAndFix } from '@/ai/flows/ai-vulnerability-explanation-and-fix';
import { aiSecurityOpsAssistant } from '@/ai/flows/ai-security-ops-flow';
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
  const [historySearch, setHistorySearch] = useState('');
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

  const filteredMessages = useMemo(() => {
    if (!historySearch.trim()) return messages;
    return messages.filter(m => m.content.toLowerCase().includes(historySearch.toLowerCase()));
  }, [messages, historySearch]);

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

      const userMsg = `Analyzing context for finding: **${vuln.title}** on **${vuln.assetName}** (Severity: ${vuln.severity})`;
      await saveMessage('user', userMsg);

      const result = await aiVulnerabilityExplanationAndFix({
        vulnerabilityTitle: vuln.title,
        vulnerabilityDescription: vuln.description,
        severity: vuln.severity,
        impact: vuln.impact || "High priority system impact.",
        evidence: vuln.evidence,
        affectedCode: vuln.affectedCode
      });

      const assistantMsg = `### AI Security Assessment
      
#### Overview
${result.explanation}

#### Recommended Fixes
${result.suggestedFixes}

#### Remediation Roadmap
${result.remediationPlan}

#### Security Best Practices
${result.bestPractices.map(bp => `- ${bp}`).join('\n')}`;

      await saveMessage('assistant', assistantMsg);
    } catch (error) {
      await saveMessage('assistant', "System error: Failed to ingest vulnerability telemetry.");
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

  const handleSend = async (overrideText?: string) => {
    const textToSend = overrideText || input;
    if (!textToSend.trim() || isTyping || !currentUser) return;

    setInput('');
    setIsTyping(true);

    try {
      await saveMessage('user', textToSend);

      let responseContent = "";
      const lowerText = textToSend.toLowerCase();

      if (lowerText.includes('hunt') || lowerText.includes('threat')) {
        const result = await aiSecurityOpsAssistant({
          query: textToSend,
          type: 'threat_hunt'
        });
        responseContent = `### Threat Hunting Guidance\n\n${result.analysis}\n\n#### Hunt Query / Action Plan\n${result.actionPlan}`;
      } else if (lowerText.includes('incident') || lowerText.includes('response')) {
        const result = await aiSecurityOpsAssistant({
          query: textToSend,
          type: 'incident_response'
        });
        responseContent = `### Incident Response Plan\n\n${result.analysis}\n\n#### Containment & Eradication Steps\n${result.actionPlan}`;
      } else {
        const result = await aiVulnerabilityExplanationAndFix({
          vulnerabilityTitle: textToSend,
          vulnerabilityDescription: "General user query from chat interface.",
          severity: "Medium",
          impact: "Consult expert for context."
        });
        responseContent = result.explanation + "\n\n" + result.suggestedFixes;
      }

      await saveMessage('assistant', responseContent);
    } catch (error) {
      await saveMessage('assistant', "I encountered a protocol error while processing your request. Please retry.");
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
    <div className="max-w-6xl mx-auto h-[calc(100vh-12rem)] flex gap-6">
      {/* Sidebar: Chat History & Search */}
      <div className="w-80 flex flex-col gap-4 hidden lg:flex">
        <div className="glass-card p-4 space-y-4 flex-1 overflow-hidden flex flex-col">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <History className="w-4 h-4 text-primary" />
              History
            </h3>
            <Button variant="ghost" size="icon" onClick={clearHistory} className="h-8 w-8 text-muted-foreground hover:text-destructive">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input 
              placeholder="Search history..." 
              value={historySearch}
              onChange={(e) => setHistorySearch(e.target.value)}
              className="h-9 pl-9 text-xs bg-white/5 border-white/10"
            />
          </div>
          <div className="flex-1 overflow-y-auto space-y-2 scrollbar-hide">
            {messages.filter(m => m.role === 'user').reverse().map((m) => (
              <div 
                key={m.id} 
                onClick={() => setInput(m.content)}
                className="p-3 rounded-xl bg-white/5 border border-transparent hover:border-primary/30 cursor-pointer group transition-all"
              >
                <p className="text-[11px] text-white truncate group-hover:text-primary">{m.content}</p>
                <p className="text-[9px] text-muted-foreground mt-1">
                  {m.createdAt?.toDate().toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col gap-6">
        <div className="flex justify-between items-end">
          <div className="flex flex-col gap-1">
            <h2 className="text-3xl font-headline font-bold text-white flex items-center gap-3">
              <Bot className="w-8 h-8 text-primary" />
              AI Security Operations
            </h2>
            <p className="text-muted-foreground text-sm">Elite cybersecurity assistance for remediation, hunting, and response.</p>
          </div>
        </div>

        <div className="flex-1 flex flex-col glass-card rounded-2xl overflow-hidden border-border relative">
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide">
            {messages.length === 0 && !chatLoading && (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-6 opacity-40">
                <div className="w-20 h-20 rounded-3xl cyber-gradient flex items-center justify-center animate-pulse">
                  <Bot className="w-10 h-10 text-white" />
                </div>
                <div className="space-y-2">
                  <p className="text-lg font-bold text-white">System Ready</p>
                  <p className="text-sm max-w-xs mx-auto">Upload finding telemetry or query the knowledge base for real-time security operations guidance.</p>
                </div>
              </div>
            )}
            
            {filteredMessages.map((msg) => (
              <div key={msg.id} className={cn(
                "flex gap-6 max-w-[90%]",
                msg.role === 'user' ? "ml-auto flex-row-reverse text-right" : "mr-auto"
              )}>
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-xl border",
                  msg.role === 'assistant' ? "cyber-gradient border-white/20" : "bg-white/10 border-white/5"
                )}>
                  {msg.role === 'assistant' ? <Bot className="w-7 h-7 text-white" /> : <User className="w-7 h-7 text-white" />}
                </div>
                <div className={cn(
                  "p-6 rounded-3xl text-sm leading-relaxed border shadow-2xl",
                  msg.role === 'assistant' 
                    ? "bg-white/5 border-white/5 text-white" 
                    : "bg-primary/20 border-primary/20 text-white"
                )}>
                  <div className="prose prose-invert prose-p:leading-relaxed prose-pre:bg-black/50 prose-pre:border prose-pre:border-white/10 max-w-none prose-sm">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-6 max-w-[90%] mr-auto">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-xl cyber-gradient border border-white/20">
                  <Bot className="w-7 h-7 text-white" />
                </div>
                <div className="p-6 rounded-3xl bg-white/5 border border-white/5 flex gap-2 items-center">
                  <span className="w-2 h-2 bg-primary rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-primary rounded-full animate-bounce delay-100"></span>
                  <span className="w-2 h-2 bg-primary rounded-full animate-bounce delay-200"></span>
                </div>
              </div>
            )}
          </div>

          <div className="p-8 bg-white/5 border-t border-white/10 space-y-6">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Input 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Analyze logs, hunt for threats, or explain a CVE..."
                  className="bg-black/40 border-white/10 rounded-2xl h-16 pl-6 pr-14 focus:ring-primary/50 text-white text-base"
                />
                <Sparkles className="absolute right-5 top-1/2 -translate-y-1/2 w-6 h-6 text-primary/50" />
              </div>
              <Button 
                onClick={() => handleSend()}
                className="h-16 w-16 rounded-2xl cyber-gradient border-none shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all p-0"
                disabled={isTyping || !input.trim()}
              >
                <Send className="w-6 h-6" />
              </Button>
            </div>
            
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {[
                { label: "Incident Response Plan", icon: Zap, prompt: "Create an Incident Response plan for a Ransomware infection." },
                { label: "Threat Hunt KQL", icon: FileSearch, prompt: "Generate a KQL query to hunt for Brute Force attempts." },
                { label: "CVE Analysis", icon: ShieldAlert, prompt: "Explain the root cause and CVSS vector for CVE-2024-3094." },
                { label: "Secure Coding", icon: Terminal, prompt: "Show me secure coding patterns to prevent SQL injection in Node.js." }
              ].map(suggestion => (
                <button 
                  key={suggestion.label}
                  onClick={() => handleSend(suggestion.prompt)}
                  className="flex items-center gap-2 whitespace-nowrap px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-[11px] font-bold text-muted-foreground hover:bg-white/10 hover:text-white hover:border-primary/50 transition-all"
                >
                  <suggestion.icon className="w-3.5 h-3.5" />
                  {suggestion.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
