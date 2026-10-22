import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
  SheetHeader,
  SheetDescription,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { MenuIcon } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CURRENT_USER, LOGOUT } from '@/graphql/queries/user.queries';
import { useLazyQuery, useQuery } from '@apollo/client/react';
import { isAuthenticatedVar, isLoadingVar, userVar } from '@/apollo/apollo-vars';
import type { IUser } from '@gorent/shared';
import { Skeleton } from '../ui/skeleton';
import UserMobileMenu from '../mobile-menu/UserMobileMenu';
import { getUserNameInitials } from '@/utils/helpers';
// import AdminMobileMenu from '../mobile-menu/AdminMobileMenu';

const Header = () => {
  const navigate = useNavigate();
  const { data, error, loading } = useQuery<{ me: IUser }>(CURRENT_USER);

  useEffect(() => {
    if (error) {
      userVar(null);
      isLoadingVar(false);
      isAuthenticatedVar(false);
    }

    if (data) {
      userVar(data?.me);
      isAuthenticatedVar(true);
      isLoadingVar(false);
    }
  }, [data, error]);

  const currentUser = data?.me;

  const [logout] = useLazyQuery<{ logout: boolean }>(LOGOUT);
  const logoutHandler = async () => {
    await logout();
    navigate(0);
  };

  return (
    <div className='flex items-center justify-between px-5 py-2 bg-white dark:bg-gray-800 border'>
      <Link to='/' className='flex items-center gap-0'>
        {/* <CarTaxiFront className='h-8 w-8' /> */}
        <img src='/go-rent-car-logo.svg' className='h-10 w-10 object-contain' alt='logo' />
        <span className='text-lg font-semibold'>GoRent</span>
      </Link>
      <div className='hidden lg:flex gap-4 mr-1'>
        {!currentUser && !loading && (
          <Button className='mb-2' asChild>
            <Link to='/login'>Login</Link>
          </Button>
        )}
        {currentUser ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='outline' size='icon' className='overflow-hidden rounded-full'>
                <div className='flex items-center'>
                  <Avatar className='h-10 w-10'>
                    <AvatarImage src={currentUser?.avatar?.url} />
                    <AvatarFallback>{getUserNameInitials(currentUser?.name)}</AvatarFallback>
                  </Avatar>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              {currentUser?.role.includes('admin') && (
                <Link to='/admin/dashboard'>
                  <DropdownMenuItem>Dashboard</DropdownMenuItem>
                </Link>
              )}
              <Link to='/me/bookings'>
                <DropdownMenuItem>My Bookings</DropdownMenuItem>
              </Link>
              <Link to='/me/profile'>
                <DropdownMenuItem>Profile</DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logoutHandler}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          loading && <Skeleton className='h-8 w-8 rounded-full' />
        )}
      </div>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant='outline' size='icon' className='lg:hidden'>
            <MenuIcon className='h-6 w-6' />
            <span className='sr-only'>Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side='left'>
          <SheetTitle />
          <SheetHeader>
            <SheetDescription />
          </SheetHeader>
          <div className='grid w-[250px] p-4'>
            <div className='flex items-center mb-3'>
              <span className='me-4'></span>
              {!currentUser && !loading && (
                <Button asChild>
                  <Link to='/login'>Login</Link>
                </Button>
              )}
              {currentUser && (
                <>
                  <Button variant='outline' size='icon' className='overflow-hidden rounded-full'>
                    <div className='flex items-center'>
                      <Avatar className='h-10 w-10'>
                        <AvatarImage src={currentUser?.avatar?.url} />
                        <AvatarFallback>{getUserNameInitials(currentUser?.name)}</AvatarFallback>
                      </Avatar>
                    </div>
                  </Button>
                  <p className='ps-2'>{currentUser?.name}</p>
                </>
              )}
            </div>
            {/* <AdminMobileMenu /> */}
            {currentUser && (
              <>
                <UserMobileMenu isAdmin={currentUser?.role.includes('admin')} />
                <DropdownMenuSeparator />
                <Link
                  to='#'
                  onClick={logoutHandler}
                  className='text-lg font-medium hover:underline underline-offset-4'
                >
                  Logout
                </Link>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Header;
