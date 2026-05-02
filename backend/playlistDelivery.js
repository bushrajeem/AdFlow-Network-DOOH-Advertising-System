import Screen from "./models/Screen.js";
import { getIO } from "./socket.js";

const SCREEN_POPULATE = [
  { path: "playlist", populate: { path: "ads" } },
  { path: "location" },
];

async function populateScreen(screenId) {
  return Screen.findById(screenId).populate(SCREEN_POPULATE);
}

export async function emitPlaylistUpdatedForScreen(screenId) {
  const screen = await populateScreen(screenId);
  if (!screen) return null;

  try {
    getIO().to(screen.screenCode || screen._id.toString()).emit("playlist-updated", {
      playlist: screen.playlist,
    });
  } catch (err) {
    console.warn("Error emitting playlist-updated event:", err.message);
  }

  return screen;
}

export async function assignPlaylistToScreen({ screenId, playlistId }) {
  const updatedScreen = await Screen.findByIdAndUpdate(
    screenId,
    { playlist: playlistId || null },
    { new: true },
  );

  if (!updatedScreen) return null;

  return emitPlaylistUpdatedForScreen(updatedScreen._id);
}