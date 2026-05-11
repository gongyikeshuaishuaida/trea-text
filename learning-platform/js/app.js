function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const classname = document.getElementById('classname').value;
    
    if (username && classname) {
        sessionStorage.setItem('user', JSON.stringify({ username, classname }));
        showView('home-view');
    }
}

function showView(viewId) {
    document.querySelectorAll('.view').forEach(view => {
        view.classList.remove('active');
    });
    document.getElementById(viewId).classList.add('active');
    window.scrollTo(0, 0);
}

function goHome() {
    showView('home-view');
}

function toggleKnowledge() {
    const panel = document.getElementById('knowledge-panel');
    panel.classList.toggle('hidden');
}

function startActivity(activityNum) {
    showView(`activity-${activityNum}`);
    
    if (activityNum === 0) {
        initTimeControl();
    }
}

function initTimeControl() {
    currentTime = "7:00";
    updateTimeDisplay();
    renderLocations();
}

function changeTime(minutes) {
    const currentIndex = timeRange.indexOf(currentTime);
    let newIndex = currentIndex + Math.floor(minutes / 10);
    newIndex = Math.max(0, Math.min(timeRange.length - 1, newIndex));
    currentTime = timeRange[newIndex];
    updateTimeDisplay();
    animateBikeChange();
}

function updateTimeDisplay() {
    document.getElementById('current-time-display').textContent = currentTime;
    renderLocations();
}

function renderLocations() {
    const grid = document.getElementById('locations-grid');
    const homeData = getDataAtTime(currentTime).filter(loc => loc.type === "住宅区");
    
    grid.innerHTML = '';
    
    homeData.forEach(loc => {
        const card = document.createElement('div');
        card.className = 'location-card';
        card.innerHTML = `
            <div class="location-name">${loc.name}</div>
            <div class="bike-visual">${getBikeEmoji(loc.count)}</div>
            <div class="bike-count">${loc.count} 辆</div>
        `;
        grid.appendChild(card);
    });
    
    const total = homeData.reduce((sum, loc) => sum + loc.count, 0);
    document.getElementById('total-bikes').textContent = total;
}

function getBikeEmoji(count) {
    if (count >= 40) return '🚲🚲🚲🚲';
    if (count >= 30) return '🚲🚲🚲';
    if (count >= 20) return '🚲🚲';
    if (count >= 10) return '🚲';
    if (count >= 5) return '🚲';
    return '🚫';
}

function animateBikeChange() {
    const cards = document.querySelectorAll('.location-card');
    cards.forEach(card => {
        card.style.opacity = '0.5';
        card.style.transform = 'scale(0.95)';
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
        }, 150);
    });
    
    setTimeout(renderLocations, 100);
}

document.addEventListener('DOMContentLoaded', function() {
    setupDragAndDrop();
});

function setupDragAndDrop() {
    const draggables = document.querySelectorAll('.draggable');
    const slots = document.querySelectorAll('.slot');
    
    draggables.forEach(draggable => {
        draggable.addEventListener('dragstart', handleDragStart);
        draggable.addEventListener('dragend', handleDragEnd);
    });
    
    slots.forEach(slot => {
        slot.addEventListener('dragover', handleDragOver);
        slot.addEventListener('dragleave', handleDragLeave);
        slot.addEventListener('drop', handleDrop);
    });
}

function handleDragStart(e) {
    e.target.classList.add('dragging');
    e.dataTransfer.setData('text/plain', e.target.dataset.step);
    e.dataTransfer.setData('source', 'options');
}

function handleDragEnd(e) {
    e.target.classList.remove('dragging');
}

function handleDragOver(e) {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
}

function handleDragLeave(e) {
    e.currentTarget.classList.remove('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    
    const step = e.dataTransfer.getData('text/plain');
    const source = e.dataTransfer.getData('source');
    const position = e.currentTarget.dataset.position;
    
    if (source === 'options') {
        const draggable = document.querySelector(`.step-card[data-step="${step}"]`);
        if (draggable && !draggable.classList.contains('in-slot')) {
            e.currentTarget.appendChild(draggable);
            draggable.classList.add('in-slot');
            userFlowAnswer[parseInt(position) - 1] = step;
        }
    } else if (source === 'slot') {
        const fromPosition = parseInt(e.dataTransfer.getData('position'));
        const toPosition = parseInt(position);
        
        if (fromPosition !== toPosition) {
            const fromSlot = document.querySelector(`.slot[data-position="${fromPosition}"]`);
            const toSlot = e.currentTarget;
            const tempStep = userFlowAnswer[toPosition - 1];
            
            userFlowAnswer[toPosition - 1] = userFlowAnswer[fromPosition - 1];
            userFlowAnswer[fromPosition - 1] = tempStep;
            
            reorderSlots();
        }
    }
    
    e.currentTarget.classList.add('filled');
}

function reorderSlots() {
    const slots = document.querySelectorAll('.slot');
    const allDraggables = document.querySelectorAll('.step-card.in-slot');
    
    allDraggables.forEach(d => d.classList.remove('in-slot'));
    slots.forEach(s => s.innerHTML = '');
    slots.forEach(s => s.classList.remove('filled'));
    
    userFlowAnswer.forEach((step, index) => {
        if (step) {
            const slot = document.querySelector(`.slot[data-position="${index + 1}"]`);
            const draggable = document.querySelector(`.step-card[data-step="${step}"]`);
            if (slot && draggable) {
                slot.appendChild(draggable);
                draggable.classList.add('in-slot');
                slot.classList.add('filled');
            }
        }
    });
}

function checkFlowAnswer() {
    const userAnswer = userFlowAnswer.filter(s => s);
    const feedback = document.getElementById('flow-feedback');
    
    if (userAnswer.length !== 4) {
        feedback.textContent = '请将所有步骤卡片拖拽到答案区域！';
        feedback.className = 'feedback incorrect';
        feedback.classList.remove('hidden');
        return;
    }
    
    const isCorrect = JSON.stringify(userAnswer) === JSON.stringify(correctAnswers.flow);
    
    if (isCorrect) {
        feedback.textContent = '🎉 正确！分析流程：C → A → B → D';
        feedback.className = 'feedback correct';
    } else {
        feedback.textContent = '❌ 不完全正确，请重新排列步骤。提示：先确定时间，再查看区域数据，最后可视化！';
        feedback.className = 'feedback incorrect';
    }
    
    feedback.classList.remove('hidden');
}

function runFilterCode() {
    const answer = document.getElementById('filter-answer').value.trim();
    const resultArea = document.getElementById('filter-result');
    
    if (answer === correctAnswers.filter || answer === '=="8:30"') {
        const data = getFilteredData('8:30');
        let html = '<table class="data-table"><thead><tr><th>时间</th><th>星期</th><th>区域类型</th><th>位置名称</th><th>车辆数</th></tr></thead><tbody>';
        
        data.forEach(item => {
            html += `<tr>
                <td>8:30</td>
                <td>周六</td>
                <td>${item.type}</td>
                <td>${item.name}</td>
                <td>${item.count}</td>
            </tr>`;
        });
        
        html += '</tbody></table>';
        html += `<p style="margin-top:12px;color:#64748B;">共筛选出 ${data.length} 条记录</p>`;
        resultArea.innerHTML = html;
    } else {
        resultArea.innerHTML = `
            <div style="background:#FEE2E2;padding:16px;border-radius:8px;color:#991B1B;">
                <strong>⚠️ 代码错误</strong>
                <p>筛选条件不正确。请使用：== "8:30"</p>
            </div>
        `;
    }
}

function runGroupbyCode() {
    const colAnswer = document.getElementById('groupby-col').value.trim();
    const aggColAnswer = document.getElementById('agg-col').value.trim();
    const funcAnswer = document.getElementById('agg-func').value.trim();
    const resultArea = document.getElementById('groupby-result');
    
    const isColCorrect = colAnswer === correctAnswers.groupbyCol || colAnswer === '"区域类型"';
    const isAggColCorrect = aggColAnswer === correctAnswers.aggCol || aggColAnswer === '"车辆数"';
    const isFuncCorrect = funcAnswer === correctAnswers.aggFunc || funcAnswer === 'sum()';
    
    if (isColCorrect && isAggColCorrect && isFuncCorrect) {
        const data = getGroupedData('8:30');
        let html = '<table class="data-table"><thead><tr><th>区域类型</th><th>车辆数</th></tr></thead><tbody>';
        
        data.forEach(item => {
            html += `<tr>
                <td>${item.area}</td>
                <td>${item.count}</td>
            </tr>`;
        });
        
        html += '</tbody></table>';
        resultArea.innerHTML = html;
    } else {
        let hint = '请检查以下内容：\n';
        if (!isColCorrect) hint += '- 分组列名应为 "区域类型"\n';
        if (!isAggColCorrect) hint += '- 聚合列应为 "车辆数"\n';
        if (!isFuncCorrect) hint += '- 聚合函数应为 sum()';
        
        resultArea.innerHTML = `
            <div style="background:#FEE2E2;padding:16px;border-radius:8px;color:#991B1B;">
                <strong>⚠️ 代码错误</strong>
                <p style="white-space:pre-line;">${hint}</p>
            </div>
        `;
    }
}

function runSortCode() {
    const answer = document.getElementById('sort-answer').value.trim();
    const resultArea = document.getElementById('sort-result');
    
    if (answer === correctAnswers.sortAscending || answer === 'False' || answer === 'False') {
        const data = getSortedData('8:30');
        let html = '<table class="data-table"><thead><tr><th>区域类型</th><th>车辆数</th></tr></thead><tbody>';
        
        data.forEach((item, index) => {
            html += `<tr>
                <td>${item.area}</td>
                <td>${item.count}</td>
            </tr>`;
        });
        
        html += '</tbody></table>';
        html += `
            <div style="margin-top:16px;padding:16px;background:#D1FAE5;border-radius:8px;">
                <p><strong>车最多的区域为：</strong> ${data[0].area} (${data[0].count}辆)</p>
                <p><strong>车最少的区域为：</strong> ${data[data.length-1].area} (${data[data.length-1].count}辆)</p>
            </div>
        `;
        resultArea.innerHTML = html;
    } else {
        resultArea.innerHTML = `
            <div style="background:#FEE2E2;padding:16px;border-radius:8px;color:#991B1B;">
                <strong>⚠️ 代码错误</strong>
                <p>降序排列时，ascending参数应为 False</p>
            </div>
        `;
    }
}

function drawChart() {
    const xAnswer = document.getElementById('bar-x').value.trim();
    const yAnswer = document.getElementById('bar-y').value.trim();
    const chartArea = document.getElementById('chart-result');
    
    const isXCorrect = xAnswer.includes('区域类型') || xAnswer.includes('area');
    const isYCorrect = yAnswer.includes('车辆数') || yAnswer.includes('count');
    
    if (!isXCorrect || !isYCorrect) {
        chartArea.innerHTML = `
            <div style="background:#FEE2E2;padding:16px;border-radius:8px;color:#991B1B;">
                <strong>⚠️ 代码错误</strong>
                <p>x数据应为区域类型，y数据应为车辆数</p>
            </div>
            <canvas id="bikeChart"></canvas>
        `;
        return;
    }
    
    const data = getGroupedData('8:30');
    
    if (bikeChart) {
        bikeChart.destroy();
    }
    
    const ctx = document.getElementById('bikeChart').getContext('2d');
    bikeChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.map(d => d.area),
            datasets: [{
                label: '8:30各区域共享单车数量',
                data: data.map(d => d.count),
                backgroundColor: [
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(245, 158, 11, 0.8)',
                    'rgba(16, 185, 129, 0.8)'
                ],
                borderColor: [
                    'rgba(59, 130, 246, 1)',
                    'rgba(245, 158, 11, 1)',
                    'rgba(16, 185, 129, 1)'
                ],
                borderWidth: 2,
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: '8:30各区域共享单车数量对比',
                    font: {
                        size: 18,
                        weight: 'bold'
                    }
                },
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: '车辆数',
                        font: {
                            size: 14
                        }
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: '区域类型',
                        font: {
                            size: 14
                        }
                    }
                }
            }
        }
    });
}

function showSummary() {
    showView('summary-view');
}
