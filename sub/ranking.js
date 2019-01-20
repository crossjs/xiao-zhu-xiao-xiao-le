// eslint-disable-next-line
import * as regeneratorRuntime from "./utils/runtime";
import { AssetsManager } from "./assets";

// 获取canvas渲染上下文
const context = sharedCanvas.getContext("2d");
context.globalCompositeOperation = "source-over";

export const Ranking = {
  isReady: false,

  async preload() {
    if (!this.isReady) {
      await AssetsManager.init();
      this.isReady = true;
    }
  },

  /**
   * 绘制屏幕
   * 这个函数会在加载完所有资源之后被调用
   */
  async create({ x, y, width, height, rankingData, numPerPage = 10 }) {
    if (sharedCanvas.width && sharedCanvas.height) {
      // 确保就绪
      await this.preload();
      this.assets = await AssetsManager.getAssets();
      const { windowWidth, windowHeight } =  wx.getSystemInfoSync();
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.windowWidth = windowWidth;
      this.windowHeight = windowHeight;
      this.rankingData = rankingData;
      this.numPerPage = numPerPage;
      this.scaleX = sharedCanvas.width / width;
      this.scaleY = sharedCanvas.height / height;
      context.setTransform(this.scaleX, 0, 0, this.scaleY, 0, 0);
      this._cleanScreen();
      this._initProps();
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

  destroy() {
    this._cleanScreen();
    cancelAnimationFrame(this._rafId);
    this._rafId = null;
  },

  _cleanScreen() {
    context.clearRect(
      0,
      0,
      sharedCanvas.width / this.scaleX,
      sharedCanvas.height / this.scaleY,
    );
  },

  _initProps() {
    // 内边界
    this.gutterWidth = 12;
    this.barHeight = 72;

    // 24 等分，加首尾共有 5 个间隔
    this.fontSize = 36;
    this.textOffsetY = (this.barHeight + this.fontSize) / 2.2;

    this.indexWidth = 48;
    this.iconWidth = 72;
    this.scoreWidth = 216;
    this.nameWidth = this.width - (48 + 72 + 216) - this.gutterWidth * 4;

    this.currentPageIndex = 0;
    this.numOfPages = Math.ceil(this.rankingData.length / this.numPerPage);

    this.buttonWidth = 144;
    this.buttonHeight = 48;
    this.buttonTextOffsetY = (this.buttonHeight + this.fontSize) / 2.2;

    this.prevButtonX = this.buttonWidth;
    this.prevButtonY = this.height - this.buttonHeight;
    this.nextButtonX = this.width - this.buttonWidth * 2;
    this.nextButtonY = this.prevButtonY;

    // 预先计算各项 X
    let cellX = 0;
    const xArr = this.xArr = [cellX];
    cellX += this.gutterWidth;
    xArr.push(cellX);
    cellX += this.indexWidth + this.gutterWidth;
    xArr.push(cellX);
    cellX += this.iconWidth + this.gutterWidth;
    xArr.push(cellX);
    cellX += this.nameWidth + this.gutterWidth;
    xArr.push(cellX);
    xArr[2] += (this.iconWidth - this.iconWidth) / 2;

    // 预先计算响应范围
    this.x0 = this.prevButtonX + this.x;
    this.x1 = this.x0 + this.buttonWidth;
    this.x2 = this.nextButtonX + this.x;
    this.x3 = this.x2 + this.buttonWidth;
    this.y0 = this.prevButtonY + this.y;
    this.y1 = this.y0 + this.buttonHeight;
    this.xr = 750 / this.windowWidth; // 因为是 fixedWidth
    this.yr = sharedCanvas.height / this.windowHeight * (750 / sharedCanvas.width);
  },

  _renderDirty: false,

  /**
   * 创建排行榜
   */
  _drawRanking() {
    // 绘制列表
    this._drawBody();

    // 绘制页脚
    this._drawFoot();
  },

  _drawBody() {
    // 获取当前要渲染的数据组
    // 起始 id
    const startID = this.numPerPage * this.currentPageIndex;
    const currentPageIndexGroup = this.rankingData.slice(startID, startID + this.numPerPage);
    // 创建 body
    this._drawRankingItems(currentPageIndexGroup);
  },

  _drawFoot() {
    if (this.numOfPages > 1) {
      // 创建按钮
      this._drawButton();
    }
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
    this._drawImage(currentPageIndex > 0 ? this.assets.button : this.assets.buttonDisabled, prevButtonX, prevButtonY, buttonWidth, buttonHeight);
    this._drawText(`< 前 ${numPerPage}`, prevButtonX, prevButtonY + textOffsetY, buttonWidth, { align: "center", fontSize });
    this._drawImage(currentPageIndex < numOfPages - 1 ? this.assets.button : this.assets.buttonDisabled, nextButtonX, nextButtonY, buttonWidth, buttonHeight);
    this._drawText(`后 ${numPerPage} >`, nextButtonX, nextButtonY + textOffsetY, buttonWidth, { align: "center", fontSize });
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
      xArr,
      gutterWidth, textOffsetY, barHeight,
      indexWidth, iconWidth, nameWidth, scoreWidth,
    } = this;
    const y = i * (barHeight + gutterWidth);
    // 绘制序号
    this._drawText(data.key, xArr[1], y + textOffsetY, indexWidth, { align: "center" });
    // 绘制头像
    this._drawImage(data.avatarUrl, xArr[2], y + (barHeight - iconWidth) / 2, iconWidth, iconWidth);
    // 绘制名称
    this._drawText(data.nickname, xArr[3], y + textOffsetY, nameWidth);
    // 绘制分数
    this._drawText(data.score, xArr[4], y + textOffsetY, scoreWidth, { align: "right" });
  },

  /**
   * 点击处理
   */
  _onTouchEnd(event) {
    const x = event.clientX * this.xr;
    const y = event.clientY * this.yr;
    if (this.currentPageIndex > 0) {
      // 在 prev 按钮的范围内
      if (x > this.x0 && x < this.x1 &&
        y > this.y0 && y < this.y1) {
        this._goPage(-1);
      }
    }
    if (this.currentPageIndex < this.numOfPages - 1) {
      // 在 next 按钮的范围内
      if (x > this.x2 && x < this.x3 &&
        y > this.y0 && y < this.y1) {
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
      this._cleanScreen();
      this._drawRanking();
      this._renderDirty = false;
    }
    this._rafId = requestAnimationFrame(() => {
      this._onEnterFrame();
    });
  },
};
