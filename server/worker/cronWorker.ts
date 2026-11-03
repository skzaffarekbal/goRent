import cron from 'node-cron';
import Booking from '../models/booking.model';

async function cleanExpiredBookings() {
  try {
    console.log('[Cron] Initiating 6-hourly sweep for expired pending bookings...');

    // Calculate the point in time exactly 6 hours ago
    const SIX_HOURS = 6 * 60 * 60 * 1000;
    const expirationTime = new Date(Date.now() - SIX_HOURS);

    // Update all matching items in a single query
    const result = await Booking.updateMany(
      {
        'paymentInfo.status': 'pending',
        createdAt: { $lt: expirationTime },
      },
      {
        $set: { 'paymentInfo.status': 'cancelled' },
      },
    );

    if (result.modifiedCount > 0) {
      console.log(
        `[Cron Success] Automatically updated ${result.modifiedCount} booking(s) to 'cancelled'.`,
      );
    } else {
      console.log('[Cron] No expired pending bookings found this hour.');
    }
  } catch (error) {
    console.error('[Cron Error] Failed to process status updates:', error);
  }
}
cleanExpiredBookings();
// Schedules a task to run every 6 hours ('0 */6 * * * *')
cron.schedule('0 * * * *', cleanExpiredBookings);
