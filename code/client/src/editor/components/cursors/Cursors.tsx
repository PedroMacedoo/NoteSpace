import { useState } from 'react';
import useSocketListeners from '@socket/useSocketListeners';
import { CursorData } from '@editor/components/cursors/CursorData';
import Cursor from '@editor/components/cursors/Cursor';
import './Cursors.scss';

function Cursors() {
  const [cursors, setCursors] = useState<CursorData[]>([]);

  const onCursorChange = (cursor: CursorData) => {
    setCursors(prevCursors => {
      const otherCursors = prevCursors.filter(c => c.id !== cursor.id);
      return [...otherCursors, cursor];
    });
  };

  useSocketListeners({
    cursorChange: onCursorChange,
  });

  return cursors.map(cursor => <Cursor key={cursor.id} id={cursor.id} color={cursor.color} range={cursor.range} />);
}

export default Cursors;
