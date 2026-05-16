import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../services/api";

interface Note {
  id: number;
  content: string;
  authorName: string;
  authorRole: string;
  createdAt: string;
}

export default function DoctorNurseNotes() {
  const { patientId } = useParams();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [newNote, setNewNote] = useState("");

  const fetchNotes = useCallback(async () => {
    try {
      const res = await api.get(`/notes/${patientId}`);
      setNotes(res.data);
    } catch (err: unknown) {
      console.error("Failed to fetch notes", err);
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  useEffect(() => {
    const init = async () => {
      await fetchNotes();
    };
    init();
  }, [fetchNotes]);

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/notes", { content: newNote, patientId: Number(patientId) });
      setNewNote("");
      await fetchNotes();
    } catch (err) {
      console.error(err);
      alert("Failed to add note");
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1><i className="fi fi-rr-comment-medical"></i> Clinical Visit Notes</h1>
      </div>
      
      <div className="row mt-8">
        <div className="col-4">
          <div className="glass-panel">
            <div className="section-header">
              <i className="fi fi-rr-add section-icon"></i>
              <h3 className="section-title">Add Note</h3>
            </div>
            <form onSubmit={handleAddNote} className="mt-6">
              <div className="form-group">
                <label className="form-label" htmlFor="noteContent">Note Content</label>
                <textarea
                  id="noteContent"
                  className="form-input"
                  rows={8}
                  placeholder="Capture visit updates, observations, or vitals..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  required
                ></textarea>
              </div>
              <button type="submit" className="btn btn-primary btn-block">
                <i className="fi fi-rr-disk"></i>
                <span>Add Clinical Note</span>
              </button>
            </form>
          </div>
        </div>

        <div className="col-8">
          <div className="card min-h-500">
            <div className="section-header">
              <i className="fi fi-rr-history section-icon"></i>
              <h3 className="section-title">Note History</h3>
            </div>
            <div className="mt-6">
              {loading ? (
                <div className="loading-state p-12">
                   <i className="fi fi-rr-refresh animate-spin loading-icon"></i>
                   <p>Loading clinical notes...</p>
                </div>
              ) : notes.length === 0 ? (
                <div className="empty-state p-12">
                   <i className="fi fi-rr-document empty-state-icon"></i>
                   <p>No clinical notes for this patient.</p>
                </div>
              ) : (
                <div className="notes-list">
                  {notes.map((note) => (
                    <div key={note.id} className="note-item">
                      <div className="note-meta">
                        <span className="note-author">
                          <i className="fi fi-rr-user-doctor-message"></i>
                          {note.authorName} <span className="note-role">({note.authorRole})</span>
                        </span>
                        <span className="note-date">
                          <i className="fi fi-rr-calendar-clock"></i>
                          {new Date(note.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="note-body">{note.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
