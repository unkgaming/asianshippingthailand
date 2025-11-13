'use client'
import React from 'react'

export default function StatsCard({ title, value }: { title: string; value: string | number }) {
  return (
    <div>
      <h4>{title}</h4>
      <p>{value}</p>
    </div>
  )
}
