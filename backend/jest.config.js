/**
 * jest.config.js — Jest configuration for AdFlow Network
 *
 * Runs tests from /tests folder.
 * Generates an HTML report in /tests/report/index.html
 * that looks like a structured test table (similar to Excel).
 */

export default {
  // Only look in the tests folder
  testMatch: ["**/tests/**/*.test.js"],

  // Plain Node environment (no browser DOM needed for backend tests)
  testEnvironment: "node",

  // Show each individual test name in terminal
  verbose: true,

  // Reporters: default terminal output + HTML file
  reporters: [
    "default",
    [
      "jest-html-reporter",
      {
        // Output file location
        outputPath:    "./tests/report/index.html",

        // Title shown at the top of the HTML report
        pageTitle:     "AdFlow Network — Payment System Unit Test Report",

        // Show all tests (passed + failed), not just failures
        includeFailureMsg:   true,
        includeConsoleLog:   false,
        includeSuiteFailure: true,

        // Sort by test name for easy reading
        sort: "titleAsc",

        // Theme — "lightTheme" looks clean and professional
        theme: "lightTheme",

        // Logo in report header (optional — remove if you have no logo)
        // logo: "./logo.png",

        // Date format in the report
        dateFormat: "dd/mm/yyyy HH:MM:ss",

        // Expand all test cases by default (good for faculty demo)
        executionTimeWarningThreshold: 5,
      },
    ],
  ],

  // How long before a single test times out (ms)
  testTimeout: 10000,

  // Clear mock state between tests
  clearMocks:   true,
  resetMocks:   false,
  restoreMocks: false,
};