// src/app/services/firestore.service.ts
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
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
  createDocument(collection: string, data: any): Promise<any> {
    return this.firestore.collection(collection).add(data);
  }

  // Read documents from a collection
  getDocumentsOff(collection: string): Observable<any[]> {
    return this.firestore.collection(collection).valueChanges();
  }

  getDocuments(collection: string): Observable<any[]> {
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
  getDocumentsPromise(collection: string): Promise<any[]> {
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

  getDocumentById(collection: string, docId: string): Observable<any> {
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
  updateDocument(collection: string, docId: string, data: any): Promise<void> {
    return this.firestore.collection(collection).doc(docId).update(data);
  }

  // Delete a document
  deleteDocument(collection: string, docId: string): Promise<void> {
    return this.firestore.collection(collection).doc(docId).delete();
  }
}
