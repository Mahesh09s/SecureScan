
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
  FileBadge
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
      // 1. Fetch current vulnerabilities to build report context
      const vulnsSnap = await getDocs(query(collection(firestore, 'vulnerabilities'), where('ownerId', '==', currentUser.uid)));
      const vulnerabilities = vulnsSnap.docs.map(d => ({ ...d.data(), id: d.id }));

      if (vulnerabilities.length === 0) {
        toast({ variant: "destructive", title: "No Data", description: "You need at least one vulnerability to generate a report." });
        setIsGenerating(false);
        return;
      }

      const riskScore = calculateRiskScore(vulnerabilities);
      
      // 2. Call AI for Executive Summary
      const aiResult = await aiExecutiveSummaryForReports({
        reportTitle: `Security Assessment Report - ${new Date().toLocaleDateString()}`,
        overallRiskScore: `${riskScore}/100`,
        assetDescription: "Global Security Surface",
        vulnerabilities: vulnerabilities.slice(0, 10).map((v: any) => ({
          title: v.title,
          severity: v.severity,
          description: v.description,
          impact: v.impact || "Undetermined"
        }))
      });

      // 3. Save Report to Firestore
      const reportData = {
        title: `Assessment Report - ${new Date().toLocaleDateString()}`,
        executiveSummary: aiResult.summary,
        riskScore,
        vulnerabilities,
        status: "Completed",
        ownerId: currentUser.uid,
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(firestore, 'reports'), reportData);
      toast({ title: "Report Generated", description: "Your new security report is ready for download." });
    } catch (error) {
      console.error(error);
      toast({ variant: "destructive", title: "Generation Failed", description: "AI engine was unable to compile the report." });
    } finally {
      setIsGenerating(false);
    }
  };

  const deleteReport = async (id: string) => {
    if (!firestore) return;
    try {
      await deleteDoc(doc(firestore, 'reports', id));
      toast({ title: "Report Deleted" });
    } catch (error) {
      toast({ variant: "destructive", title: "Error" });
    }
  };

  const downloadPDF = (report: any) => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(22);
    doc.setTextColor(139, 92, 246); // Primary Purple
    doc.text("SecureScan Report", 14, 22);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date(report.createdAt?.seconds * 1000).toLocaleDateString()}`, 14, 30);
    doc.text(`Title: ${report.title}`, 14, 35);
    doc.text(`Risk Score: ${report.riskScore}/100`, 14, 40);

    // Executive Summary
    doc.setFontSize(16);
    doc.setTextColor(0);
    doc.text("Executive Summary", 14, 55);
    doc.setFontSize(10);
    const splitSummary = doc.splitTextToSize(report.executiveSummary, 180);
    doc.text(splitSummary, 14, 65);

    // Vulnerabilities Table
    const tableData = report.vulnerabilities.map((v: any) => [
      v.title,
      v.severity,
      mapToOwasp(v.title, v.description),
      mapToMitre(v.title, v.description)
    ]);

    (doc as any).autoTable({
      startY: 65 + (splitSummary.length * 5) + 10,
      head: [['Vulnerability', 'Severity', 'OWASP Top 10', 'MITRE ATT&CK']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillStyle: 'hsl(var(--primary))' }
    });

    doc.save(`${report.title}.pdf`);
  };

  const downloadCSV = (report: any) => {
    const headers = ["Title", "Severity", "Description", "OWASP", "MITRE", "Impact", "Recommendation"];
    const rows = report.vulnerabilities.map((v: any) => [
      v.title,
      v.severity,
      `"${v.description.replace(/"/g, '""')}"`,
      mapToOwasp(v.title, v.description),
      mapToMitre(v.title, v.description),
      `"${(v.impact || "").replace(/"/g, '""')}"`,
      `"${(v.recommendation || "").replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${report.title}.csv`;
    link.click();
  };

  const downloadJSON = (report: any) => {
    const data = {
      ...report,
      frameworkMappings: report.vulnerabilities.map((v: any) => ({
        vulnId: v.id,
        owasp: mapToOwasp(v.title, v.description),
        mitre: mapToMitre(v.title, v.description)
      }))
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${report.title}.json`;
    link.click();
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-headline font-bold text-white text-glow flex items-center gap-3">
            <FileBadge className="w-8 h-8 text-primary" />
            Compliance Reports
          </h2>
          <p className="text-muted-foreground">Download executive and technical reports for audits and management.</p>
        </div>
        <Button 
          onClick={generateReport}
          disabled={isGenerating}
          className="cyber-gradient border-none shadow-lg shadow-primary/20 hover:scale-105 transition-all rounded-xl gap-2 h-11 px-6"
        >
          {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
          Generate New Report
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 glass-card">
          <CardHeader>
            <CardTitle className="text-lg font-headline">Recent Reports</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="p-20 text-center text-muted-foreground">Loading audit archives...</div>
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
                            {report.createdAt?.toDate().toLocaleString()} • {report.vulnerabilities?.length || 0} Findings
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[10px] border-emerald-500/30 text-emerald-500">
                          Risk Score: {report.riskScore}
                        </Badge>
                        <Button variant="ghost" size="icon" onClick={() => deleteReport(report.id)} className="text-muted-foreground hover:text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      <Button variant="secondary" size="sm" onClick={() => downloadPDF(report)} className="bg-white/5 border-white/10 text-[11px] gap-2 h-8">
                        <Download className="w-3 h-3" /> PDF
                      </Button>
                      <Button variant="secondary" size="sm" onClick={() => downloadCSV(report)} className="bg-white/5 border-white/10 text-[11px] gap-2 h-8">
                        <TableIcon className="w-3 h-3" /> CSV
                      </Button>
                      <Button variant="secondary" size="sm" onClick={() => downloadJSON(report)} className="bg-white/5 border-white/10 text-[11px] gap-2 h-8">
                        <FileJson className="w-3 h-3" /> JSON
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-20 text-center flex flex-col items-center gap-4 opacity-50">
                <FileText className="w-12 h-12 text-muted-foreground" />
                <p className="text-sm">No reports generated yet. Compile your first assessment.</p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="glass-card border-l-4 border-l-primary">
            <CardHeader>
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Reporting Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground leading-relaxed">
              <p>Reports include automatic mapping to:</p>
              <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/10">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                <span className="text-xs text-white">OWASP Top 10 (2021)</span>
              </div>
              <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/10">
                <ShieldCheck className="w-5 h-5 text-blue-500" />
                <span className="text-xs text-white">MITRE ATT&CK Framework</span>
              </div>
              <p className="text-[10px] mt-4 opacity-70">
                * PDF reports use AI to generate executive summaries tailored for technical leadership.
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card overflow-hidden">
            <div className="p-6 space-y-4">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <ArrowRight className="w-4 h-4 text-primary" />
                Next Steps
              </h4>
              <p className="text-xs text-muted-foreground">Ready for your SOC 2 audit? Ensure all Critical findings have resolution logs before generating final reports.</p>
              <Button variant="link" className="text-primary text-xs p-0 h-auto" onClick={() => window.location.href='/vulnerabilities'}>
                Review Findings →
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
