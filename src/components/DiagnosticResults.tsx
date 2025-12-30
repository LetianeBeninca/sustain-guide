import { DiagnosticResult } from '@/lib/diagnosticLogic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Search, Target, CheckSquare, BarChart3, AlertTriangle, ArrowLeft, Thermometer, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';

interface DiagnosticResultsProps {
  result: DiagnosticResult;
  onReset: () => void;
}

export function DiagnosticResults({ result, onReset }: DiagnosticResultsProps) {
  const { toast } = useToast();

  const getImpactBadgeVariant = (level: string) => {
    switch (level) {
      case 'High':
        return 'default';
      case 'Medium':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const exportToPDF = () => {
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 20;
      const contentWidth = pageWidth - margin * 2;
      let yPos = 20;

      // Helper function to add wrapped text
      const addWrappedText = (text: string, x: number, y: number, maxWidth: number, lineHeight: number = 6): number => {
        const lines = doc.splitTextToSize(text, maxWidth);
        doc.text(lines, x, y);
        return y + lines.length * lineHeight;
      };

      // Helper to check and add new page if needed
      const checkNewPage = (neededSpace: number) => {
        if (yPos + neededSpace > doc.internal.pageSize.getHeight() - 20) {
          doc.addPage();
          yPos = 20;
        }
      };

      // Title
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('Sustainability Diagnostic Report', margin, yPos);
      yPos += 12;

      // Date
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Generated: ${new Date().toLocaleDateString()}`, margin, yPos);
      yPos += 15;

      // Climate Zone Section
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Detected Climate Zone', margin, yPos);
      yPos += 8;
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.text(`Climate: ${result.climateInfo.label}`, margin, yPos);
      yPos += 6;
      doc.text(`Primary Concern: ${result.climateInfo.primaryConcern === 'both' ? 'Heating & Cooling' : result.climateInfo.primaryConcern === 'heating' ? 'Heating' : 'Cooling'}`, margin, yPos);
      yPos += 6;
      doc.text(`Characteristics: ${result.climateInfo.characteristics}`, margin, yPos);
      yPos += 15;

      // Diagnostic Section
      checkNewPage(40);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Sustainability Diagnostic', margin, yPos);
      yPos += 8;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      yPos = addWrappedText(result.diagnostic, margin, yPos, contentWidth);
      yPos += 10;

      // Recommendations Section
      checkNewPage(30);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Priority Recommendations', margin, yPos);
      yPos += 8;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');

      result.recommendations.forEach((rec, index) => {
        checkNewPage(25);
        doc.setFont('helvetica', 'bold');
        doc.text(`${index + 1}.`, margin, yPos);
        doc.setFont('helvetica', 'normal');
        yPos = addWrappedText(rec, margin + 8, yPos, contentWidth - 8);
        yPos += 4;
      });
      yPos += 6;

      // Checklist Section
      checkNewPage(30);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Actionable Checklist', margin, yPos);
      yPos += 8;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');

      result.checklist.forEach((item) => {
        checkNewPage(15);
        doc.text('☐', margin, yPos);
        yPos = addWrappedText(item, margin + 8, yPos, contentWidth - 8);
        yPos += 2;
      });
      yPos += 6;

      // Impact Level Section
      checkNewPage(30);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Impact Level', margin, yPos);
      yPos += 8;
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text(result.impactLevel, margin, yPos);
      yPos += 6;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      yPos = addWrappedText(result.impactExplanation, margin, yPos, contentWidth);
      yPos += 10;

      // Disclaimer
      checkNewPage(25);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'italic');
      yPos = addWrappedText(
        'Disclaimer: This diagnostic provides an initial sustainability overview and does not replace detailed technical assessments or executive design development.',
        margin,
        yPos,
        contentWidth
      );

      // Save
      doc.save('sustainability-diagnostic-report.pdf');

      toast({
        title: 'PDF exported successfully',
        description: 'Your diagnostic report has been downloaded.',
      });
    } catch (error) {
      toast({
        title: 'Export failed',
        description: 'There was an error generating the PDF.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      {/* Export Button */}
      <div className="flex justify-end">
        <Button onClick={exportToPDF} variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export PDF
        </Button>
      </div>

      {/* Climate Zone Detection */}
      <Card className="shadow-lg border-primary/20 bg-primary/5">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-xl font-serif">
            <Thermometer className="h-5 w-5 text-primary" />
            Detected Climate Zone
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center gap-3">
            <Badge variant="default" className="text-base px-4 py-1">
              {result.climateInfo.label}
            </Badge>
            <Badge variant="outline" className="text-sm">
              Primary concern: {result.climateInfo.primaryConcern === 'both' ? 'Heating & Cooling' : result.climateInfo.primaryConcern === 'heating' ? 'Heating' : 'Cooling'}
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm">{result.climateInfo.characteristics}</p>
        </CardContent>
      </Card>

      {/* Sustainability Diagnostic */}
      <Card className="shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-xl font-serif">
            <Search className="h-5 w-5 text-primary" />
            Sustainability Diagnostic
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-foreground leading-relaxed">{result.diagnostic}</p>
        </CardContent>
      </Card>

      {/* Priority Recommendations */}
      <Card className="shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-xl font-serif">
            <Target className="h-5 w-5 text-primary" />
            Priority Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-4">
            {result.recommendations.map((recommendation, index) => (
              <li key={index} className="flex gap-4">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 text-primary font-semibold flex items-center justify-center text-sm">
                  {index + 1}
                </span>
                <p className="text-foreground leading-relaxed pt-0.5">{recommendation}</p>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      {/* Actionable Checklist */}
      <Card className="shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-xl font-serif">
            <CheckSquare className="h-5 w-5 text-primary" />
            Actionable Checklist
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {result.checklist.map((item, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="flex-shrink-0 w-5 h-5 rounded border-2 border-primary/40 mt-0.5" />
                <span className="text-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Impact Level */}
      <Card className="shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-xl font-serif">
            <BarChart3 className="h-5 w-5 text-primary" />
            Impact Level
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Badge variant={getImpactBadgeVariant(result.impactLevel)} className="text-base px-4 py-1">
            {result.impactLevel}
          </Badge>
          <p className="text-foreground leading-relaxed">{result.impactExplanation}</p>
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <Card className="shadow-lg border-muted">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <AlertTriangle className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
            <p className="text-muted-foreground text-sm leading-relaxed">
              This diagnostic provides an initial sustainability overview and does not replace detailed technical assessments or executive design development.
            </p>
          </div>
        </CardContent>
      </Card>

      <Separator />

      <div className="flex justify-center pb-8">
        <Button variant="outline" onClick={onReset} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Start New Diagnostic
        </Button>
      </div>
    </div>
  );
}
