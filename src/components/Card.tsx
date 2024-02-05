import { ComponentProps, useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { twMerge } from "tailwind-merge";

/**
 * Your Component
 */
export type ItemProps = {
  id: number;
  title: string;
  description: string;
  imageURL: string;
};

export interface CardProps extends ComponentProps<"li"> {
  item: ItemProps;
  index: number;
  moveCardHandler: (dragIndex: number, hoverIndex: number) => void;
}

export default function Card({
  item,
  moveCardHandler,
  index,
  ...rest
}: CardProps) {
  const ref = useRef<HTMLLIElement>(null);

  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: "test",
      item: item.id,
      collect: (monitor) => {
        return {
          isDragging: monitor.isDragging(),
        };
      },
    }),
    []
  );

  const [, drop] = useDrop({
    // accept receives a definition of what must be the type of the dragged item to be droppable
    accept: "test",
    // This method is called when we hover over an element while dragging

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    hover(item: any, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }
      // Determine rectangle on screen
      const hoverBoundingRect = ref?.current?.getBoundingClientRect();
      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      // Determine mouse position
      const clientOffset = monitor.getClientOffset();
      // Get pixels to the top
      const hoverClientY =
        clientOffset && clientOffset.y - hoverBoundingRect.top;
      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      // Dragging downwards
      if (
        dragIndex < hoverIndex &&
        hoverClientY &&
        hoverClientY < hoverMiddleY
      ) {
        return;
      }
      // Dragging upwards
      if (
        dragIndex > hoverIndex &&
        hoverClientY &&
        hoverClientY > hoverMiddleY
      ) {
        return;
      }
      // Time to actually perform the action
      moveCardHandler(dragIndex, hoverIndex);
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });

  drag(drop(ref));

  //   const [collectedProps] = useDrop(() => ({
  //     accept,
  //   }));

  return (
    <li
      ref={ref}
      className={twMerge(
        "flex gap-4 items-center shadow shadow-cyan-700 w-[500px] rounded-xl p-3 border-2 bg-cyan-900 border-cyan-700 text-white",
        rest.className,
        isDragging && "bg-red-500 opacity-5"
      )}
    >
      <img src={item.imageURL} alt="thumb image" className="w-9" />
      <div className="flex flex-col gap-2">
        <h3 className="">
          <strong>{item.title}</strong>
        </h3>
        <h3 className="">
          {item.description}
        </h3>
      </div>
    </li>
  );
}
