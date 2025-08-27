import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface RoadmapModalProps {
  isOpen: boolean;
  onClose: (open: boolean) => void;
}

export const RoadmapModal: React.FC<RoadmapModalProps> = ({ isOpen, onClose }) => {
  const completedFeatures = [
    'Interactive commit type buttons with keyboard shortcuts',
    'Real-time version calculation following semver rules',
    'Animated commit stream with smooth transitions',
    'Sound effects for different commit types',
    'Dark/Light theme toggle',
    'Release history tracking',
    'Educational tooltips and guide',
    'Magic UI/shadcn component integration',
    'Version transition animations',
    'Agentic Insights branding'
  ];

  const inProgressFeatures = [
    'Cloudflare Pages deployment',
    'Blog article about visual prototyping'
  ];

  const plannedFeatures = [
    'Export release notes to markdown',
    'Import commit history from Git',
    'Customizable commit types',
    'Tag management interface',
    'Pre-release version support (alpha/beta)',
    'Monorepo versioning mode',
    'CI/CD integration guides',
    'Collaborative mode for teams'
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] w-[95vw] sm:w-full overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">Feature Roadmap</DialogTitle>
          <DialogDescription className="text-sm">
            Track our progress and see what's coming next
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 sm:space-y-6 mt-4">
          {/* Completed Features */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-green-500">✅ Completed</h3>
            <div className="space-y-2">
              {completedFeatures.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2 rounded bg-green-500/10">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* In Progress */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-yellow-500">🚧 In Progress</h3>
            <div className="space-y-2">
              {inProgressFeatures.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2 rounded bg-yellow-500/10">
                  <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Planned Features */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-blue-500">📋 Planned</h3>
            <div className="space-y-2">
              {plannedFeatures.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2 rounded bg-blue-500/10">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};