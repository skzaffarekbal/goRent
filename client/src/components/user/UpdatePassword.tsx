import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Controller, useForm } from 'react-hook-form';
import { useMutation } from '@apollo/client/react';
import { UPDATE_PASSWORD_MUTATION } from '@/graphql/mutations/user.mutations';
import LoadingSpinner from '../layout/LoadingSpinner';
import { errorWrapper } from '@/utils/helpers';
import { toast } from 'sonner';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { UpdatePasswordSchema } from '@/zod-schemas/user.schemas';
import { CURRENT_USER } from '@/graphql/queries/user.queries';

type UpdatePasswordInput = z.infer<typeof UpdatePasswordSchema>;

const UpdatePassword = () => {
  const form = useForm<UpdatePasswordInput>({
    resolver: zodResolver(UpdatePasswordSchema),
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const [updatePassword, { loading, error }] = useMutation(UPDATE_PASSWORD_MUTATION, {
    refetchQueries: [{ query: CURRENT_USER }],
    onCompleted: () => {
      toast.success('Password Updated Successfully.');
    },
  });

  console.log('Hello', error);

  const submitHandler = async (values: UpdatePasswordInput) => {
    const passwordInput = {
      oldPassword: values?.oldPassword,
      newPassword: values?.newPassword,
    };

    await errorWrapper(async () => {
      await updatePassword({ variables: passwordInput });
    });
  };

  return (
    <form id='form-password-update' onSubmit={form.handleSubmit(submitHandler)}>
      <Card className='w-full max-w-lg'>
        <CardHeader>
          <CardTitle className='text-2xl'>Update Password</CardTitle>
          <CardDescription>Enter your old password to update your password.</CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Controller
              name='oldPassword'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor='form-password-update-oldPassword'>Old Password</FieldLabel>
                  <Input
                    {...field}
                    id='form-password-update-oldPassword'
                    aria-invalid={fieldState.invalid}
                    placeholder='Enter your old password'
                    type='password'
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name='newPassword'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor='form-password-update-newPassword'>New Password</FieldLabel>
                  <Input
                    {...field}
                    id='form-password-update-newPassword'
                    aria-invalid={fieldState.invalid}
                    placeholder='Enter your new password'
                    type='password'
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name='confirmPassword'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor='form-password-update-confirmPassword'>
                    Confirm Password
                  </FieldLabel>
                  <Input
                    {...field}
                    id='form-password-update-confirmPassword'
                    aria-invalid={fieldState.invalid}
                    placeholder='Confirm your new password'
                    type='password'
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>

          <Button
            type='submit'
            form='form-password-update'
            className='w-full mt-4'
            disabled={loading}
          >
            {loading ? <LoadingSpinner /> : 'Update Password'}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
};

export default UpdatePassword;
