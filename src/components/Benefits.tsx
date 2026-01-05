"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./Benefits.module.css";

gsap.registerPlugin(ScrollTrigger);

const benefits = [
  {
    id: 1,
    title: "Generate Ideas",
    description:
      "Overcome writer's block with AI-powered suggestions built around your keywords and brand voice.",
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      </svg>
    ),
  },
  {
    id: 2,
    title: "Add Structure",
    description:
      "Get clear, well-organized content that provides a strong foundation for your final product.",
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <line x1="3" y1="9" x2="21" y2="9" />
        <line x1="9" y1="21" x2="9" y2="9" />
      </svg>
    ),
  },
  {
    id: 3,
    title: "Save Time",
    description:
      "Speed up your workflow with strong outputs that are ready to refine, publish, or share instantly.",
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
];

export default function Benefits() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(cardsRef.current?.children || [], 
        {
          x: -60,
          opacity: 0,
          rotateY: 20,
        },
        {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
          },
          x: 0,
          opacity: 1,
          rotateY: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
        }
      );

      // 3D hover effect
      const cards = cardsRef.current?.querySelectorAll(`.${styles.card}`);
      cards?.forEach((card) => {
        card.addEventListener("mousemove", (e: Event) => {
          const mouseEvent = e as MouseEvent;
          const target = mouseEvent.currentTarget as HTMLElement;
          const rect = target.getBoundingClientRect();
          const x = mouseEvent.clientX - rect.left;
          const y = mouseEvent.clientY - rect.top;
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;
          const rotateX = (y - centerY) / 10;
          const rotateY = (centerX - x) / 10;

          gsap.to(target, {
            rotateX: rotateX,
            rotateY: rotateY,
            duration: 0.3,
            ease: "power2.out",
          });
        });

        card.addEventListener("mouseleave", (e: Event) => {
          const target = e.currentTarget as HTMLElement;
          gsap.to(target, {
            rotateX: 0,
            rotateY: 0,
            duration: 0.5,
            ease: "power2.out",
          });
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="benefits" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Why Use AI Copy?</h2>
          <p className={styles.subtitle}>
            Unlock your creative potential with intelligent assistance
          </p>
        </div>

        <div ref={cardsRef} className={`${styles.cards} perspective`}>
          {benefits.map((benefit) => (
            <div key={benefit.id} className={`${styles.card} preserve-3d`}>
              <div className={styles.iconWrapper}>{benefit.icon}</div>
              <h3 className={styles.cardTitle}>{benefit.title}</h3>
              <p className={styles.cardDescription}>{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
