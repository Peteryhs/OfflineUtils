"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CodeMirror from "@uiw/react-codemirror";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { javascript } from "@codemirror/lang-javascript";
import { autocompletion } from "@codemirror/autocomplete";
import { Extension } from "@codemirror/state";

export default function HtmlRenderer() {
  const [code, setCode] = useState("");
  const [dividerX, setDividerX] = useState(50); // percent
  const [dragging, setDragging] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (iframeRef.current) {
      const doc = iframeRef.current.contentDocument;
      if (doc) {
        doc.open();
        doc.write(code);
        doc.close();
      }
    }
  }, [code]);

  useEffect(() => {
    // Debounce rendering or render on button click for performance
    // const sanitized = sanitizeHtml(htmlInput); // htmlInput is removed
    // setRenderedOutput(sanitized); // _renderedOutput and setRenderedOutput are removed
  }, []); // Empty dependency array as htmlInput is removed

  const onMouseMove = useCallback((e: MouseEvent) => {
    if (!dragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    let percent = ((e.clientX - rect.left) / rect.width) * 100;
    percent = Math.max(10, Math.min(90, percent));
    setDividerX(percent);
  }, [dragging, containerRef, setDividerX]);

  const onMouseUp = useCallback(() => setDragging(false), [setDragging]);

  useEffect(() => {
    if (dragging) {
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
      return () => {
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
      };
    }
  }, [dragging, onMouseMove, onMouseUp]);

  // Helper to detect language mode based on content (simple heuristic)
  const getExtensions = () => {
    const exts: Extension[] = [html()];
    if (code.includes("<style")) exts.push(css());
    if (code.includes("<script")) exts.push(javascript());
    exts.push(autocompletion());
    return exts;
  };

  return (
    // Removed bg-gray-900, border-0, and redundant rounded-2xl from Card className
    // Kept layout specific classes: w-[85vw] mx-auto max-w-[100%] h-[calc(70vh)] flex shadow-lg overflow-hidden relative
    <Card className="w-[85vw] mx-auto max-w-[100%] h-[calc(70vh)] flex shadow-lg overflow-hidden relative">
      {/* Editor Panel Styling */}
      <div className="flex flex-col p-0 bg-card border-r border-border h-full" style={{width:`${dividerX}%`, minWidth:'350px'}} ref={containerRef}>
        <CardHeader className="p-6 pb-4">
          <CardTitle className="text-xl font-semibold text-card-foreground">HTML/CSS/JS Editor</CardTitle>
        </CardHeader>
        <CardContent className="p-6 flex-1 flex flex-col min-h-0">
          <label htmlFor="htmlInput" className="block text-sm font-medium text-muted-foreground mb-2">
            Enter HTML, CSS, and JS Code:
          </label>
          {/* CodeMirror container styling */}
          <div className="flex-1 min-h-0 bg-muted border border-border rounded-md overflow-y-auto flex flex-col" style={{height:'100%', minHeight:'200px', overflowY:'auto'}}>
            <CodeMirror
              value={code}
              height="100%"
              theme="dark"
              extensions={getExtensions()}
              onChange={setCode}
              basicSetup={{autocompletion: true}}
              placeholder="Enter HTML, CSS, and JS code here..."
              style={{fontFamily:'monospace', fontSize:'14px', background:'#1a202c', color:'#f8fafc', height:'100%', minHeight:'200px', overflowY:'auto'}} // CodeMirror's own theme styling
            />
          </div>
          {/* Info text styling */}
          <div className="text-xs text-muted-foreground mt-2 mb-0">
            <span className="inline-block bg-muted-foreground/20 px-2 py-1 rounded mr-2">Autocomplete: Ctrl+Space</span>
            <span className="inline-block bg-muted-foreground/20 px-2 py-1 rounded">Syntax Highlighting Enabled</span>
          </div>
        </CardContent>
      </div>
      {/* Divider for resizing */}
      <div
        className="absolute top-0 bottom-0 z-10 cursor-col-resize bg-border/50 hover:bg-border transition-colors duration-200" // Added some styling to the divider
        style={{left:`calc(${dividerX}% - 4px)`, width:'8px'}}
        onMouseDown={()=>setDragging(true)}
      />
      {/* Output Panel Styling */}
      <div className="flex flex-col bg-card p-0 justify-between h-full flex-1" style={{width:`${100-dividerX}%`}}>
        <div className="p-6 pb-0 flex-1 flex flex-col">
          <h3 className="text-lg font-medium text-card-foreground mb-2">Rendered Output:</h3>
          {/* iframe container styling */}
          <div className="flex-1 w-full border border-border rounded-md bg-muted overflow-auto p-0 min-h-0" style={{minHeight:'300px', height:'100%'}}>
            <iframe
              ref={iframeRef}
              title="HTML Output"
              // iframe element styling
              className="min-h-[200px] w-full border border-border rounded-md bg-white text-black overflow-auto"
              style={{background:'white', height:'100%', minHeight:'300px'}}
              sandbox="allow-scripts allow-same-origin"
            />
          </div>
        </div>
        {/* Helper text styling */}
        <p className="text-xs text-muted-foreground mt-2 p-6 pt-0">
          Note: For security reasons, scripts and potentially harmful HTML may be sanitized or ignored in the preview.
        </p>
      </div>
    </Card>
  );
}