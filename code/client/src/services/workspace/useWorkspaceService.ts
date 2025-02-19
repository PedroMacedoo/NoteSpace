import { useMemo } from 'react';
import { useCommunication } from '@ui/contexts/communication/useCommunication';
import workspaceService from '@services/workspace/workspaceService';

function useWorkspaceService() {
  const { http } = useCommunication();
  return useMemo(() => workspaceService(http), [http]);
}

export default useWorkspaceService;
