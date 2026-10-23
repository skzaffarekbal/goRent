import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Controller, useForm } from 'react-hook-form';
import { useMutation, useReactiveVar } from '@apollo/client/react';
import { UPDATE_PROFILE_MUTATION } from '@/graphql/mutations/user.mutations';
import LoadingSpinner from '../layout/LoadingSpinner';
import { errorWrapper } from '@/utils/helpers';
import { toast } from 'sonner';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { UpdateProfileSchema } from '@/zod-schemas/user.schemas';
import { CURRENT_USER } from '@/graphql/queries/user.queries';
import { userVar } from '@/apollo/apollo-vars';

type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>;

const UpdateProfile = () => {
  const user = useReactiveVar(userVar);
  const form = useForm<UpdateProfileInput>({
    resolver: zodResolver(UpdateProfileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
    },
  });

  const [updateUserProfile, { loading }] = useMutation(UPDATE_PROFILE_MUTATION, {
    refetchQueries: [{ query: CURRENT_USER }],
    onCompleted: () => {
      toast.success('Profile Updated Successfully.');
    },
  });

  const submitHandler = async (values: UpdateProfileInput) => {
    const userInput = {
      name: values?.name,
      email: values?.email,
      phone: values?.phone,
    };

    await errorWrapper(async () => {
      await updateUserProfile({ variables: { userInput } });
    });
  };

  return (
    <form id='form-profile-update-input' onSubmit={form.handleSubmit(submitHandler)}>
      <Card className='w-full max-w-lg'>
        <CardHeader>
          <CardTitle className='text-2xl'>Update Profile</CardTitle>
          <CardDescription>Enter your information to update profile</CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Controller
              name='name'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor='form-profile-update-input-name'>Name</FieldLabel>
                  <Input
                    {...field}
                    id='form-profile-update-input-name'
                    aria-invalid={fieldState.invalid}
                    placeholder='John Doe'
                    autoComplete='name'
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name='email'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor='form-profile-update-input-email'>Email</FieldLabel>
                  <Input
                    {...field}
                    id='form-profile-update-input-email'
                    aria-invalid={fieldState.invalid}
                    placeholder='johndoe@gmail.com'
                    autoComplete='email'
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name='phone'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor='form-profile-update-input-phone'>Phone</FieldLabel>
                  <Input
                    {...field}
                    id='form-profile-update-input-phone'
                    aria-invalid={fieldState.invalid}
                    placeholder='+1 234 567 8901'
                    autoComplete='phone'
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>

          <Button
            type='submit'
            form='form-profile-update-input'
            className='w-full mt-4'
            disabled={loading}
          >
            {loading ? <LoadingSpinner /> : 'Update Profile'}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
};

export default UpdateProfile;
