'use client'

import React from 'react'
import HostingForm from '../HostingForm'
import HostingTable from '../HostingTable'

export default function Hosting() {
  return (
    <div className="page-container">
      {/* Header */}
      <div className="section-header">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">Hosting Management</h1>
        <p className="section-description">
          Manage your hosting services and servers. Control costs and keep track of all your services.
        </p>
      </div>
      
      {/* Hosting Form Section */}
      <div className="content-section">
        <div className="section-header">
          <h2 className="section-title">Add New Hosting</h2>
          <p className="section-description">
            Register a new hosting service in your system
          </p>
        </div>
        <HostingForm />
      </div>
      
      {/* Hosting Table Section */}
      <div className="content-section">
        <div className="section-header">
          <h2 className="section-title">Hosting Services</h2>
          <p className="section-description">
            All your hosting services with cost and configuration information
          </p>
        </div>
        <HostingTable />
      </div>
    </div>
  )
} 