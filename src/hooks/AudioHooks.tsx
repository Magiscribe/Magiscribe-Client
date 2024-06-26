import { useMutation } from '@apollo/client';
import { StartStreamTranscriptionCommand, TranscribeStreamingClient } from '@aws-sdk/client-transcribe-streaming';
import { Buffer } from 'buffer';
import MicrophoneStream from 'microphone-stream';
import { useCallback, useState } from 'react';
import { GENERATE_TRANSCRIPTION_CREDENTIALS } from '../clients/mutations';

const SAMPLE_RATE = 44100;

export const useTranscribe = () => {
  const [generateTranscriptionStreamingCredentials] = useMutation(GENERATE_TRANSCRIPTION_CREDENTIALS);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcript, setTranscript] = useState('');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let microphoneStream: any = undefined;
  let transcribeClient: TranscribeStreamingClient | undefined = undefined;

  const createMicrophoneStream = async () => {
    microphoneStream = new MicrophoneStream();
    microphoneStream.setStream(
      await window.navigator.mediaDevices.getUserMedia({
        video: false,
        audio: true,
      }),
    );
  };

  const createTranscribeClient = async () => {
    const result = await generateTranscriptionStreamingCredentials();

    const { accessKeyId, secretAccessKey, sessionToken } = result.data.generateTranscriptionStreamingCredentials;

    transcribeClient = new TranscribeStreamingClient({
      region: 'us-east-1',
      credentials: {
        accessKeyId,
        secretAccessKey,
        sessionToken,
      },
    });
  };

  const encodePCMChunk = (chunk: Buffer) => {
    const input = MicrophoneStream.toRaw(chunk);
    let offset = 0;
    const buffer = new ArrayBuffer(input.length * 2);
    const view = new DataView(buffer);
    for (let i = 0; i < input.length; i++, offset += 2) {
      const s = Math.max(-1, Math.min(1, input[i]));
      view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    }
    return Buffer.from(buffer);
  };

  const getAudioStream = async function* () {
    for await (const chunk of microphoneStream) {
      if (chunk.length <= SAMPLE_RATE) {
        yield {
          AudioEvent: {
            AudioChunk: encodePCMChunk(chunk),
          },
        };
      }
    }
  };

  const startStreaming = async () => {
    if (!transcribeClient) {
      return;
    }

    const command = new StartStreamTranscriptionCommand({
      LanguageCode: 'en-US',
      MediaEncoding: 'pcm',
      MediaSampleRateHertz: SAMPLE_RATE,
      AudioStream: getAudioStream(),
    });
    const data = await transcribeClient.send(command);

    if (!data.TranscriptResultStream) {
      return;
    }

    for await (const event of data.TranscriptResultStream) {
      const results = event.TranscriptEvent?.Transcript?.Results ?? [];
      if (results.length && !results[0]?.IsPartial && results[0]?.Alternatives) {
        const newTranscript = results[0].Alternatives[0].Transcript;
        if (newTranscript) {
          setTranscript(newTranscript);
        }
      }
    }
  };

  const stopTranscribing = useCallback(() => {
    if (microphoneStream) {
      microphoneStream.stop();
      microphoneStream.destroy();
      microphoneStream = undefined;
    }
    setIsTranscribing(false);
  }, []);

  const startTranscribing = useCallback(async () => {
    stopTranscribing();
    await createMicrophoneStream();
    createTranscribeClient();
    setIsTranscribing(true);
    startStreaming();
  }, [stopTranscribing]);

  return {
    isTranscribing,
    transcript,
    startTranscribing,
    stopTranscribing,
  };
};
