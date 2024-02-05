import { useEffect, useState } from "react";
import Card, { ItemProps } from "./components/Card";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { getAllTasks } from "./resquests/tasks";

function App() {
  const [items, setItems] = useState<ItemProps[]>([]);

  const moveCardHandler = (dragIndex: number, hoverIndex: number) => {
    const dragItem = items && items[dragIndex];

    if (dragItem) {
      setItems((prevState) => {
        const coppiedStateArray = [...prevState];

        // remove item by "hoverIndex" and put "dragItem" instead
        const prevItem = coppiedStateArray.splice(hoverIndex, 1, dragItem);

        // remove item by "dragIndex" and put "prevItem" instead
        coppiedStateArray.splice(dragIndex, 1, prevItem[0]);

        return coppiedStateArray;
      });
    }
  };

  const getTaskItems = async () => {
    setItems(await getAllTasks());
  };

  useEffect(() => {
    getTaskItems();
  }, []);

  return (
    <div className="bg-gray-800 p-4 flex flex-col items-center">
      <h1 className="text-4xl mb-6 text-white">Desafio i4sea</h1>
      <DndProvider backend={HTML5Backend}>
        <ul className="flex flex-col gap-4">
          {items?.map((item, index) => (
            <Card
              index={index}
              key={item.id}
              item={{
                id: item.id,
                title: item.title,
                description: item.description,
                imageURL: item.imageURL,
              }}
              moveCardHandler={moveCardHandler}
              className=''
            />
          ))}
        </ul>
      </DndProvider>
    </div>
  );
}

export default App;
