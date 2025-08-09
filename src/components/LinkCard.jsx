function LinkCard({ title, url, onDelete }) {
    return (
      <div className="bg-white shadow-md rounded-lg p-4 flex justify-between items-center hover:shadow-lg transition">
        <a href={url} target="_blank" rel="noreferrer" className="text-blue-600 font-semibold">
          {title}
        </a>
        {onDelete && (
          <button onClick={onDelete} className="text-red-500 hover:text-red-700">
            ❌
          </button>
        )}
      </div>
    );
  }
  export default LinkCard;
  