import { useEffect, useState } from 'react';
import Fuse from 'fuse.js';
import Nav from '../../share/components/Nav.jsx';

function Home() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [searchId, setSearchId] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://technical-test-25thsep.onrender.com');
        const data = await response.json();
        setData(data.users || []);
        setResults(data.users || []);
      } catch (error) {
        console.error('Failed to fetch:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!searchTerm.trim()) {
        setResults(data);
        return;
      }

      const fuse = new Fuse(data, {
        keys: ['name', 'email', 'address', 'phone'],
        threshold: 0.4,
      });

      const searchResults = fuse.search(searchTerm).map((result) => result.item);
      setResults(searchResults);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, data]);



useEffect(() => {
    const timer = setTimeout(async () => {
        if (!searchId.trim()) {
            setResults(data);
            return;
        }

        try {
            const result = await fetch(
                `https://technical-test-25thsep.onrender.com/profile/${searchId}`
            );

           

            const userData = await result.json();
            if (!userData.success) {
                setResults([]);
                return;
            }

            setResults([userData.data]);
        } catch (err) {
            console.error(err);
        }
    }, 500);

    return () => clearTimeout(timer);
}, [searchId, data]);









  return (
    <div>
      <Nav />
      <h1>Users</h1>
      <input
        type="text"
        placeholder="Search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <input
        type="text"
        placeholder="Search by id"
        value={searchId}
        onChange={(e) => setSearchId(e.target.value)}
      />


      {results.length > 0 ? (
        results.map((user, index) => (
          <div key={user.id || index}>
            <h3>{user.name}</h3>
            <p>Email: {user.email}</p>
            <p>Phone: {user.phone}</p>
            <p>Address: {user.address}</p>
            <p>Age: {user.age}</p>
          </div>
        ))
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default Home;
