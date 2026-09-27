import { useState } from 'react';
import {
  Folder, FileText, Code2, Plus, Trash2, ChevronDown, ChevronRight,
  FilePlus, FolderPlus, File
} from 'lucide-react';
import type { CodeLanguage } from '@/types';

export interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  language?: CodeLanguage;
  children?: FileNode[];
}

const generateId = () => Math.random().toString(36).slice(2, 10);

const defaultTree: FileNode[] = [
  {
    id: 'folder-docs',
    name: 'Documents',
    type: 'folder',
    children: [
      { id: 'doc-1', name: 'Welcome.md', type: 'file' },
      { id: 'doc-2', name: 'Notes.md', type: 'file' },
    ],
  },
  {
    id: 'folder-code',
    name: 'Code',
    type: 'folder',
    children: [
      { id: 'code-1', name: 'main.py', type: 'file', language: 'python' },
      { id: 'code-2', name: 'index.ts', type: 'file', language: 'typescript' },
    ],
  },
];

const langColors: Partial<Record<CodeLanguage, string>> = {
  python: 'text-yellow-400',
  javascript: 'text-yellow-300',
  typescript: 'text-blue-400',
  cpp: 'text-blue-300',
  rust: 'text-orange-400',
  go: 'text-cyan-400',
};

function FileIcon({ node }: { node: FileNode }) {
  if (node.type === 'folder') return <Folder className="w-3.5 h-3.5 text-yellow-500/80" />;
  if (node.language) return <Code2 className={`w-3.5 h-3.5 ${langColors[node.language] ?? 'text-[hsl(var(--text-subtle))]'}`} />;
  if (node.name.endsWith('.md')) return <FileText className="w-3.5 h-3.5 text-blue-400" />;
  return <File className="w-3.5 h-3.5 text-[hsl(var(--text-subtle))]" />;
}

interface TreeNodeProps {
  node: FileNode;
  depth: number;
  selectedId: string | null;
  onSelect: (node: FileNode) => void;
  onDelete: (id: string) => void;
}

function TreeNode({ node, depth, selectedId, onSelect, onDelete }: TreeNodeProps) {
  const [open, setOpen] = useState(true);
  const [hovered, setHovered] = useState(false);
  const isSelected = node.id === selectedId;

  return (
    <div>
      <div
        className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg cursor-pointer transition-colors group relative ${
          isSelected ? 'bg-blue-500/10 text-foreground' : 'hover:bg-[hsl(var(--surface-2))] text-[hsl(var(--text-secondary))]'
        }`}
        style={{ paddingLeft: `${8 + depth * 14}px` }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => {
          if (node.type === 'folder') setOpen((o) => !o);
          else onSelect(node);
        }}
      >
        {node.type === 'folder' && (
          <span className="text-[hsl(var(--text-subtle))]">
            {open ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
          </span>
        )}
        <FileIcon node={node} />
        <span className="text-xs flex-1 truncate font-medium">{node.name}</span>
        {hovered && node.type !== 'folder' && (
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(node.id); }}
            className="p-0.5 rounded opacity-0 group-hover:opacity-100 text-[hsl(var(--text-subtle))] hover:text-red-400 transition-all"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        )}
      </div>
      {node.type === 'folder' && open && node.children && (
        <div>
          {node.children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              depth={depth + 1}
              selectedId={selectedId}
              onSelect={onSelect}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface FileManagerProps {
  onFileSelect?: (node: FileNode) => void;
}

const FileManager = ({ onFileSelect }: FileManagerProps) => {
  const [tree, setTree] = useState<FileNode[]>(defaultTree);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const addFile = () => {
    const name = prompt('File name (e.g. notes.md or script.py):');
    if (!name) return;
    const ext = name.split('.').pop() ?? '';
    const langMap: Record<string, CodeLanguage> = {
      py: 'python', js: 'javascript', ts: 'typescript', cpp: 'cpp', rs: 'rust', go: 'go',
    };
    const newFile: FileNode = {
      id: generateId(),
      name,
      type: 'file',
      language: langMap[ext],
    };
    // Add to root or first folder
    setTree((prev) => {
      const next = [...prev];
      const firstFolder = next.find((n) => n.type === 'folder');
      if (firstFolder?.children) {
        firstFolder.children = [...firstFolder.children, newFile];
      } else {
        next.push(newFile);
      }
      return next;
    });
  };

  const addFolder = () => {
    const name = prompt('Folder name:');
    if (!name) return;
    const newFolder: FileNode = { id: generateId(), name, type: 'folder', children: [] };
    setTree((prev) => [...prev, newFolder]);
  };

  const deleteNode = (id: string) => {
    function removeFromTree(nodes: FileNode[]): FileNode[] {
      return nodes
        .filter((n) => n.id !== id)
        .map((n) =>
          n.children ? { ...n, children: removeFromTree(n.children) } : n
        );
    }
    setTree((prev) => removeFromTree(prev));
    if (selectedId === id) setSelectedId(null);
  };

  const handleSelect = (node: FileNode) => {
    setSelectedId(node.id);
    onFileSelect?.(node);
  };

  return (
    <div className="flex flex-col h-full bg-[hsl(var(--sidebar-background))] border-r border-[hsl(var(--border))]">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-[hsl(var(--border))]">
        <span className="text-xs font-semibold text-[hsl(var(--text-secondary))] uppercase tracking-wide">
          Files
        </span>
        <div className="flex items-center gap-0.5">
          <button
            onClick={addFile}
            title="New file"
            className="p-1.5 rounded-lg text-[hsl(var(--text-subtle))] hover:text-blue-400 hover:bg-blue-500/10 transition-colors"
          >
            <FilePlus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={addFolder}
            title="New folder"
            className="p-1.5 rounded-lg text-[hsl(var(--text-subtle))] hover:text-yellow-400 hover:bg-yellow-500/10 transition-colors"
          >
            <FolderPlus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Tree */}
      <div className="flex-1 overflow-y-auto py-1 px-1">
        {tree.map((node) => (
          <TreeNode
            key={node.id}
            node={node}
            depth={0}
            selectedId={selectedId}
            onSelect={handleSelect}
            onDelete={deleteNode}
          />
        ))}
      </div>

      {/* Footer */}
      <div className="px-3 py-2 border-t border-[hsl(var(--border))]">
        <p className="text-[10px] text-[hsl(var(--text-subtle))]">
          {tree.reduce((acc, n) => acc + (n.children?.length ?? 0) + (n.type === 'file' ? 1 : 0), 0)} files
        </p>
      </div>
    </div>
  );
};

export default FileManager;
