import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import LoadingSpinner from '../layout/LoadingSpinner';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useState } from 'react';
import { useMutation, useReactiveVar } from '@apollo/client/react';
import { userVar } from '@/apollo/apollo-vars';
import { errorWrapper, getUserNameInitials } from '@/utils/helpers';
import { UPLOAD_AVATAR_MUTATION } from '@/graphql/mutations/user.mutations';
import { toast } from 'sonner';
import { CURRENT_USER } from '@/graphql/queries/user.queries';

function UploadAvatar() {
  const user = useReactiveVar(userVar);
  const [avatar, setAvatar] = useState('');

  const [uploadUserAvatar, { loading }] = useMutation(UPLOAD_AVATAR_MUTATION, {
    refetchQueries: [{ query: CURRENT_USER }],
    onCompleted: () => {
      toast.success('Profile Updated Successfully.');
      setAvatar('');
    },
  });

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.readyState === 2) {
          setAvatar(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const submitHandler = async () => {
    if (!avatar) {
      toast.error('Please select an avatar');
      return;
    }
    await errorWrapper(async () => {
      await uploadUserAvatar({ variables: { avatar } });
    });
  };

  return (
    <div>
      <Card className='w-full max-w-lg'>
        <CardHeader>
          <CardTitle className='text-2xl'>Upload Avatar</CardTitle>
          <CardDescription>Upload avatar to update your profile</CardDescription>
        </CardHeader>
        <CardContent className='grid gap-4'>
          <div className='grid gap-3 w-full item-center max-w-sm mx-auto'>
            <Label htmlFor='avatar'>Avatar</Label>
            <div className='flex items-center'>
              <Avatar className='w-12 h-12 mr-4'>
                <AvatarImage src={!avatar ? user?.avatar?.url : avatar} alt={user?.name} />
                <AvatarFallback>{getUserNameInitials(user?.name)}</AvatarFallback>
              </Avatar>
              <Input type='file' id='avatar' accept='image/*' onChange={onChange} />
            </div>
          </div>
          <Button type='button' className='w-full mt-4' disabled={loading} onClick={submitHandler}>
            {loading ? <LoadingSpinner /> : 'Update Avatar'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default UploadAvatar;
