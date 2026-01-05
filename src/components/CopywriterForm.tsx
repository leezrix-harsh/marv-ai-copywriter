"use client";

import { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import ReactMarkdown from "react-markdown";
import styles from "./CopywriterForm.module.css";

interface CopywriterFormProps {
  onSampleClick?: (prompt: string) => void;
}

export default function CopywriterForm({ onSampleClick }: CopywriterFormProps) {
  const [prompt, setPrompt] = useState("");
  const [output, setOutput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const formRef = useRef<HTMLDivElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Expose setPrompt for sample prompts
  useEffect(() => {
    if (onSampleClick) {
      // This will be handled by parent component
    }
  }, [onSampleClick]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(formRef.current, {
        y: 60,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        delay: 0.3,
      });
    }, formRef);

    return () => ctx.revert();
  }, []);

  // Track if we've already animated the output appearance
  const hasAnimatedOutput = useRef(false);

  // Animate output only when it first appears (not on every streaming update)
  useEffect(() => {
    if (output && outputRef.current && !hasAnimatedOutput.current) {
      hasAnimatedOutput.current = true;
      gsap.fromTo(
        outputRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" }
      );
    }
    // Reset the flag when output is cleared
    if (!output) {
      hasAnimatedOutput.current = false;
    }
  }, [output]);

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    setError("");
    setOutput("");

    // Button press animation
    if (buttonRef.current) {
      gsap.to(buttonRef.current, {
        scale: 0.95,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
      });
    }

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate copy");
      }

      // Handle streaming response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        let fullText = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          const chunk = decoder.decode(value, { stream: true });
          fullText += chunk;
          setOutput(fullText);
        }
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Make sure Ollama is running."
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    if (!output) return;
    
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && e.ctrlKey) {
      handleGenerate();
    }
  };

  // Public method to set prompt from outside
  const setPromptFromSample = (samplePrompt: string) => {
    setPrompt(samplePrompt);
    // Scroll to form
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  // Attach to window for sample prompts access
  useEffect(() => {
    (window as unknown as { setMarvPrompt: (p: string) => void }).setMarvPrompt = setPromptFromSample;
    return () => {
      delete (window as unknown as { setMarvPrompt?: (p: string) => void }).setMarvPrompt;
    };
  }, []);

  return (
    <section id="copywriter-form" className={styles.section}>
      <div ref={formRef} className={styles.formWrapper}>
        <div className={styles.inputGroup}>
          <label htmlFor="prompt" className={styles.label}>
            What would you like to create?
          </label>
          <textarea
            id="prompt"
            className={`input textarea ${styles.textarea}`}
            placeholder="Describe your product, service, or idea. Be specific about tone, audience, and goals..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isGenerating}
          />
          <span className={styles.hint}>
            Tip: Press Ctrl + Enter to generate
          </span>
        </div>

        <button
          ref={buttonRef}
          type="button"
          className={`btn btn-primary btn-3d ${styles.generateButton}`}
          onClick={handleGenerate}
          disabled={isGenerating || !prompt.trim()}
        >
          {isGenerating ? (
            <>
              <span className="spinner"></span>
              Generating...
            </>
          ) : (
            <>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
              Generate Copy
            </>
          )}
        </button>

        {error && (
          <div className={styles.error}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {error}
          </div>
        )}

        {output && (
          <div ref={outputRef} className={styles.outputWrapper}>
            <div className={styles.outputHeader}>
              <span className={styles.outputLabel}>Generated Copy</span>
              <button
                className={`btn btn-ghost ${styles.copyButton}`}
                onClick={handleCopy}
              >
                {copied ? (
                  <>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                    Copy
                  </>
                )}
              </button>
            </div>
            <div className={styles.outputContent}>
              <ReactMarkdown>{output}</ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
