import { ElevenLabsClient } from "elevenlabs";
import { useCallback, useEffect, useState, useRef } from "react";

const ELEVENLABS_VOICEID = 'eVItLK1UvXctxuaRV2Oq';
const modelId = 'eleven_multilingual_v2';

export const useElevenLabsAudio = (apiKey: string) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [transcript, setTranscript] = useState('');
    const audioPromiseQueueRef = useRef<Promise<HTMLAudioElement>[]>([]);
    const clientRef = useRef<ElevenLabsClient | null>(null);

    useEffect(() => {
        clientRef.current = new ElevenLabsClient({
            apiKey: apiKey,
        });
    }, [apiKey]);

    const generateAndPushAudio = useCallback((text: string) => {
        const audioPromise = new Promise<HTMLAudioElement>(async (resolve, reject) => {
            try {
                const audioStream = await clientRef.current!.generate({
                    stream: true,
                    text,
                    model_id: modelId,
                    voice: ELEVENLABS_VOICEID,
                });

                const chunks: Buffer[] = [];
                for await (const chunk of audioStream) {
                    chunks.push(chunk);
                }

                const content = Buffer.concat(chunks);
                const audio = new Audio(URL.createObjectURL(new Blob([content])));
                resolve(audio);
            } catch (error) {
                console.error('Error generating audio:', error);
                reject(error);
            }
        });

        audioPromiseQueueRef.current.push(audioPromise);
    }, []);

    const playNextSentence = useCallback(async () => {
        console.log('Playing next sentence');
        console.log('Audio promise queue length:', audioPromiseQueueRef.current.length);
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
        console.log('Adding chunk:', text);
        setTranscript((prev) => prev + text);
    }, []);

    useEffect(() => {
        console.log('Transcript:', transcript);
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