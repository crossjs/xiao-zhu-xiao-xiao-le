// eslint-disable-next-line
import * as regeneratorRuntime from "./utils/runtime";
import { AssetsManager } from "./assets";

// 获取 canvas 渲染上下文
const context = sharedCanvas.getContext("2d");
context.globalCompositeOperation = "source-over";

export const Ranking = {
  isReady: false,
  detached: false,

  async preload() {
    if (!this.isReady) {
      await AssetsManager.init();
      this.isReady = true;
      this.onScroll(direction => {
        this.goPage(direction);
      });
    }
  },

  /**
   * 绘制屏幕
   * 这个函数会在加载完所有资源之后被调用
   */
  async create({ width, height, mode, rankingData, pageSize = 5, openid = 0 }) {
    if (sharedCanvas.width && sharedCanvas.height) {
      // 确保就绪
      await this.preload();
      this.assets = await AssetsManager.getAssets();
      this.width = width;
      this.height = height;
      this.key = mode;
      this.rankingData = rankingData
        .slice(0)
        .sort((a, b) => {
          return a[this.key] > b[this.key] ? -1 : 1;
        })
        .map((v, index) =>
          Object.assign(v, {
            key: index + 1
          })
        );
      this.myRankingData = rankingData.find(item => item.openid === openid);
      this.pageSize = pageSize;
      this.scaleX = sharedCanvas.width / width;
      this.scaleY = sharedCanvas.height / height;
      context.setTransform(this.scaleX, 0, 0, this.scaleY, 0, 0);
      this.cleanScreen();
      this.initProps();
      this.drawRanking();
      this.detached = false;
    } else {
      console.error("创建开放数据域失败，请检查是否加载开放数据域资源");
    }
  },

  destroy() {
    this.detached = true;
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

  initProps() {
    // 内边界
    this.gutterWidth = 10;
    this.gutterHeight = 12;
    this.barHeight = 72;
    this.myBarHeight = 72;

    this.fontSize = 36;

    this.indexWidth = 54;
    this.iconWidth = 48;
    this.scoreWidth = 144;
    this.nameWidth =
      this.width -
      (this.indexWidth + this.iconWidth + this.scoreWidth) -
      this.gutterWidth * 4;

    this.pageIndex = 0;
    this.pageTotal = Math.ceil(this.rankingData.length / this.pageSize);

    // 预先计算各项 X
    let cellX = -this.gutterWidth;
    const xArr = (this.xArr = [cellX]);
    cellX += this.gutterWidth;
    xArr.push(cellX); // 序号
    cellX += this.indexWidth + this.gutterWidth;
    xArr.push(cellX); // 头像
    cellX += this.iconWidth + this.gutterWidth;
    xArr.push(cellX); // 昵称
    cellX += this.nameWidth + this.gutterWidth;
    xArr.push(cellX); // 分数
  },

  // renderDirty: false,

  /**
   * 创建排行榜
   */
  drawRanking() {
    // 获取当前要渲染的数据组
    // 起始 id
    const startID = this.pageSize * this.pageIndex;
    const pageItems = this.rankingData.slice(startID, startID + this.pageSize);
    // 创建 body
    pageItems.forEach((data, index) => {
      // 创建行
      this.drawRankingItem(data, index);
    });
    // 渲染自己
    this.drawRankingItem(this.myRankingData, this.pageSize);
  },

  /**
   * 根据绘制信息以及当前i绘制元素
   */
  drawRankingItem(data, i) {
    const {
      xArr,
      gutterHeight,
      barHeight,
      myBarHeight,
      indexWidth,
      iconWidth,
      nameWidth,
      scoreWidth,
      height,
      assets
    } = this;
    const { key, avatarUrl, nickName, nickname, [this.key]: score } = data;
    const y =
      i === this.pageSize
        ? height - myBarHeight
        : i * (barHeight + gutterHeight);
    // 绘制序号
    if (key < 4) {
      this.drawImage(
        assets[`top${key}`],
        xArr[1],
        y + (barHeight - indexWidth) / 2,
        56,
        53
      );
    }
    this.drawText(key, xArr[1], key < 4 ? y + 8 : y, indexWidth, barHeight, {
      align: "center",
      color: "#101C24",
      fontSize: 24
    });
    // 绘制头像
    this.drawImage(
      avatarUrl,
      xArr[2],
      y + (barHeight - iconWidth) / 2,
      iconWidth,
      iconWidth
    );
    // 绘制名称
    this.drawText(nickName || nickname, xArr[3], y, nameWidth, barHeight, {
      align: "left",
      color: "#101C24"
    });
    // 绘制分数
    this.drawText(score, xArr[4], y, scoreWidth, barHeight, {
      align: "right",
      color: "#E95954"
    });
  },

  onScroll(handler) {
    let x0;
    let y0;
    let startId;

    const start = e => {
      if (this.detached) {
        return;
      }
      const [point] = e.changedTouches;
      x0 = point.clientX;
      y0 = point.clientY;
      startId = point.identifier;
    };

    const end = e => {
      if (this.detached) {
        return;
      }
      const [point] = e.changedTouches;
      const x1 = point.clientX;
      const y1 = point.clientY;
      const endId = point.identifier;

      // 判断是否为同一次触摸，若不是则直接忽略
      if (endId === startId) {
        const dx = x1 - x0;
        const dy = y1 - y0;
        // 滑动 20px 以上激活，防止误触
        // 不使用 1 判断斜率，而留有余量，防止误触
        if (Math.abs(dy) > 20 && Math.abs(dy / dx) > 2) {
          handler(dy > 0 ? -1 : 1);
        }
      }
    };

    wx.onTouchStart(start);
    wx.onTouchEnd(end);
  },

  /**
   * -1 为上一页
   * 1 为下一页
   */
  goPage(offset) {
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
    this.cleanScreen();
    this.drawRanking();
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
    height,
    { align = "left", fontSize = this.fontSize, color = "#ffffff" } = {}
  ) {
    context.textAlign = align;
    if (align === "right") {
      x += width;
    }
    if (align === "center") {
      x += width / 2;
    }
    y += (height + fontSize) / 2.3;
    // 设置字体
    context.font = `${fontSize}px sans-serif`;
    context.fillStyle = color;
    context.fillText(String(text), x, y, width);
  }
};
