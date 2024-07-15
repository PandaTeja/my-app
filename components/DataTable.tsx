import { FC } from 'react';

interface DataEntry {
  symbol: string;
  data: any;
  timestamp: string;
}

interface DataTableProps {
  data: DataEntry[];
}

const DataTable: FC<DataTableProps> = ({ data }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Symbol</th>
          <th>Price (USD)</th>
          <th>Timestamp</th>
        </tr>
      </thead>
      <tbody>
        {data.map((entry, index) => (
          <tr key={index}>
            <td>{entry.symbol}</td>
            <td>{entry.data[entry.symbol].usd}</td>
            <td>{new Date(entry.timestamp).toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DataTable;
