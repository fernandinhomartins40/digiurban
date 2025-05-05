
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
    // Fetch applicable alert rules
    const { data: rules, error } = await supabase
      .from('dashboard_alert_rules')
      .select('*')
      .eq('metric_name', metricName)
      .eq('department', department)
      .eq('is_active', true);
    
    if (error) throw error;
    
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
        const { error: insertError } = await supabase
          .from('dashboard_alert_notifications')
          .insert({
            rule_id: rule.id,
            metric_name: metricName,
            metric_value: value,
            threshold: rule.threshold,
            condition: rule.condition,
            department: department,
            is_read: false,
          });
        
        if (insertError) throw insertError;
        
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
    const { data, error } = await supabase
      .from('dashboard_alert_notifications')
      .select('*')
      .eq('is_read', false)
      .order('timestamp', { ascending: false });
    
    if (error) throw error;
    
    return (data || []).map(notification => ({
      id: notification.id,
      ruleId: notification.rule_id,
      metricName: notification.metric_name,
      metricValue: notification.metric_value,
      threshold: notification.threshold,
      condition: notification.condition,
      timestamp: new Date(notification.timestamp),
      isRead: notification.is_read,
      department: notification.department
    }));
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
    const { error } = await supabase
      .from('dashboard_alert_notifications')
      .update({ is_read: true })
      .eq('id', id);
    
    if (error) throw error;
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
    const { data, error } = await supabase
      .from('dashboard_alert_rules')
      .insert({
        name: rule.name,
        metric_name: rule.metricName,
        condition: rule.condition,
        threshold: rule.threshold,
        department: rule.department,
        is_active: rule.isActive,
        created_by: rule.createdBy
      })
      .select('id')
      .single();
    
    if (error) throw error;
    
    return data?.id || null;
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
