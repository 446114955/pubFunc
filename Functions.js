// 时间切割函数

// 这个东东我的小伙伴也写出来了.我的是在它的解答方式上加以注释和对参数的判断做了考虑
// 他的解法方案在他的 github 上 https://github.com/lyh2668/blog/issues/1 , by lyh2668
// 方便一些小伙伴的理解,以下代码包含ES6的姿势(参数默认值,剪头函数)

let inputDateRange = (date, step = 30, separator = '-') => {
  let startTime, endTime; // 开始时间和结束时间

  if (Object.prototype.toString.call(date) === '[object String]') {
    date = date.trim(); // 去除两边的空格
    var tempDate = '';
    if (separator) {
      tempDate = date.split(separator);
    } else {
      if (date.indexOf('-') !== -1) {
        tempDate = date.split('-');
      } else if (date.indexOf('~')) {
        tempDate = date.split('~');
      } else {
        console.log('您传入的也许不是一个时间段!!!');
      }
    }
    startTime = time2min(tempDate[0]); // 传入的开始时间
    endTime = time2min(tempDate[1]); //传入的结束时间
  } else if (Object.prototype.toString.call(date) === '[object Array]') {
    if (date.length === 2) {
      startTime = time2min(date[0]); // 传入的开始时间
      endTime = time2min(date[1]); //传入的结束时间
    }
  } else {
    console.log('您传入的也许不是一个时间段!!!');
  }

  // 传入的 step 是否为数字,否则截图数字部分转化
  // 为什么和 NaN 比较(自身不等性),若是传入的连正则都没法识别,那只能给默认值了
  Object.prototype.toString.call(step) === '[object Number]'
    ? (step = parseInt(step, 10))
    : parseInt(step.replace(/[W\s\b]/g, ''), 10) === NaN
      ? (step = parseInt(step.replace(/[W\s\b]/g, ''), 10))
      : (step = 30);

  // 若是开始时间大于结束时间则结束时间往后追加一天
  startTime > endTime ? (endTime += 24 * 60) : '';

  let transformDate = []; // 储存转换后的数组,时间分段

  // 开始遍历判断,用 while
  while (startTime < endTime) {
    // 如果开始时间+步长大于结束时间,则这个分段结束,否则结束时间是步长递增
    let right = startTime + step > endTime ? endTime : startTime + step;
    transformDate.push(`${min2time(startTime)}-${min2time(right)}`);
    startTime += step; // 步长递增
  }
  return transformDate;
};

// 时间转化为分钟
let time2min = time => {
  // 获取切割的
  time.indexOf(':') ? (time = time.trim().split(':')) : '';
  return time[0] * 60 + parseInt(time[1]); // 返回转化的分钟
};

// 分钟转会字符串时间
let min2time = minutes => {
  let hour = parseInt(minutes / 60); // 返回多少小时
  let minute = minutes - hour * 60; // 扣除小时后剩余的分钟数

  hour >= 24 ? (hour = hour - 24) : ''; // 若是大于等于24小时需要扣除一天得到所剩下的小时
  minute < 10 ? (minute = '0' + minute) : ''; // 小于10的都要补零
  hour < 10 ? (hour = '0' + hour) : ''; // 小于10的都要补零
  return `${hour}:${minute}`;
};


// // test ,支持字符串传入时间段
// inputDateRange('3:00-5:00','20d'); // ["03:00-03:20", "03:20-03:40", "03:40-04:00", "04:00-04:20", "04:20-04:40", "04:40-05:00"]

// // 亦或者数组传入
// inputDateRange(['3:00','5:00'],'45df.3d'); // ["03:00-03:45", "03:45-04:30", "04:30-05:00"]

// // step 支持数字亦或者带特殊字符的数字
// inputDateRange(['6:00','8:00'],'55df.3d'); // ["06:00-06:55", "06:55-07:50", "07:50-08:00"]

// inputDateRange('3:00-5:00',60); // ["03:00-04:00", "04:00-05:00"]



// 判断数据是什么类型，基本类型使用typeof，引用类型使用Object.prototype.toString()
let classType = {};
// 生成classType映射
"Boolean Number String Function Array Date RegExp Object Error".split(" ").map(function (item, index) {
  classType["[object " + item + "]"] = item.toLowerCase();
});
let type = (obj) => {
  if (obj == null) {
    return obj + "";
  }
  return typeof obj === "object" || typeof obj === "function" ?
         classType[Object.prototype.toString.call(obj)] || "object" : typeof obj;
}


// 浅拷贝
let shallowCopy = function (obj) {
  // 只拷贝对象
  if (typeof obj !== 'object') {
    return;
  }

  // 根据obj的类型判断是新建一个数组还是对象
  let newObj = obj instanceof Array ? [] : {};

  // 遍历obj，并且判断是obj的属性才拷贝
  for(let key in obj) {
    if (obj.hasOwnproperty(key)) {
      newObj[key] = obj[key];
    }
  }
  return newObj;
}

// 深拷贝
let deepCopy = function (obj) {
  if (typeof obj !== 'object') {
    return;
  }

  let newObj = obj instanceof Array ? [] : {};

  for(let key in obj) {
    if (obj.hasOwnproperty(key)) {
      newObj[key] = typeof obj[key] === 'object' ? deepCopy(obj[key]) : obj[key];
    }
  }

  return newObj[key];
}



// extend 的实现
// isPlainObject 函数来自于  [JavaScript专题之类型判断(下) ](https://github.com/mqyqingfeng/Blog/issues/30)
var class2type = {};
var toString = class2type.toString;
var hasOwn = class2type.hasOwnProperty;

function isPlainObject(obj) {
    var proto, Ctor;
    if (!obj || toString.call(obj) !== "[object Object]") {
        return false;
    }
    proto = Object.getPrototypeOf(obj);
    console.log('proto:', !proto);
    if (!proto) {
        return true;
    }
    Ctor = hasOwn.call(proto, "constructor") && proto.constructor;
    return typeof Ctor === "function" && hasOwn.toString.call(Ctor) === hasOwn.toString.call(Object);
}

function extend() {
    // 默认不进行深拷贝
    var deep = false;
    var name, options, src, copy, clone, copyIsArray;
    var length = arguments.length;
    // 记录要复制的对象的下标
    var i = 1;
    // 第一个参数不传布尔值的情况下，target 默认是第一个参数
    var target = arguments[0] || {};
    // 如果第一个参数是布尔值，第二个参数是 target
    if (typeof target == 'boolean') {
        deep = target;
        target = arguments[i] || {};
        i++;
    }
    // 如果target不是对象，我们是无法进行复制的，所以设为 {}
    if (typeof target !== "object" && !isFunction(target)) {
        target = {};
    }

    // 循环遍历要复制的对象们
    for (; i < length; i++) {
        // 获取当前对象
        options = arguments[i];
        // 要求不能为空 避免 extend(a,,b) 这种情况
        if (options != null) {
            for (name in options) {
                // 目标属性值
                src = target[name];
                // 要复制的对象的属性值
                copy = options[name];

                // 解决循环引用
                if (target === copy) {
                    continue;
                }

                // 要递归的对象必须是 plainObject 或者数组
                if (deep && copy && (isPlainObject(copy) || (copyIsArray = Array.isArray(copy)))) {
                    // 要复制的对象属性值类型需要与目标属性值相同
                    if (copyIsArray) {
                        copyIsArray = false;
                        clone = src && Array.isArray(src) ? src : [];

                    } else {
                        clone = src && isPlainObject(src) ? src : {};
                    }

                    target[name] = extend(deep, clone, copy);

                } else if (copy !== undefined) {
                    target[name] = copy;
                }
            }
        }
    }

    return target;
};


  function EventEmitter() {
    // 用Object.create(null)代替空对象{}
      // 好处是无杂质，不继承原型链的东东
    this._events = Object.create(null);
  }

  // 默认最多的绑定次数
  EventEmitter.defaultMaxListeners = 10;

  // 将on方法赋值在 addListener
  EventEmitter.prototype.addListener = EventEmitter.prototype.on;

  // 放回监听的事件名
  EventEmitter.prototype.eventNames = function() {
    // 返回的是一个数组
    // Object.key可以类似for...in一样，返回一个给定对象的自身可枚举属性组成的数组
    return Object.keys(this._events);
  }

  // 设置最大的监听数
  EventEmitter.prototype.setMaxListeners = function(n) {
    this._count = n;
  }

  // 获取最大的监听数
  EventEmitter.prototype.getMaxListeners = function() {
    return this._count ? this._count : this.defaultMaxListeners;
  }

  // 实现监听的方法
  EventEmitter.prototype.on = function(type, cb, flag) {
    // 默认值，如果没有_events的话，就给它创建一个
    if (!this._events) {
      this._events = Object.create(null);
    }

    // 不是newListener 就应该让newListener执行以下
    if (type !== 'newListener') {
      this._events['newListener'] && this._events['newListener'].forEach(listener => {
        listener(type);
      });
    }

    if (this._events[type]) {
      if (flag) {
        this._events[type].unshift(cb);
      } else {
        this._events[type].push(cb);
      }
    } else {
      this._events[type] = [cb];
    }

    // 监听的事件不能超过了设置的最大监听数
    if (this._events[type].length === this.getMaxListeners()) {
      console.log('warming: 超过了最大的监听数');
    }
  };

  // 向前添加
  EventEmitter.prototype.prependListener = function(type, cb) {
    this.on(type, cb, true);
  };

  EventEmitter.prototype.prependOnceListener = function(type, cb) {
    this.once(type, cb, true);
  };

  // 监听一次
  EventEmitter.prototype.once = function(type, cb, flag) {
    // 先绑定，调用后删除
    function wrap() {
      cb(...arguments);
      this.removeListener(type, wrap);
    }

    // 自定义属性
    wrap.listen = cb;
    this.on(type, wrap, flag);
  };

  // 删除监听类型
  EventEmitter.prototype.removeListener = function(type, cb) {
    if (this._events[type]) {
      this._events[type] = this._events[type].filter(listener => {
        return cb !== listener && cb !== listener.listen;
      });
    }
  };

  EventEmitter.prototype.removeAllListener = function() {
    this._events = Object.create(null);
  };

  // 返回所有的监听类型
  EventEmitter.prototype.listeners = function(type) {
    return this._events[type];
  };

  // 发布
  EventEmitter.prototype.emit = function(type, ...args) {
    if (this._events[type]) {
      this._events[type].forEach(listener => {
        listener.call(this, ...args);
      });
    }
  }

  // let evt = new EventEmitter();
  // evt.on('fuck', function(data) {
  //   console.log('data:', data);
  //   console.log('every people');
  // });
  // evt.emit('fuck', {'first': 'jhon', 'second': 'tommy'});


