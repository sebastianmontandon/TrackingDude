'use client'

import React from 'react'
import HostingForm from '../HostingForm'
import HostingTable from '../HostingTable'

export default function Hosting() {
  return (
    <div className="page-container">
      {/* Header */}
      <div className="section-header">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">Gestión de Hosting</h1>
        <p className="section-description">
          Administra tus servicios de hosting y servidores. Controla costos y mantén un seguimiento de todos tus servicios.
        </p>
      </div>
      
      {/* Hosting Form Section */}
      <div className="content-section">
        <div className="section-header">
          <h2 className="section-title">Agregar Nuevo Hosting</h2>
          <p className="section-description">
            Registra un nuevo servicio de hosting en tu sistema
          </p>
        </div>
        <HostingForm />
      </div>
      
      {/* Hosting Table Section */}
      <div className="content-section">
        <div className="section-header">
          <h2 className="section-title">Servicios de Hosting</h2>
          <p className="section-description">
            Todos tus servicios de hosting con información de costos y configuración
          </p>
        </div>
        <HostingTable />
      </div>
    </div>
  )
} 