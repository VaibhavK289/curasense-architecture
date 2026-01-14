"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Pill,
  Plus,
  X,
  Search,
  AlertTriangle,
  CheckCircle,
  Info,
  Loader2,
  Sparkles,
  Scale,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { GradientText, SpotlightCard, AnimatedContainer, StaggerContainer, StaggerItem } from "@/components/ui/aceternity";
import { cn } from "@/lib/utils";
import { compareMedicines } from "@/lib/api";
import { springPresets } from "@/styles/tokens/animations";

interface MedicineInfo {
  name: string;
  category: string;
  commonUses: string;
  sideEffects: string;
  contraindications: string;
  interactions: string;
  dosage: string;
}

// Medicine card colors for visual distinction
const medicineColors = [
  { bg: "bg-[hsl(var(--color-diagnosis))]", text: "text-[hsl(var(--color-diagnosis))]" },
  { bg: "bg-[hsl(var(--color-medicine))]", text: "text-[hsl(var(--color-medicine))]" },
  { bg: "bg-[hsl(var(--color-imaging))]", text: "text-[hsl(var(--color-imaging))]" },
  { bg: "bg-[hsl(var(--color-warning))]", text: "text-[hsl(var(--color-warning))]" },
];

export default function MedicinePage() {
  const [medicines, setMedicines] = useState<string[]>([""]);
  const [isComparing, setIsComparing] = useState(false);
  const [comparisonResults, setComparisonResults] = useState<MedicineInfo[]>([]);

  const addMedicine = () => {
    if (medicines.length < 4) {
      setMedicines([...medicines, ""]);
    }
  };

  const removeMedicine = (index: number) => {
    if (medicines.length > 1) {
      setMedicines(medicines.filter((_, i) => i !== index));
    }
  };

  const updateMedicine = (index: number, value: string) => {
    const updated = [...medicines];
    updated[index] = value;
    setMedicines(updated);
  };

  const handleCompare = async () => {
    const validMedicines = medicines.filter((m) => m.trim());
    
    if (validMedicines.length < 2) {
      toast.error("Please enter at least 2 medicines to compare");
      return;
    }

    setIsComparing(true);

    try {
      toast.loading("Comparing medicines...", { id: "compare" });
      
      const response = await compareMedicines(validMedicines);
      setComparisonResults(response.comparison as unknown as MedicineInfo[]);
      
      toast.success("Comparison complete!", { id: "compare" });
    } catch {
      toast.error("Comparison failed. Please try again.", { id: "compare" });
    } finally {
      setIsComparing(false);
    }
  };

  const clearAll = () => {
    setMedicines([""]);
    setComparisonResults([]);
  };

  return (
    <AnimatedContainer variant="fadeUp">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[hsl(var(--color-medicine))] shadow-lg">
            <Pill className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">
              <GradientText>CuraSense Medicine</GradientText>
            </h1>
            <p className="text-[hsl(var(--muted-foreground))]">
              Compare medications, check interactions, and find alternatives
            </p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Input Section */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="h-5 w-5 text-[hsl(var(--color-medicine))]" />
                Medicine Comparison
              </CardTitle>
              <CardDescription>
                Enter 2-4 medicine names to compare their properties
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {medicines.map((medicine, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, ...springPresets.smooth }}
                  className="flex gap-2"
                >
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                    <Input
                      value={medicine}
                      onChange={(e) => updateMedicine(index, e.target.value)}
                      placeholder={`Medicine ${index + 1}`}
                      className="pl-10"
                    />
                  </div>
                  {medicines.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeMedicine(index)}
                      className="shrink-0 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--color-error))]"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </motion.div>
              ))}

              {medicines.length < 4 && (
                <Button
                  variant="outline"
                  onClick={addMedicine}
                  className="w-full gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Another Medicine
                </Button>
              )}

              <div className="pt-4 space-y-2">
                <Button
                  onClick={handleCompare}
                  disabled={
                    medicines.filter((m) => m.trim()).length < 2 || isComparing
                  }
                  className="w-full"
                  size="lg"
                >
                  {isComparing ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Comparing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5" />
                      Compare Medicines
                    </>
                  )}
                </Button>
                
                {(comparisonResults.length > 0 || medicines.some(m => m.trim())) && (
                  <Button
                    variant="ghost"
                    onClick={clearAll}
                    className="w-full text-[hsl(var(--muted-foreground))]"
                  >
                    Clear All
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Reference - using info semantic color */}
          <Card className="bg-[hsl(var(--color-info)/0.08)] border-[hsl(var(--color-info)/0.2)]">
            <CardContent className="p-6">
              <h3 className="font-semibold text-[hsl(var(--foreground))] mb-3 flex items-center gap-2">
                <Info className="h-5 w-5 text-[hsl(var(--color-info))]" />
                Comparison Features
              </h3>
              <ul className="space-y-2 text-sm text-[hsl(var(--muted-foreground))]">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-[hsl(var(--color-success))] mt-0.5 flex-shrink-0" />
                  Active ingredients comparison
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-[hsl(var(--color-success))] mt-0.5 flex-shrink-0" />
                  Side effects analysis
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-[hsl(var(--color-success))] mt-0.5 flex-shrink-0" />
                  Drug interaction warnings
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-[hsl(var(--color-success))] mt-0.5 flex-shrink-0" />
                  Dosage recommendations
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Results Section */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {comparisonResults.length > 0 ? (
              <motion.div
                key="results"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={springPresets.smooth}
                className="space-y-6"
              >
                {/* Comparison Cards */}
                <StaggerContainer staggerDelay={0.1} className="grid md:grid-cols-2 gap-4">
                  {comparisonResults.map((med, index) => (
                    <StaggerItem key={med.name}>
                      <Card className="h-full">
                        <CardHeader className="pb-3">
                          <div className="flex items-center gap-3">
                            <div
                              className={cn(
                                "w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold",
                                medicineColors[index % medicineColors.length].bg
                              )}
                            >
                              {index + 1}
                            </div>
                            <div>
                              <CardTitle className="text-lg">{med.name}</CardTitle>
                              <CardDescription>{med.category}</CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <ScrollArea className="h-[300px] pr-4">
                            <div className="space-y-4">
                              <div>
                                <h4 className="text-sm font-semibold text-[hsl(var(--foreground))] mb-1">
                                  Common Uses
                                </h4>
                                <p className="text-sm text-[hsl(var(--muted-foreground))]">
                                  {med.commonUses}
                                </p>
                              </div>
                              
                              <div>
                                <h4 className="text-sm font-semibold text-[hsl(var(--foreground))] mb-1">
                                  Dosage
                                </h4>
                                <p className="text-sm text-[hsl(var(--muted-foreground))]">
                                  {med.dosage}
                                </p>
                              </div>

                              <div>
                                <h4 className="text-sm font-semibold text-[hsl(var(--color-warning))] mb-1 flex items-center gap-1">
                                  <AlertTriangle className="h-4 w-4" />
                                  Side Effects
                                </h4>
                                <p className="text-sm text-[hsl(var(--muted-foreground))]">
                                  {med.sideEffects}
                                </p>
                              </div>

                              <div>
                                <h4 className="text-sm font-semibold text-[hsl(var(--color-error))] mb-1 flex items-center gap-1">
                                  <AlertTriangle className="h-4 w-4" />
                                  Contraindications
                                </h4>
                                <p className="text-sm text-[hsl(var(--muted-foreground))]">
                                  {med.contraindications}
                                </p>
                              </div>

                              <div>
                                <h4 className="text-sm font-semibold text-[hsl(var(--foreground))] mb-1">
                                  Interactions
                                </h4>
                                <p className="text-sm text-[hsl(var(--muted-foreground))]">
                                  {med.interactions}
                                </p>
                              </div>
                            </div>
                          </ScrollArea>
                        </CardContent>
                      </Card>
                    </StaggerItem>
                  ))}
                </StaggerContainer>

                {/* Warning Notice - semantic warning color */}
                <Card className="bg-[hsl(var(--color-warning)/0.08)] border-[hsl(var(--color-warning)/0.2)]">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-[hsl(var(--color-warning))] flex-shrink-0 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium text-[hsl(var(--foreground))]">
                          Important Notice
                        </p>
                        <p className="text-[hsl(var(--muted-foreground))] mt-1">
                          This comparison is for informational purposes only.
                          Always consult with a healthcare professional or
                          pharmacist before making any changes to your medication.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <SpotlightCard className="h-[500px] flex flex-col items-center justify-center text-center p-8">
                  <div className="w-20 h-20 rounded-2xl bg-[hsl(var(--muted))] flex items-center justify-center mb-6">
                    <Scale className="h-10 w-10 text-[hsl(var(--muted-foreground))]" />
                  </div>
                  <h3 className="text-xl font-semibold text-[hsl(var(--foreground))] mb-2">
                    Compare Medicines
                  </h3>
                  <p className="text-[hsl(var(--muted-foreground))] max-w-sm mb-6">
                    Enter at least 2 medicine names to compare their properties,
                    side effects, and interactions.
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {["Paracetamol", "Ibuprofen", "Aspirin", "Acetaminophen"].map(
                      (example) => (
                        <button
                          key={example}
                          onClick={() => {
                            const emptyIndex = medicines.findIndex((m) => !m.trim());
                            if (emptyIndex !== -1) {
                              updateMedicine(emptyIndex, example);
                            } else if (medicines.length < 4) {
                              setMedicines([...medicines, example]);
                            }
                          }}
                          className="px-3 py-1.5 text-sm rounded-full bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--color-medicine)/0.1)] hover:text-[hsl(var(--color-medicine))] transition-colors"
                        >
                          + {example}
                        </button>
                      )
                    )}
                  </div>
                </SpotlightCard>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </AnimatedContainer>
  );
}
