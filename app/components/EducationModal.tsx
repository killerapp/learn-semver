import React from 'react';
import { 
  Zap, 
  Sparkles, 
  Bug, 
  BookOpen, 
  GitCommit, 
  FileText,
  ExternalLink
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface EducationModalProps {
  isOpen: boolean;
  onClose: (open: boolean) => void;
}

export const EducationModal: React.FC<EducationModalProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Semantic Versioning Guide</DialogTitle>
          <DialogDescription>
            Learn how semantic versioning works and best practices
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4 border-red-500/30 bg-red-500/10">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-red-500" />
                <span className="font-bold text-red-500">MAJOR (X.0.0)</span>
              </div>
              <p className="text-sm">Breaking changes that are incompatible with previous versions</p>
            </Card>
            <Card className="p-4 border-green-500/30 bg-green-500/10">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-green-500" />
                <span className="font-bold text-green-500">MINOR (x.X.0)</span>
              </div>
              <p className="text-sm">New features that are backwards compatible</p>
            </Card>
            <Card className="p-4 border-blue-500/30 bg-blue-500/10">
              <div className="flex items-center gap-2 mb-2">
                <Bug className="w-5 h-5 text-blue-500" />
                <span className="font-bold text-blue-500">PATCH (x.x.X)</span>
              </div>
              <p className="text-sm">Bug fixes that are backwards compatible</p>
            </Card>
          </div>
          
          {/* Educational Resources */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3">Learn More</h3>
            <div className="grid grid-cols-2 gap-3">
              <a href="https://semver.org" target="_blank" rel="noopener noreferrer" 
                 className="flex items-center gap-2 p-3 rounded-lg border hover:bg-accent transition-colors">
                <BookOpen className="w-4 h-4" />
                <span>Semantic Versioning Spec</span>
                <ExternalLink className="w-3 h-3 ml-auto" />
              </a>
              <a href="https://conventionalcommits.org" target="_blank" rel="noopener noreferrer"
                 className="flex items-center gap-2 p-3 rounded-lg border hover:bg-accent transition-colors">
                <GitCommit className="w-4 h-4" />
                <span>Conventional Commits</span>
                <ExternalLink className="w-3 h-3 ml-auto" />
              </a>
              <a href="https://keepachangelog.com" target="_blank" rel="noopener noreferrer"
                 className="flex items-center gap-2 p-3 rounded-lg border hover:bg-accent transition-colors">
                <FileText className="w-4 h-4" />
                <span>Keep a Changelog</span>
                <ExternalLink className="w-3 h-3 ml-auto" />
              </a>
              <a href="https://agenticinsights.com/blog" target="_blank" rel="noopener noreferrer"
                 className="flex items-center gap-2 p-3 rounded-lg border hover:bg-accent transition-colors">
                <Sparkles className="w-4 h-4" />
                <span>Agentic Insights Blog</span>
                <ExternalLink className="w-3 h-3 ml-auto" />
              </a>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};