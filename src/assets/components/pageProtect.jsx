const pageProtect = () => {
    
    seEffect(() => {
        const blockContextMenu = (e) => {
            e.preventDefault();
        };

        // Add the listener when the component loads
        document.addEventListener('contextmenu', blockContextMenu);

        // Clean up the listener if the component goes away
        return () => {
            document.removeEventListener('contextmenu', blockContextMenu);
        };
    }, []);

    return (
        <div>
            Right-click is disabled everywhere on this page!
        </div>
    );
}

export default pageProtect
