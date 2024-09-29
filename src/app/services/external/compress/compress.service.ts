import { Injectable } from '@angular/core';
import { Image as ImageJs } from 'image-js';

@Injectable({
  providedIn: 'root',
})
export class CompressService {
  constructor() {}

  // Compress and resize the image
  async compressAndResizeImage(
    file: File,
    targetWidths: number[]
  ): Promise<{ width: number; compressedBlob: Blob }[]> {
    const arrayBuffer = await this.fileToArrayBuffer(file); // Convert File to ArrayBuffer

    const promises = targetWidths.map((width) =>
      this.resizeAndConvertToWebP(arrayBuffer, width)
    );
    return Promise.all(promises);
  }

  // Convert File to ArrayBuffer for image-js processing
  private fileToArrayBuffer(file: File): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        resolve(reader.result as ArrayBuffer);
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsArrayBuffer(file); // Read file as ArrayBuffer
    });
  }

  // Resize and convert to WebP format using image-js
  private async resizeAndConvertToWebP(
    arrayBuffer: ArrayBuffer,
    width: number
  ): Promise<{ width: number; compressedBlob: Blob }> {
    try {
      // Load the image from ArrayBuffer using image-js
      const img = await ImageJs.load(arrayBuffer);

      const originalWidth = img.width;
      const originalHeight = img.height;
      const scale = width / originalWidth;

      // Resize the image
      const resized = img.resize({
        width,
        height: Math.round(originalHeight * scale),
      });

      let compressedBlob = new Blob();

      // Convert to WebP format with specified quality
      try {
        const webpBuffer = await resized.toBuffer({
          format: 'webp',
          quality: 0.8,
        } as any); // 80% quality

        compressedBlob = new Blob([webpBuffer], { type: 'image/webp' });
      } catch (e) {
        alert(e);
      }

      return { width, compressedBlob };
    } catch (error) {
      console.error('Error resizing and converting to WebP:', error);
      throw error;
    }
  }
}
