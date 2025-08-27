import React from 'react';
import { Tag } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Release, commitTypeConfig } from '../types';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: (open: boolean) => void;
  releases: Release[];
}

export const HistoryModal: React.FC<HistoryModalProps> = ({ isOpen, onClose, releases }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] w-[95vw] sm:w-full overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">Release History</DialogTitle>
          <DialogDescription className="text-sm">
            View all releases and their commits
          </DialogDescription>
        </DialogHeader>
        
        {/* Changelog Best Practices Section */}
        <div className="mt-4 p-3 sm:p-4 bg-[#16162a] border border-gray-800 rounded-lg">
          <h3 className="text-sm font-semibold text-emerald-400 mb-3">📋 Changelog Best Practices</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium text-violet-400 mb-2">Standards & Conventions</h4>
              <ul className="space-y-1 text-gray-400">
                <li>• <a href="https://keepachangelog.com" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 underline">Keep a Changelog</a> - Standard format</li>
                <li>• <a href="https://www.conventionalcommits.org" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 underline">Conventional Commits</a> - Commit message convention</li>
                <li>• <a href="https://semver.org" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 underline">Semantic Versioning 2.0.0</a> - Version numbering rules</li>
                <li>• <a href="https://calver.org" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 underline">Calendar Versioning</a> - Date-based versioning</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-violet-400 mb-2">Changelog Principles</h4>
              <ul className="space-y-1 text-gray-400">
                <li>• Group changes by type (Added, Changed, Fixed, etc.)</li>
                <li>• Keep entries for humans, not machines</li>
                <li>• Link to commits, PRs, and issues</li>
                <li>• Never remove or edit published releases</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Semver Tools & Resources Section */}
        <div className="mt-4 p-3 sm:p-4 bg-[#16162a] border border-gray-800 rounded-lg">
          <h3 className="text-sm font-semibold text-emerald-400 mb-3">🚀 Semver Tools & Libraries</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div>
              <h4 className="font-medium text-violet-400 mb-2">JavaScript/Node.js</h4>
              <ul className="space-y-1 text-gray-400">
                <li>• <a href="https://www.npmjs.com/package/semver" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 underline">npm/semver</a> - Parser & comparator</li>
                <li>• <a href="https://github.com/semantic-release/semantic-release" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 underline">semantic-release</a> - Automated releases</li>
                <li>• <a href="https://github.com/conventional-changelog/standard-version" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 underline">standard-version</a> - Versioning utility</li>
                <li>• <a href="https://github.com/lerna/lerna" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 underline">Lerna</a> - Monorepo versioning</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-violet-400 mb-2">Other Languages</h4>
              <ul className="space-y-1 text-gray-400">
                <li>• <a href="https://python-semantic-release.readthedocs.io" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 underline">Python Semantic Release</a></li>
                <li>• <a href="https://github.com/Masterminds/semver" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 underline">Go Semver</a></li>
                <li>• <a href="https://github.com/dtolnay/semver" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 underline">Rust Semver</a></li>
                <li>• <a href="https://github.com/vdurmont/semver4j" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 underline">Semver4j</a> - Java library</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-violet-400 mb-2">Awesome Lists</h4>
              <ul className="space-y-1 text-gray-400">
                <li>• <a href="https://github.com/carloscuesta/gitmoji" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 underline">Gitmoji</a> - Emoji guide for commits</li>
                <li>• <a href="https://github.com/olivierlacan/keep-a-changelog" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 underline">Keep a Changelog</a></li>
                <li>• <a href="https://github.com/sindresorhus/awesome-nodejs#version-management" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 underline">Awesome Node.js</a> - Version tools</li>
                <li>• <a href="https://github.com/commitizen/cz-cli" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 underline">Commitizen</a> - Commit helper</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="space-y-4 mt-4">
          {releases.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Tag className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No releases yet</p>
              <p className="text-sm mt-2">Start adding commits and create your first release!</p>
            </div>
          ) : (
            releases.map(release => (
              <Card key={release.id} className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Tag className="w-5 h-5 text-primary" />
                    <span className="text-xl font-bold">v{release.version}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {release.timestamp.toLocaleString()}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {release.commits.map(commit => (
                    <Badge key={commit.id} variant="secondary" className="justify-start">
                      {React.createElement(commitTypeConfig[commit.type].icon, { 
                        className: "w-3 h-3 mr-1" 
                      })}
                      {commit.type}
                    </Badge>
                  ))}
                </div>
              </Card>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};