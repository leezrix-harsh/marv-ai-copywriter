"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import styles from "./Header.module.css";

export default function Header() {
  const headerRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial animation
      gsap.from(logoRef.current, {
        y: -30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });

      gsap.fromTo(navRef.current?.children || [], 
        {
          y: -20,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "power3.out",
          delay: 0.2,
        }
      );

      // 3D tilt effect on logo hover
      const logo = logoRef.current;
      if (logo) {
        logo.addEventListener("mouseenter", () => {
          gsap.to(logo, {
            rotateY: 10,
            rotateX: -5,
            scale: 1.05,
            duration: 0.3,
            ease: "power2.out",
          });
        });

        logo.addEventListener("mouseleave", () => {
          gsap.to(logo, {
            rotateY: 0,
            rotateX: 0,
            scale: 1,
            duration: 0.3,
            ease: "power2.out",
          });
        });
      }
    }, headerRef);

    return () => ctx.revert();
  }, []);

  return (
    <header ref={headerRef} className={styles.header}>
      <div className={styles.container}>
        <div ref={logoRef} className={styles.logo}>
          <img src="/logo.png" alt="Marv AI" className={styles.logoIcon} />
          <span className={styles.logoText}>Marv AI Copywriter</span>
        </div>

        <nav ref={navRef} className={styles.nav}>
          <a href="#how-it-works" className={styles.navLink}>
            How It Works
          </a>
          <a href="#benefits" className={styles.navLink}>
            Benefits
          </a>
          <a href="#audience" className={styles.navLink}>
            Who It&apos;s For
          </a>
          <a href="#copywriter-form" className={`btn btn-primary btn-3d ${styles.ctaButton}`}>
            Get Started
          </a>
        </nav>
      </div>
    </header>
  );
}
