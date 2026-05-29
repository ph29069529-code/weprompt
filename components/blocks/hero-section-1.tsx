'use client';

import React from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { ArrowRight, ChevronRight, Menu, X } from 'lucide-react'
import { type Variants } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { AnimatedGroup } from '@/components/ui/animated-group'
import { cn } from '@/lib/utils'

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
}

export function HeroSection() {
    return (
        <>
            <HeroHeader />
            <main className="overflow-hidden" style={{ backgroundColor: '#09090b' }}>
                <div
                    aria-hidden
                    className="z-[2] absolute inset-0 pointer-events-none isolate opacity-50 contain-strict hidden lg:block">
                    <div className="w-[35rem] h-[80rem] -translate-y-[350px] absolute left-0 top-0 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(0,0%,85%,.08)_0,hsla(0,0%,55%,.02)_50%,hsla(0,0%,45%,0)_80%)]" />
                    <div className="h-[80rem] absolute left-0 top-0 w-56 -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.06)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)] [translate:5%_-50%]" />
                    <div className="h-[80rem] -translate-y-[350px] absolute left-0 top-0 w-56 -rotate-45 bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.04)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)]" />
                </div>
                <section className="bg-zinc-950" style={{ backgroundColor: '#09090b', position: 'relative' }}>
                    <div className="relative pt-24 md:pt-36">
                        <div style={{ position: 'absolute', inset: 0, zIndex: -1, background: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(120,119,198,0.15), transparent)' }} />
                        <div aria-hidden className="absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,var(--background)_75%)]" />
                        <div className="mx-auto max-w-7xl px-6">
                            <div className="text-center sm:mx-auto lg:mr-auto lg:mt-0">
                                <AnimatedGroup variants={transitionVariants}>
                                    <Link
                                        href="/solucoes"
                                        className="hover:bg-background dark:hover:border-t-border bg-muted group mx-auto flex w-fit items-center gap-4 rounded-full border p-1 pl-4 shadow-md shadow-black/5 transition-all duration-300 dark:border-t-white/5 dark:shadow-zinc-950"
                                        style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)', color: 'white' }}>
                                        <span className="text-foreground text-sm">Primeiro marketplace de IA do Brasil</span>
                                        <span className="dark:border-background block h-4 w-0.5 border-l bg-white dark:bg-zinc-700"></span>

                                        <div className="bg-background group-hover:bg-muted size-6 overflow-hidden rounded-full duration-500">
                                            <div className="flex w-12 -translate-x-1/2 duration-500 ease-in-out group-hover:translate-x-0">
                                                <span className="flex size-6">
                                                    <ArrowRight className="m-auto size-3" />
                                                </span>
                                                <span className="flex size-6">
                                                    <ArrowRight className="m-auto size-3" />
                                                </span>
                                            </div>
                                        </div>
                                    </Link>

                                    <h1 className="mt-8 max-w-4xl mx-auto text-balance text-6xl md:text-7xl lg:mt-16 xl:text-[5.25rem]" style={{ color: 'white' }}>
                                        Soluções de IA que Transformam Seu Negócio
                                    </h1>
                                    <p className="mx-auto mt-8 max-w-2xl text-balance text-lg" style={{ color: 'rgba(255,255,255,0.7)' }}>
                                        Cada solução foi testada e aprovada antes de chegar até você. Implemente com confiança, suporte em português.
                                    </p>
                                </AnimatedGroup>

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
                                    <div
                                        key={1}
                                        className="bg-foreground/10 rounded-[14px] border p-0.5">
                                        <Button
                                            asChild
                                            size="lg"
                                            className="rounded-xl px-5 text-base">
                                            <Link href="/solucoes">
                                                <span className="text-nowrap">Explorar Soluções</span>
                                            </Link>
                                        </Button>
                                    </div>
                                    <Button
                                        key={2}
                                        asChild
                                        size="lg"
                                        variant="ghost"
                                        className="h-10.5 rounded-xl px-5">
                                        <Link href="/criadores">
                                            <span className="text-nowrap">Para Criadores</span>
                                        </Link>
                                    </Button>
                                </AnimatedGroup>
                            </div>
                        </div>

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
                                    className="bg-gradient-to-b to-background absolute inset-0 z-10 from-transparent from-35%"
                                />
                                <div className="inset-shadow-2xs ring-background dark:inset-shadow-white/20 bg-background relative mx-auto max-w-6xl overflow-hidden rounded-2xl border p-4 shadow-lg shadow-zinc-950/15 ring-1">
                                    <img
                                        className="bg-background aspect-15/8 relative hidden rounded-2xl dark:block"
                                        src="https://tailark.com//_next/image?url=%2Fmail2.png&w=3840&q=75"
                                        alt="app screen"
                                        width="2700"
                                        height="1440"
                                    />
                                    <img
                                        className="z-2 border-border/25 aspect-15/8 relative rounded-2xl border dark:hidden"
                                        src="https://tailark.com/_next/image?url=%2Fmail2-light.png&w=3840&q=75"
                                        alt="app screen"
                                        width="2700"
                                        height="1440"
                                    />
                                </div>
                            </div>
                        </AnimatedGroup>
                    </div>
                </section>
                <section className="bg-background pb-16 pt-16 md:pb-32">
                    <div className="group relative m-auto max-w-5xl px-6">
                        <div className="absolute inset-0 z-10 flex scale-95 items-center justify-center opacity-0 duration-500 group-hover:scale-100 group-hover:opacity-100">
                            <Link
                                href="/"
                                className="block text-sm duration-150 hover:opacity-75">
                                <span> Meet Our Customers</span>
                                <ChevronRight className="ml-1 inline-block size-3" />
                            </Link>
                        </div>
                        <div className="group-hover:blur-xs mx-auto mt-12 grid max-w-2xl grid-cols-4 gap-x-12 gap-y-8 transition-all duration-500 group-hover:opacity-50 sm:gap-x-16 sm:gap-y-14">
                            <div className="flex">
                                <img
                                    className="mx-auto h-5 w-fit dark:invert"
                                    src="https://html.tailus.io/blocks/customers/nvidia.svg"
                                    alt="Nvidia Logo"
                                    height="20"
                                    width="auto"
                                />
                            </div>
                            <div className="flex">
                                <img
                                    className="mx-auto h-4 w-fit dark:invert"
                                    src="https://html.tailus.io/blocks/customers/column.svg"
                                    alt="Column Logo"
                                    height="16"
                                    width="auto"
                                />
                            </div>
                            <div className="flex">
                                <img
                                    className="mx-auto h-4 w-fit dark:invert"
                                    src="https://html.tailus.io/blocks/customers/github.svg"
                                    alt="GitHub Logo"
                                    height="16"
                                    width="auto"
                                />
                            </div>
                            <div className="flex">
                                <img
                                    className="mx-auto h-5 w-fit dark:invert"
                                    src="https://html.tailus.io/blocks/customers/nike.svg"
                                    alt="Nike Logo"
                                    height="20"
                                    width="auto"
                                />
                            </div>
                            <div className="flex">
                                <img
                                    className="mx-auto h-5 w-fit dark:invert"
                                    src="https://html.tailus.io/blocks/customers/lemonsqueezy.svg"
                                    alt="Lemon Squeezy Logo"
                                    height="20"
                                    width="auto"
                                />
                            </div>
                            <div className="flex">
                                <img
                                    className="mx-auto h-4 w-fit dark:invert"
                                    src="https://html.tailus.io/blocks/customers/laravel.svg"
                                    alt="Laravel Logo"
                                    height="16"
                                    width="auto"
                                />
                            </div>
                            <div className="flex">
                                <img
                                    className="mx-auto h-7 w-fit dark:invert"
                                    src="https://html.tailus.io/blocks/customers/lilly.svg"
                                    alt="Lilly Logo"
                                    height="28"
                                    width="auto"
                                />
                            </div>
                            <div className="flex">
                                <img
                                    className="mx-auto h-6 w-fit dark:invert"
                                    src="https://html.tailus.io/blocks/customers/openai.svg"
                                    alt="OpenAI Logo"
                                    height="24"
                                    width="auto"
                                />
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    )
}

const menuItems = [
    { name: 'Explorar',       href: '/solucoes'  },
    { name: 'Soluções',       href: '/solucoes'  },
    { name: 'Preços',         href: '/precos'    },
    { name: 'Para Criadores', href: '/criadores' },
]

const HeroHeader = () => {
    const [menuState, setMenuState] = React.useState(false)
    const [isScrolled, setIsScrolled] = React.useState(false)
    const [openDropdown, setOpenDropdown] = React.useState<string | null>(null)
    const [dropdownPos, setDropdownPos] = React.useState({ top: 0, left: 0 })
    const [mounted, setMounted] = React.useState(false)
    const ddTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)
    const solucoesButtonRef = React.useRef<HTMLButtonElement>(null)
    const empresaButtonRef = React.useRef<HTMLButtonElement>(null)

    React.useEffect(() => { setMounted(true) }, [])

    function openDd(key: string, ref: React.RefObject<HTMLButtonElement>) {
        if (ddTimerRef.current) { clearTimeout(ddTimerRef.current); ddTimerRef.current = null; }
        if (ref.current) {
            const rect = ref.current.getBoundingClientRect()
            setDropdownPos({ top: rect.bottom + 8, left: rect.left })
        }
        setOpenDropdown(key)
    }
    function keepOpen() {
        if (ddTimerRef.current) { clearTimeout(ddTimerRef.current); ddTimerRef.current = null; }
    }
    function closeDd() {
        ddTimerRef.current = setTimeout(() => setOpenDropdown(null), 150)
    }

    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <header>
            <nav
                data-state={menuState && 'active'}
                className="fixed z-50 w-full px-2 group"
                style={{ backgroundColor: 'transparent' }}>
                <div
                    className={cn('mx-auto mt-2 max-w-6xl px-6 transition-all duration-300 lg:px-12', isScrolled && 'max-w-4xl rounded-2xl lg:px-5')}
                    style={isScrolled ? { backgroundColor: 'rgba(9,9,11,0.8)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.08)' } : { backgroundColor: 'transparent' }}>
                    <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4" style={{ overflow: 'visible' }}>
                        <div className="flex w-full justify-between lg:w-auto">
                            <Link
                                href="/"
                                aria-label="home"
                                className="flex items-center space-x-2">
                                <span style={{ color: 'white', fontWeight: 800, fontSize: 32, letterSpacing: '-0.5px' }}>WePrompt</span>
                            </Link>

                            <button
                                onClick={() => setMenuState(!menuState)}
                                aria-label={menuState == true ? 'Close Menu' : 'Open Menu'}
                                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden">
                                <Menu className="in-data-[state=active]:rotate-180 group-data-[state=active]:scale-0 group-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                                <X className="group-data-[state=active]:rotate-0 group-data-[state=active]:scale-100 group-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
                            </button>
                        </div>

                        <div className="absolute inset-0 m-auto hidden size-fit lg:block" style={{ overflow: 'visible', position: 'relative' }}>
                            <ul className="flex gap-8 text-sm" style={{ alignItems: 'center', overflow: 'visible' }}>
                                <li>
                                    <Link href="/solucoes" className="text-muted-foreground hover:text-accent-foreground block duration-150" style={{ color: 'rgba(255,255,255,0.7)' }}>
                                        <span>Explorar</span>
                                    </Link>
                                </li>
                                <li onMouseEnter={() => openDd('solucoes', solucoesButtonRef)} onMouseLeave={closeDd}>
                                    <button ref={solucoesButtonRef} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.7)', fontSize: 14, fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 4 }}>
                                        Soluções ▾
                                    </button>
                                    {mounted && openDropdown === 'solucoes' && createPortal(
                                        <div onMouseEnter={keepOpen} onMouseLeave={closeDd} style={{ position: 'fixed', top: dropdownPos.top, left: dropdownPos.left, background: 'white', borderRadius: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.12)', padding: '8px', minWidth: 200, zIndex: 9999, border: '1px solid #e5e7eb' }}>
                                            {[
                                                { label: 'Todas as Soluções', href: '/solucoes' },
                                                { label: 'Agentes de IA',      href: '/solucoes?categoria=agentes' },
                                                { label: 'Automação',          href: '/solucoes?categoria=automacao' },
                                                { label: 'Chatbots',           href: '/solucoes?categoria=chatbots' },
                                            ].map(it => (
                                                <a key={it.href} href={it.href} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 8, fontSize: 14, color: '#374151', cursor: 'pointer', textDecoration: 'none' }}
                                                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#f9fafb' }}
                                                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}>
                                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                                                    {it.label}
                                                </a>
                                            ))}
                                        </div>,
                                        document.body
                                    )}
                                </li>
                                <li>
                                    <Link href="/precos" className="text-muted-foreground hover:text-accent-foreground block duration-150" style={{ color: 'rgba(255,255,255,0.7)' }}>
                                        <span>Preços</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/criadores" className="text-muted-foreground hover:text-accent-foreground block duration-150" style={{ color: 'rgba(255,255,255,0.7)' }}>
                                        <span>Para Criadores</span>
                                    </Link>
                                </li>
                                <li onMouseEnter={() => openDd('empresa', empresaButtonRef)} onMouseLeave={closeDd}>
                                    <button ref={empresaButtonRef} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.7)', fontSize: 14, fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 4 }}>
                                        Empresa ▾
                                    </button>
                                    {mounted && openDropdown === 'empresa' && createPortal(
                                        <div onMouseEnter={keepOpen} onMouseLeave={closeDd} style={{ position: 'fixed', top: dropdownPos.top, left: dropdownPos.left, background: 'white', borderRadius: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.12)', padding: '8px', minWidth: 200, zIndex: 9999, border: '1px solid #e5e7eb' }}>
                                            {[
                                                { label: 'Sobre nós', href: '/sobre'   },
                                                { label: 'Blog',      href: '/blog'    },
                                                { label: 'Contato',   href: '/contato' },
                                            ].map(it => (
                                                <a key={it.href} href={it.href} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 8, fontSize: 14, color: '#374151', cursor: 'pointer', textDecoration: 'none' }}
                                                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#f9fafb' }}
                                                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}>
                                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                                                    {it.label}
                                                </a>
                                            ))}
                                        </div>,
                                        document.body
                                    )}
                                </li>
                            </ul>
                        </div>

                        <div className="bg-background group-data-[state=active]:block lg:group-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent">
                            <div className="lg:hidden">
                                <ul className="space-y-6 text-base">
                                    {menuItems.map((item, index) => (
                                        <li key={index}>
                                            <Link
                                                href={item.href}
                                                className="text-muted-foreground hover:text-accent-foreground block duration-150">
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
                                    className={cn(isScrolled && 'lg:hidden')}
                                    style={{ borderColor: 'rgba(255,255,255,0.2)', color: 'white', background: 'transparent' }}>
                                    <Link href="/login">
                                        <span>Entrar</span>
                                    </Link>
                                </Button>
                                <Button
                                    asChild
                                    size="sm"
                                    className={cn(isScrolled && 'lg:hidden')}
                                    style={{ backgroundColor: 'white', color: '#09090b' }}>
                                    <Link href="/cadastro">
                                        <span>Começar grátis</span>
                                    </Link>
                                </Button>
                                <Button
                                    asChild
                                    size="sm"
                                    className={cn(isScrolled ? 'lg:inline-flex' : 'hidden')}
                                    style={{ backgroundColor: 'white', color: '#09090b' }}>
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
    )
}
