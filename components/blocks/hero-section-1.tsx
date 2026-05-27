'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Menu, X } from 'lucide-react';
import { type Variants } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { AnimatedGroup } from '@/components/ui/animated-group';
import { cn } from '@/lib/utils';

const transitionVariants: { container?: Variants; item?: Variants } = {
  item: {
    hidden: {
      opacity: 0,
      filter: 'blur(12px)',
      y: 12,
    },
    visible: {
      opacity: 1,
      filter: 'blur(0px)',
      y: 0,
      transition: {
        type: 'spring',
        bounce: 0.3,
        duration: 1.5,
      },
    },
  },
};

export function HeroSection() {
  return (
    <>
      <HeroHeader />
      <main className="overflow-hidden">
        {/* Decorative light rays */}
        <div
          aria-hidden
          className="z-[2] absolute inset-0 pointer-events-none isolate opacity-50 contain-strict hidden lg:block">
          <div className="w-[35rem] h-[80rem] -translate-y-[350px] absolute left-0 top-0 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(215,100%,60%,.07)_0,hsla(215,100%,60%,.02)_50%,transparent_80%)]" />
          <div className="h-[80rem] absolute left-0 top-0 w-56 -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(215,100%,60%,.05)_0,transparent_100%)] [translate:5%_-50%]" />
          <div className="h-[80rem] -translate-y-[350px] absolute right-0 top-0 w-56 rotate-45 bg-[radial-gradient(50%_50%_at_50%_50%,hsla(24,95%,53%,.04)_0,transparent_100%)]" />
        </div>

        <section>
          <div className="relative pt-24 md:pt-36">
            {/* Radial gradient fade at bottom */}
            <div
              aria-hidden
              className="absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,white_75%)]"
            />

            <div className="mx-auto max-w-7xl px-6">
              <div className="text-center sm:mx-auto lg:mr-auto lg:mt-0">
                <AnimatedGroup variants={transitionVariants}>
                  {/* Announcement badge */}
                  <Link
                    href="/solucoes"
                    className="hover:bg-white/80 bg-white/60 group mx-auto flex w-fit items-center gap-4 rounded-full border border-gray-200 p-1 pl-4 shadow-sm shadow-black/5 transition-all duration-300 backdrop-blur-sm">
                    <span className="text-gray-700 text-sm font-medium">
                      Primeiro marketplace de IA do Brasil
                    </span>
                    <span className="block h-4 w-0.5 border-l border-gray-200" />
                    <div className="bg-white group-hover:bg-gray-50 size-6 overflow-hidden rounded-full duration-500 border border-gray-100">
                      <div className="flex w-12 -translate-x-1/2 duration-500 ease-in-out group-hover:translate-x-0">
                        <span className="flex size-6">
                          <ArrowRight className="m-auto size-3 text-gray-500" />
                        </span>
                        <span className="flex size-6">
                          <ArrowRight className="m-auto size-3 text-gray-500" />
                        </span>
                      </div>
                    </div>
                  </Link>

                  {/* H1 */}
                  <h1 className="mt-8 mx-auto text-balance font-bold tracking-tight text-gray-900 text-5xl md:text-6xl lg:mt-16 xl:text-[4.5rem] leading-[1.12]">
                    <span className="block mb-3">Gerencie Seu Negócio</span>
                    <span className="inline-flex items-center justify-center flex-wrap gap-x-3">
                      <span>com</span>
                      <span className="relative inline-flex">
                        <span
                          style={{
                            background: 'linear-gradient(to right, #f97316, #f43f5e)',
                            borderRadius: '24px 24px 24px 6px',
                            padding: '10px 32px',
                            color: '#fff',
                            fontWeight: 700,
                            letterSpacing: '-2px',
                            display: 'inline-block',
                            lineHeight: 1.12,
                          }}>
                          IA Curada
                        </span>
                        {/* Speech bubble tail */}
                        <span
                          style={{
                            position: 'absolute',
                            bottom: -11,
                            left: 18,
                            width: 0,
                            height: 0,
                            borderRight: '16px solid transparent',
                            borderTop: '12px solid #f97316',
                            display: 'block',
                          }}
                        />
                      </span>
                    </span>
                  </h1>

                  {/* Subtitle */}
                  <p className="mx-auto mt-8 max-w-2xl text-balance text-lg text-gray-500 leading-relaxed">
                    Cada solução foi testada e aprovada antes de chegar até você.
                    Implemente com confiança, suporte em português.
                  </p>
                </AnimatedGroup>

                {/* CTA buttons */}
                <AnimatedGroup
                  variants={{
                    container: {
                      visible: {
                        transition: {
                          staggerChildren: 0.05,
                          delayChildren: 0.75,
                        },
                      },
                    },
                    ...transitionVariants,
                  }}
                  className="mt-12 flex flex-col items-center justify-center gap-3 md:flex-row">
                  <div className="rounded-[14px] border border-gray-200 bg-gray-50 p-0.5">
                    <Button
                      asChild
                      size="lg"
                      className="rounded-xl px-6 text-base bg-[#111827] hover:bg-[#1f2937] text-white">
                      <Link href="/solucoes">
                        <span className="text-nowrap">Explorar Soluções</span>
                      </Link>
                    </Button>
                  </div>
                  <Button
                    asChild
                    size="lg"
                    variant="ghost"
                    className="rounded-xl px-6 text-gray-600 hover:text-gray-900">
                    <Link href="/criadores">
                      <span className="text-nowrap">Para Criadores</span>
                    </Link>
                  </Button>
                </AnimatedGroup>
              </div>
            </div>

            {/* Product mockup */}
            <AnimatedGroup
              variants={{
                container: {
                  visible: {
                    transition: {
                      staggerChildren: 0.05,
                      delayChildren: 0.75,
                    },
                  },
                },
                ...transitionVariants,
              }}>
              <div className="relative -mr-56 mt-8 overflow-hidden px-2 sm:mr-0 sm:mt-12 md:mt-20">
                <div
                  aria-hidden
                  className="bg-gradient-to-b to-white from-transparent from-35% absolute inset-0 z-10"
                />
                <div className="ring-gray-200 bg-white relative mx-auto max-w-6xl overflow-hidden rounded-2xl border border-gray-200 p-4 shadow-lg shadow-zinc-950/10 ring-1">
                  {/* Browser chrome */}
                  <div className="bg-gray-50 border-b border-gray-200 rounded-t-xl px-4 py-3 flex items-center gap-3 -mx-4 -mt-4 mb-4">
                    <div className="flex gap-1.5">
                      {['#ff5f57', '#febc2e', '#28c840'].map((c) => (
                        <div
                          key={c}
                          className="w-3 h-3 rounded-full"
                          style={{ background: c }}
                        />
                      ))}
                    </div>
                    <div className="flex-1 max-w-xs mx-auto bg-white border border-gray-200 rounded-md px-3 py-1 text-xs text-gray-400 text-center">
                      weprompt.com.br
                    </div>
                  </div>
                  {/* Placeholder dashboard */}
                  <div
                    className="aspect-[15/8] relative rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col items-center justify-center gap-4 border border-slate-200">
                    <img
                      src="/logo-light.png"
                      alt="WePrompt"
                      className="h-12 opacity-20"
                    />
                    <div className="text-xs text-slate-300 font-medium tracking-widest uppercase">
                      WePrompt Marketplace
                    </div>
                    {/* Fake UI skeleton */}
                    <div className="absolute inset-6 grid grid-cols-3 gap-3 opacity-30">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <div
                          key={i}
                          className="bg-white rounded-lg border border-slate-200 p-3 flex flex-col gap-2">
                          <div className="h-2 bg-slate-200 rounded w-3/4" />
                          <div className="h-2 bg-slate-100 rounded w-1/2" />
                          <div className="h-8 bg-slate-100 rounded mt-auto" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedGroup>
          </div>
        </section>

        {/* Stats — replaces customer logos */}
        <section className="bg-white pb-16 pt-16 md:pb-32">
          <div className="group relative m-auto max-w-5xl px-6">
            <div className="mx-auto mt-12 grid max-w-2xl grid-cols-1 gap-8 sm:grid-cols-3">
              {[
                { label: '1º Marketplace de IA',   desc: 'Pioneiro no Brasil'           },
                { label: 'Soluções Testadas',       desc: 'Aprovadas antes de publicar'  },
                { label: 'Suporte em Português',    desc: 'Time local, PT-BR'            },
              ].map((stat) => (
                <div key={stat.label} className="text-center border-t border-gray-100 pt-6">
                  <div className="text-sm font-bold text-gray-900 mb-1">{stat.label}</div>
                  <div className="text-xs text-gray-400">{stat.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

/* ─── Menu items ─────────────────────────────────────────────────────── */
const menuItems = [
  { name: 'Explorar',       href: '/solucoes'             },
  { name: 'Soluções',       href: '/solucoes'             },
  { name: 'Preços',         href: '/precos'               },
  { name: 'Para Criadores', href: '/criadores'            },
];

/* ─── HeroHeader — scroll-aware shrinking navbar ────────────────────── */
const HeroHeader = () => {
  const [menuState, setMenuState] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header>
      <nav
        data-state={menuState && 'active'}
        className="fixed z-20 w-full px-2 group">
        <div
          className={cn(
            'mx-auto mt-2 max-w-6xl px-6 transition-all duration-300 lg:px-12',
            isScrolled && 'bg-white/80 max-w-4xl rounded-2xl border border-gray-200 backdrop-blur-lg lg:px-5',
          )}>
          <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">

            {/* Logo + mobile toggle */}
            <div className="flex w-full justify-between lg:w-auto">
              <Link href="/" aria-label="home" className="flex items-center">
                <img
                  src="/logo-light.png"
                  style={{ height: 40 }}
                  alt="WePrompt"
                />
              </Link>

              <button
                onClick={() => setMenuState(!menuState)}
                aria-label={menuState ? 'Close Menu' : 'Open Menu'}
                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden">
                <Menu className="group-data-[state=active]:scale-0 group-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                <X className="group-data-[state=active]:rotate-0 group-data-[state=active]:scale-100 group-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
              </button>
            </div>

            {/* Desktop center links */}
            <div className="absolute inset-0 m-auto hidden size-fit lg:block">
              <ul className="flex gap-8 text-sm">
                {menuItems.map((item, index) => (
                  <li key={index}>
                    <Link
                      href={item.href}
                      className="text-gray-500 hover:text-gray-900 block duration-150 font-medium">
                      <span>{item.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Auth buttons */}
            <div className="bg-white group-data-[state=active]:block lg:group-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border border-gray-200 p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none">
              {/* Mobile links */}
              <div className="lg:hidden">
                <ul className="space-y-6 text-base">
                  {menuItems.map((item, index) => (
                    <li key={index}>
                      <Link
                        href={item.href}
                        className="text-gray-600 hover:text-gray-900 block duration-150 font-medium">
                        <span>{item.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className={cn(
                    'border-gray-200 text-gray-700 hover:bg-gray-50',
                    isScrolled && 'lg:hidden',
                  )}>
                  <Link href="/login">
                    <span>Entrar</span>
                  </Link>
                </Button>
                <Button
                  asChild
                  size="sm"
                  className={cn(
                    'bg-[#111827] hover:bg-[#1f2937] text-white',
                    isScrolled && 'lg:hidden',
                  )}>
                  <Link href="/cadastro">
                    <span>Começar grátis</span>
                  </Link>
                </Button>
                <Button
                  asChild
                  size="sm"
                  className={cn(
                    'bg-[#111827] hover:bg-[#1f2937] text-white',
                    isScrolled ? 'lg:inline-flex' : 'hidden',
                  )}>
                  <Link href="/cadastro">
                    <span>Começar grátis</span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};
