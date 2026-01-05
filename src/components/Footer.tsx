"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./Footer.module.css";

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(footerRef.current, {
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 95%",
        },
        y: 30,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
      });
    }, footerRef);

    return () => ctx.revert();
  }, []);

  const currentYear = new Date().getFullYear();

  return (
    <footer ref={footerRef} className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.brand}>
            <div className={styles.logo}>
              <img src="/logo.png" alt="Marv AI" className={styles.logoIcon} />
              <span className={styles.logoText}>Marv AI Copywriter</span>
            </div>
            <p className={styles.tagline}>
              Craft compelling copy in seconds with AI.
            </p>
          </div>

          <div className={styles.links}>
            <div className={styles.linkGroup}>
              <h4 className={styles.linkTitle}>Product</h4>
              <a href="#how-it-works" className={styles.link}>
                How It Works
              </a>
              <a href="#benefits" className={styles.link}>
                Benefits
              </a>
              <a href="#audience" className={styles.link}>
                Who It&apos;s For
              </a>
            </div>

            <div className={styles.linkGroup}>
              <h4 className={styles.linkTitle}>Resources</h4>
              <a href="https://ai-sdk.dev/docs" target="_blank" rel="noopener noreferrer" className={styles.link}>
                Documentation
              </a>
              <a href="https://ai-sdk.dev/docs/reference/ai-sdk-core" target="_blank" rel="noopener noreferrer" className={styles.link}>
                API Reference
              </a>
              <a href="https://ai-sdk.dev/cookbook" target="_blank" rel="noopener noreferrer" className={styles.link}>
                Examples
              </a>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copyright}>
            © {currentYear} Marv AI Copywriter. All rights reserved.
          </p>
          <p className={styles.powered}>
            Powered by AI Cloud
          </p>
        </div>
      </div>
    </footer>
  );
}
