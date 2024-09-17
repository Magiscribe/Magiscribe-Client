import { useMutation } from '@apollo/client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { GENERATE_AUDIO } from '../clients/mutations';

export const useElevenLabsAudio = (voice: string) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [generateAudio] = useMutation(GENERATE_AUDIO);
  const audioPromiseQueueRef = useRef<Promise<HTMLAudioElement>[]>([]);

  const generateAndPushAudio = useCallback((text: string) => {
    const audioPromise = new Promise<HTMLAudioElement>((resolve, reject) => {
      (async () => {
        try {
          const audioUrl = await generateAudio({
            variables: {
              text,
              voice,
            },
          });
          const audio = new Audio(audioUrl.data.generateAudio);
          resolve(audio);
        } catch (error) {
          console.error('Error generating audio:', error);
          reject(error);
        }
      })();
    });

    audioPromiseQueueRef.current.push(audioPromise);
  }, []);

  const playNextSentence = useCallback(async () => {
    if (audioPromiseQueueRef.current.length === 0) {
      setIsPlaying(false);
      return;
    }

    setIsPlaying(true);

    try {
      const audioPromise = audioPromiseQueueRef.current[0];
      audioPromiseQueueRef.current = audioPromiseQueueRef.current.slice(1);

      const audio = await audioPromise;
      audio.onended = () => {
        setIsPlaying(false);
        playNextSentence();
      };
      await audio.play();
    } catch (error) {
      console.error('Error playing audio:', error);
      setIsPlaying(false);
      playNextSentence();
    }
  }, []);

  const addChunk = useCallback((text: string) => {
    setTranscript((prev) => prev + text);
  }, []);

  useEffect(() => {
    const sentenceRegex = /(.*?[.!?])\s*/;
    const match = transcript.match(sentenceRegex);

    if (match) {
      const [fullMatch, sentence] = match;
      generateAndPushAudio(sentence.trim());
      setTranscript((prev) => prev.replace(fullMatch, ''));
      if (!isPlaying) {
        playNextSentence();
      }
    }
  }, [transcript, isPlaying, playNextSentence, generateAndPushAudio]);

  return { addChunk };
};

export default useElevenLabsAudio;
