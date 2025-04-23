import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  DocumentReference,
} from '@angular/fire/compat/firestore';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';

import { DocumentData } from '@angular/fire/compat/firestore/interfaces';

import { finalize } from 'rxjs/operators'; // Import finalize for completion handling
import { firstValueFrom } from 'rxjs';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FirebaseStorageService {
  uploadPercent!: Observable<number | undefined>;
  downloadURL!: Observable<string>;

  constructor(private storage: AngularFireStorage) {}

  async listFilesAndFolders(path: string): Promise<any[]> {
    const ref = this.storage.storage.ref(path);
    const result = await ref.listAll();
    const folders = result.prefixes.map((folder) => ({
      name: folder.name,
      isFolder: true,
    }));
    const files = await Promise.all(
      result.items.map(async (item) => ({
        name: item.name,
        isFolder: false,
        url: await item.getDownloadURL(),
        metadata: await item.getMetadata(),
      }))
    );
    return [...folders, ...files];
  }

  async uploadFile(path: string, file: File): Promise<void> {
    const filePath = `${path}${file.name}`;
    const ref = this.storage.ref(filePath);
    const uploadTask = this.storage.upload(filePath, file);

    // Wait for the upload to complete
    await lastValueFrom(uploadTask.snapshotChanges());

    // Then get the download URL
    return lastValueFrom(ref.getDownloadURL());
  }

  /*async uploadFile(blob: Blob, path: string, fileName: string): Promise<string> {
    const filePath = `${path}/${fileName}`;
    const fileRef = this.storage.ref(filePath);
    const uploadTask = this.storage.upload(filePath, blob, { contentType: blob.type });
  
    // Wait for the upload to complete
    await lastValueFrom(uploadTask.snapshotChanges());
  
    // Then get the download URL
    return lastValueFrom(fileRef.getDownloadURL());
  }*/

  async createFolder(path: string, folderName: string): Promise<void> {
    const folderPath = `${path}/${folderName}/.placeholder`;
    const blob = new Blob([''], { type: 'text/plain' }); // Empty placeholder file
    const fileRef = this.storage.ref(folderPath);
    const uploadTask = this.storage.upload(folderPath, blob);

    await lastValueFrom(uploadTask.snapshotChanges());
  }

  async delete(path: string, name: string, isFolder: boolean): Promise<void> {
    if (isFolder) {
      const folderRef = this.storage.storage.ref(`${path}${name}/`);
      const contents = await folderRef.listAll();
      await Promise.all(contents.items.map((item) => item.delete()));
    } else {
      const fileRef = this.storage.ref(`${path}${name}`);
      await fileRef.delete().toPromise();
    }
  }

  async rename(path: string, oldName: string, newName: string): Promise<void> {
    const oldRef = this.storage.ref(`${path}${oldName}`);
    const oldUrl = await oldRef.getDownloadURL().toPromise();
    const response = await fetch(oldUrl);
    const blob = await response.blob();
    await this.uploadFile(path, new File([blob], newName, { type: blob.type }));
    await oldRef.delete().toPromise();
  }

  async renameFile(
    oldPath: string,
    oldName: string,
    newName: string
  ): Promise<boolean> {
    try {
      // Construct the full paths using string concatenation.
      // Make sure oldPath has a trailing slash.
      const oldFullPath = `${oldPath}${oldName}`;
      const newFullPath = `${oldPath}${newName}`;

      // Reference to the old file.
      const fileRef = this.storage.ref(oldFullPath);

      // Get the original file as a Blob.
      const url = await lastValueFrom(fileRef.getDownloadURL());
      const response = await fetch(url);
      const blob = await response.blob();

      // Upload the blob to the new path.
      // Here, we use uploadFile() with the base path (oldPath) and a new File object
      // which will be stored at `oldPath + newName`
      await this.uploadFile(
        oldPath,
        new File([blob], newName, { type: blob.type })
      );

      // Delete the old file.
      await lastValueFrom(fileRef.delete());

      return true;
    } catch (error) {
      console.error('Rename failed:', error);
      throw new Error('Rename failed');
    }
  }
}
