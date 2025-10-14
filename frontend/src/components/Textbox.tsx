"use client";

import React, { useState, FormEvent, ChangeEvent } from "react";
import type { ReactElement } from "react";

export default function Textbox(): ReactElement {
  const [text, setText] = useState<string>("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    console.log("Submitted text:", text);
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
    setText(e.target.value);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Main content above */}
      <div className="flex-1"></div>

      {/* Form stuck at the bottom */}
      <form
        onSubmit={handleSubmit}
        className="max-w-xl w-full mx-auto p-4 flex flex-col space-y-4 rounded-2xl shadow"
        style={{
          backgroundColor: "var(--color-BG)",
          color: "var(--color-Text)",
          border: "1px solid var(--color-P1)",
        }}
      >
        <textarea
          value={text}
          onChange={handleChange}
          placeholder="Type your paragraph here..."
          rows={6}
          className="w-full p-3 rounded-lg resize-none"
          style={{
            border: "1px solid var(--color-P3)",
            backgroundColor: "var(--color-BG)",
            color: "var(--color-Text)",
          }}
        />

        <button
          type="submit"
          className="self-center px-6 py-2 rounded-xl transition btn-primary"
          style={{
            backgroundColor: "var(--color-P3)",
            color: "var(--color-Text-Inverse)",
          }}
          onMouseEnter={(e): void => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor =
              "var(--color-P1)";
          }}
          onMouseLeave={(e): void => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor =
              "var(--color-P3)";
          }}
        >
          Submit
        </button>
      </form>
    </div>
  );
}
