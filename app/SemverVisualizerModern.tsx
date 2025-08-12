'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import { 
  GitCommit, 
  Zap, 
  Bug, 
  FileText, 
  Palette, 
  Wrench, 
  TestTube,
  Package,
  Info,
  X,
  ChevronRight,
  ChevronDown,
  Pause,
  Play,
  FastForward,
  Download,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Sparkles,
  GitBranch,
  History,
  HelpCircle,
  Rocket,
  Tag,
  ArrowDown,
  Github,
  Map,
  BookOpen,
  ExternalLink,
  Trash2,
  Upload,
  Save,
  Database,
} from 'lucide-react';

// UI Components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Magic UI Components
import { ShimmerButton } from '@/components/magicui/shimmer-button';
import { BorderBeam } from '@/components/magicui/border-beam';
import { Particles } from '@/components/magicui/particles';
import { MagicCard } from '@/components/magicui/magic-card';

// Types
type CommitType = 'breaking' | 'feat' | 'fix' | 'docs' | 'style' | 'refactor' | 'test' | 'chore';

interface Commit {
  id: string;
  type: CommitType;
  message: string;
  author: string;
  timestamp: Date;
  versionBefore?: string;
  versionAfter?: string;
  released: boolean;
}

interface Version {
  major: number;
  minor: number;
  patch: number;
}

interface Release {
  id: string;
  version: string;
  commits: Commit[];
  timestamp: Date;
}

// Sample commit messages
const commitMessages = {
  breaking: [
    'remove deprecated API endpoints',
    'change authentication method to OAuth 2.0',
    'update minimum Node.js version to 18',
    'restructure database schema',
    'replace REST API with GraphQL'
  ],
  feat: [
    'add user dashboard',
    'implement dark mode toggle',
    'add export to PDF functionality',
    'introduce real-time notifications',
    'add multi-language support'
  ],
  fix: [
    'resolve memory leak in data processor',
    'fix login redirect loop',
    'correct calculation in billing module',
    'fix responsive layout on mobile',
    'resolve timezone conversion bug'
  ],
  docs: [
    'update API documentation',
    'add contributing guidelines',
    'improve README with examples',
    'document deployment process',
    'add JSDoc comments'
  ],
  style: [
    'format code with prettier',
    'update indentation to 2 spaces',
    'reorganize import statements',
    'fix linting warnings',
    'standardize naming conventions'
  ],
  refactor: [
    'extract reusable components',
    'optimize database queries',
    'simplify authentication flow',
    'restructure folder organization',
    'improve error handling'
  ],
  test: [
    'add unit tests for auth module',
    'increase test coverage to 90%',
    'add E2E tests for checkout flow',
    'update test fixtures',
    'add performance benchmarks'
  ],
  chore: [
    'update dependencies',
    'configure CI/CD pipeline',
    'add pre-commit hooks',
    'update build scripts',
    'optimize bundle size'
  ]
};

const authorNames = [
  'Alex Chen', 'Sarah Johnson', 'Mike Wilson', 'Emma Davis', 
  'Chris Martinez', 'Lisa Anderson', 'Tom Brown', 'Jessica Lee'
];

const getRandomElement = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const STORAGE_KEY = 'semver-visualizer-state';

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
  const [hoveredButton, setHoveredButton] = useState<CommitType | null>(null);
  const [isReleasing, setIsReleasing] = useState(false);
  const [pendingChanges, setPendingChanges] = useState({ breaking: 0, feat: 0, fix: 0 });
  const [celebrateVersion, setCelebrateVersion] = useState<'major' | 'minor' | 'patch' | null>(null);
  const [animateNextVersion, setAnimateNextVersion] = useState<'major' | 'minor' | 'patch' | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showRoadmap, setShowRoadmap] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Audio refs
  const audioContext = useRef<AudioContext | null>(null);
  const playSound = useCallback((frequency: number, duration: number) => {
    if (!soundEnabled) return;
    
    if (!audioContext.current) {
      audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    const oscillator = audioContext.current.createOscillator();
    const gainNode = audioContext.current.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.current.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.current.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.current.currentTime + duration);
    
    oscillator.start(audioContext.current.currentTime);
    oscillator.stop(audioContext.current.currentTime + duration);
  }, [soundEnabled]);

  const currentVersionString = `${currentVersion.major}.${currentVersion.minor}.${currentVersion.patch}`;
  const nextVersionString = `${nextVersion.major}.${nextVersion.minor}.${nextVersion.patch}`;

  const speedMultiplier = {
    paused: 0,
    slow: 0.5,
    normal: 1,
    fast: 2
  };

  const commitTypeConfig = {
    breaking: { 
      color: 'bg-red-500', 
      borderColor: 'border-red-500',
      lightColor: 'bg-red-100 text-red-700',
      icon: Zap, 
      description: 'Breaking change',
      shortcut: 'B',
      impact: 'MAJOR'
    },
    feat: { 
      color: 'bg-green-500',
      borderColor: 'border-green-500',
      lightColor: 'bg-green-100 text-green-700',
      icon: Sparkles, 
      description: 'New feature',
      shortcut: 'F',
      impact: 'MINOR'
    },
    fix: { 
      color: 'bg-blue-500',
      borderColor: 'border-blue-500',
      lightColor: 'bg-blue-100 text-blue-700',
      icon: Bug, 
      description: 'Bug fix',
      shortcut: 'X',
      impact: 'PATCH'
    },
    docs: { 
      color: 'bg-gray-500',
      borderColor: 'border-gray-500',
      lightColor: 'bg-gray-100 text-gray-700',
      icon: FileText, 
      description: 'Docs',
      shortcut: 'D',
      impact: null
    },
    style: { 
      color: 'bg-purple-500',
      borderColor: 'border-purple-500',
      lightColor: 'bg-purple-100 text-purple-700',
      icon: Palette, 
      description: 'Style',
      shortcut: 'S',
      impact: null
    },
    refactor: { 
      color: 'bg-yellow-500',
      borderColor: 'border-yellow-500',
      lightColor: 'bg-yellow-100 text-yellow-700',
      icon: Wrench, 
      description: 'Refactor',
      shortcut: 'R',
      impact: null
    },
    test: { 
      color: 'bg-indigo-500',
      borderColor: 'border-indigo-500',
      lightColor: 'bg-indigo-100 text-indigo-700',
      icon: TestTube, 
      description: 'Tests',
      shortcut: 'T',
      impact: null
    },
    chore: { 
      color: 'bg-gray-400',
      borderColor: 'border-gray-400',
      lightColor: 'bg-gray-100 text-gray-600',
      icon: Package, 
      description: 'Chore',
      shortcut: 'C',
      impact: null
    }
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

  // Save state to localStorage
  const saveState = useCallback(() => {
    try {
      setIsSaving(true);
      const state = {
        currentVersion,
        allCommits: allCommits.map(c => ({
          ...c,
          timestamp: c.timestamp.toISOString()
        })),
        unreleasedCommits: unreleasedCommits.map(c => ({
          ...c,
          timestamp: c.timestamp.toISOString()
        })),
        releases: releases.map(r => ({
          ...r,
          timestamp: r.timestamp.toISOString(),
          commits: r.commits.map(c => ({
            ...c,
            timestamp: c.timestamp.toISOString()
          }))
        })),
        darkMode,
        soundEnabled,
        animationSpeed
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      setTimeout(() => setIsSaving(false), 500);
    } catch (error) {
      console.error('Failed to save state:', error);
      setIsSaving(false);
    }
  }, [currentVersion, allCommits, unreleasedCommits, releases, darkMode, soundEnabled, animationSpeed]);

  // Load state from localStorage
  const loadState = useCallback(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const state = JSON.parse(saved);
        
        // Restore version
        if (state.currentVersion) {
          setCurrentVersion(state.currentVersion);
        }
        
        // Restore commits with dates
        if (state.allCommits) {
          setAllCommits(state.allCommits.map((c: any) => ({
            ...c,
            timestamp: new Date(c.timestamp)
          })));
        }
        
        if (state.unreleasedCommits) {
          const commits = state.unreleasedCommits.map((c: any) => ({
            ...c,
            timestamp: new Date(c.timestamp)
          }));
          setUnreleasedCommits(commits);
          
          // Recalculate next version and pending changes
          const newNext = calculateNextVersion(commits, state.currentVersion || currentVersion);
          setNextVersion(newNext);
          
          const changes = { breaking: 0, feat: 0, fix: 0 };
          commits.forEach((c: Commit) => {
            if (c.type === 'breaking') changes.breaking++;
            else if (c.type === 'feat') changes.feat++;
            else if (c.type === 'fix') changes.fix++;
          });
          setPendingChanges(changes);
        }
        
        // Restore releases
        if (state.releases) {
          setReleases(state.releases.map((r: any) => ({
            ...r,
            timestamp: new Date(r.timestamp),
            commits: r.commits.map((c: any) => ({
              ...c,
              timestamp: new Date(c.timestamp)
            }))
          })));
        }
        
        // Restore settings
        if (state.darkMode !== undefined) setDarkMode(state.darkMode);
        if (state.soundEnabled !== undefined) setSoundEnabled(state.soundEnabled);
        if (state.animationSpeed) setAnimationSpeed(state.animationSpeed);
        
        setDataLoaded(true);
        return true;
      }
    } catch (error) {
      console.error('Failed to load state:', error);
    }
    setDataLoaded(true);
    return false;
  }, [calculateNextVersion, currentVersion]);

  // Clear all data
  const clearData = useCallback(() => {
    if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
      localStorage.removeItem(STORAGE_KEY);
      setCurrentVersion({ major: 0, minor: 1, patch: 0 });
      setNextVersion({ major: 0, minor: 1, patch: 0 });
      setAllCommits([]);
      setUnreleasedCommits([]);
      setReleases([]);
      setPendingChanges({ breaking: 0, feat: 0, fix: 0 });
    }
  }, []);

  // Export data as JSON
  const exportData = useCallback(() => {
    const state = {
      currentVersion,
      allCommits: allCommits.map(c => ({
        ...c,
        timestamp: c.timestamp.toISOString()
      })),
      releases: releases.map(r => ({
        ...r,
        timestamp: r.timestamp.toISOString(),
        commits: r.commits.map(c => ({
          ...c,
          timestamp: c.timestamp.toISOString()
        }))
      })),
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `semver-history-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [currentVersion, allCommits, releases]);

  // Import data from JSON
  const importData = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        try {
          const text = await file.text();
          const data = JSON.parse(text);
          
          // Clear existing and load imported data
          if (data.currentVersion) setCurrentVersion(data.currentVersion);
          if (data.allCommits) {
            setAllCommits(data.allCommits.map((c: any) => ({
              ...c,
              timestamp: new Date(c.timestamp)
            })));
          }
          if (data.releases) {
            setReleases(data.releases.map((r: any) => ({
              ...r,
              timestamp: new Date(r.timestamp),
              commits: r.commits.map((c: any) => ({
                ...c,
                timestamp: new Date(c.timestamp)
              }))
            })));
          }
          
          // Reset unreleased commits when importing
          setUnreleasedCommits([]);
          setPendingChanges({ breaking: 0, feat: 0, fix: 0 });
          
          alert('Data imported successfully!');
        } catch (error) {
          alert('Failed to import data. Please check the file format.');
          console.error('Import error:', error);
        }
      }
    };
    input.click();
  }, []);

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
    loadState();
  }, []);

  // Save state whenever it changes (debounced)
  useEffect(() => {
    if (!dataLoaded) return;
    const timer = setTimeout(() => {
      saveState();
    }, 1000);
    return () => clearTimeout(timer);
  }, [currentVersion, allCommits, unreleasedCommits, releases, darkMode, soundEnabled, animationSpeed, saveState, dataLoaded]);

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
  }, [animationSpeed, addCommit]);

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
      <div className={`min-h-screen transition-colors duration-300 bg-gradient-to-br from-background via-purple-900/20 to-background relative overflow-hidden`}>
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
        
        <div className="container mx-auto px-4 py-4 max-w-7xl relative z-10">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <GitBranch className="w-6 h-6 text-primary" />
              <div>
                <h1 className="text-2xl font-bold">
                  Semantic Version Visualizer
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
            <div className="flex gap-2">
              {/* Data Management */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={exportData}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Export data</TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={importData}
                  >
                    <Upload className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Import data</TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={clearData}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Clear all data</TooltipContent>
              </Tooltip>
              
              <div className="w-px h-8 bg-border mx-1" />
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => setShowRoadmap(true)}
                  >
                    <Map className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>View roadmap</TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => setShowHistory(true)}
                  >
                    <History className="w-4 h-4" />
                    {releases.length > 0 && (
                      <span className="absolute -top-1 -right-1 px-1.5 py-0.5 bg-primary text-primary-foreground text-xs rounded-full font-bold">
                        {releases.length}
                      </span>
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>View release history</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => setSoundEnabled(!soundEnabled)}
                  >
                    {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{soundEnabled ? "Disable" : "Enable"} sound</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => setDarkMode(!darkMode)}
                  >
                    {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Toggle theme</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => setShowEducation(true)}
                  >
                    <Info className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Learn about semantic versioning</TooltipContent>
              </Tooltip>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-4">
            {/* Main Commit Stream */}
            <div className="col-span-12 lg:col-span-8">
              <MagicCard 
                className="relative h-[70vh] overflow-hidden"
                gradientColor={darkMode ? "#262626" : "#D9D9D955"}
              >
                <BorderBeam size={250} duration={12} delay={9} />
                
                {/* Version Display */}
                <div className="absolute top-0 left-0 right-0 z-20 p-4 bg-gradient-to-b from-background/95 via-background/80 to-transparent">
                  <div className="flex justify-center">
                    <div className="flex items-center gap-4">
                      {/* Current Version */}
                      <Card className="p-4 border-2">
                        <div className="text-xs font-semibold mb-1 tracking-wider text-muted-foreground text-center">
                          CURRENT VERSION
                        </div>
                        <motion.div 
                          className="flex items-baseline justify-center"
                        >
                          <motion.span 
                            className={`text-3xl font-bold ${celebrateVersion === 'major' ? 'text-red-500' : ''}`}
                            animate={celebrateVersion === 'major' ? { scale: [1, 1.3, 1] } : {}}
                            transition={{ duration: 0.5 }}
                          >
                            {currentVersion.major}
                          </motion.span>
                          <span className="text-2xl mx-1 text-muted-foreground">.</span>
                          <motion.span 
                            className={`text-3xl font-bold ${celebrateVersion === 'minor' ? 'text-green-500' : ''}`}
                            animate={celebrateVersion === 'minor' ? { scale: [1, 1.3, 1] } : {}}
                            transition={{ duration: 0.5 }}
                          >
                            {currentVersion.minor}
                          </motion.span>
                          <span className="text-2xl mx-1 text-muted-foreground">.</span>
                          <motion.span 
                            className={`text-3xl font-bold ${celebrateVersion === 'patch' ? 'text-blue-500' : ''}`}
                            animate={celebrateVersion === 'patch' ? { scale: [1, 1.3, 1] } : {}}
                            transition={{ duration: 0.5 }}
                          >
                            {currentVersion.patch}
                          </motion.span>
                        </motion.div>
                      </Card>

                      {/* Animated Arrow and Next Version */}
                      <AnimatePresence>
                        {unreleasedCommits.length > 0 && (
                          <>
                            <motion.div
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -20 }}
                              className="flex items-center"
                            >
                              <motion.div
                                animate={{ x: [0, 10, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                                className="text-primary"
                              >
                                <ChevronRight className="w-8 h-8" />
                              </motion.div>
                            </motion.div>

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
                              <Card className={`p-4 border-2 ${isReleasing ? 'border-primary animate-pulse' : 'border-border'}`}>
                                <div className="text-xs font-semibold tracking-wider text-muted-foreground mb-1 text-center">
                                  NEXT RELEASE
                                </div>
                                <div className="flex items-baseline justify-center">
                                  <motion.span 
                                    className={`text-3xl font-bold ${
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
                                  <span className="text-2xl mx-1 text-muted-foreground">.</span>
                                  <motion.span 
                                    className={`text-3xl font-bold ${
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
                                  <span className="text-2xl mx-1 text-muted-foreground">.</span>
                                  <motion.span 
                                    className={`text-3xl font-bold ${
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
                                <div className="flex gap-1 mt-2 justify-center">
                                  {pendingChanges.breaking > 0 && (
                                    <Badge className="bg-red-500/20 text-red-400">{pendingChanges.breaking} breaking</Badge>
                                  )}
                                  {pendingChanges.feat > 0 && (
                                    <Badge className="bg-green-500/20 text-green-400">{pendingChanges.feat} feat</Badge>
                                  )}
                                  {pendingChanges.fix > 0 && (
                                    <Badge className="bg-blue-500/20 text-blue-400">{pendingChanges.fix} fix</Badge>
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
                                onClick={createRelease}
                                disabled={isReleasing}
                                className="px-6 py-3"
                                shimmerColor="#ffffff"
                                background="linear-gradient(110deg,#8B5CF6 45%,#EC4899 55%)"
                              >
                                <Rocket className="w-5 h-5 mr-2" />
                                {isReleasing ? 'Releasing...' : 'Release'}
                              </ShimmerButton>
                            </motion.div>
                          </>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>

                {/* Animated Commit Stream */}
                <div className="relative h-full pt-40 p-4 overflow-hidden">
                  <AnimatePresence>
                    {allCommits.slice(0, 8).map((commit, index) => (
                      <motion.div
                        key={commit.id}
                        initial={{ opacity: 0, y: 20, scale: 0.98 }}
                        animate={{ 
                          opacity: commit.released ? 0.2 : 0.95 - (index * 0.05), 
                          y: index * 18,
                          scale: 1 - (index * 0.008)
                        }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ type: "spring", stiffness: 200, damping: 12 }}
                      >
                        <Card className={`p-2 ${commit.released ? 'opacity-50' : ''}`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg ${commitTypeConfig[commit.type].color}`}>
                                {React.createElement(commitTypeConfig[commit.type].icon, { 
                                  className: "w-4 h-4 text-white" 
                                })}
                              </div>
                              <div className="flex-1">
                                <div className="text-sm font-semibold">
                                  {commit.message}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  <span className="font-medium">{commit.author}</span> • {commit.timestamp.toLocaleTimeString()}
                                </div>
                              </div>
                            </div>
                            {commit.versionAfter && commit.released && (
                              <Badge variant="secondary" className="text-xs">
                                v{commit.versionAfter}
                              </Badge>
                            )}
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </MagicCard>
            </div>

            {/* Control Panel */}
            <div className="col-span-12 lg:col-span-4">
              <Card className="h-[70vh] flex flex-col p-6">
                <CardHeader className="p-0 pb-4">
                  <CardTitle>Commit Controls</CardTitle>
                  <CardDescription>Add commits to see version changes</CardDescription>
                </CardHeader>
                
                <CardContent className="flex-1 p-0">
                  {/* Speed Controls */}
                  <div className="flex gap-1 mb-4">
                    {['paused', 'slow', 'normal', 'fast'].map((speed) => (
                      <Button
                        key={speed}
                        variant={animationSpeed === speed ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setAnimationSpeed(speed as any)}
                      >
                        {speed === 'paused' && <Pause className="w-3 h-3" />}
                        {speed === 'slow' && <ChevronRight className="w-3 h-3" />}
                        {speed === 'normal' && <Play className="w-3 h-3" />}
                        {speed === 'fast' && <FastForward className="w-3 h-3" />}
                      </Button>
                    ))}
                  </div>
                  
                  {/* Commit Type Buttons */}
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {Object.entries(commitTypeConfig).map(([type, config]) => {
                      const Icon = config.icon;
                      return (
                        <Tooltip key={type}>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              onClick={() => addCommit(type as CommitType)}
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
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Modals */}
        <Dialog open={showEducation} onOpenChange={setShowEducation}>
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

        <Dialog open={showRoadmap} onOpenChange={setShowRoadmap}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Feature Roadmap</DialogTitle>
              <DialogDescription>
                Track our progress and see what's coming next
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6 mt-4">
              {/* Completed Features */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-green-500">✅ Completed</h3>
                <div className="space-y-2">
                  {[
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
                  ].map((feature, idx) => (
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
                  {[
                    'Cloudflare Pages deployment',
                    'Blog article about visual prototyping'
                  ].map((feature, idx) => (
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
                  {[
                    'Export release notes to markdown',
                    'Import commit history from Git',
                    'Customizable commit types',
                    'Tag management interface',
                    'Pre-release version support (alpha/beta)',
                    'Monorepo versioning mode',
                    'CI/CD integration guides',
                    'Collaborative mode for teams'
                  ].map((feature, idx) => (
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

        <Dialog open={showHistory} onOpenChange={setShowHistory}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Release History</DialogTitle>
              <DialogDescription>
                View all releases and their commits
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 mt-4">
              {releases.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Tag className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>No releases yet</p>
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
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
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
      </div>
    </TooltipProvider>
  );
};

export default SemverVisualizerModern;