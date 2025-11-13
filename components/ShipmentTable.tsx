'use client'
import React from 'react'

export default function ShipmentTable({ shipments }: { shipments?: Array<any> }) {
  return (
    <table>
      <thead>
        <tr><th>ID</th><th>Status</th></tr>
      </thead>
      <tbody>
        {shipments?.map((s: any) => (
          <tr key={s.id}><td>{s.id}</td><td>{s.status}</td></tr>
        ))}
      </tbody>
    </table>
  )
}
