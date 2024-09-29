import pica from 'pica';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PicaService {
  // Function to compress and resize an image
  async compressAndResizeImage(
    file: File,
    targetWidths: number[],
    maxSizeKB = 300
  ): Promise<{ [key: number]: Blob }> {
    const image = new Image();
    const reader = new FileReader();

    return new Promise((resolve, reject) => {
      reader.onload = (e: any) => {
        image.src = e.target.result;
      };

      reader.onerror = (err) => {
        reject(err);
      };

      reader.readAsDataURL(file);

      image.onload = async () => {
        const compressedImages: { [key: number]: Blob } = {};

        for (const width of targetWidths) {
          const compressedImage = await this.resizeAndCompress(
            image,
            width,
            maxSizeKB
          );
          compressedImages[width] = compressedImage;
        }

        resolve(compressedImages);
      };

      image.onerror = (err) => {
        reject(err);
      };
    });
  }

  // Helper function to resize and compress the image
  /*async resizeAndCompress(
    image: HTMLImageElement,
    width: number,
    maxSizeKB: number
  ): Promise<Blob> {
    const canvas = document.createElement('canvas');
    const aspectRatio = image.width / image.height;
    const height = width / aspectRatio;
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(image, 0, 0, width, height);
    }

    let quality = 0.9; // Start with high quality
    let compressedBlob = await this.canvasToBlob(canvas, quality);
    while (compressedBlob.size > maxSizeKB * 1024 && quality > 0.1) {
      quality -= 0.05;
      compressedBlob = await this.canvasToBlob(canvas, quality);
    }

    let webPBlob = compressedBlob;

    if (compressedBlob) {
      webPBlob = new Blob([await compressedBlob.arrayBuffer()], {
        type: 'image/webp',
      });
    }

    return webPBlob;

    //return compreBlob;
  }*/

  // Function to convert canvas to Blob with given quality
  /*canvasToBlob(canvas: HTMLCanvasElement, quality: number): Promise<Blob> {
    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          resolve(blob as Blob);
        },
        'image/jpeg',
        quality
      );
    });
  }*/

  async resizeAndCompress(
    image: HTMLImageElement,
    width: number,
    maxSizeKB: number
  ): Promise<Blob> {
    const canvas = document.createElement('canvas');
    const aspectRatio = image.width / image.height;
    const height = width / aspectRatio;
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(image, 0, 0, width, height);
    }

    let quality = 0.9; // Start with high quality
    let compressedBlob = await this.canvasToBlob(canvas, quality, 'image/webp');

    // Reduce quality until the file size is within the desired limit
    while (compressedBlob.size > maxSizeKB * 1024 && quality > 0.1) {
      quality -= 0.05;
      compressedBlob = await this.canvasToBlob(canvas, quality, 'image/webp');
    }

    return compressedBlob;
  }

  // Same canvasToBlob function as above
  canvasToBlob(
    canvas: HTMLCanvasElement,
    quality: number,
    mimeType: string
  ): Promise<Blob> {
    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          resolve(blob as Blob);
        },
        mimeType,
        quality
      );
    });
  }

  async resizeAndConvertToWebP(
    image: HTMLImageElement,
    width: number,
    maxSizeKB: number
  ): Promise<Blob> {
    const canvas = document.createElement('canvas')!;
    const ctx = canvas.getContext('2d')!;

    // Set canvas dimensions
    const aspectRatio = image.height / image.width;
    const height = Math.round(width * aspectRatio);
    canvas.width = width;
    canvas.height = height;

    // Clear the canvas to preserve alpha transparency
    ctx.clearRect(0, 0, width, height);

    // Draw the image on the canvas
    ctx.drawImage(image, 0, 0, width, height);

    let blob: Blob | null = null;
    //let quality = 0.4; // Set initial quality for WebP image

    let quality = 0.8; // Start with a relatively high quality
    const step = 0.05; // Quality reduction step

    // Loop to ensure the size is under maxSizeKB
    do {
      const dataURL = canvas.toDataURL('image/webp', quality.toFixed(2));
      blob = await this.dataURLToBlob(dataURL);

      // Adjust quality if blob size is greater than maxSizeKB
      if (blob.size / 1024 > maxSizeKB) {
        quality = Math.max(0, quality - step); // Prevent negative quality
      }
    } while (blob.size / 1024 > maxSizeKB && quality > 0);
    // Set correct type for the Blob
    if (blob) {
      const webPBlob = new Blob([await blob.arrayBuffer()], {
        type: 'image/webp',
      });
      return webPBlob;
    }

    throw new Error('Blob creation failed.');
  }

  /*async dataURLToBlob(dataURL: string): Promise<Blob> {
    const response = await fetch(dataURL);
    return await response.blob();
  }*/

  dataURLToBlob(dataURL: string): Promise<Blob> {
    return new Promise((resolve) => {
      const byteString = atob(dataURL.split(',')[1]);
      const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);

      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }

      resolve(new Blob([ab], { type: mimeString }));
    });
  }
}
