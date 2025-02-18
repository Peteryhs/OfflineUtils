"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { Slider } from "@/components/ui/slider";

const UNICODE_RANGES = [
  { id: "basic-latin", label: "Basic Latin (ASCII)", start: 0x0020, end: 0x007F },
  { id: "latin-1", label: "Latin-1 Supplement", start: 0x00A0, end: 0x00FF },
  { id: "symbols", label: "Symbols and Punctuation", start: 0x2000, end: 0x206F },
  { id: "currency", label: "Currency Symbols", start: 0x20A0, end: 0x20CF },
  { id: "arrows", label: "Arrows", start: 0x2190, end: 0x21FF },
  { id: "math", label: "Mathematical Operators", start: 0x2200, end: 0x22FF },
  { id: "box-drawing", label: "Box Drawing", start: 0x2500, end: 0x257F },
  { id: "geometric", label: "Geometric Shapes", start: 0x25A0, end: 0x25FF },
  { id: "emoji", label: "Emoji", start: 0x1F300, end: 0x1F9FF },
];

export default function UnicodeGenerator() {
  const [amount, setAmount] = useState(10);
  const [selectedRanges, setSelectedRanges] = useState(["basic-latin"]);
  const [generatedText, setGeneratedText] = useState("");
  const { toast } = useToast();

  const generateRandomChar = (start: number, end: number) => {
    return String.fromCodePoint(
      Math.floor(Math.random() * (end - start + 1)) + start
    );
  };

  const handleGenerate = () => {
    if (selectedRanges.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one Unicode range",
        variant: "destructive",
      });
      return;
    }

    const selectedRangesData = UNICODE_RANGES.filter((range) =>
      selectedRanges.includes(range.id)
    );

    let result = "";
    for (let i = 0; i < amount; i++) {
      const randomRange =
        selectedRangesData[
          Math.floor(Math.random() * selectedRangesData.length)
        ];
      result += generateRandomChar(randomRange.start, randomRange.end);
    }

    setGeneratedText(result);
  };

  const handleCopy = async () => {
    if (!generatedText) return;
    await navigator.clipboard.writeText(generatedText);
    toast({
      title: "Copied!",
      description: "Text copied to clipboard",
    });
  };

  const handleSave = () => {
    if (!generatedText) return;
    const blob = new Blob([generatedText], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'unicode-text';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    toast({
      title: "Saved!",
      description: "Text saved as file",
    });
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-6">
        <div className="space-y-2">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="amount" className="text-sm font-medium">Number of Characters</Label>
              <span className="text-sm text-gray-400">{amount}</span>
            </div>
            <Slider
              id="amount"
              min={1}
              max={1000}
              step={1}
              value={[amount]}
              onValueChange={(value) => setAmount(value[0])}
              className="w-full max-w-xs"
            />
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-medium">Unicode Ranges</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 p-4 rounded-xl border border-gray-800 bg-gray-900/30 backdrop-blur-sm">
            {UNICODE_RANGES.map((range) => (
              <div key={range.id} className="flex items-center space-x-3 p-3 rounded-xl bg-gray-900/50 hover:bg-gray-800/50 border border-gray-800 hover:border-gray-700 transition-all duration-300 group">
                <Checkbox
                  id={range.id}
                  checked={selectedRanges.includes(range.id)}
                  onCheckedChange={(checked) => {
                    setSelectedRanges(
                      checked
                        ? [...selectedRanges, range.id]
                        : selectedRanges.filter((id) => id !== range.id)
                    );
                  }}
                  className="data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                />
                <Label htmlFor={range.id} className="text-sm cursor-pointer text-gray-300 group-hover:text-white transition-colors duration-300">{range.label}</Label>
              </div>
            ))}
          </div>
        </div>

        <Button 
          onClick={handleGenerate} 
          className="w-full md:w-auto bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
        >
          Generate
        </Button>
      </div>

      {generatedText && (
        <div className="space-y-3">
          <Label className="text-sm font-medium">Generated Text</Label>
          <div className="p-6 bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-xl font-mono break-all relative min-h-[100px] max-h-[300px] overflow-y-auto group hover:border-gray-700 transition-all duration-300">
            {generatedText}
            <div className="absolute top-3 right-3 flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="bg-gray-900/50 hover:bg-gray-800/50 border border-gray-800 hover:border-gray-700 transition-all duration-300"
                onClick={handleCopy}
              >
                Copy
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-gray-900/50 hover:bg-gray-800/50 border border-gray-800 hover:border-gray-700 transition-all duration-300"
                onClick={handleSave}
              >
                Save as File
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}