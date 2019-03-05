// eslint-disable-next-line
import * as regeneratorRuntime from "./utils/runtime";
import { AssetsManager } from "./assets";

// 获取 canvas 渲染上下文
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
      this.width = width;
      this.height = height;
      this.rankingData = rankingData;
      this.scaleX = sharedCanvas.width / width;
      this.scaleY = sharedCanvas.height / height;
      context.setTransform(this.scaleX, 0, 0, this.scaleY, 0, 0);
      this.cleanScreen();
      this.drawRanking();
    } else {
      console.error("创建开放数据域失败，请检查是否加载开放数据域资源");
    }
  },

  destroy() {
    this.cleanScreen();
  },

  cleanScreen() {
    context.clearRect(
      0,
      0,
      sharedCanvas.width / this.scaleX,
      sharedCanvas.height / this.scaleY
    );
  },

  /**
   * 创建排行榜
   */
  drawRanking() {
    // 创建 body
    this.rankingData.forEach((data, index) => {
      // 创建行
      this.drawRankingItem(data, index);
    });
  },

  /**
   * 根据绘制信息以及当前i绘制元素
   */
  drawRankingItem(data, i) {
    const  { assets } = this;
    const colWidth = this.width / 3;
    const gutterHeight = 10;
    const crownWidth = 56;
    const crownHeight = 53;
    const iconWidth = 72;
    const fontSize = 24;
    const x = (i === 0 ? 1 : i === 1 ? 0 : 2) * colWidth;
    const { key, avatarUrl, nickName, nickname, score } = data;
    let y = i === 0 ? 0 : 30;
    // 绘制序号
    this.drawImage(
      assets[`top${key}`],
      x + (colWidth - crownWidth) / 2,
      y,
      crownWidth,
      crownHeight,
    );
    y += crownHeight + gutterHeight;
    // 绘制头像
    this.drawImage(
      avatarUrl,
      x + (colWidth - iconWidth) / 2,
      y,
      iconWidth,
      iconWidth,
    );
    y += iconWidth + gutterHeight * 2;
    // 绘制名称
    this.drawText(
      nickName || nickname,
      x,
      y,
      colWidth,
      {
        color: "#101C24",
        fontSize,
      },
    );
    y += fontSize + gutterHeight;
    // 绘制分数
    this.drawText(
      score,
      x,
      y,
      colWidth,
      {
        color: "#E95954",
        fontSize,
      },
    );
  },

  /**
   * 图片绘制函数
   */
  drawImage(image, x, y, width, height) {
    if (typeof image === "string") {
      const img = wx.createImage();
      img.onload = () => {
        this.drawImage(img, x, y, width, height);
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
  drawText(
    text,
    x,
    y,
    width,
    { fontSize, color } = {}
  ) {
    x += width / 2;
    y += fontSize / 2 * 1.2;
    context.textAlign = "center";
    context.font = `${fontSize}px sans-serif`;
    context.fillStyle = color;
    context.fillText(String(text), x, y, width);
  },
};
