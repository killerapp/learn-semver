'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';
import { 
  Download,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  GitBranch,
  History,
  Github,
  Map,
  Trash2,
  Upload,
  Database,
  Info,
  MoreHorizontal
} from 'lucide-react';

// UI Components
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Magic UI Components
import { BorderBeam } from '@/components/magicui/border-beam';
import { Particles } from '@/components/magicui/particles';

// Local Components
import { VersionDisplay } from './components/VersionDisplay';
import { CommitStream } from './components/CommitStream';
import { ControlPanel } from './components/ControlPanel';
import { EducationModal } from './components/EducationModal';
import { RoadmapModal } from './components/RoadmapModal';
import { HistoryModal } from './components/HistoryModal';

// Hooks
import { useAudio } from './hooks/useAudio';
import { useStateManagement } from './hooks/useStateManagement';

// Types and utilities
import { 
  CommitType, 
  Commit, 
  Version, 
  Release, 
  PendingChanges,
  commitMessages,
  authorNames,
  getRandomElement
} from './types';

const SemverVisualizerModern: React.FC = () => {
  const [currentVersion, setCurrentVersion] = useState<Version>({ major: 0, minor: 1, patch: 0 });
  const [nextVersion, setNextVersion] = useState<Version>({ major: 0, minor: 1, patch: 0 });
  const [allCommits, setAllCommits] = useState<Commit[]>([]);
  const [unreleasedCommits, setUnreleasedCommits] = useState<Commit[]>([]);
  const [releases, setReleases] = useState<Release[]>([]);
  const [animationSpeed, setAnimationSpeed] = useState<'paused' | 'slow' | 'normal' | 'fast'>('normal');
  const [showEducation, setShowEducation] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [isReleasing, setIsReleasing] = useState(false);
  const [pendingChanges, setPendingChanges] = useState<PendingChanges>({ breaking: 0, feat: 0, fix: 0 });
  const [celebrateVersion, setCelebrateVersion] = useState<'major' | 'minor' | 'patch' | null>(null);
  const [animateNextVersion, setAnimateNextVersion] = useState<'major' | 'minor' | 'patch' | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showRoadmap, setShowRoadmap] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Custom hooks
  const { playSound } = useAudio(soundEnabled);
  const { saveState, loadState, clearData, exportData, importData } = useStateManagement();

  const currentVersionString = `${currentVersion.major}.${currentVersion.minor}.${currentVersion.patch}`;
  const nextVersionString = `${nextVersion.major}.${nextVersion.minor}.${nextVersion.patch}`;

  const speedMultiplier = {
    paused: 0,
    slow: 0.5,
    normal: 1,
    fast: 2
  };

  const calculateNextVersion = useCallback((commits: Commit[], current: Version): Version => {
    let hasBreaking = false;
    let hasFeat = false;
    let hasFix = false;

    commits.forEach(commit => {
      if (commit.type === 'breaking') hasBreaking = true;
      else if (commit.type === 'feat') hasFeat = true;
      else if (commit.type === 'fix') hasFix = true;
    });

    if (hasBreaking) {
      return { major: current.major + 1, minor: 0, patch: 0 };
    } else if (hasFeat) {
      return { major: current.major, minor: current.minor + 1, patch: 0 };
    } else if (hasFix) {
      return { major: current.major, minor: current.minor, patch: current.patch + 1 };
    }
    return current;
  }, []);

  // Helper functions
  const handleSaveState = useCallback(() => {
    saveState(
      currentVersion,
      allCommits,
      unreleasedCommits,
      releases,
      darkMode,
      soundEnabled,
      animationSpeed,
      setIsSaving
    );
  }, [saveState, currentVersion, allCommits, unreleasedCommits, releases, darkMode, soundEnabled, animationSpeed]);

  const handleLoadState = useCallback(() => {
    loadState(
      calculateNextVersion,
      currentVersion,
      setCurrentVersion,
      setAllCommits,
      setUnreleasedCommits,
      setNextVersion,
      setPendingChanges,
      setReleases,
      setDarkMode,
      setSoundEnabled,
      setAnimationSpeed,
      setDataLoaded
    );
  }, [loadState, calculateNextVersion, currentVersion]);

  const handleClearData = useCallback(() => {
    clearData(
      setCurrentVersion,
      setNextVersion,
      setAllCommits,
      setUnreleasedCommits,
      setReleases,
      setPendingChanges
    );
  }, [clearData]);

  const handleExportData = useCallback(() => {
    exportData(currentVersion, allCommits, releases);
  }, [exportData, currentVersion, allCommits, releases]);

  const handleImportData = useCallback(() => {
    importData(
      setCurrentVersion,
      setAllCommits,
      setReleases,
      setUnreleasedCommits,
      setPendingChanges
    );
  }, [importData]);

  const addCommit = useCallback((type: CommitType) => {
    const versionBefore = currentVersionString;
    const newCommit: Commit = {
      id: Date.now().toString() + Math.random(),
      type,
      message: `${type}: ${getRandomElement(commitMessages[type])}`,
      author: getRandomElement(authorNames),
      timestamp: new Date(),
      versionBefore,
      released: false
    };

    setAllCommits(prev => [newCommit, ...prev].slice(0, 100));
    
    setUnreleasedCommits(prev => {
      const updated = [newCommit, ...prev];
      const newNext = calculateNextVersion(updated, currentVersion);
      setNextVersion(newNext);
      
      const changes = { breaking: 0, feat: 0, fix: 0 };
      updated.forEach(c => {
        if (c.type === 'breaking') changes.breaking++;
        else if (c.type === 'feat') changes.feat++;
        else if (c.type === 'fix') changes.fix++;
      });
      setPendingChanges(changes);
      
      return updated;
    });

    if (type === 'breaking') {
      setAnimateNextVersion('major');
      setTimeout(() => setAnimateNextVersion(null), 1000);
    } else if (type === 'feat') {
      setAnimateNextVersion('minor');
      setTimeout(() => setAnimateNextVersion(null), 800);
    } else if (type === 'fix') {
      setAnimateNextVersion('patch');
      setTimeout(() => setAnimateNextVersion(null), 600);
    }

    // Play sound based on commit type
    if (type === 'breaking') {
      playSound(200, 0.3);
    } else if (type === 'feat') {
      playSound(400, 0.2);
    } else if (type === 'fix') {
      playSound(600, 0.15);
    } else {
      playSound(800, 0.1);
    }
  }, [currentVersion, currentVersionString, calculateNextVersion, playSound]);

  const createRelease = useCallback(() => {
    if (unreleasedCommits.length === 0) return;

    setIsReleasing(true);
    
    setTimeout(() => {
      const newRelease: Release = {
        id: Date.now().toString(),
        version: nextVersionString,
        commits: unreleasedCommits,
        timestamp: new Date()
      };

      setAllCommits(prev => prev.map(commit => 
        unreleasedCommits.find(uc => uc.id === commit.id) 
          ? { ...commit, released: true, versionAfter: nextVersionString }
          : commit
      ));

      setReleases(prev => [newRelease, ...prev]);
      
      // Animate current version when it updates
      const versionType = pendingChanges.breaking > 0 ? 'major' : 
                          pendingChanges.feat > 0 ? 'minor' : 'patch';
      setCelebrateVersion(versionType);
      setTimeout(() => setCelebrateVersion(null), 2000);
      
      setCurrentVersion(nextVersion);
      setUnreleasedCommits([]);
      setPendingChanges({ breaking: 0, feat: 0, fix: 0 });
      setIsReleasing(false);
      
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);

      playSound(400, 0.15);
      setTimeout(() => playSound(500, 0.15), 150);
      setTimeout(() => playSound(600, 0.15), 300);
      setTimeout(() => playSound(800, 0.2), 450);
    }, 1000);
  }, [unreleasedCommits, nextVersion, nextVersionString, playSound]);

  // Load state on mount
  useEffect(() => {
    handleLoadState();
  }, []); // Only run once on mount

  // Save state whenever it changes (debounced)
  useEffect(() => {
    if (!dataLoaded) return;
    const timer = setTimeout(() => {
      handleSaveState();
    }, 1000);
    return () => clearTimeout(timer);
  }, [currentVersion, allCommits, unreleasedCommits, releases, darkMode, soundEnabled, animationSpeed, dataLoaded]); // Removed handleSaveState to prevent infinite loop

  // Auto-generate commits
  useEffect(() => {
    if (animationSpeed === 'paused') return;
    
    const types: CommitType[] = ['breaking', 'feat', 'fix', 'docs', 'style', 'refactor', 'test', 'chore'];
    const weights = [1, 3, 5, 2, 2, 2, 2, 2];
    const weightedTypes = types.flatMap((type, i) => Array(weights[i]).fill(type));
    
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        addCommit(getRandomElement(weightedTypes));
      }
    }, 3000 / speedMultiplier[animationSpeed]);

    return () => clearInterval(interval);
  }, [animationSpeed]); // Removed addCommit to prevent infinite loop

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <TooltipProvider>
      <div className="min-h-screen transition-colors duration-300 bg-[#0a0a0f] relative" suppressHydrationWarning={true}>
        {/* Background Particles */}
        <Particles
          className="absolute inset-0"
          quantity={50}
          ease={80}
          color={darkMode ? "#ffffff" : "#000000"}
          refresh
        />
        
        {/* Confetti Effect */}
        {showConfetti && (
          <Confetti
            width={window.innerWidth}
            height={window.innerHeight}
            numberOfPieces={200}
            recycle={false}
            colors={['#8B5CF6', '#EC4899', '#10B981', '#3B82F6', '#F59E0B']}
          />
        )}
        
        <div className="w-full min-h-screen px-4 sm:px-6 py-4 relative z-10 overflow-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-3 sm:mb-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <GitBranch className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              <div>
                <h1 className="text-lg sm:text-2xl font-bold">
                  <span className="hidden sm:inline">Semantic Version Visualizer</span>
                  <span className="sm:hidden">SemVer Visualizer</span>
                </h1>
                <p className="text-xs text-muted-foreground">
                  by <a href="https://agenticinsights.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Agentic Insights</a>
                </p>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" asChild>
                    <a
                      href="https://github.com/killerapp/learn-semver"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Github className="w-5 h-5" />
                    </a>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>View source on GitHub</TooltipContent>
              </Tooltip>
              {dataLoaded && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-1 text-xs text-muted-foreground"
                >
                  <Database className={`w-3 h-3 ${isSaving ? 'animate-pulse text-primary' : ''}`} />
                  <span>{isSaving ? 'Saving...' : 'Saved'}</span>
                </motion.div>
              )}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => setShowEducation(true)}>
                  <Info className="w-4 h-4 mr-2" />
                  Learn Semantic Versioning
                </DropdownMenuItem>
                
                <DropdownMenuItem onClick={() => setShowHistory(true)}>
                  <History className="w-4 h-4 mr-2" />
                  Release History {releases.length > 0 && `(${releases.length})`}
                </DropdownMenuItem>
                
                <DropdownMenuItem onClick={() => setShowRoadmap(true)}>
                  <Map className="w-4 h-4 mr-2" />
                  View Roadmap
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem onClick={() => setDarkMode(!darkMode)}>
                  {darkMode ? <Sun className="w-4 h-4 mr-2" /> : <Moon className="w-4 h-4 mr-2" />}
                  {darkMode ? 'Light' : 'Dark'} Mode
                </DropdownMenuItem>
                
                <DropdownMenuItem onClick={() => setSoundEnabled(!soundEnabled)}>
                  {soundEnabled ? <VolumeX className="w-4 h-4 mr-2" /> : <Volume2 className="w-4 h-4 mr-2" />}
                  {soundEnabled ? 'Disable' : 'Enable'} Sound
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem onClick={handleExportData}>
                  <Download className="w-4 h-4 mr-2" />
                  Export Data
                </DropdownMenuItem>
                
                <DropdownMenuItem onClick={handleImportData}>
                  <Upload className="w-4 h-4 mr-2" />
                  Import Data
                </DropdownMenuItem>
                
                <DropdownMenuItem 
                  onClick={handleClearData}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear All Data
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex flex-col lg:grid lg:grid-cols-12 gap-4">
            {/* Main Commit Stream */}
            <div className="order-2 lg:order-1 lg:col-span-7">
              <div className="relative h-[50vh] lg:h-[calc(100vh-240px)] bg-[#16162a] border border-gray-800 rounded-lg overflow-hidden">
                <BorderBeam size={250} duration={12} delay={9} colorFrom="#10b981" colorTo="#8b5cf6" />
                
                <VersionDisplay
                  currentVersion={currentVersion}
                  nextVersion={nextVersion}
                  unreleasedCommits={unreleasedCommits}
                  pendingChanges={pendingChanges}
                  celebrateVersion={celebrateVersion}
                  animateNextVersion={animateNextVersion}
                  isReleasing={isReleasing}
                  onRelease={createRelease}
                />

                <CommitStream commits={allCommits} />
              </div>
            </div>

            {/* Control Panel */}
            <div className="order-1 lg:order-2 lg:col-span-5">
              <ControlPanel
                allCommits={allCommits}
                unreleasedCommits={unreleasedCommits}
                releases={releases}
                onAddCommit={addCommit}
              />
            </div>
          </div>
        </div>

        {/* Modals */}
        <EducationModal isOpen={showEducation} onClose={setShowEducation} />
        <RoadmapModal isOpen={showRoadmap} onClose={setShowRoadmap} />
        <HistoryModal 
          isOpen={showHistory} 
          onClose={setShowHistory} 
          releases={releases}
        />
      </div>
    </TooltipProvider>
  );
};

export default SemverVisualizerModern;