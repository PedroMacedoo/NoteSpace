import { Express } from 'express';
import request = require('supertest');
import { WorkspaceMeta } from '@notespace/shared/src/workspace/types/workspace';

export function workspaceRequests(app: Express) {
  async function createWorkspace(name: string, isPrivate: boolean = false): Promise<string> {
    const response = await request(app).post('/workspaces').send({ name, isPrivate });
    expect(response.status).toBe(201);
    return response.body.id;
  }

  async function getWorkspaces(): Promise<WorkspaceMeta[]> {
    const response = await request(app).get('/workspaces');
    expect(response.status).toBe(200);
    return response.body;
  }

  async function getWorkspace(id: string, metaOnly: boolean = false): Promise<WorkspaceMeta> {
    const response = await request(app).get(`/workspaces/${id}?metaOnly=${metaOnly}`);
    expect(response.status).toBe(200);
    return response.body;
  }

  async function updateWorkspace(id: string, name: string) {
    const response = await request(app).put(`/workspaces/${id}`).send({ name });
    expect(response.status).toBe(204);
  }

  async function deleteWorkspace(id: string) {
    const response = await request(app).delete(`/workspaces/${id}`);
    expect(response.status).toBe(204);
  }

  return { createWorkspace, getWorkspaces, getWorkspace, updateWorkspace, deleteWorkspace };
}
