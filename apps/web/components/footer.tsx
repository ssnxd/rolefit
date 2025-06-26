"use client";

import Image from "next/image";

/**
 * Footer Component
 *
 * Displays the Woolf logo and attribution text at the bottom of the page.
 * Created for the Woolf Full Stack Developer role assessment.
 */
export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col items-center justify-center space-y-4">
          {/* Woolf Logo */}
          <div className="flex items-center">
            <Image
              src="/woolf_logo.svg"
              alt="Woolf Logo"
              width={128}
              height={20}
              className="h-5 w-auto"
            />
          </div>

          {/* Attribution Text */}
          <div className="text-center space-y-2">
            <p className="text-sm text-gray-600">
              Made for{" "}
              <a
                href="https://woolf.university/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-gray-900 hover:text-blue-600 transition-colors duration-200"
              >
                Woolf
              </a>{" "}
              by{" "}
              <a
                href="https://surajnegi.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-gray-900 hover:text-blue-600 transition-colors duration-200"
              >
                Suraj Singh Negi
              </a>{" "}
              for{" "}
              <span className="font-semibold text-gray-900">
                Full Stack Developer
              </span>{" "}
              role
            </p>

            {/* Repository Link */}
            <p className="text-xs text-gray-500">
              <a
                href="https://github.com/ssnxd/rolefit"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-700 transition-colors duration-200 underline"
              >
                View source code on GitHub
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
