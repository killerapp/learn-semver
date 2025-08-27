import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CommitType, commitTypeConfig, Commit, Release } from '../types';

interface ControlPanelProps {
  allCommits: Commit[];
  unreleasedCommits: Commit[];
  releases: Release[];
  onAddCommit: (type: CommitType) => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  allCommits,
  unreleasedCommits,
  releases,
  onAddCommit
}) => {
  return (
    <div className="h-[calc(100vh-240px)] bg-[#16162a] border border-gray-800 rounded-lg flex flex-col p-6">
      <div className="p-0 pb-4">
        <h3 className="text-lg font-semibold text-emerald-400">Commit Controls</h3>
        <p className="text-sm text-gray-400">Add commits to see version changes</p>
      </div>
      
      <div className="flex-1 p-0 overflow-hidden">
        {/* Commit Type Buttons */}
        <div className="grid grid-cols-2 gap-2 mb-4" suppressHydrationWarning={true}>
          {Object.entries(commitTypeConfig).map(([type, config]) => {
            const Icon = config.icon;
            return (
              <Tooltip key={type}>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    onClick={() => onAddCommit(type as CommitType)}
                    className="justify-start"
                  >
                    <div className={`p-1.5 rounded-md mr-2 ${config.color}`}>
                      <Icon className="w-3 h-3 text-white" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-sm">{type}</div>
                      <div className="text-xs text-muted-foreground">Press {config.shortcut}</div>
                    </div>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {config.impact ? `${config.impact} version bump` : 'No version change'}
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>

        {/* Statistics */}
        <Card className="mt-auto">
          <CardContent className="p-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold">{allCommits.length}</div>
                <div className="text-xs text-muted-foreground">Total</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{unreleasedCommits.length}</div>
                <div className="text-xs text-muted-foreground">Pending</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{releases.length}</div>
                <div className="text-xs text-muted-foreground">Releases</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};