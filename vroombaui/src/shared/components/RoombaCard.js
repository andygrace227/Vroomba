
function RoombaCard(props){

    let styleDict = {borderRadius:"25px"}

    if(props.style) {
        for(let s in props.style) {
            styleDict[s] = props.style[s];
        }
    }

    return (<div className="p-3 shadow my-3 bg-body" style={styleDict}>
        {props.children}
    </div>);


}

export default RoombaCard;