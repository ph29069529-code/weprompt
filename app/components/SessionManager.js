'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { supabase } from '../lib/supabase'

const INACTIVITY_MS  = 7 * 24 * 60 * 60 * 1000  // 7 days in ms
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60           // 7 days in seconds
const COOKIE_NAME    = 'wp_last_activity'
const THROTTLE_MS    = 60 * 1000                  // write cookie at most once/minute

function readActivityCookie() {
  if (typeof document === 'undefined') return null
  const m = document.cookie.match(new RegExp('(?:^|; )' + COOKIE_NAME + '=([^;]*)'))
  return m ? Number(decodeURIComponent(m[1])) : null
}

function writeActivityCookie() {
  document.cookie = `${COOKIE_NAME}=${Date.now()}; max-age=${COOKIE_MAX_AGE}; path=/; SameSite=Lax`
}

export default function SessionManager() {
  const router   = useRouter()
  const pathname = usePathname()

  // On every page navigation: check if the session has gone stale
  useEffect(() => {
    async function checkStaleSession() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return  // not logged in — nothing to enforce

      const lastActivity = readActivityCookie()

      if (lastActivity === null) {
        // Logged-in user, but no cookie yet (first visit after deploy).
        // Grant them a fresh window — don't log them out immediately.
        writeActivityCookie()
        return
      }

      if (Date.now() - lastActivity > INACTIVITY_MS) {
        await supabase.auth.signOut()
        router.replace('/login')
      }
    }

    checkStaleSession()
  }, [pathname]) // eslint-disable-line react-hooks/exhaustive-deps

  // Track user activity — throttled to one cookie write per minute
  useEffect(() => {
    let lastWrite = 0

    function onActivity() {
      const now = Date.now()
      if (now - lastWrite < THROTTLE_MS) return
      lastWrite = now
      writeActivityCookie()
    }

    const events = ['click', 'keypress', 'scroll', 'touchstart']
    events.forEach(ev => window.addEventListener(ev, onActivity, { passive: true }))
    return () => events.forEach(ev => window.removeEventListener(ev, onActivity))
  }, [])

  return null
}
