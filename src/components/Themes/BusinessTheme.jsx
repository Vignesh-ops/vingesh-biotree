export default function BusinessTheme({ profile, links }) {
    return (
      <div className="min-h-screen p-10 bg-gradient-to-b from-blue-900 via-blue-700 to-blue-600 text-white font-sans flex flex-col items-center">
        <img
          src={profile.photoURL || "/avatar-placeholder.png"}
          alt={profile.displayName || profile.username}
          className="w-28 h-28 rounded-full border-4 border-white shadow-md object-cover"
        />
        <h1 className="text-4xl mt-4 font-bold">{profile.displayName || profile.username}</h1>
        <p className="mt-2 max-w-xl text-center italic">{profile.bio}</p>
  
        <div className="mt-8 w-full max-w-md space-y-4">
          {links.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noreferrer"
              className="block bg-white bg-opacity-20 rounded-md py-3 px-6 font-semibold text-lg hover:bg-opacity-40 transition text-blue-50"
            >
              {link.title}
            </a>
          ))}
        </div>
      </div>
    );
  }
  