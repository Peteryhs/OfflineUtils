"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UnicodeGenerator from "./components/UnicodeGenerator";
import Header from '../components/Header';

export default function TextTools() {
  return (
    <div className="min-h-screen p-6 md:p-12 bg-gradient-to-b from-gray-900 to-black">
      <Header />
      <div className="max-w-4xl mx-auto pt-16 space-y-8">
        <h1 className="text-3xl font-bold text-center mb-4 text-gray-100">Text Tools</h1>
        <p className="text-lg text-gray-400 text-center mb-8">A collection of utilities for text manipulation and generation.</p>
        <Tabs defaultValue="unicode" className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
            <TabsTrigger value="unicode">Unicode Generator</TabsTrigger>
          </TabsList>
          <TabsContent value="unicode" className="mt-4">
            <div className="p-6 bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-800">
              <UnicodeGenerator />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}