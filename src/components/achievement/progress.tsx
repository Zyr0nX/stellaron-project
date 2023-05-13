import { component$, useSignal } from "@builder.io/qwik";

export interface ProgressProps {
  progress: number;
  total: number;
}

export const Progress = component$<ProgressProps>(({ progress, total }) => {
  return (
    <div class="flex flex-col gap-1.5">
      <div class="flex justify-between items-center font-semibold">
        <p>Achievement:</p>
        <p>
          {progress}/{total}
        </p>
      </div>
      <div class="bg-blue-950 relative h-1">
        <div
          class="bg-teal-500 absolute h-1 transition-all"
          style={{ width: `${(progress * 100) / total}%` }}
        ></div>
      </div>
    </div>
  );
});
