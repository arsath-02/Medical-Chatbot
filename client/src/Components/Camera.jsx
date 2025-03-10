import React, { useEffect, useState } from 'react';

const VideoFeed = () => {
  const [emotion, setEmotion] = useState('Neutral');

  useEffect(() => {
    // Fetch emotion data every second
    const interval = setInterval(() => {
      fetch('http://localhost:3000/emotion')
        .then(response => response.json())
        .then(data => {
          setEmotion(data.emotion);
        })
        .catch(err => console.error(err));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>Live Video Feed</h2>
      <img
        src="http://localhost:3000/video_feed"
        alt="Video Feed"
        style={{ border: '2px solid black', width: '500px', height: '400px' }}
      />
      <h3>Detected Emotion: <strong>{emotion}</strong></h3>
    </div>
  );
};

export default VideoFeed;
