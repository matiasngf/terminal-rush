/**
 * This code is a fork from asciify-image, rewritten in TypeScript.
 * https://github.com/ajay-gandhi/asciify-image/blob/master/index.js
 */

/* eslint-disable @typescript-eslint/ban-types */
'use strict';

import Jimp from 'jimp';
import Couleurs from 'couleurs';

// Set of basic characters ordered by increasing "darkness"
// Used as pixels in the ASCII image
// const chars = '░░░░░▒▒▒▒▓▓▓▓▓▓▓';

const lowerBlock = '▄';

// const num_c = chars.length - 1;

export interface AsciifyOptions {
  width?: string | number;
  height?: string | number;
  fit?: 'cover' | 'original' | 'width' | 'height' | 'box' | 'none';
  format?: 'string' | 'array';
}

interface NewDims {
  width: number;
  height: number;
}

export function asciify(path: string | Buffer, second: AsciifyOptions | Function, third?: Function) {
  let opts: AsciifyOptions = {};
  let callback: Function | undefined;

  if (typeof second === 'object') {
    opts = second;
    if (typeof third === 'function') {
      callback = third;
    }
  } else if (typeof second === 'function') {
    callback = second;
  }

  // If no callback is specified, prepare a promise to return ...
  if (!callback) {
    return new Promise((resolve, reject) => {
      asciify_core(path, opts, function (err: any, success: any) {
        if (err) return reject(err);
        if (success) return resolve(success);
      });
    });
  }

  // ... else proceed as usual
  asciify_core(path, opts, callback || console.log);
}


const asciify_core = (path: string | Buffer, opts: AsciifyOptions, callback: Function) => {
  // First open image to get initial properties
  Jimp.read(path as string, function (err, image) {
    if (err) return callback('Error loading image: ' + err);

    // Handle options
    const options = {
      fit: opts.fit || 'original',
      width: opts.width ? parseInt(opts.width.toString(), 10) : image.bitmap.width,
      height: opts.height ? parseInt(opts.height.toString(), 10) : image.bitmap.height,
      as_string: opts.format !== 'array',
    };

    const new_dims = calculate_dims(image, options);

    // Resize to requested dimensions
    image.resize(new_dims.width, new_dims.height);

    // Ensure crop dimensions don't exceed the image's resized dimensions
    const cropWidth = Math.min(options.width, image.bitmap.width);
    const cropHeight = Math.min(options.height, image.bitmap.height);

    // Calculate the cropping start points
    const cropX = Math.max(0, (image.bitmap.width - cropWidth) / 2);
    const cropY = Math.max(0, (image.bitmap.height - cropHeight) / 2);

    // Perform the crop
    image.crop(cropX, cropY, cropWidth, cropHeight);

    let ascii = options.as_string ? '' : [];

    // Get and convert pixels
    for (let j = 0; j < image.bitmap.height / 2; j++) {
      if (!options.as_string) (ascii as string[]).push([] as unknown as string);

      for (let i = 0; i < image.bitmap.width; i++) {

        const upperPixelPos = [i, j * 2] as const;
        const lowerPixelPos = [i, j * 2 + 1] as const;

        let nextChar = lowerBlock;

        const clrUpper = Jimp.intToRGBA(image.getPixelColor(...upperPixelPos));
        const clrLower = Jimp.intToRGBA(image.getPixelColor(...lowerPixelPos));

        nextChar = Couleurs.bg(nextChar, clrUpper.r, clrUpper.g, clrUpper.b);
        nextChar = Couleurs.fg(nextChar, clrLower.r, clrLower.g, clrLower.b);

        if (options.as_string) ascii += nextChar;
        else ascii[j].push(nextChar);
      }

      if (options.as_string && j != image.bitmap.height - 1) ascii += '\n';
    }

    if (!options.as_string && Array.isArray(ascii) && Array.isArray(ascii[0])) {
      // Join each row's characters without commas
      ascii = ascii.map(row => row.join(''));
    }

    callback(null, ascii);
  });
};

const calculate_dims = (img: Jimp, opts: AsciifyOptions): NewDims => {
  let w_ratio, h_ratio, neww, newh;

  switch (opts.fit) {
    case 'width':
      return { width: opts.width as number, height: img.bitmap.height * ((opts.width as number) / img.bitmap.width) };
    case 'height':
      return { width: img.bitmap.width * ((opts.height as number) / img.bitmap.height), height: opts.height as number };
    case 'none':
      return { width: opts.width as number, height: opts.height as number };
    case 'box':
      w_ratio = img.bitmap.width / (opts.width as number);
      h_ratio = img.bitmap.height / (opts.height as number);

      if (w_ratio > h_ratio) {
        newh = Math.round(img.bitmap.height / w_ratio);
        neww = opts.width as number;
      } else {
        neww = Math.round(img.bitmap.width / h_ratio);
        newh = opts.height as number;
      }
      return { width: neww, height: newh };

    case 'cover':
      w_ratio = (opts.width as number) / img.bitmap.width;
      h_ratio = (opts.height as number) / img.bitmap.height;

      const coverRatio = Math.max(w_ratio, h_ratio);

      return {
        // width: img.bitmap.width * coverRatio * opts.c_ratio,
        width: img.bitmap.width * coverRatio,
        height: img.bitmap.height * coverRatio,
      };
    case 'original':
    default:
      return { width: img.bitmap.width, height: img.bitmap.height };
  }
};

// const intensity = (i: Jimp, x: number, y: number): number => {
//   const color = Jimp.intToRGBA(i.getPixelColor(x, y));
//   // Approximate luminance, skipping gamma correction for simplicity
//   const luminance = 0.2126 * color.r + 0.7152 * color.g + 0.0722 * color.b;
//   return luminance;
// };
