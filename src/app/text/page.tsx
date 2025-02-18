"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UnicodeGenerator from "./components/UnicodeGenerator";

export default function TextTools() {
  return (
    <div className="container mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold mb-4">Text Tools</h1>
      <Tabs defaultValue="unicode" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
          <TabsTrigger value="unicode">Unicode Generator</TabsTrigger>
        </TabsList>
        <TabsContent value="unicode" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <UnicodeGenerator />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}