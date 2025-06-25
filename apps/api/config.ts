import { config } from 'dotenv';

// Load environment variables from .env file
config();

interface Config {
  gemini: {
    apiUrl: string;
    apiKey: string;
  };
  port: number;
}

function getEnvVar(name: string, defaultValue?: string): string {
  const value = process.env[name];
  if (!value && !defaultValue) {
    throw new Error(`Environment variable ${name} is required but not set`);
  }
  return value || defaultValue!;
}

function getOptionalEnvVar(name: string, defaultValue: string): string {
  return process.env[name] || defaultValue;
}

export const appConfig: Config = {
  gemini: {
    apiUrl: getEnvVar('GEMINI_API_URL'),
    apiKey: getEnvVar('GEMINI_API_KEY'),
  },
  port: parseInt(getOptionalEnvVar('PORT', '3001'), 10),
};