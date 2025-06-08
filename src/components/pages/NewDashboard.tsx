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

  // Calculate data for the charts
  const chartData = useMemo(() => {
    const monthlyData: { [key: string]: number } = {};
    const yearlyData: { [key: number]: number } = {};
    
    // Process domains (assuming they have an associated cost)
    domains.forEach(domain => {
      const date = new Date(domain.creationDate);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const year = date.getFullYear();
      
      // Use the actual total cost of the domain
      const domainCost = domain.totalCost || 0;
      
      monthlyData[monthKey] = (monthlyData[monthKey] || 0) + domainCost;
      yearlyData[year] = (yearlyData[year] || 0) + domainCost;
    });

    // Process hostings
    hostings.forEach(hosting => {
      const date = new Date(hosting.registrationDate);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const year = date.getFullYear();
      
      // Calculate total cost with maintenance
      const totalCost = hosting.baseCost * 1.2; // 20% maintenance
      
      monthlyData[monthKey] = (monthlyData[monthKey] || 0) + totalCost;
      yearlyData[year] = (yearlyData[year] || 0) + totalCost;
    });

    // Convert to arrays for the charts
    const monthlyChartData = Object.entries(monthlyData)
      .map(([month, revenue]) => ({ month, revenue }))
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-12); // Last 12 months

    const yearlyChartData = Object.entries(yearlyData)
      .map(([year, revenue]) => ({ year: parseInt(year), revenue }))
      .sort((a, b) => a.year - b.year);

    return { monthlyChartData, yearlyChartData };
  }, [domains, hostings]);

  // Calculate totals
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
          Overview of all your operations, domains, and hosting. Manage your business from a single place.
        </p>
      </div>
      
      {/* Statistics Cards */}
      <div className="content-section">
        <div className="section-header">
          <h2 className="section-title">General Summary</h2>
          <p className="section-description">
            Overview of the status of all your domains and services
          </p>
        </div>
        <div className="stats-grid">
          <StatisticsCards />
        </div>
      </div>

      {/* Revenue Summary Cards */}
      <div className="content-section">
        <div className="section-header">
          <h2 className="section-title">Financial Summary</h2>
          <p className="section-description">
            Information about your services' revenue and profits
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Monthly Revenue</p>
                <p className="text-sm font-medium text-muted-foreground">Monthly Revenue</p>
                <p className="text-2xl font-bold text-foreground">${totalMonthlyRevenue.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">Last 12 months</p>
              </div>
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Annual Revenue</p>
                <p className="text-2xl font-bold text-foreground">${totalYearlyRevenue.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">All years</p>
              </div>
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Current Year</p>
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
          <h2 className="section-title">Earnings Analysis</h2>
          <p className="section-description">
            Detailed charts of your earnings by period
          </p>
        </div>
        
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Monthly Revenue Chart */}
          <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-foreground">Monthly Earnings</h3>
              <p className="text-sm text-muted-foreground">Last 12 months</p>
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
              <h3 className="text-lg font-semibold text-foreground">Annual Earnings</h3>
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
                    formatter={(value: number) => [`$${value.toFixed(2)}`, 'Revenue']}
                    labelFormatter={(label) => `Year: ${label}`}
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