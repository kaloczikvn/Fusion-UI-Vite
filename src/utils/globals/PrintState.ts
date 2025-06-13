window.PrintState = function () {
    /*
    // TODO: Modify it so it uses zustand instead
    console.log(store.getState());
    */
};

declare global {
    interface Window {
        PrintState: () => void;
    }
}
