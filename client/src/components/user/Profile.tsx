import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import UpdatePassword from './UpdatePassword';
import UpdateProfile from './UpdateProfile';

const Profile = () => {
  return (
    <main className='flex min-h-screen items-center justify-center flex-1 flex-col'>
      <Tabs defaultValue='profile' className='w-96'>
        <TabsList className='flex justify-between w-full'>
          <TabsTrigger value='profile'>Update Profile</TabsTrigger>
          <TabsTrigger value='password'>Update Password</TabsTrigger>
          <TabsTrigger value='avatar'>Upload Avatar</TabsTrigger>
        </TabsList>
        <TabsContent value='profile'>
          <UpdateProfile />
        </TabsContent>
        <TabsContent value='password'>
          <UpdatePassword />
        </TabsContent>
        <TabsContent value='avatar'></TabsContent>
      </Tabs>
    </main>
  );
};

export default Profile;
