import { DiagnosticResult } from '@/lib/diagnosticLogic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Search, Target, CheckSquare, BarChart3, AlertTriangle, ArrowLeft } from 'lucide-react';

interface DiagnosticResultsProps {
  result: DiagnosticResult;
  onReset: () => void;
}

export function DiagnosticResults({ result, onReset }: DiagnosticResultsProps) {
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

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
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
