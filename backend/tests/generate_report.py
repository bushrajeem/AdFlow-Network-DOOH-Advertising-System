#!/usr/bin/env python3
"""
generate_report.py
Reads jest --json output and produces a professional HTML test report
that looks like an Excel test case table — suitable for faculty submission.

Usage:
  npx jest --json 2>/dev/null > jest_results.json
  python3 generate_report.py
  open tests/report/index.html
"""

import json
import datetime
import sys
import os
import re

INPUT  = os.path.join(os.path.dirname(__file__), "..", "jest_results.json")
OUTPUT = os.path.join(os.path.dirname(__file__), "report", "index.html")

# ── Load results ──────────────────────────────────────────────
with open(INPUT) as f:
    data = json.load(f)

run_date   = datetime.datetime.now().strftime("%d %B %Y, %I:%M %p")
total      = data["numTotalTests"]
passed     = data["numPassedTests"]
failed     = data["numFailedTests"]
duration_s = round((data.get("testResults", [{}])[0].get("endTime", 0) -
                    data.get("startTime", 0)) / 1000, 2)

# Flatten all assertion results
rows = []
tc_num = 0
for suite in data.get("testResults", []):
    for t in suite.get("assertionResults", []):
        tc_num += 1
        group   = t["ancestorTitles"][0] if t["ancestorTitles"] else "—"
        title   = t["title"]
        status  = t["status"]   # "passed" | "failed"
        dur     = t.get("duration") or 0
        asserts = t.get("numPassingAsserts", "—")
        rows.append({
            "num":     tc_num,
            "group":   group,
            "title":   title,
            "status":  status,
            "dur":     dur,
            "asserts": asserts,
        })

# ── Endpoint mapping (title prefix → endpoint) ───────────────
ENDPOINT_MAP = {
    "TC-01": "POST /api/payment/initiate",
    "TC-02": "POST /api/payment/initiate",
    "TC-03": "POST /api/payment/initiate",
    "TC-04": "POST /api/payment/initiate",
    "TC-05": "POST /api/payment/success",
    "TC-06": "POST /api/payment/success",
    "TC-07": "POST /api/payment/success",
    "TC-08": "POST /api/payment/success",
    "TC-09": "POST /api/payment/success",
    "TC-10": "POST /api/payment/fail",
    "TC-11": "POST /api/payment/cancel",
    "TC-12": "POST /api/payment/ipn",
    "TC-13": "GET  /api/payment/status/:id",
    "TC-14": "GET  /api/payment/status/:id",
    "TC-15": "GET  /api/payment/history",
    "TC-ADS-01": "GET  /api/admin/ads",
    "TC-ADS-02": "GET  /api/admin/ads",
    "TC-ADS-03": "POST /api/admin/ads",
    "TC-ADS-04": "POST /api/admin/ads",
    "TC-ADS-05": "POST /api/admin/ads",
    "TC-ADS-06": "DELETE /api/admin/ads/:id",
    "TC-ADS-07": "DELETE /api/admin/ads/:id",
    "TC-ADS-08": "PATCH /api/admin/ads/:id/play",
    "TC-PL-01": "GET  /api/admin/playlists",
    "TC-PL-02": "POST /api/admin/playlists",
    "TC-PL-03": "POST /api/admin/playlists",
    "TC-PL-04": "POST /api/admin/playlists",
    "TC-PL-05": "DELETE /api/admin/playlists/:id",
    "TC-PL-06": "DELETE /api/admin/playlists/:id",
    "TC-PL-07": "PATCH /api/admin/playlists/:id",
    "TC-PL-08": "PATCH /api/admin/playlists/:id",
}

EXPECTED_MAP = {
    "TC-01": "HTTP 400, error message about minimum ৳10",
    "TC-02": "HTTP 400, error about required fields",
    "TC-03": "HTTP 200, { success: true, tran_id, gatewayUrl }",
    "TC-04": "HTTP 502, error from gateway failure",
    "TC-05": "Redirect to /payment/fail with reason",
    "TC-06": "Redirect to /payment/fail?reason=order_not_found",
    "TC-07": "Redirect to /payment/success, markCompleted NOT called",
    "TC-08": "markFailed() called, redirect to /payment/fail?reason=validation_failed",
    "TC-09": "markCompleted() called, redirect to /payment/success",
    "TC-10": "markFailed() called, DB saved, redirect to /payment/fail",
    "TC-11": "markCancelled() called, DB saved, redirect to /payment/cancel",
    "TC-12": "HTTP 200 { received: true } sent immediately",
    "TC-13": "HTTP 404 { error: 'Payment not found' }",
    "TC-14": "HTTP 200 with tran_id, status, amount, paymentMethod, bankTranId",
    "TC-15": "HTTP 200 { payments: [...], total: 3, page: 1, totalPages: 1 }",
    "TC-ADS-01": "HTTP 200 list of ads",
    "TC-ADS-02": "HTTP 200 empty array",
    "TC-ADS-03": "HTTP 201 created ad",
    "TC-ADS-04": "HTTP 400 missing name",
    "TC-ADS-05": "HTTP 400 missing file",
    "TC-ADS-06": "HTTP 200 delete success",
    "TC-ADS-07": "HTTP 404 not found",
    "TC-ADS-08": "HTTP 200 playCount incremented",
    "TC-PL-01": "HTTP 200 list of playlists",
    "TC-PL-02": "HTTP 201 playlist created",
    "TC-PL-03": "HTTP 201 playlist created with ads/locations",
    "TC-PL-04": "HTTP 400 missing name",
    "TC-PL-05": "HTTP 200 delete success",
    "TC-PL-06": "HTTP 404 not found",
    "TC-PL-07": "HTTP 200 updated playlist",
    "TC-PL-08": "HTTP 404 not found",
}

INPUT_MAP = {
    "TC-01": "{ amount: 5, customerName, customerEmail, customerPhone }",
    "TC-02": "{ amount: 500 }  ← name/email/phone missing",
    "TC-03": "{ amount: 500, brandName, customerName, customerEmail, customerPhone }",
    "TC-04": "Valid body + SSLCommerz returns no GatewayPageURL",
    "TC-05": "{ tran_id, val_id, status: 'FAILED' }",
    "TC-06": "{ tran_id: 'UNKNOWN', val_id, status: 'VALID' } + DB returns null",
    "TC-07": "{ tran_id, val_id, status: 'VALID' } + DB payment already completed",
    "TC-08": "{ tran_id, val_id, status: 'VALID' } + SSLCommerz amount = ৳1 (mismatch)",
    "TC-09": "{ tran_id, val_id, status: 'VALID' } + SSLCommerz amount = ৳500 (match)",
    "TC-10": "{ tran_id } + DB payment status = pending",
    "TC-11": "{ tran_id } + DB payment status = pending",
    "TC-12": "{ tran_id, status: 'VALID', val_id } + DB returns null",
    "TC-13": "params: { tran_id: 'DOES-NOT-EXIST' } + DB returns null",
    "TC-14": "params: { tran_id: 'ADFLOW-MOCK-12345' } + DB returns payment doc",
    "TC-15": "query: { page: '1', limit: '20' } + DB returns 3 records",
    "TC-ADS-01": "no body",
    "TC-ADS-02": "no body",
    "TC-ADS-03": "body: { name, duration }, file",
    "TC-ADS-04": "body: { } + file",
    "TC-ADS-05": "body: { name } + no file",
    "TC-ADS-06": "params: { id }",
    "TC-ADS-07": "params: { id }",
    "TC-ADS-08": "params: { id }",
    "TC-PL-01": "no body",
    "TC-PL-02": "body: { name }",
    "TC-PL-03": "body: { name, adIds, locationIds }",
    "TC-PL-04": "body: { adIds }",
    "TC-PL-05": "params: { id }",
    "TC-PL-06": "params: { id }",
    "TC-PL-07": "params: { id }, body: { name, adIds, locationIds }",
    "TC-PL-08": "params: { id }, body: { name }",
}

def tc_key(title):
    """Extract TC-XX from test title string."""
    match = re.match(r"^(TC-[A-Z]+-\d+|TC-\d+)", title)
    if match:
      return match.group(1)
    return "TC-??"

# ── Build HTML ────────────────────────────────────────────────
pass_color  = "#16a34a"
fail_color  = "#dc2626"
badge_pass  = f'<span style="background:{pass_color};color:#fff;padding:3px 10px;border-radius:12px;font-size:12px;font-weight:700;">PASS</span>'
badge_fail  = f'<span style="background:{fail_color};color:#fff;padding:3px 10px;border-radius:12px;font-size:12px;font-weight:700;">FAIL</span>'

table_rows = ""
for r in rows:
    key      = tc_key(r["title"])
    endpoint = ENDPOINT_MAP.get(key, "—")
    expected = EXPECTED_MAP.get(key, "—")
    inp      = INPUT_MAP.get(key, "—")
    badge    = badge_pass if r["status"] == "passed" else badge_fail
    row_bg   = "#f0fdf4" if r["status"] == "passed" else "#fef2f2"
    table_rows += f"""
    <tr style="background:{row_bg};border-bottom:1px solid #e5e7eb;">
      <td style="padding:10px 14px;font-weight:700;color:#1e3a5f;white-space:nowrap;">{key}</td>
      <td style="padding:10px 14px;font-size:13px;color:#374151;max-width:240px;">{r['title'].split('|',1)[1].strip() if '|' in r['title'] else r['title']}</td>
      <td style="padding:10px 14px;font-family:monospace;font-size:12px;color:#6366f1;">{endpoint}</td>
      <td style="padding:10px 14px;font-size:12px;color:#374151;">{inp}</td>
      <td style="padding:10px 14px;font-size:12px;color:#374151;">{expected}</td>
      <td style="padding:10px 14px;text-align:center;">{badge}</td>
      <td style="padding:10px 14px;text-align:center;font-size:12px;color:#6b7280;">{r['dur']} ms</td>
      <td style="padding:10px 14px;text-align:center;font-size:12px;color:#6b7280;">{r['asserts']}</td>
    </tr>"""

html = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>AdFlow — Unit Test Report</title>
<style>
  * {{ box-sizing: border-box; margin: 0; padding: 0; }}
  body {{ font-family: 'Segoe UI', Arial, sans-serif; background: #f3f4f6; color: #111; }}
  .header {{ background: #002B6B; color: white; padding: 32px 48px; }}
  .header h1 {{ font-size: 26px; font-weight: 800; }}
  .header p  {{ font-size: 14px; color: #93c5fd; margin-top: 4px; }}
  .summary {{ display: flex; gap: 20px; padding: 24px 48px; flex-wrap: wrap; }}
  .card {{ background: white; border-radius: 12px; padding: 18px 28px;
           border: 1px solid #e5e7eb; min-width: 150px; flex: 1; }}
  .card .val {{ font-size: 32px; font-weight: 800; }}
  .card .lbl {{ font-size: 13px; color: #6b7280; margin-top: 2px; }}
  .green {{ color: #16a34a; }}
  .red   {{ color: #dc2626; }}
  .blue  {{ color: #2563eb; }}
  .gray  {{ color: #374151; }}
  .section {{ padding: 0 48px 48px; }}
  .section h2 {{ font-size: 18px; font-weight: 700; color: #1e3a5f;
                margin-bottom: 16px; padding-top: 8px; }}
  table {{ width: 100%; border-collapse: collapse; background: white;
           border-radius: 12px; overflow: hidden;
           border: 1px solid #e5e7eb; font-size: 13px; }}
  thead tr {{ background: #002B6B; color: white; }}
  thead th {{ padding: 12px 14px; text-align: left; font-weight: 600;
              font-size: 12px; letter-spacing: .4px; white-space: nowrap; }}
  tbody tr:hover {{ filter: brightness(0.97); }}
  .footer {{ text-align: center; padding: 20px; font-size: 12px; color: #9ca3af; }}
  .pill {{ display:inline-block; padding:2px 8px; border-radius:8px;
           font-size:11px; font-weight:600; }}
  .pill-pass {{ background:#dcfce7; color:#15803d; }}
  .pill-fail {{ background:#fee2e2; color:#b91c1c; }}
</style>
</head>
<body>

<div class="header">
  <h1>AdFlow Network — Unit Test Report</h1>
  <p>Payment System &nbsp;|&nbsp; Tool: Jest 30 &nbsp;|&nbsp; Generated: {run_date}</p>
</div>

<div class="summary">
  <div class="card"><div class="val blue">{total}</div><div class="lbl">Total Test Cases</div></div>
  <div class="card"><div class="val green">{passed}</div><div class="lbl">Passed ✓</div></div>
  <div class="card"><div class="val red">{failed}</div><div class="lbl">Failed ✗</div></div>
  <div class="card"><div class="val {'green' if failed == 0 else 'red'}">{round(passed/total*100)}%</div><div class="lbl">Pass Rate</div></div>
  <div class="card"><div class="val gray">{duration_s}s</div><div class="lbl">Execution Time</div></div>
</div>

<div class="section">
  <h2>📋 Test Case Results</h2>
  <table>
    <thead>
      <tr>
        <th>Test ID</th>
        <th>Test Description</th>
        <th>Endpoint Tested</th>
        <th>Input / Scenario</th>
        <th>Expected Output</th>
        <th style="text-align:center">Result</th>
        <th style="text-align:center">Time</th>
        <th style="text-align:center">Assertions</th>
      </tr>
    </thead>
    <tbody>
      {table_rows}
    </tbody>
  </table>
</div>

<div class="footer">
  AdFlow Network &copy; 2025 &nbsp;|&nbsp; Unit Testing with Jest &nbsp;|&nbsp;
  All {total} test cases executed &nbsp;|&nbsp; {passed} passed, {failed} failed
</div>

</body>
</html>"""

os.makedirs(os.path.dirname(OUTPUT), exist_ok=True)
with open(OUTPUT, "w", encoding="utf-8") as f:
    f.write(html)

print(f"✅  Report written to: {OUTPUT}")
print(f"    Total: {total}  |  Passed: {passed}  |  Failed: {failed}")