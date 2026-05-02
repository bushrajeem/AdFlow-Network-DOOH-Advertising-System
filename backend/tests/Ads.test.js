import { jest } from "@jest/globals";

/**
 * tests/ads.test.js
 * Section: Ads — upload, list, delete, play count tracking
 *
 * TC-ADS-01  GET /ads returns all ads
 * TC-ADS-02  GET /ads returns empty array when none exist
 * TC-ADS-03  POST /ads creates ad with name + video file
 * TC-ADS-04  POST /ads rejects missing ad name (400)
 * TC-ADS-05  POST /ads rejects missing video file (400)
 * TC-ADS-06  DELETE /ads/:id removes ad successfully
 * TC-ADS-07  DELETE /ads/:id returns 404 for unknown id
 * TC-ADS-08  Play count increments correctly when ad is played
 */

const Ad = {
  find:              jest.fn(),
  findById:          jest.fn(),
  findByIdAndDelete: jest.fn(),
  findByIdAndUpdate: jest.fn(),
};

// Controller logic (mirrors your AdsPage backend + CreateAdPage backend)
async function getAds(req, res) {
  const ads = await Ad.find({});
  return res.json(ads);
}

async function createAd(req, res) {
  // In your real controller, req.file comes from multer middleware
  const { name, duration } = req.body;
  const file = req.file;

  if (!name || !name.trim())
    return res.status(400).json({ error: "Ad name is required" });
  if (!file)
    return res.status(400).json({ error: "Video file is required" });

  const newAd = {
    _id:       `ad_${Date.now()}`,
    name:      name.trim(),
    duration:  parseInt(duration) || 15,
    videoUrl:  `/uploads/${file.filename}`,
    playCount: 0,
  };
  return res.status(201).json(newAd);
}

async function deleteAd(req, res) {
  const { id } = req.params;
  const deleted = await Ad.findByIdAndDelete(id);
  if (!deleted) return res.status(404).json({ error: "Ad not found" });
  return res.json({ message: "Ad deleted" });
}

async function incrementPlayCount(req, res) {
  const { id } = req.params;
  const ad = await Ad.findByIdAndUpdate(id, { $inc: { playCount: 1 } }, { new: true });
  if (!ad) return res.status(404).json({ error: "Ad not found" });
  return res.json({ playCount: ad.playCount });
}

// ── Helpers ───────────────────────────────────────────────────
function mockReq({ body = {}, params = {}, file = null } = {}) { return { body, params, file }; }
function mockRes() {
  const r = {};
  r.statusCode = 200;
  r.status = jest.fn((c) => { r.statusCode = c; return r; });
  r.json   = jest.fn((d) => { r._body = d; return r; });
  return r;
}

beforeEach(() => jest.clearAllMocks());

// ══════════════════════════════════════════════════════════════
describe("ADS | GET /api/admin/ads", () => {

  test("TC-ADS-01 | Returns full list of ads with name and playCount", async () => {
    Ad.find.mockResolvedValue([
      { _id: "a1", name: "Summer Sale", playCount: 42 },
      { _id: "a2", name: "Eid Special", playCount: 7 },
    ]);
    const res = mockRes();

    await getAds(mockReq(), res);

    expect(res._body).toHaveLength(2);
    expect(res._body[0]).toMatchObject({ name: "Summer Sale", playCount: 42 });
  });

  test("TC-ADS-02 | Returns empty array when no ads exist", async () => {
    Ad.find.mockResolvedValue([]);
    const res = mockRes();

    await getAds(mockReq(), res);

    expect(res._body).toEqual([]);
  });
});

// ══════════════════════════════════════════════════════════════
describe("ADS | POST /api/admin/ads", () => {

  test("TC-ADS-03 | Valid name + video file creates ad and returns 201", async () => {
    const req = mockReq({
      body: { name: "New Ad", duration: "15" },
      file: { filename: "video_abc.mp4" },
    });
    const res = mockRes();

    await createAd(req, res);

    expect(res.statusCode).toBe(201);
    expect(res._body).toMatchObject({ name: "New Ad", duration: 15, playCount: 0 });
    expect(res._body.videoUrl).toContain("video_abc.mp4");
  });

  test("TC-ADS-04 | Missing ad name returns 400", async () => {
    const req = mockReq({ body: {}, file: { filename: "vid.mp4" } });
    const res = mockRes();

    await createAd(req, res);

    expect(res.statusCode).toBe(400);
    expect(res._body.error).toMatch(/name/i);
  });

  test("TC-ADS-05 | Missing video file returns 400", async () => {
    const req = mockReq({ body: { name: "Ad Without Video" }, file: null });
    const res = mockRes();

    await createAd(req, res);

    expect(res.statusCode).toBe(400);
    expect(res._body.error).toMatch(/video/i);
  });
});

// ══════════════════════════════════════════════════════════════
describe("ADS | DELETE /api/admin/ads/:id", () => {

  test("TC-ADS-06 | Deletes existing ad and returns success", async () => {
    Ad.findByIdAndDelete.mockResolvedValue({ _id: "a1", name: "Old Ad" });
    const req = mockReq({ params: { id: "a1" } });
    const res = mockRes();

    await deleteAd(req, res);

    expect(res._body).toMatchObject({ message: "Ad deleted" });
  });

  test("TC-ADS-07 | Returns 404 for unknown ad id", async () => {
    Ad.findByIdAndDelete.mockResolvedValue(null);
    const req = mockReq({ params: { id: "no-such-ad" } });
    const res = mockRes();

    await deleteAd(req, res);

    expect(res.statusCode).toBe(404);
    expect(res._body.error).toMatch(/not found/i);
  });
});

// ══════════════════════════════════════════════════════════════
describe("ADS | Play Count — PATCH /api/admin/ads/:id/play", () => {

  test("TC-ADS-08 | Play count increments by 1 and returns new count", async () => {
    Ad.findByIdAndUpdate.mockResolvedValue({ _id: "a1", name: "Running Ad", playCount: 43 });
    const req = mockReq({ params: { id: "a1" } });
    const res = mockRes();

    await incrementPlayCount(req, res);

    expect(res._body).toMatchObject({ playCount: 43 });
    // Confirm $inc operator was used — not a flat set
    expect(Ad.findByIdAndUpdate).toHaveBeenCalledWith(
      "a1",
      { $inc: { playCount: 1 } },
      { new: true }
    );
  });
});