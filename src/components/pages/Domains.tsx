'use client'

import React from 'react'
import DomainForm from '../DomainForm'
import DomainTable from '../DomainTable'

export default function Domains() {
  return (
    <div className="page-container">
      {/* Header */}
      <div className="section-header">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">Gestión de Dominios</h1>
        <p className="section-description">
          Administra tus dominios, renueva a tiempo y mantén un registro de todos tus servicios de dominio.
        </p>
      </div>
      
      {/* Domain Form Section */}
      <div className="content-section">
        <div className="section-header">
          <h2 className="section-title">Agregar Nuevo Dominio</h2>
          <p className="section-description">
            Registra un nuevo dominio en tu sistema
          </p>
        </div>
        <DomainForm />
      </div>
      
      {/* Domain Table Section */}
      <div className="content-section">
        <div className="section-header">
          <h2 className="section-title">Tus Dominios</h2>
          <p className="section-description">
            Todos tus dominios con información de vencimiento y costos
          </p>
        </div>
        <DomainTable />
      </div>
    </div>
  )
}
