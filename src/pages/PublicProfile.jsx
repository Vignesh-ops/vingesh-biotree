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

export default function PublicProfile() {
    const { username } = useParams();
    const [profile, setProfile] = useState(null);
    const [links, setLinks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            setLoading(true);

            // Find user document by username
            const usersRef = collection(db, "users");
            const q = query(usersRef, where("username", "==", username));
            const snap = await getDocs(q);

            if (snap.empty) {
                setProfile(null);
                setLinks([]);
                setLoading(false);
                return;
            }

            // Get the first matching document
            const userDocSnap = snap.docs[0];
            const userData = userDocSnap.data();

            // Store both the data and the UID (doc.id)
            setProfile({ ...userData, uid: userDocSnap.id });

            // Fetch links subcollection using doc.id instead of userData.uid
            const linksSnap = await getDocsFromCollection(
                collection(db, "users", userDocSnap.id, "links")
            );

            setLinks(linksSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
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
        default:
          return <BasicTheme profile={profile} links={links} />;
      }
}
