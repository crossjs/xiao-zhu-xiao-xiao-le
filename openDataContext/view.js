// eslint-disable-next-line
import * as regeneratorRuntime from "./utils/runtime";
import { AssetsManager } from "./assets";

// 获取canvas渲染上下文
const context = sharedCanvas.getContext("2d");
context.globalCompositeOperation = "source-over";

export const View = {
  isReady: false,

  async init() {
    if (!this.isReady) {
      await AssetsManager.init();
      this.isReady = true;
    }
  },

  /**
   * 绘制屏幕
   * 这个函数会在加载完所有资源之后被调用
   */
  async create(data) {
    if (sharedCanvas.width && sharedCanvas.height) {
      // 确保就绪
      await this.init();
      this._initProps(data);
      this.assets = await AssetsManager.getAssets();
      this._drawRanking();
      /**
       * 监听点击
       */
      wx.onTouchEnd((event) => {
        event.changedTouches.forEach((changedTouch) => {
          this._onTouchEnd(changedTouch);
        });
      });
      this._rafId = requestAnimationFrame(() => {
        this._onEnterFrame();
      });
    } else {
      console.error("创建开放数据域失败，请检查是否加载开放数据域资源");
    }
  },

  _initProps({
    x,
    y,
    width,
    height,
    windowWidth,
    windowHeight,
    stageWidth,
    stageHeight,
    useGameDataList = [],
    numPerPage = 5,
  }) {
    this.useGameDataList = useGameDataList;
    this.stageWidth = stageWidth;
    this.stageHeight = stageHeight;
    this.windowWidth = windowWidth;
    this.windowHeight = windowHeight;

    this.scale = sharedCanvas.width / this.stageWidth;

    // 外边界
    this.offsetX = x * this.scale;
    this.offsetY = y * this.scale;

    this.width = width * this.scale;
    this.height = height * this.scale;

    // 内边界
    this.padding = 48 * this.scale;
    this.gutterWidth = 24 * this.scale;
    this.gridCount = 24;

    this.headHeight = 96 * this.scale;
    this.footHeight = 96 * this.scale;

    this.bodyHeight = this.height - this.padding * 2 - this.headHeight - this.footHeight;

    this.barWidth = this.width - this.padding * 2;
    this.barHeight = (this.bodyHeight - this.gutterWidth * 6) / 5;

    // 24 等分，加首尾共有 5 个间隔
    this.cellWidth = (this.barWidth - this.gutterWidth * 5) / this.gridCount;
    this.fontSize = Math.floor(this.cellWidth * 3);
    this.textOffsetY = (this.barHeight + this.fontSize) / 2.2;

    this.indexWidth = this.cellWidth * 3;
    this.iconWidth = this.cellWidth * 6;
    this.iconHeight = Math.min(this.iconWidth, this.barHeight);
    this.nameWidth = this.cellWidth * 9;
    this.scoreWidth = this.cellWidth * 6;

    this.currentPageIndex = 0;
    this.numPerPage = numPerPage;
    this.numOfPages = Math.ceil(this.useGameDataList.length / this.numPerPage);

    this.buttonWidth = this.barWidth * 2 / 5;
    this.buttonHeight = 72 * this.scale;
    this.buttonTextOffsetY = (this.buttonHeight + this.fontSize) / 2.2;

    this.prevButtonX = this.offsetX + this.padding;
    this.prevButtonY = this.offsetY + this.height - this.padding - (this.footHeight + this.buttonHeight) / 2;
    this.nextButtonX = this.offsetX + this.padding + this.buttonWidth / 2 * 3;
    this.nextButtonY = this.prevButtonY;

    // 预先计算各项 X
    let cellX = this.padding + this.offsetX;
    const xArr = this.xArr = [cellX];
    cellX += this.gutterWidth;
    xArr.push(cellX);
    cellX += this.indexWidth + this.gutterWidth;
    xArr.push(cellX);
    cellX += this.iconWidth + this.gutterWidth;
    xArr.push(cellX);
    cellX += this.nameWidth + this.gutterWidth;
    xArr.push(cellX);
    xArr[2] += (this.iconWidth - this.iconHeight) / 2;
  },

  destroy() {
    cancelAnimationFrame(this._rafId);
    this._rafId = null;
  },

  _renderDirty: false,

  /**
   * 创建排行榜
   */
  _drawRanking() {
    // 绘制主背景
    this._drawImage(this.assets.panel, this.offsetX, this.offsetY, this.width, this.height);

    // 绘制页头
    this._drawHead();

    // 绘制列表
    this._drawBody();

    // 绘制页脚
    this._drawFoot();
  },

  _drawHead() {
    // 绘制标题
    const { title } = this.assets;
    // 根据 title 的宽高计算一下位置;
    const titleX = (this.barWidth - title.width) / 2 + this.padding + this.offsetX;
    const titleY = this.padding + this.offsetY;
    this._drawImage(title, titleX, titleY);
  },

  _drawBody() {
    // 获取当前要渲染的数据组
    // 起始id
    const startID = this.numPerPage * this.currentPageIndex;
    const currentPageIndexGroup = this.useGameDataList.slice(startID, startID + this.numPerPage);
    // 创建 body
    this._drawRankingItems(currentPageIndexGroup);
  },

  _drawFoot() {
    // 创建按钮
    this._drawButton();
  },

  /**
   * 创建两个点击按钮
   */
  _drawButton() {
    const {
      currentPageIndex, numPerPage, numOfPages,
      buttonWidth, buttonHeight,
      prevButtonX, prevButtonY,
      nextButtonX, nextButtonY,
      buttonTextOffsetY: textOffsetY, fontSize,
    } = this;
    if (currentPageIndex > 0) {
      this._drawImage(this.assets.button, prevButtonX, prevButtonY, buttonWidth, buttonHeight);
      this._drawText(`前 ${numPerPage} 名`, prevButtonX, prevButtonY + textOffsetY, buttonWidth, { align: "center", fontSize });
    }
    if (currentPageIndex < numOfPages - 1) {
      this._drawImage(this.assets.button, nextButtonX, nextButtonY, buttonWidth, buttonHeight);
      this._drawText(`后 ${numPerPage} 名`, nextButtonX, nextButtonY + textOffsetY, buttonWidth, { align: "center", fontSize });
    }
  },

  /**
   * 根据当前绘制组绘制排行榜
   */
  _drawRankingItems(currentPageIndexGroup) {
    currentPageIndexGroup.forEach((data, index) => {
      // 创建行
      this._drawRankingItem(data, index);
    });
  },

  /**
   * 根据绘制信息以及当前i绘制元素
   */
  _drawRankingItem(data, i) {
    const {
      xArr, padding, offsetY, headHeight,
      gutterWidth, textOffsetY, barWidth, barHeight,
      indexWidth, iconHeight, nameWidth, scoreWidth,
    } = this;
    const y = i * (barHeight + gutterWidth) + padding + offsetY + headHeight;
    // 绘制底框
    this._drawImage(this.assets.box, xArr[0], y, barWidth, barHeight);
    // 绘制序号
    this._drawText(data.key, xArr[1], y + textOffsetY, indexWidth, { align: "center" });
    // 绘制头像
    this._drawImage(data.avatarUrl, xArr[2], y + (barHeight - iconHeight) / 2, iconHeight, iconHeight);
    // 绘制名称
    this._drawText(data.nickname, xArr[3], y + textOffsetY, nameWidth);
    // 绘制分数
    this._drawText(data.score, xArr[4], y + textOffsetY, scoreWidth, { align: "right" });
  },

  /**
   * 点击处理
   */
  _onTouchEnd(event) {
    const x = event.clientX * sharedCanvas.width / this.windowWidth;
    const y = event.clientY * sharedCanvas.height / this.windowHeight;
    if (this.currentPageIndex > 0) {
      // 在 prev 按钮的范围内
      if (x > this.prevButtonX && x < this.prevButtonX + this.buttonWidth &&
        y > this.prevButtonY && y < this.prevButtonY + this.buttonHeight) {
        this._goPage(-1);
      }
    }
    if (this.currentPageIndex < this.numOfPages - 1) {
      // 在 next 按钮的范围内
      if (x > this.nextButtonX && x < this.nextButtonX + this.buttonWidth &&
        y > this.nextButtonY && y < this.nextButtonY + this.buttonHeight) {
        this._goPage(1);
      }
    }
  },

  /**
   * -1 为上一页按钮
   * 1 为下一页按钮
   */
  _goPage(offset) {
    const offsetY = 3;
    if (offset === -1) {
      // 上一页按钮
      this.prevButtonY += offsetY;
      this.currentPageIndex--;
      this._renderDirty = true;
      setTimeout(() => {
        this.prevButtonY -= offsetY;
        // 重新渲染必须标脏
        this._renderDirty = true;
      }, 100);
    } else if (offset === 1) {
      // 下一页按钮
      this.nextButtonY += offsetY;
      this.currentPageIndex++;
      this._renderDirty = true;
      setTimeout(() => {
        this.nextButtonY -= offsetY;
        // 重新渲染必须标脏
        this._renderDirty = true;
      }, 100);
    }
  },

  /**
   * 图片绘制函数
   */
  _drawImage(image, x, y, width, height) {
    if (typeof image === "string") {
      const img = wx.createImage();
      img.onload = () => {
        this._drawImage(img, x, y, width, height);
      };
      img.src = image;
      return;
    }
    if (width && height) {
      context.drawImage(image, x, y, width, height);
    } else {
      context.drawImage(image, x, y);
    }
  },

  /**
   * 文本绘制函数
   */
  _drawText(text, x, y, width, {
    align = "left",
    fontSize = this.fontSize,
    color = "#ffffff",
  } = {}) {
    context.textAlign = align;
    if (align === "right") {
      x += width;
    }
    if (align === "center") {
      x += width / 2;
    }
    // 设置字体
    context.font = `${fontSize}px Arial`;
    context.fillStyle = color;
    context.fillText(String(text), x, y, width);
  },

  /**
   * 循环函数
   * 每帧判断一下是否需要渲染
   * 如果被标脏，则重新渲染
   */
  _onEnterFrame() {
    if (this._renderDirty) {
      context.setTransform(1, 0, 0, 1, 0, 0);
      context.clearRect(
        this.padding,
        this.padding + this.headHeight,
        this.barWidth,
        this.bodyHeight
      );
      this._drawRanking();
      this._renderDirty = false;
    }
    this._rafId = requestAnimationFrame(() => {
      this._onEnterFrame();
    });
  },
};
