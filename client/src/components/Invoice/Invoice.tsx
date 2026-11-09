import './invoice.css';
import { Button } from '../ui/button';
import { ArrowLeft, ReceiptText } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client/react';
import type { IBooking } from '@gorent/shared';
import { GET_BOOKING_BY_ID } from '@/graphql/queries/booking.queries';
import { errorToast, formatDate, parseTimestampDate } from '@/utils/helpers';
import NotFound from '../layout/NotFound';
import LoadingSpinner from '../layout/LoadingSpinner';
import html2canvas from 'html2canvas-pro';
import { jsPDF } from 'jspdf';
import { useNavigate } from 'react-router-dom';

const Invoice = () => {
  const { id: bookingId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, loading, error } = useQuery<{ getBookingById: IBooking }>(GET_BOOKING_BY_ID, {
    variables: { bookingId },
  });

  const booking = data?.getBookingById;

  const handleInvoiceDownload = () => {
    const input = document.getElementById('order_invoice');
    if (!input) {
      errorToast('Invoice not found');
      return;
    }

    html2canvas(input, {
      useCORS: true,
      scale: 2,
      logging: false,
    }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // 2. Calculate proportional dimensions to prevent stretching
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      // 3. Handle multi-page invoices safely
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      // If the invoice is longer than one page, slice it into new pages
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      pdf.save(`goRent-invoice-${bookingId}.pdf`);
    });
  };

  if (loading) {
    return <LoadingSpinner fullScreen={true} size={60} />;
  }

  if (error) {
    errorToast(error);
    return <NotFound />;
  }

  return (
    <div className='container my-10'>
      <div className='invoice mt-10'>
        <div className='flex justify-between mx-10 mb-10'>
          <Button className='ml-2' onClick={() => navigate(-1)}>
            <ArrowLeft className='mr-2 h-4 w-4' /> Back
          </Button>
          <Button className='ml-2' onClick={handleInvoiceDownload}>
            <ReceiptText className='mr-2 h-4 w-4' /> Download Invoice
          </Button>
        </div>
        <div className='px-10 py-5' id='order_invoice'>
          <header className='clearfix'>
            <div id='logo'>
              <img src='/go-rent-logo.svg' alt='Logo' className='w-28 h-28 object-contain' />
            </div>
            <div id='company'>
              <h2 className='name'>GoRent</h2>
              <div>455 Foggy Heights, AZ 85004, US</div>
              <div>(602) 519-0450</div>
              <div>
                <a href='mailto:company@example.com'>support@gorental.com</a>
              </div>
            </div>
          </header>
          <main>
            <div id='details' className='clearfix'>
              <div id='client'>
                <div className='to'>INVOICE TO:</div>
                <h2 className='name'>{booking?.customer?.name}</h2>
                <h2 className='Phone'>{booking?.customer?.phone}</h2>
                <div className='email'>
                  <a href={`mailto:${booking?.customer?.email}`}>{booking?.customer?.email}</a>
                </div>
                <div>{booking?.paymentInfo?.status?.toUpperCase()}</div>
              </div>
              <div id='invoice'>
                <h1>INVOICE #</h1>
                <p className='text-2xl mb-10'>{booking?.id}</p>
                <div className='date'>Booking Date: {parseTimestampDate(booking?.createdAt)}</div>
              </div>
            </div>
            <table style={{ border: 'none', borderSpacing: '0', padding: '0' }}>
              <thead>
                <tr>
                  <th className='no'>CAR DETAILS</th>
                  <th className='desc'>CAR RENTAL DURATION</th>
                  <th className='unit'>RENT PER DAY</th>
                  <th className='qty'>DAYS OF RENT</th>
                  <th className='total'>TOTAL</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className='no'>{booking?.car?.name}</td>
                  <td className='desc'>
                    <div>
                      <h3>Start Date:</h3>
                      {formatDate(booking?.startDate, 'MMM dd, yyyy')}
                    </div>
                    <div className='mt-5'>
                      <h3>End Date:</h3>
                      {formatDate(booking?.endDate, 'MMM dd, yyyy')}
                    </div>
                  </td>
                  <td className='unit'>${booking?.rentPerDay}</td>
                  <td className='qty'>{booking?.daysOfRent}</td>
                  <td className='total'>${booking?.amount?.rent}</td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={2}></td>
                  <td colSpan={2}>RENT</td>
                  <td>${booking?.amount?.rent}</td>
                </tr>
                <tr>
                  <td colSpan={2}></td>
                  <td colSpan={2}>DISCOUNT</td>
                  <td>${booking?.amount?.discount}</td>
                </tr>
                <tr>
                  <td colSpan={2}></td>
                  <td colSpan={2}>TAX 15%</td>
                  <td>${booking?.amount?.tax}</td>
                </tr>
                <tr>
                  <td colSpan={2}></td>
                  <td colSpan={2}>GRAND TOTAL</td>
                  <td>${booking?.amount?.total}</td>
                </tr>
              </tfoot>
            </table>
            <div id='notices'>
              <div>Customer Additional Notes:</div>
              <div className='notice'>
                {booking?.additionalNote ? booking?.additionalNote : 'No additional notes'}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
