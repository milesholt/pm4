import { Component, OnInit } from '@angular/core';
import { CoreService } from '../../../services/core.service';
import { Library } from '../../../app.library';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [CoreService, Library],
})
export class DashboardComponent implements OnInit {
  message: string = '';
  sites: any = [];

  constructor(public service: CoreService, public router: Router) {}

  ngOnInit() {}

  signOut() {
    return this.service.auth.SignOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['login']);
    });
  }

  //Main site functionality

  createSite() {
    // Example: Add a document
    this.service.firestore
      .createDocument('collection-name', { name: 'New Document' })
      .then(() => {
        this.message = 'Site created';
      })
      .catch((e: any) => {
        this.message = e;
      });
  }

  getSites() {
    // Example: Fetch documents
    this.service.firestore.getDocuments('collection-name').subscribe(
      (data: any) => {
        this.message = JSON.stringify(data);
        this.sites = data;
      },
      (error) => {
        this.message = error.message;
        console.error('Error fetching documents: ', error);
      }
    );
  }

  deleteSite() {
    // Example usage of deleting a document
    const collectionName = 'collection-name';
    //const documentId = 'eLPOqsKWpPos5c0ezpFW'; // You need to have this ID
    const documentId = this.sites[0].id;

    this.service.firestore
      .deleteDocument(collectionName, documentId)
      .then(() => {
        this.message = 'Site deleted';
        console.log('Document deleted successfully!');
      })
      .catch((error) => {
        this.message = error;
        console.error('Error deleting document: ', error);
      });
  }

  updateSite() {
    // Example usage of updating a document
    const collectionName = 'collection-name';
    //const documentId = 'eLPOqsKWpPos5c0ezpFW'; // You need to have this ID
    const documentId = this.sites[0].id;

    const updatedData = { fieldName: 'new value' };

    this.service.firestore
      .updateDocument(collectionName, documentId, updatedData)
      .then(() => {
        this.message = 'Site updated';
        console.log('Document updated successfully!');
      })
      .catch((error) => {
        this.message = 'Site could not be updated';
        console.error('Error updating document: ', error);
      });
  }
}
