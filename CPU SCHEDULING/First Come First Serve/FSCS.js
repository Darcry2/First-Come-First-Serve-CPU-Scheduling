function generateProcessInputs() {
    const processCount = document.getElementById('process-count').value;
    let html = '';

    for (let i = 1; i <= processCount; i++) {
        html += `
            <div class="form-row">
                <div class="form-group col-md-4">
                    <label for="arrival-time-${i}">Arrival Time for P${i}:</label>
                    <input type="number" class="form-control" id="arrival-time-${i}" placeholder="Enter arrival time">
                </div>
                <div class="form-group col-md-4">
                    <label for="burst-time-${i}">Burst Time for P${i}:</label>
                    <input type="number" class="form-control" id="burst-time-${i}" placeholder="Enter burst time">
                </div>
            </div>
        `;
    }

    document.getElementById('process-inputs').innerHTML = html;
}

function simulateFCFS() {
    const processCount = document.getElementById('process-count').value;
    let processes = [];
    let readyQueue = [];
    let ganttChart = [];
    let totalCompletionTime = 0;
    let totalTurnaroundTime = 0;
    let totalWaitingTime = 0;
    let totalResponseTime = 0;

    for (let i = 1; i <= processCount; i++) {
        const arrivalTime = parseInt(document.getElementById(`arrival-time-${i}`).value);
        const burstTime = parseInt(document.getElementById(`burst-time-${i}`).value);

        processes.push({ id: i, arrivalTime, burstTime });
    }

    processes.sort((a, b) => a.arrivalTime - b.arrivalTime);

    let completionTime = 0;

    const processResults = processes.map(process => {
        const startTime = Math.max(completionTime, process.arrivalTime);
        const responseTime = startTime - process.arrivalTime; // Calculate Response Time
        completionTime = startTime + process.burstTime;

        totalCompletionTime += completionTime;
        totalTurnaroundTime += completionTime - process.arrivalTime;
        totalWaitingTime += completionTime - process.arrivalTime - process.burstTime;
        totalResponseTime += responseTime;

        const turnaroundTime = completionTime - process.arrivalTime;
        const waitingTime = turnaroundTime - process.burstTime;

        const result = {
            id: `P${process.id}`,
            arrivalTime: process.arrivalTime,
            burstTime: process.burstTime,
            completionTime,
            turnaroundTime,
            waitingTime,
            responseTime,
        };

        readyQueue.push(result.id);
        ganttChart.push({ id: result.id, startTime, endTime: completionTime });

        return result;
    });

    const averageCompletionTime = totalCompletionTime / processCount;
    const averageTurnaroundTime = totalTurnaroundTime / processCount;
    const averageWaitingTime = totalWaitingTime / processCount;
    const averageResponseTime = totalResponseTime / processCount;

const ganttChartHtml = `
    <h4>Gantt Chart:</h4>
    <table class="table_Gant_Charrt w-25">
        <thead style="text-align: center;">
            <td>
                ${ganttChart.map(task => `<th style="border: 1px solid #ddd;">${task.id}</th>`).join('')}
            </td>
        </thead>
        <tbody>
            <td>
                ${ganttChart.map(task => `<td span="${task.endTime - task.startTime}">${task.startTime}</td>`).join('')}
                <td>${completionTime}</td> <!-- Add the completion time to the time scale -->
            </td>
        </tbody>
    </table>
`;


    const resultHtml = `
        <h4>Ready Queue: ${readyQueue.join(', ')}</h4>

        ${ganttChartHtml}

        <h4>Simulation Result:</h4>
        <table class="table" style="border: 1px solid #ddd;">
            <thead>
                <tr>
                    <th style="border: 1px solid #ddd; text-align: center;">Process</th>
                    <th style="border: 1px solid #ddd; text-align: center;">AT</th>
                    <th style="border: 1px solid #ddd; text-align: center;">BT</th>
                    <th style="border: 1px solid #ddd; text-align: center;">CT</th>
                    <th style="border: 1px solid #ddd; text-align: center;">TAT</th>
                    <th style="border: 1px solid #ddd; text-align: center;">WT</th>
                    <th style="border: 1px solid #ddd; text-align: center;">RT</th>
                </tr>
            </thead>
            <tbody>
                ${processResults.map(result => `
                    <tr>
                        <td style="border: 1px solid #ddd; text-align: center;">${result.id}</td>
                        <td style="border: 1px solid #ddd; text-align: center;">${result.arrivalTime}</td>
                        <td style="border: 1px solid #ddd; text-align: center;">${result.burstTime}</td>
                        <td style="border: 1px solid #ddd; text-align: center;">${result.completionTime}</td>
                        <td style="border: 1px solid #ddd; text-align: center;">${result.turnaroundTime}</td>
                        <td style="border: 1px solid #ddd; text-align: center;">${result.waitingTime}</td>
                        <td style="border: 1px solid #ddd; text-align: center;">${result.responseTime}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;

    const averagesHtml = `
    <h4>Averages:</h4>
    <ul>
        <li>Completion Time: ${averageCompletionTime.toFixed(2).replace(/\.?0+$/, '')} ms</li>
        <li>Turn Around Time: ${averageTurnaroundTime.toFixed(2).replace(/\.?0+$/, '')} ms</li>
        <li>Waiting Time: ${averageWaitingTime.toFixed(2).replace(/\.?0+$/, '')} ms</li>
        <li>Response Time: ${averageResponseTime.toFixed(2).replace(/\.?0+$/, '')} ms</li>
    </ul>
`;

    document.getElementById('result').innerHTML = resultHtml + averagesHtml;
}

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('process-count').addEventListener('input', generateProcessInputs);
});
