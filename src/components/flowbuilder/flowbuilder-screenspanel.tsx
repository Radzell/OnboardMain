const ScreensPanel = () => {
    return (
        <>
            <div className="description">You can drag these screens to the pane on the left.</div>
            <div className="react-flow__node-input" onDragStart={(event) => onDragStart(event, 'entry')} draggable>
                Entry
            </div>
            <div className="react-flow__node-default" onDragStart={(event) => onDragStart(event, 'welcome')} draggable>
                Welcome Flow
            </div>
            <div className="react-flow__node-output" onDragStart={(event) => onDragStart(event, 'email_and_password')} draggable>
                Email and Password
            </div>
        </>
    )
}

export default ScreensPanel;