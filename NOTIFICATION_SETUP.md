# 🚀 Notification System Setup Guide

## Current Status
The notification system is **implemented and functional** but needs proper email service configuration to send real emails.

## What's Working Now ✅
- ✅ User email subscription to events
- ✅ Database storage of notifications
- ✅ Automatic welcome messages (demo mode)
- ✅ Periodic reminder checks (every 2 minutes)
- ✅ Demo notifications with full event details

## To Enable Real Email Sending 📧

### Quick Setup (5 minutes):

1. **Get Resend API Key:**
   - Go to https://resend.com and sign up
   - Get your API key from the dashboard

2. **Set Supabase Environment Variables:**
   - Go to your Supabase dashboard: https://supabase.com/dashboard/project/yzkgaynaujxxulbgkose
   - Navigate to: Settings > Environment Variables
   - Add these variables:
     ```
     RESEND_API_KEY=re_your_api_key_here
     SITE_URL=https://your-domain.com (or http://localhost:5173 for development)
     ```

3. **Deploy Edge Functions:**
   ```bash
   # Login to Supabase (one time setup)
   npx supabase login
   
   # Deploy the notification functions
   npx supabase functions deploy send-welcome-email --project-ref yzkgaynaujxxulbgkose
   npx supabase functions deploy send-notifications --project-ref yzkgaynaujxxulbgkose
   ```

4. **Test the System:**
   - Go to your website and click "Notify Me" on any event
   - Check if you receive a real email instead of just an alert
   - Check the browser console for success messages

## Alternative Email Services

If you prefer a different email service, you can easily modify the Edge Functions:

### SendGrid:
```typescript
// Replace the fetch call in the Edge Functions with:
await fetch('https://api.sendgrid.com/v3/mail/send', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${SENDGRID_API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    from: { email: 'noreply@your-domain.com', name: 'VIT Event Hub' },
    to: [{ email: emailData.to }],
    subject: emailData.subject,
    content: [{ type: 'text/html', value: emailData.html }]
  })
});
```

### Mailgun:
```typescript
// Replace with Mailgun API call
const formData = new FormData();
formData.append('from', 'VIT Event Hub <noreply@your-domain.com>');
formData.append('to', emailData.to);
formData.append('subject', emailData.subject);
formData.append('html', emailData.html);

await fetch(`https://api.mailgun.net/v3/${DOMAIN}/messages`, {
  method: 'POST',
  headers: { 'Authorization': `Basic ${btoa('api:' + MAILGUN_API_KEY)}` },
  body: formData
});
```

## Current Demo Mode Features 🎯

While the email service is being configured, users will see:
- ✅ Subscription confirmation alerts with full event details
- 📧 Console logs showing email content that would be sent
- 🔔 Automatic reminder system checking for events
- 📱 User-friendly feedback about subscription status

## Files Modified ✏️
- `src/lib/emailService.ts` - Enabled periodic reminder checks
- Improved user feedback and error handling
- Better Edge Function integration

## Need Help?
If you encounter any issues:
1. Check the browser console for detailed error messages
2. Verify your Supabase project ID matches the one in .env
3. Ensure Edge Functions are deployed with `npx supabase functions list`
4. Test environment variables in Supabase dashboard

The system is ready to go live as soon as you add the email service API key! 🚀