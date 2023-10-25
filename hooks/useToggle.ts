import { Dispatch, SetStateAction, useState } from 'react';

const useToggle: (
  initialState: boolean,
) => [boolean, () => void, Dispatch<SetStateAction<boolean>>] = (
  initialState,
) => {
  const [state, setState] = useState(initialState);

  const toggleState = () => {
    setState((prevState) => !prevState);
  };

  return [state, toggleState, setState];
};

export default useToggle;
