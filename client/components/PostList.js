import React, { useState, useEffect } from 'react';
import axios from 'axios';


const PostList = () => {
  const [posts, setPosts] = useState({});

  const fetchPost = async () => {
    const res = await axios.get('http://localhost:3001/posts');
    setPosts(res.data);
  };

  useEffect(() => {
    fetchPost();
  }, []);

  const renderedPost = Object.values(posts).map((post) => {
    return (
      <div key={post.id} className='card' style={{ width: '30%', marginBottom: '20px', marginRight: '10px' }}>
        <div className='card-body'>
          <h3>{post.title}</h3>
        </div>
      </div>
    );
  });

  return (
    <div className='d-flex flex-row flex-wrap justiy-content-between'>
      {renderedPost}
    </div>
  );
};

export default PostList;