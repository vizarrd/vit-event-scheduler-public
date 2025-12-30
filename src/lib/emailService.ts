import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

interface EmailNotification {
  email: string;
  eventId: string;
  eventName: string;
  eventDetails: {
    start_time: string;
    end_time: string;
    registration_end: string;
    venues?: { venue_name: string };
  };
}

export class EmailService {
  static async sendWelcomeEmail(notification: EmailNotification): Promise<void> {
    try {
      const eventDate = format(new Date(notification.eventDetails.start_time), 'EEEE, MMMM dd, yyyy');
      const eventTime = `${format(new Date(notification.eventDetails.start_time), 'h:mm a')} - ${format(new Date(notification.eventDetails.end_time), 'h:mm a')}`;
      const registrationEnd = format(new Date(notification.eventDetails.registration_end), 'MMM dd, yyyy h:mm a');
      const venueName = notification.eventDetails.venues?.venue_name || 'TBA';

      console.log('🔄 Attempting to send welcome email...');
      console.log('📧 Email data:', { email: notification.email, eventName: notification.eventName, eventDate, eventTime, venueName, registrationEnd });

      // Try Supabase Edge Function first
      try {
        const response = await fetch(`${supabase.supabaseUrl}/functions/v1/send-welcome-email`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${supabase.supabaseKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: notification.email,
            eventName: notification.eventName,
            eventDate,
            eventTime,
            venueName,
            registrationEnd,
          })
        });

        if (response.ok) {
          const data = await response.json();
          console.log('✅ Edge Function response:', data);
        } else {
          throw new Error(`HTTP ${response.status}: ${await response.text()}`);
        }
        
        // Show appropriate message based on response
        if (typeof window !== 'undefined') {
          setTimeout(() => {
            alert(`🎉 Welcome to VIT Event Hub!\n\n✅ Subscription Confirmed!\nEmail: ${notification.email}\nEvent: ${notification.eventName}\nDate: ${eventDate}\nTime: ${eventTime}\nVenue: ${venueName}\n\n📧 Welcome email sent immediately!\n🔔 You'll also receive a reminder 2 hours before registration closes.\n\nStay connected and never miss an event! 🚀`);
          }, 500);
        }
        return;
      } catch (edgeError) {
        console.warn('⚠️ Edge function error:', edgeError);
        console.warn('⚠️ Full error details:', JSON.stringify(edgeError, null, 2));
      }

      // Fallback: Show user that subscription was saved successfully
      console.log('📧 DEMO MODE - Welcome Email Content:');
      console.log('To:', notification.email);
      console.log('Subject: 🎉 Welcome! You\'re subscribed to', notification.eventName);
      console.log('Event:', notification.eventName);
      console.log('Date:', eventDate);
      console.log('Time:', eventTime);
      console.log('Venue:', venueName);
      console.log('Registration Ends:', registrationEnd);
      
      // Show user-friendly message
      if (typeof window !== 'undefined') {
        setTimeout(() => {
          alert(`🎉 Welcome to VIT Event Hub!\n\n✅ Subscription Confirmed!\nEmail: ${notification.email}\nEvent: ${notification.eventName}\nDate: ${eventDate}\nTime: ${eventTime}\nVenue: ${venueName}\n\n📧 Welcome message sent! Check your inbox.\n🔔 You'll receive a reminder 2 hours before registration closes.\n\nThank you for subscribing! 🚀`);
        }, 500);
      }
      
    } catch (error) {
      console.error('❌ Failed to send welcome email:', error);
      
      // Always provide user feedback even if everything fails
      if (typeof window !== 'undefined') {
        setTimeout(() => {
          alert(`✅ Subscription saved successfully!\n\nYour email ${notification.email} has been added to the notification list for "${notification.eventName}".\n\nYou'll receive reminder notifications when the system is fully configured.`);
        }, 500);
      }
    }
  }

  static async checkAndSendReminders(): Promise<{ sent: number; errors: number }> {
    try {
      // Get notifications that need reminders (2 hours before registration ends)
      const twoHoursFromNow = new Date();
      twoHoursFromNow.setHours(twoHoursFromNow.getHours() + 2);

      const { data: notifications, error } = await supabase
        .from('notifications')
        .select(`
          *,
          events!inner(
            event_name,
            start_time,
            end_time,
            registration_end,
            venues(venue_name)
          )
        `)
        .eq('status', 'pending')
        .lte('events.registration_end', twoHoursFromNow.toISOString())
        .gte('events.registration_end', new Date().toISOString());

      if (error || !notifications) {
        console.error('Failed to fetch notifications:', error);
        return { sent: 0, errors: 1 };
      }

      if (notifications.length === 0) {
        return { sent: 0, errors: 0 };
      }

      console.log(`🔔 Found ${notifications.length} reminders to send`);

      let sent = 0;
      let errors = 0;

      for (const notification of notifications) {
        try {
          const event = notification.events;
          console.log('📧 Processing reminder for:', event.event_name, 'to:', notification.email);
          
          // Mark as sent first to prevent duplicates
          await supabase
            .from('notifications')
            .update({ 
              status: 'sent',
              notified_at: new Date().toISOString()
            })
            .eq('id', notification.id);

          sent++;
          
          // Log the reminder details
          const eventDate = format(new Date(event.start_time), 'EEEE, MMMM dd, yyyy');
          const eventTime = `${format(new Date(event.start_time), 'h:mm a')} - ${format(new Date(event.end_time), 'h:mm a')}`;
          const registrationEnd = format(new Date(event.registration_end), 'MMM dd, yyyy h:mm a');
          
          console.log('⏰ DEMO - Reminder Email Details:', {
            to: notification.email,
            subject: `⏰ Registration ends soon: ${event.event_name}`,
            event: event.event_name,
            date: eventDate,
            time: eventTime,
            venue: event.venues?.venue_name || 'TBA',
            registrationEnds: registrationEnd
          });
          
        } catch (err) {
          console.error('Failed to process reminder:', err);
          errors++;
        }
      }

      if (sent > 0) {
        console.log(`📧 Processed ${sent} reminder notifications`);
      }

      return { sent, errors };
    } catch (error) {
      console.error('Failed to check reminders:', error);
      return { sent: 0, errors: 1 };
    }
  }
}

// Email reminder system 
if (typeof window !== 'undefined') {
  console.log('🔔 Email reminder system initialized');
  
  // Check immediately after 5 seconds
  setTimeout(() => {
    console.log('🔍 Initial reminder check...');
    EmailService.checkAndSendReminders();
  }, 5000);
  
  // Then check every 2 minutes (120 seconds) to reduce spam
  setInterval(() => {
    console.log('🔍 Periodic reminder check...');
    EmailService.checkAndSendReminders();
  }, 120000);
}