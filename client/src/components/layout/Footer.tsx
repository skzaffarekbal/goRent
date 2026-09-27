import { FaGithub, FaInstagram, FaLinkedin } from 'react-icons/fa6';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className='dark bg-gray-900 text-gray-200 py-6'>
      <div className='container mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between'>
        <div className='text-center md:text-left mb-4 md:mb-0'>
          <p className='text-sm'>© 2026 GoRent. All rights reserved.</p>
        </div>
        <div className='flex items-center justify-center space-x-4'>
          <Link
            to='https://www.linkedin.com/in/sk-zaffar-ekbal/'
            target='_blank'
            rel='noopener noreferrer'
            className='text-gray-400 hover:text-gray-100 transition-colors'
          >
            <FaLinkedin className='w-6 h-6' />
            <span className='sr-only'>LinkedIn</span>
          </Link>
          <Link
            to='https://github.com/skzaffarekbal'
            target='_blank'
            rel='noopener noreferrer'
            className='text-gray-400 hover:text-gray-100 transition-colors'
          >
            <FaGithub className='w-6 h-6' />
            <span className='sr-only'>Github</span>
          </Link>
          <Link
            to='https://instagram.com/_zaff_s'
            target='_blank'
            rel='noopener noreferrer'
            className='text-gray-400 hover:text-gray-100 transition-colors'
          >
            <FaInstagram className='w-6 h-6' />
            <span className='sr-only'>Instagram</span>
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
