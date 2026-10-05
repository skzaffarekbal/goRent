import { AlertCircleIcon, CircleCheckBigIcon } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function AlertMessage({
  title,
  description,
  success,
}: {
  title?: string;
  description?: string;
  success?: boolean;
}) {
  return (
    <Alert
      variant={success ? 'default' : 'destructive'}
      className={`${success ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}
    >
      {success ? <CircleCheckBigIcon size={20} /> : <AlertCircleIcon size={20} />}
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  );
}
