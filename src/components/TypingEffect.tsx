import { useEffect, useState } from "react";

interface Props {
  words: string[];
  className?: string;
}

const TypingEffect = ({ words, className }: Props) => {
  const [currentWord, setCurrentWord] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const word = words[currentWord];
    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          if (currentChar < word.length) {
            setCurrentChar(currentChar + 1);
          } else {
            setTimeout(() => setIsDeleting(true), 1500);
          }
        } else {
          if (currentChar > 0) {
            setCurrentChar(currentChar - 1);
          } else {
            setIsDeleting(false);
            setCurrentWord((currentWord + 1) % words.length);
          }
        }
      },
      isDeleting ? 40 : 80
    );

    return () => clearTimeout(timeout);
  }, [currentChar, isDeleting, currentWord, words]);

  return (
    <span className={className}>
      {words[currentWord].substring(0, currentChar)}
      <span className="animate-pulse text-primary">|</span>
    </span>
  );
};

export default TypingEffect;
