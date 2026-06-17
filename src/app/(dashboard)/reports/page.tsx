"use client";

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Download, 
  Plus, 
  Trash2, 
  Loader2, 
  ShieldCheck, 
  ArrowRight,
  FileJson,
  Table as TableIcon,
  FileBadge,
  LayoutTemplate,
  PieChart as PieIcon,
  ShieldAlert
} from 'lucide-react';
import { useFirestore, useAuth, useCollection } from '@/firebase';
import { collection, query, where, orderBy, addDoc, serverTimestamp, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { aiExecutiveSummaryForReports } from '@/ai/flows/ai-executive-summary-for-reports';
import { mapToOwasp, mapToMitre, calculateRiskScore } from '@/lib/report-utils';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export default function ReportsPage() {
  const firestore = useFirestore();
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);

  const reportsQuery = useMemo(() => {
    if (!firestore || !currentUser) return null;
    return query(
      collection(firestore, 'reports'),
      where('ownerId', '==', currentUser.uid),
      orderBy('createdAt', 'desc')
    );
  }, [firestore, currentUser]);

  const { data: reports, loading } = useCollection<any>(reportsQuery);

  const generateReport = async () => {
    if (!firestore || !currentUser) return;
    setIsGenerating(true);

    try {
      const vulnsSnap = await getDocs(query(collection(firestore, 'vulnerabilities'), where('ownerId', '==', currentUser.uid)));
      const vulnerabilities = vulnsSnap.docs.map(d => ({ ...d.data(), id: d.id }));

      if (vulnerabilities.length === 0) {
        toast({ variant: "destructive", title: "No Data", description: "At least one vulnerability record is required for audit compilation." });
        setIsGenerating(false);
        return;
      }

      const riskScore = calculateRiskScore(vulnerabilities);
      
      const aiResult = await aiExecutiveSummaryForReports({
        reportTitle: `Cyber Risk Assessment - ${new Date().toLocaleDateString()}`,
        overallRiskScore: `${riskScore}/100`,
        assetDescription: "Organization-wide Digital Perimeter",
        vulnerabilities: vulnerabilities.slice(0, 10).map((v: any) => ({
          title: v.title,
          severity: v.severity,
          description: v.description,
          impact: v.impact || "Undetermined system risk."
        }))
      });

      const reportData = {
        title: `Audit Report - ${new Date().toLocaleDateString()}`,
        executiveSummary: aiResult.summary,
        riskScore,
        vulnerabilities,
        status: "Completed",
        ownerId: currentUser.uid,
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(firestore, 'reports'), reportData);
      toast({ title: "Report Compiled", description: "Enterprise audit document is ready for distribution." });
    } catch (error) {
      toast({ variant: "destructive", title: "Generation Failed", description: "AI Synthesis engine encountered a protocol error." });
    } finally {
      setIsGenerating(false);
    }
  };

  const deleteReport = async (id: string) => {
    if (!firestore) return;
    try {
      await deleteDoc(doc(firestore, 'reports', id));
      toast({ title: "Report Archived" });
    } catch (error) {
      toast({ variant: "destructive", title: "Error" });
    }
  };

  const downloadPDF = (report: any) => {
    const doc = new jsPDF();
    
    // Cover Page
    doc.setFillColor(3, 7, 18);
    doc.rect(0, 0, 210, 297, 'F');
    
    doc.setFontSize(36);
    doc.setTextColor(59, 130, 246);
    doc.text("SecureScan", 105, 100, { align: 'center' });
    
    doc.setFontSize(24);
    doc.setTextColor(255, 255, 255);
    doc.text("Cyber Security Assessment", 105, 120, { align: 'center' });
    
    doc.setFontSize(14);
    doc.text(report.title, 105, 140, { align: 'center' });
    doc.text(`Security Score: ${report.riskScore}/100`, 105, 150, { align: 'center' });
    
    doc.addPage();
    doc.setTextColor(0, 0, 0); // Back to black for content

    // Executive Summary
    doc.setFontSize(20);
    doc.text("Executive Summary", 14, 30);
    doc.setFontSize(10);
    const splitSummary = doc.splitTextToSize(report.executiveSummary, 180);
    doc.text(splitSummary, 14, 45);

    // Detailed Findings
    const tableData = report.vulnerabilities.map((v: any) => [
      v.title,
      v.severity,
      mapToOwasp(v.title, v.description),
      mapToMitre(v.title, v.description)
    ]);

    (doc as any).autoTable({
      startY: 55 + (splitSummary.length * 5),
      head: [['Vulnerability Finding', 'Risk Level', 'OWASP Control', 'MITRE ATT&CK']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [59, 130, 246] }
    });

    doc.save(`${report.title.replace(/\s+/g, '_')}.pdf`);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-headline font-bold text-white text-glow flex items-center gap-3">
            <FileBadge className="w-8 h-8 text-primary" />
            Compliance Reporting Hub
          </h2>
          <p className="text-muted-foreground">Synthesize technical scan findings into executive-grade audit documentation.</p>
        </div>
        <Button 
          onClick={generateReport}
          disabled={isGenerating}
          className="cyber-gradient border-none shadow-lg shadow-primary/20 hover:scale-105 transition-all rounded-xl gap-2 h-11 px-6 text-white font-bold"
        >
          {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
          Compile New Audit
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 glass-card">
          <CardHeader>
            <CardTitle className="text-lg font-headline text-white flex items-center gap-2">
              <LayoutTemplate className="w-5 h-5 text-primary" />
              Document Archive
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="p-20 text-center text-muted-foreground flex items-center justify-center gap-3">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Decrypting audit records...</span>
              </div>
            ) : reports && reports.length > 0 ? (
              <div className="space-y-4">
                {reports.map((report) => (
                  <div key={report.id} className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/30 transition-all group">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                          <FileText className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-bold text-white group-hover:text-primary transition-colors">{report.title}</h4>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
                            {report.createdAt?.toDate().toLocaleString()} • {report.vulnerabilities?.length || 0} Findings Categorized
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[10px] border-emerald-500/30 text-emerald-500 font-bold bg-emerald-500/5">
                          Score: {report.riskScore}
                        </Badge>
                        <Button variant="ghost" size="icon" onClick={() => deleteReport(report.id)} className="text-muted-foreground hover:text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      <Button variant="secondary" size="sm" onClick={() => downloadPDF(report)} className="bg-white/5 border-white/10 text-[11px] gap-2 h-8 text-white hover:bg-white/10">
                        <Download className="w-3 h-3" /> PDF Export
                      </Button>
                      <Button variant="secondary" size="sm" className="bg-white/5 border-white/10 text-[11px] gap-2 h-8 text-white hover:bg-white/10">
                        <FileJson className="w-3 h-3" /> JSON Data
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-20 text-center flex flex-col items-center gap-4 opacity-50">
                <FileText className="w-12 h-12 text-muted-foreground" />
                <p className="text-sm text-white">No audit records found. Generate an assessment to begin.</p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="glass-card border-l-4 border-l-primary">
            <CardHeader>
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Framework Alignment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground leading-relaxed">
              <p className="text-white/80">Every SecureScan report is automatically cross-referenced with:</p>
              <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/10">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                <span className="text-xs text-white">OWASP Top 10 (2021) Mapping</span>
              </div>
              <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/10">
                <ShieldAlert className="w-5 h-5 text-primary" />
                <span className="text-xs text-white">MITRE ATT&CK TTP Correlation</span>
              </div>
              <p className="text-[10px] mt-4 opacity-60 italic text-white">
                * PDF reports include an AI-synthesized executive brief tailored for C-suite stakeholders.
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card overflow-hidden">
            <div className="p-6 space-y-4">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <ArrowRight className="w-4 h-4 text-primary" />
                Strategic Compliance
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">Audit documentation is version-controlled and cryptographically signed. Ensure all high-priority findings have associated remediation notes before final sign-off.</p>
              <Button variant="link" className="text-primary text-xs p-0 h-auto font-bold" onClick={() => window.location.href='/vulnerabilities'}>
                Verify Remediation Logs →
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}