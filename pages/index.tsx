// pages/index.tsx
import { useEffect, useState } from 'react';
import axios from 'axios';

interface DataEntry {
  _id: string;
  symbol: string;
  data: {
    usd: number;
  };
  timestamp: string;
}

const Home = () => {
  const [data, setData] = useState<DataEntry[]>([]);
  const [symbol, setSymbol] = useState<string>('bitcoin');
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<DataEntry[]>(`/api/data/${symbol}`);
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 10000);

    return () => clearInterval(interval);
  }, [symbol]);

  return (
    <div className="container">
      <h1>Real-Time Stock/Crypto Data</h1>
      <table className="tableWrapper">
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Price (USD)</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry) => (
            <tr key={entry._id}>
              <td>{entry.symbol}</td>
              <td>{entry.data.usd}</td>
              <td>{new Date(entry.timestamp).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={() => setModalOpen(true)}>Change Symbol</button>
      {modalOpen && (
        <div className="modal">
          <div className="modalContent">
            <span className="close" onClick={() => setModalOpen(false)}>&times;</span>
            <h2>Change Symbol</h2>
            <input
              type="text"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              placeholder="Enter stock/crypto symbol"
            />
            <button onClick={() => setModalOpen(false)}>Update</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
