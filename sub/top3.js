// eslint-disable-next-line
import * as regeneratorRuntime from "./utils/runtime";
import { AssetsManager } from "./assets";

// 获取canvas渲染上下文
const context = sharedCanvas.getContext("2d");
context.globalCompositeOperation = "source-over";

export const Top3 = {
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
  async create({ width, height, rankingData }) {
    if (sharedCanvas.width && sharedCanvas.height) {
      // 确保就绪
      await this.preload();
      this.assets = await AssetsManager.getAssets();
      const { windowWidth, windowHeight } = wx.getSystemInfoSync();
      this.width = width;
      this.height = height;
      this.windowWidth = windowWidth;
      this.windowHeight = windowHeight;
      this.rankingData = rankingData;
      this.scaleX = sharedCanvas.width / width;
      this.scaleY = sharedCanvas.height / height;
      context.setTransform(this.scaleX, 0, 0, this.scaleY, 0, 0);
      this._cleanScreen();
      this._initProps();
      this._drawRanking();
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
      sharedCanvas.height / this.scaleY
    );
  },

  _initProps() {
    // 内边界
    this.gutterWidth = 10;
    this.gutterHeight = 30;
    this.barHeight = 60;
    this.myBarHeight = 80;

    // 24 等分，加首尾共有 5 个间隔
    this.fontSize = 36;
    this.textOffsetY = (this.barHeight + this.fontSize) / 2.2;

    this.indexWidth = 54;
    this.iconWidth = 48;
    this.scoreWidth = 144;
    this.nameWidth =
      this.width -
      (this.indexWidth + this.iconWidth + this.scoreWidth) -
      this.gutterWidth * 4;

    // 预先计算各项 X
    let cellX = -this.gutterWidth;
    const xArr = (this.xArr = [cellX]);
    cellX += this.gutterWidth;
    xArr.push(cellX);
    cellX += this.indexWidth + this.gutterWidth;
    xArr.push(cellX);
    cellX += this.iconWidth + this.gutterWidth;
    xArr.push(cellX);
    cellX += this.nameWidth + this.gutterWidth;
    xArr.push(cellX);
    // 头像
    xArr[2] += (this.iconWidth - this.iconWidth) / 2;
  },

  _renderDirty: false,

  /**
   * 创建排行榜
   */
  _drawRanking() {
    // 创建 body
    this.rankingData.forEach((data, index) => {
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
      gutterHeight,
      textOffsetY,
      barHeight,
      myBarHeight,
      indexWidth,
      iconWidth,
      nameWidth,
      scoreWidth,
      assets
    } = this;
    let y = i * (barHeight + gutterHeight);
    if (i === 8) {
      y += gutterHeight + (myBarHeight - barHeight) / 2;
    }
    // 绘制序号
    if (data.key < 4) {
      this._drawImage(
        assets[`top${data.key}`],
        xArr[1],
        y + (barHeight - indexWidth) / 2,
        56,
        53
      );
    } else {
      this._drawText(data.key, xArr[1], y + textOffsetY, indexWidth, {
        align: "center",
        color: "#33b6fe"
      });
    }
    // 绘制头像
    this._drawImage(
      data.avatarUrl,
      xArr[2],
      y + (barHeight - iconWidth) / 2,
      iconWidth,
      iconWidth
    );
    // 绘制名称
    this._drawText(data.nickname, xArr[3], y + textOffsetY, nameWidth, {
      align: "left",
      color: "#000000"
    });
    // 绘制分数
    this._drawText(data.score, xArr[4], y + textOffsetY, scoreWidth, {
      align: "right",
      color: "#ff5772"
    });
  },

  /**
   * -1 为上一页
   * 1 为下一页
   */
  _goPage(offset) {
    if (this.pageIndex === undefined) {
      return;
    }
    this.pageIndex += offset;
    if (this.pageIndex < 0) {
      this.pageIndex = 0;
      return;
    }
    if (this.pageIndex >= this.pageTotal) {
      this.pageIndex = this.pageTotal - 1;
      return;
    }
    this._renderDirty = true;
    setTimeout(() => {
      // 重新渲染必须标脏
      this._renderDirty = true;
    }, 100);
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
  _drawText(
    text,
    x,
    y,
    width,
    { align = "left", fontSize = this.fontSize, color = "#ffffff" } = {}
  ) {
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
  }
};
