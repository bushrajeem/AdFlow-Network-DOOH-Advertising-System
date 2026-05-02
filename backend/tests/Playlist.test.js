import { jest } from "@jest/globals";

/**
 * tests/playlist.test.js
 * Section: Playlists — create, list, update (ads + locations), delete
 *
 * TC-PL-01  GET /playlists returns all playlists
 * TC-PL-02  POST /playlists creates playlist with name only (ads + locations optional)
 * TC-PL-03  POST /playlists with adIds and locationIds stores associations
 * TC-PL-04  POST /playlists rejects missing name (400)
 * TC-PL-05  DELETE /playlists/:id removes playlist
 * TC-PL-06  DELETE /playlists/:id returns 404 for unknown id
 * TC-PL-07  PATCH /playlists/:id updates name, ads and locations
 * TC-PL-08  PATCH /playlists/:id returns 404 for unknown id
 */

const Playlist = {
  find:              jest.fn(),
  findById:          jest.fn(),
  findByIdAndDelete: jest.fn(),
  findByIdAndUpdate: jest.fn(),
};

// Controller logic (mirrors your CreatePlaylistPage + PlaylistsPage backend)
async function getPlaylists(req, res) {
  const playlists = await Playlist.find({}).populate("ads").populate("locations");
  return res.json(playlists);
}

async function createPlaylist(req, res) {
  const { name, adIds = [], locationIds = [] } = req.body;
  if (!name || !name.trim())
    return res.status(400).json({ error: "Playlist name is required" });

  const playlist = {
    _id:       `pl_${Date.now()}`,
    name:      name.trim(),
    ads:       adIds,
    locations: locationIds,
  };
  return res.status(201).json(playlist);
}

async function deletePlaylist(req, res) {
  const { id } = req.params;
  const deleted = await Playlist.findByIdAndDelete(id);
  if (!deleted) return res.status(404).json({ error: "Playlist not found" });
  return res.json({ message: "Playlist deleted" });
}

async function updatePlaylist(req, res) {
  const { id } = req.params;
  const { name, adIds, locationIds } = req.body;
  const updated = await Playlist.findByIdAndUpdate(
    id,
    { name, ads: adIds, locations: locationIds },
    { new: true }
  );
  if (!updated) return res.status(404).json({ error: "Playlist not found" });
  return res.json(updated);
}

// ── Helpers ───────────────────────────────────────────────────
function mockReq({ body = {}, params = {} } = {}) { return { body, params }; }
function mockRes() {
  const r = {};
  r.statusCode = 200;
  r.status = jest.fn((c) => { r.statusCode = c; return r; });
  r.json   = jest.fn((d) => { r._body = d; return r; });
  return r;
}

beforeEach(() => jest.clearAllMocks());

// ══════════════════════════════════════════════════════════════
describe("PLAYLIST | GET /api/admin/playlists", () => {

  test("TC-PL-01 | Returns all playlists with ads count", async () => {
    const list = [
      { _id: "pl1", name: "Morning Ads", ads: ["a1", "a2"], locations: [] },
    ];
    const chain = {
      populate: jest.fn().mockReturnThis(),
      then: (resolve) => Promise.resolve(list).then(resolve),
    };
    Playlist.find.mockReturnValue(chain);

    const res = mockRes();
    await getPlaylists(mockReq(), res);

    expect(res._body).toHaveLength(1);
    expect(res._body[0]).toMatchObject({ name: "Morning Ads" });
    expect(chain.populate).toHaveBeenCalledTimes(2);
  });
});

// ══════════════════════════════════════════════════════════════
describe("PLAYLIST | POST /api/admin/playlists", () => {

  test("TC-PL-02 | Creates playlist with name only — ads and locations are optional", async () => {
    const req = mockReq({ body: { name: "Minimal Playlist" } });
    const res = mockRes();

    await createPlaylist(req, res);

    expect(res.statusCode).toBe(201);
    expect(res._body).toMatchObject({ name: "Minimal Playlist", ads: [], locations: [] });
  });

  test("TC-PL-03 | Creates playlist with adIds and locationIds stored", async () => {
    const req = mockReq({ body: { name: "Full Playlist", adIds: ["a1", "a2"], locationIds: ["loc1"] } });
    const res = mockRes();

    await createPlaylist(req, res);

    expect(res.statusCode).toBe(201);
    expect(res._body.ads).toEqual(["a1", "a2"]);
    expect(res._body.locations).toEqual(["loc1"]);
  });

  test("TC-PL-04 | Missing name returns 400", async () => {
    const req = mockReq({ body: { adIds: ["a1"] } });
    const res = mockRes();

    await createPlaylist(req, res);

    expect(res.statusCode).toBe(400);
    expect(res._body.error).toMatch(/name/i);
  });
});

// ══════════════════════════════════════════════════════════════
describe("PLAYLIST | DELETE /api/admin/playlists/:id", () => {

  test("TC-PL-05 | Deletes existing playlist", async () => {
    Playlist.findByIdAndDelete.mockResolvedValue({ _id: "pl1", name: "Old Playlist" });
    const req = mockReq({ params: { id: "pl1" } });
    const res = mockRes();

    await deletePlaylist(req, res);

    expect(res._body).toMatchObject({ message: "Playlist deleted" });
  });

  test("TC-PL-06 | Returns 404 for unknown playlist id", async () => {
    Playlist.findByIdAndDelete.mockResolvedValue(null);
    const req = mockReq({ params: { id: "ghost" } });
    const res = mockRes();

    await deletePlaylist(req, res);

    expect(res.statusCode).toBe(404);
  });
});

// ══════════════════════════════════════════════════════════════
describe("PLAYLIST | PATCH /api/admin/playlists/:id", () => {

  test("TC-PL-07 | Updates name, ads, and locations", async () => {
    const updated = { _id: "pl1", name: "Updated Playlist", ads: ["a3"], locations: ["loc2"] };
    Playlist.findByIdAndUpdate.mockResolvedValue(updated);
    const req = mockReq({ params: { id: "pl1" }, body: { name: "Updated Playlist", adIds: ["a3"], locationIds: ["loc2"] } });
    const res = mockRes();

    await updatePlaylist(req, res);

    expect(res._body).toMatchObject({ name: "Updated Playlist", ads: ["a3"] });
  });

  test("TC-PL-08 | Returns 404 when playlist not found during update", async () => {
    Playlist.findByIdAndUpdate.mockResolvedValue(null);
    const req = mockReq({ params: { id: "missing" }, body: { name: "X" } });
    const res = mockRes();

    await updatePlaylist(req, res);

    expect(res.statusCode).toBe(404);
  });
});