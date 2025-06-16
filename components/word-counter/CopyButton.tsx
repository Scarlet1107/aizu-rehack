import { useState } from "react";
import { Check, Clipboard } from "lucide-react";
import { Button } from "../ui/button";

interface Props {
  textToCopy: string;
}

export default function CopyButton({ textToCopy }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    } catch (error) {
      console.error("Failed to copy text: ", error);
    }
  };

  return (
    <Button
      onClick={handleCopy}
      variant="outline"
      className="flex items-center space-x-2 mt-4"
    >
      {copied ? (
        <Check className="w-4 h-4" />
      ) : (
        <Clipboard className="w-4 h-4" />
      )}
      <span>コピー</span>
    </Button>
  );
}
