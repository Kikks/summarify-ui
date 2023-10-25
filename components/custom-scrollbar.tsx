import React, {
  ForwardRefExoticComponent,
  RefAttributes,
  forwardRef,
} from 'react';
import Scrollbars, { ScrollbarProps } from 'react-custom-scrollbars-2';

interface CustomScrollbarProps extends ScrollbarProps {}

const CustomScrollbar: ForwardRefExoticComponent<
  Omit<CustomScrollbarProps, 'ref'> & RefAttributes<Scrollbars>
> = forwardRef(({ children, ...rest }, ref) => {
  return (
    <Scrollbars
      ref={ref}
      className="h-full w-full flex-1"
      {...rest}
      renderThumbVertical={(props) => (
        <div {...props} className="w-2 rounded-full bg-gray-300" />
      )}
    >
      {children}
    </Scrollbars>
  );
});

CustomScrollbar.displayName = 'CustomScrollbar';
export default CustomScrollbar;
