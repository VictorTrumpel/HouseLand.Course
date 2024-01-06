import { useState } from 'react';
import { Button } from 'antd';
import './HouseLabel.css';

type PropsType = {
  isMount: boolean;
  onSave: () => void;
};

export const HouseLabel = ({ isMount: defaultMount, onSave }: PropsType) => {
  const [isMount, setIsMount] = useState(defaultMount);

  const handleSaveHouse = () => {
    setIsMount(true);
    onSave();
  };

  return (
    <div className='house-label'>
      House Label
      <Button disabled={isMount} onPointerDown={handleSaveHouse}>
        Сохранить
      </Button>
    </div>
  );
};
