const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

// Find the project and workspace directories
const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, "../..");

const config = getDefaultConfig(projectRoot);

// 1. Watch the local app directory and shared packages only
// Exclude the backend API to prevent unnecessary reloads
config.watchFolders = [
  projectRoot,
  // Add any shared packages you need (e.g., UI components, utilities)
  // path.resolve(monorepoRoot, 'packages/ui'),
  // path.resolve(monorepoRoot, 'packages/logger'),
];

// 2. Let Metro know where to resolve packages from
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(monorepoRoot, "node_modules"),
];

module.exports = config;
