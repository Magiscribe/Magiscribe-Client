import { useCallback, useRef, useState } from 'react';

export const useTranscribe = () => {
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcript, setTranscript] = useState('');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  const startTranscribing = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.error('Speech recognition is not supported in this browser.');
      return;
    }

    recognitionRef.current = new SpeechRecognition();
    const recognition = recognitionRef.current;

    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.continuous = true;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      const result = event.results[event.results.length - 1];
      if (result.isFinal) {
        const newTranscript = result[0].transcript;
        setTranscript(() => newTranscript);
      }
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      setIsTranscribing(false);
    };

    recognition.onend = () => {
      if (isTranscribing) {
        recognition.start();
      }
    };

    setTranscript('');
    setIsTranscribing(true);
    recognition.start();
  }, [isTranscribing]);

  const stopTranscribing = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsTranscribing(false);
  }, []);

  const handleTranscribe = useCallback(() => {
    if (isTranscribing) {
      stopTranscribing();
    } else {
      startTranscribing();
    }
  }, [isTranscribing, startTranscribing, stopTranscribing]);

  return {
    isTranscribing,
    transcript,
    startTranscribing,
    stopTranscribing,
    handleTranscribe,
  };
};
