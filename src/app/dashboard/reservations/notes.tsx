import React from 'react';

interface Note {
  note: string;
  employeeName: string;
  dateStamp: string;
}

interface NotesProps {
  notes: Note[];
}

const Notes: React.FC<NotesProps> = ({ notes }) => {
  return (
    <div>
      <h3>Notes</h3>
      {notes.map((note, index) => (
        <div key={index}>
          <p>Note: {note.note}</p>
          <p>Employee Name: {note.employeeName}</p>
          <p>Date: {note.dateStamp}</p>
        </div>
      ))}
    </div>
  );
};

export default Notes;