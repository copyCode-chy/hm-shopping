// postcss.config.js
module.exports = {
  plugins: {
    'postcss-px-to-viewport': {
      // vm适配的标准屏幕宽度
      // 设计图 750，调成一倍 => 适配375标准屏幕
      // 设计图 640，调成一倍 => 适配320标准屏幕
      viewportWidth: 375
    }
  }
}
