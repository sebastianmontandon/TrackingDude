'use client'

import React, { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import { TrendingUp, TrendingDown, DollarSign, Calendar } from 'lucide-react'
import StatisticsCards from '../StatisticsCards'
import { useDomainContext } from '../../contexts/DomainContext'
import { useHostingContext } from '../../contexts/HostingContext'

interface ChartData {
  month: string;
  year: number;
  revenue: number;
}

const NewDashboard = () => {
  const { domains } = useDomainContext();
  const { hostings } = useHostingContext();

  // Calcular datos para las gráficas
  const chartData = useMemo(() => {
    const monthlyData: { [key: string]: number } = {};
    const yearlyData: { [key: number]: number } = {};
    
    // Procesar dominios (asumiendo que tienen un costo asociado)
    domains.forEach(domain => {
      const date = new Date(domain.creationDate);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const year = date.getFullYear();
      
      // Usar el costo total real del dominio
      const domainCost = domain.totalCost || 0;
      
      monthlyData[monthKey] = (monthlyData[monthKey] || 0) + domainCost;
      yearlyData[year] = (yearlyData[year] || 0) + domainCost;
    });

    // Procesar hostings
    hostings.forEach(hosting => {
      const date = new Date(hosting.registrationDate);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const year = date.getFullYear();
      
      // Calcular costo total con mantenimiento
      const totalCost = hosting.baseCost * 1.2; // 20% de mantenimiento
      
      monthlyData[monthKey] = (monthlyData[monthKey] || 0) + totalCost;
      yearlyData[year] = (yearlyData[year] || 0) + totalCost;
    });

    // Convertir a arrays para las gráficas
    const monthlyChartData = Object.entries(monthlyData)
      .map(([month, revenue]) => ({ month, revenue }))
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-12); // Últimos 12 meses

    const yearlyChartData = Object.entries(yearlyData)
      .map(([year, revenue]) => ({ year: parseInt(year), revenue }))
      .sort((a, b) => a.year - b.year);

    return { monthlyChartData, yearlyChartData };
  }, [domains, hostings]);

  // Calcular totales
  const totalMonthlyRevenue = chartData.monthlyChartData.reduce((sum, item) => sum + item.revenue, 0);
  const totalYearlyRevenue = chartData.yearlyChartData.reduce((sum, item) => sum + item.revenue, 0);
  const currentYear = new Date().getFullYear();
  const currentYearRevenue = chartData.yearlyChartData.find(item => item.year === currentYear)?.revenue || 0;

  return (
    <div className="page-container">
      {/* Header */}
      <div className="section-header">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">Dashboard</h1>
        <p className="section-description">
          Vista general de todas tus operaciones, dominios y hosting. Controla tu negocio desde un solo lugar.
        </p>
      </div>
      
      {/* Statistics Cards */}
      <div className="content-section">
        <div className="section-header">
          <h2 className="section-title">Resumen General</h2>
          <p className="section-description">
            Vista general del estado de todos tus dominios y servicios
          </p>
        </div>
        <div className="stats-grid">
          <StatisticsCards />
        </div>
      </div>

      {/* Revenue Summary Cards */}
      <div className="content-section">
        <div className="section-header">
          <h2 className="section-title">Resumen Financiero</h2>
          <p className="section-description">
            Información sobre ingresos y ganancias de tus servicios
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Ingresos Mensuales</p>
                <p className="text-2xl font-bold text-foreground">${totalMonthlyRevenue.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">Últimos 12 meses</p>
              </div>
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Ingresos Anuales</p>
                <p className="text-2xl font-bold text-foreground">${totalYearlyRevenue.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">Todos los años</p>
              </div>
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Año Actual</p>
                <p className="text-2xl font-bold text-foreground">${currentYearRevenue.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">{currentYear}</p>
              </div>
              <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="content-section">
        <div className="section-header">
          <h2 className="section-title">Análisis de Ganancias</h2>
          <p className="section-description">
            Gráficas detalladas de tus ingresos por período
          </p>
        </div>
        
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Monthly Revenue Chart */}
          <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-foreground">Ganancias Mensuales</h3>
              <p className="text-sm text-muted-foreground">Últimos 12 meses</p>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData.monthlyChartData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="month" 
                    className="text-xs"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    className="text-xs"
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip 
                    formatter={(value: number) => [`$${value.toFixed(2)}`, 'Ingresos']}
                    labelFormatter={(label) => `Mes: ${label}`}
                  />
                  <Bar 
                    dataKey="revenue" 
                    fill="hsl(var(--primary))" 
                    radius={[4, 4, 0, 0]}
                    className="opacity-80 hover:opacity-100"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Yearly Revenue Chart */}
          <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-foreground">Ganancias Anuales</h3>
              <p className="text-sm text-muted-foreground">Todos los años</p>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData.yearlyChartData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="year" 
                    className="text-xs"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    className="text-xs"
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip 
                    formatter={(value: number) => [`$${value.toFixed(2)}`, 'Ingresos']}
                    labelFormatter={(label) => `Año: ${label}`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={3}
                    dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 6 }}
                    activeDot={{ r: 8, strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewDashboard 