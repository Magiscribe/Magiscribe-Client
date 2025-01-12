import { useState, useRef, useCallback, useEffect } from 'react';

interface QueueItem<T> {
  item: T;
  resolve: (value: void | PromiseLike<void>) => void;
}

export const useQueue = <T extends object>(options: {
  processDelay?: (item: T) => number;
  defaultDelay?: number;
  maxDelay?: number;
  minDelay?: number;
  shouldProcessImmediately?: (item: T) => boolean;
  onProcess?: (item: T) => void | Promise<void>;
}) => {
  const {
    processDelay,
    defaultDelay = 500,
    maxDelay = 3000,
    minDelay = 0,
    shouldProcessImmediately = () => false,
    onProcess,
  } = options;

  const [items, setItems] = useState<T[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const queueRef = useRef<QueueItem<T>[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout>(null);
  const processingRef = useRef(false);

  const calculateDelay = useCallback(
    (item: T): number => {
      if (processDelay) {
        const delay = processDelay(item);
        return Math.min(Math.max(delay, minDelay), maxDelay);
      }
      return defaultDelay;
    },
    [processDelay, minDelay, maxDelay, defaultDelay],
  );

  const processQueue = useCallback(async () => {
    if (processingRef.current || queueRef.current.length === 0) {
      setIsProcessing(false);
      return;
    }

    processingRef.current = true;
    setIsProcessing(true);

    const { item, resolve } = queueRef.current[0];
    const delay = calculateDelay(item);

    try {
      await new Promise((resolve) => {
        timeoutRef.current = setTimeout(resolve, delay);
      });

      if (onProcess) {
        await onProcess(item);
      }

      setItems((prev) => [...prev, item]);
      queueRef.current.shift();
      resolve();

      processingRef.current = false;
      processQueue();
    } catch (error) {
      console.error('Error processing queue item:', error);
      processingRef.current = false;
      setIsProcessing(false);
    }
  }, [calculateDelay, onProcess]);

  const addItem = useCallback(
    (item: Omit<T, 'id'>) => {
      const newItem = {
        ...item,
        id: Math.random().toString(36).substring(7),
      } as T;

      if (shouldProcessImmediately(newItem)) {
        setItems((prev) => [...prev, newItem]);
        return Promise.resolve();
      }

      return new Promise<void>((resolve) => {
        queueRef.current.push({ item: newItem, resolve });

        // Debounce the queue processing
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
          if (!processingRef.current) {
            processQueue();
          }
        }, 50); // Small delay to batch multiple rapid additions
      });
    },
    [shouldProcessImmediately, processQueue],
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    items,
    addItem,
    isProcessing,
    queueSize: queueRef.current.length,
  };
};
