import * as React from 'react';
import { useState, createContext, useEffect } from 'react';
import { WorkspaceMeta } from '@notespace/shared/src/workspace/types/workspace';
import { useCommunication } from '@ui/contexts/communication/useCommunication';
import useError from '@ui/contexts/error/useError';
import { useParams } from 'react-router-dom';
import useWorkspaceService from '@services/workspace/useWorkspaceService';
import useResources from '@domain/workspaces/useResources';
import { Resource, ResourceType } from '@notespace/shared/src/workspace/types/resource';

export type Resources = Record<string, Resource>;

export type WorkspaceOperations = {
  createResource: (name: string, type: ResourceType, parent?: string) => Promise<void>;
  deleteResource: (id: string) => Promise<void>;
  updateResource: (id: string, newProps: Partial<Resource>) => Promise<void>;
  moveResource: (id: string, parent: string) => Promise<void>;
};

export type WorkspaceContextType = {
  workspace?: WorkspaceMeta;
  resources?: Resources;
  operations?: WorkspaceOperations;
};

export const WorkspaceContext = createContext<WorkspaceContextType>({});

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const services = useWorkspaceService();
  const [workspace, setWorkspace] = useState<WorkspaceMeta | undefined>(undefined);
  const { resources, operations } = useResources();
  const { setResources, ...otherOperations } = operations;
  const { socket } = useCommunication();
  const { publishError } = useError();
  const { wid } = useParams();

  useEffect(() => {
    if (!wid) return;

    async function fetchWorkspace() {
      const { resources, ...workspace } = await services.getWorkspace(wid!);
      setWorkspace(workspace);
      setResources(resources);
    }
    socket.emit('joinWorkspace', wid);
    fetchWorkspace().catch(publishError);
    return () => {
      socket.emit('leaveWorkspace');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wid, services, socket, publishError]);

  return (
    <WorkspaceContext.Provider value={{ workspace, resources, operations: otherOperations }}>
      {children}
    </WorkspaceContext.Provider>
  );
}
