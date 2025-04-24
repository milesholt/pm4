import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { CoreService } from '../../../services/core.service';

@Component({
  selector: 'app-library-comp',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.scss'],
  providers: [CoreService],
})
export class LibraryComponent implements OnInit {
  @Input() params: any = [];
  @Input() data: any = [];

  @Output() callback = new EventEmitter<any>();

  files: any[] = [];
  breadcrumbs: any[] = [];
  currentPath = '';
  isGridView = true;
  loading = false;

  constructor(
    public service: CoreService,
    public navCtrl: NavController,
    public router: Router
  ) {}

  ngOnInit() {
    this.currentPath = this.params.rootPath || '';
    this.updateBreadcrumbs();
    this.loadFiles();
  }

  /*updateBreadcrumbs() {
    this.breadcrumbs = this.currentPath.split('/').filter(Boolean);
  }*/

  updateBreadcrumbs() {
    const root = this.params.rootPath?.replace(/^\/|\/$/g, '') || '';
    const current = this.currentPath.replace(/^\/|\/$/g, '');

    const relativePath = current.replace(root, '').replace(/^\/+/, '');
    const parts = relativePath ? relativePath.split('/') : [];

    this.breadcrumbs = [{ name: root.split('/').pop() || 'root', path: root }];

    let path = root;
    for (const part of parts) {
      path += `/${part}`;
      this.breadcrumbs.push({ name: part, path });
    }
  }

  async breadcrumbClick(index: number) {
    this.currentPath = this.breadcrumbs[index].path + '/';
    this.updateBreadcrumbs();
    await this.loadFiles();
  }

  async navigateToFolder(folder: any) {
    this.currentPath = `${this.currentPath}${folder.name}/`;
    this.updateBreadcrumbs();
    await this.loadFiles();
  }

  async loadFiles() {
    this.loading = true;
    try {
      this.files = await this.service.firebase.listFilesAndFolders(
        this.currentPath
      );
      this.files = this.files.filter((item) => !item.name.startsWith('.'));
    } catch (error) {
      console.error(error);
    }
    this.loading = false;
  }

  async uploadFile(event: any) {
    const file = event.target.files[0];
    if (file) {
      await this.service.firebase.uploadFile(this.currentPath, file);
      await this.loadFiles();
    }
  }

  async createFolder() {
    const folderName = prompt('Enter folder name:');
    if (!folderName) return;
    await this.service.firebase.createFolder(this.currentPath, folderName);
    await this.loadFiles();
  }

  async rename(item: any) {
    const newName = prompt('Enter new name:', item.name);
    if (!newName || newName === item.name) return;
    await this.service.firebase.renameFile(
      this.currentPath,
      item.name,
      newName
    );
    await this.loadFiles();
  }

  async delete(item: any) {
    const confirmDelete = confirm(
      `Are you sure you want to delete "${item.name}"?`
    );
    if (!confirmDelete) return;
    await this.service.firebase.delete(
      this.currentPath,
      item.name,
      item.isFolder
    );
    await this.loadFiles();
  }

  toggleView() {
    this.isGridView = !this.isGridView;
  }

  async selectFile(file: any) {
    this.callback.emit(file);
    const isModal = await this.service.modal.isModal();
    if (isModal === true) this.service.modal.dismissTop(file);
  }

  allowDrop(event: DragEvent) {
    event.preventDefault();
  }

  async handleDrop(event: DragEvent) {
    event.preventDefault();
    const file = event.dataTransfer?.files[0];
    if (file) {
      await this.service.firebase.uploadFile(this.currentPath, file);
      await this.loadFiles();
    }
  }
}
