import React, { useState } from 'react';
import { Settings, Save, RefreshCw, Trash2, Package as PackageIcon } from 'lucide-react';
import { SystemConfig, AIConfig, MemoryConfig, AppConfig } from '../types';
import { PackageManager } from './PackageManager';

interface ConfigPanelProps {
  config: SystemConfig;
  onConfigChange: (newConfig: SystemConfig) => void;
  onClose: () => void;
}

export function ConfigPanel({ config, onConfigChange, onClose }: ConfigPanelProps) {
  const [showPackageManager, setShowPackageManager] = useState(false);

  const handleAIConfigChange = (changes: Partial<AIConfig>) => {
    onConfigChange({
      ...config,
      ai: { ...config.ai, ...changes }
    });
  };

  const handleMemoryConfigChange = (changes: Partial<MemoryConfig>) => {
    onConfigChange({
      ...config,
      memory: { ...config.memory, ...changes }
    });
  };

  const handleAppConfigChange = (index: number, changes: Partial<AppConfig>) => {
    const newApps = [...config.apps];
    newApps[index] = { ...newApps[index], ...changes };
    onConfigChange({
      ...config,
      apps: newApps
    });
  };

  const handleInstallPackage = (pkg: Package) => {
    const newPackages = config.packages.map(p => 
      p.id === pkg.id ? { ...p, status: 'installed' } : p
    );
    onConfigChange({
      ...config,
      packages: newPackages
    });
  };

  const handleUninstallPackage = (pkg: Package) => {
    const newPackages = config.packages.map(p => 
      p.id === pkg.id ? { ...p, status: 'available' } : p
    );
    onConfigChange({
      ...config,
      packages: newPackages
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg w-full max-w-4xl shadow-xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold flex items-center">
            <Settings className="w-5 h-5 mr-2 text-blue-400" />
            System Configuration
          </h2>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowPackageManager(true)}
              className="p-2 hover:bg-gray-700 rounded-lg flex items-center space-x-2"
            >
              <PackageIcon className="w-5 h-5" />
              <span>Packages</span>
            </button>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-700 rounded-lg"
            >
              <Save className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto p-6 space-y-8">
          {/* Existing config sections... */}
          {/* AI Model Configuration */}
          <section>
            <h3 className="text-lg font-semibold mb-4">AI Model Configuration</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Model</label>
                <select
                  value={config.ai.model}
                  onChange={(e) => handleAIConfigChange({ model: e.target.value })}
                  className="w-full bg-gray-700 rounded-lg px-3 py-2"
                >
                  <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                  <option value="gpt-4">GPT-4</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Temperature</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={config.ai.temperature}
                  onChange={(e) => handleAIConfigChange({ temperature: parseFloat(e.target.value) })}
                  className="w-full"
                />
                <div className="text-sm text-gray-400 mt-1">{config.ai.temperature}</div>
              </div>
            </div>
          </section>

          {/* Memory Configuration */}
          <section>
            <h3 className="text-lg font-semibold mb-4">Memory Configuration</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Max Conversation Length</label>
                <input
                  type="number"
                  value={config.memory.maxConversationLength}
                  onChange={(e) => handleMemoryConfigChange({ maxConversationLength: parseInt(e.target.value) })}
                  className="w-full bg-gray-700 rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Retention Period (hours)</label>
                <input
                  type="number"
                  value={config.memory.retentionPeriod}
                  onChange={(e) => handleMemoryConfigChange({ retentionPeriod: parseInt(e.target.value) })}
                  className="w-full bg-gray-700 rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Context Window</label>
                <input
                  type="number"
                  value={config.memory.contextWindow}
                  onChange={(e) => handleMemoryConfigChange({ contextWindow: parseInt(e.target.value) })}
                  className="w-full bg-gray-700 rounded-lg px-3 py-2"
                />
              </div>
              <div className="flex items-center">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.memory.persistMemory}
                    onChange={(e) => handleMemoryConfigChange({ persistMemory: e.target.checked })}
                    className="form-checkbox h-4 w-4"
                  />
                  <span>Persist Memory</span>
                </label>
              </div>
            </div>
          </section>

          {/* Application Manager */}
          <section>
            <h3 className="text-lg font-semibold mb-4">Application Manager</h3>
            <div className="space-y-4">
              {config.apps.map((app, index) => (
                <div key={index} className="bg-gray-700 p-4 rounded-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Name</label>
                      <input
                        type="text"
                        value={app.name}
                        onChange={(e) => handleAppConfigChange(index, { name: e.target.value })}
                        className="w-full bg-gray-600 rounded-lg px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Status</label>
                      <select
                        value={app.status}
                        onChange={(e) => handleAppConfigChange(index, { status: e.target.value as 'active' | 'inactive' })}
                        className="w-full bg-gray-600 rounded-lg px-3 py-2"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Priority</label>
                      <input
                        type="number"
                        value={app.priority}
                        onChange={(e) => handleAppConfigChange(index, { priority: parseInt(e.target.value) })}
                        className="w-full bg-gray-600 rounded-lg px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Memory Allocation (MB)</label>
                      <input
                        type="number"
                        value={app.memoryAllocation}
                        onChange={(e) => handleAppConfigChange(index, { memoryAllocation: parseInt(e.target.value) })}
                        className="w-full bg-gray-600 rounded-lg px-3 py-2"
                      />
                    </div>
                  </div>
                  <div className="flex justify-between mt-4">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={app.autoRestart}
                        onChange={(e) => handleAppConfigChange(index, { autoRestart: e.target.checked })}
                        className="form-checkbox h-4 w-4"
                      />
                      <span>Auto Restart</span>
                    </label>
                    <div className="space-x-2">
                      <button
                        onClick={() => handleAppConfigChange(index, { status: app.status === 'active' ? 'inactive' : 'active' })}
                        className="p-2 hover:bg-gray-600 rounded-lg"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          const newApps = config.apps.filter((_, i) => i !== index);
                          onConfigChange({ ...config, apps: newApps });
                        }}
                        className="p-2 hover:bg-gray-600 rounded-lg text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {showPackageManager && (
        <PackageManager
          packages={config.packages}
          onInstall={handleInstallPackage}
          onUninstall={handleUninstallPackage}
          onClose={() => setShowPackageManager(false)}
        />
      )}
    </div>
  );
}