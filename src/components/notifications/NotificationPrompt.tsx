import { useState, useEffect } from 'react';
import { Bell, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { requestNotificationPermission } from '@/hooks/useNotifications';

export const NotificationPrompt = () => {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if we should show the prompt
    const hasBeenDismissed = localStorage.getItem('notification-prompt-dismissed');
    const notificationPermission = 'Notification' in window ? Notification.permission : 'denied';
    
    if (!hasBeenDismissed && notificationPermission === 'default') {
      // Show prompt after a delay
      const timer = setTimeout(() => {
        setShow(true);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleEnable = async () => {
    const granted = await requestNotificationPermission();
    if (granted) {
      setShow(false);
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    setShow(false);
    localStorage.setItem('notification-prompt-dismissed', 'true');
  };

  if (!show || dismissed) return null;

  return (
    <div className="fixed bottom-20 md:bottom-8 left-4 right-4 md:left-auto md:right-8 md:w-96 z-50 animate-fade-in">
      <div className="bg-card border border-primary/30 rounded-lg p-4 shadow-lg neon-border">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-full bg-primary/20">
            <Bell className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <h4 className="font-display font-semibold text-sm uppercase tracking-wider mb-1">
              Enable Notifications
            </h4>
            <p className="text-sm text-muted-foreground mb-3">
              Stay updated with new events, messages, and team activity.
            </p>
            <div className="flex gap-2">
              <Button 
                size="sm" 
                onClick={handleEnable}
                className="btn-hero text-xs"
              >
                Enable
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleDismiss}
                className="text-xs"
              >
                Not now
              </Button>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 -mt-1 -mr-1"
            onClick={handleDismiss}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
