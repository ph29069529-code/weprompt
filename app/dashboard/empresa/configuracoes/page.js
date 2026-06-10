'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function ConfiguracoesRedirect() {
  const router = useRouter()
  useEffect(() => {
    router.replace('/dashboard/empresa?tab=configuracoes')
  }, [router])
  return null
}
