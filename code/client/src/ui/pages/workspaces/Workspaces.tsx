import useWorkspaces from '@domain/workspaces/useWorkspaces';
import WorkspaceView from '@ui/pages/workspaces/components/WorkspaceView';
import CreateWorkspaceDialog from '@ui/pages/workspaces/components/CreateWorkspaceDialog';
import useError from '@ui/contexts/error/useError';
import DataTable from '@ui/components/table/DataTable';
import { MdDelete } from 'react-icons/md';
import { useEffect, useState } from 'react';
import { sortWorkspaces } from '@domain/workspaces/utils';
import './Workspaces.scss';

function Workspaces() {
  const { workspaces, operations } = useWorkspaces();
  const { publishError } = useError();
  const [selected, setSelected] = useState<string[]>([]);
  const [rows, setRows] = useState(workspaces);

  useEffect(() => {
    setRows(workspaces);
  }, [workspaces]);

  return (
    <div className="workspaces">
      <h2>Workspaces</h2>
      <DataTable
        columns={['Name', 'Members', 'Created', 'Privacy']}
        hasSelected={selected.length > 0}
        createButton={
          <CreateWorkspaceDialog onCreate={workspace => operations.createWorkspace(workspace).catch(publishError)} />
        }
        deleteButton={
          <button
            onClick={() => {
              selected.forEach(workspace => {
                operations.deleteWorkspace(workspace).catch(publishError);
              });
              setSelected([]);
            }}
          >
            <MdDelete />
          </button>
        }
        onSelectAll={value => setSelected(value ? workspaces.map(workspace => workspace.id) : [])}
        sortRows={(column, ascending) => {
          setRows(() => sortWorkspaces([...rows], column, ascending));
        }}
      >
        {rows.map(workspace => (
          <WorkspaceView
            key={workspace.id}
            workspace={workspace}
            selected={selected.includes(workspace.id)}
            onSelect={value =>
              setSelected(prev => (value ? [...prev, workspace.id] : prev.filter(id => id !== workspace.id)))
            }
            onDelete={() => operations.deleteWorkspace(workspace.id).catch(publishError)}
            onRename={name => operations.updateWorkspace(workspace.id, { ...workspace, name }).catch(publishError)}
            onInvite={() => {}}
          />
        ))}
      </DataTable>
    </div>
  );
}

export default Workspaces;
