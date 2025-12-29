import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DiagnosticInput } from '@/lib/diagnosticLogic';
import { MapPin, Building2, Ruler, Layers, Gauge } from 'lucide-react';

interface DiagnosticFormProps {
  onSubmit: (data: DiagnosticInput) => void;
  isLoading?: boolean;
}

export function DiagnosticForm({ onSubmit, isLoading }: DiagnosticFormProps) {
  const [location, setLocation] = useState('');
  const [buildingType, setBuildingType] = useState<DiagnosticInput['buildingType'] | ''>('');
  const [floorArea, setFloorArea] = useState('');
  const [projectStage, setProjectStage] = useState<DiagnosticInput['projectStage'] | ''>('');
  const [efficiencyLevel, setEfficiencyLevel] = useState<DiagnosticInput['efficiencyLevel'] | ''>('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!location.trim()) {
      newErrors.location = 'Location is required';
    }
    if (!buildingType) {
      newErrors.buildingType = 'Building type is required';
    }
    if (!floorArea || parseFloat(floorArea) <= 0) {
      newErrors.floorArea = 'Valid floor area is required';
    }
    if (!projectStage) {
      newErrors.projectStage = 'Project stage is required';
    }
    if (!efficiencyLevel) {
      newErrors.efficiencyLevel = 'Efficiency level is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    onSubmit({
      location: location.trim(),
      buildingType: buildingType as DiagnosticInput['buildingType'],
      floorArea: parseFloat(floorArea),
      projectStage: projectStage as DiagnosticInput['projectStage'],
      efficiencyLevel: efficiencyLevel as DiagnosticInput['efficiencyLevel'],
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-serif">Project Information</CardTitle>
        <CardDescription>
          Enter the building project details to generate a sustainability diagnostic
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location" className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              Location (City, Country)
            </Label>
            <Input
              id="location"
              placeholder="e.g., Copenhagen, Denmark"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className={errors.location ? 'border-destructive' : ''}
            />
            {errors.location && (
              <p className="text-sm text-destructive">{errors.location}</p>
            )}
          </div>

          {/* Building Type */}
          <div className="space-y-2">
            <Label htmlFor="buildingType" className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-primary" />
              Building Type
            </Label>
            <Select value={buildingType} onValueChange={(value) => setBuildingType(value as DiagnosticInput['buildingType'])}>
              <SelectTrigger className={errors.buildingType ? 'border-destructive' : ''}>
                <SelectValue placeholder="Select building type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="residential">Residential</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
                <SelectItem value="educational">Educational</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            {errors.buildingType && (
              <p className="text-sm text-destructive">{errors.buildingType}</p>
            )}
          </div>

          {/* Floor Area */}
          <div className="space-y-2">
            <Label htmlFor="floorArea" className="flex items-center gap-2">
              <Ruler className="h-4 w-4 text-primary" />
              Approximate Floor Area (m²)
            </Label>
            <Input
              id="floorArea"
              type="number"
              min="1"
              placeholder="e.g., 2500"
              value={floorArea}
              onChange={(e) => setFloorArea(e.target.value)}
              className={errors.floorArea ? 'border-destructive' : ''}
            />
            {errors.floorArea && (
              <p className="text-sm text-destructive">{errors.floorArea}</p>
            )}
          </div>

          {/* Project Stage */}
          <div className="space-y-2">
            <Label htmlFor="projectStage" className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-primary" />
              Project Stage / Intention
            </Label>
            <Select value={projectStage} onValueChange={(value) => setProjectStage(value as DiagnosticInput['projectStage'])}>
              <SelectTrigger className={errors.projectStage ? 'border-destructive' : ''}>
                <SelectValue placeholder="Select project stage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new_construction">New Construction</SelectItem>
                <SelectItem value="full_renovation">Full Renovation</SelectItem>
                <SelectItem value="partial_renovation">Partial Renovation</SelectItem>
              </SelectContent>
            </Select>
            {errors.projectStage && (
              <p className="text-sm text-destructive">{errors.projectStage}</p>
            )}
          </div>

          {/* Efficiency Level */}
          <div className="space-y-2">
            <Label htmlFor="efficiencyLevel" className="flex items-center gap-2">
              <Gauge className="h-4 w-4 text-primary" />
              Desired Efficiency Level
            </Label>
            <Select value={efficiencyLevel} onValueChange={(value) => setEfficiencyLevel(value as DiagnosticInput['efficiencyLevel'])}>
              <SelectTrigger className={errors.efficiencyLevel ? 'border-destructive' : ''}>
                <SelectValue placeholder="Select efficiency level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low — Cost-effective, practical measures</SelectItem>
                <SelectItem value="medium">Medium — Balanced performance approach</SelectItem>
                <SelectItem value="high">High — Integrated, systemic solutions</SelectItem>
              </SelectContent>
            </Select>
            {errors.efficiencyLevel && (
              <p className="text-sm text-destructive">{errors.efficiencyLevel}</p>
            )}
          </div>

          <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
            {isLoading ? 'Generating Diagnostic...' : 'Generate Sustainability Diagnostic'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
