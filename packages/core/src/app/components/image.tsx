import { Text } from "ink";
import { useEffect, useState } from "react";
import { useIsMounted } from "@/app/hooks/use-is-mounted";
import { asciify } from "../lib/asciify";

export interface ImageProps {
  src: string | Buffer;
  fit?: FitType;
  width?: number;
  height?: number;
}

type FitType = "cover" | "width" | "height";

const getBuffer = (src: string | Buffer) => {
  if (typeof src === "string") {
    const srcNoData = src.replace(/^data:image\/\w+;base64,/, "");
    return Buffer.from(srcNoData, "base64");
  }
  return src;
};

export const Image = ({ src, fit = "cover", width, height }: ImageProps) => {
  const [imageData, setImageData] = useState("");
  const isMounted = useIsMounted();

  useEffect(() => {
    const buf = getBuffer(src);

    asciify(
      buf,
      {
        fit: "cover",
        width: width,
        height: height,
        format: "array",
      },
      (err, r: string[]) => {
        const rows = r;

        if (isMounted()) {
          if (err) {
            throw err;
          }

          setImageData(rows.join("\n"));
        }
      }
    );
  }, [src, fit, width, height, isMounted]);
  return <Text>{imageData}</Text>;
};

1;
