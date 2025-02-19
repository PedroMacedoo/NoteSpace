import { HttpCommunication } from '@services/communication/http/httpCommunication';
import { ResourceInputModel, ResourceType, Resource } from '@notespace/shared/src/workspace/types/resource';

function resourceService(http: HttpCommunication, wid: string) {
  async function getResource(id: string): Promise<Resource> {
    return await http.get(`/workspaces/${wid}/${id}`);
  }

  async function createResource(name: string, type: ResourceType, parent?: string): Promise<string> {
    const resource: ResourceInputModel = { name, type, parent: parent || wid };
    const { id } = await http.post(`/workspaces/${wid}`, resource);
    return id;
  }

  async function deleteResource(id: string): Promise<void> {
    await http.delete(`/workspaces/${wid}/${id}`);
  }

  async function updateResource(id: string, newProps: Partial<ResourceInputModel>): Promise<void> {
    await http.put(`/workspaces/${wid}/${id}`, newProps);
  }

  return {
    getResource,
    createResource,
    deleteResource,
    updateResource,
  };
}

export default resourceService;
