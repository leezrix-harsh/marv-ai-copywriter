"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./SamplePrompts.module.css";

gsap.registerPlugin(ScrollTrigger);

const samplePrompts = [
  {
    id: 1,
    category: "Product Launch",
    prompt: "Write an exciting product launch announcement for a revolutionary smart water bottle that tracks hydration and syncs with fitness apps",
    preview: "Introducing HydroSync™ — Your Personal Hydration Coach",
  },
  {
    id: 2,
    category: "Social Media",
    prompt: "Create an engaging Instagram caption for a sustainable fashion brand's new eco-friendly summer collection",
    preview: "Summer never looked this good 🌿",
  },
  {
    id: 3,
    category: "Email Marketing",
    prompt: "Write a compelling email subject line and opening paragraph for a SaaS product offering 50% off annual subscriptions",
    preview: "Your productivity is about to skyrocket ✨",
  },
  {
    id: 4,
    category: "Landing Page",
    prompt: "Create hero section copy for a meditation app targeting busy professionals who struggle with stress",
    preview: "Find your calm in the chaos",
  },
  {
    id: 5,
    category: "Ad Copy",
    prompt: "Write a Facebook ad for a premium meal prep delivery service that caters to fitness enthusiasts",
    preview: "Fuel your gains, skip the meal prep",
  },
  {
    id: 6,
    category: "SEO Blog",
    prompt: "Write an SEO-optimized blog intro about the top 5 benefits of remote work for creative professionals",
    preview: "Why creatives are thriving from home",
  },
];

export default function SamplePrompts() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Scroll-triggered entrance animation
      gsap.fromTo(cardsRef.current?.children || [], 
        {
          y: 60,
          opacity: 0,
          rotateY: -15,
          scale: 0.9,
        },
        {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
          y: 0,
          opacity: 1,
          rotateY: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
        }
      );

      // Add 3D hover effects to each card
      const cards = cardsRef.current?.querySelectorAll(`.${styles.card}`);
      cards?.forEach((card) => {
        card.addEventListener("mouseenter", (e) => {
          const target = e.currentTarget as HTMLElement;
          gsap.to(target, {
            rotateY: 8,
            rotateX: -4,
            scale: 1.02,
            z: 30,
            boxShadow: "0 25px 50px rgba(0,0,0,0.5), 0 0 40px rgba(255,255,255,0.05)",
            duration: 0.4,
            ease: "power2.out",
          });
        });

        card.addEventListener("mouseleave", (e) => {
          const target = e.currentTarget as HTMLElement;
          gsap.to(target, {
            rotateY: 0,
            rotateX: 0,
            scale: 1,
            z: 0,
            boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
            duration: 0.4,
            ease: "power2.out",
          });
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleUsePrompt = (prompt: string) => {
    // Use the global function to set the prompt
    const setPrompt = (window as unknown as { setMarvPrompt?: (p: string) => void }).setMarvPrompt;
    if (setPrompt) {
      setPrompt(prompt);
    }
  };

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Sample Prompts</h2>
          <p className={styles.subtitle}>
            Get inspired by these examples—click any card to try it
          </p>
        </div>

        <div ref={cardsRef} className={`${styles.cards} perspective`}>
          {samplePrompts.map((item) => (
            <div
              key={item.id}
              className={`${styles.card} preserve-3d`}
              onClick={() => handleUsePrompt(item.prompt)}
            >
              <span className={styles.category}>{item.category}</span>
              <p className={styles.preview}>{item.preview}</p>
              <p className={styles.prompt}>{item.prompt}</p>
              <div className={styles.useButton}>
                <span>Use this prompt</span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
