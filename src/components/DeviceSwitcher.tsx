import React, { useState } from 'react';
import { Notebook as Robot, Plus, Settings, Signal, BatteryMedium, MapPin } from 'lucide-react';
import { RobotDevice } from '../types';

interface DeviceSwitcherProps {
  devices: RobotDevice[];
  selectedDevice: RobotDevice;
  onDeviceChange: (device: RobotDevice) => void;
  onAddDevice: () => void;
}

export function DeviceSwitcher({ devices, selectedDevice, onDeviceChange, onAddDevice }: DeviceSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);

  const getStatusColor = (status: RobotDevice['status']) => {
    switch (status) {
      case 'online': return 'text-green-400';
      case 'offline': return 'text-gray-400';
      case 'maintenance': return 'text-yellow-400';
    }
  };

  const getDeviceIcon = (type: RobotDevice['type']) => {
    return Robot;
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-700/50 hover:bg-gray-700 transition-colors"
      >
        <Robot className="w-5 h-5" />
        <span>{selectedDevice.name}</span>
        <span className={`w-2 h-2 rounded-full ${getStatusColor(selectedDevice.status)}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-gray-800 rounded-lg shadow-xl border border-gray-700 z-50">
          <div className="p-4 border-b border-gray-700">
            <h3 className="text-sm font-medium text-gray-400">CONNECTED DEVICES</h3>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {devices.map((device) => (
              <button
                key={device.id}
                onClick={() => {
                  onDeviceChange(device);
                  setIsOpen(false);
                }}
                className={`w-full text-left p-4 hover:bg-gray-700/50 transition-colors ${
                  selectedDevice.id === device.id ? 'bg-blue-500/20' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      {React.createElement(getDeviceIcon(device.type), {
                        className: 'w-8 h-8 text-blue-400'
                      })}
                      <span
                        className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ${
                          getStatusColor(device.status)
                        }`}
                      />
                    </div>
                    <div>
                      <div className="font-medium">{device.name}</div>
                      <div className="text-sm text-gray-400">{device.type}</div>
                    </div>
                  </div>
                  <Settings className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100" />
                </div>
                
                <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Signal className="w-3 h-3" />
                    <span>{device.status}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <BatteryMedium className="w-3 h-3" />
                    <span>{device.batteryLevel}%</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-3 h-3" />
                    <span>{device.location}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="p-2 border-t border-gray-700">
            <button
              onClick={onAddDevice}
              className="w-full flex items-center justify-center space-x-2 p-2 rounded-lg hover:bg-gray-700/50 transition-colors text-blue-400"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Device</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}