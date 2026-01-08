import { TableHead, TableRow, TableCell, TableSortLabel } from "@mui/material";
import type { DatasetT } from "../../redux/api/gameApi";

interface HeadCell {
  disablePadding: boolean;
  id: keyof DatasetT;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: 'dataset',
    numeric: false,
    disablePadding: true,
    label: 'Data Set',
  },
  {
    id: 'method',
    numeric: true,
    disablePadding: false,
    label: 'Method',
  },
  {
    id: 'method_confidence_level',
    numeric: true,
    disablePadding: false,
    label: 'Confidence Level',
  },
  {
    id: 'method_bias',
    numeric: true,
    disablePadding: false,
    label: 'Bias',
  },
  {
    id: 'method_recall_target',
    numeric: true,
    disablePadding: false,
    label: 'Recall Target',
  },
  {
    id: 'row_count',
    numeric: true,
    disablePadding: false,
    label: 'Size',
  },
];

type Order = 'asc' | 'desc';

interface EnhancedTableProps {
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof DatasetT) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

export default function EnhancedTableHead(props: EnhancedTableProps) {
  const { order, orderBy, onRequestSort } =
    props;
  const createSortHandler =
    (property: keyof DatasetT) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
            </TableSortLabel>
          </TableCell>
        ))}
        <TableCell>Actions</TableCell>
      </TableRow>
    </TableHead>
  );
}