import { useTypingEffect } from "../hooks/useTypingEffect";

export default function TypingText({ text, speed = 25, className = "" }) {
  const { displayed, isComplete } = useTypingEffect(text, speed);

  return (
    <p className={className}>
      {displayed}
      {!isComplete && <span className="typing-cursor" />}
    </p>
  );
}
