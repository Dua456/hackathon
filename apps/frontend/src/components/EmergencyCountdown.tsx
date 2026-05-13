'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface EmergencyCountdownProps {
  duration?: number;
  onComplete: () => void;
  onCancel: () => void;
  threatLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  confidence: number;
}

export function EmergencyCountdown({
  duration = 10,
  onComplete,
  onCancel,
  threatLevel,
  confidence,
}: EmergencyCountdownProps) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) {
      onComplete();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onComplete]);

  useEffect(() => {
    if ('vibrate' in navigator) {
      const pattern = timeLeft <= 3 ? [200, 100, 200] : [100];
      navigator.vibrate(pattern);
    }
  }, [timeLeft]);

  const handleCancel = useCallback(async () => {
    setIsCancelling(true);

    try {
      const confirmed = await requestBiometricVerification();
      if (confirmed) {
        onCancel();
      } else {
        setIsCancelling(false);
      }
    } catch (error) {
      console.error('Biometric verification failed:', error);
      setIsCancelling(false);
    }
  }, [onCancel]);

  const getThreatColor = () => {
    switch (threatLevel) {
      case 'CRITICAL':
        return 'from-red-600 to-red-700';
      case 'HIGH':
        return 'from-orange-600 to-orange-700';
      case 'MEDIUM':
        return 'from-yellow-600 to-yellow-700';
      default:
        return 'from-blue-600 to-blue-700';
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90"
        role="alertdialog"
        aria-labelledby="emergency-title"
        aria-describedby="emergency-description"
      >
        <div className="w-full h-full flex flex-col items-center justify-center p-6">
          <motion.div
            animate={{
              scale: timeLeft <= 3 ? [1, 1.05, 1] : 1,
            }}
            transition={{
              duration: 0.5,
              repeat: timeLeft <= 3 ? Infinity : 0,
            }}
            className="text-center space-y-8"
          >
            <div className="space-y-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="w-24 h-24 mx-auto"
              >
                <svg
                  className="w-full h-full text-red-500"
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
              </motion.div>

              <h1 id="emergency-title" className="text-4xl md:text-6xl font-bold text-white">
                EMERGENCY DETECTED
              </h1>

              <p id="emergency-description" className="text-xl md:text-2xl text-gray-300">
                Alerting emergency contacts in
              </p>
            </div>

            <motion.div
              key={timeLeft}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`text-9xl md:text-[12rem] font-bold bg-gradient-to-br ${getThreatColor()} bg-clip-text text-transparent`}
            >
              {timeLeft}
            </motion.div>

            <div className="space-y-4">
              <div className="flex items-center justify-center gap-4 text-white">
                <div className="text-center">
                  <div className="text-sm text-gray-400">Threat Level</div>
                  <div className="text-2xl font-bold">{threatLevel}</div>
                </div>
                <div className="w-px h-12 bg-gray-600" />
                <div className="text-center">
                  <div className="text-sm text-gray-400">Confidence</div>
                  <div className="text-2xl font-bold">{(confidence * 100).toFixed(0)}%</div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCancel}
                disabled={isCancelling}
                className="w-full max-w-md px-8 py-6 bg-white text-gray-900 text-2xl font-bold rounded-2xl hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl"
                aria-label="Cancel emergency alert"
              >
                {isCancelling ? 'Verifying...' : "I'M SAFE - CANCEL ALERT"}
              </motion.button>

              <p className="text-sm text-gray-400 max-w-md mx-auto">
                Tap the button above and verify your identity to cancel this alert
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

async function requestBiometricVerification(): Promise<boolean> {
  if (!('credentials' in navigator)) {
    return confirm('Are you sure you want to cancel this emergency alert?');
  }

  try {
    const challenge = new Uint8Array(32);
    crypto.getRandomValues(challenge);

    const credential = await navigator.credentials.get({
      publicKey: {
        challenge,
        timeout: 60000,
        userVerification: 'required',
      } as any,
    });

    return credential !== null;
  } catch (error) {
    console.error('Biometric verification failed:', error);
    return confirm('Biometric verification unavailable. Cancel emergency alert?');
  }
}
