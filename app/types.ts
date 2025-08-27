import { 
  GitCommit, 
  Zap, 
  Bug, 
  FileText, 
  Palette, 
  Wrench, 
  TestTube,
  Package,
  Sparkles
} from 'lucide-react';

// Types
export type CommitType = 'breaking' | 'feat' | 'fix' | 'docs' | 'style' | 'refactor' | 'test' | 'chore';

export interface Commit {
  id: string;
  type: CommitType;
  message: string;
  author: string;
  timestamp: Date;
  versionBefore?: string;
  versionAfter?: string;
  released: boolean;
}

export interface Version {
  major: number;
  minor: number;
  patch: number;
}

export interface Release {
  id: string;
  version: string;
  commits: Commit[];
  timestamp: Date;
}

export interface PendingChanges {
  breaking: number;
  feat: number;
  fix: number;
}

// Sample commit messages
export const commitMessages = {
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

export const authorNames = [
  'Alex Chen', 'Sarah Johnson', 'Mike Wilson', 'Emma Davis', 
  'Chris Martinez', 'Lisa Anderson', 'Tom Brown', 'Jessica Lee'
];

export const commitTypeConfig = {
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
} as const;

export const STORAGE_KEY = 'semver-visualizer-state';

export const getRandomElement = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];