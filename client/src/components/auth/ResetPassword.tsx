import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { MailPlus } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { useMutation } from '@apollo/client/react';
import LoadingSpinner from '../layout/LoadingSpinner';
import { errorWrapper } from '@/utils/helpers';
import { toast } from 'sonner';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { RESET_PASSWORD_MUTATION } from '@/graphql/mutations/user.mutations';
import { ResetPasswordSchema } from '@/zod-schemas/user.schemas';

type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>;

const ResetPassword = () => {
  const navigate = useNavigate();
  const params = useParams();
  const form = useForm<ResetPasswordInput>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const [resetPassword, { loading }] = useMutation(RESET_PASSWORD_MUTATION, {
    onCompleted: () => {
      toast.success('Password reset successful.');
      navigate('/');
    },
  });

  const submitHandler = async (values: ResetPasswordInput) => {
    await errorWrapper(async () => {
      await resetPassword({
        variables: {
          token: params?.token,
          password: values?.password,
          confirmPassword: values?.confirmPassword,
        },
      });
    });
  };

  return (
    <form id='form-reset-password-input' onSubmit={form.handleSubmit(submitHandler)}>
      <div className='flex min-h-screen flex-1 flex-col gap-4 bg-muted/40 justify-center'>
        <Card className='mx-auto w-full max-w-lg shadow-lg'>
          <CardHeader>
            <CardTitle className='text-2xl'>Reset Password</CardTitle>
            <CardDescription>Enter your new password to reset</CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <Controller
                name='password'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor='form-reset-password-input-password'>
                      New Password
                    </FieldLabel>
                    <Input
                      {...field}
                      id='form-reset-password-input-password'
                      aria-invalid={fieldState.invalid}
                      placeholder='New password'
                      autoComplete='new-password'
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
                    <FieldLabel htmlFor='form-reset-password-input-confirmPassword'>
                      Confirm New Password
                    </FieldLabel>
                    <Input
                      {...field}
                      id='form-reset-password-input-confirmPassword'
                      aria-invalid={fieldState.invalid}
                      placeholder='Confirm new password'
                      autoComplete='new-password'
                      type='password'
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </FieldGroup>

            <Button
              type='submit'
              form='form-reset-password-input'
              className='w-full mt-4'
              disabled={loading}
            >
              {loading ? (
                <LoadingSpinner />
              ) : (
                <>
                  Reset Password <MailPlus className='h-4 w-4 ml-2' />
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </form>
  );
};

export default ResetPassword;
