---
toc: content
group:
  title: 展示
  order: 0
---
# Basic Watermark
基本水印显示

## 何时使用
当需要在页面或特定容器上添加简单的水印时，可以使用基本的水印显示示例。
### 组件简介

`waterMark` 是一个用于在指定容器上生成水印的 JavaScript 函数。水印由一个 HTML5 `<canvas>` 元素绘制，并通过设置背景图像来显示。用户可以自定义水印的大小、颜色、字体、旋转角度等属性，使其适应不同的场景需求。水印会自动适应容器的大小，并且会在容器发生变化时重新绘制，以确保水印始终显示在正确的位置。

### 示例 1: 基本水印显示

## 代码演示
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Basic Watermark Example</title>
  <style>
    #watermarked-container {
      position: relative;
      width: 500px;
      height: 300px;
      border: 1px solid #ddd;
    }
  </style>
</head>
<body>
  <div id="watermarked-container">
    <p>这里是需要水印的内容区域。</p>
  </div>

  <script src="path/to/your/watermark.js"></script>
  <script>
    waterMark({
      container: document.getElementById('watermarked-container'),
      width: '300px',
      height: '150px',
      textAlign: 'center',
      textBaseline: 'middle',
      font: '24px Arial',
      fillStyle: 'rgba(0, 0, 0, 0.1)',
      content: 'Confidential',
      rotate: 45,
      zIndex: 1000
    });
  </script>
</body>
</html>
```


### 示例 2: 动态调整水印


# Dynamic Watermark Adjustment
动态调整水印

## 何时使用
当需要在页面动态调整水印的位置或样式时，可以使用动态调整水印的示例。

## 代码演示
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dynamic Watermark Example</title>
  <style>
    #watermarked-container {
      position: relative;
      width: 500px;
      height: 300px;
      border: 1px solid #ddd;
    }
    #adjustment-controls {
      margin-top: 20px;
    }
  </style>
</head>
<body>
  <div id="watermarked-container">
    <p>这里是需要水印的内容区域。</p>
  </div>
  
  <div id="adjustment-controls">
    <label>
      Rotation:
      <input type="number" id="rotation" value="45" />
    </label>
    <button onclick="updateWatermark()">Update Watermark</button>
  </div>

  <script src="path/to/your/watermark.js"></script>
  <script>
    const container = document.getElementById('watermarked-container');

    function createWatermark() {
      waterMark({
        container: container,
        width: '300px',
        height: '150px',
        textAlign: 'center',
        textBaseline: 'middle',
        font: '24px Arial',
        fillStyle: 'rgba(0, 0, 0, 0.1)',
        content: 'Confidential',
        rotate: parseInt(document.getElementById('rotation').value, 10),
        zIndex: 1000
      });
    }

    function updateWatermark() {
      document.querySelector('.__wm')?.remove();
      createWatermark();
    }

    // Initial watermark creation
    createWatermark();
  </script>
</body>
</html>
```


### 示例 3: 水印在多个容器中显示


# Watermark in Multiple Containers
水印在多个容器中显示

## 何时使用
当需要在多个容器中显示相同的水印时，可以使用这个示例来确保所有容器都显示水印。

## 代码演示
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Multiple Containers Watermark Example</title>
  <style>
    .watermarked-container {
      position: relative;
      width: 400px;
      height: 200px;
      border: 1px solid #ddd;
      margin-bottom: 20px;
    }
  </style>
</head>
<body>
  <div class="watermarked-container">
    <p>容器 1</p>
  </div>
  <div class="watermarked-container">
    <p>容器 2</p>
  </div>

  <script src="path/to/your/watermark.js"></script>
  <script>
    function applyWatermarkToAllContainers() {
      document.querySelectorAll('.watermarked-container').forEach(container => {
        waterMark({
          container: container,
          width: '200px',
          height: '100px',
          textAlign: 'center',
          textBaseline: 'middle',
          font: '16px Arial',
          fillStyle: 'rgba(255, 0, 0, 0.2)',
          content: 'Sample Watermark',
          rotate: 30,
          zIndex: 500
        });
      });
    }

    applyWatermarkToAllContainers();
  </script>
</body>
</html>
```

## FAQ
**Q: 水印在页面滚动时是否会消失？**
A: 不会。水印会保持在容器的相对位置。


**Q: 如何根据用户输入动态调整水印？**
A: 可以通过 JavaScript 更新水印的属性，并重新生成水印。确保在修改属性后删除旧的水印元素。

**Q: 如何在多个容器上应用相同的水印？**
A: 通过遍历所有目标容器并为每个容器调用 `waterMark` 函数来应用水印。确保每个容器都被正确定位和设置。
