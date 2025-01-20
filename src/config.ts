import { SystemConfig } from './types';
import { XPublisher } from './components/XPublisher';

export const defaultConfig: SystemConfig = {
  ai: {
    model: 'gpt-3.5-turbo',
    temperature: 0.7,
    maxTokens: 2048,
    topP: 0.9
  },
  memory: {
    maxConversationLength: 100,
    retentionPeriod: 24,
    contextWindow: 4096,
    persistMemory: true
  },
  apps: [
    {
      name: 'Vision Processing',
      status: 'active',
      priority: 1,
      memoryAllocation: 512,
      autoRestart: true
    },
    {
      name: 'Natural Language',
      status: 'active',
      priority: 2,
      memoryAllocation: 1024,
      autoRestart: true
    },
    {
      name: 'Motion Planning',
      status: 'active',
      priority: 3,
      memoryAllocation: 256,
      autoRestart: false
    }
  ],
  packages: [
    {
      id: 'lang-en',
      name: 'English Language Pack',
      description: 'Advanced English language processing and understanding',
      version: '2.1.0',
      category: 'language',
      status: 'installed',
      size: 250,
      dependencies: [],
      capabilities: ['translation', 'grammar', 'sentiment-analysis'],
      memoryRequirement: 512
    },
    {
      id: 'x-publisher',
      name: 'X Social Publisher',
      description: 'Automated social media management for X (Twitter)',
      version: '1.0.0',
      category: 'social',
      status: 'available',
      size: 150,
      dependencies: ['lang-en'],
      capabilities: ['post-scheduling', 'analytics', 'template-management'],
      memoryRequirement: 256,
      component: XPublisher
    },
    {
      id: 'story-creative',
      name: 'Creative Writing Engine',
      description: 'Generate creative stories and narratives',
      version: '1.5.0',
      category: 'story',
      status: 'available',
      size: 750,
      dependencies: ['lang-en'],
      capabilities: ['story-generation', 'character-development', 'plot-creation'],
      memoryRequirement: 1024
    },
    {
      id: 'voice-natural',
      name: 'Natural Speech Synthesis',
      description: 'Human-like voice generation and processing',
      version: '3.0.1',
      category: 'voice',
      status: 'installed',
      size: 1500,
      dependencies: ['lang-en'],
      capabilities: ['text-to-speech', 'voice-recognition', 'accent-adaptation'],
      memoryRequirement: 2048
    },
    {
      id: 'game-minecraft',
      name: 'Minecraft Assistant',
      description: 'Expert Minecraft gameplay and building assistance',
      version: '1.0.0',
      category: 'game',
      status: 'available',
      size: 500,
      dependencies: [],
      capabilities: ['building-tips', 'crafting-guide', 'strategy-advice'],
      memoryRequirement: 512
    },
    {
      id: 'expert-stem',
      name: 'STEM Knowledge Base',
      description: 'Comprehensive STEM education and problem-solving',
      version: '2.3.0',
      category: 'expert',
      status: 'installed',
      size: 2000,
      dependencies: [],
      capabilities: ['math-tutor', 'science-experiments', 'coding-assistance'],
      memoryRequirement: 2048
    }
  ]
};