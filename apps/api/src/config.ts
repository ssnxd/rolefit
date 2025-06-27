/**
 * Configuration Module for RoleFit API
 *
 * This module handles all configuration settings for the application,
 * including environment variable loading and validation.
 */

import { config } from "dotenv";

// Load environment variables from .env file into process.env
config();

/**
 * Application configuration interface
 * Defines the structure of all configuration settings
 */
interface Config {
  gemini: {
    apiUrl: string; // Google Gemini API endpoint URL
    apiKey: string; // API key for authentication with Gemini
  };
  port: number; // Port number for the HTTP server
}

/**
 * Get a required environment variable
 *
 * @param name - The name of the environment variable
 * @param defaultValue - Optional default value if the env var is not set
 * @returns The environment variable value
 * @throws Error if the required environment variable is not set and no default is provided
 */
function getEnvVar(name: string, defaultValue?: string): string {
  const value = process.env[name];
  if (!value && !defaultValue) {
    throw new Error(`Environment variable ${name} is required but not set`);
  }
  return value || defaultValue!;
}

/**
 * Get an optional environment variable with a default value
 *
 * @param name - The name of the environment variable
 * @param defaultValue - The default value to use if the env var is not set
 * @returns The environment variable value or the default value
 */
function getOptionalEnvVar(name: string, defaultValue: string): string {
  return process.env[name] || defaultValue;
}

/**
 * Main application configuration object
 *
 * Contains all the configuration settings needed for the RoleFit API server:
 * - Gemini AI API credentials and endpoint
 * - Server port configuration
 *
 * Environment variables required:
 * - GEMINI_API_URL: The Google Gemini API endpoint URL
 * - GEMINI_API_KEY: API key for authenticating with Gemini
 * - PORT: (optional) Server port, defaults to 3001
 */
export const appConfig: Config = {
  gemini: {
    apiUrl: getEnvVar("GEMINI_API_URL"), // Required: Gemini API endpoint
    apiKey: getEnvVar("GEMINI_API_KEY"), // Required: Gemini API authentication key
  },
  port: parseInt(getOptionalEnvVar("PORT", "3001"), 10), // Optional: Server port (default: 3001)
};
