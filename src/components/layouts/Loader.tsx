import { type FC } from 'preact/compat';

import { useStore } from '@nanostores/preact';
import { $tasks } from '@/stores/Loading';
import './Loader.css';

export const Loader: FC = () => {

  const tasks = useStore($tasks);

  return (
    <>
      <div class={`loader${(tasks.length > 0) ? ' loader-active' : ''}`}>
        <div class='print'></div>
      </div>
      {/* {
        tasks.length > 1 && (
          <>
            {tasks.map((task) => <span>{task}</span>)}
          </>
        )
      } */}
    </>
  )
}
