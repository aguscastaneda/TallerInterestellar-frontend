import { forwardRef } from 'react';
import { clsx } from 'clsx';

const Table = forwardRef(({
  children,
  className,
  ...props
}, ref) => {
  return (
    <div className="overflow-x-auto">
      <table
        ref={ref}
        className={clsx('table-base', className)}
        {...props}
      >
        {children}
      </table>
    </div>
  );
});

Table.displayName = 'Table';

const TableHeader = forwardRef(({
  children,
  className,
  ...props
}, ref) => {
  return (
    <thead
      ref={ref}
      className={clsx('table-header', className)}
      {...props}
    >
      {children}
    </thead>
  );
});

TableHeader.displayName = 'TableHeader';

const TableBody = forwardRef(({
  children,
  className,
  ...props
}, ref) => {
  return (
    <tbody
      ref={ref}
      className={clsx('divide-y divide-gray-200', className)}
      {...props}
    >
      {children}
    </tbody>
  );
});

TableBody.displayName = 'TableBody';

const TableRow = forwardRef(({
  children,
  className,
  ...props
}, ref) => {
  return (
    <tr
      ref={ref}
      className={clsx('table-row', className)}
      {...props}
    >
      {children}
    </tr>
  );
});

TableRow.displayName = 'TableRow';

const TableHead = forwardRef(({
  children,
  className,
  ...props
}, ref) => {
  return (
    <th
      ref={ref}
      className={clsx('table-cell', className)}
      {...props}
    >
      {children}
    </th>
  );
});

TableHead.displayName = 'TableHead';

const TableCell = forwardRef(({
  children,
  className,
  ...props
}, ref) => {
  return (
    <td
      ref={ref}
      className={clsx('table-data', className)}
      {...props}
    >
      {children}
    </td>
  );
});

TableCell.displayName = 'TableCell';

const TableCaption = forwardRef(({
  children,
  className,
  ...props
}, ref) => {
  return (
    <caption
      ref={ref}
      className={clsx('px-4 py-3 text-left text-sm font-medium text-gray-500 bg-gray-50', className)}
      {...props}
    >
      {children}
    </caption>
  );
});

TableCaption.displayName = 'TableCaption';

export {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
};
