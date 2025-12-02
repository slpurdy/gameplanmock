// Generate ICS file for calendar download
export function generateICSFile(event: {
  title: string;
  description?: string;
  location: string;
  date: string; // YYYY-MM-DD format
  time: string; // HH:MM format
  duration?: number; // in hours, default 2
}): string {
  const { title, description, location, date, time, duration = 2 } = event;
  
  // Parse date and time
  const [year, month, day] = date.split('-').map(Number);
  const [hours, minutes] = time.split(':').map(Number);
  
  // Create start date
  const startDate = new Date(year, month - 1, day, hours, minutes);
  const endDate = new Date(startDate.getTime() + duration * 60 * 60 * 1000);
  
  // Format dates for ICS (YYYYMMDDTHHMMSS)
  const formatICSDate = (d: Date) => {
    return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };
  
  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//GamePlan//Event//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `DTSTART:${formatICSDate(startDate)}`,
    `DTEND:${formatICSDate(endDate)}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${description || ''}`,
    `LOCATION:${location}`,
    `UID:${Date.now()}@gameplan.app`,
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');
  
  return icsContent;
}

export function downloadICSFile(event: {
  title: string;
  description?: string;
  location: string;
  date: string;
  time: string;
  duration?: number;
}): void {
  const icsContent = generateICSFile(event);
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `${event.title.replace(/[^a-z0-9]/gi, '_')}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function openGoogleCalendar(event: {
  title: string;
  description?: string;
  location: string;
  date: string;
  time: string;
  duration?: number;
}): void {
  const { title, description, location, date, time, duration = 2 } = event;
  
  // Parse date and time
  const [year, month, day] = date.split('-').map(Number);
  const [hours, minutes] = time.split(':').map(Number);
  
  const startDate = new Date(year, month - 1, day, hours, minutes);
  const endDate = new Date(startDate.getTime() + duration * 60 * 60 * 1000);
  
  // Format for Google Calendar (YYYYMMDDTHHMMSS)
  const formatGoogleDate = (d: Date) => {
    return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };
  
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${formatGoogleDate(startDate)}/${formatGoogleDate(endDate)}`,
    details: description || '',
    location: location,
  });
  
  window.open(`https://calendar.google.com/calendar/render?${params.toString()}`, '_blank');
}
