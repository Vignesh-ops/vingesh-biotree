// src/pages/PublicProfile.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import {
    collection,
    query,
    where,
    getDocs,
    getDocs as getDocsFromCollection,
} from "firebase/firestore";
import BasicTheme from '../components/Themes/BasicTheme'
import BusinessTheme from '../components/Themes/BusinessTheme'
import CreatorTheme from '../components/Themes/CreatorTheme'
import DeveloperTheme from '../components/Themes/DeveloperTheme'
import SingerTheme from '../components/Themes/SingerTheme'
import SportsTheme from '../components/Themes/SportsTheme'
import {  collectionGroup} from "firebase/firestore";

export default function PublicProfile() {
    const { username } = useParams();
    const [profile, setProfile] = useState(null);
    const [links, setLinks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
          setLoading(true);
      
          try {
            // 1️⃣ Search across all "profile" subcollections
            const q = query(
                collectionGroup(db, "info"),
                where("username", "==", username)
              );
            
            const snap = await getDocs(q);
            console.log(snap,'snap')
            if (snap.empty) {
              setProfile(null);
              setLinks([]);
              setLoading(false);
              return;
            }
      
         2️⃣ Get the profile data
            const profileDoc = snap.docs.find(doc => doc.id === "info"); // only "info" doc has data
            if (!profileDoc) {
              setProfile(null);
              setLinks([]);
              setLoading(false);
              return;
            }
      
            const profileData = profileDoc.data();
      
            // Extract UID from path: users/{uid}/profile/info
            const pathSegments = profileDoc.ref.path.split("/");
            const uid = pathSegments[1]; // "users" / {uid} / "profile" / "info"
      
            setProfile({ ...profileData, uid });
      
            // 3️⃣ Fetch links subcollection
            const linksSnap = await getDocs(collection(db, "users", uid, "bioLinks"));
            const linksData = linksSnap.docs.map(doc => ({
              id: doc.id,
              ...doc.data(),
            }));
      
            setLinks(linksData);
          } catch (err) {
            console.error("Error loading profile:", err);
          }
      
          setLoading(false);
        };
      
        load();
      }, [username]);
      
    if (loading) return <div className="p-8">Loading…</div>;
    if (!profile) {
        return (
            <div className="min-h-screen flex items-center justify-center flex-col text-center p-6">
                <img
                    src="/404-illustration.svg"
                    alt="Not found"
                    className="w-60 h-60 mb-6"
                />
                <h1 className="text-2xl font-bold mb-2">Profile not found</h1>
                <p className="text-gray-600 max-w-md">
                    Oops... we couldn’t find the user you’re looking for.
                    Double-check the link or ask them to share the right one!
                </p>
            </div>
        );
    }
    switch (profile.theme) {
        case 'creator':
            return <CreatorTheme profile={profile} links={links} />;
        case 'business':
            return <BusinessTheme profile={profile} links={links} />;
        case 'sports':
            return <SportsTheme profile={profile} links={links} />;
        case 'singer':
            return <SingerTheme profile={profile} links={links} />;
        case 'basic':
        case 'developer':
            return <DeveloperTheme profile={profile} links={links} />;
        default:
            return <BasicTheme profile={profile} links={links} />;
    }
}
