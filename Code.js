import React, { useState, useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { FiSave, FiTrash2, FiEdit, FiSearch } from 'react-icons/fi';

// CSS Styles
const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#f5f5f5',
    minHeight: '100vh'
  },
  form: {
    display: 'grid',
    gap: '10px',
    marginBottom: '30px'
  },
  input: {
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '16px'
  },
  button: {
    padding: '10px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '5px'
  },
  snippetsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px'
  },
  snippetCard: {
    backgroundColor: '#2d2d2d',
    padding: '15px',
    borderRadius: '8px',
    color: 'white'
  },
  tag: {
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: '4px 8px',
    borderRadius: '3px',
    marginRight: '5px',
    fontSize: '0.8em',
    display: 'inline-block'
  },
  searchBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '20px'
  }
};

function App() {
  const [snippets, setSnippets] = useState([]);
  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [tags, setTags] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [editId, setEditId] = useState(null);

  // Load snippets from localStorage
  useEffect(() => {
    const savedSnippets = JSON.parse(localStorage.getItem('snippets')) || [];
    setSnippets(savedSnippets);
  }, []);

  // Save snippet
  const handleSave = (e) => {
    e.preventDefault();
    const newSnippet = {
      id: editId || Date.now(),
      title,
      code,
      language,
      tags: tags.split(',').map(tag => tag.trim())
    };

    const updatedSnippets = editId
      ? snippets.map(s => (s.id === editId ? newSnippet : s))
      : [...snippets, newSnippet];

    setSnippets(updatedSnippets);
    localStorage.setItem('snippets', JSON.stringify(updatedSnippets));
    resetForm();
  };

  // Reset form
  const resetForm = () => {
    setTitle('');
    setCode('');
    setLanguage('javascript');
    setTags('');
    setEditId(null);
  };

  // Edit snippet
  const handleEdit = (snippet) => {
    setTitle(snippet.title);
    setCode(snippet.code);
    setLanguage(snippet.language);
    setTags(snippet.tags.join(', '));
    setEditId(snippet.id);
  };

  // Delete snippet
  const handleDelete = (id) => {
    const updatedSnippets = snippets.filter(snippet => snippet.id !== id);
    setSnippets(updatedSnippets);
    localStorage.setItem('snippets', JSON.stringify(updatedSnippets));
  };

  // Filter snippets based on search
  const filteredSnippets = snippets.filter(snippet =>
    snippet.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    snippet.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div style={styles.container}>
      <h1>📁 Code Snippet Manager</h1>

      {/* Form */}
      <form onSubmit={handleSave} style={styles.form}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={styles.input}
        />
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          style={styles.input}
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="html">HTML</option>
        </select>
        <textarea
          placeholder="Paste code here..."
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
          style={{ ...styles.input, minHeight: '150px' }}
        />
        <input
          type="text"
          placeholder="Tags (e.g., web, auth)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          style={styles.input}
        />
        <button type="submit" style={styles.button}>
          <FiSave /> {editId ? 'Update' : 'Save'}
        </button>
      </form>

      {/* Search */}
      <div style={styles.searchBar}>
        <FiSearch />
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={styles.input}
        />
      </div>

      {/* Snippets List */}
      <div style={styles.snippetsGrid}>
        {filteredSnippets.map((snippet) => (
          <div key={snippet.id} style={styles.snippetCard}>
            <h3>{snippet.title}</h3>
            <div>
              {snippet.tags.map((tag, i) => (
                <span key={i} style={styles.tag}>#{tag}</span>
              ))}
            </div>
            <SyntaxHighlighter
              language={snippet.language}
              style={vscDarkPlus}
              showLineNumbers
            >
              {snippet.code}
            </SyntaxHighlighter>
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button onClick={() => handleEdit(snippet)} style={styles.button}>
                <FiEdit /> Edit
              </button>
              <button onClick={() => handleDelete(snippet.id)} style={{ ...styles.button, backgroundColor: '#dc3545' }}>
                <FiTrash2 /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
