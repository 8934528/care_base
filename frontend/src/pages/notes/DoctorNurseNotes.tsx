import { useState, useEffect } from "react";
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

  const fetchNotes = async () => {
    try {
      const res = await api.get(`/notes/${patientId}`);
      setNotes(res.data);
    } catch (err) {
      console.error("Failed to fetch notes", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [patientId]);

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/notes", { content: newNote, patientId: Number(patientId) });
      setNewNote("");
      fetchNotes();
    } catch (err) {
      alert("Failed to add note");
    }
  };

  return (
    <div className="animate-fade-in">
      <h1>Clinical Visit Notes</h1>
      
      <div className="row" style={{ marginTop: '2rem' }}>
        <div className="col-4">
          <div className="card glass-panel">
            <h3>Add Note</h3>
            <form onSubmit={handleAddNote} style={{ marginTop: '1.5rem' }}>
              <div className="form-group">
                <label className="form-label">Note Content</label>
                <textarea
                  className="form-input"
                  rows={8}
                  placeholder="Capture visit updates, observations, or vitals..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  required
                ></textarea>
              </div>
              <button type="submit" className="btn btn-primary btn-block">Add Note</button>
            </form>
          </div>
        </div>

        <div className="col-8">
          <div className="card" style={{ minHeight: '500px' }}>
            <h3>Note History</h3>
            <div style={{ marginTop: '1.5rem' }}>
              {loading ? (
                <p>Loading notes...</p>
              ) : notes.length === 0 ? (
                <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: '3rem' }}>No clinical notes for this patient.</p>
              ) : (
                notes.map((note) => (
                  <div key={note.id} style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ fontWeight: '600' }}>{note.authorName} ({note.authorRole})</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        {new Date(note.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', whiteSpace: 'pre-wrap' }}>{note.content}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
