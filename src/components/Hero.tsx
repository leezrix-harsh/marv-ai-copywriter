"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import styles from "./Hero.module.css";

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Create timeline for coordinated animations
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Title animation with 3D effect
      tl.from(titleRef.current, {
        y: 100,
        opacity: 0,
        rotateX: -20,
        duration: 1,
        transformOrigin: "bottom center",
      })
        .from(
          subtitleRef.current,
          {
            y: 50,
            opacity: 0,
            duration: 0.8,
          },
          "-=0.5"
        )
        .fromTo(
          statsRef.current?.children || [],
          {
            y: 30,
            opacity: 0,
            scale: 0.9,
          },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.6,
            stagger: 0.15,
          },
          "-=0.3"
        );

      // Floating animation for stats
      gsap.to(statsRef.current?.children || [], {
        y: -5,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.2,
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} className={styles.hero}>
      <div className={styles.backgroundGlow}></div>
      <div className={styles.container}>
        <h1 ref={titleRef} className={styles.title}>
          <span className={styles.titleLine}>Craft Compelling</span>
          <span className={`${styles.titleLine} ${styles.titleAccent}`}>
            Copy in Seconds
          </span>
        </h1>

        <p ref={subtitleRef} className={styles.subtitle}>
          Transform your ideas into powerful marketing copy with AI. 
          Whether you&apos;re writing for a brand, product, or personal project—
          Marv AI delivers results that convert.
        </p>

        <div ref={statsRef} className={styles.stats}>
          <div className={styles.statItem}>
            <span className={styles.statIcon}>⚡</span>
            <span className={styles.statText}>Lightning Fast</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statIcon}>★</span>
            <span className={styles.statText}>High Quality Output</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statIcon}>∞</span>
            <span className={styles.statText}>Unlimited Creativity</span>
          </div>
        </div>
      </div>
    </section>
  );
}
