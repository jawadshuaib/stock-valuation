import { Spinner } from 'flowbite-react';

export default function Loader() {
  return (
    <div className="flex flex-wrap gap-2">
      <div className="text-center">
        <Spinner aria-label="Center-aligned spinner" size="xl" />
      </div>
    </div>
  );
}
