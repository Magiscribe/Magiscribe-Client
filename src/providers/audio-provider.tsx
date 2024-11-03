import { useWithLocalStorage } from '@/hooks/local-storage-hook';
import React, { createContext, useCallback, useContext } from 'react';

/**
 * Interface defining the shape of the audio context
 */
interface AudioContextProps {
  /** Whether audio is currently enabled */
  isAudioEnabled: boolean;
  /** Function to toggle the audio state */
  toggleAudio: () => void;
  /** Function to explicitly set the audio state */
  setAudioEnabled: (enabled: boolean) => void;
}

/**
 * Context for managing global audio state
 */
export const AudioContext = createContext<AudioContextProps | undefined>(undefined);

/**
 * Props for the AudioProvider component
 */
interface AudioProviderProps {
  /** Initial state for audio enabled/disabled */
  initialAudioEnabled?: boolean;
  /** React children */
  children: React.ReactNode;
}

/**
 * Provider component that manages global audio state
 * @param props - The provider props
 * @returns Provider component wrapping its children
 */
export const AudioProvider: React.FC<AudioProviderProps> = ({ initialAudioEnabled = false, children }) => {
  const [isAudioEnabled, setIsAudioEnabled] = useWithLocalStorage<boolean>(initialAudioEnabled, 'audioEnabled');

  const toggleAudio = useCallback(() => {
    setIsAudioEnabled((prev) => !prev);
  }, []);

  const setAudioEnabled = useCallback((enabled: boolean) => {
    setIsAudioEnabled(enabled);
  }, []);

  const value = {
    isAudioEnabled,
    toggleAudio,
    setAudioEnabled,
  };

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
};

/**
 * Hook to access the audio context
 * @throws Error if used outside of AudioProvider
 * @returns The audio context value
 */
export const useAudioContext = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudioContext must be used within an AudioProvider');
  }
  return context;
};

/**
 * Hook to check if audio is enabled
 * @returns Current audio enabled state
 */
export const useAudioEnabled = () => useAudioContext().isAudioEnabled;

/**
 * Hook to toggle audio state
 * @returns Function to toggle audio
 */
export const useToggleAudio = () => useAudioContext().toggleAudio;

/**
 * Hook to set audio state
 * @returns Function to set audio enabled/disabled
 */
export const useSetAudioEnabled = () => useAudioContext().setAudioEnabled;

export default AudioProvider;
