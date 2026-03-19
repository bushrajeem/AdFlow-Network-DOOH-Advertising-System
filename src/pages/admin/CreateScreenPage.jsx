/**
 * CreateScreenPage.jsx — Form to create a new screen.
 * Route: /admin/screens/create
 *
 * BACKEND:
 *   POST /api/admin/screens — submit form with FormData
 */

import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CreateScreenPage() {
  const navigate = useNavigate();

  const [screenName, setScreenName] = useState("");



  // TODO: connect to POST /api/admin/screens with FormData
  const handleSave = () => {
    if (!screenName) return alert("Please enter a screen name.");

    const formData = new FormData();
    formData.append("name", screenName);

    console.log("Save screen — POST /api/admin/screens", { screenName });
    // After successful save: navigate("/admin/screens");
  };
 

  return (
    <div className="max-w-2xl">
      {/* Page Header*/}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => navigate("/admin/screen")}
          className="text-gray-500 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Create Screen</h1>
      </div>
        
        {/* screen name */}
      <div className="flex flex-col gap-7 px-5">
        {/*Screen Name*/}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700 py-3">
            Screen Name
          </label>
          <input
            type="text"
            placeholder="Enter screen name"
            value={screenName}
            onChange={(e) => setScreenName(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>

{/*Screen playlist*/}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700 py-3">
            Playlist Name
          </label>
          <input
            type="text"
            placeholder="Enter screen name"
            value={screenName}
            onChange={(e) => setScreenName(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>

        {/*Screen Name*/}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700 py-3">
            Screen Name
          </label>
          <input
            type="text"
            placeholder="Enter screen name"
            value={screenName}
            onChange={(e) => setScreenName(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>
        

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="bg-[#002B6B] hover:bg-blue-900 text-white text-sm font-semibold px-8 py-3 rounded-lg tracking-wide transition-colors w-fit"
        >
          SAVE
        </button>
      </div>
    </div>
  );
}

export default CreateScreenPage;
