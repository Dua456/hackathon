'use client';

import { useState } from 'react';
import { DashboardLayout } from '../../components';

export default function DashboardPage() {
  const [isMonitoring, setIsMonitoring] = useState(true);

  const stats = [
    {
      label: 'Monitoring Status',
      value: isMonitoring ? 'Active' : 'Inactive',
      icon: '🛡️',
      color: isMonitoring ? 'success' : 'danger',
      trend: null,
    },
    {
      label: 'Total Alerts',
      value: '0',
      icon: '🚨',
      color: 'primary',
      trend: null,
    },
    {
      label: 'False Alarms',
      value: '0',
      icon: '✓',
      color: 'warning',
      trend: null,
    },
    {
      label: 'Trusted Contacts',
      value: '3',
      icon: '👥',
      color: 'secondary',
      trend: null,
    },
  ];

  const recentActivity = [
    {
      id: 1,
      type: 'system',
      title: 'Monitoring Started',
      description: 'Voice detection activated successfully',
      timestamp: '2 hours ago',
      icon: '✓',
      color: 'success',
    },
    {
      id: 2,
      type: 'contact',
      title: 'Contact Added',
      description: 'John Doe added as trusted contact',
      timestamp: '1 day ago',
      icon: '👤',
      color: 'secondary',
    },
    {
      id: 3,
      type: 'settings',
      title: 'Settings Updated',
      description: 'Emergency preferences configured',
      timestamp: '2 days ago',
      icon: '⚙️',
      color: 'primary',
    },
  ];

  return (
    <DashboardLayout userName="User">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Welcome back! Here's your emergency protection overview.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="btn-outline">
              <svg
                className="w-5 h-5 mr-2 inline"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                />
              </svg>
              Settings
            </button>
            <button className="btn-primary">
              <svg
                className="w-5 h-5 mr-2 inline"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add Contact
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="card-hover animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    {stat.label}
                  </p>
                  <p
                    className={`text-3xl font-bold ${
                      stat.color === 'success'
                        ? 'text-success-600'
                        : stat.color === 'danger'
                          ? 'text-danger-600'
                          : stat.color === 'warning'
                            ? 'text-warning-600'
                            : stat.color === 'secondary'
                              ? 'text-secondary-600'
                              : 'text-primary-600'
                    }`}
                  >
                    {stat.value}
                  </p>
                </div>
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                    stat.color === 'success'
                      ? 'bg-success-100 dark:bg-success-900/20'
                      : stat.color === 'danger'
                        ? 'bg-danger-100 dark:bg-danger-900/20'
                        : stat.color === 'warning'
                          ? 'bg-warning-100 dark:bg-warning-900/20'
                          : stat.color === 'secondary'
                            ? 'bg-secondary-100 dark:bg-secondary-900/20'
                            : 'bg-primary-100 dark:bg-primary-900/20'
                  }`}
                >
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Monitoring Status */}
          <div className="lg:col-span-2 card space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Monitoring Status
              </h2>
              <button
                onClick={() => setIsMonitoring(!isMonitoring)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  isMonitoring ? 'bg-success-600' : 'bg-gray-300 dark:bg-dark-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isMonitoring ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {isMonitoring ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-4 bg-success-50 dark:bg-success-900/20 rounded-xl border border-success-200 dark:border-success-800">
                  <div className="w-12 h-12 bg-success-500 rounded-full flex items-center justify-center animate-pulse">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-success-900 dark:text-success-100">
                      Protection Active
                    </h3>
                    <p className="text-sm text-success-700 dark:text-success-300">
                      Listening for emergency signals 24/7
                    </p>
                  </div>
                  <div className="w-3 h-3 bg-success-500 rounded-full animate-pulse"></div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 dark:bg-dark-800 rounded-xl">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Uptime</div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">2h 34m</div>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-dark-800 rounded-xl">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      AI Confidence
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">98%</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Audio Detection</span>
                    <span className="font-medium text-success-600">Active</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">AI Analysis</span>
                    <span className="font-medium text-success-600">Ready</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">GPS Location</span>
                    <span className="font-medium text-success-600">Enabled</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Emergency Contacts</span>
                    <span className="font-medium text-success-600">3 Ready</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gray-100 dark:bg-dark-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-10 h-10 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Monitoring Inactive
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Enable monitoring to start emergency protection
                </p>
                <button onClick={() => setIsMonitoring(true)} className="btn-primary">
                  Start Monitoring
                </button>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="card space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Quick Actions</h2>
            <div className="space-y-3">
              <button className="w-full flex items-center space-x-3 p-4 bg-primary-50 dark:bg-primary-900/20 hover:bg-primary-100 dark:hover:bg-primary-900/30 rounded-xl transition-colors text-left">
                <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900 dark:text-white">Add Contact</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    Set up trusted contacts
                  </div>
                </div>
              </button>

              <button className="w-full flex items-center space-x-3 p-4 bg-secondary-50 dark:bg-secondary-900/20 hover:bg-secondary-100 dark:hover:bg-secondary-900/30 rounded-xl transition-colors text-left">
                <div className="w-10 h-10 bg-secondary-600 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900 dark:text-white">Test Alert</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    Send test notification
                  </div>
                </div>
              </button>

              <button className="w-full flex items-center space-x-3 p-4 bg-warning-50 dark:bg-warning-900/20 hover:bg-warning-100 dark:hover:bg-warning-900/30 rounded-xl transition-colors text-left">
                <div className="w-10 h-10 bg-warning-600 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900 dark:text-white">Configure</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Adjust settings</div>
                </div>
              </button>

              <button className="w-full flex items-center space-x-3 p-4 bg-success-50 dark:bg-success-900/20 hover:bg-success-100 dark:hover:bg-success-900/30 rounded-xl transition-colors text-left">
                <div className="w-10 h-10 bg-success-600 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900 dark:text-white">View History</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Check past events</div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
            <button className="text-sm text-primary-600 dark:text-primary-400 hover:underline">
              View All
            </button>
          </div>

          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-dark-800 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg ${
                    activity.color === 'success'
                      ? 'bg-success-100 dark:bg-success-900/20'
                      : activity.color === 'secondary'
                        ? 'bg-secondary-100 dark:bg-secondary-900/20'
                        : 'bg-primary-100 dark:bg-primary-900/20'
                  }`}
                >
                  {activity.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 dark:text-white">{activity.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{activity.description}</p>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-500 whitespace-nowrap">
                  {activity.timestamp}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
