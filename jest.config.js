module.exports = {
    testPathIgnorePatterns: ["<rootDir>/.next/", "<rootDir>/node_modules/"],
    setupFilesAfterEnv: ["<rootDir>/setupTests.js"],
    transform: {
      "^.+\\.(js|jsx|ts|tsx)$": "<rootDir>/node_modules/babel-jest"
    },
    "moduleDirectories": ["assets","node_modules"],
    "moduleFileExtensions": ["js"],
  "roots": [
    "<rootDir>"
  ],
  "modulePaths": [
    "<rootDir>"
  ],
};