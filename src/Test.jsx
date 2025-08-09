import { useEffect, useState } from "react";
import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";

function App() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const querySnapshot = await getDocs(collection(db, "users"));
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log(data[0].links,'data')
      setUsers(data);
    };
    fetchUsers();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Users</h1>
      {users.map(user => (
        <div key={user.id} className="border p-2 my-2 rounded">
          <h2>{user.name}</h2>
          <p>{user.bio}</p>
          <ul>
            {user.links?.map((link, i) => (
              <li key={i}>
                <a href={link.url} target="_blank" rel="noreferrer">
                  {link.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default App;
