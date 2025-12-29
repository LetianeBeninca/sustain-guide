import { Leaf } from 'lucide-react';

export function Header() {
  return (
    <header className="w-full py-6 px-4 border-b border-border bg-card">
      <div className="max-w-4xl mx-auto flex items-center justify-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <Leaf className="h-6 w-6 text-primary" />
        </div>
        <div className="text-center">
          <h1 className="text-2xl md:text-3xl font-serif font-semibold text-foreground tracking-tight">
            SustainDiagnostic
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Initial Sustainability Assessment for Building Projects
          </p>
        </div>
      </div>
    </header>
  );
}
