'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Home() {
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [sessionData, setSessionData] = useState(null);

  useEffect(() => {
    console.log("fetching topics")
    const fetchTopics = async () => {
      const response = await axios.get('/api/topics');
      setTopics(response.data);
    };
    fetchTopics();
    console.log(topics)
  }, []);

  const createSession = async () => {
    const response = await axios.post('/api/session', { topic_id: selectedTopic });
    setSessionData(response.data);
  };

  return (
    <div>
      <h1>Select a Topic</h1>
      <select onChange={(e) => setSelectedTopic(e.target.value)} value={selectedTopic}>
        {topics.map((topic) => (
          <option key={topic._id} value={topic.topic_id}>
            {topic.name}
          </option>
        ))}
      </select>
      <button onClick={createSession}>Create Session</button>

      {sessionData && (
        <div>
          <h2>Session Created</h2>
          <p>Session URL: <a href={sessionData.session_url}>{sessionData.session_url}</a></p>
          <img src={sessionData.session_qr} alt="Session QR Code" />
        </div>
      )}
    </div>
  );
}
