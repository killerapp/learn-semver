import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Commit, commitTypeConfig } from '../types';

interface CommitStreamProps {
  commits: Commit[];
}

export const CommitStream: React.FC<CommitStreamProps> = ({ commits }) => {
  return (
    <div className="relative h-full pt-32 sm:pt-40 p-2 sm:p-4 overflow-hidden">
      <AnimatePresence>
        {commits.slice(0, 8).map((commit, index) => (
          <motion.div
            key={commit.id}
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ 
              opacity: commit.released ? 0.2 : 0.95 - (index * 0.05), 
              y: index * (window.innerWidth < 640 ? 14 : 18),
              scale: 1 - (index * 0.008)
            }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", stiffness: 200, damping: 12 }}
          >
            <Card className={`p-2 ${commit.released ? 'opacity-50' : ''}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                  <div className={`p-1.5 sm:p-2 rounded-lg ${commitTypeConfig[commit.type].color} flex-shrink-0`}>
                    {React.createElement(commitTypeConfig[commit.type].icon, { 
                      className: "w-3 h-3 sm:w-4 sm:h-4 text-white" 
                    })}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs sm:text-sm font-semibold truncate">
                      {commit.message}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      <span className="font-medium">{commit.author}</span>
                      <span className="hidden sm:inline"> • {commit.timestamp.toLocaleTimeString()}</span>
                    </div>
                  </div>
                </div>
                {commit.versionAfter && commit.released && (
                  <Badge variant="secondary" className="text-xs flex-shrink-0 ml-2">
                    v{commit.versionAfter}
                  </Badge>
                )}
              </div>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};