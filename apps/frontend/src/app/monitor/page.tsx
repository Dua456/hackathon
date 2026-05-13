'use client';

import { useEffect, useState } from 'react';
import { useAudioMonitor } from '../../hooks';
import { useWakePhraseDetection } from '../../hooks';
import { useRollingAudioBuffer } from '../../hooks';
import { AudioVisualizer, CompatibilityBanner, WakePhraseIndicator } from '../../components';

export default function AudioMonitorPage() {
  const [isActive, setIsActive] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const {
    isListening,
    isSupported,
    error: audioError,
    audioLevel,
    startListening,
    stopListening,
  } = useAudioMonitor();

  const { isDetecting, lastDetection, detectionCount, startDetection, stopDetection } =
    useWakePhraseDetection();

  const { startRecording, stopRecording, getBufferDuration, clearBuffer } = useRollingAudioBuffer();

  useEffect(() => {
    if (isListening && !isDetecting && isActive) {
      startDetection();
    }
  }, [isListening, isDetecting, isActive, startDetection]);

  const handleStart = async () => {
    try {
      await startListening();
      const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setStream(mediaStream);
      await startRecording(mediaStream);
      setIsActive(true);
    } catch (error) {
      console.error('Failed to start monitoring:', error);
    }
  };

  const handleStop = () => {
    stopListening();
    stopDetection();
    stopRecording();
    clearBuffer();
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setIsActive(false);
  };

  if (!isSupported) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md">
          <div className="text-red-600 text-center">
            <svg
              className="w-16 h-16 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <h2 className="text-xl font-bold mb-2">Not Supported</h2>
            <p className="text-gray-600">
              Audio monitoring is not supported in your browser. Please use a modern browser like
              Chrome, Firefox, or Edge.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <CompatibilityBanner />
      {lastDetection && (
        <WakePhraseIndicator
          phrase={lastDetection.phrase}
          confidence={lastDetection.confidence}
          timestamp={lastDetection.timestamp}
        />
      )}
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-white p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Voice Detection Engine</h1>
            <p className="text-gray-600 mb-6">
              Passive audio monitoring with wake phrase detection
            </p>

            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-semibold text-gray-900">Monitoring Status</h3>
                  <p className="text-sm text-gray-600">
                    {isActive ? 'Active - Listening for wake phrases' : 'Inactive'}
                  </p>
                </div>
                <button
                  onClick={isActive ? handleStop : handleStart}
                  className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                    isActive
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {isActive ? 'Stop Monitoring' : 'Start Monitoring'}
                </button>
              </div>

              {audioError && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 font-medium">Error: {audioError}</p>
                </div>
              )}

              {isActive && (
                <>
                  <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-4">Audio Visualization</h3>
                    <AudioVisualizer audioLevel={audioLevel} isActive={isActive} />
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>Volume</span>
                        <span>{audioLevel}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-green-500 to-blue-500 h-full transition-all duration-100"
                          style={{ width: `${audioLevel}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-600">Listening</div>
                      <div className="text-2xl font-bold text-gray-900">
                        {isListening ? '✓' : '✗'}
                      </div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-600">Detections</div>
                      <div className="text-2xl font-bold text-gray-900">{detectionCount}</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-600">Buffer</div>
                      <div className="text-2xl font-bold text-gray-900">{getBufferDuration()}s</div>
                    </div>
                  </div>

                  {lastDetection && (
                    <div className="p-6 bg-red-50 border-2 border-red-200 rounded-lg animate-pulse-fast">
                      <h3 className="font-semibold text-red-900 mb-2">Wake Phrase Detected!</h3>
                      <div className="space-y-1 text-sm">
                        <p className="text-gray-700">
                          <span className="font-medium">Phrase:</span> "{lastDetection.phrase}"
                        </p>
                        <p className="text-gray-700">
                          <span className="font-medium">Confidence:</span>{' '}
                          {(lastDetection.confidence * 100).toFixed(1)}%
                        </p>
                        <p className="text-gray-700">
                          <span className="font-medium">Time:</span>{' '}
                          {lastDetection.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h3 className="font-semibold text-blue-900 mb-2">Wake Phrases</h3>
                    <div className="flex flex-wrap gap-2">
                      {['help me', 'emergency', 'call police'].map((phrase) => (
                        <span
                          key={phrase}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                        >
                          "{phrase}"
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">How It Works</h2>
            <div className="space-y-3 text-gray-600">
              <p>
                <strong>1. Passive Listening:</strong> Continuously monitors audio with minimal CPU
                usage
              </p>
              <p>
                <strong>2. Wake Phrase Detection:</strong> Uses Web Speech API to detect emergency
                keywords
              </p>
              <p>
                <strong>3. Rolling Buffer:</strong> Maintains last 15 seconds of audio in memory
              </p>
              <p>
                <strong>4. Noise Suppression:</strong> Filters background noise and enhances voice
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
