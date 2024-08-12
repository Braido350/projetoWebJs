let state = 'Welcome';

function getState() {
    return state;
}

function setState(newState) {
    state = newState;
}

module.exports = {
    getState,
    setState
};
