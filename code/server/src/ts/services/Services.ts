import { ResourcesService } from '@services/ResourcesService';
import { WorkspacesService } from '@services/WorkspacesService';
import { Databases } from '@databases/types';
import { DocumentsService } from '@services/DocumentsService';

export class Services {
  private readonly databases: Databases;

  readonly resources: ResourcesService;
  readonly workspaces: WorkspacesService;
  readonly documents: DocumentsService;

  constructor(databases: Databases) {
    this.databases = databases;
    this.resources = new ResourcesService(this.databases.resources, this.databases.documents);
    this.workspaces = new WorkspacesService(this.databases.workspaces, this.databases.documents);
    this.documents = new DocumentsService(this.databases.documents, this.databases.resources);
  }
}
