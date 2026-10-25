import { Link } from 'react-router-dom';
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
import { FORGET_PASSWORD_MUTATION } from '@/graphql/mutations/user.mutations';
import { ForgetPasswordSchema } from '@/zod-schemas/user.schemas';

type ForgetPasswordInput = z.infer<typeof ForgetPasswordSchema>;

const ForgetPassword = () => {
  const form = useForm<ForgetPasswordInput>({
    resolver: zodResolver(ForgetPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const [forgetPassword, { loading }] = useMutation(FORGET_PASSWORD_MUTATION, {
    onCompleted: () => {
      toast.success('Password reset link sent to your email.');
    },
  });

  const submitHandler = async (values: ForgetPasswordInput) => {
    await errorWrapper(async () => {
      await forgetPassword({ variables: { email: values?.email } });
    });
  };

  return (
    <form id='form-forget-password-input' onSubmit={form.handleSubmit(submitHandler)}>
      <div className='flex min-h-screen flex-1 flex-col gap-4 bg-muted/40 justify-center'>
        <Card className='mx-auto w-full max-w-lg shadow-lg'>
          <CardHeader>
            <CardTitle className='text-2xl'>Forget Password</CardTitle>
            <CardDescription>Enter your email to receive a password reset link</CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <Controller
                name='email'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor='form-forget-password-input-email'>Email</FieldLabel>
                    <Input
                      {...field}
                      id='form-forget-password-input-email'
                      aria-invalid={fieldState.invalid}
                      placeholder='johndoe@gmail.com'
                      autoComplete='email'
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </FieldGroup>

            <Button
              type='submit'
              form='form-forget-password-input'
              className='w-full mt-4'
              disabled={loading}
            >
              {loading ? (
                <LoadingSpinner />
              ) : (
                <>
                  Send Reset Link <MailPlus className='h-4 w-4 ml-2' />
                </>
              )}
            </Button>
            <div className='mt-4 text-center text-sm'>
              <Link to='/login' className='underline'>
                Back to Login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </form>
  );
};

export default ForgetPassword;
