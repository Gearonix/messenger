import io from 'socket.io-client';
const socket = io('ws://localhost:8080');
window.socket = socket
export default socket