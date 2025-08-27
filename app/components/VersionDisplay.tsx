import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShimmerButton } from '@/components/magicui/shimmer-button';
import { Version, Commit, PendingChanges } from '../types';

interface VersionDisplayProps {
  currentVersion: Version;
  nextVersion: Version;
  unreleasedCommits: Commit[];
  pendingChanges: PendingChanges;
  celebrateVersion: 'major' | 'minor' | 'patch' | null;
  animateNextVersion: 'major' | 'minor' | 'patch' | null;
  isReleasing: boolean;
  onRelease: () => void;
}

export const VersionDisplay: React.FC<VersionDisplayProps> = ({
  currentVersion,
  nextVersion,
  unreleasedCommits,
  pendingChanges,
  celebrateVersion,
  animateNextVersion,
  isReleasing,
  onRelease
}) => {
  return (
    <div className="absolute top-0 left-0 right-0 z-20 p-2 lg:p-4 bg-gradient-to-b from-[#16162a]/95 via-[#16162a]/80 to-transparent">
      <div className="flex justify-center">
        <div className="flex flex-row items-center gap-2 sm:gap-4">
          {/* Current Version */}
          <div className="p-2 sm:p-4 bg-[#0a0a0f] border border-emerald-500/30 rounded-lg">
            <div className="text-xs font-semibold mb-1 tracking-wider text-emerald-400 text-center">
              CURRENT VERSION
            </div>
            <motion.div 
              className="flex items-baseline justify-center"
            >
              <motion.span 
                className={`text-2xl sm:text-3xl font-bold ${celebrateVersion === 'major' ? 'text-red-500' : ''}`}
                animate={celebrateVersion === 'major' ? { scale: [1, 1.3, 1] } : {}}
                transition={{ duration: 0.5 }}
              >
                {currentVersion.major}
              </motion.span>
              <span className="text-xl sm:text-2xl mx-1 text-muted-foreground">.</span>
              <motion.span 
                className={`text-2xl sm:text-3xl font-bold ${celebrateVersion === 'minor' ? 'text-green-500' : ''}`}
                animate={celebrateVersion === 'minor' ? { scale: [1, 1.3, 1] } : {}}
                transition={{ duration: 0.5 }}
              >
                {currentVersion.minor}
              </motion.span>
              <span className="text-xl sm:text-2xl mx-1 text-muted-foreground">.</span>
              <motion.span 
                className={`text-2xl sm:text-3xl font-bold ${celebrateVersion === 'patch' ? 'text-blue-500' : ''}`}
                animate={celebrateVersion === 'patch' ? { scale: [1, 1.3, 1] } : {}}
                transition={{ duration: 0.5 }}
              >
                {currentVersion.patch}
              </motion.span>
            </motion.div>
          </div>

          {/* Animated Arrow and Next Version */}
          <AnimatePresence>
            {unreleasedCommits.length > 0 && (
              <>
                {/* Next Version that will transition */}
                <motion.div
                  initial={{ opacity: 0, x: 50, scale: 0.8 }}
                  animate={{ 
                    opacity: 1, 
                    x: 0, 
                    scale: 1,
                    transition: { duration: 0.3 }
                  }}
                  exit={{ 
                    opacity: 0,
                    x: -200,
                    scale: 1.2,
                    transition: { duration: 0.5 }
                  }}
                  className="relative"
                >
                  <Card className={`p-2 sm:p-4 border-2 ${isReleasing ? 'border-primary animate-pulse' : 'border-border'}`}>
                    <div className="text-xs font-semibold tracking-wider text-muted-foreground mb-1 text-center">
                      NEXT RELEASE
                    </div>
                    <div className="flex items-baseline justify-center">
                      <motion.span 
                        className={`text-2xl sm:text-3xl font-bold ${
                          pendingChanges.breaking > 0 ? 'text-red-500' :
                          animateNextVersion === 'major' ? 'text-red-500' : ''
                        }`}
                        animate={animateNextVersion === 'major' ? { 
                          scale: [1, 1.4, 1],
                          transition: { duration: 0.4 }
                        } : (isReleasing ? {
                          x: [-5, 5, -5, 5, 0],
                          transition: { duration: 0.3 }
                        } : {})}
                      >
                        {nextVersion.major}
                      </motion.span>
                      <span className="text-xl sm:text-2xl mx-1 text-muted-foreground">.</span>
                      <motion.span 
                        className={`text-2xl sm:text-3xl font-bold ${
                          pendingChanges.feat > 0 && pendingChanges.breaking === 0 ? 'text-green-500' :
                          animateNextVersion === 'minor' ? 'text-green-500' : ''
                        }`}
                        animate={animateNextVersion === 'minor' ? { 
                          scale: [1, 1.4, 1],
                          transition: { duration: 0.4 }
                        } : (isReleasing ? {
                          x: [-5, 5, -5, 5, 0],
                          transition: { duration: 0.3, delay: 0.1 }
                        } : {})}
                      >
                        {nextVersion.minor}
                      </motion.span>
                      <span className="text-xl sm:text-2xl mx-1 text-muted-foreground">.</span>
                      <motion.span 
                        className={`text-2xl sm:text-3xl font-bold ${
                          pendingChanges.fix > 0 && pendingChanges.breaking === 0 && pendingChanges.feat === 0 ? 'text-blue-500' :
                          animateNextVersion === 'patch' ? 'text-blue-500' : ''
                        }`}
                        animate={animateNextVersion === 'patch' ? { 
                          scale: [1, 1.4, 1],
                          transition: { duration: 0.4 }
                        } : (isReleasing ? {
                          x: [-5, 5, -5, 5, 0],
                          transition: { duration: 0.3, delay: 0.2 }
                        } : {})}
                      >
                        {nextVersion.patch}
                      </motion.span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2 justify-center">
                      {pendingChanges.breaking > 0 && (
                        <Badge className="bg-red-500/20 text-red-400 text-xs">{pendingChanges.breaking} breaking</Badge>
                      )}
                      {pendingChanges.feat > 0 && (
                        <Badge className="bg-green-500/20 text-green-400 text-xs">{pendingChanges.feat} feat</Badge>
                      )}
                      {pendingChanges.fix > 0 && (
                        <Badge className="bg-blue-500/20 text-blue-400 text-xs">{pendingChanges.fix} fix</Badge>
                      )}
                    </div>
                  </Card>
                  {isReleasing && (
                    <motion.div
                      className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/20 to-primary/10"
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                  )}
                </motion.div>

                {/* Release Button */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <ShimmerButton
                    onClick={onRelease}
                    disabled={isReleasing}
                    className="px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base"
                    shimmerColor="#ffffff"
                    background="linear-gradient(110deg,#8B5CF6 45%,#EC4899 55%)"
                  >
                    <Rocket className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                    {isReleasing ? 'Releasing...' : 'Release'}
                  </ShimmerButton>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};