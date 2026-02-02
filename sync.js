const fs = require('fs');
const path = require('path');

const STATE_FILE = path.join(__dirname, 'agent-state.json');

const args = process.argv.slice(2);
const command = args[0];

if (!command) {
  console.log('Usage: node sync.js [add|log] [message/label]');
  process.exit(1);
}

const state = JSON.parse(fs.readFileSync(STATE_FILE, 'utf-8'));

if (command === 'add') {
  const label = args[1] || 'New Task';
  const newEl = {
    id: `node-${Date.now()}`,
    type: 'box',
    x: 200 + Math.random() * 500,
    y: 100 + Math.random() * 300,
    w: 150,
    h: 100,
    label: label,
    agent: 'Dolsoe',
    color: '#4040ff'
  };
  state.elements.push(newEl);
  
  // Auto-log
  state.logs.push({
    id: `log-${Date.now()}`,
    agent: 'Dolsoe',
    message: `Deployed node: ${label}`,
    type: 'success',
    timestamp: new Date().toLocaleTimeString('en-GB', { hour12: false })
  });
}

if (command === 'log') {
  const message = args[1] || 'Ping';
  state.logs.push({
    id: `log-${Date.now()}`,
    agent: 'Dolsoe',
    message: message,
    type: 'info',
    timestamp: new Date().toLocaleTimeString('en-GB', { hour12: false })
  });
}

// Keep last 15 elements and 20 logs
state.elements = state.elements.slice(-15);
state.logs = state.logs.slice(-20);

fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
console.log(`✅ State updated: ${command}`);
