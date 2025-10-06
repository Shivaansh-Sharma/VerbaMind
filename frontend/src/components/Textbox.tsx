"use client";
import React, { useState, FormEvent, ChangeEvent } from "react";

export default function Text(): JSX.Element {
  const [text, setText] = useState<string>("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    console.log("Submitted text:", text);
    // your submit logic here
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
    setText(e.target.value);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto p-4 flex flex-col space-y-4 rounded-2xl shadow"
      style={{
        backgroundColor: "var(--color-BG)",
        color: "var(--color-Text)",
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
        className="self-center px-6 py-2 rounded-xl transition"
        style={{
          backgroundColor: "var(--color-P2)",
          color: "#fff",
        }}
        onMouseEnter={(e): void => {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor =
            "var(--color-P3)";
        }}
        onMouseLeave={(e): void => {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor =
            "var(--color-P2)";
        }}
      >
        Submit
      </button>
    </form>
  );
}
