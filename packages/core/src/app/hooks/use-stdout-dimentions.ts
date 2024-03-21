import { useEffect, useState } from 'react';
import { useStdout } from 'ink';
import { useOnce } from './use-once';

export function useStdoutDimensions(onChange?: (dimentions: [number, number]) => void): [number, number] {
  const { stdout } = useStdout();
  const [dimensions, setDimensions] = useState<[number, number]>([stdout.columns, stdout.rows]);

  useOnce(() => {
    if (onChange) {
      onChange([stdout.columns, stdout.rows]);
    }
  })

  useEffect(() => {
    const handler = () => {
      setDimensions([stdout.columns, stdout.rows])
      if (onChange) {
        onChange([stdout.columns, stdout.rows]);
      }
    };
    stdout.on('resize', handler);
    return () => {
      stdout.off('resize', handler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stdout]);

  return dimensions;
}
