'use client'
import React from 'react'

export default function LanguageSelector() {
  return (
    <div>
      <label htmlFor="lang">Language: </label>
      <select id="lang" name="lang">
        <option value="en">English</option>
        <option value="ko">Korean</option>
      </select>
    </div>
  )
}
