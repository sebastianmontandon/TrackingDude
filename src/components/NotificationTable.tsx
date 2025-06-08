'use client'

import React, { useState } from 'react';
import { Bell, Calendar, Globe, Server, Trash2, ArrowUpDown } from 'lucide-react';
import { useNotificationContext, Notification } from '../contexts/NotificationContext';
import ConfirmDialog from './ConfirmDialog';

interface NotificationTableProps {
  type: 'domain' | 'hosting';
}

const NotificationTable: React.FC<NotificationTableProps> = ({ type }) => {
  const { notifications, removeNotification, loading, error } = useNotificationContext();
  const [sortField, setSortField] = useState<keyof Notification>('domain');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    notificationId: string;
    notificationDomain: string;
  }>({
    isOpen: false,
    notificationId: '',
    notificationDomain: ''
  });
  
  // Convert UI type to API type for filtering
  const apiType = type === 'domain' ? 'DOMAIN' : 'HOSTING';
  
  const filteredNotifications = notifications.filter(
    notification => notification.type === apiType
  );

  // Show loading state
  if (loading) {
    return (
      <div className="form-section notification-table">
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading notifications...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="form-section notification-table">
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="text-red-500 mb-2">⚠️</div>
            <p className="text-red-500">Error: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  const handleSort = (field: keyof Notification) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortedNotifications = () => {
    return [...filteredNotifications].sort((a, b) => {
      let comparison = 0;
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (aValue < bValue) {
        comparison = -1;
      } else if (aValue > bValue) {
        comparison = 1;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  };

  const getNotificationMethodBadge = (method: 'EMAIL' | 'WHATSAPP') => {
    switch (method) {
      case 'EMAIL':
        return { color: 'bg-blue-500', label: 'Email' };
      case 'WHATSAPP':
        return { color: 'bg-green-600', label: 'WhatsApp' };
      default:
        return { color: 'bg-gray-500', label: method };
    }
  };

  const handleDeleteClick = (notificationId: string, notificationDomain: string) => {
    setDeleteDialog({
      isOpen: true,
      notificationId,
      notificationDomain
    });
  };

  const handleDeleteConfirm = async () => {
    try {
      await removeNotification(deleteDialog.notificationId);
    } catch (error) {
      console.error('Error eliminando notificación:', error);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({
      isOpen: false,
      notificationId: '',
      notificationDomain: ''
    });
  };

  const sortedNotifications = getSortedNotifications();

  return (
    <>
      <div className="form-section notification-table">
        <div className="table-container">
          <table className="table-responsive">
            <thead className="table-header">
              <tr>
                <th 
                  scope="col" 
                  className="table-header-cell col-domain"
                  onClick={() => handleSort('domain')}
                >
                  <div className="flex items-center gap-1">
                    {type === 'domain' ? (
                      <Globe size={14} className="text-muted-foreground" />
                    ) : (
                      <Server size={14} className="text-muted-foreground" />
                    )}
                    <span className="hidden sm:inline">
                      {type === 'domain' ? 'Domain' : 'Service'}
                    </span>
                    <span className="sm:hidden">
                      {type === 'domain' ? 'Dom.' : 'Svc.'}
                    </span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="table-header-cell col-provider hidden md:table-cell"
                  onClick={() => handleSort('provider')}
                >
                  <div className="flex items-center gap-1">
                    <span>Provider</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="table-header-cell col-date hidden lg:table-cell"
                  onClick={() => handleSort('notificationDate')}
                >
                  <div className="flex items-center gap-1">
                    <Calendar size={14} className="text-muted-foreground" />
                    <span>Date</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="table-header-cell col-method"
                  onClick={() => handleSort('notificationMethod')}
                >
                  <div className="flex items-center gap-1">
                    <Bell size={14} className="text-muted-foreground" />
                    <span className="hidden sm:inline">Method</span>
                    <span className="sm:hidden">Meth.</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
                <th scope="col" className="table-header-cell col-actions">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="table-body">
              {sortedNotifications.map((notification) => {
                const methodInfo = getNotificationMethodBadge(notification.notificationMethod);
                
                return (
                  <tr key={notification.id} className="table-row">
                    <td className="table-cell col-domain">
                      <div className="min-w-0">
                        <div className="table-cell-text-primary truncate">{notification.domain}</div>
                        <div className="md:hidden table-cell-text-secondary text-xs mt-1 space-y-1">
                          <div className="truncate">{notification.provider}</div>
                          <div className="lg:hidden text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar size={12} />
                            <span className="truncate">{notification.notificationDate}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="table-cell col-provider hidden md:table-cell">
                      <div className="table-cell-text-secondary truncate">{notification.provider}</div>
                    </td>
                    <td className="table-cell col-date hidden lg:table-cell">
                      <div className="table-cell-text-secondary text-xs flex items-center gap-1">
                        <Calendar size={12} className="flex-shrink-0" />
                        <span className="truncate">{notification.notificationDate}</span>
                      </div>
                    </td>
                    <td className="table-cell col-method">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white ${methodInfo.color}`}>
                            <span className="hidden sm:inline">{methodInfo.label}</span>
                            <span className="sm:hidden">{methodInfo.label.substring(0, 3)}</span>
                          </span>
                        </div>
                        <div className="md:hidden text-xs text-muted-foreground mt-1">
                          <span className="truncate">
                            {type === 'domain' ? 'Domain notification' : 'Hosting notification'}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="table-cell col-actions text-right">
                      <button
                        onClick={() => handleDeleteClick(notification.id, notification.domain)}
                        className="text-red-500 hover:text-red-400 transition-colors p-1.5 rounded-md hover:bg-red-900/20 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                        title="Delete notification"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filteredNotifications.length === 0 && (
                <tr>
                  <td colSpan={5} className="table-cell text-center text-muted-foreground py-8">
                    <div className="flex flex-col items-center space-y-2">
                      <Bell className="w-8 h-8 text-muted-foreground/50" />
                      <span>No notifications for {type === 'domain' ? 'domains' : 'hosting services'}</span>
                      <span className="text-xs">Notifications will appear here automatically</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Confirm deletion"
        message={`Are you sure you want to delete the notification for "${deleteDialog.notificationDomain}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </>
  );
};

export default NotificationTable;