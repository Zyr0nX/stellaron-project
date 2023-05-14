import { component$, useSignal } from "@builder.io/qwik";

export interface ProgressProps {
  progress: number;
  total: number;
}

export const Progress = component$<ProgressProps>(({ progress, total }) => {
  return (
    <div class="flex flex-col gap-1.5">
      <div class="flex items-center justify-between font-semibold">
        <p>Achievement:</p>
        <p>
          {progress}/{total}
        </p>
      </div>
      <div class="relative h-1 bg-blue-950">
        <div
          class="absolute h-1 bg-teal-500 transition-all"
          style={{ width: `${(progress * 100) / total}%` }}
        ></div>
      </div>
    </div>
  );
});
