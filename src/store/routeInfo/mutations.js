export default {
    setRouteInfo (state, { path, fullPath }) {
        state.path = path;
        state.fullPath = fullPath;
    },
    setHomepage (state, { homepage }) {
        state.homepage = !!homepage;
    }
};
