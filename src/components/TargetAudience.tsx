"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./TargetAudience.module.css";

gsap.registerPlugin(ScrollTrigger);

const audiences = [
  {
    id: 1,
    title: "Professionals",
    description:
      "Draft marketing copy, sales emails, and business content faster than ever before.",
    features: ["Marketing Teams", "Copywriters", "Business Owners"],
    icon: (
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  {
    id: 2,
    title: "Learners",
    description:
      "Explore interesting new angles for projects and learn effective copywriting techniques.",
    features: ["Students", "New Writers", "Career Changers"],
    icon: (
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
  },
  {
    id: 3,
    title: "Personal Use",
    description:
      "Spark creative ideas for personal projects, blogs, social media, and more.",
    features: ["Bloggers", "Creators", "Side Hustlers"],
    icon: (
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ),
  },
];

export default function TargetAudience() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(cardsRef.current?.children || [], {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        },
        y: 60,
        opacity: 0,
        scale: 0.9,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
      });

      // Card flip effect on hover
      const cards = cardsRef.current?.querySelectorAll(`.${styles.card}`);
      cards?.forEach((card) => {
        const front = card.querySelector(`.${styles.cardFront}`);
        const back = card.querySelector(`.${styles.cardBack}`);

        card.addEventListener("mouseenter", () => {
          gsap.to(card, { rotateY: 180, duration: 0.6, ease: "power2.inOut" });
          gsap.to(front, { opacity: 0, duration: 0.3 });
          gsap.to(back, { opacity: 1, duration: 0.3, delay: 0.3 });
        });

        card.addEventListener("mouseleave", () => {
          gsap.to(card, { rotateY: 0, duration: 0.6, ease: "power2.inOut" });
          gsap.to(front, { opacity: 1, duration: 0.3, delay: 0.3 });
          gsap.to(back, { opacity: 0, duration: 0.3 });
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="audience" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Who It&apos;s For</h2>
          <p className={styles.subtitle}>
            Powerful copy generation for everyone
          </p>
        </div>

        <div ref={cardsRef} className={`${styles.cards} perspective`}>
          {audiences.map((audience) => (
            <div key={audience.id} className={`${styles.card} preserve-3d`}>
              <div className={styles.cardFront}>
                <div className={styles.iconWrapper}>{audience.icon}</div>
                <h3 className={styles.cardTitle}>{audience.title}</h3>
                <p className={styles.cardDescription}>{audience.description}</p>
              </div>
              <div className={styles.cardBack}>
                <h3 className={styles.cardTitle}>{audience.title}</h3>
                <ul className={styles.featureList}>
                  {audience.features.map((feature, index) => (
                    <li key={index} className={styles.featureItem}>
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
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
