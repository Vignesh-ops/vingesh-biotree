function LinkCard({ user }) {
  if (!user) return null;

  // Build profile link from username
  const profileUrl = `${window.location.origin}/${user.username || ""}`;

  return (
    <div className="bg-white shadow-md rounded-lg p-4 flex justify-between items-center hover:shadow-lg transition">
      <a
        href={profileUrl}
        target="_blank"
        rel="noreferrer"
        className="text-blue-600 font-semibold hover:underline"
      >
        {user.biotitle || "Untitled"}
      </a>
      {user.photoURL && (
        <div className="w-12 h-12 rounded-full overflow-hidden">
          <img
            src={user.photoURL}
            alt={`${user.username || "User"} profile`}
            className="w-full h-full object-cover"
          />
        </div>
      )}
    </div>
  );
}

export default LinkCard;
