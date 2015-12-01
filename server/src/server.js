import Server from 'socket.io'

export default function startServer(store) {
    const io = new Server().attach(8090);

    store.subscribe(() => io.sockets.emit('state', store.getState().toJS()));

    io.on('connection', socket => {
        socket.emit('state', store.getState().toJS());
        socket.on('action', action => {
            action.id = socket.id;
            store.dispatch(action);
        });
    });
}
