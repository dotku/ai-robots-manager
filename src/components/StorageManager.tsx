import React, { useState } from 'react';
import { Cloud, HardDrive, Trash2, Download, Upload, RefreshCw, X, Filter, Search, FolderOpen, FileText, Archive, Database, Code } from 'lucide-react';
import { StorageProvider, StorageFile } from '../types';

interface StorageManagerProps {
  onClose: () => void;
}

const FILE_TYPE_ICONS = {
  archive: Archive,
  config: Code,
  model: Database,
  data: FileText
};

export function StorageManager({ onClose }: StorageManagerProps) {
  const [selectedProvider, setSelectedProvider] = useState<StorageProvider | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | StorageFile['type']>('all');
  const [isConnecting, setIsConnecting] = useState(false);

  const storageProviders: StorageProvider[] = [
    {
      id: 'local',
      name: 'Local Storage',
      icon: HardDrive,
      connected: true,
      usedSpace: 2.5,
      totalSpace: 10,
      files: [
        { name: 'backup_2024.zip', size: 1.2, type: 'archive', lastModified: new Date('2024-01-15') },
        { name: 'config.json', size: 0.1, type: 'config', lastModified: new Date('2024-01-20') },
        { name: 'models.bin', size: 1.2, type: 'model', lastModified: new Date('2024-01-18') }
      ]
    },
    {
      id: 'google-drive',
      name: 'Google Drive',
      icon: Cloud,
      connected: true,
      usedSpace: 5.2,
      totalSpace: 15,
      files: [
        { name: 'training_data.csv', size: 2.1, type: 'data', lastModified: new Date('2024-01-19') },
        { name: 'vision_model.bin', size: 3.0, type: 'model', lastModified: new Date('2024-01-17') },
        { name: 'system_backup.zip', size: 0.1, type: 'archive', lastModified: new Date('2024-01-16') }
      ]
    },
    {
      id: 'icloud',
      name: 'iCloud',
      icon: Cloud,
      connected: false,
      usedSpace: 0,
      totalSpace: 5,
      files: []
    }
  ];

  const handleConnect = (provider: StorageProvider) => {
    setSelectedProvider(provider);
    setIsConnecting(true);
    // Simulate connection process
    setTimeout(() => {
      setIsConnecting(false);
    }, 2000);
  };

  const allFiles = storageProviders
    .filter(provider => provider.connected)
    .flatMap(provider => 
      provider.files.map(file => ({
        ...file,
        provider: provider.name
      }))
    )
    .filter(file => {
      const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = selectedType === 'all' || file.type === selectedType;
      return matchesSearch && matchesType;
    });

  const totalUsedSpace = storageProviders.reduce((acc, provider) => acc + provider.usedSpace, 0);
  const totalAvailableSpace = storageProviders.reduce((acc, provider) => acc + provider.totalSpace, 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="glass-panel rounded-lg w-full max-w-6xl shadow-xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-semibold flex items-center">
              <HardDrive className="w-5 h-5 mr-2 text-blue-400" />
              Storage Manager
            </h2>
            <div className="text-sm text-gray-400">
              Total: {totalUsedSpace.toFixed(1)}GB / {totalAvailableSpace}GB
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-700 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-1 min-h-0">
          {/* Left Sidebar - Storage Providers */}
          <div className="w-64 border-r border-gray-700 p-4 overflow-y-auto">
            <h3 className="text-sm font-medium text-gray-400 mb-3">STORAGE PROVIDERS</h3>
            <div className="space-y-2">
              {storageProviders.map((provider) => (
                <button
                  key={provider.id}
                  onClick={() => setSelectedProvider(provider)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedProvider?.id === provider.id
                      ? 'bg-blue-500/20 text-blue-400'
                      : 'hover:bg-gray-700/50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <provider.icon className="w-5 h-5" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{provider.name}</div>
                      <div className="text-xs text-gray-400">
                        {provider.connected
                          ? `${provider.usedSpace}GB / ${provider.totalSpace}GB`
                          : 'Not connected'}
                      </div>
                    </div>
                  </div>
                  {provider.connected && (
                    <div className="mt-2">
                      <div className="metric-bar">
                        <div
                          className="metric-bar-fill bg-blue-500"
                          style={{ width: `${(provider.usedSpace / provider.totalSpace) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col min-h-0">
            {/* Search and Filters */}
            <div className="p-4 border-b border-gray-700">
              <div className="flex space-x-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search files..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-gray-700/50 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value as any)}
                  className="bg-gray-700/50 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Types</option>
                  <option value="archive">Archives</option>
                  <option value="config">Config Files</option>
                  <option value="model">Models</option>
                  <option value="data">Data Files</option>
                </select>
              </div>
            </div>

            {/* File List */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="grid gap-2">
                {allFiles.map((file, index) => {
                  const FileIcon = FILE_TYPE_ICONS[file.type] || FileText;
                  return (
                    <div
                      key={`${file.provider}-${file.name}-${index}`}
                      className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-700/30 group"
                    >
                      <FileIcon className="w-5 h-5 text-blue-400" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{file.name}</div>
                        <div className="text-sm text-gray-400 flex items-center space-x-2">
                          <span>{file.provider}</span>
                          <span>•</span>
                          <span>{file.size}GB</span>
                          <span>•</span>
                          <span>{file.lastModified.toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1 hover:bg-gray-600 rounded" title="Download">
                          <Download className="w-4 h-4 text-blue-400" />
                        </button>
                        <button className="p-1 hover:bg-gray-600 rounded" title="Delete">
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action Bar */}
            <div className="p-4 border-t border-gray-700">
              <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                  <button className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg">
                    <Upload className="w-4 h-4" />
                    <span>Upload</span>
                  </button>
                  <button className="flex items-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg">
                    <RefreshCw className="w-4 h-4" />
                    <span>Sync All</span>
                  </button>
                </div>
                <div className="text-sm text-gray-400">
                  {allFiles.length} files • {totalUsedSpace.toFixed(1)}GB used
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}