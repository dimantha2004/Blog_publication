'use client';

import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, Edit } from 'lucide-react';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function MarkdownEditor({ value, onChange, placeholder }: MarkdownEditorProps) {
  const [activeTab, setActiveTab] = useState('edit');

  const renderMarkdown = (text: string) => {
    // Simple markdown renderer for preview
    return text
      .replace(/# (.*)/g, '<h1 class="text-3xl font-bold mb-4">$1</h1>')
      .replace(/## (.*)/g, '<h2 class="text-2xl font-bold mb-3">$1</h2>')
      .replace(/### (.*)/g, '<h3 class="text-xl font-bold mb-2">$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 rounded">$1</code>')
      .replace(/\n\n/g, '</p><p class="mb-4">')
      .replace(/\n/g, '<br/>');
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="border-b bg-gray-50 px-4 py-2">
          <TabsList className="grid w-40 grid-cols-2">
            <TabsTrigger value="edit" className="flex items-center space-x-1">
              <Edit className="w-4 h-4" />
              <span>Edit</span>
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center space-x-1">
              <Eye className="w-4 h-4" />
              <span>Preview</span>
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="edit" className="p-0 m-0">
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder || "Write your content in Markdown..."}
            className="min-h-[400px] border-0 resize-none rounded-none focus:ring-0"
          />
        </TabsContent>
        
        <TabsContent value="preview" className="p-0 m-0">
          <div className="min-h-[400px] p-4 bg-white">
            {value ? (
              <div 
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ 
                  __html: `<p class="mb-4">${renderMarkdown(value)}</p>` 
                }}
              />
            ) : (
              <p className="text-gray-500 italic">Nothing to preview yet...</p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}