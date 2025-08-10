export default function BasicTheme({ profile, links }) {

  const Links = profile.bioLinks
  console.log("****",Links)

    return (
      <div className="min-h-screen p-8 bg-gray-50 text-gray-900 flex flex-col items-center font-sans">
        <img
          src={profile.photoURL || "/avatar-placeholder.png"}
          alt={profile.displayName || profile.username}
          className="w-28 h-28 rounded-full border-2 border-gray-300 object-cover"
        />
        <h1 className="text-3xl mt-3 font-semibold">{profile.displayName || profile.username}</h1>
        <p className="mt-2 max-w-lg text-center text-gray-700">{profile.bio}</p>
  
        <div className="mt-8 w-full max-w-md space-y-3">
          {Links.map((link,index) => (
            <a
              key={index}
              href={link.value.url}
              target="_blank"
              rel="noreferrer"
              className="block bg-white shadow-md rounded-md py-3 px-6 text-center font-medium hover:bg-gray-100 transition"
            >
              {link.value.id}
            </a>
          ))}
        </div>
      </div>
    );
  }
  