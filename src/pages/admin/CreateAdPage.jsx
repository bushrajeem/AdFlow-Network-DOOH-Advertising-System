/**
 * CreateAdPage.jsx — Form to create a new ad.
 * Route: /admin/ads/create
 *
 * BACKEND:
 *   POST /api/admin/ads — submit form with FormData (video + poster + metadata)
 */

import { ArrowLeft, Plus, X } from "lucide-react";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

function CreateAdPage() {
  const navigate = useNavigate();

  const [adName, setAdName] = useState("");
  const [video, setVideo] = useState(null);
  const [poster, setPoster] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [posterPreview, setPosterPreview] = useState(null);

  const videoRef = useRef(null);
  const posterRef = useRef(null);

  // Handle video file selection — validates MP4 only
  const handleVideo = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    // TODO: add size and duration validation before upload
    if (file.type !== "video/mp4") return alert("Only MP4 files are allowed.");
    setVideo(file);
    setVideoPreview(URL.createObjectURL(file));
  };

  // Handle poster image selection
  const handlePoster = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPoster(file);
    setPosterPreview(URL.createObjectURL(file));
  };

  // TODO: connect to POST /api/admin/ads with FormData
  const handleSave = () => {
    if (!adName) return alert("Please enter an ad name.");
    if (!video) return alert("Please upload a video.");

    const formData = new FormData();
    formData.append("name", adName);
    formData.append("video", video);
    if (poster) formData.append("poster", poster);

    console.log("Save ad — POST /api/admin/ads", { adName, video, poster });
    // After successful save: navigate("/admin/ads");
  };
  const clearVideo = () => {
    setVideo(null);
    setVideoPreview(null);
  };
  const clearPoster = () => {
    setPoster(null);
    setPosterPreview(null);
  };

  return (
    <div className="max-w-2xl">
      {/* Page Header*/}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => navigate("/admin/ads")}
          className="text-gray-500 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Create Ad</h1>
      </div>

      <div className="flex flex-col gap-7 px-5">
        {/*Ad Name*/}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700 py-3">
            Ad Name
          </label>
          <input
            type="text"
            placeholder="Enter ad name"
            value={adName}
            onChange={(e) => setAdName(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>

        {/*Video Requirements Notice*/}
        <div className="flex flex-col gap-1.5">
          <label className="text-[20px] font-bold text-gray-700 mt-3">
            Upload your video ad
          </label>
          <p className="text-sm text-gray-500 leading-relaxed">
            The video you upload must be of{" "}
            <span className="font-semibold text-gray-700">MP4 format</span> of{" "}
            <span className="font-semibold text-gray-700">
              15-second duration
            </span>{" "}
            with{" "}
            <span className="font-semibold text-gray-700">
              1080 (width) by 1920 (height)
            </span>{" "}
            resolution for optimal viewing. Note that{" "}
            <span className="font-semibold text-gray-700">
              no audio will be played.
            </span>
          </p>
        </div>

        {/* Ad Creation — Selected Template */}
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-gray-700">Ad Creation</p>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Selected template:</span>

            {/* TODO: replace "No template selected" with actual selected template name */}
            <span className="text-sm text-gray-400 italic">
              No template selected
            </span>
          </div>
        </div>

        {/* Upload Video + Poster*/}
        <div className="flex flex-col gap-3">
          <p className="text-sm font-bold text-gray-700 py-2">
            Upload your video and poster image
          </p>

          <div className="flex gap-4">
            <div className="relative flex">
              {/* Video Upload */}
              <button
                onClick={() => videoRef.current.click()}
                className="flex-1 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center gap-2 hover:border-red-300 hover:bg-red-50 transition-colors"
              >
                {videoPreview ? (
                  // Show video preview if uploaded
                  <video
                    src={videoPreview}
                    className="w-52 h-58 object-cover rounded-lg"
                    muted
                  />
                ) : (
                  <div className="flex flex-col items-center px-8 py-10">
                    <div className="w-10 h-10 rounded-full border-2 border-red-400 flex items-center justify-center">
                      <Plus size={20} className="text-red-400" />
                    </div>
                    <p className="text-sm font-semibold text-red-400 py-2">
                      Add Video
                    </p>
                    <p className="text-xs text-gray-400 text-center leading-relaxed">
                      Drag and drop your video
                      <br />
                      file or click to browse
                    </p>
                    <p className="text-xs text-gray-400 py-2">
                      Supports MP4 up to 100MB
                    </p>
                  </div>
                )}
              </button>
              {/* Delete button — only visible when a video is selected */}
              {videoPreview && (
                <button
                  onClick={clearVideo}
                  className="absolute top-2 right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors"
                >
                  <X size={12} />
                </button>
              )}
            </div>

            <div className="relative flex">
              {/* Poster Image Upload */}
              <button
                onClick={() => posterRef.current.click()}
                className="flex-1 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center gap-2 hover:border-red-300 hover:bg-red-50 transition-colors"
              >
                {posterPreview ? (
                  <img
                    src={posterPreview}
                    alt="Poster preview"
                    className="w-52 h-58 object-cover rounded-lg"
                  />
                ) : (
                  <div className="flex flex-col items-center px-8 py-10">
                    <div className="w-10 h-10 rounded-full border-2 border-red-400 flex items-center justify-center">
                      <Plus size={20} className="text-red-400" />
                    </div>
                    <p className="text-sm font-semibold text-red-400 py-2">
                      Add Poster
                    </p>
                    <p className="text-xs text-gray-400 text-center leading-relaxed">
                      Drag and drop your image
                      <br />
                      file or click to browse
                    </p>
                    <p className="text-xs text-gray-400 py-2">
                      Supports JPG, PNG
                    </p>
                  </div>
                )}
              </button>
              {/* Delete button — only visible when a poster is selected */}
              {posterPreview && (
                <button
                  onClick={clearPoster}
                  className="absolute top-2 right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors"
                >
                  <X size={12} />
                </button>
              )}
            </div>
          </div>

          {/* Size recommendation note */}
          <div className="text-sm text-gray-500 py-2">
            <span className="font-semibold text-gray-700">
              Expected video size: 9:16 aspect ratio
            </span>
            <br />
            Recommended: e.g. 1080 × 1920
          </div>

          {/* Hidden file inputs */}
          <input
            ref={videoRef}
            type="file"
            accept="video/mp4"
            onChange={handleVideo}
            className="hidden"
          />
          <input
            ref={posterRef}
            type="file"
            accept="image/*"
            onChange={handlePoster}
            className="hidden"
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

export default CreateAdPage;
