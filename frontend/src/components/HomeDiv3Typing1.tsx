"use client";

import { useState, useEffect } from "react";

const words = ["Word Count", "Language Detection", "Plaigarism Detection", "Tone Analysis", "Sentiment Analysis", "Grammar Check"];

export default function TypingEffect1() {
  const [text, setText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [speed, setSpeed] = useState(150); // typing speed

  useEffect(() => {
    const currentWord = words[wordIndex];

    const handleTyping = () => {
      if (!isDeleting) {
        // typing forward
        const newText = currentWord.substring(0, text.length + 1);
        setText(newText);

        if (newText === currentWord) {
          // pause before deleting
          setIsDeleting(true);
          setSpeed(1000); // wait 1s before deleting
        } else {
          setSpeed(150); // normal typing speed
        }
      } else {
        // deleting backward
        const newText = currentWord.substring(0, text.length - 1);
        setText(newText);

        if (newText === "") {
          setIsDeleting(false);
          setWordIndex((prev) => (prev + 1) % words.length);
          setSpeed(300); // pause before typing next word
        } else {
          setSpeed(100); // deleting speed
        }
      }
    };

    const timeout = setTimeout(handleTyping, speed);

    return () => clearTimeout(timeout);
  }, [text, isDeleting, wordIndex, speed]);

  return (
    <div className="flex items-center justify-center">
      <h1 className="text-4xl font-bold text-[var(--color-P1)]">
        {text}
        <span className="animate-pulse">|</span>
      </h1>
    </div>
  );
}
