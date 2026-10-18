import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { MailPlus } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { useMutation } from '@apollo/client/react';
import { REGISTER_USER_MUTATION } from '@/graphql/mutations/user.mutations';
import LoadingSpinner from '../layout/LoadingSpinner';
import { errorWrapper } from '@/utils/helpers';
import { toast } from 'sonner';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { RegisterUserSchema } from '@/zod-schemas/user.schemas';

const Register = () => {
  const form = useForm<z.infer<typeof RegisterUserSchema>>({
    resolver: zodResolver(RegisterUserSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      phone: '',
    },
  });

  const [registerUser, { loading }] = useMutation(REGISTER_USER_MUTATION, {
    onCompleted: () => {
      toast.success('User registered successfully.');
    },
  });

  const submitHandler = async (values: z.infer<typeof RegisterUserSchema>) => {
    const userInput = {
      name: values?.name,
      email: values?.email,
      password: values?.password,
      phone: values?.phone,
    };

    await errorWrapper(async () => {
      await registerUser({ variables: { userInput } });
    });
  };

  return (
    <form id='form-register-input' onSubmit={form.handleSubmit(submitHandler)}>
      <div className='flex min-h-screen flex-1 flex-col gap-4 bg-muted/40 justify-center'>
        <Card className='mx-auto w-full max-w-lg shadow-lg'>
          <CardHeader>
            <CardTitle className='text-2xl'>Sign Up</CardTitle>
            <CardDescription>Enter your information to create an account</CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <Controller
                name='name'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor='form-register-input-name'>Name</FieldLabel>
                    <Input
                      {...field}
                      id='form-register-input-name'
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
                    <FieldLabel htmlFor='form-register-input-email'>Email</FieldLabel>
                    <Input
                      {...field}
                      id='form-register-input-email'
                      aria-invalid={fieldState.invalid}
                      placeholder='johndoe@gmail.com'
                      autoComplete='email'
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Controller
                name='password'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor='form-register-input-password'>Password</FieldLabel>
                    <Input
                      {...field}
                      id='form-register-input-password'
                      aria-invalid={fieldState.invalid}
                      placeholder=''
                      type='password'
                      autoComplete='new-password'
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
                    <FieldLabel htmlFor='form-register-input-phone'>Phone</FieldLabel>
                    <Input
                      {...field}
                      id='form-register-input-phone'
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
              form='form-register-input'
              className='w-full mt-4'
              disabled={loading}
            >
              {loading ? (
                <LoadingSpinner />
              ) : (
                <>
                  Sign Up <MailPlus className='h-4 w-4 ml-2' />
                </>
              )}
            </Button>
            <div className='mt-4 text-center text-sm'>
              Already have an account?{' '}
              <Link to='/login' className='underline'>
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </form>
  );
};

export default Register;
