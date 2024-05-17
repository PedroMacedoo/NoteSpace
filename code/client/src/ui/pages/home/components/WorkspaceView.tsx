import { Link } from 'react-router-dom';
import { WorkspaceMetaData } from '@notespace/shared/src/workspace/types/workspace';
import useEditing from '@ui/hooks/useEditing';
import { RiComputerLine } from 'react-icons/ri';
import WorkspaceContextMenu from '@ui/pages/home/components/WorkspaceContextMenu';

type WorkspacePreviewProps = {
  workspace: WorkspaceMetaData;
  onDelete: () => void;
  onRename: (title: string) => void;
  onInvite: () => void;
};

function WorkspaceView({ workspace, onDelete, onRename, onInvite }: WorkspacePreviewProps) {
  const { component, isEditing, setIsEditing } = useEditing(workspace.name, onRename);
  const WorkspaceComponent = (
    <li>
      <div>
        <RiComputerLine />
        {component}
      </div>
    </li>
  );
  return (
    <WorkspaceContextMenu
      item={isEditing ? WorkspaceComponent : <Link to={`/workspaces/${workspace.id}`}>{WorkspaceComponent}</Link>}
      onInvite={onInvite}
      onRename={() => setIsEditing(true)}
      onDelete={onDelete}
    />
  );
}

export default WorkspaceView;
