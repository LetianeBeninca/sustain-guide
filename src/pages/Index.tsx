import { useState } from 'react';
import { Header } from '@/components/Header';
import { DiagnosticForm } from '@/components/DiagnosticForm';
import { DiagnosticResults } from '@/components/DiagnosticResults';
import { DiagnosticInput, DiagnosticResult, generateDiagnostic } from '@/lib/diagnosticLogic';

const Index = () => {
  const [result, setResult] = useState<DiagnosticResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (data: DiagnosticInput) => {
    setIsLoading(true);
    
    // Simulate processing time for better UX
    setTimeout(() => {
      const diagnosticResult = generateDiagnostic(data);
      setResult(diagnosticResult);
      setIsLoading(false);
      
      // Scroll to top to see results
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 800);
  };

  const handleReset = () => {
    setResult(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8 md:py-12 px-4">
        {result ? (
          <DiagnosticResults result={result} onReset={handleReset} />
        ) : (
          <div className="space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <h2 className="text-xl md:text-2xl font-serif text-foreground">
                Identify Sustainability Priorities
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Provide project details to receive an initial sustainability diagnostic with prioritized recommendations and actionable next steps.
              </p>
            </div>
            
            <DiagnosticForm onSubmit={handleSubmit} isLoading={isLoading} />
          </div>
        )}
      </main>
      
      <footer className="py-6 px-4 border-t border-border bg-card">
        <p className="text-center text-sm text-muted-foreground">
          Professional decision-support for early-stage sustainability planning
        </p>
      </footer>
    </div>
  );
};

export default Index;
