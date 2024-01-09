import { useState, ChangeEvent } from 'react';
import { Button, Input } from 'antd';
import './HouseLabel.css';

type PropsType = {
  isMount: boolean;
  defaultName: string;
  onSave: () => void;
  onChangeName: (name: string) => void;
};

export const HouseLabel = ({
  isMount: defaultMount,
  onSave,
  onChangeName,
  defaultName,
}: PropsType) => {
  const [isMount, setIsMount] = useState(defaultMount);

  const handleSaveHouse = () => {
    setIsMount(true);
    onSave();
  };

  const handleChangeName = (e: ChangeEvent<HTMLInputElement>) => {
    onChangeName(e.target.value);
  };

  return (
    <div className='house-label'>
      <Input
        defaultValue={defaultName}
        placeholder='Адрес'
        onChange={handleChangeName}
        disabled={isMount}
      />
      <Button disabled={isMount} onPointerDown={handleSaveHouse}>
        Сохранить
      </Button>
    </div>
  );
};
