// analysis_chart.js
const ctx = document.getElementById('myChart').getContext('2d');

const itemLeft = selectedItems[0] || "項目１";
const itemRight = selectedItems[1] || "項目２";

const lineColors = [
  '#004488', // 濃いブルー
  '#D4A373', // 落ち着いたゴールド
  '#2A9D8F'  // 深みのあるミント
];
const barColors = [
  'rgba(142, 154, 175, 0.5)', // ニュアンスグレー
  'rgba(163, 177, 138, 0.5)', // セージグリーン
  'rgba(202, 210, 197, 0.5)'  // ライトグレー
];

new Chart(ctx, {
    type: 'bar',
    data: {
      labels: chartLabels,
      datasets: chartDatasets.map((ds, index) => {
        const isRightAxis = (selectedItems.length > 1 && ds.item === itemRight);
        const colorIndex = Math.floor(index / selectedItems.length) % 3;
        
        return {
          label: ds.label,
          data: ds.data,
          teamList: ds.teamList, // ★Pythonから届いたチーム名データを保持
          type: isRightAxis ? 'line' : 'bar',
          yAxisID: isRightAxis ? 'y1' : 'y',
          borderColor: isRightAxis ? lineColors[colorIndex]: 'transparent',
          backgroundColor: isRightAxis ? lineColors[colorIndex]: barColors[colorIndex],
          tension: 0.15,
          borderWidth: isRightAxis ? 4 : 0,
          pointRadius: isRightAxis ? 6 : 0,
          pointHoverRadius: 8,
          pointBackgroundColor: isRightAxis ? lineColors[colorIndex] : 'transparent',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          order: isRightAxis ? 1 : 2
        };
      })
    },
    options: {
        layout: { padding: { bottom: 20 } },
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
              grid: { display: false },
              ticks: { align: 'center', color: '#666666' },
              offset: true,
            },
            y: {
                type: 'linear',
                position: 'left',
                grace: '10%',
                border: { display: false },
                grid: { display: true, color: 'rgba(0,0,0, 0.05)' },
                title: { display: true, text: itemLeft, color: '#333333', font: { weight: 'bold' } }
            },
            y1: {
                type: 'linear',
                position: 'right',
                grace: '10%',
                display: selectedItems.length > 1,
                border: { display: false },
                grid: { display: false },
                title: { display: true, text: itemRight, color: '#333333', font: { weight: 'bold' } }
            }
        },
        plugins: {
            legend: {
                position: 'top',
                labels: { boxWidth: 15, font: { size: 12 } }
            },
            // ★ ツールチップ（吹き出し）の表示カスタムを追加
            tooltip: {
                callbacks: {
                    label: function(context) {
                        const dataset = context.dataset;
                        const dataIndex = context.dataIndex;
                        
                        // Pythonから届いたその年のチーム名を取得
                        const teamName = dataset.teamList ? dataset.teamList[dataIndex] : '';
                        
                        let label = dataset.label || '';
                        if (label) { label += ': '; }
                        if (context.parsed.y !== null) { label += context.parsed.y; }
                        
                        // チーム名があれば後ろにカッコで追加する
                        if (teamName) {
                            label += ` （${teamName}に所属）`;
                        }
                        return label;
                    }
                }
            }
        }
    } 
});