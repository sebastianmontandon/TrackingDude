'use client'

import React from 'react'
import DomainForm from '../DomainForm'
import DomainTable from '../DomainTable'

export default function Domains() {
  return (
    <div className="page-container">
      {/* Header */}
      <div className="section-header">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">Domain Management</h1>
        <p className="section-description">
          Manage your domains, renew on time, and keep track of all your domain services.
        </p>
      </div>
      
      {/* Domain Form Section */}
      <div className="content-section">
        <div className="section-header">
          <h2 className="section-title">Add New Domain</h2>
          <p className="section-description">
            Register a new domain in your system
          </p>
        </div>
        <DomainForm />
      </div>
      
      {/* Domain Table Section */}
      <div className="content-section">
        <div className="section-header">
          <h2 className="section-title">Your Domains</h2>
          <p className="section-description">
            All your domains with expiration and cost information
          </p>
        </div>
        <DomainTable />
      </div>
    </div>
  )
}
