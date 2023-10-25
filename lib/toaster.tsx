import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Check } from 'lucide-react';
import toast from 'react-hot-toast';

const success = ({ title, message }: { title?: string; message: string }) =>
  toast((t) => (
    <Alert onClick={() => toast.dismiss(t.id)}>
      <Check className="h-4 w-4" />
      {title && <AlertTitle>{title}</AlertTitle>}
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  ));

const error = ({ title, message }: { title?: string; message: string }) =>
  toast((t) => (
    <Alert variant="destructive" onClick={() => toast.dismiss(t.id)}>
      <AlertCircle className="h-4 w-4" />
      {title && <AlertTitle>{title}</AlertTitle>}
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  ));

const toaster = { success, error };
export default toaster;
