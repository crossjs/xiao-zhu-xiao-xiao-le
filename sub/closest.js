// eslint-disable-next-line
import * as regeneratorRuntime from "./utils/runtime";

// 获取 canvas 渲染上下文
const context = sharedCanvas.getContext("2d");
context.globalCompositeOperation = "source-over";

export const Closest = {
  /**
   * 绘制屏幕
   * 这个函数会在加载完所有资源之后被调用
   */
  async create({ width, height, openid, avatarUrl, nickname, score }) {
    if (this.lastOpenid === openid) {
      // console.log("数据没有变化，无需更新");
    } else if (sharedCanvas.width && sharedCanvas.height) {
      this.scaleX = sharedCanvas.width / width;
      this.scaleY = sharedCanvas.height / height;
      context.setTransform(this.scaleX, 0, 0, this.scaleY, 0, 0);
      this.cleanScreen();
      this.lastOpenid = openid;
      // 绘制头像
      this.drawImage(avatarUrl, 24, 12, 48, 48);
      // 绘制名称
      this.drawText(nickname, 48, 90, 95);
      // 绘制分数
      this.drawText(score, 48, 114, 95);
    } else {
      console.error("创建开放数据域失败，请检查是否加载开放数据域资源");
    }
  },

  destroy() {
    this.cleanScreen();
    this.lastOpenid = null;
  },

  cleanScreen() {
    context.clearRect(
      0,
      0,
      sharedCanvas.width / this.scaleX,
      sharedCanvas.height / this.scaleY,
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
  drawText(text, x, y, width, {
    color = "#FFFFFF",
  } = {}) {
    // 设置字体
    context.textAlign = "center";
    context.font = "24px sans-serif";
    context.fillStyle = color;
    context.fillText(String(text), x, y, width);
  },
};
