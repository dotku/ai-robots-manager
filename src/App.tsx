import React, { useState, useRef, useEffect } from 'react';
import { Brain, Cpu, Battery, Activity, Settings, Power, MessageSquare, Eye, Gauge, Send, X, Package, HardDrive, Cloud } from 'lucide-react';
import { getChatResponse } from './lib/openai';
import { ConfigPanel } from './components/ConfigPanel';
import { PackageManager } from './components/PackageManager';
import { StorageManager } from './components/StorageManager';
import { DeviceSwitcher } from './components/DeviceSwitcher';
import { SystemConfig, RobotDevice, Package as PackageType } from './types';
import { defaultConfig } from './config';

interface AIMetrics {
  cpuUsage: number;
  memoryUsage: number;
  batteryLevel: number;
  activeModules: string[];
  status: 'active' | 'standby' | 'learning';
}

interface ChatMessage {
  id: string;
  text: string;
  sender: 'human' | 'robot';
  timestamp: Date;
}

const defaultDevices: RobotDevice[] = [
  {
    id: '1',
    name: 'Home Assistant Bot',
    type: 'humanoid',
    status: 'online',
    lastSeen: new Date(),
    batteryLevel: 85,
    location: 'Living Room',
    ipAddress: '192.168.1.100'
  },
  {
    id: '2',
    name: 'Factory Robot Arm',
    type: 'industrial',
    status: 'maintenance',
    lastSeen: new Date(),
    batteryLevel: 45,
    location: 'Factory Floor',
    ipAddress: '192.168.1.101'
  },
  {
    id: '3',
    name: 'Security Patrol Bot',
    type: 'mobile',
    status: 'online',
    lastSeen: new Date(),
    batteryLevel: 92,
    location: 'Perimeter',
    ipAddress: '192.168.1.102'
  },
  {
    id: '4',
    name: 'Inspection Drone',
    type: 'drone',
    status: 'offline',
    lastSeen: new Date(),
    batteryLevel: 0,
    location: 'Charging Station',
    ipAddress: '192.168.1.103'
  }
];

function App() {
  const [metrics, setMetrics] = useState<AIMetrics>({
    cpuUsage: 45,
    memoryUsage: 62,
    batteryLevel: 85,
    activeModules: ['Vision Processing', 'Natural Language', 'Motion Planning'],
    status: 'active'
  });

  const [selectedTab, setSelectedTab] = useState('dashboard');
  const [showChatTest, setShowChatTest] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [showStorage, setShowStorage] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [config, setConfig] = useState<SystemConfig>(defaultConfig);
  const [devices] = useState<RobotDevice[]>(defaultDevices);
  const [selectedDevice, setSelectedDevice] = useState<RobotDevice>(devices[0]);
  const [showAddDevice, setShowAddDevice] = useState(false);

  const handlePackageClick = (pkgId: string) => {
    const pkg = config.packages.find(p => p.id === pkgId);
    if (pkg && pkg.status === 'installed' && pkg.component) {
      // Scroll to the package component
      const packageElement = document.getElementById(`package-${pkgId}`);
      if (packageElement) {
        packageElement.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (pkg && pkg.status === 'available') {
      // Install the package
      const newPackages = config.packages.map(p =>
        p.id === pkgId ? { ...p, status: 'installed' } : p
      );
      setConfig({ ...config, packages: newPackages });
    }
  };

  const getInstalledPackagesWithComponents = () => {
    return config.packages.filter(pkg => pkg.status === 'installed' && pkg.component);
  };

  const toggleAIStatus = () => {
    setMetrics(prev => ({
      ...prev,
      status: prev.status === 'active' ? 'standby' : 'active'
    }));
  };

  const handleDeviceChange = (device: RobotDevice) => {
    setSelectedDevice(device);
    setMetrics({
      cpuUsage: Math.random() * 100,
      memoryUsage: Math.random() * 100,
      batteryLevel: device.batteryLevel,
      activeModules: ['Vision Processing', 'Natural Language', 'Motion Planning'],
      status: device.status === 'online' ? 'active' : device.status === 'maintenance' ? 'learning' : 'standby'
    });
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      text: chatInput,
      sender: 'human',
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, newMessage]);
    setChatInput('');

    try {
      const robotResponse = await getChatResponse(chatInput);
      const robotMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: robotResponse,
        sender: 'robot',
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, robotMessage]);
    } catch (error) {
      console.error('Error getting chat response:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="w-8 h-8 text-blue-400" />
            <h1 className="text-xl font-bold">RobotAI Manager</h1>
          </div>
          <div className="flex items-center space-x-4">
            <DeviceSwitcher
              devices={devices}
              selectedDevice={selectedDevice}
              onDeviceChange={handleDeviceChange}
              onAddDevice={() => setShowAddDevice(true)}
            />
            <button
              onClick={() => setShowConfig(true)}
              className="p-2 rounded-full hover:bg-gray-700 transition-colors"
              title="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
            <div className={`px-3 py-1 rounded-full ${
              metrics.status === 'active' ? 'bg-green-500' : 
              metrics.status === 'standby' ? 'bg-yellow-500' : 'bg-red-500'
            }`}>
              {metrics.status.charAt(0).toUpperCase() + metrics.status.slice(1)}
            </div>
            <button
              onClick={toggleAIStatus}
              className="p-2 rounded-full hover:bg-gray-700 transition-colors"
            >
              <Power className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Upper Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* System Metrics */}
          <div className="glass-panel rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">System Metrics</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">CPU Usage</span>
                  <span className="text-sm">{metrics.cpuUsage}%</span>
                </div>
                <div className="metric-bar">
                  <div
                    className="metric-bar-fill bg-blue-500"
                    style={{ width: `${metrics.cpuUsage}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Memory Usage</span>
                  <span className="text-sm">{metrics.memoryUsage}%</span>
                </div>
                <div className="metric-bar">
                  <div
                    className="metric-bar-fill bg-purple-500"
                    style={{ width: `${metrics.memoryUsage}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Battery Level</span>
                  <span className="text-sm">{metrics.batteryLevel}%</span>
                </div>
                <div className="metric-bar">
                  <div
                    className="metric-bar-fill bg-green-500"
                    style={{ width: `${metrics.batteryLevel}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Active Modules */}
          <div className="glass-panel rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Active Modules</h2>
            <div className="space-y-2">
              {metrics.activeModules.map((module, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-gray-700/50 p-3 rounded-lg"
                >
                  <span>{module}</span>
                  <Activity className="w-4 h-4 text-green-400" />
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="glass-panel rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setShowChatTest(true)}
                className="action-button text-blue-400"
              >
                <MessageSquare className="w-6 h-6" />
                <span>Test Chat</span>
              </button>
              <button className="action-button text-purple-400">
                <Eye className="w-6 h-6" />
                <span>Test Vision</span>
              </button>
              <button className="action-button text-green-400">
                <Gauge className="w-6 h-6" />
                <span>Diagnostics</span>
              </button>
              <button className="action-button text-red-400">
                <Power className="w-6 h-6" />
                <span>Restart</span>
              </button>
            </div>
          </div>
        </div>

        {/* Package Manager and Storage Manager */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Package Manager */}
          <div className="glass-panel rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Package Manager</h2>
              <Package className="w-5 h-5 text-blue-400" />
            </div>
            <div className="space-y-4">
              {config.packages.map((pkg) => (
                <div 
                  key={pkg.id} 
                  className="package-card cursor-pointer"
                  onClick={() => handlePackageClick(pkg.id)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{pkg.name}</h3>
                      <p className="text-sm text-gray-400">{pkg.description}</p>
                    </div>
                    <span className={`status-badge ${
                      pkg.status === 'installed' ? 'bg-green-500/20 text-green-400' :
                      pkg.status === 'updating' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-blue-500/20 text-blue-400'
                    }`}>
                      {pkg.status.charAt(0).toUpperCase() + pkg.status.slice(1)}
                    </span>
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <div className="text-sm text-gray-400">
                      {pkg.size} MB | Version {pkg.version}
                    </div>
                    {pkg.status === 'installed' ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const newPackages = config.packages.map(p =>
                            p.id === pkg.id ? { ...p, status: 'available' } : p
                          );
                          setConfig({ ...config, packages: newPackages });
                        }}
                        className="px-3 py-1 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30"
                      >
                        Uninstall
                      </button>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const newPackages = config.packages.map(p =>
                            p.id === pkg.id ? { ...p, status: 'installed' } : p
                          );
                          setConfig({ ...config, packages: newPackages });
                        }}
                        className="px-3 py-1 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
                      >
                        Install
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Storage Manager */}
          <div className="glass-panel rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Storage Manager</h2>
              <HardDrive className="w-5 h-5 text-blue-400" />
            </div>
            <div className="space-y-4">
              {[
                { name: 'Local Storage', used: 2.5, total: 10, connected: true },
                { name: 'Google Drive', used: 0, total: 15, connected: false },
                { name: 'iCloud', used: 0, total: 5, connected: false }
              ].map((storage, index) => (
                <div key={index} className="glass-panel p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Cloud className="w-6 h-6 text-blue-400" />
                      <div>
                        <h4 className="font-medium">{storage.name}</h4>
                        <p className="text-sm text-gray-400">
                          {storage.connected ? 'Connected' : 'Not connected'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowStorage(true)}
                      className="px-3 py-1 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
                    >
                      {storage.connected ? 'Manage' : 'Connect'}
                    </button>
                  </div>
                  {storage.connected && (
                    <div className="mt-3">
                      <div className="flex justify-between text-sm text-gray-400 mb-1">
                        <span>Storage Used</span>
                        <span>{storage.used}GB / {storage.total}GB</span>
                      </div>
                      <div className="metric-bar">
                        <div
                          className="metric-bar-fill bg-blue-500"
                          style={{ width: `${(storage.used / storage.total) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Installed Package Components */}
        {getInstalledPackagesWithComponents().length > 0 && (
          <div className="grid grid-cols-1 gap-6 mt-6">
            {getInstalledPackagesWithComponents().map((pkg) => (
              <div key={pkg.id} id={`package-${pkg.id}`} className="glass-panel rounded-lg">
                {pkg.component && React.createElement(pkg.component)}
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modals */}
      {showChatTest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">AI Chat Test</h2>
              <button
                onClick={() => setShowChatTest(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="h-64 overflow-y-auto mb-4 space-y-3">
              {chatMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === 'human' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`p-3 rounded-lg max-w-[80%] ${
                      message.sender === 'human'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-700 text-white'
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex space-x-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your message..."
                className="flex-1 bg-gray-700 text-white p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSendMessage}
                className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {showConfig && (
        <ConfigPanel
          config={config}
          onConfigChange={setConfig}
          onClose={() => setShowConfig(false)}
        />
      )}

      {showStorage && (
        <StorageManager onClose={() => setShowStorage(false)} />
      )}
    </div>
  );
}

export default App;