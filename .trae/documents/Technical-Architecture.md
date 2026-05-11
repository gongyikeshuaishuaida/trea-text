# 技术架构文档

## 1. 技术选型

### 1.1 前端框架
- **核心框架**：纯HTML5 + CSS3 + JavaScript（原生）
- **CSS预处理器**：原生CSS变量 + CSS Grid/Flexbox
- **代码高亮**：Prism.js 或 Highlight.js
- **图标库**：Font Awesome 或 Lucide Icons
- **图表库**：Chart.js（用于柱状图展示）

### 1.2 数据处理
- **前端模拟**：JavaScript模拟pandas数据操作
- **数据存储**：JSON格式内嵌于HTML
- **代码执行**：使用简单的JavaScript解释器或代码模拟

### 1.3 文件结构
```
/learning-platform
├── index.html          # 主入口文件
├── css/
│   └── styles.css      # 样式文件
├── js/
│   ├── app.js          # 主应用逻辑
│   ├── data.js         # 模拟数据
│   ├── activities.js   # 活动模块
│   └── knowledge.js    # 知识库内容
└── assets/
    └── images/         # 图片资源
```

---

## 2. 页面架构

### 2.1 页面路由
采用单页应用(SPA)架构，通过JavaScript控制页面切换：

| 视图ID | 页面名称 | 描述 |
|--------|----------|------|
| login | 登录页 | 用户登录界面 |
| home | 首页 | 课程概览和开始按钮 |
| activity-0 | 情境再现 | 交互式单车模拟 |
| activity-1 | 活动一 | 分析流程设计 |
| activity-2 | 活动二 | 数据筛选 |
| activity-3 | 活动三 | 分组统计 |
| activity-4 | 活动四 | 数据排序 |
| activity-5 | 活动五 | 数据可视化 |
| summary | 课堂小结 | 知识点总结 |

### 2.2 组件设计

#### 2.2.1 导航组件
- 顶部进度指示器
- 当前活动标识
- 知识库按钮（固定右上角）

#### 2.2.2 知识库浮窗
- 固定定位浮窗
- 可拖拽功能
- 分类显示pandas知识
- 支持展开/收起

#### 2.2.3 代码编辑器
- 代码高亮显示
- 下划线填空区域
- 运行按钮
- 结果展示区域

#### 2.2.4 时间控制器
- 6个时间调整按钮
- 当前时间显示
- 车辆数据实时更新

---

## 3. 数据结构

### 3.1 模拟数据模型
```javascript
// 共享单车数据
const bikeData = {
  locations: [
    { name: "某小区西门", type: "住宅区" },
    { name: "某小区东门", type: "住宅区" },
    { name: "某小区南门", type: "住宅区" },
    { name: "公交站A西侧", type: "公交站" },
    { name: "公交站A东侧", type: "公交站" },
    { name: "某商场东门", type: "商圈" },
    { name: "某商场南门", type: "商圈" },
    { name: "某商场西门", type: "商圈" },
    { name: "某商场北门", type: "商圈" }
  ],
  timeRange: ["7:00", "7:10", ..., "20:00"], // 78个时间点
  bikeCounts: {
    // 时间 -> 位置 -> 车辆数
  }
};
```

### 3.2 活动状态模型
```javascript
const activityState = {
  currentActivity: 0,
  completedActivities: [],
  userAnswers: {
    activity1: [],
    activity2: "",
    // ...
  }
};
```

---

## 4. 核心功能实现

### 4.1 情境再现模块
- **时间轴控制**：点击按钮±10分钟/30分钟/1小时
- **数据联动**：根据时间获取对应车辆数
- **动画效果**：单车图标数量动态变化
- **数据展示**：表格显示当前位置的详细数据

### 4.2 代码练习模块
- **填空检测**：正则表达式匹配用户输入
- **代码执行**：JavaScript模拟pandas操作
- **结果渲染**：表格或图表展示

### 4.3 拖拽排序模块
- **拖拽API**：HTML5 Drag and Drop API
- **排序验证**：比较数组顺序
- **视觉反馈**：拖拽时的占位符效果

### 4.4 知识库模块
- **浮窗控制**：显示/隐藏/拖拽
- **内容分类**：按功能分类展示
- **代码高亮**：语法着色显示

---

## 5. CSS架构

### 5.1 设计变量
```css
:root {
  --primary-color: #3B82F6;      /* 主色-蓝 */
  --secondary-color: #F59E0B;     /* 强调色-橙 */
  --success-color: #10B981;       /* 成功-绿 */
  --error-color: #EF4444;         /* 错误-红 */
  --background: #F8FAFC;          /* 背景色 */
  --card-background: #FFFFFF;      /* 卡片背景 */
  --text-primary: #1E293B;        /* 主文本 */
  --text-secondary: #64748B;       /* 次文本 */
  --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --border-radius: 12px;
}
```

### 5.2 响应式断点
- **桌面端**：> 1024px
- **平板端**：768px - 1024px
- **移动端**：< 768px

---

## 6. 浏览器兼容性
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

---

## 7. 性能优化
- CSS/JS 文件最小化
- 图片懒加载（如有）
- 防抖处理用户输入
- requestAnimationFrame 优化动画

---

## 8. 文件清单

| 文件路径 | 描述 | 优先级 |
|----------|------|--------|
| index.html | 主HTML文件 | 必须 |
| css/styles.css | 样式表 | 必须 |
| js/app.js | 主应用逻辑 | 必须 |
| js/data.js | 模拟数据 | 必须 |
| js/activities.js | 活动模块 | 必须 |
| js/knowledge.js | 知识库 | 必须 |
