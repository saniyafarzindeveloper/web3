import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

const DataTable = <T,>({
  columns,
  data,
  rowKey,
  tableClassName,
  headerClassName,
  headerCellClassName,
  bodyRowClassName,
  bodyCellClassName,
  headerRowClassName,
}: DataTableProps<T>) => {
  return (
    <Table className={cn("custom-scrollbar", tableClassName)}>
      <TableHeader className={headerClassName}>
        <TableRow className={cn("hover:bg-transparent!", headerRowClassName)}>
         {columns.map((column, i) => (
            <TableHead key={i}>
                {column.header}
            </TableHead>
         ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="font-medium">INV001</TableCell>
          <TableCell>Paid</TableCell>
          <TableCell>Credit Card</TableCell>
          <TableCell className="text-right">$250.00</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

export default DataTable;
