// src/app/services/firestore.service.ts
import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  DocumentReference,
} from '@angular/fire/compat/firestore';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { DocumentData } from '@angular/fire/compat/firestore/interfaces';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  constructor(private firestore: AngularFirestore) {}

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
  deleteDocument(collection: string, docId: string): Promise<void> {
    return this.firestore.collection(collection).doc(docId).delete();
  }

  /* New dynamic functions with subcollection data passed */

  // Generic method to get a document by ID
  getDocumentById(pathSegments: any[], documentId: string): Observable<any> {
    const docRef = this.buildDocumentReference(pathSegments, documentId);
    return docRef.snapshotChanges().pipe(
      map((action) => {
        const data: any = action.payload.data();
        const id = action.payload.id;
        return { id, ...data };
      })
    );
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
      // Create document with an automatically generated ID
      return collectionRef.add(documentData);
    }
  }

  // Generic method to get documents from a collection
  getDocuments(pathSegments: any[]): Observable<any[]> {
    const collectionRef = this.buildCollectionReference(pathSegments);
    return collectionRef.snapshotChanges().pipe(
      map((actions) =>
        actions.map((a) => {
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
}
