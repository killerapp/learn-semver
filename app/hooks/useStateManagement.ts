import { useCallback } from 'react';
import { Version, Commit, Release, STORAGE_KEY } from '../types';

export const useStateManagement = () => {
  // Save state to localStorage
  const saveState = useCallback((
    currentVersion: Version,
    allCommits: Commit[],
    unreleasedCommits: Commit[],
    releases: Release[],
    darkMode: boolean,
    soundEnabled: boolean,
    animationSpeed: string,
    setIsSaving: (saving: boolean) => void
  ) => {
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
  }, []);

  // Load state from localStorage
  const loadState = useCallback((
    calculateNextVersion: (commits: Commit[], current: Version) => Version,
    currentVersion: Version,
    setCurrentVersion: (version: Version) => void,
    setAllCommits: (commits: Commit[]) => void,
    setUnreleasedCommits: (commits: Commit[]) => void,
    setNextVersion: (version: Version) => void,
    setPendingChanges: (changes: any) => void,
    setReleases: (releases: Release[]) => void,
    setDarkMode: (dark: boolean) => void,
    setSoundEnabled: (enabled: boolean) => void,
    setAnimationSpeed: (speed: any) => void,
    setDataLoaded: (loaded: boolean) => void
  ) => {
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
            commits: (r.commits as Record<string, unknown>[]).map((c: Record<string, unknown>) => ({
              ...c,
              timestamp: new Date(c.timestamp as string)
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
  }, []);

  // Clear all data
  const clearData = useCallback((
    setCurrentVersion: (version: Version) => void,
    setNextVersion: (version: Version) => void,
    setAllCommits: (commits: Commit[]) => void,
    setUnreleasedCommits: (commits: Commit[]) => void,
    setReleases: (releases: Release[]) => void,
    setPendingChanges: (changes: any) => void
  ) => {
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
  const exportData = useCallback((
    currentVersion: Version,
    allCommits: Commit[],
    releases: Release[]
  ) => {
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
  }, []);

  // Import data from JSON
  const importData = useCallback((
    setCurrentVersion: (version: Version) => void,
    setAllCommits: (commits: Commit[]) => void,
    setReleases: (releases: Release[]) => void,
    setUnreleasedCommits: (commits: Commit[]) => void,
    setPendingChanges: (changes: any) => void
  ) => {
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

  return {
    saveState,
    loadState,
    clearData,
    exportData,
    importData
  };
};