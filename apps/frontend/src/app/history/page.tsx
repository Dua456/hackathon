'use client';

import { useState } from 'react';
import { DashboardLayout } from '../../components';

interface EmergencyEvent {
  id: string;
  timestamp: string;
  type: 'alert' | 'false_alarm' | 'test';
  threatLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  confidence: number;
  location?: {
    latitude: number;
    longitude: number;
    address: string;
  };
  audioUrl?: string;
  contactsNotified: number;
  status: 'resolved' | 'active' | 'cancelled';
  notes?: string;
}

export default function HistoryPage() {
  const [filter, setFilter] = useState<'all' | 'alert' | 'false_alarm' | 'test'>('all');

  const events: EmergencyEvent[] = [
    {
      id: '1',
      timestamp: '2026-05-13T14:30:00Z',
      type: 'test',
      threatLevel: 'LOW',
      confidence: 45,
      contactsNotified: 3,
      status: 'resolved',
      notes: 'System test - all contacts received notification',
    },
    {
      id: '2',
      timestamp: '2026-05-12T09:15:00Z',
      type: 'false_alarm',
      threatLevel: 'MEDIUM',
      confidence: 62,
      location: {
        latitude: 37.7749,
        longitude: -122.4194,
        address: '123 Main St, San Francisco, CA',
      },
      contactsNotified: 0,
      status: 'cancelled',
      notes: 'Cancelled by user within countdown period',
    },
  ];

  const filteredEvents = filter === 'all' ? events : events.filter((e) => e.type === filter);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'alert':
        return 'danger';
      case 'false_alarm':
        return 'warning';
      case 'test':
        return 'secondary';
      default:
        return 'primary';
    }
  };

  const getThreatColor = (level: string) => {
    switch (level) {
      case 'CRITICAL':
        return 'text-danger-600';
      case 'HIGH':
        return 'text-danger-500';
      case 'MEDIUM':
        return 'text-warning-600';
      case 'LOW':
        return 'text-success-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <DashboardLayout userName="User">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Event History</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              View and manage your emergency detection history
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
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Export
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: 'Total Events', value: events.length, icon: '📊', color: 'primary' },
            {
              label: 'Real Alerts',
              value: events.filter((e) => e.type === 'alert').length,
              icon: '🚨',
              color: 'danger',
            },
            {
              label: 'False Alarms',
              value: events.filter((e) => e.type === 'false_alarm').length,
              icon: '⚠️',
              color: 'warning',
            },
            {
              label: 'Tests',
              value: events.filter((e) => e.type === 'test').length,
              icon: '✓',
              color: 'success',
            },
          ].map((stat, index) => (
            <div key={index} className="card-hover">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                </div>
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                    stat.color === 'danger'
                      ? 'bg-danger-100 dark:bg-danger-900/20'
                      : stat.color === 'warning'
                        ? 'bg-warning-100 dark:bg-warning-900/20'
                        : stat.color === 'success'
                          ? 'bg-success-100 dark:bg-success-900/20'
                          : 'bg-primary-100 dark:bg-primary-900/20'
                  }`}
                >
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="card">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter:</span>
            {[
              { id: 'all', label: 'All Events' },
              { id: 'alert', label: 'Alerts' },
              { id: 'false_alarm', label: 'False Alarms' },
              { id: 'test', label: 'Tests' },
            ].map((filterOption) => (
              <button
                key={filterOption.id}
                onClick={() => setFilter(filterOption.id as any)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === filterOption.id
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 dark:bg-dark-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-700'
                }`}
              >
                {filterOption.label}
              </button>
            ))}
          </div>
        </div>

        {/* Events List */}
        <div className="space-y-4">
          {filteredEvents.length === 0 ? (
            <div className="card text-center py-12">
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
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No Events Found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {filter === 'all'
                  ? 'No emergency events have been recorded yet'
                  : `No ${filter.replace('_', ' ')} events found`}
              </p>
            </div>
          ) : (
            filteredEvents.map((event) => (
              <div key={event.id} className="card-hover">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                        event.type === 'alert'
                          ? 'bg-danger-100 dark:bg-danger-900/20'
                          : event.type === 'false_alarm'
                            ? 'bg-warning-100 dark:bg-warning-900/20'
                            : 'bg-secondary-100 dark:bg-secondary-900/20'
                      }`}
                    >
                      {event.type === 'alert' ? '🚨' : event.type === 'false_alarm' ? '⚠️' : '✓'}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {event.type === 'alert'
                            ? 'Emergency Alert'
                            : event.type === 'false_alarm'
                              ? 'False Alarm'
                              : 'System Test'}
                        </h3>
                        <span className={`badge-${getTypeColor(event.type)}`}>
                          {event.type.replace('_', ' ').toUpperCase()}
                        </span>
                        <span
                          className={`badge ${
                            event.status === 'resolved'
                              ? 'badge-success'
                              : event.status === 'cancelled'
                                ? 'badge-warning'
                                : 'badge-danger'
                          }`}
                        >
                          {event.status.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(event.timestamp).toLocaleString('en-US', {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                        })}
                      </p>
                    </div>
                  </div>
                  <button className="btn-ghost btn-sm">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                      />
                    </svg>
                  </button>
                </div>

                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div className="p-3 bg-gray-50 dark:bg-dark-800 rounded-lg">
                    <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                      Threat Level
                    </div>
                    <div className={`text-lg font-bold ${getThreatColor(event.threatLevel)}`}>
                      {event.threatLevel}
                    </div>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-dark-800 rounded-lg">
                    <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                      AI Confidence
                    </div>
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                      {event.confidence}%
                    </div>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-dark-800 rounded-lg">
                    <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                      Contacts Notified
                    </div>
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                      {event.contactsNotified}
                    </div>
                  </div>
                </div>

                {event.location && (
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg mb-4">
                    <div className="flex items-start space-x-2">
                      <svg
                        className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-blue-900 dark:text-blue-100">
                          {event.location.address}
                        </div>
                        <div className="text-xs text-blue-700 dark:text-blue-300">
                          {event.location.latitude.toFixed(4)},{' '}
                          {event.location.longitude.toFixed(4)}
                        </div>
                      </div>
                      <a
                        href={`https://www.google.com/maps?q=${event.location.latitude},${event.location.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-outline btn-sm"
                      >
                        View Map
                      </a>
                    </div>
                  </div>
                )}

                {event.notes && (
                  <div className="p-3 bg-gray-50 dark:bg-dark-800 rounded-lg">
                    <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Notes</div>
                    <div className="text-sm text-gray-900 dark:text-white">{event.notes}</div>
                  </div>
                )}

                {event.audioUrl && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-dark-700">
                    <button className="btn-outline btn-sm">
                      <svg
                        className="w-4 h-4 mr-2 inline"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Play Audio Recording
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
