'use client'

import React from 'react';
import { Bell, Calendar, Globe, Server } from 'lucide-react';
import { useNotificationContext, Notification } from '../contexts/NotificationContext';

interface NotificationTableProps {
  type: 'domain' | 'hosting';
}

const NotificationTable: React.FC<NotificationTableProps> = ({ type }) => {
  const { notifications } = useNotificationContext();
  
  const filteredNotifications = notifications.filter(
    notification => notification.type === type
  );

  const getNotificationMethodBadge = (method: string) => {
    switch (method.toLowerCase()) {
      case 'email':
        return { color: 'bg-blue-500', icon: '✉️', label: 'Email' };
      case 'sms':
        return { color: 'bg-green-500', icon: '📱', label: 'SMS' };
      case 'push':
        return { color: 'bg-purple-500', icon: '🔔', label: 'Push' };
      case 'whatsapp':
        return { color: 'bg-green-600', icon: '📞', label: 'WhatsApp' };
      default:
        return { color: 'bg-gray-500', icon: '📢', label: method };
    }
  };

  return (
    <div className="form-section notification-table">
      <div className="table-container">
        <table className="table-responsive">
          <thead className="table-header">
            <tr>
              <th scope="col" className="table-header-cell">
                <div className="flex items-center gap-1">
                  {type === 'domain' ? (
                    <Globe size={14} className="text-muted-foreground" />
                  ) : (
                    <Server size={14} className="text-muted-foreground" />
                  )}
                  <span className="hidden sm:inline">
                    {type === 'domain' ? 'Dominio' : 'Servicio'}
                  </span>
                  <span className="sm:hidden">
                    {type === 'domain' ? 'Dom.' : 'Serv.'}
                  </span>
                </div>
              </th>
              <th scope="col" className="table-header-cell hidden md:table-cell">
                <span>Proveedor</span>
              </th>
              <th scope="col" className="table-header-cell hidden lg:table-cell">
                <div className="flex items-center gap-1">
                  <Calendar size={14} className="text-muted-foreground" />
                  <span>Fecha</span>
                </div>
              </th>
              <th scope="col" className="table-header-cell">
                <div className="flex items-center gap-1">
                  <Bell size={14} className="text-muted-foreground" />
                  <span className="hidden sm:inline">Método</span>
                  <span className="sm:hidden">Mét.</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="table-body">
            {filteredNotifications.map((notification) => {
              const methodInfo = getNotificationMethodBadge(notification.notificationMethod);
              
              return (
                <tr key={notification.id} className="table-row">
                  <td className="table-cell">
                    <div className="min-w-0">
                      <div className="table-cell-text-primary truncate">{notification.domain}</div>
                      <div className="md:hidden table-cell-text-secondary text-xs mt-1 space-y-1">
                        <div className="truncate">{notification.provider}</div>
                        <div className="lg:hidden text-xs text-muted-foreground">
                          {notification.notificationDate}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="table-cell hidden md:table-cell">
                    <div className="table-cell-text-secondary truncate">{notification.provider}</div>
                  </td>
                  <td className="table-cell hidden lg:table-cell">
                    <div className="table-cell-text-secondary text-xs">{notification.notificationDate}</div>
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white ${methodInfo.color}`}>
                        <span className="mr-1">{methodInfo.icon}</span>
                        <span className="hidden sm:inline">{methodInfo.label}</span>
                        <span className="sm:hidden">{methodInfo.label.substring(0, 3)}</span>
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
            {filteredNotifications.length === 0 && (
              <tr>
                <td colSpan={4} className="table-cell text-center text-muted-foreground py-8">
                  <div className="flex flex-col items-center space-y-2">
                    <Bell className="w-8 h-8 text-muted-foreground/50" />
                    <span>No hay notificaciones para {type === 'domain' ? 'dominios' : 'servicios de hosting'}</span>
                    <span className="text-xs">Las notificaciones aparecerán aquí automáticamente</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NotificationTable;