import { Button } from 'antd';

type TypeProps = {
  scene: { mountDraftHouseOnScene: (title: string) => void };
};

export const HouseMenu = ({ scene }: TypeProps) => {
  const handleClick = (title: string) => {
    scene.mountDraftHouseOnScene(title);
  };

  return (
    <ul className='houses-menu'>
      <Button onClick={() => handleClick('castle')}>Замок</Button>
      <Button onClick={() => handleClick('pizzashop')}>Пиццерия</Button>
      <Button onClick={() => handleClick('shack')}>Лачуга</Button>
      <Button onClick={() => handleClick('woodhouse')}>Изба</Button>
    </ul>
  );
};
