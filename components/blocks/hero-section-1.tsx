'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronRight, Menu, X } from 'lucide-react';
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
        <div
          aria-hidden
          className="z-[2] absolute inset-0 pointer-events-none isolate opacity-50 contain-strict hidden lg:block">
          <div className="w-[35rem] h-[80rem] -translate-y-[350px] absolute left-0 top-0 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(0,0%,85%,.08)_0,hsla(0,0%,55%,.02)_50%,hsla(0,0%,45%,0)_80%)]" />
          <div className="h-[80rem] absolute left-0 top-0 w-56 -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.06)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)] [translate:5%_-50%]" />
          <div className="h-[80rem] -translate-y-[350px] absolute left-0 top-0 w-56 -rotate-45 bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.04)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)]" />
        </div>

        <section className="bg-zinc-950">
          <div className="relative pt-24 md:pt-36">
            <AnimatedGroup
              variants={{
                container: {
                  visible: {
                    transition: {
                      delayChildren: 1,
                    },
                  },
                },
                item: {
                  hidden: { opacity: 0, y: 20 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { type: 'spring', bounce: 0.3, duration: 2 },
                  },
                },
              }}
              className="absolute inset-0 -z-20">
              <img
                src="https://ik.imagekit.io/lrigu76hy/tailark/night-background.jpg?updatedAt=1745733451120"
                alt="background"
                className="absolute inset-x-0 top-56 -z-20 block lg:top-32"
                width="3276"
                height="4095"
              />
            </AnimatedGroup>

            <div
              aria-hidden
              className="absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,var(--background)_75%)]"
            />

            <div className="mx-auto max-w-7xl px-6">
              <div className="text-center sm:mx-auto lg:mr-auto lg:mt-0">
                <AnimatedGroup variants={transitionVariants}>
                  {/* Announcement badge */}
                  <Link
                    href="/solucoes"
                    className="hover:bg-zinc-800 bg-zinc-900/80 group mx-auto flex w-fit items-center gap-4 rounded-full border border-zinc-700 p-1 pl-4 shadow-md shadow-black/20 transition-all duration-300">
                    <span className="text-zinc-300 text-sm">
                      Primeiro marketplace de IA do Brasil
                    </span>
                    <span className="block h-4 w-0.5 border-l border-zinc-700 bg-zinc-700" />
                    <div className="bg-zinc-800 group-hover:bg-zinc-700 size-6 overflow-hidden rounded-full duration-500">
                      <div className="flex w-12 -translate-x-1/2 duration-500 ease-in-out group-hover:translate-x-0">
                        <span className="flex size-6">
                          <ArrowRight className="m-auto size-3 text-zinc-400" />
                        </span>
                        <span className="flex size-6">
                          <ArrowRight className="m-auto size-3 text-zinc-400" />
                        </span>
                      </div>
                    </div>
                  </Link>

                  {/* H1 with speech bubble pill */}
                  <h1 className="mt-8 max-w-4xl mx-auto text-balance text-6xl md:text-7xl lg:mt-16 xl:text-[5.25rem] font-bold tracking-tight text-white leading-[1.12]">
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
                  <p className="mx-auto mt-8 max-w-2xl text-balance text-lg text-zinc-400">
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
                  className="mt-12 flex flex-col items-center justify-center gap-2 md:flex-row">
                  <div className="bg-white/10 rounded-[14px] border border-white/10 p-0.5">
                    <Button
                      asChild
                      size="lg"
                      className="rounded-xl px-5 text-base bg-white text-zinc-900 hover:bg-zinc-100">
                      <Link href="/solucoes">
                        <span className="text-nowrap">Explorar Soluções</span>
                      </Link>
                    </Button>
                  </div>
                  <Button
                    asChild
                    size="lg"
                    variant="ghost"
                    className="h-10.5 rounded-xl px-5 text-zinc-300 hover:text-white hover:bg-white/10">
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
                  className="bg-gradient-to-b to-zinc-950 absolute inset-0 z-10 from-transparent from-35%"
                />
                <div className="bg-zinc-900 relative mx-auto max-w-6xl overflow-hidden rounded-2xl border border-zinc-800 p-4 shadow-lg shadow-zinc-950/50 ring-1 ring-zinc-800">
                  {/* Browser chrome */}
                  <div className="bg-zinc-800 border-b border-zinc-700 rounded-t-xl px-4 py-3 flex items-center gap-3 -mx-4 -mt-4 mb-4">
                    <div className="flex gap-1.5 shrink-0">
                      {['#ff5f57', '#febc2e', '#28c840'].map((c) => (
                        <div key={c} className="w-3 h-3 rounded-full" style={{ background: c }} />
                      ))}
                    </div>
                    <div className="flex-1 max-w-xs mx-auto bg-zinc-900 border border-zinc-700 rounded-md px-3 py-1 text-xs text-zinc-500 text-center">
                      weprompt.com.br
                    </div>
                  </div>

                  {/* Dark dashboard */}
                  <div className="aspect-video w-full rounded-2xl bg-zinc-900 flex flex-col p-5 gap-4 overflow-hidden">
                    {/* Stat bars */}
                    <div className="flex gap-3">
                      <div className="flex-1 bg-zinc-800 rounded-lg p-3 flex items-center gap-3">
                        <div className="w-2 h-8 rounded-full bg-blue-500 shrink-0" />
                        <div className="flex flex-col gap-1.5 flex-1">
                          <div className="h-2 bg-zinc-700 rounded w-2/3" />
                          <div className="h-2 bg-zinc-600 rounded w-1/3" />
                        </div>
                      </div>
                      <div className="flex-1 bg-zinc-800 rounded-lg p-3 flex items-center gap-3">
                        <div className="w-2 h-8 rounded-full bg-orange-500 shrink-0" />
                        <div className="flex flex-col gap-1.5 flex-1">
                          <div className="h-2 bg-zinc-700 rounded w-1/2" />
                          <div className="h-2 bg-zinc-600 rounded w-2/5" />
                        </div>
                      </div>
                      <div className="flex-1 bg-zinc-800 rounded-lg p-3 flex items-center gap-3">
                        <div className="w-2 h-8 rounded-full bg-emerald-500 shrink-0" />
                        <div className="flex flex-col gap-1.5 flex-1">
                          <div className="h-2 bg-zinc-700 rounded w-3/4" />
                          <div className="h-2 bg-zinc-600 rounded w-1/2" />
                        </div>
                      </div>
                    </div>
                    {/* Content grid */}
                    <div className="flex gap-3 flex-1">
                      <div className="flex-1 bg-zinc-800 rounded-lg p-3 flex flex-col gap-2">
                        <div className="h-2 bg-zinc-700 rounded w-1/2 mb-1" />
                        {[80, 55, 70, 40, 65].map((w, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <div className="h-1.5 bg-zinc-600 rounded" style={{ width: `${w}%` }} />
                          </div>
                        ))}
                      </div>
                      <div className="w-2/5 bg-zinc-800 rounded-lg p-3 flex flex-col gap-2">
                        <div className="h-2 bg-zinc-700 rounded w-2/3 mb-1" />
                        <div className="flex-1 rounded-lg bg-zinc-700/50 flex items-end gap-1 px-2 pb-2">
                          {[40, 70, 50, 90, 60, 80].map((h, i) => (
                            <div
                              key={i}
                              className="flex-1 rounded-sm"
                              style={{
                                height: `${h}%`,
                                background:
                                  i % 3 === 0 ? '#3b82f6' : i % 3 === 1 ? '#f97316' : '#10b981',
                                opacity: 0.7,
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedGroup>
          </div>
        </section>

        {/* Stats — replaces customer logos */}
        <section className="bg-zinc-950 pb-16 pt-16 md:pb-32">
          <div className="group relative m-auto max-w-5xl px-6">
            <div className="absolute inset-0 z-10 flex scale-95 items-center justify-center opacity-0 duration-500 group-hover:scale-100 group-hover:opacity-100">
              <Link href="/solucoes" className="block text-sm text-zinc-400 duration-150 hover:text-white">
                <span>Ver todas as soluções</span>
                <ChevronRight className="ml-1 inline-block size-3" />
              </Link>
            </div>
            <div className="group-hover:blur-xs mx-auto mt-12 grid max-w-2xl grid-cols-1 gap-8 sm:grid-cols-3 transition-all duration-500 group-hover:opacity-50">
              {[
                { label: '1º Marketplace de IA',  desc: 'Pioneiro no Brasil'          },
                { label: 'Soluções Testadas',      desc: 'Aprovadas antes de publicar' },
                { label: 'Suporte em Português',   desc: 'Time local, PT-BR'           },
              ].map((stat, i) => (
                <div
                  key={stat.label}
                  className={cn(
                    'text-center py-6',
                    i > 0 && 'border-t sm:border-t-0 sm:border-l border-zinc-800',
                  )}>
                  <div className="text-sm font-bold text-white mb-1">{stat.label}</div>
                  <div className="text-xs text-zinc-500">{stat.desc}</div>
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
  { name: 'Explorar',       href: '/solucoes'  },
  { name: 'Soluções',       href: '/solucoes'  },
  { name: 'Preços',         href: '/precos'    },
  { name: 'Para Criadores', href: '/criadores' },
];

/* ─── HeroHeader ─────────────────────────────────────────────────────── */
const HeroHeader = () => {
  const [menuState, setMenuState] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
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
            'mx-auto mt-2 max-w-6xl px-6 transition-all duration-300 lg:px-12 bg-transparent',
            isScrolled && 'bg-zinc-900/80 max-w-4xl rounded-2xl border border-zinc-800 backdrop-blur-lg lg:px-5',
          )}>
          <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">

            {/* Logo + mobile toggle */}
            <div className="flex w-full justify-between lg:w-auto">
              <Link href="/" aria-label="home" className="flex items-center">
                <img
                  src="/logo-dark.png"
                  style={{ height: 40, width: 'auto', objectFit: 'contain' }}
                  alt="WePrompt"
                />
              </Link>

              <button
                onClick={() => setMenuState(!menuState)}
                aria-label={menuState ? 'Close Menu' : 'Open Menu'}
                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden">
                <Menu className="group-data-[state=active]:scale-0 group-data-[state=active]:opacity-0 m-auto size-6 text-white duration-200" />
                <X className="group-data-[state=active]:rotate-0 group-data-[state=active]:scale-100 group-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 text-white duration-200" />
              </button>
            </div>

            {/* Desktop center links */}
            <div className="absolute inset-0 m-auto hidden size-fit lg:block">
              <ul className="flex gap-8 text-sm">
                {menuItems.map((item, index) => (
                  <li key={index}>
                    <Link
                      href={item.href}
                      className="text-zinc-400 hover:text-white block duration-150 font-medium">
                      <span>{item.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Auth buttons + mobile menu */}
            <div className="bg-zinc-900 group-data-[state=active]:block lg:group-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border border-zinc-800 p-6 shadow-2xl shadow-black/40 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none">
              {/* Mobile nav links */}
              <div className="lg:hidden">
                <ul className="space-y-6 text-base">
                  {menuItems.map((item, index) => (
                    <li key={index}>
                      <Link
                        href={item.href}
                        className="text-zinc-300 hover:text-white block duration-150 font-medium">
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
                    'border-zinc-700 text-zinc-200 bg-transparent hover:bg-zinc-800 hover:text-white',
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
                    'bg-white text-zinc-900 hover:bg-zinc-100',
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
                    'bg-white text-zinc-900 hover:bg-zinc-100',
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
