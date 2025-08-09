import { useDispatch, useSelector } from "react-redux";
import { fetchLinks, addLink, deleteLink } from "../features/linkSlice";
import { useEffect } from "react";
import LinkForm from "../components/LinkForm";
import LinkCard from "../components/LinkCard";
import Header from "../components/Header";
import Footer from "../components/Footer";

function Dashboard() {
  const dispatch = useDispatch();
  const { items: links } = useSelector(state => state.links);
  const user = useSelector((state) => state.auth.user);
  console.log('links',links)
  useEffect(() => {
    if (user?.uid) {
      dispatch(fetchLinks(user.uid));
    }
  }, [user, dispatch]);
  


  const handleDelete = (id) => {
    dispatch(deleteLink(id));
  };

  return (
    <div>
      <main className="max-w-3xl mx-auto p-4 space-y-4">
        <h2 className="text-2xl font-bold mb-4">Manage Your Links</h2>
        <LinkForm  />
        <div className="space-y-2">
          {links.map(link => (
            <LinkCard
              key={link.id}
              title={link.title}
              url={link.url}
              onDelete={() => handleDelete(link.id)}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
export default Dashboard;
