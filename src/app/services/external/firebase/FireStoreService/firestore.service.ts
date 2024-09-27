// src/app/services/firestore.service.ts
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

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  uploadPercent!: Observable<number | undefined>;
  downloadURL!: Observable<string>;

  constructor(
    private firestore: AngularFirestore,
    private storage: AngularFireStorage
  ) {}

  // Create a new document
  createDocumentOff(collection: string, data: any): Promise<any> {
    return this.firestore.collection(collection).add(data);
  }

  // Read documents from a collection
  getDocumentsOff(collection: string): Observable<any[]> {
    return this.firestore.collection(collection).valueChanges();
  }

  getDocumentsOff2(collection: string): Observable<any[]> {
    return this.firestore
      .collection(collection)
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data: any = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data }; // Combine the ID and the data
          })
        ),
        catchError((error) => {
          console.error('Error getting documents: ', error);
          return throwError(
            () => new Error('Error getting documents, please try again later.')
          );
        })
      );
  }

  // Get documents from a collection as a Promise
  getDocumentsPromiseOff(collection: string): Promise<any[]> {
    const collectionRef: AngularFirestoreCollection<DocumentData> =
      this.firestore.collection(collection);
    return collectionRef
      .get()
      .toPromise()
      .then((snapshot: any) => {
        return snapshot.docs.map((doc: any) => ({
          id: doc.id,
          ...doc.data(),
        }));
      })
      .catch((error) => {
        console.error('Error getting documents: ', error);
        throw new Error('Error getting documents, please try again later.');
      });
  }

  getDocumentByIdOff(collection: string, docId: string): Observable<any> {
    return this.firestore
      .collection(collection)
      .doc(docId)
      .snapshotChanges()
      .pipe(
        map((action) => {
          if (!action.payload.exists) {
            return null;
          } else {
            const data: any = action.payload.data();
            const id = action.payload.id;
            return { id, ...data }; // Combine the ID and the data
          }
        }),
        catchError((error) => {
          console.error('Error getting document: ', error);
          return throwError(
            () => new Error('Error getting document, please try again later.')
          );
        })
      );
  }

  // Update a document
  updateDocumentOff(
    collection: string,
    docId: string,
    data: any
  ): Promise<void> {
    return this.firestore.collection(collection).doc(docId).update(data);
  }

  // Delete a document
  deleteDocumentOff(collection: string, docId: string): Promise<void> {
    return this.firestore.collection(collection).doc(docId).delete();
  }

  /* New dynamic functions with subcollection data passed */

  deleteDocument(pathSegments: any[], documentId: string): Promise<void> {
    //return this.firestore.collection(collection).doc(docId).delete();
    try {
      const docRef = this.buildDocumentReference(pathSegments, documentId);
      return docRef.delete().catch((error: any) => {
        console.error('Error deleting document: ', error);
        throw new Error('Error deleting document, please try again later.');
      });
    } catch (e) {
      console.log(e);
      throw new Error('Could not delete document');
    }
  }

  // Generic method to get a document by ID
  getDocumentById(pathSegments: any[], documentId: string): Observable<any> {
    try {
      const docRef = this.buildDocumentReference(pathSegments, documentId);
      return docRef.snapshotChanges().pipe(
        map((action) => {
          if (!action.payload.exists) {
            throw new Error('Document not found');
          }
          const data: any = action.payload.data();
          const id = action.payload.id;
          return { id, ...data };
        })
      );
    } catch (error: any) {
      console.error('Error in getDocumentById:', error.message);
      throw error;
    }
  }

  // Generic method to create a document
  createDocument(
    pathSegments: any[],
    documentData: any,
    documentId: any = false
  ): Promise<DocumentReference<any>> {
    const collectionRef = this.buildCollectionReference(pathSegments);

    if (documentId) {
      // Create document with a specific ID
      const docRef = collectionRef.doc(documentId);
      return docRef.set(documentData).then(() => docRef.ref);
    } else {
      // Create document with an automatically ge // If no document ID is provided, let Firestore generate one automatically
      return collectionRef
        .add(documentData)
        .then((docRef: DocumentReference<any>) => docRef)
        .catch((error) => {
          console.error('Error creating document: ', error);
          throw new Error('Error creating document, please try again later.');
        });
    }
  }

  // Generic method to get documents from a collection
  getDocuments(pathSegments: any[]): Observable<any[]> {
    const collectionRef = this.buildCollectionReference(pathSegments);
    return collectionRef.snapshotChanges().pipe(
      map((actions) =>
        actions
          .filter((a: any) => !a.payload.doc.data()['isPlaceholder']) // Filter out placeholders
          .map((a) => {
            const data: any = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data };
          })
      )
    );
  }

  getDocumentsPromise(pathSegments: any[]): Promise<any[]> {
    const collectionRef = this.buildCollectionReference(pathSegments);
    return collectionRef
      .get()
      .toPromise()
      .then((snapshot: any) => {
        return snapshot.docs
          .filter((doc: any) => !doc.data()['isPlaceholder']) // Filter out placeholders
          .map((doc: any) => ({
            id: doc.id,
            ...doc.data(),
          }));
      })
      .catch((error: any) => {
        console.error('Error getting documents: ');
        console.log(error);
        throw new Error('Error getting documents, please try again later.');
      });
  }

  // Generic method to update a document
  updateDocument(
    pathSegments: any[],
    documentId: string,
    documentData: any
  ): Promise<void> {
    const docRef = this.buildDocumentReference(pathSegments, documentId);
    return docRef.update(documentData); // Update the document with new data
  }

  // Helper method to build a collection reference dynamically
  private buildCollectionReference(pathSegments: any[]) {
    let collectionRef = this.firestore.collection(pathSegments[0]);
    for (let i = 1; i < pathSegments.length; i++) {
      collectionRef = collectionRef
        .doc(pathSegments[i])
        .collection(pathSegments[++i]);
    }
    return collectionRef;
  }

  // Helper method to build a document reference dynamically
  private buildDocumentReference(pathSegments: string[], documentId: string) {
    const collectionRef = this.buildCollectionReference(pathSegments);
    return collectionRef.doc(documentId);
  }

  uploadToStorage(
    blob: Blob,
    folderPath: string,
    fileName: string
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      // Define the full path in Firebase Storage (folderPath + fileName)
      const filePath = `${folderPath}/${fileName}`;
      const fileRef = this.storage.ref(filePath); // Reference to the file

      // Start the upload task
      const task = this.storage.upload(filePath, blob, {
        contentType: blob.type,
      });

      // Monitor the upload progress if needed (optional)
      this.uploadPercent = task.percentageChanges().pipe(
        map((percentage) => percentage ?? 0) // Fallback of 0 if undefined
      );

      // Handle the upload completion and resolve the download URL
      task
        .snapshotChanges()
        .pipe(
          finalize(() => {
            // Get the download URL once the upload is complete
            fileRef.getDownloadURL().subscribe({
              next: (url: string) => {
                resolve(url); // Resolve the URL promise
              },
              error: (err) => {
                reject(err); // Reject the promise in case of an error
              },
            });
          })
        )
        .subscribe();
    });
  }
}
