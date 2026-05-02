import fs from "fs";
import path from "path";

const outputDir = path.join("tests", "e2e", "report");
const outputFile = path.join(outputDir, "index.html");

const runDate = new Date().toLocaleString("en-GB", {
  day: "2-digit",
  month: "long",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

const jsonPath = path.join(outputDir, "playwright.json");
const hasJson = fs.existsSync(jsonPath);

function sanitize(text) {
  if (!text) return "";
  return String(text).replace(/[<>]/g, "");
}

function buildRowsFromJson(json) {
  const rows = [];
  let counter = 1;

  function walkSuite(suite, prefix = "") {
    const title = suite.title ? `${prefix}${suite.title} ` : prefix;
    (suite.suites || []).forEach((child) => walkSuite(child, title));
    (suite.specs || []).forEach((spec) => {
      (spec.tests || []).forEach((t) => {
        const results = t.results || [];
        const worst = results.find((r) => r.status === "failed") || results[0];
        const status = worst?.status || "unknown";
        const errorMsg = worst?.error?.message || "";
        const outcome = status === "passed" ? "Passed" : sanitize(errorMsg).slice(0, 200);

        const fullTitle = sanitize(`${title}${spec.title}`.trim());
        const idMatch = fullTitle.match(/^UI-\d+/);
        const id = idMatch ? idMatch[0] : `UI-${String(counter).padStart(2, "0")}`;
        const testName = fullTitle.replace(/^UI-\d+\s*\|\s*/i, "");

        rows.push({
          id,
          name: testName,
          actual: outcome || status,
          result: status.toUpperCase(),
        });
        counter += 1;
      });
    });
  }

  (json.suites || []).forEach((suite) => walkSuite(suite, ""));
  return rows;
}

let rowsData = [];
if (hasJson) {
  const json = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
  rowsData = buildRowsFromJson(json);
}

if (!rowsData.length) {
  rowsData = [
    { id: "UI-01", name: "Home page loads", actual: "Not run", result: "N/A" },
    { id: "UI-02", name: "Admin login redirects to dashboard", actual: "Not run", result: "N/A" },
    { id: "UI-03", name: "Create ad", actual: "Not run", result: "N/A" },
    { id: "UI-04", name: "Create playlist", actual: "Not run", result: "N/A" },
    { id: "UI-05", name: "Payment start", actual: "Not run", result: "N/A" },
    { id: "UI-06", name: "Ads list page loads", actual: "Not run", result: "N/A" },
    { id: "UI-07", name: "Playlists list page loads", actual: "Not run", result: "N/A" },
    { id: "UI-08", name: "Users list page loads", actual: "Not run", result: "N/A" },
    { id: "UI-09", name: "Screen list page loads", actual: "Not run", result: "N/A" },
    { id: "UI-10", name: "Location index loads", actual: "Not run", result: "N/A" },
  ];
}

const expectedMap = {
  "UI-01": "Home page loads without errors",
  "UI-02": "Redirect to /admin and Overview visible",
  "UI-03": "Ad saved and redirected to /admin/ads",
  "UI-04": "Playlist saved and redirected to /admin/playlists",
  "UI-05": "Payment initiation triggers gateway navigation",
  "UI-06": "Ads list header visible",
  "UI-07": "Playlists list header visible",
  "UI-08": "Users list header visible",
  "UI-09": "Screen list header visible",
  "UI-10": "Location index header visible",
};

const reportLink = path.join("..", "..", "..", "playwright-report", "index.html");

const rows = rowsData
  .map((tc) => {
    const statusClass = tc.result === "PASSED" ? "pass" : tc.result === "FAILED" ? "fail" : "na";
    const expected = expectedMap[tc.id] || "";
    const comment = tc.result === "FAILED" ? tc.actual : "";
    return `
    <tr>
      <td>${tc.id}</td>
      <td>${tc.name}</td>
      <td>${expected}</td>
      <td>${tc.actual || ""}</td>
      <td class="${statusClass}">${tc.result}</td>
      <td>${comment}</td>
      <td><a href="${reportLink}">Playwright report</a></td>
    </tr>`;
  })
  .join("");

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>AdFlow UI Test Report</title>
<style>
  * { box-sizing: border-box; }
  body { font-family: Arial, sans-serif; background: #f3f4f6; color: #111; margin: 0; }
  .header { background: #002B6B; color: #fff; padding: 24px 32px; }
  .header h1 { margin: 0; font-size: 22px; }
  .header p { margin: 6px 0 0; font-size: 12px; color: #c7ddff; }
  .section { padding: 24px 32px 40px; }
  table { width: 100%; border-collapse: collapse; background: #fff; border: 1px solid #e5e7eb; }
  thead th { background: #002B6B; color: #fff; text-align: left; padding: 10px 12px; font-size: 12px; letter-spacing: 0.4px; }
  tbody td { padding: 10px 12px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #374151; }
  tbody tr:nth-child(even) { background: #f9fafb; }
  .pass { color: #16a34a; font-weight: 700; }
  .fail { color: #dc2626; font-weight: 700; }
  .na { color: #6b7280; font-weight: 700; }
  .footer { text-align: center; padding: 16px; font-size: 11px; color: #9ca3af; }
</style>
</head>
<body>
  <div class="header">
    <h1>AdFlow Network - UI Test Documentation</h1>
    <p>Environment: Vercel | Generated: ${runDate}</p>
  </div>
  <div class="section">
    <table>
      <thead>
        <tr>
          <th>Test ID</th>
          <th>Test Case Name</th>
          <th>Expected Outcome</th>
          <th>Actual Outcome</th>
          <th>Result</th>
          <th>Comment</th>
          <th>Link</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
  </div>
  <div class="footer">
    AdFlow Network - UI Flow Test Documentation
  </div>
</body>
</html>`;

fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(outputFile, html, "utf8");

console.log(`UI report written to: ${outputFile}`);
