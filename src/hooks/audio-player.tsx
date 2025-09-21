import { GENERATE_AUDIO } from '@/clients/mutations';
import { useMutation } from '@apollo/client/react';
import { useCallback, useRef, useState } from 'react';

interface QueueItem {
  text: string;
  audio?: HTMLAudioElement;
}

export const useElevenLabsAudio = (voice?: string | null) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [generateAudio] = useMutation(GENERATE_AUDIO);

  const audioQueueRef = useRef<QueueItem[]>([]);
  const currentIndexRef = useRef(0);

  const playNextSentence = useCallback(async () => {
    if (!audioQueueRef.current.length || currentIndexRef.current >= audioQueueRef.current.length) {
      setIsPlaying(false);
      currentIndexRef.current = 0;
      return;
    }

    const currentItem = audioQueueRef.current[currentIndexRef.current];

    if (!currentItem.audio) {
      return; // Wait for audio to be generated
    }

    setIsPlaying(true);

    try {
      await new Promise<void>((resolve, reject) => {
        if (!currentItem.audio) return reject(new Error('No audio available'));

        currentItem.audio.onended = () => {
          currentIndexRef.current++;

          // Cleanup completed items
          if (currentIndexRef.current > 0) {
            audioQueueRef.current = audioQueueRef.current.slice(currentIndexRef.current);
            currentIndexRef.current = 0;
          }

          resolve();
        };

        currentItem.audio.onerror = reject;
        currentItem.audio.play().catch(reject);
      });
    } catch (error) {
      console.error('Error playing audio:', error);
      currentIndexRef.current++;
    } finally {
      setIsPlaying(false);
      playNextSentence();
    }
  }, []);

  const addSentence = useCallback(
    async (text: string) => {
      if (!text.trim()) return;

      const newItem: QueueItem = { text: text.trim() };
      audioQueueRef.current.push(newItem);

      try {
        setIsLoading(true);
        const audioUrl = await generateAudio({
          variables: {
            text: newItem.text,
            voice,
          },
        });
        setIsLoading(false);

        newItem.audio = new Audio(audioUrl.data.generateAudio);

        if (!isPlaying) {
          playNextSentence();
        }
      } catch (error) {
        console.error('Error generating audio:', error);
        throw error;
      }
    },
    [generateAudio, voice, isPlaying, playNextSentence],
  );

  return {
    addSentence,
    isPlaying,
    isLoading,
    pendingAudioCount: audioQueueRef.current.length,
    clearQueue: useCallback(() => {
      audioQueueRef.current = [];
      setIsPlaying(false);
      currentIndexRef.current = 0;
    }, []),
  };
};

export default useElevenLabsAudio;
