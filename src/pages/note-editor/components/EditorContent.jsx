import React, { useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const EditorContent = ({ 
  content, 
  onContentChange, 
  placeholder = "Start writing your note...",
  isPreviewMode = false,
  onSelectionChange 
}) => {
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current && !isPreviewMode) {
      // Auto-resize textarea
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [content, isPreviewMode]);

  const handleSelectionChange = () => {
    if (textareaRef.current && onSelectionChange) {
      const { selectionStart, selectionEnd } = textareaRef.current;
      onSelectionChange({ start: selectionStart, end: selectionEnd });
    }
  };

  const renderMarkdownPreview = (text) => {
    // Simple markdown rendering for preview
    let html = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-muted px-1 py-0.5 rounded text-sm font-mono">$1</code>')
      .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mb-4 mt-6">$1</h1>')
      .replace(/^## (.*$)/gm, '<h2 class="text-xl font-semibold mb-3 mt-5">$1</h2>')
      .replace(/^### (.*$)/gm, '<h3 class="text-lg font-medium mb-2 mt-4">$1</h3>')
      .replace(/^- (.*$)/gm, '<li class="ml-4">$1</li>')
      .replace(/^> (.*$)/gm, '<blockquote class="border-l-4 border-primary pl-4 italic text-muted-foreground">$1</blockquote>')
      .replace(/\n/g, '<br>');

    // Wrap list items
    html = html.replace(/(<li.*?<\/li>)/g, '<ul class="list-disc ml-4 mb-4">$1</ul>');

    return html;
  };

  if (isPreviewMode) {
    return (
      <div className="flex-1 p-4 overflow-y-auto">
        {content ? (
          <div 
            className="prose prose-slate max-w-none"
            dangerouslySetInnerHTML={{ __html: renderMarkdownPreview(content) }}
          />
        ) : (
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            <div className="text-center">
              <Icon name="FileText" size={48} className="mx-auto mb-4 opacity-50" />
              <p>Nothing to preview yet</p>
              <p className="text-sm">Start writing to see the preview</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => onContentChange(e.target.value)}
        onSelect={handleSelectionChange}
        onKeyUp={handleSelectionChange}
        placeholder={placeholder}
        className="flex-1 w-full p-4 bg-transparent text-foreground placeholder-muted-foreground border-none outline-none resize-none font-mono text-sm leading-relaxed min-h-96"
        style={{ 
          minHeight: '400px',
          maxHeight: 'calc(100vh - 300px)'
        }}
      />
      
      {/* Character and Word Count */}
      <div className="flex items-center justify-between px-4 py-2 text-xs text-muted-foreground border-t border-border bg-muted/30">
        <div className="flex items-center space-x-4">
          <span>{content.length} characters</span>
          <span>{content.trim() ? content.trim().split(/\s+/).length : 0} words</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <Icon name="Type" size={12} />
          <span>Markdown supported</span>
        </div>
      </div>
    </div>
  );
};

export default EditorContent;