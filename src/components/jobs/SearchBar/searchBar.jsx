import { LoaderCircle } from "lucide-react";
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

const SearchBar = ({ onSearch}) => {
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState("");
  // const [title, setTitle] = useState("");
  const [keyword, setKeyword] = useState(""); // 🔹 new text input
  const navigate = useNavigate();
  const handleSubmit = () => {
    
    // if (!keyword && !location) return;
    
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (onSearch) {
        // If SearchBar is used inside FindJobsPage
        onSearch({ keyword, location });
        // console.log(onSearch,"onSearch.........");
        
        
      }
      else {
        console.log(keyword, location);

        navigate(`/jobs?keyword=${encodeURIComponent(keyword)}&location=${encodeURIComponent(location)}`);
      }
    }, 1000);

  };

  return (
    <div className="w-full min-h-[250px] bg-[#244034] text-white flex flex-col justify-center items-center text-center gap-6 px-4 py-8 ">
      <div>
        <h1 className="text-3xl sm:text-4xl font-semibold mb-2">Job Finding</h1>
        <p className="text-gray-200 text-base sm:text-lg">We delivered blazing fast & striking work solution</p>
      </div>

      <div className="w-full max-w-4xl bg-white rounded-2xl flex flex-col sm:flex-row items-center overflow-hidden shadow-md">
        <input className="w-full p-4 text-gray-700 
                     placeholder-gray-500 
                     border-b sm:border-b-0 sm:border-r border-gray-300 
                     focus:bg-white focus:border-[#244034] focus:ring-1 focus:ring-[#244034] 
                     outline-none transition-all duration-200" placeholder="Job title,Keywords, or company" value={keyword}
          onChange={(e) => setKeyword(e.target.value)} >
        </input>

        <div><hr /></div>
        <input
          type="text"
          placeholder="city,state,country"
          className="w-full p-4 text-gray-700 
                     placeholder-gray-500 
                     border-b sm:border-b-0 sm:border-r border-gray-300 
                     focus:bg-white focus:border-[#244034] focus:ring-1 focus:ring-[#244034] 
                     outline-none transition-all duration-200"
          value={location} onChange={(e) => setLocation(e.target.value)}
        />

        {loading ? (
          <button
            disabled
            className="w-full sm:w-40 p-4 flex items-center justify-center gap-2 
               bg-[#d2f34c] text-black font-semibold rounded-r-lg 
               transition-all duration-200 cursor-wait"
          >
            <LoaderCircle className="animate-spin text-black" size={20} />
            <span>Searching...</span>
          </button>
        ) : (
          <button
            className="w-full sm:w-40 p-4 bg-[#d2f34c] hover:bg-[#c2e340] text-black font-semibold 
               rounded-r-lg transition-all duration-200 cursor-pointer"
            onClick={handleSubmit}
          >
            Search
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;