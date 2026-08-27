"use client";

import { colorTokens, typographyTokens } from "@/features/design-system/tokens";
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "framer-motion";
import type { Transition } from "framer-motion";
import { useEffect, useState, type ReactNode } from "react";
import { twMerge } from "tailwind-merge";

const colors = {
  charcoal: colorTokens[0].value,
  black: colorTokens[1].value,
  cream: colorTokens[2].value,
  blue: colorTokens[3].value,
} as const;

const headingStyle = typographyTokens[0];
const bodyStyle = typographyTokens[1];
const bodyHeadingStyle = typographyTokens[2];
const linkStyle = typographyTokens[3];

/** Muted body copy color from design tokens — page default text so prose doesn’t inherit Tailwind body `foreground` */
const bodyMutedColor = bodyStyle.color;

const sections = [
  {
    id: "connected-tv",
    title: "Connected TV",
    company: "Meta",
    cta: "See Prototype",
    href: "/ctv/Alpha",
    body: [
      "Meta generates revenue by selling ads across its ecosystem of apps — Facebook, Instagram, and WhatsApp. But relying solely on owned social inventory caps its growth ceiling.",
      "Entering the $30B Connected TV market opens an entirely new supply category: high-margin, untapped, and additive to what Meta can offer its customers.",
      "The project had two core challenges. First, finding where a net-new ad vertical belongs inside a system largely unchanged since 2007. Second, reconciling industry constraints and expectations across a wide range of internal stakeholders and disparate teams.",
    ],
  },
  {
    id: "campaign-planner",
    title: "Campaign Planner",
    company: "Meta",
    cta: "See Prototype",
    href: "/campaign-planner/prototype",
    body: [
      "Media planning is a critical step for brand advertisers as they manage substantial budgets with high impact ROI goals. Meta invested in tools to help advertisers plan their large brand budgets in 2016, but haven’t updated them since.",
      "By revisiting its campaign planning tools, Meta can be a serious competitor in the $150B+ brand advertising market, better serving customers and capturing more brand budget.",
      "Working with a lean team on a tight timeline, I led the campaign planner redesign by prototyping multiple iterations of the experience, evaluating them internally and externally, then partnering closely with engineering and product to bring it to production.",
    ],
  },
  {
    id: "langchain-alt",
    title: "LangChain Alt",
    company: "Intelligence",
    cta: "See Prototype",
    href: "/intelligence",
    body: [
      "AI development/LLMops tools like LangSmith and Braintrust have experienced concentrated hyper growth at the expense of thoughtful UX.",
      "In addition to a myriad of unexpected interactions, layouts, and circular workflows, the fundamental issue I want to highlight is product hierarchy and information architecture.",
      "There is an opportunity to learn from what has enabled these tools to succeed, and where they could continue to improve. In both tools, teams are forced to build their evaluators, metrics, and frameworks in siloes, resulting an enormous amount of rework and eventual disconnect.",
    ],
  },
  {
    id: "query-builder",
    title: "Query Builder",
    company: "Mixpanel",
    cta: undefined,
    href: undefined,
    body: [
      "Mixpanel allows teams to ask and answer questions about this data without writing any code/SQL.",
      "Designing a consumer-grade data querying system that can be used by data scientists at Uber-size companies with hundreds of ever-changing data warehouse tables and new team members at startups that just got off the ground, is a substantially complex challenge.",
      "By focusing on analytics first principles, we were able to unify the entire query language, restructure the core report offerings, and design a system that could unfold and meet users where they were in their analytics journey.",
    ],
  },
  {
    id: "dashboard-architecture",
    title: "Dashboard",
    company: "Mixpanel",
    cta: "See Post",
    href: "https://mixpanel.com/blog/3-updates-weve-made-to-dashboards-to-improve-workflows-across-teams/",
    body: [
      "Mixpanel was founded prior to the emergence of multiplayer collaboration; the product was structured to help individuals ask and answer their data questions in isolation.",
      "Mixpanel wasn’t evolving to meet the needs and structure of the teams it was serving, and as a result, Mixpanel encountered an inevitable churn problem.",
      "By re-architecting the product to align with the structure and needs of its current customers, we were not only able to address churn head on, but we also paved the way for a suite of new collaboration-focused features.",
    ],
  },
] as const;

const heroCards = [
  {
    section: sections[0],
    label: "Connected TV",
    image: "/prototype-index/hero-cards/connected-tv.png",
    rotation: -9,
    y: 7,
  },
  {
    section: sections[1],
    label: "Campaign Planner",
    image: "/prototype-index/hero-cards/campaign-planner.png",
    rotation: -4,
    y: -3,
  },
  {
    section: sections[2],
    label: "LangChain Alt",
    image: "/prototype-index/hero-cards/langchain-alt.png",
    rotation: 0,
    y: -5,
  },
  {
    section: sections[3],
    label: "Query Builder",
    image: "/prototype-index/hero-cards/query-builder.png",
    rotation: 4,
    y: 1,
  },
  {
    section: sections[4],
    label: "Dashboard",
    image: "/prototype-index/hero-cards/dashboard-architecture.png",
    rotation: 8,
    y: 5,
  },
] as const;

type AvatarColor = "blue" | "white" | "red" | "black";

const avatarSrc: Record<AvatarColor, string> = {
  blue: "/prototype-index/avatars/blue.png",
  white: "/prototype-index/avatars/white.png",
  red: "/prototype-index/avatars/red.png",
  black: "/prototype-index/avatars/black.png",
};

const avatarColorOrder: AvatarColor[] = ["black", "blue", "red", "white"];

const sectionAvatarMap: { id: string; color: AvatarColor }[] = [
  { id: "campaign-planner", color: "red" },
  { id: "langchain-alt", color: "blue" },
  { id: "query-builder", color: "red" },
  { id: "dashboard-architecture", color: "white" },
];

function FixedLogo() {
  const shouldReduceMotion = useReducedMotion();
  const [color, setColor] = useState<AvatarColor>("black");

  useEffect(() => {
    const targets = sectionAvatarMap
      .map(({ id, color }) => {
        const el = document.getElementById(id);
        return el ? { el, color } : null;
      })
      .filter((x): x is { el: HTMLElement; color: AvatarColor } => x !== null);

    function update() {
      const threshold = window.innerHeight * 0.35;
      let active: AvatarColor = "black";
      for (const { el, color } of targets) {
        if (el.getBoundingClientRect().top <= threshold) active = color;
      }
      setColor((prev) => (prev === active ? prev : active));
    }

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <a
      href="#top"
      aria-label="Back to top"
      className="fixed left-4 top-4 z-50 block h-12 w-12 md:left-6 md:top-6"
    >
      {avatarColorOrder.map((key) => (
        <motion.img
          key={key}
          src={avatarSrc[key]}
          alt=""
          className="absolute inset-0 h-full w-full"
          initial={false}
          animate={{ opacity: color === key ? 1 : 0 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.45, ease: "easeOut" }}
        />
      ))}
    </a>
  );
}

function RevealOnScroll({
  children,
  className,
  variant = "text",
  delay = 0,
  translate = true,
}: {
  children: ReactNode;
  className?: string;
  variant?: "text" | "media";
  delay?: number;
  /** When false, only opacity fades in (safe for `position: fixed`; no Y transform). */
  translate?: boolean;
}) {
  const shouldReduceMotion = useReducedMotion();
  const distance = variant === "media" ? 32 : 20;
  return (
    <motion.div
      className={className}
      initial={{
        opacity: shouldReduceMotion ? 1 : 0,
        ...(translate && !shouldReduceMotion ? { y: distance } : {}),
      }}
      whileInView={
        shouldReduceMotion
          ? undefined
          : {
              opacity: 1,
              ...(translate ? { y: 0 } : {}),
            }
      }
      viewport={{ once: true, amount: 0.12, margin: "0px 0px -72px 0px" }}
      transition={{
        duration: shouldReduceMotion ? 0 : variant === "media" ? 0.56 : 0.45,
        delay: shouldReduceMotion ? 0 : delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      {children}
    </motion.div>
  );
}

function ExternalTextLink({
  href,
  children,
}: {
  href?: string;
  children: ReactNode;
}) {
  const linkUnderlineClass = "section-external-link";
  const mutedUnderlineClass = "section-external-link--static";
  const style = {
    color: "inherit",
    fontFamily: "inherit",
    fontSize: "inherit",
    fontWeight: "inherit",
    letterSpacing: "inherit",
    lineHeight: "inherit",
  };

  if (!href) {
    return (
      <span className={mutedUnderlineClass} style={style} aria-disabled="true">
        {children}
      </span>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={linkUnderlineClass}
      style={style}
    >
      {children}
    </a>
  );
}

function HeroCardNav() {
  const { scrollY } = useScroll();
  const [showStickyNav, setShowStickyNav] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const stickyOpacity = useTransform(scrollY, [90, 190], [0, 1]);
  const stickyScale = useTransform(scrollY, [90, 360], [1.7, 1]);
  const stickyY = useTransform(scrollY, [90, 360], [-38, 0]);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setShowStickyNav(latest > 90);
  });

  const spring: Transition = shouldReduceMotion
    ? { duration: 0 }
    : { type: "spring", stiffness: 320, damping: 18 };

  return (
    <>
      <nav aria-label="Project sections" className="mx-auto mt-[76px] w-[calc(100vw-40px)] max-w-[820px]">
        <div className="flex flex-nowrap items-start justify-center overflow-visible px-0">
          {heroCards.map((card, index) => {
            const restRotate = shouldReduceMotion ? 0 : card.rotation;
            const restY = shouldReduceMotion ? 0 : card.y;
            const entranceLift = 62;
            return (
              <motion.a
                key={card.section.id}
                href={`#${card.section.id}`}
                className={`group block w-[clamp(104px,17vw,170px)] shrink-0 outline-none ${
                  index === 0 ? "" : "-ml-2 sm:-ml-3"
                }`}
                initial={
                  shouldReduceMotion
                    ? { opacity: 1, y: restY, rotate: restRotate, scale: 1 }
                    : {
                        opacity: 0,
                        y: restY + entranceLift,
                        rotate: 0,
                        scale: 0.88,
                      }
                }
                whileInView={
                  shouldReduceMotion
                    ? undefined
                    : { opacity: 1, y: restY, rotate: restRotate, scale: 1 }
                }
                viewport={{ once: true, amount: 0.3, margin: "0px 0px -40px 0px" }}
                whileHover={{ rotate: 0, y: -11, scale: 1.045 }}
                whileFocus={{ rotate: 0, y: -11, scale: 1.045 }}
                transition={{
                  ...spring,
                  delay: shouldReduceMotion ? 0 : index * 0.072,
                }}
                style={{ zIndex: heroCards.length - index }}
              >
                <span className={`block aspect-[175/274] overflow-hidden rounded-[10px] bg-white shadow-[0_18px_60px_rgba(0,0,0,0.28)] ${
                  card.section.id === "langchain-alt" ? "ring-[0.5px] ring-white/[0.15]" : ""
                }`}>
                  <img
                    src={card.image}
                    alt=""
                    className="h-full w-full object-cover object-top"
                    loading={index === 0 ? "eager" : "lazy"}
                  />
                </span>
                <span
                  className="pointer-events-none mt-4 block translate-y-1 text-center opacity-0 transition duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100"
                  style={{
                    color: bodyMutedColor,
                    fontFamily: bodyStyle.fontFamily,
                    fontSize: "13px",
                    fontWeight: bodyStyle.weight,
                    letterSpacing: bodyStyle.letterSpacing,
                    lineHeight: bodyStyle.lineHeight,
                  }}
                >
                  {card.label}{card.section.id !== "langchain-alt" && <>{" "}<span className="font-bold">•</span> {card.section.company}</>}
                </span>
              </motion.a>
            );
          })}
        </div>
      </nav>

      <AnimatePresence>
        {false && showStickyNav ? (
          <motion.nav
            aria-label="Sticky project section navigation"
            className="fixed left-1/2 top-5 z-50 flex items-center gap-2 rounded-[14px] border border-white/10 bg-black/70 p-2 shadow-[0_18px_50px_rgba(0,0,0,0.35)] backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.96 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.22, ease: "easeOut" }}
            style={{
              x: "-50%",
              opacity: shouldReduceMotion ? 1 : stickyOpacity,
              scale: shouldReduceMotion ? 1 : stickyScale,
              y: shouldReduceMotion ? 0 : stickyY,
              transformOrigin: "center top",
            }}
          >
            {heroCards.map((card) => (
              <motion.a
                key={card.section.id}
                href={`#${card.section.id}`}
                aria-label={`Jump to ${card.label}`}
                className="block h-11 w-11 overflow-hidden rounded-[7px] bg-white outline-none ring-white/60 transition focus-visible:ring-2 sm:h-[52px] sm:w-[52px]"
                whileHover={{ y: -3, scale: 1.06 }}
                whileFocus={{ y: -3, scale: 1.06 }}
                transition={spring}
              >
                <img src={card.image} alt="" className="h-full w-full object-cover object-top" loading="lazy" />
              </motion.a>
            ))}
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </>
  );
}

function SectionIntro({ section }: { section: (typeof sections)[number] }) {
  return (
    <section
      id={section.id}
      aria-labelledby={`${section.id}-heading`}
      className="mx-auto flex w-full max-w-[540px] scroll-mt-24 flex-col"
    >
      <RevealOnScroll variant="text" className="flex w-full flex-col gap-6">
        <h2
          id={`${section.id}-heading`}
          className="min-w-0"
          style={{
            color: "#E6E6E6",
            fontFamily: bodyHeadingStyle.fontFamily,
            fontSize: bodyHeadingStyle.size,
            fontWeight: "500",
            letterSpacing: bodyHeadingStyle.letterSpacing,
            lineHeight: bodyHeadingStyle.lineHeight,
          }}
        >
          {section.title}
          {section.cta ? (
            <>
              {" "}
              <span className="font-bold">•</span>{" "}
              <ExternalTextLink href={section.href}>{section.cta}</ExternalTextLink>
            </>
          ) : null}
        </h2>

        <div
          className="space-y-[26px]"
          style={{
            color: bodyMutedColor,
            fontFamily: bodyStyle.fontFamily,
            fontSize: bodyStyle.size,
            fontWeight: bodyStyle.weight,
            letterSpacing: bodyStyle.letterSpacing,
            lineHeight: bodyStyle.lineHeight,
          }}
        >
          {section.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </RevealOnScroll>
    </section>
  );
}

function Caption({ children }: { children: ReactNode }) {
  return (
    <p
      className="mx-auto mb-6 max-w-[540px]"
      style={{
        color: bodyMutedColor,
        fontFamily: bodyStyle.fontFamily,
        fontSize: bodyStyle.size,
        fontWeight: bodyStyle.weight,
        letterSpacing: bodyStyle.letterSpacing,
        lineHeight: bodyStyle.lineHeight,
      }}
    >
      {children}
    </p>
  );
}

function MediaFrame({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={twMerge(
        "flex items-center justify-center rounded-[12px] bg-white/5 px-6 py-8",
        className,
      )}
    >
      {children}
    </div>
  );
}

function VideoBlock({
  src,
  className = "",
  poster,
}: {
  src: string;
  className?: string;
  poster?: string;
}) {
  return (
    <video
      className={twMerge("mx-auto block w-full rounded-sm object-cover", className)}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      poster={poster}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}

function ImageBlock({
  src,
  alt,
  className = "",
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className={twMerge("mx-auto block w-full rounded-sm", className)}
    />
  );
}

export default function HomePage() {
  return (
    <main id="top" className="min-h-screen overflow-x-hidden px-5 pb-7 pt-[142px] sm:px-8" style={{ backgroundColor: colors.charcoal, color: bodyMutedColor }}>
      <FixedLogo />

      <RevealOnScroll
        variant="text"
        translate={false}
        className="fixed right-6 top-4 z-50 flex h-12 items-center md:top-6"
      >
        <span
          style={{
            color: bodyMutedColor,
            fontFamily: bodyStyle.fontFamily,
            fontSize: bodyStyle.size,
            fontWeight: bodyStyle.weight,
            letterSpacing: bodyStyle.letterSpacing,
            lineHeight: bodyStyle.lineHeight,
          }}
        >
          Kaitlyn Siu
        </span>
      </RevealOnScroll>

      <RevealOnScroll variant="text" className="mx-auto flex w-full max-w-[540px] flex-col items-center text-center">
        <h1
          style={{
            color: "#E6E6E6",
            fontFamily: headingStyle.fontFamily,
            fontSize: "clamp(42px, 5vw, 50px)",
            fontWeight: headingStyle.weight,
            letterSpacing: headingStyle.letterSpacing,
            lineHeight: headingStyle.lineHeight,
          }}
        >
          Recent Work
        </h1>
        <p
          className="mt-6 max-w-[252px]"
          style={{
            color: bodyMutedColor,
            fontFamily: bodyStyle.fontFamily,
            fontSize: bodyStyle.size,
            fontWeight: bodyStyle.weight,
            letterSpacing: bodyStyle.letterSpacing,
            lineHeight: bodyStyle.lineHeight,
          }}
        >
          A collection of some projects across Meta and Mixpanel.
        </p>
      </RevealOnScroll>

      <HeroCardNav />

      <div className="mt-[160px]">
        <section>
          <SectionIntro section={sections[0]} />

          <figure className="mx-auto mt-24 max-w-[541px]">
            <RevealOnScroll variant="text">
              <Caption>
                <img
                  src="/prototype-index/connected-tv/images/instacart-logo.png"
                  alt=""
                  className="relative -top-1 mr-2 inline-block h-[17px] w-auto align-middle"
                  loading="lazy"
                />
                Instacart runs a Super Bowl ad on TV.{" "}
                <img
                  src="/prototype-index/connected-tv/images/meta-logo.png"
                  alt=""
                  className="relative -top-1 mx-2 inline-block h-[17px] w-auto align-middle"
                  loading="lazy"
                />
                Meta allows Instacart to retarget viewers of their Super Bowl TV ad with a mobile optimized version of the ad.
              </Caption>
            </RevealOnScroll>
            <RevealOnScroll variant="media" delay={0.06}>
              <>
                <MediaFrame>
                  <div className="mx-auto w-full max-w-[325px] overflow-hidden rounded-[9px]">
                    <VideoBlock
                      src="/prototype-index/connected-tv/videos/instacart-commercial-1.mp4"
                      className="scale-[1.06] bg-transparent"
                    />
                  </div>
                </MediaFrame>
                <MediaFrame className="mt-6">
                  <VideoBlock
                    src="/prototype-index/connected-tv/videos/instacart-mobile-to-web.mp4"
                    className="max-w-[182px] rounded-[16px] bg-transparent"
                  />
                </MediaFrame>
              </>
            </RevealOnScroll>
          </figure>

          <figure className="mx-auto mt-12 max-w-[540px]">
            <RevealOnScroll variant="text">
              <div
                className="mx-auto mb-6 max-w-[540px] space-y-[26px]"
                style={{
                  color: bodyMutedColor,
                  fontFamily: bodyStyle.fontFamily,
                  fontSize: bodyStyle.size,
                  fontWeight: bodyStyle.weight,
                  letterSpacing: bodyStyle.letterSpacing,
                  lineHeight: bodyStyle.lineHeight,
                }}
              >
                <p>
                  The CTV ecosystem requires advertisers to pass through three intermediary layers before an ad ever reaches a viewer. In the diagram, Meta collapses the chain
                  serving as a unified layer between the Ad Server and Advertiser.
                </p>
                <p>
                  As a designer, that meant more than building an advertiser-facing UI — it meant designing for publishers, ad servers, and industry protocols without making
                  the experience feel foreign to existing Meta advertisers.
                </p>
              </div>
            </RevealOnScroll>
            <RevealOnScroll variant="media" delay={0.06}>
              <ImageBlock
                src="/prototype-index/connected-tv/svg/ctv-meta-ecosystem.svg"
                alt="Before and after diagram showing how Meta fits into the connected TV landscape."
              />
            </RevealOnScroll>
          </figure>

          <figure className="mx-auto mt-12 max-w-[540px]">
            <RevealOnScroll variant="text">
              <div
                className="mx-auto mb-6 max-w-[540px] space-y-[26px]"
                style={{
                  color: bodyMutedColor,
                  fontFamily: bodyStyle.fontFamily,
                  fontSize: bodyStyle.size,
                  fontWeight: bodyStyle.weight,
                  letterSpacing: bodyStyle.letterSpacing,
                  lineHeight: bodyStyle.lineHeight,
                }}
              >
                <p>
                  Meta&apos;s Ads Manager is a deeply layered tool — dozens of interdependent controls, each with upstream and downstream consequences.
                </p>
                <p>
                  By building a high-fidelity prototype that mapped every interaction, I was able to untangle the complexity before it could become a development problem.
                  We were also able to use the prototype to run user research sessions directly against it, freeing engineering to focus on backend work.
                </p>
              </div>
            </RevealOnScroll>
            <RevealOnScroll variant="media" delay={0.06}>
              <VideoBlock src="/prototype-index/connected-tv/videos/ctv.mp4" className="bg-black" />
            </RevealOnScroll>
          </figure>
        </section>

        <section className="mt-48">
          <SectionIntro section={sections[1]} />
          <figure className="mx-auto mt-24 max-w-[538px]">
            <RevealOnScroll variant="media">
              <VideoBlock src="/prototype-index/campaign-planner/videos/campaign-planner.mp4" className="bg-black" />
            </RevealOnScroll>
          </figure>

          <figure className="mx-auto mt-12 max-w-[538px]">
            <RevealOnScroll variant="text">
              <Caption>
                By recreating the design system in cursor, I enabled the team to quickly spin up realistic dynamic prototypes to evaluate divergent redesign ideas, that
                looked and felt realistic.
              </Caption>
            </RevealOnScroll>
            <RevealOnScroll variant="media" delay={0.06}>
              <MediaFrame className="p-8">
                <div className="overflow-hidden rounded-[9px]">
                  <VideoBlock
                    src="/prototype-index/campaign-planner/videos/stylesheet-campaign-planner.mp4"
                    className="rounded-none bg-transparent"
                  />
                </div>
              </MediaFrame>
            </RevealOnScroll>
          </figure>
        </section>

        <section className="mt-48">
          <SectionIntro section={sections[2]} />

          <figure className="mx-auto mt-24 max-w-[540px]">
            <RevealOnScroll variant="media">
              <ImageBlock
                src="/prototype-index/langchain-alt/hero-full.png"
                alt="Intelligence platform full view with three-panel drill-down."
              />
            </RevealOnScroll>
            <RevealOnScroll variant="text">
              <div
                className="mx-auto mt-6 max-w-[540px] space-y-[26px]"
                style={{
                  color: bodyMutedColor,
                  fontFamily: bodyStyle.fontFamily,
                  fontSize: bodyStyle.size,
                  fontWeight: bodyStyle.weight,
                  letterSpacing: bodyStyle.letterSpacing,
                  lineHeight: bodyStyle.lineHeight,
                }}
              >
                <p>
                  Above you'll see my high level take on a LangSmith redesign. Workspace and Project selections are now top-level navigation elements.
                </p>
                <p>
                  The layout offers both clarity and focus. Workspace and project selections are top nav elements while the left navigation acts as the anchor for the three-panel drill down encouraging interactivity to dive deep in the weeds without getting lost.
                </p>
              </div>
            </RevealOnScroll>
          </figure>

          <figure className="mx-auto mt-12 max-w-[540px]">
            <RevealOnScroll variant="media">
              <MediaFrame>
                <ImageBlock
                  src="/prototype-index/langchain-alt/filler.png"
                  alt="Hand-drawn notebook diagram of methods for understanding agents."
                />
              </MediaFrame>
            </RevealOnScroll>
            <RevealOnScroll variant="text">
              <div
                className="mx-auto mt-6 max-w-[540px]"
                style={{
                  color: bodyMutedColor,
                  fontFamily: bodyStyle.fontFamily,
                  fontSize: bodyStyle.size,
                  fontWeight: bodyStyle.weight,
                  letterSpacing: bodyStyle.letterSpacing,
                  lineHeight: bodyStyle.lineHeight,
                }}
              >
                <p>
                  The core purpose of these tools is to help teams understand their agents. These tools should be able to tell teams when and why their agent goes awry, and offer a way to proactively prevent drift as improvements ship, new models get incorporated, and user behavior changes.
                </p>
              </div>
            </RevealOnScroll>
          </figure>

          <figure className="mx-auto mt-12 max-w-[540px]">
            <RevealOnScroll variant="media">
              <MediaFrame>
                <ImageBlock
                  src="/prototype-index/langchain-alt/figjam.png"
                  alt="FigJam diagram comparing LangSmith and Braintrust architecture with a proposed scalable solution."
                />
              </MediaFrame>
            </RevealOnScroll>
            <RevealOnScroll variant="text">
              <div
                className="mx-auto mt-6 max-w-[540px] space-y-[26px]"
                style={{
                  color: bodyMutedColor,
                  fontFamily: bodyStyle.fontFamily,
                  fontSize: bodyStyle.size,
                  fontWeight: bodyStyle.weight,
                  letterSpacing: bodyStyle.letterSpacing,
                  lineHeight: bodyStyle.lineHeight,
                }}
              >
                <p>
                  After analyzing the high level architecture of Braintrust and LangSmith, it seems that both focus on single/siloed-team enablement. Neither tools allow for core elements like Evaluators, Company metrics, or Prompt structures to be reused or templatetized so more novice teams can quickly adopt best practices and glean value from the tool. In this FigJam I've abstracted each tool&apos;s current structure, limitations, and provided my own proposal for a more scalable solution.
                </p>
              </div>
            </RevealOnScroll>
          </figure>

        </section>

        <section className="mt-48">
          <SectionIntro section={sections[3]} />

          <figure className="mx-auto mt-24 max-w-[540px]">
            <RevealOnScroll variant="text">
              <Caption>
                A unified query structure across all report types, revealing complexity progressively as users work through inputs specific to each report.
              </Caption>
            </RevealOnScroll>
            <RevealOnScroll variant="media" delay={0.06}>
              <div className="overflow-hidden rounded-[2pt] bg-black">
                <ImageBlock
                  src="/prototype-index/query-builder/images/multiple-qb-4-up.png"
                  alt="Four Mixpanel report types with query builder highlighted: Insights, Funnels, Retention, and Flows."
                  className="rounded-none"
                />
              </div>
            </RevealOnScroll>
          </figure>

          <figure className="mx-auto mt-6 max-w-[540px]">
            <RevealOnScroll variant="media">
              <MediaFrame className="px-6 py-6">
                <div className="grid w-full max-w-[486px] grid-cols-3 gap-3">
                  <img
                    src="/prototype-index/query-builder/videos/qb-query-retention.gif"
                    alt="Retention query builder interaction."
                    loading="lazy"
                    className="w-full rounded-[9px]"
                  />
                  <img
                    src="/prototype-index/query-builder/videos/qb-query-funnels.gif"
                    alt="Funnels query builder interaction."
                    loading="lazy"
                    className="w-full rounded-[9px]"
                  />
                  <img
                    src="/prototype-index/query-builder/videos/qb-query-insights.gif"
                    alt="Insights query builder interaction."
                    loading="lazy"
                    className="w-full rounded-[9px]"
                  />
                </div>
              </MediaFrame>
            </RevealOnScroll>
          </figure>

          <figure className="mx-auto mt-12 max-w-[540px]">
            <RevealOnScroll variant="text">
              <Caption>Mixpanel’s side query builder.</Caption>
            </RevealOnScroll>
            <RevealOnScroll variant="media" delay={0.06}>
              <div
                className="overflow-hidden rounded-[9px]"
                style={{ backgroundColor: colors.charcoal }}
              >
                <ImageBlock
                  src="/prototype-index/query-builder/images/qb-new-qb.png"
                  alt="Mixpanel side query builder."
                  className="origin-center scale-[1.02] rounded-none"
                />
              </div>
            </RevealOnScroll>
          </figure>
        </section>

        <section className="mt-48">
          <SectionIntro section={sections[4]} />

          <figure className="mx-auto mt-24 max-w-[536px]">
            <RevealOnScroll variant="media">
              <VideoBlock
                src="/prototype-index/dashboard-architecture/videos/dashboard-intro.mp4"
                className="rounded-[9px]"
              />
            </RevealOnScroll>
          </figure>

          <figure className="mx-auto mt-6 max-w-[536px]">
            <RevealOnScroll variant="media">
              <MediaFrame>
                <ImageBlock
                  src="/prototype-index/dashboard-architecture/svg/dashboard-layout.svg"
                  alt="Updated Mixpanel dashboard architecture."
                  className="rounded-[9px]"
                />
              </MediaFrame>
            </RevealOnScroll>
          </figure>

          <figure className="mx-auto mt-12 max-w-[537px]">
            <RevealOnScroll variant="text">
              <Caption>
                After establishing a boards-first workflow, we welcomed a wave of story-telling features including a responsive grid, text and media support, improved
                sharing and collaboration.
              </Caption>
            </RevealOnScroll>
            <RevealOnScroll variant="media" delay={0.06}>
              <ImageBlock
                src="/prototype-index/dashboard-architecture/svg/dashboard-grid.svg"
                alt="Board with responsive grid overlay and multiple report tiles for an awareness campaign."
              />
            </RevealOnScroll>
          </figure>

          <figure className="mx-auto mt-6 max-w-[538px]">
            <RevealOnScroll variant="media">
              <MediaFrame>
                <ImageBlock
                  src="/prototype-index/dashboard-architecture/images/text-media-support.png"
                  alt="Rich text editor with links and mentions on a dashboard board."
                  className="rounded-[9px]"
                />
              </MediaFrame>
            </RevealOnScroll>
          </figure>

          {/* Hidden for now — keep handy in case we want to bring it back.
          <figure className="mx-auto mt-12 max-w-[538px]">
            <img
              src="/prototype-index/dashboard-architecture/videos/dashboard-updates.gif"
              alt="Dashboard updates animation."
              loading="lazy"
              className="mx-auto block w-full rounded-[12px]"
            />
          </figure>
          */}
        </section>
      </div>

      <footer
        className="mx-auto mt-48 w-full max-w-[540px] text-center"
        style={{
          color: bodyMutedColor,
          fontFamily: bodyStyle.fontFamily,
          fontSize: bodyStyle.size,
          fontWeight: bodyStyle.weight,
          letterSpacing: bodyStyle.letterSpacing,
          lineHeight: bodyStyle.lineHeight,
        }}
      >
        siu.kaitlynn@gmail.com <span className="font-bold">•</span> 916-367-1362{" "}
        <span className="font-bold">•</span> Updated May 2026
      </footer>
    </main>
  );
}
