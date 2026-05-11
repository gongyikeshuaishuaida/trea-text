const bikeLocations = [
    { name: "某小区西门", type: "住宅区" },
    { name: "某小区东门", type: "住宅区" },
    { name: "某小区南门", type: "住宅区" },
    { name: "公交站A西侧", type: "公交站" },
    { name: "公交站A东侧", type: "公交站" },
    { name: "某商场东门", type: "商圈" },
    { name: "某商场南门", type: "商圈" },
    { name: "某商场西门", type: "商圈" },
    { name: "某商场北门", type: "商圈" }
];

const timeRange = [];
for (let hour = 7; hour <= 20; hour++) {
    for (let min = 0; min < 60; min += 10) {
        timeRange.push(`${hour}:${min.toString().padStart(2, '0')}`);
    }
}

function generateBikeData() {
    const data = {};
    
    bikeLocations.forEach(loc => {
        data[loc.name] = {};
        let baseCount;
        
        if (loc.type === "住宅区") {
            baseCount = 40 + Math.floor(Math.random() * 10);
        } else if (loc.type === "公交站") {
            baseCount = 15 + Math.floor(Math.random() * 10);
        } else {
            baseCount = 5 + Math.floor(Math.random() * 10);
        }
        
        timeRange.forEach(time => {
            const hour = parseInt(time.split(':')[0]);
            const minute = parseInt(time.split(':')[1]);
            const totalMinutes = hour * 60 + minute;
            const baseMinutes = 7 * 60;
            const minutesFrom7 = totalMinutes - baseMinutes;
            
            let count;
            
            if (loc.type === "住宅区") {
                if (minutesFrom7 < 90) {
                    count = baseCount;
                } else if (minutesFrom7 < 120) {
                    count = Math.max(5, baseCount - Math.floor((minutesFrom7 - 90) * 0.4));
                } else if (minutesFrom7 < 360) {
                    count = Math.max(3, baseCount - 12);
                } else if (minutesFrom7 < 420) {
                    count = Math.max(5, baseCount - 12 + Math.floor((minutesFrom7 - 360) * 0.2));
                } else {
                    count = Math.min(baseCount, baseCount - 12 + Math.floor((minutesFrom7 - 360) * 0.15));
                }
            } else if (loc.type === "公交站") {
                if (minutesFrom7 < 90) {
                    count = baseCount;
                } else if (minutesFrom7 < 120) {
                    count = Math.min(60, baseCount + Math.floor((minutesFrom7 - 90) * 0.6));
                } else if (minutesFrom7 < 300) {
                    count = 50 + Math.floor(Math.random() * 15);
                } else if (minutesFrom7 < 360) {
                    count = Math.max(baseCount, 50 - Math.floor((minutesFrom7 - 300) * 0.3));
                } else {
                    count = Math.max(baseCount - 5, 35 + Math.floor(Math.random() * 10));
                }
            } else {
                if (minutesFrom7 < 90) {
                    count = baseCount;
                } else if (minutesFrom7 < 120) {
                    count = Math.min(80, baseCount + Math.floor((minutesFrom7 - 90) * 0.8));
                } else if (minutesFrom7 < 360) {
                    count = 60 + Math.floor(Math.random() * 20);
                } else if (minutesFrom7 < 420) {
                    count = Math.max(40, 70 - Math.floor((minutesFrom7 - 360) * 0.5));
                } else {
                    count = Math.max(baseCount, 30 + Math.floor(Math.random() * 15));
                }
            }
            
            count = Math.max(1, count + Math.floor(Math.random() * 5) - 2);
            data[loc.name][time] = count;
        });
    });
    
    return data;
}

const bikeData = generateBikeData();

function getDataAtTime(time) {
    const result = [];
    bikeLocations.forEach(loc => {
        result.push({
            name: loc.name,
            type: loc.type,
            count: bikeData[loc.name][time] || 0
        });
    });
    return result;
}

function getFilteredData(time) {
    const data = getDataAtTime(time);
    return data.filter(item => item.count > 0);
}

function getGroupedData(time) {
    const data = getDataAtTime(time);
    const grouped = {};
    
    data.forEach(item => {
        if (!grouped[item.type]) {
            grouped[item.type] = 0;
        }
        grouped[item.type] += item.count;
    });
    
    return [
        { area: "住宅区", count: grouped["住宅区"] || 0 },
        { area: "公交站", count: grouped["公交站"] || 0 },
        { area: "商圈", count: grouped["商圈"] || 0 }
    ];
}

function getSortedData(time) {
    const grouped = getGroupedData(time);
    return grouped.sort((a, b) => b.count - a.count);
}

const correctAnswers = {
    flow: ['C', 'A', 'B', 'D'],
    filter: '== "8:30"',
    groupbyCol: '"区域类型"',
    aggCol: '"车辆数"',
    aggFunc: 'sum()',
    sortAscending: 'False',
    barX: 'df1["区域类型"]',
    barY: 'df1["车辆数"]'
};

let currentTime = "7:00";
let userFlowAnswer = [];
let bikeChart = null;
