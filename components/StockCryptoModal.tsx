import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setSymbol } from '../modal/slices/stockCryptoSlice';
import styles from '../styles/Home.module.css';

const StockCryptoModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [newSymbol, setNewSymbol] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = () => {
    dispatch(setSymbol(newSymbol));
    setIsOpen(false);
  };

  return (
    <div>
      <button onClick={() => setIsOpen(true)}>Change Stock/Crypto</button>
      {isOpen && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <span className={styles.close} onClick={() => setIsOpen(false)}>&times;</span>
            <input
              type="text"
              value={newSymbol}
              onChange={(e) => setNewSymbol(e.target.value)}
              placeholder="Enter stock/crypto symbol"
            />
            <button onClick={handleSubmit}>Submit</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockCryptoModal;
