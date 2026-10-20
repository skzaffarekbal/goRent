import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { LogIn } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { useMutation } from '@apollo/client/react';
import { LOGIN_USER_MUTATION } from '@/graphql/mutations/user.mutations';
import LoadingSpinner from '../layout/LoadingSpinner';
import { errorWrapper } from '@/utils/helpers';
import { toast } from 'sonner';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginUserSchema } from '@/zod-schemas/user.schemas';
import { useReactiveVar } from '@apollo/client/react';
import { isAuthenticatedVar } from '@/apollo/apollo-vars';

type LoginUserInput = z.infer<typeof LoginUserSchema>;

const Login = () => {
  const isAuthenticated = useReactiveVar(isAuthenticatedVar);

  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const form = useForm<LoginUserInput>({
    resolver: zodResolver(LoginUserSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const [loginUser, { loading }] = useMutation(LOGIN_USER_MUTATION, {
    onCompleted: () => {
      toast.success('User logged in successfully.');
    },
  });

  const submitHandler = async (values: LoginUserInput) => {
    await errorWrapper(async () => {
      await loginUser({ variables: { email: values.email, password: values.password } });
    });
  };

  return (
    <form id='form-login-input' onSubmit={form.handleSubmit(submitHandler)}>
      <div className='flex min-h-screen flex-1 flex-col gap-4 bg-muted/40 justify-center'>
        <Card className='mx-auto w-full max-w-lg shadow-lg'>
          <CardHeader>
            <CardTitle className='text-2xl'>Log In</CardTitle>
            <CardDescription>
              Enter your email and password to log in to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <Controller
                name='email'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor='form-login-input-email'>Email</FieldLabel>
                    <Input
                      {...field}
                      id='form-login-input-email'
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
                    <div className='flex items-center'>
                      <FieldLabel htmlFor='form-login-input-password'>Password</FieldLabel>
                      <Link
                        to='/forgot-password'
                        className='ml-auto text-sm text-blue-600 hover:underline cursor-pointer'
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <Input
                      {...field}
                      id='form-login-input-password'
                      aria-invalid={fieldState.invalid}
                      placeholder=''
                      type='password'
                      autoComplete='new-password'
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </FieldGroup>

            <Button
              type='submit'
              form='form-login-input'
              className='w-full mt-4'
              disabled={loading}
            >
              {loading ? (
                <LoadingSpinner />
              ) : (
                <>
                  Log In <LogIn className='h-4 w-4 ml-2' />
                </>
              )}
            </Button>
            <div className='mt-4 text-center text-sm'>
              Don't have an account?{' '}
              <Link to='/register' className='underline'>
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </form>
  );
};

export default Login;
