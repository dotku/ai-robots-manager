import React, { useState } from 'react';
import { Package } from '../types';
import { Download, Trash2, RefreshCw, Check, AlertCircle } from 'lucide-react';

interface PackageManagerProps {
  packages: Package[];
  onInstall: (pkg: Package) => void;
  onUninstall: (pkg: Package) => void;
  onClose: () => void;
}

export function PackageManager({ packages, onInstall, onUninstall, onClose }: PackageManagerProps) {
  const [selectedCategory, setSelectedCategory] = useState<Package['category'] | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories: Array<{ value: Package['category'] | 'all', label: string }> = [
    { value: 'all', label: 'All Packages' },
    { value: 'language', label: 'Language Support' },
    { value: 'story', label: 'Story Generation' },
    { value: 'voice', label: 'Voice Processing' },
    { value: 'game', label: 'Game Assistance' },
    { value: 'expert', label: 'Expert Systems' }
  ];

  const filteredPackages = packages.filter(pkg => {
    const matchesCategory = selectedCategory === 'all' || pkg.category === selectedCategory;
    const matchesSearch = pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         pkg.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg w-full max-w-4xl shadow-xl max-h-[90vh] overflow-hidden">
        <div className="p-4 border-b border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Package Manager</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-700 rounded-lg"
            >
              <Check className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex space-x-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as Package['category'] | 'all')}
              className="bg-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
            
            <input
              type="text"
              placeholder="Search packages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="overflow-y-auto p-4 max-h-[calc(90vh-200px)]">
          <div className="grid grid-cols-1 gap-4">
            {filteredPackages.map(pkg => (
              <div key={pkg.id} className="bg-gray-700 p-4 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-semibold">{pkg.name}</h3>
                    <p className="text-sm text-gray-400">{pkg.description}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      pkg.status === 'installed' ? 'bg-green-500' :
                      pkg.status === 'updating' ? 'bg-yellow-500' :
                      'bg-blue-500'
                    }`}>
                      {pkg.status.charAt(0).toUpperCase() + pkg.status.slice(1)}
                    </span>
                    {pkg.status === 'installed' ? (
                      <button
                        onClick={() => onUninstall(pkg)}
                        className="p-2 hover:bg-gray-600 rounded-lg text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    ) : pkg.status === 'updating' ? (
                      <div className="p-2">
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      </div>
                    ) : (
                      <button
                        onClick={() => onInstall(pkg)}
                        className="p-2 hover:bg-gray-600 rounded-lg text-green-400"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Version:</span> {pkg.version}
                  </div>
                  <div>
                    <span className="text-gray-400">Size:</span> {pkg.size} MB
                  </div>
                  <div>
                    <span className="text-gray-400">Memory Required:</span> {pkg.memoryRequirement} MB
                  </div>
                  <div>
                    <span className="text-gray-400">Category:</span> {pkg.category.charAt(0).toUpperCase() + pkg.category.slice(1)}
                  </div>
                </div>

                {pkg.dependencies.length > 0 && (
                  <div className="mt-2">
                    <span className="text-sm text-gray-400">Dependencies:</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {pkg.dependencies.map(dep => (
                        <span key={dep} className="px-2 py-1 bg-gray-600 rounded-full text-xs">
                          {dep}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-2">
                  <span className="text-sm text-gray-400">Capabilities:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {pkg.capabilities.map(cap => (
                      <span key={cap} className="px-2 py-1 bg-gray-600 rounded-full text-xs">
                        {cap}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}