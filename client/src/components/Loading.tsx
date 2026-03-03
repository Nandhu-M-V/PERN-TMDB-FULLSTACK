import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

export default function Loading() {
  return (
    <div className="bg-black absolute w-full h-screen flex justify-center items-center">
      <div className="flex flex-col items-center gap-4">
        <Button className="p-10" disabled size="icon-lg">
          <Spinner data-icon="inline-start" />
        </Button>
      </div>
    </div>
  );
}
