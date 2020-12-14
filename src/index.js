class D3M {
  /**
   * 构造方法，初始化类
   * @param {string} id
   * @param {object} options
   */
  constructor(id, options) {
    if (id && typeof id !== "string") {
      console.warn("D3M:未填写创建标签Id，配置项不生效。");
      return;
    }
    if (id && typeof id === "string") {
      this.createSVG(id);
      if (options) {
        options.scroll ? this.addScroll(options.scroll) : null;
        this._isHover = options.hover ? true : false;
        options.defRectStyle
          ? (this.defRectStyle = options.defRectStyle)
          : null;
      }
    }
  }

  //----------------------------画布创建----------------------------

  /**
   * 根据Id创建SVG标签
   * @param {string} id
   */
  createSVG(id) {
    if (!id) {
      console.error("D3M:未填写创建标签Id。");
      return;
    }
    this.id = id;
    this.$el = document.getElementById(id);
    let ctx = d3.select(`#${id}`).style("position", "relative");
    this.$img = document.querySelector(`#${id} img`);
    this.svg = ctx
      .append("svg")
      .style("position", "absolute")
      .style("top", "0")
      .style("left", "0")
      .attr("width", this.$img.width + "px")
      .attr("height", this.$img.height + "px");
    this.$svg = document.querySelector(`#${id} svg`);
    this.count = {
      rect: 0,
      text: 0,
    };
    this.data = {
      rect: [],
      text: [],
    };
    return this.svg;
  }

  //----------------------------数据渲染----------------------------

  /**
   * 在传入的svg或g标签内渲染传入的数据
   * @param {object<svg|g>} g
   * @param {Array} data
   */
  readData(data) {
    if (!data) {
      console.error("D3M:请填写需要渲染的数据。");
      return;
    }
    if (data.length === 0) {
      console.warn("D3M:渲染数据为空,将不会创建任何图形。");
      return;
    }
    data.forEach((i) => {
      switch (i.type) {
        case "rect":
          this.rect(i);
          break;
        case "text":
          this.text(i);
          break;
      }
    });
  }

  /**
   * 获取所有元素数据
   * @param {svgObj} obj
   */
  getData(obj) {
    if (typeof obj !== "undefined") {
      let id = obj._groups[0][0].id;
      for (let i of Object.keys(this.data)) {
        for (let d of this.data[i]) {
          if (d.id == id) {
            return d;
          }
        }
      }
    } else {
      return { ...this.data };
    }
  }

  //----------------------------创建图形----------------------------

  /**
   * 创建管理组
   * @param {*} options
   */
  group(options) {
    let group = this.svg.append("g");
    if (options) {
      options.id =
        typeof options.id === "undefined" ? null : group.attr("id", options.id);
    }
    return group;
  }

  /**
   * 创建矩形
   * @param {object} options
   */
  rect(options) {
    options.group =
      typeof options.group === "undefined"
        ? this.defRectStyle && this.defRectStyle.group
          ? d3.select(`#${this.defRectStyle.group}`)
            ? d3.select(`#${this.defRectStyle.group}`)
            : this.svg
          : this.svg
        : typeof options.group === "string"
        ? d3.select(`#${options.group}`)
          ? d3.select(`#${options.group}`)
          : this.svg
        : options.group;
    options.width =
      typeof options.width === "undefined"
        ? this.defRectStyle && this.defRectStyle.width
          ? this.defRectStyle.width
          : 100
        : options.width;
    options.height =
      typeof options.height === "undefined"
        ? this.defRectStyle && this.defRectStyle.height
          ? this.defRectStyle.height
          : 100
        : options.height;
    options.fill =
      typeof options.fill === "undefined"
        ? this.defRectStyle && this.defRectStyle.fill
          ? this.defRectStyle.fill
          : "rgb(46,173,252)"
        : options.fill;
    options.fillOpacity =
      typeof options.fillOpacity === "undefined"
        ? this.defRectStyle && this.defRectStyle.fillOpacity
          ? this.defRectStyle.fillOpacity
          : 1
        : options.fillOpacity;
    options.stroke =
      typeof options.stroke === "undefined"
        ? this.defRectStyle && this.defRectStyle.stroke
          ? this.defRectStyle.stroke
          : "rgb(11,90,246)"
        : options.stroke;
    options.strokeWidth =
      typeof options.strokeWidth === "undefined"
        ? this.defRectStyle && this.defRectStyle.strokeWidth
          ? this.defRectStyle.strokeWidth
          : "3px"
        : options.strokeWidth;
    options.rx =
      typeof options.rx === "undefined"
        ? this.defRectStyle && this.defRectStyle.rx
          ? this.defRectStyle.rx
          : "0px"
        : options.rx;
    options.ry =
      typeof options.ry === "undefined"
        ? this.defRectStyle && this.defRectStyle.ry
          ? this.defRectStyle.ry
          : "0px"
        : options.ry;
    this.count.rect++;
    options.id =
      typeof options.id === "undefined" ? `rect${this.count.rect}` : options.id;
    let obj = options.group
      .append("rect")
      .attr("x", options.x)
      .attr("y", options.y)
      .attr("width", options.width)
      .attr("height", options.height)
      .attr("fill", options.fill)
      .attr("fill-opacity", options.fillOpacity)
      .attr("stroke", options.stroke)
      .attr("stroke-width", options.strokeWidth)
      .attr("rx", options.rx)
      .attr("ry", options.ry)
      .attr("id", options.id);
    this.data.rect.push(options);
    if (this._isHover) {
      this.setHover(
        options,
        { "stroke-width": "3px" },
        { "stroke-width": "5px" },
      );
    }
    return obj;
  }

  /**
   * 创建文字
   * @param {*} options
   */
  text(options) {
    options.group =
      typeof options.group === "undefined"
        ? this.defTextStyle && this.defTextStyle.group
          ? d3.select(`#${this.defTextStyle.group}`)
            ? d3.select(`#${this.defTextStyle.group}`)
            : this.svg
          : this.svg
        : typeof options.group === "string"
        ? d3.select(`#${options.group}`)
          ? d3.select(`#${options.group}`)
          : this.svg
        : options.group;
    options.fill =
      typeof options.fill === "undefined"
        ? this.defTextStyle && this.defTextStyle.fill
          ? this.defTextStyle.fill
          : "rgb(0,0,0)"
        : options.fill;
    options.text =
      typeof options.text === "undefined"
        ? `text${this.count.text}`
        : options.text;
    options.background =
      typeof options.background === "undefined"
        ? this.defTextStyle && this.defTextStyle.background
          ? this.defTextStyle.background
          : null
        : options.background;
    options.backgroundWidth =
      typeof options.backgroundWidth === "undefined"
        ? this.defTextStyle && this.defTextStyle.backgroundWidth
          ? this.defTextStyle.backgroundWidth
          : options.text.length * 15
        : options.backgroundWidth;
    this.count.text++;
    options.id =
      typeof options.id === "undefined" ? `text${this.count.text}` : options.id;
    if (options.background) {
      options.group
        .append("rect")
        .attr("x", options.x)
        .attr("y", options.y)
        .attr("width", options.backgroundWidth)
        .attr("height", 23)
        .attr("fill", options.background)
        .attr("id", `${options.id}-background`);
    }
    let obj = options.group
      .append("text")
      .text(options.text)
      .attr("x", options.x + 5)
      .attr("y", options.y + 17)
      .attr("fill", options.fill)
      .attr("id", options.id)
      .style("user-select", "none");
    this.data.text.push(options);
    return obj;
  }

  /**
   * 通过对象更新对象数据
   * @param {*} obj
   * @param {*} attr
   */
  update(obj, attr) {
    let id = obj._groups[0][0].id;
    let datas = {};
    Object.keys(this.data).forEach((i) => {
      this.data[i].forEach((d) => {
        datas[d.id] = d;
      });
    });
    let data = datas[id];
    Object.keys(attr).forEach((i) => {
      if (
        data.type === "text" &&
        (i === "background" || i === "backgroundWidth")
      ) {
        let $bg = document.getElementById(`${data.id}-background`);
        $bg.setAttribute(i, attr[i]);
      } else {
        obj.attr(i, attr[i]);
      }
      data[i] = attr[i];
    });
  }

  /**
   * 通过id更新对象数据
   * @param {*} id
   * @param {*} attr
   */
  updateHtml(id, attr) {
    let $el = document.getElementById(id);
    Object.keys(attr).forEach((i) => {
      if (
        $el.tagName === "text" &&
        (i === "background" || i === "backgroundWidth")
      ) {
        let $bg = document.getElementById(`${data.id}-background`);
        $bg.setAttribute(i, attr[i]);
      } else {
        $el.setAttribute(i, attr[i]);
      }
    });
    Object.keys(this.data).forEach((i) => {
      for (let d of this.data[i]) {
        if (d.id === id) {
          Object.keys(attr).forEach((i) => {
            d[i] = attr[i];
          });
        }
      }
    });
  }

  /**
   * 通过对象移除对象
   * @param {*} obj
   */
  remove(obj) {
    let id = obj._groups[0][0].id;
    let tagName = obj._groups[0][0].tagName;
    obj.remove();
    if (tagName === "text") {
      d3.select(`#${id}-background`).remove();
    }
    Object.keys(this.data).forEach((i) => {
      let temp = this.data[i].filter((e) => e.id !== id);
      this.data[i] = temp;
    });
  }

  /**
   * 通过id移除对象
   * @param {*} id
   */
  removeHtml(id) {
    let $el = document.getElementById(id);
    d3.select(`#${id}`).remove();
    if ($el.tagName === "text") {
      d3.select(`#${id}-background`).remove();
    }
    Object.keys(this.data).forEach((i) => {
      let temp = this.data[i].filter((e) => e.id !== id);
      this.data[i] = temp;
    });
  }

  removeAll() {
    d3.selectAll("rect").remove();
    d3.selectAll("text").remove();
    d3.selectAll("g").remove();
    Object.keys(this.data).forEach((i) => {
      this.data[i] = [];
    });
    Object.keys(this.count).forEach((i) => {
      this.count[i] = 0;
    });
  }

  //----------------------------滚轮缩放----------------------------

  /**
   *
   * @param {object} options
   *  {
   *    max:最大放大比例，默认1.5倍
   *    min：最小缩小比例，默认0.5倍
   *  }
   */
  addScroll({ max = 1.5, min = 0.5 }) {
    this.scrollMax = max;
    this.scrollMin = min;
    this.scrollScale = 1;
    this._onScrollBind = this._onScroll.bind(this);
    this.$el.addEventListener("mousewheel", this._onScrollBind);
  }

  /**
   * 取消滚轮绑定事件
   */
  removeScroll() {
    this.scrollMax = 1;
    this.scrollMin = 1;
    this.scrollScale = 1;
    this.$el.removeEventListener("mousewheel", this._onScrollBind);
    this._onScrollBind = null;
  }

  /**
   * 滚轮绑定事件
   * @param {$event} e
   */
  _onScroll(e) {
    if (e.deltaY < 0 && this.scrollScale + 0.1 <= this.scrollMax) {
      this.scrollScale = this.scrollScale + 0.1;
    } else if (e.deltaY > 0 && this.scrollScale - 0.1 >= this.scrollMin) {
      this.scrollScale = this.scrollScale - 0.1;
    }
    document.getElementsByTagName(
      "img",
    )[0].style.transform = `scale(${this.scrollScale})`;
    document.getElementsByTagName(
      "img",
    )[0].style.transformOrigin = `${e.offsetX}px ${e.offsetY}px`;
    this.$svg.style.transform = `scale(${this.scrollScale})`;
    this.$svg.style.transformOrigin = `${e.offsetX}px ${e.offsetY}px`;
  }

  //----------------------------绘制工具----------------------------

  /**
   * 开始绘制
   * @param {*} type
   * @param {*} callback
   */
  openDraw(type, callback) {
    switch (type) {
      case "rect":
        this.drawCallback = callback;
        this.defDrawStyle = this.defRectStyle;
        break;
    }
    this._onMousedownDrawBind = this._onMousedownDraw.bind(this);
    this._onMouseupDrawBind = this._onMouseupDraw.bind(this);
    this.$svg.addEventListener("mousedown", this._onMousedownDrawBind);
    this.$svg.addEventListener("mouseup", this._onMouseupDrawBind);
  }

  /**
   * 结束绘制
   */
  closeDraw() {
    this.$svg.removeEventListener("mousedown", this._onMousedownDrawBind);
    this.$svg.removeEventListener("mouseup", this._onMouseupDrawBind);
    this.defDrawStyle = null;
    this._onMousedownDrawBind = null;
    this._onMouseupDrawBind = null;
  }

  _onMousedownDraw(e) {
    this.startX = e.offsetX;
    this.startY = e.offsetY;
    this._onDrawBind = this._onDraw.bind(this);
    this.$svg.addEventListener("mousemove", this._onDrawBind);
  }

  _onMouseupDraw() {
    if (!this.drawCallback(this.getData(this.drawObj))) {
      this.remove(this.drawObj);
    }
    this.drawObj = null;
    this.$svg.removeEventListener("mousemove", this._onDrawBind);
    this._onDrawBind = null;
  }

  _onDraw(e) {
    console.log(e);
    this.endX = e.offsetX;
    this.endY = e.offsetY;
    if (!this.drawObj) {
      this.drawObj = this.rect({
        x: this.startX,
        y: this.startY,
        width: Math.abs(this.endX - this.startX),
        height: Math.abs(this.endY - this.startY),
      });
    } else {
      this.update(this.drawObj, {
        width: Math.abs(this.endX - this.startX),
        height: Math.abs(this.endY - this.startY),
      });
    }
  }

  //----------------------------hover监听----------------------------

  /**
   * 添加hover样式
   */
  addHover() {
    this._isHover = true;
    this.data.rect.forEach((i) => {
      this.setHover(i, { "stroke-width": "3px" }, { "stroke-width": "5px" });
    });
  }

  /**
   * 移除hover样式
   */
  removeHover() {
    this._isHover = false;
    this.data.rect.forEach((i) => {
      let $el = document.getElementById(i.id);
      $el.removeEventListener("mouseover", i._hoverStyle);
      $el.removeEventListener("mouseleave", i._defStyle);
    });
  }

  /**
   * 设置hover监听
   * @param {*} data
   * @param {*} defStyle
   * @param {*} hoverStyle
   */
  setHover(data, defStyle, hoverStyle) {
    let $el = document.getElementById(data.id);
    data._hoverStyle = () => {
      this.updateHtml(data.id, hoverStyle);
    };
    data._defStyle = () => {
      this.updateHtml(data.id, defStyle);
    };
    $el.addEventListener("mouseover", data._hoverStyle);
    $el.addEventListener("mouseleave", data._defStyle);
  }

  //----------------------------监听方法----------------------------

  /**
   * 启用监听
   * @param {*} type
   * @param {*} callback
   */
  on(type, callback) {
    this.$svg.addEventListener(type, callback);
  }

  /**
   * 停用监听
   * @param {*} type
   * @param {*} callback
   */
  off(type, callback) {
    this.$svg.removeEventListener(type, callback);
  }
}

//判断导出环境
if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
  module.exports = D3M;
} else {
  if (typeof define === "function" && define.amd) {
    define([], function () {
      return D3M;
    });
  } else {
    window.D3M = D3M;
  }
}
