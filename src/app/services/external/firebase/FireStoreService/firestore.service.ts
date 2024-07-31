// src/app/services/firestore.service.ts
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

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

  // Update a document
  updateDocument(collection: string, docId: string, data: any): Promise<void> {
    return this.firestore.collection(collection).doc(docId).update(data);
  }

  // Delete a document
  deleteDocument(collection: string, docId: string): Promise<void> {
    return this.firestore.collection(collection).doc(docId).delete();
  }
}
