
import React, { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  AlertNotification, 
  getUnreadAlertNotifications, 
  markAlertAsRead 
} from "@/services/dashboard/alertService";
import { cn } from "@/lib/utils";

export function AlertNotifications() {
  const [notifications, setNotifications] = useState<AlertNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Load notifications
  const loadNotifications = async () => {
    try {
      setIsLoading(true);
      const data = await getUnreadAlertNotifications();
      setNotifications(data);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Load notifications on mount
  useEffect(() => {
    loadNotifications();
    
    // Set up interval to refresh notifications
    const interval = setInterval(() => {
      loadNotifications();
    }, 60000); // Every minute
    
    return () => clearInterval(interval);
  }, []);
  
  // Handle marking notification as read
  const handleMarkAsRead = async (id: string) => {
    try {
      await markAlertAsRead(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };
  
  // Handle mark all as read
  const handleMarkAllAsRead = async () => {
    try {
      for (const notification of notifications) {
        await markAlertAsRead(notification.id);
      }
      setNotifications([]);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };
  
  // Format date for display
  const formatDate = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / 60000);
    const diffHours = Math.round(diffMins / 60);
    const diffDays = Math.round(diffHours / 24);
    
    if (diffMins < 60) {
      return `${diffMins} min atrás`;
    } else if (diffHours < 24) {
      return `${diffHours} hora${diffHours !== 1 ? 's' : ''} atrás`;
    } else {
      return `${diffDays} dia${diffDays !== 1 ? 's' : ''} atrás`;
    }
  };
  
  // Get severity class based on condition
  const getSeverityClass = (condition: string, metricValue: number, threshold: number) => {
    if (condition === 'greater_than' && metricValue > threshold * 1.5) return 'bg-red-100 text-red-800 border-red-300';
    if (condition === 'less_than' && metricValue < threshold * 0.5) return 'bg-red-100 text-red-800 border-red-300';
    return 'bg-yellow-100 text-yellow-800 border-yellow-300';
  };
  
  // Format condition for display
  const formatCondition = (condition: string, threshold: number, value: number) => {
    switch (condition) {
      case 'greater_than': return `acima de ${threshold} (${value})`;
      case 'less_than': return `abaixo de ${threshold} (${value})`;
      case 'equal_to': return `igual a ${threshold} (${value})`;
      case 'not_equal_to': return `diferente de ${threshold} (${value})`;
      default: return condition;
    }
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-xl flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Alertas do Dashboard
          </CardTitle>
          <CardDescription>
            Notificações de métricas que estão fora dos valores esperados
          </CardDescription>
        </div>
        {notifications.length > 0 && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleMarkAllAsRead}
          >
            Marcar todos como lidos
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="py-8 text-center">Carregando notificações...</div>
        ) : notifications.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            Não há notificações de alerta no momento.
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div 
                key={notification.id}
                className={cn(
                  "p-4 rounded-lg border",
                  getSeverityClass(notification.condition, notification.metricValue, notification.threshold)
                )}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">
                      {notification.metricName} {formatCondition(notification.condition, notification.threshold, notification.metricValue)}
                    </h4>
                    <div className="text-sm mt-1">
                      <span className="font-medium">Departamento:</span> {notification.department}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {formatDate(notification.timestamp)}
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleMarkAsRead(notification.id)}
                  >
                    Marcar como lido
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
