import { ResourceType } from '@notespace/shared/src/workspace/types/resource';
import DocumentView from '@ui/pages/workspace/components/DocumentView';
import useError from '@ui/contexts/error/useError';
import useWorkspace from '@ui/contexts/workspace/useWorkspace';
import { useEffect, useState } from 'react';
import DataTable from '@ui/components/table/DataTable';
import { FaPlus } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { getDocuments, sortDocuments } from '@domain/workspaces/utils';
import './Workspace.scss';

function Workspace() {
  const { workspace, resources, operations } = useWorkspace();
  const { publishError } = useError();
  const [selected, setSelected] = useState<string[]>([]);
  const [rows, setRows] = useState(getDocuments(resources));

  useEffect(() => {
    setRows(getDocuments(resources));
  }, [resources]);

  return (
    <div className="workspace">
      <h2>Documents in {workspace?.name}</h2>
      <DataTable
        columns={['Name', 'Created', 'Modified']}
        hasSelected={selected.length > 0}
        onSelectAll={value => setSelected(value ? rows.map(document => document.id) : [])}
        createButton={
          <button onClick={() => operations?.createResource('Untitled', ResourceType.DOCUMENT).catch(publishError)}>
            <FaPlus />
          </button>
        }
        deleteButton={
          <button
            onClick={() => {
              selected.forEach(document => {
                operations?.deleteResource(document).catch(publishError);
              });
              setSelected([]);
            }}
          >
            <MdDelete />
          </button>
        }
        sortRows={(column, ascending) => {
          setRows(() => sortDocuments([...rows], column, ascending));
        }}
      >
        {rows.map(document => (
          <DocumentView
            key={document.id}
            document={document}
            selected={selected.includes(document.id)}
            onSelect={value =>
              setSelected(prev => (value ? [...prev, document.id] : prev.filter(id => id !== document.id)))
            }
            onDelete={() => operations?.deleteResource(document.id).catch(publishError)}
            onDuplicate={() =>
              operations?.createResource(document.name + '-copy', ResourceType.DOCUMENT).catch(publishError)
            }
            onRename={name => operations?.updateResource(document.id, { name }).catch(publishError)}
          />
        ))}
      </DataTable>
    </div>
  );
}

export default Workspace;
