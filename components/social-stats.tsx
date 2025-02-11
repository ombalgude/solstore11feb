"use client"

import { useEffect, useState } from "react"
import { Users } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface SocialStatsProps {
  username: string
}

interface SocialStats {
  platform: string
  followers: number
  error?: string
}

export function SocialStats({ username }: SocialStatsProps) {
  const [stats, setStats] = useState<SocialStats[]>([])
  const [totalFollowers, setTotalFollowers] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`/api/social-stats?username=${username}`)
        const data = await response.json()
        
        if (response.ok) {
          setStats(data.stats)
          setTotalFollowers(data.total)
        }
      } catch (error) {
        console.error('Error fetching social stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [username])

  if (loading) {
    return (
      <Card className="p-4">
        <div className="flex items-center gap-4">
          <Skeleton className="w-10 h-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-3 w-[60px]" />
          </div>
        </div>
      </Card>
    )
  }

  if (!stats.length) return null

  return (
    <Card className="p-4">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
          <Users className="w-5 h-5 text-primary" />
        </div>
        <div>
          <div className="font-semibold">
            {totalFollowers.toLocaleString()} Total Followers
          </div>
          <div className="text-sm text-muted-foreground">
            Across {stats.length} platforms
          </div>
        </div>
      </div>
    </Card>
  )
}