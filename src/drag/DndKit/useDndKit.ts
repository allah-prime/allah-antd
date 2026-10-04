import type { KeyboardCoordinateGetter, UniqueIdentifier } from '@dnd-kit/core';
import { KeyboardSensor, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import type { DragEndEvent, DragOverEvent } from '@dnd-kit/core/dist/types';
import { arrayMove } from '@dnd-kit/sortable';
import { useState } from 'react';
import { coordinateGetter as multipleContainersCoordinateGetter } from './multipleContainersKeyboardCoordinates';

/**
 * 被拖拽的元素
 */
export type IDndKitItem<T> = T & { ahKey: string; dropAnimation?: boolean };

/**
 * 数据的主键必须有id
 */
interface IProps<T> {
  coordinateGetter?: KeyboardCoordinateGetter;
  buildNewItem: (item: T) => IDndKitItem<T>;
  // 是否打印日志
  showLog?: boolean;
}

function useDndKit<T = any>({
  coordinateGetter = multipleContainersCoordinateGetter,
  buildNewItem,
  showLog
}: IProps<T>) {
  const [collectionA, setCollectionA] = useState<IDndKitItem<T>[]>([]);
  const [collectionB, setCollectionB] = useState<IDndKitItem<T>[]>([]);
  // B的备份
  const [collectionBBackup, setCollectionBBackup] = useState<IDndKitItem<T>[]>([]);
  // 被拖拽的元素
  const [activeItem, setActiveItem] = useState<IDndKitItem<T> | null>();
  // 复制的元素
  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter
    })
  );

  // 获取当前容器的索引
  const findContainer = (id: UniqueIdentifier) => {
    if (id === 'B') {
      return 'B';
    }
    // 检查A里面有没有
    const index = collectionB.findIndex(item => item!.ahKey === id);
    if (index > -1) {
      return 'B';
    }
    return 'A';
  };

  const printLog = (str: any) => {
    if (showLog) {
      console.log(str);
    }
  };

  const onDragOver = ({ active, over }: DragOverEvent) => {
    const overId = over?.id;
    printLog(`${active.id}被拖拽到${overId}上`);
    // 如果我在我自己上面移动，就不管了
    if (overId === activeItem?.ahKey) {
      printLog('overId等于activeItem.name');
      return;
    }
    // 如果拖拽元素的id为空，或者拖拽元素的id等于垃圾桶的id，或者拖拽元素的id在items中存在，则返回
    if (overId === null) {
      printLog('overId为空');
      return;
    }
    // 根据结束拖拽的id，获取当前容器的索引
    const overContainer = findContainer(overId!);
    // 根据开始拖拽的id，获取当前容器的索引
    const activeContainer = findContainer(active.id);
    printLog(`正在将数据从${activeContainer}移动到${overContainer}`);
    // 如果结束拖拽的容器索引为空，或者开始拖拽的容器索引为空，则返回
    if (!overContainer || !activeContainer) {
      return;
    }
    // 只有从A容器拖拽到B容器才会更新数据
    if (activeContainer !== overContainer && overContainer === 'B') {
      printLog('不是同一个容器，更新数据');
      const activeItems = collectionA;
      const overItems = collectionB;
      const overIndex = overItems.findIndex(item => item!.ahKey === overId);
      const activeIndex = activeItems.findIndex(item => item!.ahKey === active.id);
      // active.rect.current.translated 是一个对象，它表示拖拽元素当前的位置。
      // active.rect.current.translated.top 表示拖拽元素顶部的位置。
      // over.rect.top 和 over.rect.height 分别表示目标元素的顶部位置和高度。在这段代码中，它们被用来判断拖拽元素是否在目标元素的下方。
      // 如果当前元素距离容器的顶部距离大于目标元素距离容器的顶部距离加上目标元素的高度，则表示当前元素在目标元素的下方。否则就是在目标元素的上方。
      const isBelowOverItem =
        over &&
        active.rect.current.translated &&
        active.rect.current.translated.top > over.rect.top + over.rect.height;

      const modifier = isBelowOverItem ? 1 : 0;

      const newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length;
      if (newIndex === overItems.length) {
        printLog('asdd');
      }
      printLog(['newIndex', newIndex]);
      printLog(
        `从容器${activeContainer}的位置${activeIndex}移动到容器${overContainer}的位置${newIndex}`
      );
      // 里面没有这个元素，才存起来
      const findIndex = overItems.findIndex(item => item!.ahKey === activeItem!.ahKey);
      printLog(['findIndex', findIndex]);
      if (findIndex === -1) {
        printLog(`${overContainer}一个新移入的元素${activeItem!.ahKey}`);
        // 这个元素要存起来
        overItems.splice(newIndex, 0, activeItem!);
        // 更新数据
        if (overContainer === 'B') {
          setCollectionB([...overItems]);
        }
      } else {
        if (overId === 'B') {
          // 则不更新数据
          printLog('移入的是B容器，不更新数据');
          return;
        }
        printLog(`正在容器内交换位置从${findIndex}到${newIndex}`);
        // 给移入的容器更新下数据
        const newList = arrayMove(collectionB, findIndex, overIndex);
        setCollectionB([...newList]);
      }
    }
  };

  // 拖拽结束了
  const onDragEnd = ({ active, over }: DragEndEvent) => {
    console.log('onDragEnd1', active, over);
    // 根据当前的拖拽元素id，获取当前容器的索引
    const activeContainer = findContainer(active.id);
    // 如果容器不存在，则结束，不操作
    if (!activeContainer) {
      setActiveItem(null);
      return;
    }
    // 当前移入的id
    const overId = over?.id;
    // 如果当前移入的id为空，则结束，不操作
    if (overId === null) {
      setActiveItem(null);
      return;
    }
    // 根据结束拖拽的id，获取当前容器
    const overContainer = findContainer(overId!);
    if (activeContainer === 'A' && overContainer === 'B') {
      printLog('从A移动到B');
      // 从A移动到B - 位置的变换之前已经操作过了，这里不需要操作。只要判断下面两个就好了
    } else if (activeContainer === 'B' && overContainer === 'B' && overId !== 'B') {
      // B容器内的元素自己移动 - 同时B元素移动到B元素上面也相当于无效移动
      // 获取移入前的索引
      const activeIndex = collectionBBackup.findIndex(item => item!.ahKey === active.id);
      // 获取移入后的索引
      const overIndex = collectionB.findIndex(item => item!.ahKey === overId);
      // 如果两个索引不一致的话，就移入数据
      if (activeIndex !== overIndex) {
        // 给移入的容器更新下数据
        const newList = arrayMove(collectionB, activeIndex, overIndex);
        setCollectionB(newList);
        setCollectionBBackup([]);
      }
    } else if (overContainer === 'A' && activeContainer === overContainer) {
      // 从A移出来，然后又移动到A，需要把B中的数据删了，因为B中的数据已经被移动到A中了
      const overList = collectionB;
      const overIndex = overList.findIndex(item => item!.ahKey === activeItem?.ahKey);
      if (overIndex !== -1) {
        overList.splice(overIndex, 1);
        setCollectionB(overList);
      }
    }
    // 设置当前拖拽元素的id为null
    setActiveItem(null);
  };

  const onDragStart = ({ active }: DragEndEvent) => {
    printLog(['开始拖拽', active]);
    const collection = findContainer(active.id);
    // 如果是容器B的话，就不生成新的了
    if (collection === 'A') {
      // 从A里面找到数据
      const activeAItem = collectionA.find(item => item!.ahKey === active.id);
      // 基于当前的拖拽元素，生成一个新的元素
      const newItem = buildNewItem(activeAItem!);
      // A拖出来的话，不显示动画
      newItem.dropAnimation = false;
      // 在移入的容器中，插入当前拖拽的元素
      setActiveItem(newItem);
    } else {
      // 备份下B
      setCollectionBBackup([...collectionB]);
      const newItem = collectionB.findIndex(item => item?.ahKey === active.id);
      // b的话，显示动画
      setActiveItem({ ...collectionB[newItem], dropAnimation: true });
    }
  };

  return {
    sensors,
    collectionA,
    setCollectionA,
    collectionB,
    setCollectionB,
    collectionBBackup,
    setCollectionBBackup,
    activeItem,
    setActiveItem,
    findContainer,
    onDragEnd,
    onDragOver,
    onDragStart
  };
}

export default useDndKit;
