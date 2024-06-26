import { useState, useCallback } from 'react';
import MicrophoneStream from 'microphone-stream';
import { TranscribeStreamingClient, StartStreamTranscriptionCommand } from '@aws-sdk/client-transcribe-streaming';
import { Buffer } from 'buffer';
import { GET_TRANSCRIPTION_CREDENTIALS } from '../clients/queries';
import { useQuery } from '@apollo/client';

const SAMPLE_RATE = 44100;

export const useTranscribe = () => {
  const { data: transcribeCredentials } = useQuery(GET_TRANSCRIPTION_CREDENTIALS);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcript, setTranscript] = useState('');

  let microphoneStream: any = undefined;
  let transcribeClient: any = undefined;

  const createMicrophoneStream = async () => {
    microphoneStream = new MicrophoneStream();
    microphoneStream.setStream(
      await window.navigator.mediaDevices.getUserMedia({
        video: false,
        audio: true,
      })
    );
  };

  const createTranscribeClient = () => {
    transcribeClient = new TranscribeStreamingClient({
      region: 'us-east-1',
      credentials: {
        accessKeyId: transcribeCredentials.generateTranscriptionCredentials.accessKeyId,
        secretAccessKey: transcribeCredentials.generateTranscriptionCredentials.secretAccessKey,
        sessionToken: transcribeCredentials.generateTranscriptionCredentials.sessionToken
      },
    });
  }

  const encodePCMChunk = (chunk: any) => {
    const input = MicrophoneStream.toRaw(chunk);
    let offset = 0;
    const buffer = new ArrayBuffer(input.length * 2);
    const view = new DataView(buffer);
    for (let i = 0; i < input.length; i++, offset += 2) {
      let s = Math.max(-1, Math.min(1, input[i]));
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
    const command = new StartStreamTranscriptionCommand({
      LanguageCode: 'en-US',
      MediaEncoding: "pcm",
      MediaSampleRateHertz: SAMPLE_RATE,
      AudioStream: getAudioStream(),
    });
    const data = await transcribeClient.send(command);
    for await (const event of data.TranscriptResultStream) {
      const results = event.TranscriptEvent.Transcript.Results;
      if (results.length && !results[0]?.IsPartial) {
        const newTranscript = results[0].Alternatives[0].Transcript;
        console.log(newTranscript);
        setTranscript(newTranscript);
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
    stopTranscribing
  };
};