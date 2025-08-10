import { useDispatch, useSelector } from "react-redux";
import { fetchLinks, deleteLink } from "../features/linkSlice";
import { fetchUserProfile } from "../features/userSlice"; // <-- Make sure you have this
import { useEffect, useState } from "react";
import LinkForm from "../components/LinkForm";
import LinkCard from "../components/LinkCard";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const dispatch = useDispatch();
  const { items: links, loading: linksLoading } = useSelector(state => state.links);
  const { user, loading: userLoading } = useSelector(state => state.auth); // assuming auth slice has loading
  const navigate = useNavigate();

  const [checkingProfile, setCheckingProfile] = useState(true);

  // Always fetch latest profile first
  useEffect(() => {
    if (user?.uid) {
      Promise.all([
        dispatch(fetchUserProfile(user.uid)),
        dispatch(fetchLinks(user.uid))
      ]).finally(() => setCheckingProfile(false));
    }
  }, [user?.uid, dispatch]);

  // Redirect only after BOTH profile and links are loaded
  useEffect(() => {
    if (!checkingProfile && !userLoading && !linksLoading && user) {
      const bioLinksCount = user.bioLinks?.length || 0;
      if (!user.username || !user.theme || bioLinksCount < 1) {
        navigate("/app/setup");
      }
    }
  }, [checkingProfile, userLoading, linksLoading, user, navigate]);


  if (checkingProfile || userLoading || linksLoading) {
    return <p className="text-center">Loading...</p>;
  }

  return (
    <div>
      <main className="max-w-3xl mx-auto p-4 space-y-4">
        <h2 className="text-2xl font-bold mb-4">Manage Your Links</h2>
        <LinkForm user={user} />
        <div className="space-y-2">
          {user?.bioLinks &&
            <LinkCard
             user = {user}
            />
          }
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
