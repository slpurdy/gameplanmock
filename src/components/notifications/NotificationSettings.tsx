import { useState, useEffect } from 'react';
import { Bell, BellOff, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { requestNotificationPermission } from '@/hooks/useNotifications';

export const NotificationSettings = () => {
  const { toast } = useToast();
  const [pushEnabled, setPushEnabled] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>('default');

  useEffect(() => {
    if ('Notification' in window) {
      setPermissionStatus(Notification.permission);
      setPushEnabled(Notification.permission === 'granted');
    }
  }, []);

  const handleEnablePush = async () => {
    const granted = await requestNotificationPermission();
    
    if (granted) {
      setPushEnabled(true);
      setPermissionStatus('granted');
      toast({
        title: 'Push Notifications Enabled',
        description: 'You will now receive push notifications for important updates.',
      });
    } else {
      setPushEnabled(false);
      setPermissionStatus(Notification.permission);
      toast({
        title: 'Permission Denied',
        description: 'Push notifications were not enabled. You can change this in your browser settings.',
        variant: 'destructive',
      });
    }
  };

  const handleToggle = async (enabled: boolean) => {
    if (enabled) {
      await handleEnablePush();
    } else {
      setPushEnabled(false);
      toast({
        title: 'Push Notifications Disabled',
        description: 'You will no longer receive push notifications.',
      });
    }
  };

  return (
    <Card className="neon-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-display uppercase tracking-wider">
          <Bell className="h-5 w-5 text-primary" />
          Push Notifications
        </CardTitle>
        <CardDescription>
          Receive notifications even when the app is closed
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="push-notifications" className="font-medium">
              Enable Push Notifications
            </Label>
            <p className="text-sm text-muted-foreground">
              Get notified about new events, messages, and updates
            </p>
          </div>
          <Switch
            id="push-notifications"
            checked={pushEnabled}
            onCheckedChange={handleToggle}
            disabled={permissionStatus === 'denied'}
          />
        </div>

        {permissionStatus === 'denied' && (
          <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-sm">
            <div className="flex items-start gap-2">
              <BellOff className="h-5 w-5 text-destructive mt-0.5" />
              <div>
                <p className="font-medium text-destructive">Notifications Blocked</p>
                <p className="text-muted-foreground mt-1">
                  Push notifications are blocked in your browser settings. 
                  To enable them, click the lock icon in your browser's address bar and allow notifications.
                </p>
              </div>
            </div>
          </div>
        )}

        {permissionStatus === 'granted' && (
          <div className="p-4 rounded-lg bg-accent/10 border border-accent/20 text-sm">
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5 text-accent" />
              <p className="text-accent font-medium">Push notifications are enabled</p>
            </div>
          </div>
        )}

        <div className="space-y-4 pt-4 border-t border-border/50">
          <p className="text-sm font-medium">Notification Preferences</p>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="event-notifications" className="text-sm text-muted-foreground">
              New events
            </Label>
            <Switch id="event-notifications" defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="rsvp-notifications" className="text-sm text-muted-foreground">
              RSVP updates
            </Label>
            <Switch id="rsvp-notifications" defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="message-notifications" className="text-sm text-muted-foreground">
              New messages
            </Label>
            <Switch id="message-notifications" defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="payment-notifications" className="text-sm text-muted-foreground">
              Payment reminders
            </Label>
            <Switch id="payment-notifications" defaultChecked />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
