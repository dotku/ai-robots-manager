export interface AIConfig {
  model: string;
  temperature: number;
  maxTokens: number;
  topP: number;
}

export interface MemoryConfig {
  maxConversationLength: number;
  retentionPeriod: number; // in hours
  contextWindow: number;
  persistMemory: boolean;
}

export interface AppConfig {
  name: string;
  status: 'active' | 'inactive';
  priority: number;
  memoryAllocation: number; // in MB
  autoRestart: boolean;
}

export interface Package {
  id: string;
  name: string;
  description: string;
  version: string;
  category: 'language' | 'story' | 'voice' | 'game' | 'expert' | 'social';
  status: 'installed' | 'available' | 'updating';
  size: number; // in MB
  dependencies: string[];
  capabilities: string[];
  memoryRequirement: number; // in MB
  component?: React.ComponentType; // Optional component to render when package is installed
}

export interface StorageFile {
  name: string;
  size: number; // in GB
  type: 'archive' | 'config' | 'model' | 'data';
  lastModified: Date;
}

export interface StorageProvider {
  id: string;
  name: string;
  icon: any;
  connected: boolean;
  usedSpace: number; // in GB
  totalSpace: number; // in GB
  files: StorageFile[];
}

export interface RobotDevice {
  id: string;
  name: string;
  type: 'humanoid' | 'industrial' | 'mobile' | 'drone';
  status: 'online' | 'offline' | 'maintenance';
  lastSeen: Date;
  batteryLevel: number;
  location: string;
  ipAddress: string;
}

export interface SystemConfig {
  ai: AIConfig;
  memory: MemoryConfig;
  apps: AppConfig[];
  packages: Package[];
}