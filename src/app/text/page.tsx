"use client";

"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UnicodeGenerator from "./components/UnicodeGenerator";
import Header from "../components/Header";
import { useSearchParams } from 'next/navigation'; // Added useSearchParams import

export default function TextTools() {
  const searchParams = useSearchParams();
  const defaultTab = searchParams.get('tool') || 'unicode';

  return (
    <div className="min-h-screen p-6 md:p-12 bg-gradient-to-b from-gray-900 to-black">
      <Header />
      <div className="max-w-4xl mx-auto pt-16 space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Text Tools</h1>
        </div>
        <Tabs defaultValue={defaultTab} className="w-full"> {/* Updated defaultValue */}
          <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <TabsTrigger value="unicode">Unicode Generator</TabsTrigger>
            {/* Add more TabsTriggers here if other text tools are created */}
          </TabsList>
          <TabsContent value="unicode" className="mt-4">
            <Card> {/* This Card should now use the standardized styling */}
              <CardContent className="pt-6">
                <UnicodeGenerator />
              </CardContent>
            </Card>
          </TabsContent>
          {/* Add more TabsContent here for other text tools */}
        </Tabs>
      </div>
    </div>
  );
}