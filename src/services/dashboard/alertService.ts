
import { toast } from "@/hooks/use-toast";
// Since dashboard_alert_rules and dashboard_alert_notifications tables don't exist yet,
// we'll use local storage to simulate the functionality until proper DB tables are created

export type AlertCondition = 'greater_than' | 'less_than' | 'equal_to' | 'not_equal_to';

export interface AlertRule {
  id: string;
  name: string;
  metricName: string;
  condition: AlertCondition;
  threshold: number;
  department: string;
  isActive: boolean;
  createdAt: Date;
  createdBy: string;
}

export interface AlertNotification {
  id: string;
  ruleId: string;
  metricName: string;
  metricValue: number;
  threshold: number;
  condition: AlertCondition;
  timestamp: Date;
  isRead: boolean;
  department: string;
}

// In-memory storage until database tables are created
const LOCAL_STORAGE_RULES_KEY = 'dashboard_alert_rules';
const LOCAL_STORAGE_NOTIFICATIONS_KEY = 'dashboard_alert_notifications';

// Helper to get stored rules
const getStoredRules = (): AlertRule[] => {
  try {
    const storedRules = localStorage.getItem(LOCAL_STORAGE_RULES_KEY);
    return storedRules ? JSON.parse(storedRules) : [];
  } catch (error) {
    console.error('Error retrieving stored alert rules:', error);
    return [];
  }
};

// Helper to save rules
const saveRules = (rules: AlertRule[]): void => {
  try {
    localStorage.setItem(LOCAL_STORAGE_RULES_KEY, JSON.stringify(rules));
  } catch (error) {
    console.error('Error saving alert rules:', error);
  }
};

// Helper to get stored notifications
const getStoredNotifications = (): AlertNotification[] => {
  try {
    const storedNotifications = localStorage.getItem(LOCAL_STORAGE_NOTIFICATIONS_KEY);
    return storedNotifications ? JSON.parse(storedNotifications) : [];
  } catch (error) {
    console.error('Error retrieving stored alert notifications:', error);
    return [];
  }
};

// Helper to save notifications
const saveNotifications = (notifications: AlertNotification[]): void => {
  try {
    localStorage.setItem(LOCAL_STORAGE_NOTIFICATIONS_KEY, JSON.stringify(notifications));
  } catch (error) {
    console.error('Error saving alert notifications:', error);
  }
};

/**
 * Evaluates metric data against defined alert rules
 * @param metricName The name of the metric to evaluate
 * @param value The current value of the metric
 * @param department The department the metric belongs to
 */
export async function evaluateMetricForAlerts(
  metricName: string, 
  value: number,
  department: string
): Promise<void> {
  try {
    // Fetch applicable alert rules from local storage
    const rules = getStoredRules().filter(
      rule => rule.metricName === metricName && 
             rule.department === department && 
             rule.isActive
    );
    
    if (!rules || rules.length === 0) return;
    
    // Evaluate each rule
    for (const rule of rules) {
      let isTriggered = false;
      
      switch (rule.condition) {
        case 'greater_than':
          isTriggered = value > rule.threshold;
          break;
        case 'less_than':
          isTriggered = value < rule.threshold;
          break;
        case 'equal_to':
          isTriggered = value === rule.threshold;
          break;
        case 'not_equal_to':
          isTriggered = value !== rule.threshold;
          break;
      }
      
      if (isTriggered) {
        // Create alert notification
        const notification: AlertNotification = {
          id: Date.now().toString(),
          ruleId: rule.id,
          metricName: metricName,
          metricValue: value,
          threshold: rule.threshold,
          condition: rule.condition,
          timestamp: new Date(),
          isRead: false,
          department: department
        };
        
        const notifications = getStoredNotifications();
        notifications.push(notification);
        saveNotifications(notifications);
        
        // Show toast notification
        toast({
          title: "Alerta de Dashboard",
          description: `${rule.name}: ${metricName} está ${formatCondition(rule.condition)} ${rule.threshold} (Valor atual: ${value})`,
          variant: "destructive",
        });
      }
    }
  } catch (error) {
    console.error('Error evaluating metrics for alerts:', error);
  }
}

/**
 * Fetches unread alert notifications for display
 */
export async function getUnreadAlertNotifications(): Promise<AlertNotification[]> {
  try {
    const notifications = getStoredNotifications();
    return notifications
      .filter(notification => !notification.isRead)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  } catch (error) {
    console.error('Error fetching unread alert notifications:', error);
    return [];
  }
}

/**
 * Marks an alert notification as read
 * @param id The ID of the notification to mark as read
 */
export async function markAlertAsRead(id: string): Promise<void> {
  try {
    const notifications = getStoredNotifications();
    const updatedNotifications = notifications.map(notification => 
      notification.id === id ? { ...notification, isRead: true } : notification
    );
    saveNotifications(updatedNotifications);
  } catch (error) {
    console.error('Error marking alert as read:', error);
  }
}

/**
 * Creates a new alert rule
 * @param rule The alert rule to create
 */
export async function createAlertRule(rule: Omit<AlertRule, 'id' | 'createdAt'>): Promise<string | null> {
  try {
    const newRule: AlertRule = {
      id: Date.now().toString(),
      createdAt: new Date(),
      ...rule
    };
    
    const rules = getStoredRules();
    rules.push(newRule);
    saveRules(rules);
    
    return newRule.id;
  } catch (error) {
    console.error('Error creating alert rule:', error);
    return null;
  }
}

/**
 * Helper function to format condition for display
 */
function formatCondition(condition: AlertCondition): string {
  switch (condition) {
    case 'greater_than': return 'acima de';
    case 'less_than': return 'abaixo de';
    case 'equal_to': return 'igual a';
    case 'not_equal_to': return 'diferente de';
    default: return condition;
  }
}
